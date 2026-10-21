document.getElementById('year').textContent = new Date().getFullYear();

  // Navbar scroll state (turns into a floating pill on desktop)
  const nav = document.getElementById('siteNav');
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 10);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile menu: full-width panel under the header, page scroll locked while open
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  function setHeaderH(){
    document.documentElement.style.setProperty('--hdr-h', Math.round(nav.getBoundingClientRect().bottom) + 'px');
  }
  function setMenu(open){
    if (open) setHeaderH();
    mobileMenu.classList.toggle('open', open);
    nav.classList.toggle('menu-open', open);
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
    hamburger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.style.overflow = open ? 'hidden' : '';
  }
  function closeMenu(){ setMenu(false); }
  hamburger.addEventListener('click', () => setMenu(!mobileMenu.classList.contains('open')));
  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
  window.addEventListener('resize', () => { if (window.innerWidth > 980) closeMenu(); else if (mobileMenu.classList.contains('open')) setHeaderH(); });

  // Scroll reveal
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.15 });
  revealEls.forEach(el => io.observe(el));

  // Process line + step activation
  const procTrack = document.getElementById('procTrack');
  const procLine = document.getElementById('procLine');
  const procSteps = document.querySelectorAll('.proc-step');
  const procIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting){
        procLine.classList.add('animate');
        procSteps.forEach((s, i) => setTimeout(() => s.classList.add('active'), i * 260));
        procIO.unobserve(procTrack);
      }
    });
  }, { threshold: 0.4 });
  procIO.observe(procTrack);

  // Solutions tabs
  const solTabs = document.querySelectorAll('.sol-tab');
  const solPanels = document.querySelectorAll('.sol-panel');
  solTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      solTabs.forEach(t => t.classList.remove('active'));
      solPanels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      document.querySelector('.sol-panel[data-i="' + tab.dataset.i + '"]').classList.add('active');
    });
  });

  // Contact form
  const form = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    success.classList.add('show');
    form.reset();
  });

/* ---------- CTA particle animation ---------- */
(function(){
  var section=document.getElementById('ctaHero');
  var grid=document.getElementById('ctaParticleGrid');
  if(!section||!grid) return;
  var rows=15, total=rows*rows, HUE=215;
  var reduce=window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  grid.style.width=grid.style.height=(rows*1.8)+'rem';
  var c=Math.floor(rows/2), parts=[];
  for(var i=0;i<total;i++){
    var r=Math.floor(i/rows), col=i%rows;
    var d=Math.sqrt(Math.pow(r-c,2)+Math.pow(col-c,2));
    var scale=Math.max(0.1,1.2-d*0.12), op=Math.max(0.05,1-d*0.1);
    var light=Math.max(15,75-d*6), glow=Math.max(0.5,6-d*0.5);
    var el=document.createElement('div');
    el.className='particle';
    el.style.cssText='width:.4rem;height:.4rem;left:'+(col*1.8)+'rem;top:'+(r*1.8)+'rem;'+
      'transform:scale('+scale+');opacity:'+op+';background:hsl('+HUE+',90%,'+light+'%);'+
      'box-shadow:0 0 '+(glow*0.2)+'rem 0 hsl('+HUE+',90%,60%);z-index:'+Math.round(total-d*5)+';'+
      'transition:transform '+(120+d*20)+'ms cubic-bezier(.25,.46,.45,.94) '+(d*8)+'ms;';
    grid.appendChild(el);
    parts.push({el:el,scale:scale,damp:Math.max(0.3,1-d*0.08)});
  }
  function move(x,y){
    for(var i=0;i<parts.length;i++){
      var p=parts[i];
      p.el.style.transform='translate('+(x*p.damp)+'px,'+(y*p.damp)+'px) scale('+p.scale+')';
    }
  }
  if(reduce){ move(0,0); return; }

  var start=Date.now(), auto=true, wobble=false, lastMove=Date.now();
  var stat={x:0,y:0}, visible=false, raf=null, t1=null, t2=null;

  function frame(){
    var t=(Date.now()-start)*0.001, x=0, y=0;
    if(auto){
      x=Math.sin(t*0.3)*200+Math.sin(t*0.17)*100;
      y=Math.cos(t*0.2)*150+Math.cos(t*0.23)*80;
      move(x,y);
    }else if(wobble){
      var idle=Date.now()-lastMove;
      if(idle>200){
        var k=Math.min((idle-200)/1000,1);
        move(stat.x+Math.sin(t*1.5)*20*k, stat.y+Math.cos(t*1.2)*16*k);
      }
    }
    raf=requestAnimationFrame(frame);
  }
  function onPointer(e){
    var ev=e.touches?e.touches[0]:e; if(!ev) return;
    var b=section.getBoundingClientRect();
    stat={x:(ev.clientX-(b.left+b.width/2))*0.8, y:(ev.clientY-(b.top+b.height/2))*0.8};
    move(stat.x,stat.y);
    auto=false; wobble=false; lastMove=Date.now();
    clearTimeout(t1); clearTimeout(t2);
    t1=setTimeout(function(){wobble=true;},500);
    t2=setTimeout(function(){
      if(Date.now()-lastMove>=4000){auto=true;wobble=false;start=Date.now();}
    },4000);
  }
  section.addEventListener('mousemove',onPointer,{passive:true});
  section.addEventListener('touchmove',onPointer,{passive:true});

  function run(on){
    if(on&&!raf){raf=requestAnimationFrame(frame);}
    else if(!on&&raf){cancelAnimationFrame(raf);raf=null;}
  }
  if('IntersectionObserver' in window){
    new IntersectionObserver(function(en){run(en[0].isIntersecting);}).observe(section);
  }else{ run(true); }
})();


