const express = require('express');
const router = express.Router();
const homeController = require('../controllers/HomeController');

// router.use('/', homeController.getAllTour)

router.get('/search', homeController.getTourBySearch);
router.get('/hint', homeController.getHint);
router.get('/', homeController.getAllTour);
router.get('/booking', homeController.booking);
module.exports = router;