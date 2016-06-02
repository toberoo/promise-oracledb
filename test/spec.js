var assert = require('assert');
var db = require(__dirname +'/../index.js');

describe('Test Promise Oracle Database', function() {
	/* Redacted, confidential information, come up with a way for others to
	   test without revealing database information.
	*/

	it ('Query1', function(done) {
		this.timeout(12000);
		db.setConnection({
			user: process.env.DB_QC_USERNAME,
			password: process.env.DB_QA_PASSWORD,
			connectString: process.env.DB_QC_CONNECT_STRING,
			enableLogging: true
		});
		db.createQuery({
			query: 'SELECT * FROM DUAL'
		})
		.execute()
		.then(function(result) {
			done();
		});
	});

	it ('Query2', function(done) {
		this.timeout(12000);
		db.createQuery({
			query: 'SELECT * FROM DUAL'
		})
		.execute()
		.then(function(result) {
			assert.equal(result.rows[0], 'X');
			//Close database
			db.close().then(function(result) {
				//console.log(result);
				done();
			}, function(err) {
				assert.equal(err, undefined);
				done();
			});
		});
	});
});