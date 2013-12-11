function TabsCtrl($scope, $http){
	$scope.tabs = {'stickers':true,'backgrounds':false,'filters':false,'frames':false}

	$scope.show_tab = function(category){
		//console.log("category: " + category)
		angular.forEach($scope.tabs,function(value,tab){
			if(tab == category){
				$scope.tabs[category] = true;
			}
			else{
				$scope.tabs[tab] = false;
			}
			// console.log(tab + ' == ' + category + " is " + (tab == category))
			// console.log('tab: ' + tab + " = " + value)
		})
	}//show_tab



}