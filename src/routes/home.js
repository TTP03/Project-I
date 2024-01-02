const express = require('express');
const router = express.Router();
const homeController = require('../controllers/HomeController');

// router.use('/', homeController.getAllTour)

router.get('/search', homeController.getTourBySearch);
router.get('/hint', homeController.getHint);
router.get('/', homeController.getAllTour);
router.get('/management', homeController.createTour);
module.exports = router;