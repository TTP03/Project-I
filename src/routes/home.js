const express = require('express');
const router = express.Router();
const homeController = require('../controllers/HomeController');

// router.use('/', homeController.getAllTour)

router.get('/search', homeController.getTourBySearch);
router.get('/transport', homeController.getTourByTransport);
router.get('/country', homeController.getTourByCountry);
router.get('/', homeController.getAllTour);
module.exports = router;