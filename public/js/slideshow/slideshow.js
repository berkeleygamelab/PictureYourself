var scope;

function SlideshowCtrl($scope, $http){
    scope = $scope;
    $http.get('/getCollages').success(function(data){
        console.log(data);
        $scope.date = Date.now();
        $scope.collages = data;
    });

    // Received from LayoutCtrl
    // $scope.$on('updateCollages', function(event, data){
    //     console.log("Slideshow updateCollages");
    //     $scope.collages.push(data);
    // });

    // var show = function(el){
    //     return function(msg){ el.innerHTML = msg + '<br />' + el.innerHTML; }
    // }(document.getElementById('msgs'));

//     var ws = new WebSocket('ws://' + window.location.host + window.location.pathname);
//     ws.onopen = function(m){      
//         console.log("Open") 
//     }
//     ws.onclose = function(){
//         console.log("Close")
//     }
//     ws.onmessage = function(m){
//         console.log("Message")
//         console.log(this);
//         // console.log(m.data);  
//         // $scope.$apply(function(){
//         $scope.date = Date.now();
//         $scope.collages = m.data;
//         // })
// // 
//     }
//     console.log($scope.date);
//     console.log($scope.collages);

    // var sender = function(f){
    //     var input = document.getElementById('input');
    //     input.onclick = function(){ input.value = "" };
    //     f.onsubmit = function(){
    //         ws.send(input.value);
    //         input.value = "send a message";
    //         return false;
    //     }
    // }(document.getElementById('form'));
}