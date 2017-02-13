function config($stateProvider, $urlRouterProvider ) {
    $urlRouterProvider.otherwise("/index/main");

    $stateProvider

        .state('index', {
            abstract: true,
            url: "/index",
            templateUrl: "views/common/content.html",
        })
        .state('index.main', {
            url: "/main",
            templateUrl: "views/main.html",
            data: { pageTitle: 'Dashboard' }
        })
        .state('index.minor', {
            url: "/minor",
            templateUrl: "views/minor.html",
            data: { pageTitle: 'Example view' }
        })
        .state('index.reports', {
            url: "/reports",
            templateUrl: "views/reports.html",
            data: { pageTitle: 'Report view' }
        })
        .state('index.events', {
            url: "/events",
            templateUrl: "views/events.html",
            data: { pageTitle: 'Manage Events' }
        })
        .state('index.eventedit', {
            url: "/edit/:eventId",
            templateUrl: "views/edit-event.html",
            data: { pageTitle: 'Modify Event' }
        })
        .state('index.eventform', {
            url: "/form/:eventId",
            templateUrl: "views/edit-event-form.html",
            data: { pageTitle: 'Setup Event Form' },
            controller: "EventFormController"
        })
        .state('index.users', {
            url: "/users",
            templateUrl: "views/user-list.html",
            data: { pageTitle: 'Manage Site Users' },
            controller: "UsersController"
        })
        .state('index.useredit', {
            url: "/edituser/:userId",
            templateUrl: "views/edit-user.html",
            data: { pageTitle: 'Modify User' }
        })
        .state('login', {
            url: '/login',
            templateUrl: 'views/login.html',
            controller: 'Login.IndexController',
            controllerAs: 'vm'
        });
}
angular
    .module('hackathon')
    .config(config);
