/**
 * MainCtrl - controller
 */
function MainCtrl($scope) {
    this.userName = 'Example user';
    this.initials = 'Eu';
    this.helloText = 'Welcome to the Dashboard';
    this.descriptionText = 'There will be dashboard items and metrics displayed here.For now, use the menu on the left hand side.';

}

function reportController($scope, $location, apiService, DTOptionsBuilder) {
	$scope.currentReportList = [];
	$scope.pastReportList = [];
    
	$scope.dtOptions = DTOptionsBuilder.newOptions()
    .withDOM('<"html5buttons"B>lTfgitp')
    .withButtons([]);
	
	apiService.getReportList().then( function( response) {
		$scope.currentReportList = response.data.currentReports;
		$scope.pastReportList = response.data.pastReports;
	},
	  function( responseError) {
		if ( responseError.status == 401 ) {
			$location.path('/login');
		}
	});
}

function eventsController($scope, $location, $state, $stateParams, apiService, DTOptionsBuilder){

	$scope.eventsList = [];
	
    $scope.dtOptions = DTOptionsBuilder.newOptions()
        .withDOM('<"html5buttons"B>ftlTg<"html5buttons"B>ip')
        .withButtons([{
            text: 'Add Event',
            action: function ( e, dt, button, config ) {
                $scope.addEvent();
            }
        },
        {
            extend: 'selected',
        	text: 'Modify Event',
        	action: function ( e, dt, button, config ) {
                $scope.editEvent(dt.row( { selected: true } ).data());
            }
        },
        {
            extend: 'selected',
        	text: 'Copy Event',
            action: function ( e, dt, button, config ) {
            	$scope.copyEvent(dt.row( { selected: true } ).data());
            }
        },
        {
            extend: 'selected',
        	text: 'Delete Event',
            action: function ( e, dt, button, config ) {
                if ( confirm('Are you sure you want to delete this event?') ) {
                	$scope.deleteEvent(dt.row( { selected: true } ).data());
                }
            }
        }])
        .withSelect({ 'style':'single','info':false});
 
    $scope.addEvent = function() {
    	$state.go('index.eventedit',{eventId: -1});
    }
    
    $scope.copyEvent = function(event) {
    	apiService.copyEvent(event[0]).then( function( response) {
			$state.go('index.eventedit',{eventId: response.data.id});
			
	    },
		  function( responseError) {
			if ( responseError.status == 401 ) {
				$location.path('/login');
			}
		} );
    }
    
    $scope.editEvent = function(event) {
    	$state.go('index.eventedit', {eventId: event[0]});
    }
    
    $scope.deleteEvent = function(event) {
    	apiService.deleteEvent(event[0]).then( function successCallback( response) {
    		$scope.eventsList = response.data.events;
    	},
    	  function errorCallback( response) {
    		if ( response.status == 401 ) {
    			$location.path('/login');
    		}
    	} );
    }
    
    apiService.getEventList().then( function successCallback( response) {
		$scope.eventsList = response.data.events;
	},
	  function errorCallback( response) {
		if ( response.status == 401 ) {
			$location.path('/login');
		}
	} );
}

