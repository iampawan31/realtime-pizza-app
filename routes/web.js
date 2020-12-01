const homeController = require('../app/http/controllers/homeController');
const authController = require('../app/http/controllers/authController');
const cartController = require('../app/http/controllers/customers/cartController');

function initRoutes(app) {
  // Homepage Route
  app.get('/', homeController().index);

  // Authentication Route
  app.get('/login', authController().login);

  // Authentication Route
  app.get('/register', authController().register);

  // Cart Routes
  app.get('/cart', cartController().index);
  app.post('/update-cart', cartController().update);
}

module.exports = initRoutes;
