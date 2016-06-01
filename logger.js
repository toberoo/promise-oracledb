var chalk = require('chalk');

module.exports = (function Logger() {
	function Logger(enableMessaging) {
		this.enableMessaging = enableMessaging;
	}

	function genericLog(message, highlights, color) {
		//If logging is not enabled
		if (this.enableMessaging === false) return;
		if (highlights === undefined) {
			console.log(color(message));
			return;
		}
		highlights.forEach(function(word) {
			message = message.replace(/%s/, color(word));
		});
		console.log(message);
	}

	Logger.prototype.log = function(message, highlights) {
		genericLog(message, highlights, chalk.bold);
	}

	Logger.prototype.logError = function(message, highlights) {
		genericLog(message, highlights, chalk.bold.red);
	}

	Logger.prototype.logSuccess = function(message, highlights) {
		genericLog(message, highlights, chalk.bold.green);
	}

	return Logger;
}());