function logoModalController( $scope, items, $uibModalInstance ){
	var vm = this;
	vm.eventId = items.id;
    vm.ok = function () {
        $uibModalInstance.close(vm.resImageDataURI.substring(23));
    };

    vm.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

	vm.type = 'rectangle';
    vm.imageDataURI = '';
    vm.resImageDataURI = '';
    vm.resBlob = {};
    vm.urlBlob = {};
    vm.resImgFormat = 'image/jpeg';
    vm.resImgQuality = 1;
//    vm.selMinSize = 100;
//    vm.selInitSize = [{w: 480, h: 300}];
    vm.resImgSize = [{w: 480, h: 300}, {w: 800, h: 500}];
    vm.aspectRatio=1.6;
    vm.filename = '';
    
    vm.handleFileSelect = function (evt) {
	    var file = vm.filename,
	        reader = new FileReader();
	    if (navigator.userAgent.match(/iP(hone|od|ad)/i)) {
	        var canvas = document.createElement('canvas'),
	            mpImg = new MegaPixImage(file);
	
	        canvas.width = mpImg.srcImage.width;
	        canvas.height = mpImg.srcImage.height;
	
	        EXIF.getData(file, function () {
	            var orientation = EXIF.getTag(this, 'Orientation');
	
	            mpImg.render(canvas, {
	                maxHeight: $scope.resImgSize,
	                orientation: orientation
	            });
	            setTimeout(function () {
	                var tt = canvas.toDataURL("image/jpeg", 1);
	                $scope.$apply(function ($scope) {
	                    $scope.imageDataURI = tt;
	                });
	            }, 100);
	        });
	    } else {
	        reader.onload = function (evt) {
	            $scope.$apply(function ($scope) {
	                vm.imageDataURI = evt.target.result;
	            });
	        };
	        reader.readAsDataURL(file);
	    }
	};
}

function eventDetailController($scope, $location, $state, $stateParams, $uibModal, apiService){

	$scope.event = {};
	$scope.eventId = $stateParams.eventId;
	
	$scope.editLogo = function() {
		modalInstance = $uibModal.open({
		      controller: 'logoModalController',
		      controllerAs: 'vm',
		      templateUrl : 'views/modal-logo.html',
	          windowClass: "animated bounceInRight",
	          backdrop: 'static',
		      resolve: {
		        items: function() {
		          return {
		            id: $scope.eventId,
		            logo: $scope.event.logo
		          };
		        }
		      }
		    });
		modalInstance.result.then(function (logo) {
			  $scope.event.logo = logo;
			  $scope.event.savedlogo = true;
			}, function () {
			});
	}
	
    $scope.editForm = function() {
    	apiService.saveEvent( $scope.event ).then( function( response ) {
        	$state.go('index.eventform', {eventId: response.data.id});
    	},
  	     function( responseError) {
    		if ( responseError.status == 401 ) {
    			$location.path('/login');
    		}
    	} );
    }
	
	$scope.cancelChanges = function() {
   		$state.go('index.events');
    }
	
    $scope.saveChanges = function() {
    	apiService.saveEvent( $scope.event ).then( function( response ) {
    		$state.go('index.events');
    	},
  	     function( responseError) {
    		if ( responseError.status == 401 ) {
    			$location.path('/login');
    		}
    	} );
    }
    
    if ( $scope.eventId != -1 ) {
	    apiService.getEvent($scope.eventId).then( function( response) {
			$scope.event = datesToMoments(response.data);
			
	    },
		  function( responseError) {
			if ( responseError.status == 401 ) {
				$location.path('/login');
			}
		} );
    }
}

