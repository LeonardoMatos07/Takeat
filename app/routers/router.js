/**
 * Copyright by https://loizenai.com
 * youtube loizenai
 */

let express = require('express');
//const { products } = require('../config/db.config.js');
let router = express.Router();
 
const customers = require('../controllers/controller.js');
const restaurants = require('../controllers/controller.js');
//const products = require('../controllers/controller.js');
const authMiddleware = require('../../app/middlewares/auth.js');

//router.post('/api/customers/create', customers.create);
router.post('/public/restaurants', restaurants.createRestaurant);
router.get('/public/login', restaurants.login);
router.use(authMiddleware).post('/restaurant/products', restaurants.createProduct);




router.get('/api/customers/onebyid/:id', customers.getCustomerById);
router.get('/api/customers/filteringbyage', customers.filteringByAge);
router.get('/api/customers/pagination', customers.pagination);
router.get('/api/customers/pagefiltersort', customers.pagingfilteringsorting);
router.put('/api/customers/update/:id', customers.updateById);
router.delete('/api/customers/delete/:id', customers.deleteById);

module.exports = router;

