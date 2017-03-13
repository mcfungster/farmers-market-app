angular.module('farmer.accordianController', ['farmer.services'])

  .controller('AccordianCtrl', function ($scope, $location, $mdDialog, Search) {
    var accordianController = this

    $scope.selectedMarketIndex = undefined;

    $scope.selectMarketIndex = function (index) {
      if ($scope.selectedMarketIndex !== index) {
        $scope.selectedMarketIndex = index;
      } else {
        $scope.selectedMarketIndex = undefined;
      }
    };

    $scope.comment = ''
    
    // TODO: add author field
    $scope.author = 'Peter'
    $scope.comments = []
    var arr

    $scope.submitComment = function (id) {
      const newComment = {
        id,
        author: $scope.author,
        comment: $scope.comment
      }
      Search.sendNewComment(newComment)
        .then(data => {
          arr = data.Comment
          // console.log('line 30:  ', $scope.comments);

        })
        .catch(err => console.error(err))
    }

  })