function eventFormController($scope, $location, $state, $stateParams, apiService){

	$scope.event = {};
	$scope.formelements = [];
	$scope.selected = {};
	$scope.deletedelements = [];
	$scope.deletedchoices = [];
	$scope.selectedchoices = [];
	$scope.elementchoices = [];
	$scope.newelementid = -1;
	$scope.controls = [{name: 'Text Field', fieldType: 'Text', icon: 'fa-font'},
	                   {name: 'Range', fieldType: 'Range', icon: 'fa-sliders'},
	                   {name: 'Phone', fieldType: 'Phone', icon: 'fa-phone-square'},
	                   {name: 'Email', fieldType: 'Email', icon: 'fa-envelope-square'},
	                   {name: 'Checkbox', fieldType: 'CheckBox', icon: 'fa-check-square-o'},
	                   {name: 'Multiple Choice', fieldType: 'MultiChoice', icon: 'fa-list'}];
	$scope.eventId = $stateParams.eventId;
	
    $scope.sortableOptions = {
        connectWith: ".connectList"
    };
	
    $scope.select = function(element) {
    	$scope.selected = element;
		$scope.selectedchoices = [];
    	if ( element.fieldType == 'MultiChoice') {
    		$scope.selectedchoices = $scope.elementchoices["id"+element.id];
    	}
    }
    
    $scope.addChoice = function() {
    	$scope.selectedchoices.push({name: '',
    								 eOrder: $scope.selectedchoices.length,
    								 dataId: $scope.selected.id,
    								 id: -1});
    }
    
    $scope.addElement = function(control) {
    	var item = {name: '',
				  required: false,
				  fieldType: control.fieldType,
				  eventId: $scope.eventId,
				  eOrder: $scope.formelements.length,
				  desc: '',
				  icon: control.icon,
				  defaultValue: '',
				  choices: '',
				  id: $scope.newelementid };
    	$scope.newelementid--;
    	if ( control.fieldType == 'Range') {
    		item.rangeLow = 1;
    		item.rangeHigh = 10;
    		item.defaultValue = 2;
    	}
    	if ( control.fieldType == 'MultiChoice') {
    		$scope.elementchoices["id"+item.id] = [];
    		$scope.selectedchoices = $scope.elementchoices["id"+item.id];
    	}
    	$scope.formelements.push(item);
    	$scope.selected = item;
    }
    
	$scope.cancelChanges = function() {
		$state.go('index.eventedit', {eventId: $scope.eventId});
    }
	
    $scope.saveChanges = function() {
    	for ( var i = 0; i < $scope.formelements.length; i++ ) {
    		$scope.formelements[i].eOrder = i+1;
    	}
    	Object.keys($scope.elementchoices).forEach(function(key,index) {
    		var list = $scope.elementchoices[key];
    		for ( var j = 0; j < list.length; j++ ) {
    			list[j].eOrder = j+1;	
    		}
    	});
    	apiService.saveEventForm($scope.eventId, $scope.formelements, $scope.elementchoices, $scope.deletedelements, $scope.deletedchoices ).then( function( response ) {
    		$state.go('index.eventedit', {eventId: $scope.eventId});
    	},
  	     function( responseError) {
    		if ( responseError.status == 401 ) {
    			$location.path('/login');
    		}
    	} );
    }
    
    $scope.deleteElement = function( element ) {
    	if ( element == $scope.selected ) {
    		$scope.selected = {};
    	}
    	if ( element.id >= 0 ) {
        	$scope.deletedelements.push( element.id );
    	}
    	var i = $.inArray(element, $scope.formelements);
    	$scope.formelements.splice(i,1);
    }
    
    $scope.deleteChoice = function( choice ) {
    	if ( choice.id >= 0 ) {
    		$scope.deletedchoices.push( choice.id );
    	}
    	var i = $.inArray(choice, $scope.selectedchoices);
    	$scope.selectedchoices.splice(i,1);
    }
    
    if ( $scope.eventId != -1 ){
	    apiService.getEvent($scope.eventId).then( function( response) {
			$scope.event = response.data;
	    },
		  function( responseError) {
			if ( responseError.status == 401 ) {
				$location.path('/login');
			}
		} );
	    apiService.getEventForm($scope.eventId).then( function( response) {
			$scope.formelements = response.data;
			for ( var i = 0; i < $scope.formelements.length; i++ ) {
				var el = $scope.formelements[i];
				el.icon = getControlIcon( $scope.controls, el.fieldType);
				if ( el.fieldType == 'Range') {
					var vals = el.choices.split('-');
					if ( vals.length > 0 ) {
						el.rangeLow = parseInt(vals[0]);
						el.rangeHigh = parseInt(vals[1]);
					}
				}
			}
	    },
		  function( responseError) {
			if ( responseError.status == 401 ) {
				$location.path('/login');
			}
		} );
	    apiService.getEventChoices($scope.eventId).then( function( response) {
			$scope.elementchoices = response.data;
	    },
		  function( responseError) {
			if ( responseError.status == 401 ) {
				$location.path('/login');
			}
		} );
    }
}

