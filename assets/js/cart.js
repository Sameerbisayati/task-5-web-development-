(function(){
  const root = document.getElementById('cart-root');

  function getCart(){ try{return JSON.parse(localStorage.getItem('apx_cart')||'[]')}catch(e){return []} }
  function setCart(c){ localStorage.setItem('apx_cart', JSON.stringify(c)); window.dispatchEvent(new Event('storage')); render(); }

  function formatCurrency(n){ return '₹ ' + Number(n).toFixed(0); }

  function render(){
    const cart = getCart();
    if(!cart.length){ root.innerHTML = '<p>Your cart is empty. <a href="index.html">Shop now</a></p>'; return; }
    const rows = cart.map(item=>`
      <tr data-id="${item.id}">
        <td><img src="${item.image}" alt="${item.title}" style="width:64px; height:64px; object-fit:cover; border-radius:6px"></td>
        <td>${item.title}</td>
        <td>
          <button class="qty-dec" data-id="${item.id}">-</button>
          <span style="padding:0 0.6rem">${item.qty}</span>
          <button class="qty-inc" data-id="${item.id}">+</button>
        </td>
        <td>${formatCurrency(item.price)}</td>
        <td>${formatCurrency(item.price * item.qty)}</td>
        <td><button class="remove" data-id="${item.id}">Remove</button></td>
      </tr>
    `).join('');
    const total = cart.reduce((s,i)=>s + i.price * i.qty, 0);
    root.innerHTML = `
      <table class="cart" aria-live="polite">
        <thead><tr><th></th><th>Product</th><th>Qty</th><th>Price</th><th>Subtotal</th><th></th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <div class="summary">
        <div style="display:flex; justify-content:space-between; align-items:center">
          <strong>Total:</strong><strong>${formatCurrency(total)}</strong>
        </div>
        <div style="margin-top:1rem">
          <a href="checkout.html" class="button">Proceed to checkout</a>
          <button class="button ghost" id="clear-cart">Clear cart</button>
        </div>
      </div>
    `;
  }

  document.addEventListener('click', (e)=>{
    if(e.target.matches('.qty-inc')){
      const id = e.target.dataset.id; const cart = getCart(); const it = cart.find(x=>String(x.id)===String(id)); if(it){ it.qty++; setCart(cart); }
    }
    if(e.target.matches('.qty-dec')){
      const id = e.target.dataset.id; const cart = getCart(); const it = cart.find(x=>String(x.id)===String(id)); if(it){ it.qty = Math.max(1, it.qty-1); setCart(cart); }
    }
    if(e.target.matches('.remove')){
      const id = e.target.dataset.id; let cart = getCart(); cart = cart.filter(x=>String(x.id)!==String(id)); setCart(cart);
    }
    if(e.target.id === 'clear-cart'){
      localStorage.removeItem('apx_cart'); window.dispatchEvent(new Event('storage')); render();
    }
  });

  window.addEventListener('storage', render);
  document.addEventListener('DOMContentLoaded', render);
})();