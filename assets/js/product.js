(async ()=>{
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  const root = document.getElementById('product-root');
  if(!id){ root.innerHTML = '<p>Product not found</p>'; return; }
  try{
    const res = await fetch('data/products.json');
    const list = await res.json();
    const p = list.find(x => String(x.id)===String(id));
    if(!p) { root.innerHTML = '<p>Product not found</p>'; return; }
    root.innerHTML = `
      <div class="card" style="display:flex; gap:1rem; align-items:flex-start">
        <img src="${p.image}" alt="${p.title}" style="width:320px; height:auto; object-fit:cover; border-radius:10px">
        <div>
          <h1>${p.title}</h1>
          <p class="meta">${p.category} • ⭐ ${p.rating}</p>
          <p style="font-weight:700;">₹ ${p.price}</p>
          <p>${p.description}</p>
          <div style="margin-top:1rem">
            <button class="button" id="add-to-cart">Add to cart</button>
            <a class="button ghost" href="index.html">Back</a>
          </div>
        </div>
      </div>
    `;
    document.getElementById('add-to-cart').addEventListener('click', ()=>{
      const cart = JSON.parse(localStorage.getItem('apx_cart')||'[]');
      const existing = cart.find(i=>String(i.id)===String(p.id));
      if(existing) existing.qty += 1; else cart.push({ id:p.id, title:p.title, price:p.price, image:p.image, qty:1 });
      localStorage.setItem('apx_cart', JSON.stringify(cart));
      window.dispatchEvent(new Event('storage'));
      alert('Added to cart');
    });
  }catch(e){
    console.error(e);
    root.innerHTML = '<p>Failed to load product</p>';
  }
})();