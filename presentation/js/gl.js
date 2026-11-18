/* SECNA talk — WebGL2 renderer.
 * Particles (instanced rounded boxes / soft blobs) and light lines, drawn additively into an HDR
 * buffer, then bloom (13-tap down / tent up), then a composite pass: night-sky background,
 * faint nebula, bloom, soft tone curve, vignette, grain.
 * Coordinates are "stage" coordinates: x 0..1920 → right, y 0..1080 → down, z → towards the viewer.
 * With the default camera the z = 0 plane maps 1:1 onto the 1920 × 1080 stage, so DOM text and
 * particles line up.
 */
(function () {
  'use strict';
  const W = 1920, H = 1080, FOV = 38 * Math.PI / 180;
  const D = (H / 2) / Math.tan(FOV / 2);           // reference camera distance
  const STRIDE_P = 10, STRIDE_L = 11;

  const QUAD = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
  const SEGQ = new Float32Array([0, -1, 1, -1, 0, 1, 1, 1]);

  const VS_P = `#version 300 es
  precision highp float;
  layout(location=0) in vec2 aC;
  layout(location=1) in vec3 aPos;
  layout(location=2) in vec2 aSize;
  layout(location=3) in vec4 aCol;
  layout(location=4) in float aShape;
  uniform mat4 uVP; uniform vec2 uView; uniform float uScale; uniform float uRef; uniform float uFocus; uniform float uDof;
  out vec2 vL; out vec2 vHalf; out vec4 vCol; out float vShape; out float vSoft;
  void main(){
    vec4 c = uVP * vec4(aPos.x - 960.0, 540.0 - aPos.y, aPos.z, 1.0);
    if (c.w < 5.0 || aCol.a <= 0.002) { gl_Position = vec4(3.0, 3.0, 3.0, 1.0); return; }
    float persp = uRef / c.w;
    vec2 sz = aSize * uScale * persp;
    vec2 szc = max(sz, vec2(1.3 * uScale));
    float fade = clamp((sz.x * sz.y) / (szc.x * szc.y), 0.0, 1.0);
    // depth of field: away from the focal plane a particle grows into a soft disc of the same energy
    // shape: 0..1 rounded box · 1..1.9 soft blob · 2 crisp disc that ignores depth of field (stars)
    float crisp = step(1.95, aShape);
    float coc = min(abs(c.w - uFocus) * uDof * uScale, 28.0 * uScale) * (1.0 - crisp);
    vec2 szd = szc + vec2(coc);
    float energy = (szc.x * szc.y) / (szd.x * szd.y);
    float soft = max(step(1.0, aShape) * (1.0 - crisp), smoothstep(1.5, 6.0, coc / uScale));
    vec2 hs = szd * 0.5 + mix(vec2(1.0), szd * 0.5, soft);
    vec2 off = aC * hs;
    c.xy += off / (uView * 0.5) * c.w;
    gl_Position = c;
    vL = off; vHalf = szd * 0.5; vCol = vec4(aCol.rgb, aCol.a * fade * mix(1.0, energy, 0.8)); vShape = aShape; vSoft = soft;
  }`;
  const FS_P = `#version 300 es
  precision highp float;
  in vec2 vL; in vec2 vHalf; in vec4 vCol; in float vShape; in float vSoft;
  uniform float uAdd;
  out vec4 o;
  void main(){
    vec2 q = vL / vHalf;
    float g = exp(-dot(q, q) * 2.2);           // soft disc (veils, out-of-focus particles)
    float r = min(vShape, 1.0) * min(vHalf.x, vHalf.y);   // rounded box: 0 = square, 1 = disc
    vec2 b = abs(vL) - (vHalf - r);
    float d = length(max(b, 0.0)) + min(max(b.x, b.y), 0.0) - r;
    float a = mix(clamp(0.5 - d, 0.0, 1.0), g * 1.6, vSoft) * vCol.a;
    o = vec4(vCol.rgb * a, a * (1.0 - uAdd));
  }`;
  const VS_L = `#version 300 es
  precision highp float;
  layout(location=0) in vec2 aC;
  layout(location=1) in vec3 aA;
  layout(location=2) in vec3 aB;
  layout(location=3) in vec4 aCol;
  layout(location=4) in float aW;
  uniform mat4 uVP; uniform vec2 uView; uniform float uScale;
  out float vX; out float vHW; out vec4 vCol;
  vec4 P(vec3 p){ return uVP * vec4(p.x - 960.0, 540.0 - p.y, p.z, 1.0); }
  void main(){
    vec4 ca = P(aA), cb = P(aB);
    if (ca.w < 5.0 || cb.w < 5.0 || aCol.a <= 0.002) { gl_Position = vec4(3.0, 3.0, 3.0, 1.0); return; }
    vec2 sa = ca.xy / ca.w * uView * 0.5, sb = cb.xy / cb.w * uView * 0.5;
    vec2 d = sb - sa; float len = length(d); vec2 dir = len > 0.001 ? d / len : vec2(1.0, 0.0);
    vec2 n = vec2(-dir.y, dir.x);
    float hw = aW * uScale * 0.5 + 1.0;
    float t = aC.x;
    vec4 c = mix(ca, cb, t);
    vec2 s = mix(sa, sb, t) + n * aC.y * hw + dir * (t * 2.0 - 1.0) * hw;
    gl_Position = vec4(s / (uView * 0.5) * c.w, c.z, c.w);
    vX = aC.y * hw; vHW = aW * uScale * 0.5; vCol = aCol;
  }`;
  const FS_L = `#version 300 es
  precision highp float;
  in float vX; in float vHW; in vec4 vCol;
  uniform float uAdd;
  out vec4 o;
  void main(){
    float a = clamp(vHW + 0.5 - abs(vX), 0.0, 1.0) * vCol.a;
    o = vec4(vCol.rgb * a, a * (1.0 - uAdd));
  }`;
  const VS_Q = `#version 300 es
  layout(location=0) in vec2 aC;
  out vec2 vUv;
  void main(){ vUv = aC * 0.5 + 0.5; gl_Position = vec4(aC, 0.0, 1.0); }`;
  // 13-tap downsample (Jimenez 2014); the first pass also applies a soft knee
  const FS_DOWN = `#version 300 es
  precision highp float;
  in vec2 vUv; uniform sampler2D uTex; uniform vec2 uTexel; uniform float uKnee; out vec4 o;
  vec3 S(vec2 d){ return texture(uTex, vUv + d * uTexel).rgb; }
  void main(){
    vec3 a=S(vec2(-2,2)),b=S(vec2(0,2)),c=S(vec2(2,2)),d=S(vec2(-2,0)),e=S(vec2(0,0)),f=S(vec2(2,0)),
         g=S(vec2(-2,-2)),h=S(vec2(0,-2)),i=S(vec2(2,-2)),j=S(vec2(-1,1)),k=S(vec2(1,1)),l=S(vec2(-1,-1)),m=S(vec2(1,-1));
    vec3 col = e*0.125 + (a+c+g+i)*0.03125 + (b+d+f+h)*0.0625 + (j+k+l+m)*0.125;
    if (uKnee > 0.0) { float br = max(col.r, max(col.g, col.b)); col *= clamp((br - 0.05) / uKnee, 0.0, 1.0); }
    o = vec4(col, 1.0);
  }`;
  const FS_UP = `#version 300 es
  precision highp float;
  in vec2 vUv; uniform sampler2D uTex; uniform vec2 uTexel; uniform float uK; out vec4 o;
  vec3 S(vec2 d){ return texture(uTex, vUv + d * uTexel).rgb; }
  void main(){
    vec3 col = S(vec2(0,0))*4.0 + (S(vec2(-1,0))+S(vec2(1,0))+S(vec2(0,-1))+S(vec2(0,1)))*2.0
             + S(vec2(-1,-1))+S(vec2(1,-1))+S(vec2(-1,1))+S(vec2(1,1));
    o = vec4(col / 16.0 * uK, 1.0);
  }`;
  const FS_COMP = `#version 300 es
  precision highp float;
  in vec2 vUv; out vec4 o;
  uniform sampler2D uScene, uBloom;
  uniform float uBloomK, uExposure, uVig, uGrain, uTime, uNeb, uAspect;
  uniform vec3 uBg0, uBg1, uNebA, uNebB;
  uniform vec2 uPar;
  uvec3 pcg(uvec3 v){ v = v * 1664525u + 1013904223u; v.x += v.y * v.z; v.y += v.z * v.x; v.z += v.x * v.y;
    v ^= v >> 16u; v.x += v.y * v.z; v.y += v.z * v.x; v.z += v.x * v.y; return v; }
  float h21(vec2 p){ return float(pcg(uvec3(ivec3(ivec2(floor(p)) + 32768, 7))).x & 0xFFFFu) / 65535.0; }
  float h3(vec2 p, float k){ return float(pcg(uvec3(uvec2(p), uint(k))).x & 0xFFFFu) / 65535.0; }
  float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
    return mix(mix(h21(i), h21(i+vec2(1,0)), f.x), mix(h21(i+vec2(0,1)), h21(i+vec2(1,1)), f.x), f.y); }
  float fbm(vec2 p){ float s = 0.0, a = 0.5; for (int k = 0; k < 5; k++) { s += a * vn(p); p = p * 2.03 + 17.1; a *= 0.5; } return s; }
  void main(){
    vec2 uv = vUv;
    vec2 cp = (uv - 0.5) * vec2(uAspect, 1.0);
    float r = length(cp);
    vec3 bg = mix(uBg0, uBg1, smoothstep(0.0, 1.05, r));
    if (uNeb > 0.001) {
      vec2 q = cp * 1.6 + uPar + vec2(uTime * 0.004, -uTime * 0.002);
      float n1 = fbm(q * 1.3), n2 = fbm(q * 2.7 + 5.2);
      float m = smoothstep(0.42, 0.95, n1) * (0.55 + 0.45 * n2);
      bg += mix(uNebA, uNebB, smoothstep(0.3, 0.75, n2)) * m * uNeb;
    }
    vec3 sc = texture(uScene, uv).rgb;
    vec3 bl = texture(uBloom, uv).rgb;
    vec3 c = bg + (sc + bl * uBloomK) * uExposure;
    // soft shoulder that keeps hues, then a touch of white for over-exposed light
    float l = max(c.r, max(c.g, c.b));
    if (l > 0.72) { float nl = 0.72 + 0.28 * (1.0 - exp(-(l - 0.72) / 0.28)); c *= nl / l; c = mix(c, vec3(nl), clamp((l - 1.0) * 0.18, 0.0, 0.5)); }
    c *= 1.0 - uVig * smoothstep(0.35, 1.0, r);
    c += (h3(gl_FragCoord.xy, floor(uTime * 24.0)) - 0.5) * uGrain;
    o = vec4(clamp(c, 0.0, 1.0), 1.0);
  }`;

  function compile(gl, type, src) {
    const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) + '\n' + src);
    return s;
  }
  function program(gl, vs, fs) {
    const p = gl.createProgram();
    gl.attachShader(p, compile(gl, gl.VERTEX_SHADER, vs)); gl.attachShader(p, compile(gl, gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
    const u = {}; const nu = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < nu; i++) { const info = gl.getActiveUniform(p, i); u[info.name] = gl.getUniformLocation(p, info.name); }
    return { p, u };
  }

  /* ---------- camera ---------- */
  // state: {x, y, z} target in stage coordinates, yaw/pitch/roll in degrees, zoom (1 = default distance)
  function camera(st) {
    const yaw = st.yaw * Math.PI / 180, pitch = st.pitch * Math.PI / 180, roll = (st.roll || 0) * Math.PI / 180;
    const tx = st.x - 960, ty = 540 - st.y, tz = st.z;
    const dist = D * st.zoom;
    const fx = Math.sin(yaw) * Math.cos(pitch), fy = Math.sin(pitch), fz = Math.cos(yaw) * Math.cos(pitch);
    const ex = tx + fx * dist, ey = ty + fy * dist, ez = tz + fz * dist;
    // basis: zc = from target to eye; xc = up × zc; yc = zc × xc
    let zx = fx, zy = fy, zz = fz;
    let ux = Math.sin(roll), uy = Math.cos(roll), uz = 0;
    let xx = uy * zz - uz * zy, xy = uz * zx - ux * zz, xz = ux * zy - uy * zx;
    const xl = Math.hypot(xx, xy, xz) || 1; xx /= xl; xy /= xl; xz /= xl;
    const yx = zy * xz - zz * xy, yy = zz * xx - zx * xz, yz = zx * xy - zy * xx;
    const view = [xx, yx, zx, 0, xy, yy, zy, 0, xz, yz, zz, 0,
      -(xx * ex + xy * ey + xz * ez), -(yx * ex + yy * ey + yz * ez), -(zx * ex + zy * ey + zz * ez), 1];
    const f = 1 / Math.tan(FOV / 2), near = 20, far = 40000, a = W / H;
    const proj = [f / a, 0, 0, 0, 0, f, 0, 0, 0, 0, (far + near) / (near - far), -1, 0, 0, 2 * far * near / (near - far), 0];
    const vp = new Float32Array(16);
    for (let c = 0; c < 4; c++) for (let r = 0; r < 4; r++) {
      let s = 0; for (let k = 0; k < 4; k++) s += proj[k * 4 + r] * view[c * 4 + k]; vp[c * 4 + r] = s;
    }
    // lens shift: the target appears at (960 + sx, 540 + sy) instead of the centre of the stage
    const shx = st.sx || 0, shy = st.sy || 0, kx = 2 * shx / W, ky = -2 * shy / H;
    for (let c = 0; c < 4; c++) { vp[c * 4] += kx * vp[c * 4 + 3]; vp[c * 4 + 1] += ky * vp[c * 4 + 3]; }
    return { vp, eye: [ex, ey, ez], xc: [xx, xy, xz], yc: [yx, yy, yz], zc: [zx, zy, zz],
      // stage point → screen px; d = depth from the eye (scale = D / d)
      project(x, y, z, out) {
        const wx = x - 960, wy = 540 - y, wz = z;
        const cx = vp[0] * wx + vp[4] * wy + vp[8] * wz + vp[12], cy = vp[1] * wx + vp[5] * wy + vp[9] * wz + vp[13];
        const cw = vp[3] * wx + vp[7] * wy + vp[11] * wz + vp[15];
        out.x = (cx / cw * 0.5 + 0.5) * W; out.y = (1 - (cy / cw * 0.5 + 0.5)) * H; out.d = cw; out.s = D / cw; return out;
      },
      // screen px at a depth from the eye → stage point
      unproject(sx, sy, depth, out) {
        const t = Math.tan(FOV / 2), vx = ((sx - shx) / W * 2 - 1) * t * a, vy = (1 - (sy - shy) / H * 2) * t;
        const wx = ex + (xx * vx + yx * vy - zx) * depth, wy = ey + (xy * vx + yy * vy - zy) * depth, wz = ez + (xz * vx + yz * vy - zz) * depth;
        out.x = wx + 960; out.y = 540 - wy; out.z = wz; return out;
      } };
  }

  function create(canvas) {
    const gl = canvas.getContext('webgl2', { antialias: false, alpha: false, depth: false, premultipliedAlpha: false, preserveDrawingBuffer: true, powerPreference: 'high-performance' });
    if (!gl) throw new Error('WebGL2 is not available');
    const hdr = !!gl.getExtension('EXT_color_buffer_float');
    gl.getExtension('OES_texture_float_linear');
    const IF = hdr ? gl.RGBA16F : gl.RGBA8, TY = hdr ? gl.HALF_FLOAT : gl.UNSIGNED_BYTE;

    const P = program(gl, VS_P, FS_P), L = program(gl, VS_L, FS_L);
    const DOWN = program(gl, VS_Q, FS_DOWN), UP = program(gl, VS_Q, FS_UP), COMP = program(gl, VS_Q, FS_COMP);

    const quadBuf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf); gl.bufferData(gl.ARRAY_BUFFER, QUAD, gl.STATIC_DRAW);
    const segBuf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, segBuf); gl.bufferData(gl.ARRAY_BUFFER, SEGQ, gl.STATIC_DRAW);
    const pBuf = gl.createBuffer(), lBuf = gl.createBuffer();

    const vaoP = gl.createVertexArray(); gl.bindVertexArray(vaoP);
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf); gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, pBuf);
    [[1, 3, 0], [2, 2, 3], [3, 4, 5], [4, 1, 9]].forEach(([loc, n, off]) => {
      gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, n, gl.FLOAT, false, STRIDE_P * 4, off * 4); gl.vertexAttribDivisor(loc, 1); });
    const vaoL = gl.createVertexArray(); gl.bindVertexArray(vaoL);
    gl.bindBuffer(gl.ARRAY_BUFFER, segBuf); gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, lBuf);
    [[1, 3, 0], [2, 3, 3], [3, 4, 6], [4, 1, 10]].forEach(([loc, n, off]) => {
      gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, n, gl.FLOAT, false, STRIDE_L * 4, off * 4); gl.vertexAttribDivisor(loc, 1); });
    const vaoQ = gl.createVertexArray(); gl.bindVertexArray(vaoQ);
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf); gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.bindVertexArray(null);

    function target(w, h) {
      const tex = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, IF, w, h, 0, gl.RGBA, TY, null);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      const fb = gl.createFramebuffer(); gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
      return { tex, fb, w, h };
    }
    let bw = 0, bh = 0, scene = null, mips = [];
    function resize(w, h) {
      if (w === bw && h === bh) return;
      bw = w; bh = h; canvas.width = w; canvas.height = h;
      [scene, ...mips].forEach(t => { if (t) { gl.deleteTexture(t.tex); gl.deleteFramebuffer(t.fb); } });
      scene = target(w, h); mips = [];
      let mw = w, mh = h;
      for (let i = 0; i < 6; i++) { mw = Math.max(1, mw >> 1); mh = Math.max(1, mh >> 1); mips.push(target(mw, mh)); }
    }

    function draw(f) {
      // f: {cam, parts (Float32Array), np, lines, nl, add, bloom, exposure, vig, grain, time, neb, nebA, nebB, bg0, bg1, par}
      const scale = bw / W;
      gl.bindFramebuffer(gl.FRAMEBUFFER, scene.fb); gl.viewport(0, 0, bw, bh);
      gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
      gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      if (f.nl > 0) {
        gl.useProgram(L.p); gl.uniformMatrix4fv(L.u.uVP, false, f.cam.vp); gl.uniform2f(L.u.uView, bw, bh);
        gl.uniform1f(L.u.uScale, scale); gl.uniform1f(L.u.uAdd, f.add);
        gl.bindVertexArray(vaoL); gl.bindBuffer(gl.ARRAY_BUFFER, lBuf);
        gl.bufferData(gl.ARRAY_BUFFER, f.lines.subarray(0, f.nl * STRIDE_L), gl.DYNAMIC_DRAW);
        gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, f.nl);
      }
      gl.useProgram(P.p); gl.uniformMatrix4fv(P.u.uVP, false, f.cam.vp); gl.uniform2f(P.u.uView, bw, bh);
      gl.uniform1f(P.u.uScale, scale); gl.uniform1f(P.u.uRef, D); gl.uniform1f(P.u.uAdd, f.add);
      gl.uniform1f(P.u.uFocus, f.focus || D); gl.uniform1f(P.u.uDof, f.dof || 0);
      gl.bindVertexArray(vaoP); gl.bindBuffer(gl.ARRAY_BUFFER, pBuf);
      gl.bufferData(gl.ARRAY_BUFFER, f.parts.subarray(0, f.np * STRIDE_P), gl.DYNAMIC_DRAW);
      gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, f.np);
      gl.disable(gl.BLEND);

      // bloom: down the chain, then back up, adding
      gl.bindVertexArray(vaoQ);
      gl.useProgram(DOWN.p); gl.uniform1i(DOWN.u.uTex, 0); gl.activeTexture(gl.TEXTURE0);
      let src = scene;
      mips.forEach((m, i) => {
        gl.bindFramebuffer(gl.FRAMEBUFFER, m.fb); gl.viewport(0, 0, m.w, m.h);
        gl.bindTexture(gl.TEXTURE_2D, src.tex); gl.uniform2f(DOWN.u.uTexel, 1 / src.w, 1 / src.h);
        gl.uniform1f(DOWN.u.uKnee, i === 0 ? 0.5 : 0.0);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); src = m;
      });
      gl.useProgram(UP.p); gl.uniform1i(UP.u.uTex, 0); gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE);
      for (let i = mips.length - 1; i > 0; i--) {
        const lo = mips[i], hi = mips[i - 1];
        gl.bindFramebuffer(gl.FRAMEBUFFER, hi.fb); gl.viewport(0, 0, hi.w, hi.h);
        gl.bindTexture(gl.TEXTURE_2D, lo.tex); gl.uniform2f(UP.u.uTexel, 1 / lo.w, 1 / lo.h); gl.uniform1f(UP.u.uK, 1.0);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }
      gl.disable(gl.BLEND);

      gl.bindFramebuffer(gl.FRAMEBUFFER, null); gl.viewport(0, 0, bw, bh);
      gl.useProgram(COMP.p);
      gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, scene.tex); gl.uniform1i(COMP.u.uScene, 0);
      gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, mips[0].tex); gl.uniform1i(COMP.u.uBloom, 1);
      gl.uniform1f(COMP.u.uBloomK, f.bloom); gl.uniform1f(COMP.u.uExposure, f.exposure); gl.uniform1f(COMP.u.uVig, f.vig);
      gl.uniform1f(COMP.u.uGrain, f.grain); gl.uniform1f(COMP.u.uTime, f.time); gl.uniform1f(COMP.u.uNeb, f.neb);
      gl.uniform1f(COMP.u.uAspect, W / H);
      gl.uniform3fv(COMP.u.uBg0, f.bg0); gl.uniform3fv(COMP.u.uBg1, f.bg1);
      gl.uniform3fv(COMP.u.uNebA, f.nebA); gl.uniform3fv(COMP.u.uNebB, f.nebB); gl.uniform2fv(COMP.u.uPar, f.par);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindVertexArray(null);
    }
    return { resize, draw, hdr };
  }

  window.SGL = { create, camera, W, H, D, FOV, STRIDE_P, STRIDE_L };
})();
