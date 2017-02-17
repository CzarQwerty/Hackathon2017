/**
 * MainCtrl - controller
 */
function MainCtrl($scope) {
    this.userName = 'Example user';
    this.initials = 'Eu';
    this.helloText = 'Welcome to the Dashboard';
    this.descriptionText = 'There will be dashboard items and metrics displayed here.For now, use the menu on the left hand side.';
    this.event = {};
}

angular
    .module('hackathon')
    .controller('MainCtrl', MainCtrl);
	
 
