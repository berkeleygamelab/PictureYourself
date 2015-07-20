//Helper functions related to emailing.

// Called from scenario.js in $scope.call_email
function email($scope, $http, formData, emails){
    $http.post('/collages', formData).success(function(data){
        send_email($scope, $http, emails, data);
    }).error(function(){
        $scope.show_saving_email = false;
        $scope.show_emailed = true;
        $('#emailModal').modal('hide');
        $('#scenario_ctrl').css('pointer-events', '');
    });
}

function send_email($scope, $http, emails, data){
    formData = {"emails": emails, "fileName": data};
    $http.post('/email', formData).success(function(data){
        $scope.show_saving_email = false;
        $scope.show_emailed = true;
        $('#scenario_ctrl').css('pointer-events', '');
    }).error(function(){
        alert("Something went wrong");
        $('#emailModal').modal('hide');
        $('#scenario_ctrl').css('pointer-events', '');
    });
}
