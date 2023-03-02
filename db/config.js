const Sequelize = require('sequelize');
const { DB } = require('../config');

const database = DB.NAME;
const username = DB.USERNAME;
const password = DB.PASSWORD;

const sequelize = new Sequelize(database, username, password, {
	host: DB.HOST,
	dialect: DB.DIALECT,
	port: DB.PORT,
	pool: {
		max: 10,
		min: 0,
		idle: 10000,
		acquire: 10000
	},
});


sequelize
	.sync({
		force: false,
		logging: false
	})
	.then(function() {
		console.log('DB connection sucessful.');
	})
	.catch(err => {
		console.log('error has occured', err);
		process.exit()
	});
  


module.exports = sequelize;
