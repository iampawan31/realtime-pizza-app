const homeController = require('../app/http/controllers/homeController');
const authController = require('../app/http/controllers/authController');
const cartController = require('../app/http/controllers/customer/cartController');
const orderController = require('../app/http/controllers/customer/orderController');

// Admin
const adminOrderController = require('../app/http/controllers/admin/orderController');
const adminOrderStatusController = require('../app/http/controllers/admin/statusController');

// Middleware
const guest = require('../app/http/middleware/guest');
const auth = require('../app/http/middleware/auth');
const admin = require('../app/http/middleware/admin');

function initRoutes(app) {
  // Homepage Route
  app.get('/', homeController().index);

  // Authentication Route
  app.get('/login', guest, authController().login);
  app.post('/login', authController().postLogin);
  app.get('/register', guest, authController().register);
  app.post('/register', authController().postRegister);
  app.post('/logout', auth, authController().logout);

  // Cart Routes
  app.get('/cart', cartController().index);
  app.post('/update-cart', cartController().update);

  // Customer Routes
  app.post('/orders', auth, orderController().store);
  app.get('/customer/orders', auth, orderController().index);
  app.get('/customer/orders/:id', auth, orderController().show);

  // Admin Routes
  app.get('/admin/orders', admin, adminOrderController().index);
  app.post('/admin/order/status', admin, adminOrderStatusController().update);
}

module.exports = initRoutes;
