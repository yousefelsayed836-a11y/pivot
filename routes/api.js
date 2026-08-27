const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { readDB, writeDB } = require('../database');

const ADMIN_PASS = process.env.ADMIN_PASSWORD;

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../public/img/uploads');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `product-${Date.now()}${ext}`);
  }
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

function adminAuth(req, res, next) {
  if (!ADMIN_PASS) return res.status(500).json({ error: 'Admin password is not configured' });
  const token = req.headers['x-admin-token'];
  if (token !== ADMIN_PASS) return res.status(401).json({ error: 'Unauthorized' });
  next();
}

// GET /api/products — list all or by category
router.get('/', (req, res) => {
  const db = readDB();
  const { category } = req.query;
  const products = category
    ? db.products.filter(p => p.category === category)
    : db.products;
  res.json(products);
});

// GET /api/products/:id — single product
router.get('/:id', (req, res) => {
  const db = readDB();
  const product = db.products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ error: 'Not found' });
  res.json(product);
});

// POST /api/products — create (admin)
router.post('/', adminAuth, (req, res) => {
  const db = readDB();
  const { name, category, subcategory, description, descHtml, image, price, slug, units } = req.body;
  if (!name || !category) return res.status(400).json({ error: 'name and category required' });
  const maxId = db.products.reduce((m, p) => Math.max(m, p.id), 0);
  const product = { id: maxId + 1, name, category, subcategory: subcategory || '', description: description || '', descHtml: descHtml || '', units: units || '', image: image || '', price: parseFloat(price) || 0, slug: slug || name.toLowerCase().replace(/\s+/g, '-') };
  db.products.push(product);
  writeDB(db);
  res.json(product);
});

// PUT /api/products/:id — update (admin)
router.put('/:id', adminAuth, (req, res) => {
  const db = readDB();
  const idx = db.products.findIndex(p => p.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  const { name, category, subcategory, description, descHtml, image, price, slug, units } = req.body;
  db.products[idx] = { ...db.products[idx], ...(name && { name }), ...(category && { category }), ...(subcategory !== undefined && { subcategory }), ...(description !== undefined && { description }), ...(descHtml !== undefined && { descHtml }), ...(units !== undefined && { units }), ...(image !== undefined && { image }), ...(price !== undefined && { price: parseFloat(price) || 0 }), ...(slug !== undefined && { slug }) };
  writeDB(db);
  res.json(db.products[idx]);
});

// DELETE /api/products/:id — delete (admin)
router.delete('/:id', adminAuth, (req, res) => {
  const db = readDB();
  const idx = db.products.findIndex(p => p.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  db.products.splice(idx, 1);
  writeDB(db);
  res.json({ success: true });
});

// POST /api/products/upload-image — upload image (admin)
router.post('/upload-image', adminAuth, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  res.json({ url: `/img/uploads/${req.file.filename}` });
});

// POST /api/admin/login
router.post('/admin/login', (req, res) => {
  if (!ADMIN_PASS) return res.status(500).json({ error: 'Admin password is not configured' });
  const { password } = req.body;
  if (password === ADMIN_PASS) return res.json({ success: true, token: ADMIN_PASS });
  res.status(401).json({ error: 'Invalid password' });
});

module.exports = router;
