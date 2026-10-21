/* Our Work — animated project stack (vanilla port of animated-testimonials) */
(function(){
  'use strict';

  /* ADD MORE PROJECTS HERE. Per project: tag, name, desc, chips[], and either `src` (image URL),
     `art:'vmart'`, or `art:'hero'`; with no art a branded initials card is used.
     `link:true` shows the V Mart button (its URL is managed by the "Our Work: V Mart link" script). */
  var PROJECTS=[
    {tag:'Retail \u00b7 Web App', name:'V Mart', art:'vmart', link:true,
     desc:'An online grocery shopping website for V Mart supermarket in Tumakuru, Karnataka, with a full shop, cart and checkout flow and Cash on Delivery.',
     chips:['Online shop','Cart & checkout','Cash on Delivery']},
    {tag:'Corporate \u00b7 Website', name:'Nexora Digi Solutions', art:'hero',
     desc:'The company website you are viewing now: a responsive corporate site presenting our ERP, automation and digital platform services, with contact and client ratings built in.',
     chips:['Responsive design','Contact form','Client ratings']}
  ];

  var root=document.getElementById('wkRoot'); if(!root) return;
  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var stack=document.getElementById('wkStack'), text=document.getElementById('wkText'),
      count=document.getElementById('wkCount'), prev=document.getElementById('wkPrev'), next=document.getElementById('wkNext'),
      link=document.getElementById('vmartLink');
  var items=PROJECTS.filter(Boolean), n=items.length, active=0, cards=[];
  if(!n) return;
  function rot(){ return Math.floor(Math.random()*21)-10; }
  var rots=items.map(rot);
  function esc(t){ var d=document.createElement('div'); d.textContent=t==null?'':String(t); return d.innerHTML; }
  function initials(s){ return String(s||'?').trim().split(/\s+/).slice(0,2).map(function(w){return w.charAt(0).toUpperCase();}).join(''); }
  var CART='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>';

  function artFor(p){
    var wrap=document.createElement('div');
    if(p.src||p.art==='hero'){
      var src=p.src;
      if(!src){ var h=document.querySelector('.hero-photo-frame img'); src=h&&h.src; }
      if(src){
        var img=document.createElement('img'); img.alt=p.name+' preview'; img.draggable=false; img.src=src; img.loading='lazy';
        img.addEventListener('error',function(){ wrap.innerHTML=''; wrap.appendChild(initialsArt(p)); });
        wrap.appendChild(img); return wrap;
      }
    }
    wrap.appendChild(p.art==='vmart'?vmartArt(p):initialsArt(p));
    return wrap;
  }
  function vmartArt(p){ var d=document.createElement('div'); d.className='wk-art'; d.innerHTML=CART+'<strong>'+esc(p.name)+'</strong><span>Tumakuru \u00b7 Karnataka</span>'; return d; }
  function initialsArt(p){ var d=document.createElement('div'); d.className='wk-art'; d.innerHTML='<strong>'+esc(initials(p.name))+'</strong><span>'+esc(p.name)+'</span>'; return d; }

  items.forEach(function(p,i){
    var c=document.createElement('div'); c.className='wk-card';
    var art=artFor(p); while(art.firstChild) c.appendChild(art.firstChild);
    c.addEventListener('click',function(){ if(i!==active) go(i); });
    stack.appendChild(c); cards.push(c);
  });

  function pose(){
    cards.forEach(function(c,i){
      var on=i===active;
      c.style.opacity=on?1:.7;
      c.style.zIndex=on?999:n+2-i;
      c.style.transform=on?'rotate(0deg) scale(1)':'rotate('+rots[i]+'deg) scale(.95)';
      c.setAttribute('aria-hidden',on?'false':'true');
    });
  }
  function renderText(){
    var p=items[active];
    var words=String(p.desc||'').split(' ').map(function(w,i){
      return '<span class="wk-w" style="animation-delay:'+(0.02*i).toFixed(2)+'s">'+esc(w)+'&nbsp;</span>';
    }).join('');
    var chips=(p.chips||[]).map(function(c){ return '<span>'+esc(c)+'</span>'; }).join('');
    text.innerHTML='<span class="work-tag">'+esc(p.tag)+'</span><h3 class="wk-name">'+esc(p.name)+'</h3>'+
      '<p class="wk-desc">'+words+'</p>'+(chips?'<div class="work-chips">'+chips+'</div>':'');
    text.classList.remove('wk-in'); void text.offsetWidth; text.classList.add('wk-in');
    count.textContent=('0'+(active+1)).slice(-2)+' / '+('0'+n).slice(-2);
    if(link) link.hidden=!p.link;
  }
  function go(i){
    var was=active; active=(i+n)%n;
    if(active===was) return;
    rots[was]=rot(); pose(); renderText(); start();
    if(!reduce&&cards[active].animate){
      var b='rotate(0deg) scale(1)';
      cards[active].animate([{transform:'translateY(0) '+b},{transform:'translateY(-80px) '+b},{transform:'translateY(0) '+b}],
        {duration:400,easing:'ease-in-out'});
    }
  }
  prev.addEventListener('click',function(){ go(active-1); });
  next.addEventListener('click',function(){ go(active+1); });
  if(n<2) document.getElementById('wkNav').style.display='none';

  root.addEventListener('keydown',function(e){
    if(e.key==='ArrowLeft'){ e.preventDefault(); go(active-1); }
    else if(e.key==='ArrowRight'){ e.preventDefault(); go(active+1); }
  });
  var sx=null;
  stack.addEventListener('pointerdown',function(e){ sx=e.clientX; });
  stack.addEventListener('pointerup',function(e){ if(sx===null) return; var dx=e.clientX-sx; sx=null; if(Math.abs(dx)>45) go(active+(dx<0?1:-1)); });
  stack.addEventListener('pointercancel',function(){ sx=null; });

  /* Auto-advance every 3 seconds. Pauses while the mouse is over the panel, while a keyboard
     user is focused inside it, when the tab is hidden, or when the panel is off-screen. */
  var AUTOPLAY_MS=3000, timer=null, visible=false, hold=false;
  function stop(){ if(timer){ clearInterval(timer); timer=null; } }
  function start(){
    stop();
    if(n>1&&!reduce&&visible&&!hold&&!document.hidden){
      timer=setInterval(function(){ go(active+1); },AUTOPLAY_MS);
    }
  }
  root.addEventListener('pointerenter',function(e){ if(e.pointerType==='mouse'){ hold=true; stop(); } });
  root.addEventListener('pointerleave',function(e){ if(e.pointerType==='mouse'){ hold=false; start(); } });
  root.addEventListener('focusin',function(e){ if(e.target.matches&&e.target.matches(':focus-visible')){ hold=true; stop(); } });
  root.addEventListener('focusout',function(){ hold=false; start(); });
  document.addEventListener('visibilitychange',start);
  if('IntersectionObserver' in window){
    new IntersectionObserver(function(es){ visible=es[0].isIntersecting; start(); },{threshold:0.35}).observe(root);
  } else { visible=true; start(); }

  pose(); renderText();
})();
