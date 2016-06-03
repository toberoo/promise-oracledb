# promise-oracledb
Oracledb connect driver using Promises/A+

Installation:
	-Requires the oracledb nodejs driver. Please see the documentation for how to install that dependency for your system.
	-For Windows:
	-Install Python 2.7
	-Install Microsoft Visual Studio dev tools
	-Run npm install promise-oracledb using the visual studio command prompt.

### How to use:

	/*Create Connection*/
	var db = require('promise-oracledb');
	db.setConnection({
		user: /*username*/,
		password: /*password*/,
		connectString: /*oracle connection string. please see their documentation*/,
		useJSONFormat: /*Optional: This param, if set to true, will output results as json*/,
		enableLogging: /*Optional: If true, will show logging in the console*/
	});

	/*If you would like to use the driver only for getting the connection, you can now
	use db.getConnection().then(function(conn){/*callback*/}) */

	/*Create a Query */
	var query1 = db.createQuery({
		query: /*query*/,
		params: /*oracle driver allows for parameterized values in the query.*/,
		args: /*oracle driver allows some specific arguments to be passed into queries*/
	});

	/*Execute Query*/
	query1.execute().then(
		function(results) {
			console.log(results);
			/* results is an object with:
			rows: ['Array with result set. Will be arrays
				    or objects depending on how
				    you set it in create connection.'],
			metadata: [{'name': 'Tables accessed and other info'}],
			time: 'Apporimation in milliseconds of how long the query took to execute. Still useful
			       for performace metrics'
			*/
		},
		function(err) {
			console.log(err);
		}
	);

	/* You can change the params or args then re-execute the queries*/
	query1.args = {};
	query1.params ={};

### TODO: thread pools