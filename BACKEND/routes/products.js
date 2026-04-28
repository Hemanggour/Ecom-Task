const express = require('express');
const db = require('../db');
const auth = require('../middleware/auth');
const upload = require('../utils/multer');

const router = express.Router();

// @route   GET api/products
// @desc    Get all products
// @access  Public
router.get('/', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      ORDER BY p.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/products/:id
// @desc    Get product by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.id = $1
    `, [req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/products
// @desc    Create a product
// @access  Private/Admin
router.post('/', auth, upload.single('image'), async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  const { name, description, price, stock, category_id } = req.body;
  const image_url = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const result = await db.query(
      'INSERT INTO products (name, description, price, stock, category_id, image_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, description, price, stock, category_id, image_url]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/products/:id
// @desc    Update a product
// @access  Private/Admin
router.put('/:id', auth, upload.single('image'), async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  const { name, description, price, stock, category_id } = req.body;
  let image_url = req.body.image_url;

  if (req.file) {
    image_url = `/uploads/${req.file.filename}`;
  }

  try {
    const result = await db.query(
      'UPDATE products SET name=$1, description=$2, price=$3, stock=$4, category_id=$5, image_url=$6, updated_at=CURRENT_TIMESTAMP WHERE id=$7 RETURNING *',
      [name, description, price, stock, category_id, image_url, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/products/:id
// @desc    Delete a product
// @access  Private/Admin
router.delete('/:id', auth, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  try {
    const result = await db.query('DELETE FROM products WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
