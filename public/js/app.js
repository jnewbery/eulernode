angular.module('Euler', ['ngResource']);

function ProblemCtrl($scope, $resource) {
  var problem_resource = $resource('/v1/problems/:id');

  $scope.problem_list = problem_resource.query();
}