import axios from 'axios';
import Noty from 'noty';
import { initAdmin } from './admin';

let addToCart = document.querySelectorAll('.add-to-cart');
let cartCounter = document.querySelector('#cartCounter');

function updateCart(pizza) {
  axios
    .post('/update-cart', pizza)
    .then((res) => {
      cartCounter.innerHTML = res.data.totalQty;
      new Noty({
        text: 'Item added to cart',
        theme: 'metroui',
        timeout: 1000,
        type: 'success',
      }).show();
    })
    .catch((err) => {
      new Noty({
        text: 'Something went wrong',
        theme: 'metroui',
        timeout: 1000,
        type: 'error',
      }).show();
    });
}

addToCart.forEach((btn) => {
  btn.addEventListener('click', (e) => {
    let pizza = JSON.parse(btn.dataset.pizza);
    updateCart(pizza);
  });
});

// Remove alert message after 2 seconds
const alertMsg = document.getElementById('success-alert');
if (alertMsg) {
  setTimeout(() => {
    alertMsg.remove();
  }, 2000);
}

initAdmin();
