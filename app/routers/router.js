

let express = require('express');
let router = express.Router();
 

const restaurants = require('../controllers/controller.js');
const authMiddleware = require('../../app/middlewares/auth.js');


router.post('/public/restaurants', restaurants.createRestaurant);
router.post('/public/login', restaurants.login);
router.use(authMiddleware).post('/restaurant/products', restaurants.createProduct);
router.use(authMiddleware).get('/restaurant/products', restaurants.getProducts);
router.use(authMiddleware).post('/restaurant/orders', restaurants.createOrder);
router.use(authMiddleware).get('/restaurant/orders', restaurants.getOrders);

module.exports = router;

