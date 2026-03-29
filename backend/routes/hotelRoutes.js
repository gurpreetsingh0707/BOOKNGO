const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Hotel routes - coming soon' });
});

module.exports = router;