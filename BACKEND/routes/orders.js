const express = require('express');
const db = require('../db');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   POST api/orders
// @desc    Place an order
// @access  Private
router.post('/', auth, async (req, res) => {
  const { shipping_address } = req.body;

  try {
    // 1. Get cart items
    const cartItems = await db.query(`
      SELECT c.*, p.price 
      FROM cart_items c 
      JOIN products p ON c.product_id = p.id 
      WHERE c.user_id = $1
    `, [req.user.id]);

    if (cartItems.rows.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // 2. Calculate total amount
    const totalAmount = cartItems.rows.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // 3. Create order (Transaction start)
    await db.query('BEGIN');

    const orderRes = await db.query(
      'INSERT INTO orders (user_id, total_amount, shipping_address) VALUES ($1, $2, $3) RETURNING id',
      [req.user.id, totalAmount, shipping_address]
    );
    const orderId = orderRes.rows[0].id;

    // 4. Add items to order_items
    for (const item of cartItems.rows) {
      await db.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)',
        [orderId, item.product_id, item.quantity, item.price]
      );
      
      // 5. Update product stock
      await db.query(
        'UPDATE products SET stock = stock - $1 WHERE id = $2',
        [item.quantity, item.product_id]
      );
    }

    // 6. Clear cart
    await db.query('DELETE FROM cart_items WHERE user_id = $1', [req.user.id]);

    await db.query('COMMIT');

    res.status(201).json({ message: 'Order placed successfully', orderId });
  } catch (err) {
    await db.query('ROLLBACK');
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/orders
// @desc    Get user's orders (User) or all orders (Admin)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    let result;
    if (req.user.role === 'admin') {
      result = await db.query(`
        SELECT o.*, u.name as user_name 
        FROM orders o 
        JOIN users u ON o.user_id = u.id 
        ORDER BY o.created_at DESC
      `);
    } else {
      result = await db.query('SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC', [req.user.id]);
    }
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/orders/:id
// @desc    Get order details
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const orderRes = await db.query('SELECT * FROM orders WHERE id = $1', [req.params.id]);
    if (orderRes.rows.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const order = orderRes.rows[0];

    // Check if user is authorized
    if (req.user.role !== 'admin' && order.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const itemsRes = await db.query(`
      SELECT oi.*, p.name, p.image_url 
      FROM order_items oi 
      JOIN products p ON oi.product_id = p.id 
      WHERE oi.order_id = $1
    `, [req.params.id]);

    res.json({ ...order, items: itemsRes.rows });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/orders/:id/status
// @desc    Update order status
// @access  Private/Admin
router.put('/:id/status', auth, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  const { status } = req.body;

  try {
    const result = await db.query(
      'UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [status, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
