/**
 * Copyright by https://loizenai.com
 * youtube loizenai
 */

const resturant = (sequelize, Sequelize) => {
	const Restaurant = sequelize.define('Restaurant', {	
	  id: {
			type: Sequelize.INTEGER,
			autoIncrement: true,
			primaryKey: true
    },
	  username: {
			type: Sequelize.STRING
	},
	  email: {
			type: Sequelize.STRING
  	},
	  password: {
			type: Sequelize.STRING
	},
	  address: {
			type: Sequelize.STRING
  	},
	  has_service_tax: {
			type: Sequelize.BOOLEAN
 	},
	  canceled_at  : {
			type: Sequelize.STRING
    },
	  phone: {
			type: Sequelize.INTEGER
    }
	});
	
	return Restaurant;
};

module.exports = resturant