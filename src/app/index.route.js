(function() {
  'use strict';

  angular
    .module('angularProjects')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('realtime', {
        url: '/realtime',
        templateUrl: 'app/realtime/realtime.html',
        controller: 'RealTimeController',
        controllerAs: 'realtime'
      });


    $stateProvider
      .state('history', {
        url: '/history',
        templateUrl: 'app/history/history.html',
        controller: 'HistoryController',
        controllerAs: 'history'
      });

    $urlRouterProvider.otherwise('/realtime');
  }

})();
