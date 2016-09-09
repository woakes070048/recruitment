/* global $:false */
(function () {
  'use strict';

  angular
    .module('companies')
    .controller('CompaniesMultipleController', CompaniesMultipleController);

  CompaniesMultipleController.$inject = ['$scope', 'CompaniesService', '$http'];

  function CompaniesMultipleController($scope, CompaniesService, $http) {
    var vm = this;


    vm.companies = CompaniesService.query();
    vm.companyUrl = 'http://dv.jexpo.se/exhibitors?namespace=arkad_test&limit=0&sort=name';

    vm.fetchedCompanies = [];
    
    $scope.fetchJson = function(){
      var file = $('input[type=file]')[0].files[0];

      var fr = new FileReader();
      function receivedText() {
        console.log(vm.fetchedCompanies);
        vm.fetchedCompanies = JSON.parse(fr.result);
        console.log(vm.fetchedCompanies);
      }   
      fr.onload = receivedText;
      fr.readAsText(file);
    };



    $('#upload').change(function(evt, params){
      console.log(JSON.stringify(evt));
    });
  
    $scope.fileSelected = function(evt, params) {
      console.log(evt); 
      console.log(params); 
      console.log(vm.file); 
    };
  

    $scope.fetchCompanies = function() {
      if(!vm.companyUrl.length || vm.companyUrl.length < 3){
        vm.urlError = 'Please fill in a url';
        return;
      }
      $http({
        method: 'GET',
        url: vm.companyUrl
      }).then(function successCallback(response) {
        console.log(response);
        vm.fetchedCompanies = response.data;
        vm.msg = 'Successfully loaded ' + response.data.length + ' companies';
      }, function errorCallback(response) {
        console.log(response);
        vm.error = response;
      });
    };

    // Be careful, quite strong method.
    $scope.deleteCompanies = function removeAllOldCompanies() {
      vm.companies.forEach(function (c){
        var comp = new CompaniesService(c);
        comp.$delete();
      });
      vm.msg = 'Deleted ALL companies, hurray!';
    };

    // Be careful, quite strong method.
    $scope.saveFetchedCompanies = function saveFetchedCompanies() {
      
      // JS sucks, no good check of objects attribute in array, so i map here.
      var cName = [];
      vm.companies.forEach(function (c){
        cName.push(c.name);
      });      

      function successCallback (response){
        console.log('Success!');
      }
      function errorCallback (response){
        console.log('Error!');
        vm.msg = 'Error occurred when saving companies, contact IT';
      }
      vm.fetchedCompanies.forEach(function(fc){
        // Check that company doesnt already exist. Assumes unique name.
        if(cName.indexOf(fc.name) < 0){
          CompaniesService.post({ name: fc.name, desiredProgramme: fc.profile.desiredProgramme }, successCallback);
        }
      });
      vm.msg = 'Successfully saved all fetched companies';
    };

    


  }
})();
