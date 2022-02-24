
 const login = (sequelize, Sequelize) => {
	const Login = sequelize.define('login', {	
	  id: {
			type: Sequelize.INTEGER,
			autoIncrement: true,
			primaryKey: true
    },
	  id_restaurant_login: {
			type: Sequelize.INTEGER
	},
    status: {
        type: Sequelize.BOOLEAN
    }
	});
	
	return Login;
};

module.exports = login