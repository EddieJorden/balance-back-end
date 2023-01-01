const Pool = require("pg").Pool;

const pool = new Pool({
	user: 'eddiejorden.tech',
	databse: "user_profile",
	host: "localhost",
	port: 5432
})

module.exports = pool;
