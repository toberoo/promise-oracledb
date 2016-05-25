var Promise = require('promise');
var oracledb = require('oracledb');
var chalk = require('chalk');

module.exports = {

	Format: {
		JSON: oracledb.OBJECT,
		array: oracledb.ARRAY
	},

	getSqlResults: function(query, params, args) {
		//Get reference
		var self = this;
		params = params == null ? {} : params;
		args = args == null ? {} : args;
		return new Promise(function(resolve, reject) {
			if (query == null) reject('No Query Provided');
			//Execute query
			var execute = function(conn) {
				conn.execute(query, params, args, function(err, result) {
					err != null ? reject(err) : resolve(result);
				});
			};
			//Get Connection
			self.getConnection().then(function(conn) {
				execute(conn);
			});
		});
	},

	//Will reject promise if there is no
	close: function() {
		var self = this;
		return new Promise(function(resolve, reject) {
			//Check for an existing connection.
			if (self.getConnection == null) {
				reject('No connecton available');
			}
			self.getConnection().then(function(conn) {
				resolve('Still in development')
			});
		});
	},

	//Options can have
	/**
		user:
		password:
		connectstring:
		useJSONResultFormat: //boolean
	*/
	setConnection: function(options, useJSONResultFormat) {

		//Set out format to json
		if (useJSONResultFormat != null && useJSONResultFormat == true) {
			oracledb.outFormat = this.Format.JSON;
		}

		//Create the promise using the options provided
		var promise = new Promise(function(resolve, reject) {
			oracledb.getConnection(options, function(err, connection) {
				//Reject the error
				if (err) {
					console.log(err);
					reject(err);
				//Resolve the connection
				} else {
					resolve(connection);
				}
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
