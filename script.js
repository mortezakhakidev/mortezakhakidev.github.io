(function(){var t=document.querySelector('.nav-toggle');var l=document.getElementById('nav-links');if(!t||!l)return;function setState(open){l.classList.toggle('open',open);t.setAttribute('aria-expanded',open?'true':'false');t.setAttribute('aria-label',open?'Close menu':'Open menu');t.textContent=open?'✕':'☰';document.body.style.overflow=open?'hidden':'';}
t.addEventListener('click',function(){setState(!l.classList.contains('open'));});
l.addEventListener('click',function(e){if(e.target.closest('a')){setState(false);}});
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&l.classList.contains('open')){setState(false);}});
window.addEventListener('resize',function(){if(window.innerWidth>768&&l.classList.contains('open')){setState(false);}});})();

/* snippet: header.center-stack-reveal */
document.querySelectorAll('[data-snippet="header.center-stack-reveal"]').forEach((root) => {
  if (root.__csrvBound) return;
  root.__csrvBound = true;

  const play = () => {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        root.setAttribute('data-csrv-state', 'in');
      });
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', play, { once: true });
  } else {
    play();
  }
});

/* motion runtime: viewportOnce */
(function () {
  if (window.__mMotionReady) return;
  window.__mMotionReady = true;
  const targets = Array.from(document.querySelectorAll('[data-motion]'));
  if (targets.length === 0) return;
  if (!('IntersectionObserver' in window)) {
    targets.forEach((target) => target.classList.add('is-visible'));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });
  targets.forEach((target) => observer.observe(target));
})();

/* motion: button-bubble-rise */
(function () {
  const hosts = document.querySelectorAll('[data-motion~="button-bubble-rise"]');
  if (!hosts.length) return;
  hosts.forEach((host) => {
    if (host.dataset.bbrReady) return;
    host.dataset.bbrReady = '1';
    const label = (host.textContent || '').trim();
    if (!label) return;
    host.textContent = '';
    const frame = document.createElement('span');
    frame.className = 'bbr__label';
    const front = document.createElement('span');
    front.className = 'bbr__text';
    front.textContent = label;
    const shadow = document.createElement('span');
    shadow.className = 'bbr__text bbr__text--shadow';
    shadow.setAttribute('aria-hidden', 'true');
    shadow.textContent = label;
    frame.appendChild(front);
    frame.appendChild(shadow);
    host.appendChild(frame);
  });
})();

/* motion: link-arrow-reveal */
(function () {
  const hosts = document.querySelectorAll('[data-motion~="link-arrow-reveal"]');
  if (!hosts.length) return;
  hosts.forEach((host) => {
    if (host.dataset.larReady) return;
    host.dataset.larReady = '1';
    const text = (host.textContent || '').trim();
    if (!text) return;
    host.textContent = '';
    const icon = document.createElement('span');
    icon.className = 'lar__icon';
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = '→';
    const label = document.createElement('span');
    label.className = 'lar__label';
    label.textContent = text;
    host.append(icon, label);
  });
})();

(function(){
  var nav = document.querySelector('.m-nav');
  if (!nav) return;
  var stickyGap = 12;
  var managedHeaderTargets = [];

  function getFirstHeader() {
    var first = nav.nextElementSibling;
    if (!first || !first.matches('[data-section="header"], [data-section="hero"]')) return null;
    return first;
  }

  function isExcludedHeaderTarget(element) {
    if (element.matches && element.matches('[data-page-overlay], [data-crh-curtain]')) return true;
    return false;
  }

  function restoreManagedHeaderTargets() {
    managedHeaderTargets.forEach(function(target){
      target.element.style.height = target.height;
      target.element.style.minHeight = target.minHeight;
    });
    managedHeaderTargets = [];
  }

  function rememberHeaderTarget(element) {
    if (managedHeaderTargets.some(function(target){ return target.element === element; })) return;
    managedHeaderTargets.push({
      element: element,
      height: element.style.height,
      minHeight: element.style.minHeight
    });
  }

  function addHeaderTarget(targets, element, applyHeight, applyMinHeight) {
    if (!element || targets.some(function(target){ return target.element === element; })) return;
    if (isExcludedHeaderTarget(element)) return;
    targets.push({ element: element, height: Boolean(applyHeight), minHeight: Boolean(applyMinHeight) });
  }

  function getHeaderTargets(first) {
    var targets = [];
    var rootNeedsFixedHeight = first.matches('[data-nav-aware-height]');
    addHeaderTarget(targets, first, rootNeedsFixedHeight, true);
    first.querySelectorAll('[data-nav-aware-viewport]').forEach(function(element){
      var minOnly = element.getAttribute('data-nav-aware-viewport') === 'min';
      addHeaderTarget(targets, element, !minOnly, true);
    });
    return targets;
  }

  function getNavMetrics() {
    var navStyle = window.getComputedStyle(nav);
    var navPosition = navStyle.position;
    var navHeight = nav.getBoundingClientRect().height;
    return {
      height: navHeight,
      consumesSpace: navPosition !== 'fixed' && navPosition !== 'absolute',
      overlaysViewport: navPosition === 'fixed' || navPosition === 'sticky' || navPosition === 'absolute'
    };
  }

  function applyNavAwareHeaderHeight(metrics) {
    restoreManagedHeaderTargets();
    var first = getFirstHeader();
    if (!first) return;
    var navHeight = metrics.consumesSpace ? metrics.height : 0;
    var viewportHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;
    var availableHeight = Math.max(0, Math.round(viewportHeight - navHeight));
    getHeaderTargets(first).forEach(function(target){
      rememberHeaderTarget(target.element);
      if (target.minHeight) target.element.style.minHeight = availableHeight + 'px';
      if (target.height) target.element.style.height = availableHeight + 'px';
    });
  }

  function applyStickyOffsets(metrics) {
    var navTop = metrics.overlaysViewport && metrics.height > 0 ? metrics.height + stickyGap : 0;
    document.querySelectorAll('[data-sticky-under-nav]').forEach(function(element){
      element.style.top = '';
      var style = window.getComputedStyle(element);
      if (style.position !== 'sticky') return;
      var baseTop = parseFloat(style.top);
      if (!Number.isFinite(baseTop)) return;
      var safeTop = navTop > 0 ? Math.max(baseTop, navTop) : baseTop;
      element.style.top = Math.round(safeTop) + 'px';
    });
  }

  function applyNavAwareLayout() {
    var metrics = getNavMetrics();
    applyNavAwareHeaderHeight(metrics);
    applyStickyOffsets(metrics);
  }

  applyNavAwareLayout();
  window.addEventListener('resize', applyNavAwareLayout, { passive: true });
  if (window.visualViewport) window.visualViewport.addEventListener('resize', applyNavAwareLayout, { passive: true });
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(applyNavAwareLayout).catch(function(){});
  }
  if (window.ResizeObserver) {
    new ResizeObserver(applyNavAwareLayout).observe(nav);
  }
})();