/* ---------- Hero shader background (ported from ShaderBackground, "Mesh drift") ---------- */
(function(){
  var canvas=document.getElementById('heroShader');
  if(!canvas) return;
  var gl=canvas.getContext('webgl',{antialias:false});
  if(!gl){ canvas.style.display='none'; return; }

  var VERT='attribute vec2 a_position;\nvoid main() {\n  gl_Position = vec4(a_position, 0.0, 1.0);\n}';
  var FRAG=`#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec3 u_colors[8];
uniform vec4 u_scene;
uniform vec4 u_shape;
uniform vec4 u_surface;
uniform vec4 u_finish;
uniform vec4 u_transform;
uniform vec4 u_space;
uniform vec4 u_cursor;

#define u_resolution u_scene.xy
#define u_time u_scene.z
#define u_colorCount u_scene.w
#define u_scale u_shape.x
#define u_intensity u_shape.y
#define u_paramA u_shape.z
#define u_warp u_shape.w
#define u_detail u_surface.x
#define u_contrast u_surface.y
#define u_brightness u_surface.z
#define u_saturation u_surface.w
#define u_hue u_finish.x
#define u_vignette u_finish.y
#define u_blur u_finish.z
#define u_grain u_finish.w
#ifdef GL_FRAGMENT_PRECISION_HIGH
#define u_seed u_transform.x
#else
#define u_seed mod(u_transform.x, 31.0)
#endif
#define u_rotate u_transform.y
#define u_drift u_transform.z
#define u_oklab u_transform.w
#define u_offset u_space.xy
#define u_mouse u_space.zw
#define u_cursorPresence u_cursor.x
#define u_cursorEffect u_cursor.y
#define u_cursorStrength u_cursor.z
#define u_cursorRadius u_cursor.w

float hash21(vec2 p) {
#ifndef GL_FRAGMENT_PRECISION_HIGH
  p = mod(p, 31.0);
#endif
  p = fract(p * vec2(234.34, 435.345));
  p += dot(p, p + 34.23);
  return fract(p.x * p.y);
}

float grainHash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash21(i), hash21(i + vec2(1.0, 0.0)), u.x),
    mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), u.x),
    u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = p * 2.03 + vec2(17.0, 9.2);
    a *= 0.5;
  }
  return v;
}

vec3 srgbToLinear(vec3 c) {
  return mix(c / 12.92, pow((c + 0.055) / 1.055, vec3(2.4)),
    step(0.04045, c));
}
vec3 linearToSrgb(vec3 c) {
  return mix(c * 12.92, 1.055 * pow(max(c, vec3(0.0)), vec3(1.0 / 2.4)) - 0.055,
    step(0.0031308, c));
}
vec3 linToOklab(vec3 c) {
  float l = 0.4122214708 * c.r + 0.5363325363 * c.g + 0.0514459929 * c.b;
  float m = 0.2119034982 * c.r + 0.6806995451 * c.g + 0.1073969566 * c.b;
  float s = 0.0883024619 * c.r + 0.2817188376 * c.g + 0.6299787005 * c.b;
  l = pow(max(l, 0.0), 1.0 / 3.0);
  m = pow(max(m, 0.0), 1.0 / 3.0);
  s = pow(max(s, 0.0), 1.0 / 3.0);
  return vec3(
    0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s);
}
vec3 oklabToLin(vec3 c) {
  float l = c.x + 0.3963377774 * c.y + 0.2158037573 * c.z;
  float m = c.x - 0.1055613458 * c.y - 0.0638541728 * c.z;
  float s = c.x - 0.0894841775 * c.y - 1.2914855480 * c.z;
  l = l * l * l; m = m * m * m; s = s * s * s;
  return vec3(
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s);
}
vec3 mixColour(vec3 a, vec3 b, float t) {
  if (u_oklab > 0.5) {
    vec3 la = linToOklab(srgbToLinear(a));
    vec3 lb = linToOklab(srgbToLinear(b));
    return clamp(linearToSrgb(oklabToLin(mix(la, lb, t))), 0.0, 1.0);
  }
  return mix(a, b, t);
}

vec3 hueRotate(vec3 col, float a) {
  const mat3 toYIQ = mat3(0.299, 0.596, 0.211,
                          0.587, -0.274, -0.523,
                          0.114, -0.322, 0.312);
  const mat3 toRGB = mat3(1.0, 1.0, 1.0,
                          0.956, -0.272, -1.106,
                          0.621, -0.647, 1.703);
  vec3 yiq = toYIQ * col;
  float ca = cos(a), sa = sin(a);
  yiq = vec3(yiq.x, yiq.y * ca - yiq.z * sa, yiq.y * sa + yiq.z * ca);
  return toRGB * yiq;
}

vec3 shade(vec2 uv, vec2 p, float t) {
  vec3 acc = u_colors[0] * 0.15;
  float total = 0.15;
  for (int i = 0; i < 8; i++) {
    if (float(i) >= u_colorCount) break;
    float fi = float(i);
    vec2 c = vec2(
      sin(t * (0.21 + fi * 0.071) + fi * 2.4 + u_seed),
      cos(t * (0.17 + fi * 0.093) + fi * 1.7)) * (0.45 + u_intensity * 0.35);
    float w = exp(-dot(p - c, p - c) * 6.0);
    acc += u_colors[i] * w;
    total += w;
  }
  return acc / total;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 screenUv = uv;
  vec2 p = (gl_FragCoord.xy - 0.5 * u_resolution.xy)
    / min(u_resolution.x, u_resolution.y);
  float cursorMask = 0.0;

  if (u_cursorPresence > 0.001) {
    vec2 cursor = (0.5 * u_mouse * u_resolution.xy)
      / min(u_resolution.x, u_resolution.y);
    vec2 cursorDelta = p - cursor;
    if (u_cursorEffect < 0.5) {
      p += cursor * u_cursorPresence * u_cursorStrength * 0.55;
    } else {
      float cursorDistance = length(cursorDelta);
      vec2 cursorDirection = cursorDelta / max(cursorDistance, 0.0001);
      cursorMask = u_cursorPresence
        * (1.0 - smoothstep(0.0, u_cursorRadius, cursorDistance));
      if (u_cursorEffect < 1.5) {
        p -= cursorDirection * cursorMask * u_cursorStrength * 0.24;
      } else if (u_cursorEffect < 2.5) {
        float cursorAngle = cursorMask * u_cursorStrength * 2.2;
        float cc = cos(cursorAngle), cs = sin(cursorAngle);
        p = cursor + mat2(cc, -cs, cs, cc) * cursorDelta;
      } else if (u_cursorEffect < 3.5) {
        float ripple = sin(
          cursorDistance / max(u_cursorRadius, 0.001) * 18.0 - u_time * 5.0);
        p -= cursorDirection * ripple * cursorMask * u_cursorStrength * 0.07;
      }
    }
  }

  uv = p * min(u_resolution.x, u_resolution.y) / u_resolution.xy + 0.5;
  p *= u_scale;
  if (abs(u_rotate) > 0.0001) {
    float cr = cos(u_rotate), sr = sin(u_rotate);
    p = mat2(cr, -sr, sr, cr) * p;
  }
  p += u_offset;
  if (u_drift > 0.0001)
    p += u_drift * vec2(sin(u_time * 0.31), cos(u_time * 0.23));
  if (u_warp > 0.0) {
    p += u_warp * (vec2(
      fbm(p * u_detail + u_seed),
      fbm(p * u_detail + vec2(5.2, 1.3))) - 0.5);
  }
  vec3 col;
  if (u_blur > 0.0) {
    float e = u_blur;
    float pe = e * u_scale;
    vec2 uvE = vec2(e) * min(u_resolution.x, u_resolution.y) / u_resolution.xy;
    col  = shade(uv, p, u_time) * 0.36;
    col += shade(uv + vec2(uvE.x, 0.0), p + vec2(pe, 0.0), u_time) * 0.16;
    col += shade(uv - vec2(uvE.x, 0.0), p - vec2(pe, 0.0), u_time) * 0.16;
    col += shade(uv + vec2(0.0, uvE.y), p + vec2(0.0, pe), u_time) * 0.16;
    col += shade(uv - vec2(0.0, uvE.y), p - vec2(0.0, pe), u_time) * 0.16;
  } else {
    col = shade(uv, p, u_time);
  }
  if (abs(u_contrast - 1.0) > 0.0001)
    col = (col - 0.5) * u_contrast + 0.5;
  if (abs(u_saturation - 1.0) > 0.0001) {
    float luma = dot(col, vec3(0.299, 0.587, 0.114));
    col = mix(vec3(luma), col, u_saturation);
  }
  if (abs(u_hue) > 0.0001)
    col = hueRotate(col, u_hue);
  if (abs(u_brightness) > 0.0001)
    col += u_brightness;
  if (u_vignette > 0.0001) {
    float vd = length(screenUv - 0.5) * 1.41421356;
    col *= 1.0 - u_vignette * smoothstep(0.35, 1.0, vd);
  }
  if (u_cursorPresence > 0.001 && u_cursorEffect > 3.5)
    col += (vec3(0.18) + col * 0.12) * cursorMask * u_cursorStrength;
  if (u_grain > 0.0001)
    col += (grainHash(
      gl_FragCoord.xy + vec2(u_seed * 17.0, u_seed * 31.0)) - 0.5) * u_grain;
  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`;

  var U={
    colors:[[0.02,0.06,0.16],[0.05,0.22,0.55],[0.184,0.525,1],[0.03,0.12,0.35],[0.20,0.45,0.85],[0.02,0.06,0.16],[0.02,0.06,0.16],[0.02,0.06,0.16]],
    colorCount:5, scale:0.8, intensity:0.1, paramA:0.28, warp:0, detail:1.824,
    contrast:1.05, brightness:0, saturation:1.15, hue:6.2832, vignette:0,
    blur:0.02, grain:0, seed:9913, rotate:0, offsetX:0.78, offsetY:0.51,
    drift:0, cursorEffect:0, cursorStrength:0.78, cursorRadius:0.678,
    oklab:1, timeScale:0.67
  };

  function compile(type,src){
    var sh=gl.createShader(type);
    gl.shaderSource(sh,src); gl.compileShader(sh);
    if(!gl.getShaderParameter(sh,gl.COMPILE_STATUS)) console.warn('Hero shader compile error:',gl.getShaderInfoLog(sh));
    return sh;
  }
  var program=gl.createProgram();
  var vs=compile(gl.VERTEX_SHADER,VERT), fs=compile(gl.FRAGMENT_SHADER,FRAG);
  gl.attachShader(program,vs); gl.attachShader(program,fs); gl.linkProgram(program);
  if(!gl.getProgramParameter(program,gl.LINK_STATUS)){ console.warn('Hero shader link error:',gl.getProgramInfoLog(program)); canvas.style.display='none'; return; }
  gl.deleteShader(vs); gl.deleteShader(fs); gl.useProgram(program);

  var buf=gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER,buf);
  gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
  var loc=gl.getAttribLocation(program,'a_position');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);

  var uni={};
  ['colors','scene','shape','surface','finish','transform','space','cursor'].forEach(function(n){
    uni[n]=gl.getUniformLocation(program,n==='colors'?'u_colors':'u_'+n);
  });
  gl.uniform3fv(uni.colors,new Float32Array([].concat.apply([],U.colors)));
  gl.uniform4f(uni.shape,U.scale,U.intensity,U.paramA,U.warp);
  gl.uniform4f(uni.surface,U.detail,U.contrast,U.brightness,U.saturation);
  gl.uniform4f(uni.finish,U.hue,U.vignette,U.blur,U.grain);
  gl.uniform4f(uni.transform,U.seed,U.rotate,U.drift,U.oklab);

  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var targetX=0,targetY=0,targetPresence=0,mouseX=0,mouseY=0,presence=0;
  var pointerKnown=false,px=0,py=0,bounds=canvas.getBoundingClientRect();
  var raf=0,lastNow=null,visible=document.visibilityState==='visible',inView=true;
  var start=performance.now();

  function resizeCanvas(){
    var dpr=Math.min(window.devicePixelRatio||1,2);
    var rw=Math.max(1,Math.round(bounds.width*dpr)), rh=Math.max(1,Math.round(bounds.height*dpr));
    var ps=Math.min(1,Math.sqrt(2000000/Math.max(1,rw*rh)));
    var w=Math.max(1,Math.round(rw*ps)), h=Math.max(1,Math.round(rh*ps));
    if(canvas.width!==w||canvas.height!==h){ canvas.width=w; canvas.height=h; gl.viewport(0,0,w,h); }
  }
  function requestRender(){ if(visible&&inView&&raf===0) raf=requestAnimationFrame(render); }
  function updatePointer(){
    if(!pointerKnown||bounds.width===0||bounds.height===0) return;
    var inside=px>=bounds.left&&px<=bounds.right&&py>=bounds.top&&py<=bounds.bottom;
    if(!inside){ targetPresence=0; requestRender(); return; }
    var nx=((px-bounds.left)/bounds.width)*2-1, ny=-(((py-bounds.top)/bounds.height)*2-1);
    if(targetPresence===0&&presence<0.01){ mouseX=nx; mouseY=ny; }
    targetX=nx; targetY=ny; targetPresence=1; requestRender();
  }
  function onMove(e){ pointerKnown=true; px=e.clientX; py=e.clientY; bounds=canvas.getBoundingClientRect(); updatePointer(); }
  function onLeave(){ pointerKnown=false; targetPresence=0; requestRender(); }
  function updateLayout(){ bounds=canvas.getBoundingClientRect(); resizeCanvas(); updatePointer(); requestRender(); }

  window.addEventListener('resize',updateLayout);
  window.addEventListener('pointermove',onMove,{passive:true});
  window.addEventListener('pointercancel',onLeave);
  window.addEventListener('scroll',updateLayout,true);
  window.addEventListener('blur',onLeave);
  document.documentElement.addEventListener('pointerleave',onLeave);
  if('ResizeObserver' in window) new ResizeObserver(updateLayout).observe(canvas);
  if('IntersectionObserver' in window){
    new IntersectionObserver(function(en){
      inView=en[0]?en[0].isIntersecting:true;
      if(inView) requestRender(); else if(raf!==0){ cancelAnimationFrame(raf); raf=0; lastNow=null; }
    }).observe(canvas);
  }
  document.addEventListener('visibilitychange',function(){
    visible=document.visibilityState==='visible';
    if(visible) requestRender(); else if(raf!==0){ cancelAnimationFrame(raf); raf=0; lastNow=null; }
  });

  function render(now){
    raf=0;
    if(!visible||!inView) return;
    var dt=lastNow===null?0:Math.min((now-lastNow)/1000,0.1);
    lastNow=now;
    var follow=1-Math.exp(-12*dt);
    mouseX+=(targetX-mouseX)*follow; mouseY+=(targetY-mouseY)*follow; presence+=(targetPresence-presence)*follow;
    resizeCanvas();
    var t=reduce?0:((now-start)/1000)*U.timeScale;
    gl.uniform4f(uni.scene,canvas.width,canvas.height,t,U.colorCount);
    gl.uniform4f(uni.space,U.offsetX,U.offsetY,mouseX,mouseY);
    gl.uniform4f(uni.cursor,presence,U.cursorEffect,U.cursorStrength,U.cursorRadius);
    gl.drawArrays(gl.TRIANGLES,0,3);
    var settling=Math.abs(targetX-mouseX)>0.001||Math.abs(targetY-mouseY)>0.001||Math.abs(targetPresence-presence)>0.001;
    if(!reduce||settling) requestRender(); else lastNow=null;
  }
  updateLayout();
})();

