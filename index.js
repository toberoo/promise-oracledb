var Promise = require('promise');
var Logger = require('./logger');
var oracledb = require('oracledb');

module.exports = {

	format: {
		OBJECT: oracledb.OBJECT,
		ARRAY: oracledb.ARRAY
	},

	getSqlResults: function(query, params, args) {
		//Get reference
		var self = this;
		params = params == null ? {} : params;
		args = args == null ? {} : args;
		return new Promise(function(resolve, reject) {
			if (query == null) reject('No Query Provided');
			//Execute query
			self.logger.log('Executing Query %s', [query]);
			var execute = function(conn, currTime) {
				conn.execute(query, params, args, function(err, result) {
					if(err != null) {
						self.logger.logError(err);
						reject(err)
					}
					result.time = (new Date()).getTime() - currTime;
					self.logger.logSuccess('Query finished in: ' + result.time + ' ms');
					resolve(result);
				});
			};
			//Get Connection
			self.getConnection().then(function(conn) {
				//Execute query with the current time
				execute(conn, (new Date()).getTime());
			});
		});
	},

	//Will reject promise if there is no
	close: function() {
		var self = this;
		return new Promise(function(resolve, reject) {
			//Check for an existing connection.
			if (self.getConnection == null) {
				self.logger.logError('No Connection available');
				reject('No connecton available');
			}
			function closeConnection(conn) {
				conn.release(function(err) {
					if (err) {
						self.logger.logError(err);
						reject(err);
					}
					self.logger.logSuccess('Connection has closed')
					resolve('Connection has closed');
				});
			}
			self.getConnection().then(closeConnection);
		});
	},

	//Options can have
	/**
		user:
		password:
		connectString:
		useJSONFormat: //boolean
	*/
	setConnection: function(options, redactedUseJSONFormat) {

		//Create the logger
		var logger = this.logger = new Logger(options.enableLogging);

		//Set out format to json if selected
		if (options.useJSONFormat === true || redactedUseJSONFormat === true) {
			oracledb.outFormat = oracledb.OBJECT;
		}

		var connectOptions = {
			user: options.user,
			password: options.password,
			connectString: options.connectString
		}

		//Log
		logger.log('\nAttempting connection to %s as %s', [options.connectString, options.user]);

		//Create the promise using the options provided
		var promise = new Promise(function(resolve, reject) {
			oracledb.getConnection(connectOptions, function(err, connection) {
				//Reject the error
				if (err) {
					logger.log(err);
					reject(err);
				//Resolve the connection
				}
				logger.logSuccess('Connection is successful')
				resolve(connection);
			});
		});

		//Set the function for retreiving database connections
		this.getConnection = function() {
			return promise;
		}
	},

	/*	Options parameters:
			query: query to be executed
			params: parameters that can be inserted into
	*/
	createQuery: function(options) {

		//Refrence to this object literal
		var self = this;

		//Return an object
		return {
			query: options.query,
			params: options.params,
			args: options.args,
			execute: function() {
				return self.getSqlResults(
					this.query,
					this.params,
					this.args
				);
			}
		};
	}
};
