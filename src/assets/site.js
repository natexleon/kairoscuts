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
    if (href.indexOf('fresha.com') !== -1 || href.indexOf('acuityscheduling.com') !== -1) return 'booking_click';
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

(function () {
  var open = document.getElementById('openApplication');
  var dialog = document.getElementById('barberApplication');
  var form = document.getElementById('candidateForm');
  if (!open || !dialog || !form) return;
  var steps = Array.from(form.querySelectorAll('.apply-step'));
  var progress = Array.from(dialog.querySelectorAll('.apply-progress li'));
  var back = document.getElementById('applicationBack');
  var next = document.getElementById('applicationNext');
  var error = document.getElementById('applicationError');
  var names = ['About you', 'Your craft', 'Your fit', 'Review'];
  var current = 0;
  var sending = false;
  form.noValidate = true;
  form.elements._next.value = location.origin + '/?application=received#join-family';
  function review() {
    var box = document.getElementById('applicationReview');
    box.replaceChildren();
    var data = new FormData(form);
    var seen = new Set();
    data.forEach(function (value, key) {
      if (key[0] === '_' || key === 'Contact consent' || seen.has(key) || !String(value).trim()) return;
      seen.add(key);
      var row = document.createElement('div');
      var label = document.createElement('dt');
      var detail = document.createElement('dd');
      label.textContent = key === 'email' ? 'Email address' : key;
      detail.textContent = data.getAll(key).join(', ');
      var list = document.createElement('dl');
      list.append(label, detail);
      row.append(list);
      box.append(row);
    });
  }
  function show(index, focus) {
    current = index;
    error.hidden = true;
    steps.forEach(function (step, i) { step.hidden = i !== index; });
    progress.forEach(function (item, i) {
      item.classList.toggle('is-complete', i < index);
      if (i === index) item.setAttribute('aria-current', 'step');
      else item.removeAttribute('aria-current');
    });
    back.hidden = index === 0;
    next.textContent = index === 3 ? 'Send my application' : 'Continue';
    document.getElementById('applicationStepStatus').textContent = 'Step ' + (index + 1) + ' of 4 · ' + names[index];
    if (index === 3) review();
    if (focus) {
      dialog.scrollTop = 0;
      var legend = steps[index].querySelector('legend');
      legend.tabIndex = -1;
      legend.focus();
    }
  }
  function valid(index) {
    var fields = Array.from(steps[index].querySelectorAll('input, select, textarea'));
    var days = Array.from(form.querySelectorAll('[name="Available days"]'));
    if (index === 2) days[0].setCustomValidity(days.some(function (d) { return d.checked; }) ? '' : 'Please choose at least one available day.');
    var invalid = fields.find(function (f) { return !f.checkValidity(); });
    if (!invalid) return true;
    show(index, false);
    error.textContent = 'Please check the highlighted field before continuing.';
    error.hidden = false;
    invalid.focus();
    invalid.reportValidity();
    return false;
  }
  open.addEventListener('click', function () {
    if (!dialog.open) dialog.showModal();
    document.body.classList.add('application-open');
    show(current, false);
    steps[current].querySelector('input,select,textarea').focus();
  });
  dialog.querySelector('.apply-close').addEventListener('click', function () { dialog.close(); });
  dialog.addEventListener('close', function () { document.body.classList.remove('application-open'); open.focus(); });
  back.addEventListener('click', function () { if (!sending) show(Math.max(0, current - 1), true); });
  form.addEventListener('change', function () {
    var days = Array.from(form.querySelectorAll('[name="Available days"]'));
    if (days.some(function (d) { return d.checked; })) days[0].setCustomValidity('');
  });
  form.addEventListener('submit', function (e) {
    if (sending) { e.preventDefault(); return; }
    if (current < 3) { e.preventDefault(); if (valid(current)) show(current + 1, true); return; }
    for (var i = 0; i < steps.length; i++) if (!valid(i)) { e.preventDefault(); return; }
    // Send every selected checkbox value as a readable email row.
    ['Services', 'Hair types', 'Available days'].forEach(function (name) {
      var choices = Array.from(form.querySelectorAll('input[type="checkbox"]')).filter(function (field) { return field.name === name; });
      var summary = document.createElement('input');
      summary.type = 'hidden';
      summary.name = name;
      summary.value = choices.filter(function (field) { return field.checked; }).map(function (field) { return field.value; }).join(', ') || 'Not specified';
      summary.dataset.applicationSummary = 'true';
      form.appendChild(summary);
      choices.forEach(function (field) { field.disabled = true; });
    });
    sending = true;
    next.disabled = true;
    back.disabled = true;
    next.textContent = 'Opening secure submission…';
  });
  window.addEventListener('pageshow', function () {
    form.querySelectorAll('[data-application-summary]').forEach(function (field) { field.remove(); });
    form.querySelectorAll('input[type="checkbox"]').forEach(function (field) { field.disabled = false; });
    sending = false;
    next.disabled = false;
    back.disabled = false;
    show(current, false);
  });
  if (new URLSearchParams(location.search).get('application') === 'received') {
    document.getElementById('applicationReceived').hidden = false;
  }
})();
