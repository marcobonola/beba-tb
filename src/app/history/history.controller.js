(function () {
  'use strict';

  angular
    .module('angularProjects')
    .controller('HistoryController', HistoryController);

  /** @ngInject */
  function HistoryController($scope, $http) {
    var vm = this;

    vm.ips = [];
    vm.data = [{values: [], key: 'selected flow'}];


    $http({
      method: 'GET',
      url: 'http://capoccina.netgroup.uniroma2.it:5000/history'
    }).then(function successCallback(response) {
      // this callback will be called asynchronously
      // when the response is availabl
      console.log("GET OK");
      vm.ips = response.data["ip_list"];
    }, function errorCallback(response) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
      console.log("GET ERROR");
    });


    vm.getSelectedText = function () {
      if (vm.selectedItem !== undefined) {
        return vm.selectedItem;
      } else {
        return "Please select a flow";
      }
    };

    vm.options = {
      chart: {
        type: 'lineChart',
        height: 400,
        width: 1000,
        yDomain: [0, 10000],
        margin: {
          top: 20,
          right: 20,
          bottom: 40,
          left: 55
        },
        x: function (d) {
          if (d!== undefined) {return d.x} else {return null};
        },
        y: function (d) {
          if (d!== undefined) {return d.y} else {return null};
        },
        useInteractiveGuideline: true,
        duration: 0,
        yAxis: {
          tickFormat: function (d) {
            return d3.format('1f')(d);
          }
        }
      }
    };





    setInterval(function () {
      if (vm.x_min === undefined) {vm.xmin = 0};

      if (vm.selectedItem !== undefined) {
        var lastTS;
        if (vm.data[0].values.length != 0) {
          lastTS = vm.data[0].values[vm.data[0].values.length-1]["x"]+ vm.x_min;
        }
        else {
          lastTS = 0;
        }

        $http({
          method: 'GET',
          url: 'http://capoccina.netgroup.uniroma2.it:5000/flowhistory?ip='+vm.selectedItem+'&ts='+lastTS
      }).then(function successCallback(response) {
          if (response.data["samples"].length === 0) {return};

          // this callback will be called asynchronously
          // when the response is available
          console.log("GET OK");
          if (vm.x_min === 0) {vm.x_min = response.data["samples"][0]["ts"]};
          for (var i = 0; i < response.data["samples"].length; i++) {
            vm.data[0].values.push({x:response.data["samples"][i]["ts"]-vm.x_min, y:response.data["samples"][i]["pps"]});
            if (vm.data[0].values.length > 30) vm.data[0].values.shift();
          }

          var ymax = 0;
          for (var i= 0; i<vm.data[0].values.length; i++) {
            if (vm.data[0].values[i].y > ymax) {
              ymax = vm.data[0].values[i].y;
            }
          }
          vm.options.chart.yDomain=[0,ymax+(ymax*.1)];

        }, function errorCallback(response) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
          console.log("GET ERROR");
        });
      } else {
        return "Please select a flow";
      }

    }, 2000);

    vm.onSelectedFlowChange = function (){
      vm.x_min = 0;
      vm.data[0].values = [];
    };
  }
})();
