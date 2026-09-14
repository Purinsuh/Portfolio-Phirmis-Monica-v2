(function(){
  var groups = {};

  document.querySelectorAll('img[data-lightbox]').forEach(function(img){
    var key = img.getAttribute('data-lightbox');
    (groups[key] = groups[key] || []).push(img);
  });

  if (Object.keys(groups).length === 0) return;

  var overlay = document.createElement('div');
  overlay.className = 'lightbox-overlay';
  overlay.innerHTML =
    '<button class="lightbox-close" aria-label="Fermer">&times;</button>' +
    '<button class="lightbox-nav prev" aria-label="Image précédente">&#10094;</button>' +
    '<img alt="">' +
    '<button class="lightbox-nav next" aria-label="Image suivante">&#10095;</button>' +
    '<p class="lightbox-caption"></p>';
  document.body.appendChild(overlay);

  var imgEl = overlay.querySelector('img');
  var captionEl = overlay.querySelector('.lightbox-caption');
  var closeBtn = overlay.querySelector('.lightbox-close');
  var prevBtn = overlay.querySelector('.lightbox-nav.prev');
  var nextBtn = overlay.querySelector('.lightbox-nav.next');

  var items = [];
  var index = 0;

  function show(i){
    index = (i + items.length) % items.length;
    imgEl.src = items[index].currentSrc || items[index].src;
    imgEl.alt = items[index].alt;
    captionEl.textContent = items[index].alt;
    var multi = items.length > 1;
    prevBtn.style.display = multi ? 'flex' : 'none';
    nextBtn.style.display = multi ? 'flex' : 'none';
  }

  function openFor(img){
    items = groups[img.getAttribute('data-lightbox')];
    show(items.indexOf(img));
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function close(){
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  Object.keys(groups).forEach(function(key){
    groups[key].forEach(function(img){
      img.addEventListener('click', function(){ openFor(img); });
    });
  });

  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', function(e){
    if (e.target === overlay) close();
  });
  prevBtn.addEventListener('click', function(e){ e.stopPropagation(); show(index - 1); });
  nextBtn.addEventListener('click', function(e){ e.stopPropagation(); show(index + 1); });

  document.addEventListener('keydown', function(e){
    if (!overlay.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(index - 1);
    if (e.key === 'ArrowRight') show(index + 1);
  });
})();