/* ---------- YL Developers project marquee ---------- */
(function(){
  /* EDIT THIS LIST: project names shown in the moving strip (right to left) */
  var YL_PROJECTS=['V Mart','Nexora Digi Solutions'];
  var track=document.getElementById('ylTrack');
  if(!track||!YL_PROJECTS.length) return;
  function group(hidden){
    var g=document.createElement('div'); g.className='yl-group';
    if(hidden) g.setAttribute('aria-hidden','true');
    for(var r=0;r<Math.max(2,Math.ceil(8/YL_PROJECTS.length));r++){
      YL_PROJECTS.forEach(function(n){
        var i=document.createElement('span'); i.className='yl-item'; i.textContent=n; g.appendChild(i);
      });
    }
    return g;
  }
  track.appendChild(group(false));
  track.appendChild(group(true));
})();


/* ---------- Hero faded photo (mobile / tablet) ---------- */
(function(){
  var el=document.getElementById('heroBgPhoto'), img=document.querySelector('.hero-photo-frame img');
  if(!el||!img||!img.src) return;
  el.style.backgroundImage='linear-gradient(180deg,rgba(5,9,18,.82) 0%,rgba(5,9,18,.93) 100%),url("'+img.src+'")';
})();

/* ---------- Ratings & Reviews ---------- */
(function(){
  /* 1) Owner-curated reviews shown on the site. Add real client reviews here:
        {rating:5, name:'Client Name', company:'Company', text:'Their review text', date:'2026-09-01'} */
  var NEXORA_REVIEWS=[];

  /* 2) Shared visitor ratings (optional). Fill in your Firebase web config to collect
        ratings from all visitors. Leave blank to keep ratings in the visitor's own browser only. */
  var FIREBASE={
  apiKey:'AIzaSyCfv54S1FL9ofyd9muz9PK_Eba4FYPTTyU',
  projectId:'nexora-digi-solutions',
  collection:'ratings'
};

  var LABELS=['','Poor','Fair','Good','Very good','Excellent'];
  var STAR='<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3 6.1 20.6l1.3-6.6L2.5 9.4l6.6-.8L12 2.5z"/></svg>';
  var $=function(id){return document.getElementById(id);};
  var fbOn=!!(FIREBASE.apiKey&&FIREBASE.projectId);
  var LS='nexoraRatingsLocal';
  var remote=[], local=[];
  try{ local=JSON.parse(localStorage.getItem(LS)||'[]'); }catch(e){ local=[]; }

  function esc(t){ var d=document.createElement('div'); d.textContent=t==null?'':String(t); return d.innerHTML; }
  function starsInto(el,val){
    var five=new Array(6).join(STAR), pct=Math.max(0,Math.min(5,val))/5*100;
    el.innerHTML='<span class="st-bg">'+five+'</span><span class="st-fg" style="width:'+pct+'%"><span>'+five+'</span></span>';
  }
  function all(){ return NEXORA_REVIEWS.concat(remote,local).filter(function(r){return r&&r.rating>=1&&r.rating<=5;}); }

  function render(){
    var list=all(), n=list.length, sum=0;
    list.forEach(function(r){ sum+=r.rating; });
    var avg=n?sum/n:0, avgTxt=n?avg.toFixed(1):'\u2013';
    starsInto($('rvStripStars'),avg);
    $('rvStripText').innerHTML=n?('<strong>'+avgTxt+'</strong> out of 5 \u00b7 based on '+n+' client rating'+(n===1?'':'s')):'Client ratings';
    $('rvStripLink').textContent=n?'Rate Nexora':'Be the first to rate us';

    /* written reviews list */
    var withText=list.filter(function(r){return r.text&&String(r.text).trim();}).slice().sort(function(a,b){return String(b.date||'').localeCompare(String(a.date||''));});
    var box=$('rvList'), empty=$('rvEmpty');
    if(box){
      box.innerHTML=withText.map(function(r){
        var nm=r.name||'Client', ini=esc(nm.trim().charAt(0).toUpperCase()||'C');
        return '<article class="rv-card"><span class="stars" style="--sz:16px" data-v="'+r.rating+'"></span>'+
          '<p class="rv-text">\u201c'+esc(r.text)+'\u201d</p>'+
          '<div class="rv-by"><span class="rv-av">'+ini+'</span><div><div class="rv-name">'+esc(nm)+'</div>'+
          (r.company?'<div class="rv-co">'+esc(r.company)+'</div>':'')+'</div></div></article>';
      }).join('');
      [].forEach.call(box.querySelectorAll('.stars'),function(el){ starsInto(el,+el.getAttribute('data-v')); });
      box.style.display=withText.length?'grid':'none';
      empty.style.display=withText.length?'none':'block';
    }
  }

  /* ---- load shared ratings (approved only) ---- */
  function fv(f,k){ var o=f&&f[k]; if(!o) return null; return o.stringValue!==undefined?o.stringValue:(o.integerValue!==undefined?parseInt(o.integerValue,10):(o.doubleValue!==undefined?o.doubleValue:(o.timestampValue||null))); }
  function load(){
    if(!fbOn||!window.fetch) return;
    var url='https://firestore.googleapis.com/v1/projects/'+encodeURIComponent(FIREBASE.projectId)+'/databases/(default)/documents:runQuery?key='+encodeURIComponent(FIREBASE.apiKey);
    fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({structuredQuery:{
      from:[{collectionId:FIREBASE.collection}],
      where:{fieldFilter:{field:{fieldPath:'approved'},op:'EQUAL',value:{booleanValue:true}}},limit:100}})})
    .then(function(r){return r.json();})
    .then(function(rows){
      remote=(rows||[]).filter(function(x){return x.document;}).map(function(x){
        var f=x.document.fields||{};
        return {rating:fv(f,'rating'),name:fv(f,'name'),company:fv(f,'company'),text:fv(f,'message'),date:fv(f,'createdAt')};
      });
      render();
    }).catch(function(){});
  }

  /* ---- star picker ---- */
  var value=0, pick=$('rvPick');
  for(var i=1;i<=5;i++){
    var b=document.createElement('button');
    b.type='button'; b.setAttribute('role','radio'); b.setAttribute('aria-checked','false'); b.setAttribute('aria-label',i+' star'+(i>1?'s':'')); b.dataset.v=i; b.innerHTML=STAR;
    pick.appendChild(b);
  }
  var btns=[].slice.call(pick.children);
  function paint(v,preview){
    btns.forEach(function(x){ x.classList.toggle('on',+x.dataset.v<=v); });
    $('rvPickLabel').textContent=v?LABELS[v]:'Tap a star to rate';
    if(!preview) btns.forEach(function(x){ x.setAttribute('aria-checked',(+x.dataset.v===value)?'true':'false'); });
  }
  function setVal(v){ value=v; paint(v); }
  btns.forEach(function(x){
    x.addEventListener('click',function(){ setVal(+x.dataset.v); });
    x.addEventListener('mouseenter',function(){ paint(+x.dataset.v,true); });
    x.addEventListener('keydown',function(e){
      var v=+x.dataset.v;
      if(e.key==='ArrowRight'||e.key==='ArrowUp'){ e.preventDefault(); setVal(Math.min(5,v+1)); btns[Math.min(4,v)].focus(); }
      if(e.key==='ArrowLeft'||e.key==='ArrowDown'){ e.preventDefault(); setVal(Math.max(1,v-1)); btns[Math.max(0,v-2)].focus(); }
    });
  });
  pick.addEventListener('mouseleave',function(){ paint(value); });

  /* ---- submit ---- */
  var form=$('rvForm'), err=$('rvErr'), ok=$('rvOk');
  function showErr(m){ err.textContent=m; err.classList.add('show'); ok.classList.remove('show'); }
  function handleRating(e){
    if(e&&e.preventDefault) e.preventDefault();
    err.classList.remove('show');
    if($('rvHp').value) return;
    if(!value) return showErr('Please choose a star rating.');
    var name=$('rvName').value.trim();
    if(!name) return showErr('Please enter your name.');
    var rec={rating:value,name:name,company:$('rvCompany').value.trim(),text:$('rvText').value.trim(),date:new Date().toISOString()};
    var btn=$('rvSubmit'); btn.disabled=true;
    function done(msg){
      btn.disabled=false; form.reset(); setVal(0);
      $('rvOkText').textContent=msg; ok.classList.add('show');
    }
    if(fbOn&&window.fetch){
      var url='https://firestore.googleapis.com/v1/projects/'+encodeURIComponent(FIREBASE.projectId)+'/databases/(default)/documents/'+encodeURIComponent(FIREBASE.collection)+'?key='+encodeURIComponent(FIREBASE.apiKey);
      fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({fields:{
        rating:{integerValue:String(rec.rating)},name:{stringValue:rec.name},company:{stringValue:rec.company},
        message:{stringValue:rec.text},approved:{booleanValue:false},createdAt:{timestampValue:rec.date}}})})
      .then(function(r){ if(!r.ok) throw new Error('bad'); done('Thank you! Your rating has been received and will appear once it is reviewed.'); })
      .catch(function(){ btn.disabled=false; showErr('Sorry, we could not submit your rating right now. Please try again.'); });
    }else{
      local.push(rec);
      try{ localStorage.setItem(LS,JSON.stringify(local)); }catch(x){}
      render();
      done('Thank you for your rating! (Preview mode: it is saved in this browser only until shared ratings are connected.)');
    }
  }
  /* click handler (works even where form submission is blocked, e.g. sandboxed previews) */
  $('rvSubmit').addEventListener('click',handleRating);
  form.addEventListener('submit',handleRating);
  [$('rvName'),$('rvCompany')].forEach(function(inp){ inp.addEventListener('keydown',function(e){ if(e.key==='Enter') handleRating(e); }); });

  render(); load();
})();

