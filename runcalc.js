var miles = ko.observable();
var hours = ko.observable();
var minutes = ko.observable();
var seconds = ko.observable();
var paceMinutes = ko.observable();
var paceSeconds = ko.observable();
var errorMessage = ko.observable(false);

function ViewModel() {

	/**
	 * Main function of the app, called by knockout.js data-bind on the 'Submit'
	 * button in the DOM. Checks that data has been entered for two of the 
	 * three categories (miles, elapsed time, pace). Specifically checks for
	 * miles, elapsed minutes and pace minutes, but if user enters elapsed 
	 * hours (or minutes), fills in minutes (or hours) with zero. 
	 * Likewise if user enters only pace minutes. Entering only seconds or
	 * pace seconds throws the error message. Finally, calls the function
	 * for the missing field.
	 @function
	 */
	this.calcMyRun = function() {
		if (hours() !== undefined && minutes() === undefined) {
			minutes('00');
		}
		if (hours() === undefined && minutes() !== undefined) {
			hours('0');
		}
		
		if ((miles() === undefined && minutes() === undefined) || 
			(miles() === undefined && paceMinutes() === undefined) ||
			(minutes() === undefined && paceMinutes() === undefined)) {
			/** Uses a ko.observable in HTML to change color if true */
			errorMessage(true);
		} else if (miles() === undefined) {
			/** In case err message was red from previous try, this resets it */
			errorMessage(false);
			this.milesCalc();
		} else if (minutes() === undefined) {
			errorMessage(false);
			this.timeCalc();
		} else {
			errorMessage(false);
			this.paceCalc();
		}
	};
	
	/**
	 * Helper function to produce two digit numbers (credit at bottom of file)
	 * If number < 10, adds a '0' to the front, otherwise adds empty string
	 * @function
	 * @param {number} num - Passed in from other functions
	 * @returns a two-digit number 
	 */
	this.pad2 = function(num) {
		return (num < 10 ? '0' : '') + num;
	};
	
	/**
	 * Helper function to round decimals to two places (credit at bottom)
	 * Multiplies num by 10 to the power of 2, rounds it, 'pulls' the decimal
	 * back two places by multiplying by 10 to the minus 2
	 * @function
	 * @param {number} num - Passed in from other functions
	 * @returns a number rounded to two decimal places
	 */
	this.roundToTwo = function(num) {
		return +(Math.round(num + 'e+2')  + 'e-2');
	};
	
	/**
	 * Function to calculate the miles field, called by calcMyRun. Fills in
	 * seconds and/or pace seconds with '00' if needed, parses the numbers from
	 * str type to int, coverts them all to seconds and adds them, does the same
	 * with pace, divides totalSeconds by secondsPerMile, rounds to two decimal
	 * places by calling roundToTwo function.
	 * @function
	 */
	this.milesCalc = function() {
		if (seconds() === undefined) {
			seconds('00');
		}
		if (paceSeconds() === undefined) {
			paceSeconds('00');
		}
		var totalSeconds = parseInt(seconds()) + (parseInt(minutes()) * 60) + 
			(parseInt(hours()) * 3600);
		var secondsPerMile = parseInt(paceSeconds()) + 
			(parseInt(paceMinutes()) * 60);
		var num = this.roundToTwo(totalSeconds / secondsPerMile);
		miles(num);
	};
	
	/** 
	 * Function to calculate elapsed time, called by calcMyRun. Fills in 
	 * paceSeconds with '00' if needed, parses numbers in string type from form
	 * to number type, calculates total seconds for run, divides by 3600 
	 * (seconds in an hour), uses the 'floor' for hours, calcs minutes from
	 * floor of remaining seconds div by 60, calcs seconds from the remainder,
	 * rounding to the nearest second, calls pad2 so result is two digits.
	 * @function
	 */
	this.timeCalc = function() {
		if (paceSeconds() === undefined) {
			paceSeconds('00');
		}
		//pads paceSeconds with a leading zero if user enters a single digit
		if (paceSeconds() < 10 && paceSeconds().length < 2) {
			paceSeconds(this.pad2(paceSeconds()));
		}
		var secondsPerMile = parseInt(paceSeconds()) + 
			(parseInt(paceMinutes()) * 60);
		var totalSeconds = secondsPerMile * miles();
		hours(Math.floor(totalSeconds / 3600));
		var remainingSeconds = (totalSeconds % 3600);
		minutes(Math.floor(remainingSeconds / 60));
		seconds(this.pad2(Math.round(remainingSeconds % 60)));
		
	};

	/** 
	 * Function to calculate pace, called by calcMyRun. Fills in seconds with
	 * '00' if needed, parses numbers in string type from form to number type,
	 * calculates total seconds for run and seconds per mile, calcs pace minutes
	 * by finding floor of secPerMile/60, calcs paceSeconds by secPerMile/60,
	 * subtracts the mines, multiplies the resulting decimal by 60 to convert
	 * from decimal to seconds, rounds and pads it.
	 * 'If' statement covers the case where paceSeconds rounds up to 60. Adds
	 * 1 to paceMinutes, sets paceSeconds to 0.
	 * @function
	 */	
	this.paceCalc = function() {
		if (seconds() === undefined) {
			seconds('00');
		}
		//pads seconds with a leading zero if user enters a single digit
		if (seconds() < 10 && seconds().length < 2) {
			seconds(this.pad2(seconds()));
		}
		var totalSeconds = parseInt(seconds()) + (parseInt(minutes()) * 60) + 
			(parseInt(hours()) * 3600);
		var secPerMile = totalSeconds / miles();
		paceMinutes(Math.floor(secPerMile / 60));
		paceSeconds(this.pad2(Math.round(((secPerMile / 60) - 
			paceMinutes()) * 60)));
		if (paceSeconds() === '60') {
			paceMinutes(paceMinutes() + 1);
			paceSeconds(this.pad2(0));
		}
	};

	/** 
	 * Function to reset form in DOM, set all fields to undefined so no data
	 * remains. Called by knockout.js data-bind on 'Reset' button.
	 * @function
	 */
	this.formReset = function() {
		miles(undefined);
		hours(undefined);
		minutes(undefined);
		seconds(undefined);
		paceMinutes(undefined);
		paceSeconds(undefined);
		errorMessage(false);
		document.getElementById('run-form').reset();
	};
}
ko.applyBindings(new ViewModel());

/** 
 * Credits: 
 * pad2 function comes from fanaur at:
 * http://stackoverflow.com/questions/8043026/javascript-format-number-to-have-2-digit
 *
 * It means: 
 * if (number < 10) {return '0' + number;}
 *	else {return '' + number;}
 *
 * roundToTwo function comes from MarkG at:
 * http://stackoverflow.com/questions/11832914/round-to-at-most-2-decimal-places-in-javascript
 */
 
 