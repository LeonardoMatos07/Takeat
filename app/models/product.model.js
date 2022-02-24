
 const product = (sequelize, Sequelize) => {
	const Product = sequelize.define('product', {	
	  id: {
			type: Sequelize.INTEGER,
			autoIncrement: true,
			primaryKey: true
    },
	  name: {
			type: Sequelize.STRING
	},
	  value: {
			type: Sequelize.FLOAT
  	}, 
	  restaurant_id: {
			type: Sequelize.INTEGER
	},
	  canceled_At  : {
			type: Sequelize.DATE
    }
	});
	
	return Product;
};

module.exports = product