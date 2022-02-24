
 const order = (sequelize, Sequelize) => {
	const Order = sequelize.define('order', {	
	  id: {
			type: Sequelize.INTEGER,
			autoIncrement: true,
			primaryKey: true
    },
	  product_id: {
			type: Sequelize.STRING
	},
	  amount: {
			type: Sequelize.FLOAT
  	}, 
      total_price: {
            type: Sequelize.FLOAT
    }, 
      total_service_price: {
            type: Sequelize.FLOAT
    },
	  restaurant_id: {
			type: Sequelize.INTEGER
	},
      buyer_id: {
            type: Sequelize.INTEGER
    },
	  canceled_At  : {
			type: Sequelize.DATE
    }
	});
	
	return Order;
};

module.exports = order;