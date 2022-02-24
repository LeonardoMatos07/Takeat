
 const buyer = (sequelize, Sequelize) => {
	const Buyer = sequelize.define('buyer', {	
	  id: {
			type: Sequelize.INTEGER,
			autoIncrement: true,
			primaryKey: true
    },
	  name: {
			type: Sequelize.STRING
	},
	  phone: {
			type: Sequelize.INTEGER
	}
	});
	
	return Buyer;
};

module.exports = buyer