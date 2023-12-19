const express = require('express');
const router = express.Router();
const homeController = require('../controllers/HomeController');

// router.use('/', homeController.getAllTour)

router.get('/search', homeController.getTourBySearch);
router.get('/country', homeController.getTourByCountry);
router.get('/transport', homeController.getTourByTransport);
router.get('/', homeController.getAllTour);
module.exports = router;