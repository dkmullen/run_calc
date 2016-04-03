var miles = ko.observable();
var hours = ko.observable();
var minutes = ko.observable();
var seconds = ko.observable();
var paceMinutes = ko.observable();
var paceSeconds = ko.observable();
var errorMessage = ko.observable(false);

function ViewModel() {
	
	this.pad2 = function(number) {
		return (number < 10 ? '0' : '') + number
	}
	
	this.roundToTwo = function(num) {    
		return +(Math.round(num + 'e+2')  + 'e-2');
	}

	this.milesCalc = function() {
		if (seconds() == undefined) {
			seconds('00');
		}
		if (paceSeconds() == undefined) {
			paceSeconds('00');
		}
		var totalSeconds = parseInt(seconds()) + (parseInt(minutes()) * 60) + 
			(parseInt(hours()) * 3600);
		var secondsPerMile = parseInt(paceSeconds()) + (parseInt(paceMinutes()) 
			* 60);
		var num = this.roundToTwo(totalSeconds / secondsPerMile);
		miles(num);
	}
	
	this.timeCalc = function() {
		if (paceSeconds() == undefined) {
			paceSeconds('00');
		}
		var secondsPerMile = parseInt(paceSeconds()) + (parseInt(paceMinutes()) 
			* 60);
		var totalSeconds = secondsPerMile * miles();
		hours(Math.floor(totalSeconds / 3600));
		var remainingSeconds = (totalSeconds % 3600);
		minutes(Math.floor(remainingSeconds / 60));
		seconds(this.pad2(Math.round(remainingSeconds % 60)));
		
	}
	
	this.paceCalc = function() {
		if (seconds() == undefined) {
			seconds('00');
		}
		var totalSeconds = parseInt(seconds()) + (parseInt(minutes()) * 60) + 
			(parseInt(hours()) * 3600);
		var secPerMile = totalSeconds / miles();
		paceMinutes(Math.floor(secPerMile / 60));
		paceSeconds(this.pad2(Math.round(((secPerMile / 60) - paceMinutes()) 
			* 60)));
		if (paceSeconds() == 60) {
			var x = paceMinutes();
			paceMinutes(x+1);
			paceSeconds(this.pad2(0));
		}
	}

	this.calcMyRun = function() {
		if ((hours() !== undefined && minutes() == undefined)) {
			minutes('00');
		}
		if ((hours() !== undefined && seconds() == undefined)) {
			seconds('00');
		}
		if (hours() == undefined && minutes() !== undefined) {
			hours('0');
		}
		
		
		if ((miles() == undefined && minutes() == undefined) || 
			(miles() == undefined && paceMinutes() == undefined) ||
			(minutes() == undefined && paceMinutes() == undefined)) {
			errorMessage(true);
		}
		else if (miles() == undefined) {
			errorMessage(false);
			this.milesCalc();
		}
		else if (minutes() == undefined) {
			errorMessage(false);
			this.timeCalc();
		}
		else {
			errorMessage(false);
			this.paceCalc();
		}
	}
	
	this.formReset = function() {
		miles(undefined);
		hours(undefined);
		minutes(undefined);
		seconds(undefined);
		paceMinutes(undefined);
		paceSeconds(undefined);
		errorMessage(false);
		document.getElementById('run-form').reset();
	}
}
ko.applyBindings(new ViewModel());

/** pad2 comes from fanaur at

http://stackoverflow.com/questions/8043026/javascript-format-number-to-have-2-digit

It means: 
if (number < 10) {
	return '0' + number;
	}
	else {
		return '' + number;
	}
	
http://stackoverflow.com/questions/11832914/round-to-at-most-2-decimal-places-in-javascript
*/