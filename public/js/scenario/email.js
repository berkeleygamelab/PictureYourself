//Stuff related to emailing will get moved here

function email($scope, $http, formData, emails){
    console.log(formData);
    console.log(emails);
    $http.post('/saveToGallery', formData).success(function(data){
        console.log(data);
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
    $http.post('/send_email', formData).success(function(data){
        console.log("here");
        $scope.show_saving_email = false;
        $scope.show_emailed = true;
        console.log(":o")
        $('#scenario_ctrl').css('pointer-events', '');   
    }).error(function(){
        alert("Something went wrong");
        $('#emailModal').modal('hide');
        $('#scenario_ctrl').css('pointer-events', '');   
    });
}
