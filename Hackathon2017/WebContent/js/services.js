angular.module('inspinia').factory('apiService', function($http) {
    var api = {};
    
	api.getReportList = function() {
		return $http({
			method: 'GET',
			url: 'api/getdata?item=reportlist'
		});
	}
	
	api.getEventList = function() {
		return $http({
			method: 'GET',
			url: 'api/getdata?item=eventlist'
		});
	}
	
	api.getEvent = function( id ) {
		return $http({
			method: 'GET',
			url: 'api/getdata?item=event&id=' + id
		});
	}
	
	api.copyEvent = function( id ) {
		return $http({
			method: 'GET',
			url: 'api/doaction?item=copyevent&id=' + id
		});
	}
	
	api.saveEvent = function( event ) {
		event = convertMomentsToDates(event);
		return $http.post('api/setdata', {item: 'event', data: event});
	}
	
	api.getEventForm = function( id ) {
		return $http({
			method: 'GET',
			url: 'api/getdata?item=eventform&id=' + id
		});
	}
	
	api.saveEventForm = function(eventId, form, choices, deletedelements, deletedchoices ) {
		return $http.post('api/setdata', {eventId: eventId,
										  item: 'eventform',
										  data: form,
										  choices: choices,
										  deletedelements: deletedelements,
										  deletedchoices: deletedchoices});
	}
	
	api.getEventChoices = function( id ) {
		return $http({
			method: 'GET',
			url: 'api/getdata?item=eventchoices&id=' + id
		});
	}
	
	api.deleteEvent = function( id ) {
		return $http({
			method: 'POST',
			url: 'api/doaction?item=deleteevent&id=' + id
		});
	}
    
	// USERS
	api.getUserList = function() {
		return $http({
			method: 'GET',
			url: 'api/getdata?item=userlist'
		});
	}
	
	api.getUser = function( id ) {
		return $http({
			method: 'GET',
			url: 'api/getdata?item=user&id=' + id
		});
	}
	
	api.saveUser = function( user ) {
		return $http.post('api/setdata', {item: 'user', data: user});
	}
	
	api.deleteUser = function( id ) {
		return $http({
			method: 'POST',
			url: 'api/doaction?item=deleteuser&id=' + id
		});
	}
    
    return api;
});

function convertMomentsToDates( e ) {
	if ( e.date && moment.isMoment(e.date))
		e.date = e.date.format("YYYY-MM-DD");
	if ( e.dateEnd && moment.isMoment( e.dateEnd) )
		e.dateEnd = e.dateEnd.format("YYYY-MM-DD");
	if ( e.showEnd && moment.isMoment( e.showEnd ) )
		e.showEnd = e.showEnd.format("YYYY-MM-DD");
	if ( e.showStart && moment.isMoment(e.showStart) )
		e.showStart = e.showStart.format("YYYY-MM-DD");
	if ( e.signupEnd && moment.isMoment(e.signupEnd ))
		e.signupEnd = e.signupEnd.format("YYYY-MM-DD");
	return e;
}