function StickerCtrl($scope,$http)
{

	$http.get('/stickers').success(
		function(data){
			$scope.stickers = data;
		})//success

} //End of StickerCtrl