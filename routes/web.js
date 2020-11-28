function initRoutes(app) {
  // Homepage Route
  app.get('/', (req, res) => {
    res.render('home');
  });

  // Cart Route
  app.get('/cart', (req, res) => {
    res.render('customers/cart');
  });

  // Authentication Route
  app.get('/login', (req, res) => {
    res.render('auth/login');
  });

  // Authentication Route
  app.get('/register', (req, res) => {
    res.render('auth/register');
  });
}

module.exports = initRoutes;
