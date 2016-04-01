var miles = ko.observable();
var hours = ko.observable();
var minutes = ko.observable();
var seconds = ko.observable();
var paceMinutes = ko.observable();
var paceSeconds = ko.observable();

function ViewModel() {
	
	this.pad2 = function(number) {
		return (number < 10 ? '0' : '') + number
	}
	
	this.calcMyRun = function() {
		if (hours() == undefined) {
			hours('0');
		}
		var totalSeconds = parseInt(seconds()) + (parseInt(minutes()) * 60) + 
			(parseInt(hours()) * 3600);
		var secPerMile = totalSeconds / miles();
		paceMinutes(Math.floor(secPerMile / 60));
		paceSeconds(this.pad2(Math.round(((secPerMile / 60) - paceMinutes()) * 60)));
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
*/