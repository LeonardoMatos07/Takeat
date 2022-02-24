
const bcrypt = require('bcryptjs')

const resturant = (sequelize, Sequelize) => {

	const Restaurant = sequelize.define('restaurant', {	
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
			type: Sequelize.STRING,
			set(value) {
				const hash = bcrypt.hashSync(value, 10);
				this.setDataValue('password', hash);
			  },
	},
	  address: {
			type: Sequelize.STRING
  	},
	  has_service_tax: {
			type: Sequelize.BOOLEAN
 	},
	  canceled_at  : {
			type: Sequelize.DATE
    },
	  phone: {
			type: Sequelize.INTEGER
    }

	})

	return Restaurant;
	
}

module.exports = resturant

