(function(){
  function getCart(){ try{return JSON.parse(localStorage.getItem('apx_cart')||'[]')}catch(e){return []} }
  function update(){ const el = document.getElementById('cart-count'); if(!el) return; const c = getCart(); const total = c.reduce((s,i)=>s+i.qty,0); el.textContent = total; }
  window.addEventListener('storage', update);
  document.addEventListener('DOMContentLoaded', update);
  update();
})();