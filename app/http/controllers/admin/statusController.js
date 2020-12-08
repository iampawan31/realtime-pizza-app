const order = require('../../../models/order');

function statusController() {
  return {
    update(req, res) {
      order.updateOne(
        { _id: req.body.orderId },
        { status: req.body.status },
        (error, result) => {
          if (error) {
            req.flash('error', error);
            return res.redirect('/admin/orders');
          }
          // Emit Event
          const eventEmitter = req.app.get('eventEmitter');
          eventEmitter.emit('orderUpdated', {
            id: req.body.orderId,
            status: req.body.status,
          });
          return res.redirect('/admin/orders');
        }
      );
      order
        .find({ status: { $ne: 'completed' } }, null, {
          sort: { createdAt: -1 },
        })
        .populate('customerId', '-password')
        .exec((err, orders) => {
          if (req.xhr) {
            return res.json(orders);
          } else {
            return res.render('admin/orders');
          }
        });
    },
  };
}

module.exports = statusController;
