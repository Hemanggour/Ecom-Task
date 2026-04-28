const express = require('express');
const db = require('../db');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET api/cart
// @desc    Get current user's cart
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const result = await db.query(`
      SELECT c.*, p.name, p.price, p.image_url 
      FROM cart_items c 
      JOIN products p ON c.product_id = p.id 
      WHERE c.user_id = $1
    `, [req.user.id]);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/cart
// @desc    Add item to cart
// @access  Private
router.post('/', auth, async (req, res) => {
  const { product_id, quantity } = req.body;

  try {
    // Check if item already in cart
    const existingItem = await db.query(
      'SELECT * FROM cart_items WHERE user_id = $1 AND product_id = $2',
      [req.user.id, product_id]
    );

    if (existingItem.rows.length > 0) {
      // Update quantity
      const result = await db.query(
        'UPDATE cart_items SET quantity = quantity + $1 WHERE user_id = $2 AND product_id = $3 RETURNING *',
        [quantity || 1, req.user.id, product_id]
      );
      return res.json(result.rows[0]);
    }

    // Add new item
    const result = await db.query(
      'INSERT INTO cart_items (user_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *',
      [req.user.id, product_id, quantity || 1]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/cart/:id
// @desc    Update cart item quantity
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const { quantity } = req.body;

  try {
    const result = await db.query(
      'UPDATE cart_items SET quantity = $1 WHERE id = $2 AND user_id = $3 RETURNING *',
      [quantity, req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/cart/:id
// @desc    Remove item from cart
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const result = await db.query(
      'DELETE FROM cart_items WHERE id = $1 AND user_id = $2 RETURNING *',
      [req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }
    res.json({ message: 'Item removed from cart' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
