const express = require('express');
const router = express.Router();
const { readDB, writeDB } = require('../database');

router.post('/', (req, res) => {
  const { name, email, phone, company, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email and message are required.' });
  }
  const db = readDB();
  db.contacts.push({
    id: db.nextContactId++,
    name, email,
    phone: phone || '',
    company: company || '',
    message,
    createdAt: new Date().toISOString()
  });
  writeDB(db);
  res.json({ success: true, message: 'Thank you! We will get back to you soon.' });
});

module.exports = router;
