const express = require('express');
const router = express.Router();
const ManagementController = require('../controllers/ManagementController');

router.get('/show', ManagementController.show);

module.exports = router;