function usersController($scope, $location, $state, $stateParams, apiService, DTOptionsBuilder){

	$scope.userList = [];
	
    $scope.dtOptions = DTOptionsBuilder.newOptions()
        .withDOM('<"html5buttons"B>ftlTg<"html5buttons"B>ip')
        .withButtons([{
            text: 'Add User',
            action: function ( e, dt, button, config ) {
                $scope.addUser();
            }
        },
        {
            extend: 'selected',
        	text: 'Modify User',
        	action: function ( e, dt, button, config ) {
                $scope.editUser(dt.row( { selected: true } ).data());
            }
        },
        {
            extend: 'selected',
        	text: 'Delete User',
            action: function ( e, dt, button, config ) {
                if ( confirm('Are you sure you want to delete this user?') ) {
                	$scope.deleteUser(dt.row( { selected: true } ).data());
                }
            }
        }])
        .withSelect({ 'style':'single','info':false});
 
    $scope.addUser = function() {
    	$state.go('index.useredit',{userId: -1});
    }
    
    $scope.editUser = function(user) {
    	$state.go('index.useredit', {userId: user[0]});
    }
    
    $scope.deleteUser = function(user) {
    	apiService.deleteUser(user[0]).then( function successCallback( response) {
    		$scope.userList = response.data;
    	},
    	  function errorCallback( response) {
    		if ( response.status == 401 ) {
    			$location.path('/login');
    		}
    	} );
    }
    
    apiService.getUserList().then( function successCallback( response) {
		$scope.userList = response.data;
	},
	  function errorCallback( response) {
		if ( response.status == 401 ) {
			$location.path('/login');
		}
	} );
}

function userDetailController($scope, $location, $state, $stateParams, $uibModal, apiService){

	$scope.user = {};
	$scope.userId = $stateParams.userId;
	$scope.oldpassword = '';
	
	$scope.cancelChanges = function() {
   		$state.go('index.users');
    }
	
    $scope.saveChanges = function() {
    	if ( $scope.user.password != $scope.user.password2 && $scope.user.password != $scope.oldpassword ) {
    		alert('The 2 password fields do not match. Please re-enter passwords.');
    		return;
    	}
    	if ( $scope.user.password.length == 0 && $scope.password.length == 0 ) {
    		alert('Please enter a password.');
    		return;
    	}
    	
    	// if field was cleared, just resave what we had
    	if ( $scope.user.password.length == 0) {
    		$scope.user.password = $scope.oldpassword;
    	}
    	
    	// if this is new, crypto it
    	if ($scope.user.password2 && $scope.user.password2.length > 0 ) {
    		$scope.user.password = CryptoJS.SHA256($scope.user.password).toString();
    	}
    	delete $scope.user.password2;
    	
    	apiService.saveUser( $scope.user ).then( function( response ) {
    		$state.go('index.users');
    	},
  	     function( responseError) {
    		if ( responseError.status == 401 ) {
    			$location.path('/login');
    		}
    	} );
    }
    
    if ( $scope.userId != -1 ) {
	    apiService.getUser($scope.userId).then( function( response ) {
			$scope.user = response.data;
			$scope.oldpassword = $scope.user.password;
			
	    },
		  function( responseError) {
			if ( responseError.status == 401 ) {
				$location.path('/login');
			}
		} );
    }
}

angular
    .module('hackathon')
    .controller('MainCtrl', MainCtrl)
    .controller('Reports', reportController)
    .controller('EventsController', eventsController)
    .controller('EventDetailController', eventDetailController)
    .controller('logoModalController',logoModalController)
    .controller('EventFormController',eventFormController)
    .controller('UsersController',usersController)
    .controller('UserDetailController', userDetailController);
	
 
