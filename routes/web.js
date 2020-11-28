function initRoutes(app) {
  // Homepage Route
  app.get('/', (req, res) => {
    res.render('home');
  });

  // Cart Route
  app.get('/cart', (req, res) => {
    res.render('customers/cart');
  });
}

module.exports = initRoutes;
