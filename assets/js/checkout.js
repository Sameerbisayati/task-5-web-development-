(function(){
  const root = document.getElementById('checkout-root');
  function getCart(){ try{return JSON.parse(localStorage.getItem('apx_cart')||'[]')}catch(e){return []} }
  function formatCurrency(n){ return '₹ ' + Number(n).toFixed(0); }

  function renderForm(){
    const cart = getCart();
    if(!cart.length){ root.innerHTML = '<p>Your cart is empty. <a href="index.html">Shop now</a></p>'; return; }
    const total = cart.reduce((s,i)=>s + i.price * i.qty, 0);
    root.innerHTML = `
      <div class="summary">
        <h3>Order Summary</h3>
        <p>Items: ${cart.length}</p>
        <p>Total: <strong>${formatCurrency(total)}</strong></p>
      </div>
      <form id="checkout-form" style="margin-top:1rem" novalidate>
        <label>Full name<br><input name="name" required></label><br><br>
        <label>Address<br><textarea name="address" rows="3" required></textarea></label><br><br>
        <label>Payment method<br>
          <select name="payment" required>
            <option value="">Select</option>
            <option value="cod">Cash on delivery</option>
            <option value="card">Card (demo)</option>
            <option value="upi">UPI</option>
          </select>
        </label><br><br>
        <button class="button" type="submit">Place order</button>
      </form>
    `;
    document.getElementById('checkout-form').addEventListener('submit', (e)=>{
      e.preventDefault();
      const order = {
        id: 'ORD' + Date.now(),
        cart,
        name: e.target.name.value,
        address: e.target.address.value,
        payment: e.target.payment.value,
        total
      };
      localStorage.setItem('last_order', JSON.stringify(order));
      localStorage.removeItem('apx_cart');
      alert('Order placed! Order ID: ' + order.id);
      location.href = 'index.html';
    });
  }

  document.addEventListener('DOMContentLoaded', renderForm);
})();