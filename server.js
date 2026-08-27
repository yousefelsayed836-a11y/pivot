const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_PASS = process.env.ADMIN_PASSWORD;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/products', require('./routes/api'));
app.use('/api/contact', require('./routes/contact'));

// Admin login endpoint
app.post('/api/admin/login', (req, res) => {
  if (!ADMIN_PASS) return res.status(500).json({ error: 'Admin password is not configured' });
  const { password } = req.body;
  if (password === ADMIN_PASS) return res.json({ success: true, token: ADMIN_PASS });
  res.status(401).json({ error: 'Invalid password' });
});

// Page routes
const pages = ['solutions', 'products', 'products-copper', 'products-fibre', 'datacentres', 'telecom', 'about', 'contact', 'admin', 'hdci', 'uhdci', 'telecom-solutions'];
pages.forEach(page => {
  app.get(`/${page}`, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', `${page}.html`));
  });
});

// Category listing page
app.get('/category/:slug', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'category.html'));
});

// Product detail page
app.get('/product/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'product.html'));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Pivot Communication website running on http://localhost:${PORT}`);
});
