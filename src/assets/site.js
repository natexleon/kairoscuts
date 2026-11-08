(function(){
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Header gains a dark blur once the page scrolls; the hero photo drifts slightly (home only)
  var header = document.getElementById('siteHeader');
  var heroBg = document.getElementById('heroBg');
  function onScroll(){
    header.classList.toggle('scrolled', window.scrollY > 40);
    if (heroBg && !reduceMotion && window.scrollY < window.innerHeight * 1.2) {
      heroBg.style.transform = 'translateY(' + (window.scrollY * 0.22) + 'px)';
    }
  }
  window.addEventListener('scroll', onScroll, { passive:true });
  onScroll();

  // Scroll reveals
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){ if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    document.querySelectorAll('.rv').forEach(function(el){ io.observe(el); });
  } else {
    document.querySelectorAll('.rv').forEach(function(el){ el.classList.add('in'); });
  }

  // Rails: pagination dots follow the snapped card; tapping a dot scrolls to that card
  function railStep(rail){
    var items = rail.children;
    return items.length > 1 ? items[1].offsetLeft - items[0].offsetLeft : rail.clientWidth;
  }
  function scrollRailTo(rail, item){
    rail.scrollTo({ left: item.offsetLeft - parseFloat(getComputedStyle(rail).paddingLeft), behavior: reduceMotion ? 'auto' : 'smooth' });
  }
  document.querySelectorAll('[data-dots]').forEach(function(dots){
    var rail = document.getElementById(dots.getAttribute('data-dots'));
    if (!rail) return;
    var items = rail.children;
    for (var i = 0; i < items.length; i++) {
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.setAttribute('aria-label', 'Show ' + (items[i].getAttribute('data-label') || 'card ' + (i + 1) + ' of ' + items.length));
      dot.addEventListener('click', scrollRailTo.bind(null, rail, items[i]));
      dots.appendChild(dot);
    }
    function sync(){
      var idx = Math.round(rail.scrollLeft / railStep(rail));
      if (rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 4) idx = items.length - 1;
      for (var j = 0; j < dots.children.length; j++) {
        if (j === idx) dots.children[j].setAttribute('aria-current', 'true');
        else dots.children[j].removeAttribute('aria-current');
      }
    }
    rail.addEventListener('scroll', sync, { passive:true });
    sync();
  });

  // Reviews — "03 / 10" position counter, arrows scroll by one card and wrap at the ends
  var track = document.getElementById('revTrack');
  if (track) {
    var revIdx = document.getElementById('revIdx');
    var pad2 = function(n){ return (n < 10 ? '0' : '') + n; };
    document.getElementById('revTotal').textContent = pad2(track.children.length);
    var revCurrent = function(){
      if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 4) return track.children.length - 1;
      return Math.round(track.scrollLeft / railStep(track));
    };
    var syncRevCount = function(){ revIdx.textContent = pad2(revCurrent() + 1); };
    track.addEventListener('scroll', syncRevCount, { passive:true });
    syncRevCount();

    // Rapid taps queue up: while an arrow scroll is still animating, step from its target rather than the mid-scroll position
    var revTarget = 0, revBusyUntil = 0;
    var stepReview = function(dir){
      var n = track.children.length;
      var from = Date.now() < revBusyUntil ? revTarget : revCurrent();
      revTarget = (from + dir + n) % n;
      revBusyUntil = Date.now() + 600;
      scrollRailTo(track, track.children[revTarget]);
    };
    document.getElementById('revNext').addEventListener('click', function(){ stepReview(1); });
    document.getElementById('revPrev').addEventListener('click', function(){ stepReview(-1); });
  }

  // Work gallery — thin progress bar under the swipeable cards
  var workRail = document.getElementById('workRail');
  var workThumb = document.getElementById('workThumb');
  if (workRail && workThumb) {
    var syncWorkThumb = function(){
      var max = workRail.scrollWidth - workRail.clientWidth;
      var share = workRail.clientWidth / workRail.scrollWidth;
      workThumb.style.width = (share * 100) + '%';
      workThumb.style.transform = 'translateX(' + (max > 0 ? (workRail.scrollLeft / max) * (1 / share - 1) * 100 : 0) + '%)';
    };
    workRail.addEventListener('scroll', syncWorkThumb, { passive:true });
    window.addEventListener('resize', syncWorkThumb);
    syncWorkThumb();
  }

  // Instagram — phones show four tiles until "View more" reveals the rest
  var igMore = document.getElementById('igMore');
  if (igMore) {
    igMore.addEventListener('click', function(){
      var grid = document.getElementById('igGrid');
      grid.classList.add('expanded');
      igMore.hidden = true;
      grid.children[4].focus();
    });
  }

  // Conversion events. Nothing is sent unless an analytics tag (gtag or a GTM dataLayer) is installed on the page.
  // Booking clicks are outbound clicks to Fresha, not confirmed bookings.
  function clickType(a){
    var href = a.getAttribute('href') || '';
    if (href.indexOf('fresha.com') !== -1) return 'booking_click';
    if (href.indexOf('tel:') === 0) return 'phone_click';
    if (href.indexOf('google.com/maps') !== -1) return 'directions_click';
    if (href.indexOf('mailto:') === 0) return 'email_click';
    if (href.indexOf('instagram.com') !== -1) return 'instagram_click';
    return null;
  }
  document.addEventListener('click', function(e){
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    var type = clickType(a);
    if (!type) return;
    var section = a.closest('[data-section]');
    var params = {
      link_text: (a.getAttribute('data-track-label') || a.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 80),
      page_section: section ? section.getAttribute('data-section') : 'unknown',
      page_path: location.pathname
    };
    if (typeof window.gtag === 'function') window.gtag('event', type, params);
    else if (Array.isArray(window.dataLayer)) window.dataLayer.push(Object.assign({ event: type }, params));
  });
})();
