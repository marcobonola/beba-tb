(function () {
    'use strict';

    angular
      .module('angularProjects')
      .controller('RealTimeController', RealTimeController);

    /** @ngInject */
    function RealTimeController($http) {
      var vm = this;

       $http({
         method: 'GET',
         url: 'http://beba-demo-be.netgroup.uniroma2.it/realtime'
       }).then(function successCallback(response) {
         vm.data[0].values = [];
         for (var i = 0; i < response.data["samples"].length; i++) {
           vm.data[0].values.push({
             label: response.data["samples"][i]["ip"],
             value: response.data["samples"][i]["pps"]
           });
         }
       });




      vm.options = {
        chart: {
          type: 'discreteBarChart',
          height: 450,
          width: 1000,
          margin: {
            top: 20,
            right: 20,
            bottom: 50,
            left: 70
          },
          x: function (d) {
            return d.label;
          },
          y: function (d) {
            return d.value;
          },
          showValues: true,

          valueFormat: function (d) {
            return d3.format('d')(d);
          },
          duration: 500,
          xAxis: {
            axisLabel: 'flows'
          },
          yAxis: {
            axisLabel: 'pps',
            tickFormat: function (d) {
              return d3.format('d')(d)
            },
          }
        }
      };

      vm.data = [
        {
          key: "",
          values: []
        }
      ]


      setInterval(function () {

        $http({
          method: 'GET',
          url: 'http://beba-demo-be.netgroup.uniroma2.it/realtime'
        }).then(function successCallback(response) {
          if (response.data["samples"].length === 0) {
            return
          }
          ;

          // this callback will be called asynchronously
          // when the response is available
          console.log("GET OK");
          vm.data[0].values = [];

          for (var i = 0; i < response.data["samples"].length; i++) {
            vm.data[0].values.push({
              label: response.data["samples"][i]["ip"],
              value: response.data["samples"][i]["pps"]
            });
          }

        }, function errorCallback(response) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
          console.log("GET ERROR");
        });

      }, 4000);

      return vm;
    }
  })();
