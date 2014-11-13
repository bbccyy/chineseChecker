'use strict';


angular.module('myApp',['ngTouch','ngDraggable'])
  .controller('Ctrl', function ($window, $scope, $log,  $timeout, $interval,
       gameService,  gameLogic) {
      	
    var moveAudio = new Audio('audio/move.wav');
    moveAudio.load();
    
    $scope.map = [
		[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],
		[[0,0],[0,0],[0,0],[0,0],[0,0],[3,13],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],
		[[0,0],[0,0],[0,0],[0,0],[0,0],[4,13],[3.5,12],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],
		[[0,0],[0,0],[0,0],[0,0],[0,0],[5,13],[4.5,12],[4,11],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],
		[[0,0],[0,0],[0,0],[0,0],[0,0],[6,13],[5.5,12],[5,11],[4.5,10],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],
		[[0,0],[9,17],[8.5,16],[8,15],[7.5,14],[7,13],[6.5,12],[6,11],[5.5,10],[5,9],[4.5,8],[4,7],[3.5,6],[3,5],[0,0]],
		[[0,0],[0,0],[9.5,16],[9,15],[8.5,14],[8,13],[7.5,12],[7,11],[6.5,10],[6,9],[5.5,8],[5,7],[4.5,6],[4,5],[0,0]],
		[[0,0],[0,0],[0,0],[10,15],[9.5,14],[9,13],[8.5,12],[8,11],[7.5,10],[7,9],[6.5,8],[6,7],[5.5,6],[5,5],[0,0]],
		[[0,0],[0,0],[0,0],[0,0],[10.5,14],[10,13],[9.5,12],[9,11],[8.5,10],[8,9],[7.5,8],[7,7],[6.5,6],[6,5],[0,0]],
		[[0,0],[0,0],[0,0],[0,0],[0,0],[11,13],[10.5,12],[10,11],[9.5,10],[9,9],[8.5,8],[8,7],[7.5,6],[7,5],[0,0]],
		[[0,0],[0,0],[0,0],[0,0],[0,0],[12,13],[11.5,12],[11,11],[10.5,10],[10,9],[9.5,8],[9,7],[8.5,6],[8,5],[7.5,4],[0,0]],
		[[0,0],[0,0],[0,0],[0,0],[0,0],[13,13],[12.5,12],[12,11],[11.5,10],[11,9],[10.5,8],[10,7],[9.5,6],[9,5],[8.5,4],[8,3],[0,0]],
		[[0,0],[0,0],[0,0],[0,0],[0,0],[14,13],[13.5,12],[13,11],[12.5,10],[12,9],[11.5,8],[11,7],[10.5,6],[10,5],[9.5,4],[9,3],[8.5,2],[0,0]],
		[[0,0],[0,0],[0,0],[0,0],[0,0],[15,13],[14.5,12],[14,11],[13.5,10],[13,9],[12.5,8],[12,7],[11.5,6],[11,5],[10.5,4],[10,3],[9.5,2],[9,1],[0,0]],
		[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[13.5,8],[13,7],[12.5,6],[12,5],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],
		[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[14,7],[13.5,6],[13,5],[0,0]],
		[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[14.5,6],[14,5],[0,0]],
		[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[15,5],[0,0]],
		[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],
		];
		
	$scope.newposition = 50;
    $scope.newpositionTop = 50;
    $scope.setPagePosition = function(index, parentIndex) {
        $scope.newposition =  $scope.map[parentIndex][index][0] * 40.2 - 63 + 'px'
        return $scope.newposition;
    }
    $scope.setPagePositionTop = function(parentIndex, index){
        $scope.newpositionTop = $scope.map[parentIndex][index][1] * 35.6 -19 + 'px'
        return $scope.newpositionTop;
    }
    
    
    function resetAll(){
    	$scope.ani_point = [];
    	$scope.ul = false;
    	$scope.ur = false;
    	$scope.l = false;
    	$scope.r = false;
    	$scope.dl = false;
    	$scope.dr = false;
    	
    	$scope.jul = false;
    	$scope.jur = false;
    	$scope.jl = false;
    	$scope.jr = false;
    	$scope.jdl = false;
    	$scope.jdr = false;
    	
    }

    function updateUI(params) {
      $scope.params = params;
      $scope.board = params.stateAfterMove.board;
      if ($scope.board === undefined) {
        $scope.board = gameLogic.getInitialBoard();
      }else{
      	$timeout(function(){moveAudio.play();},100);
      	//moveAudio.play();
      }
      $scope.isYourTurn = params.turnIndexAfterMove >= 0 && // game is ongoing
        params.yourPlayerIndex === params.turnIndexAfterMove; // it's my turn
      $scope.turnIndex = params.turnIndexAfterMove;
      
      if(params.yourPlayerIndex === -2 ){
      	//do nothing when initial state holds
      }else if(params.yourPlayerIndex === -1){
      	//do nothing when end of game
      }else if(!$scope.isYourTurn && params.playersInfo[params.yourPlayerIndex].playerId !== ''){
      	//setAll(params.move);  // show opponent's movement
      }
      
      if(isChain){
      	makeGameMove(true);
      	
      }else if ($scope.isYourTurn
          && params.playersInfo[params.yourPlayerIndex].playerId === '') {
          $timeout(function(){
          	moveOri = gameLogic.createComputerMove($scope.board, $scope.turnIndex);
         	makeGameMove(true);
          },300);	   
      }
      
      
    }
    
    // Before getting any updateUI message, we show an empty board to a viewer (so you can't perform moves).
    updateUI({stateAfterMove: {}, turnIndexAfterMove: 0, yourPlayerIndex: -2});
    
        
    $scope.selectedPosition = [];
    var moveOri;
    var move;
    var isChain = false;
    var chainValue = [];
    
    $scope.cellClicked = function(row, col) {
    	$log.info(["Clicked on cell: ",row,col]);
    	if(!$scope.isYourTurn){
    		return;
    	}
    	if($scope.selectedPosition.length === 0){
    		if(isNotSelectable(row,col)){
    			return;
    		}
    		$scope.selectedPosition[0] = [row, col];
    		return;
    	}else{
    		if($scope.board[row][col]==($scope.turnIndex==0 ?'O':'X')){
    			if(isNotSelectable(row,col)){
    				return;
    			}
    			$scope.selectedPosition[0] = [row, col];
    			return;
    		}else{
    			$scope.selectedPosition[1] = [row, col];
    		}
    	}
    	try{
    		moveOri = gameLogic.createMove($scope.selectedPosition[0][0],$scope.selectedPosition[0][1],$scope.selectedPosition[1][0],$scope.selectedPosition[1][1],$scope.turnIndex,$scope.board);
    		$scope.isYourTurn = false;
    		makeGameMove(true);
    		$scope.selectedPosition = [];
    	}catch(e){
    	 	$log.info(["It is illegal to move position from:", $scope.oldrow, $scope.oldcol," to position:",row,col]);
    	 	$scope.selectedPosition = [];
    	 	return;
    	}
    };
    
    function setAll(move){
    	resetAll();
    	var row = move[2].set.value.row;
    	var col = move[2].set.value.col;
    	var oldrow = move[2].set.value.oldrow;
    	var oldcol = move[2].set.value.oldcol;
    	$scope.ani_point[0] = oldrow;
    	$scope.ani_point[1] = oldcol;
    	if(row==oldrow && col == oldcol+1){
    		// up left
    		$scope.ul = true;
    	}
    	else if(row==oldrow+1 && col == oldcol+1){
    		// up right
    		$scope.ur = true;
    	}
    	else if(row==oldrow-1 && col == oldcol){
    		// left
    		$scope.l = true;
    	}
    	else if(row==oldrow+1 && col == oldcol){
    		// right
    		$scope.r = true;
    	}
    	else if(row==oldrow-1 && col == oldcol-1){
    		// down left
    		$scope.dl = true;
    	}
    	else if(row==oldrow && col == oldcol-1){
    		// down right
    		$scope.dr = true;
    	}
    	else if(row==oldrow && col == oldcol+2){
    		// jump up left
    		$scope.jul = true;
    	}
    	else if(row==oldrow+2 && col == oldcol+2){
    		// jump up right
    		$scope.jur = true;
    	}
    	else if(row==oldrow-2 && col == oldcol){
    		// jump left
    		$scope.jl = true;
    	}
    	else if(row==oldrow+2 && col == oldcol){
    		// jump right
    		$scope.jr = true;
    	}
    	else if(row==oldrow-2 && col == oldcol-2){
    		// jump down left
    		$scope.jdl = true;
    	}
    	else if(row==oldrow && col == oldcol-2){
    		// jump down right
    		$scope.jdr = true;
    	}
    		
    }
    
    function isNotSelectable(row, col){
    	var possibleMoves = [];
    	var i, j;
    	var tempMove;
    	for(i=1; i<19; i++){
    		for(j=1; j<$scope.board[i].length; j++){
    			try{
    				tempMove = gameLogic.createMove(row, col, i, j, $scope.turnIndex, $scope.board);
    				possibleMoves.push([i,j]);
    			}catch(e){
    				// do something here?
    			}
    		}
    	}
    	if(possibleMoves.length===0){
    		return true;
    	}else{
    		return false;
    	}
    }
    
    
    function checkDragDrop(row, col){
    	$scope.boolboard = angular.copy($scope.board);
    	var possibleMoves = [];
    	var i, j;
    	var tempMove;
    	for(i=0; i<19; i++){
    		for(j=0; j<$scope.boolboard[i].length; j++){
    			$scope.boolboard[i][j] = false;
    			try{
    				tempMove = gameLogic.createMove(row, col, i, j, $scope.turnIndex, $scope.board);
    				possibleMoves.push([i,j]);
    			}catch(e){
    				// do something here?
    			}
    		}
    	}
    	for(i=0; i<possibleMoves.length; i++){
    		$scope.boolboard[possibleMoves[i][0]][possibleMoves[i][1]] = true;
    	}
    }
    
    $scope.onDropCallback = function( event, r, c ){
    	var row = r;
    	var col = c;
    	$scope.cellClicked(row, col);	
    }
    
    $scope.onStartCallback = function( event, r, c ){
    	//console.log(row,col);
    	var row = r;
    	var col = c;
    	$log.info(["drag on cell: ",row, col]);
    	if(!$scope.isYourTurn){
    		return;
    	}
    	$scope.selectedPosition =[];
    	if($scope.selectedPosition.length === 0){
    		$scope.selectedPosition[0] = [row, col];
    		checkDragDrop(row, col);
    		return;
    	}	
    }
    
    
    // pay attantion to WIN condition: endMatch
    function makeGameMove(isDnD){
    	
    		move = angular.copy(moveOri);
    		isChain = angular.copy(moveOri[3].set.value);
    	
    		if(isChain && chainValue.length === 0){
    			chainValue = angular.copy(moveOri[4].set.value);  // initial chainValue when first meet
    		}
    		if(isChain && chainValue.length > 2 && move[0].setTurn===undefined){  // end Match
    			move[0] = {setTurn:{turnIndex: $scope.turnIndex}};
    		}
    		if(isChain && chainValue.length > 2 && move[0].setTurn!==undefined){  // normal
    			move[0].setTurn.turnIndex = $scope.turnIndex;
    		}	
    		if(isChain){  // change the shape of move
    			var row = move[2].set.value.row;
    			var col = move[2].set.value.col;
    			move[1].set.value[row][col] = 'a';
    			move[1].set.value[chainValue[1][0]][chainValue[1][1]] = $scope.turnIndex===0? 'O' : 'X';
    			move[1].set.value[chainValue[0][0]][chainValue[0][1]] = 'a';
    			move[2].set.value.oldrow = chainValue[0][0];
    			move[2].set.value.oldcol = chainValue[0][1];
    			move[2].set.value.row = chainValue[1][0];
    			move[2].set.value.col = chainValue[1][1];
    		}
    		if(chainValue.length > 2){
    			chainValue.reverse();
    			chainValue.pop();
    			chainValue.reverse();	
    		}else{
    		moveOri[3].set.value = false;
    		move[0] = moveOri[0];
    		isChain = false;
    		chainValue = [];
    		}
    		setAll(move);	
    		$timeout(function(){
    			console.log("timeout happens! ");
    			gameService.makeMove(move);},500);
    		
    		
    }
    
    gameService.setGame({
      gameDeveloperEmail: "yoav.zibin@gmail.com",
      minNumberOfPlayers: 2,
      maxNumberOfPlayers: 2,
      //exampleGame: gameLogic.getExampleGame,
      //riddles: gameLogic.getRiddles(),
      isMoveOk: gameLogic.isMoveOk,
      updateUI: updateUI
    });
    
   // scaleBodyService.scaleBody({width: 625, height: 625});
   
  });
