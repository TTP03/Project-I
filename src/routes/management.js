const express = require('express');
const router = express.Router();
const ManagementController = require('../controllers/ManagementController');

router.get('/show', ManagementController.show);
router.get('/statics', ManagementController.statics);
router.get('/create', ManagementController.create);
router.post('/store', ManagementController.store);
router.post('/:id/permanent', ManagementController.delete);
router.get('/:id/edit', ManagementController.edit);
router.post('/:id', ManagementController.update);
router.get('/client', ManagementController.client);
module.exports = router;