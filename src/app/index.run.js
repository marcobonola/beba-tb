(function() {
  'use strict';

  angular
    .module('angularProjects')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log) {

    $log.debug('runBlock end');
  }

})();