/* ---------- Our Work: V Mart link (managed from admin.html) ---------- */
(function(){
  var DEFAULT_LINK='https://vmart-afad3.web.app/';   /* fallback link; the admin page can override it once Firebase is connected */
  var FB={apiKey:'',projectId:'',docPath:'siteSettings/work'};  /* same Firebase details as admin.html */
  var LS='nexoraWorkLink';
  var a=document.getElementById('vmartLink'); if(!a) return;
  function safe(u){ try{ var x=new URL(String(u||'').trim()); return (x.protocol==='https:'||x.protocol==='http:')?x.href:''; }catch(e){ return ''; } }
  function apply(u){
    u=safe(u);
    if(u){ a.href=u; a.target='_blank'; a.classList.remove('is-off'); a.removeAttribute('aria-disabled'); a.textContent='Visit V Mart website'; }
    else { a.href='#work'; a.removeAttribute('target'); a.classList.add('is-off'); a.setAttribute('aria-disabled','true'); a.textContent='Link coming soon'; }
  }
  apply(DEFAULT_LINK);
  if(FB.apiKey&&FB.projectId&&window.fetch){
    fetch('https://firestore.googleapis.com/v1/projects/'+encodeURIComponent(FB.projectId)+'/databases/(default)/documents/'+FB.docPath+'?key='+encodeURIComponent(FB.apiKey))
      .then(function(r){ return r.ok?r.json():null; })
      .then(function(d){ var f=d&&d.fields&&d.fields.vmartLink; if(f&&f.stringValue!==undefined) apply(f.stringValue); })
      .catch(function(){});
  } else {
    try{ var l=localStorage.getItem(LS); if(l) apply(l); }catch(e){}
  }
})();
