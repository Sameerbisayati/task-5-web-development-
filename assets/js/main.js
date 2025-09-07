// assets/js/main.js
(() => {
  const PRODUCTS_URL = 'data/products.json';
  let products = [];
  let filtered = [];

  const $ = (sel) => document.querySelector(sel);
  const debounce = (fn, wait=250) => { let t; return (...a)=>{ clearTimeout(t); t=setTimeout(()=>fn(...a), wait); } }

  // localStorage cart helpers
  function getCart(){ try{ return JSON.parse(localStorage.getItem('apx_cart')||'[]') }catch(e){return []} }
  function setCart(cart){ localStorage.setItem('apx_cart', JSON.stringify(cart)); updateCartBadge(); window.dispatchEvent(new Event('storage')); }
  function addToCart(id){ const p = products.find(x=>String(x.id)===String(id)); if(!p) return; const cart = getCart(); const existing = cart.find(i=>i.id===p.id); if(existing){ existing.qty += 1 } else { cart.push({ id:p.id, title:p.title, price:p.price, image:p.image, qty:1 }) } setCart(cart); showToast('Added to cart'); }

  function updateCartBadge(){ const cart = getCart(); const count = cart.reduce((s,i)=>s+i.qty,0); const el = document.getElementById('cart-count'); if(el) el.textContent = count; }

  function showToast(text){
    const t = document.createElement('div');
    t.textContent = text;
    Object.assign(t.style, {position:'fixed', right:'1rem', bottom:'1rem', background:'#111', color:'#fff', padding:'0.6rem 0.8rem', borderRadius:'8px', zIndex:9999});
    document.body.appendChild(t);
    setTimeout(()=>t.remove(),1500);
  }

  function productCard(p){
    return `
      <article class="card" data-id="${p.id}">
        <a href="product.html?id=${p.id}" class="img-link"><img data-src="${p.image}" alt="${escapeHtml(p.title)}" loading="lazy" class="lozad"></a>
        <h3>${escapeHtml(p.title)}</h3>
        <div class="meta">${escapeHtml(p.category)} • ⭐ ${p.rating}</div>
        <div class="price">₹ ${Number(p.price).toFixed(0)}</div>
        <div style="margin-top:0.5rem">
          <button class="button btn-add" data-id="${p.id}">Add to cart</button>
          <a class="button ghost" href="product.html?id=${p.id}">View</a>
        </div>
      </article>
    `;
  }

  function escapeHtml(s){ return String(s).replace(/[&<>"]/g, c=>({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]||c)); }

  function renderGrid(list){
    const grid = document.getElementById('products-grid');
    if(!grid) return;
    grid.innerHTML = list.map(productCard).join('');
    initLazy();
  }

  function initLazy(){
    const els = document.querySelectorAll('img.lozad');
    if('IntersectionObserver' in window){
      const io = new IntersectionObserver((entries, obs)=>{
        entries.forEach(entry=>{
          if(entry.isIntersecting){
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lozad');
            obs.unobserve(img);
          }
        });
      }, {rootMargin: '50px'});
      els.forEach(e=>io.observe(e));
    } else {
      els.forEach(img=>img.src = img.dataset.src);
    }
  }

  function applyFilters(){
    const q = document.getElementById('search').value.trim().toLowerCase();
    const cat = document.getElementById('category').value;
    const sort = document.getElementById('sort').value;
    filtered = products.filter(p=>{
      const matchesQ = !q || (p.title + ' ' + p.description).toLowerCase().includes(q);
      const matchesCat = cat === 'all' || p.category === cat;
      return matchesQ && matchesCat;
    });
    if(sort === 'price-asc') filtered.sort((a,b)=>a.price-b.price);
    if(sort === 'price-desc') filtered.sort((a,b)=>b.price-a.price);
    if(sort === 'rating-desc') filtered.sort((a,b)=>b.rating-b.rating?b.rating-a.rating: b.rating - a.rating);
    renderGrid(filtered);
  }

  async function init(){
    try{
      const res = await fetch(PRODUCTS_URL);
      products = await res.json();
      filtered = products.slice();
      renderGrid(filtered);
      updateCartBadge();

      document.getElementById('search').addEventListener('input', debounce(applyFilters, 220));
      document.getElementById('category').addEventListener('change', applyFilters);
      document.getElementById('sort').addEventListener('change', applyFilters);

      document.addEventListener('click', (e)=>{
        if(e.target.matches('.btn-add')){ addToCart(e.target.dataset.id); }
      });

      if('serviceWorker' in navigator){
        navigator.serviceWorker.register('/sw.js').catch(()=>{});
      }
    }catch(err){
      console.error(err);
      const grid = document.getElementById('products-grid');
      if(grid) grid.innerHTML = '<p>Failed to load products.</p>';
    }
  }

  init();
})();