angular.module('Euler', ['ngResource']);

function ProblemCtrl($scope, $resource) {
  var problem_resource = $resource('/v1/problems/:id');

  $scope.problem_list = problem_resource.query();

  $scope.problem = new problem_resource();

  $scope.save = function() {
    $scope.problem.$save();
    $scope.problem_list.push($scope.problem);
    $scope.problem = new problem_resource();
  };
}