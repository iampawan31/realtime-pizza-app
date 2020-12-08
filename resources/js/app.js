import axios from 'axios';
import Noty from 'noty';
import moment from 'moment';
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

// Change Order Status
let statuses = document.querySelectorAll('.status_line');
let hiddenInput = document.querySelector('#hiddenInput');
let order = hiddenInput ? hiddenInput.value : null;
order = JSON.parse(order);
let time = document.createElement('small');

function updateStatus(order) {
  let stepCompleted = true;

  statuses.forEach((status) => {
    status.classList.remove('step-completed');
    status.classList.remove('current');
  });

  statuses.forEach((status) => {
    let dataProp = status.dataset.status;

    if (stepCompleted) {
      status.classList.add('step-completed');
    }

    if (dataProp === order.status) {
      time.innerHTML = moment(order.updatedAt).format('hh:mm A');
      status.appendChild(time);
      stepCompleted = false;
      if (status.nextElementSibling) {
        status.nextElementSibling.classList.add('current');
      }
    }
  });
}

updateStatus(order);

// Socket
let socket = io();

// Join
if (order) {
  socket.emit('join', `order_${order._id}`);
}

let adminPathArea = window.location.pathname;

if (adminPathArea.includes('admin')) {
  initAdmin(socket);
  socket.emit('join', 'adminRoom');
}

socket.on('orderUpdated', (data) => {
  const updatedOrder = { ...order };
  updatedOrder.updatedAt = moment().format();
  updatedOrder.status = data.status;
  updateStatus(updatedOrder);
  new Noty({
    text: 'Order Status Updated',
    theme: 'metroui',
    timeout: 1000,
    type: 'success',
  }).show();
});
