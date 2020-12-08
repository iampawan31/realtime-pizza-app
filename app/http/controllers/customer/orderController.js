const Order = require('../../../models/order');
const moment = require('moment');
function orderController() {
  return {
    async index(req, res) {
      const orders = await Order.find({ customerId: req.user._id }, null, {
        sort: { createdAt: -1 },
      });
      res.header(
        'Cache-Control',
        'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0'
      );
      res.render('customer/orders', { orders, moment });
    },
    store(req, res) {
      //   Validate Request
      const { phone, address } = req.body;
      if (!phone || !address) {
        req.flash('error', 'All Fields are required');
        return res.redirect('/cart');
      }

      const order = new Order({
        customerId: req.user._id,
        items: req.session.cart.items,
        phone,
        address,
      });

      order
        .save()
        .then((result) => {
          Order.populate(
            result,
            {
              path: 'customerId',
            },
            (err, placedOrder) => {
              req.flash('success', 'Order placed successsfully');
              // Emit
              const eventEmitter = req.app.get('eventEmitter');
              eventEmitter.emit('orderPlaced', placedOrder);
              delete req.session.cart;
              return res.redirect('/customer/orders');
            }
          );
        })
        .catch((err) => {
          req.flash('error', err);
          return res.redirect('cart');
        });
    },
    async show(req, res) {
      const order = await Order.findById(req.params.id);

      // Authorize User
      if (req.user._id.toString() === order.customerId.toString()) {
        return res.render('customer/singleOrder', { order });
      }
      return res.redirect('/customer/orders');
    },
  };
}

module.exports = orderController;
