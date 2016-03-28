# promise-oracledb
Oracledb connect driver using Promises/A+

**Installation:
	-Requires the oracledb nodejs driver. Please see the documentation for how to install that dependency for your system.
	-For Windows:
	-Install Python 2.7
	-Install Microsoft Visual Studio dev tools
	-Run npm install promise-oracledb using the visual studio command prompt.

**How to use:

	/*Create Connection*/
	var db = require('promise-oracledb');
	db.setConnection({
		user: /*username*/,
		password: /*password*/,
		connectstring: /*oracle connection string. please see their documentation*/
	}, /*This param, if set to true, will output results as json*/);

	/*If you would like to use the driver only for getting the connection, you can now
	use db.getConnection().then(function(conn){/*callback*/}) */

	/*Create a Query */
	var query1 = db.createQuery({
		query: /*query*/,
		params: /*oracle driver allows for parameterized values in the query.*/,
		args: /*oracle driver allows some specific
	});

	/*Execute Query*/
	query1.execute(
		function(results) {
			console.log(results);
		},
		function(err) {
			console.log(err);
		}
	);

	/* You can change the params or args then re-execute the queries*/
	query1.args = {};
	query1.params ={};

**TODO: thread pools