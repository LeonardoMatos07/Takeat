
const env = require('./env.js');
 
const Sequelize = require('sequelize');
const sequelize = new Sequelize(env.database, env.username, env.password, {
  host: env.host,
  dialect: env.dialect,
  operatorsAliases: false,
 
  pool: {
    max: env.max,
    min: env.pool.min,
    acquire: env.pool.acquire,
    idle: env.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
 
db.restaurants = require('../models/restaurant.model.js')(sequelize, Sequelize);
db.products = require('../models/product.model.js')(sequelize, Sequelize);
db.buyers = require('../models/buyer.model.js')(sequelize, Sequelize);
db.orders = require('../models/order.model.js')(sequelize, Sequelize);
db.logins = require('../models/login.model.js')(sequelize, Sequelize);

module.exports = db;