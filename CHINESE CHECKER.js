//alert("hello world");
var position = {
board: [
['','','','','','','','','','','','','','',''],
['','','','','','a','','','','','','','','',''],
['','','','','','a','a','','','','','','','',''],
['','','','','','a','a','a','','','','','','',''],
['','','','','','a','a','a','a','','','','','','','','',''],
['','o','o','o','o','a','a','a','a','a','a','a','a','a',''],
['','','o','o','o','a','a','a','a','a','a','a','a','a',''],
['','','','o','o','a','a','a','a','a','a','a','a','a',''],
['','','','','o','a','a','a','a','a','a','a','a','a',''],
['','','','','','a','a','a','a','a','a','a','a','a',''],
['','','','','','a','a','a','a','a','a','a','a','a','x',''],
['','','','','','a','a','a','a','a','a','a','a','a','x','x',''],
['','','','','','a','a','a','a','a','a','a','a','a','x','x','x',''],
['','','','','','a','a','a','a','a','a','a','a','a','x','x','x','x',''],
['','','','','','','','','','','a','a','a','a','','','','','','','',''],
['','','','','','','','','','','','a','a','a',''],
['','','','','','','','','','','','','a','a',''],
['','','','','','','','','','','','','','a',''],
['','','','','','','','','','','','','','',''],
],
stateBeforeMove: {
	turnIndexBeforeMove: 0,
	board: [],
	delta: [],
},
move: [],   // "row,col,oldrow,oldcol"	 also know as delta
currentIndex: 1,
createNew : function(){
	var boardHandler = {};
	boardHandler.checkPosition = function(row,col){
		if(position.board[row][col] === '' || position.board[row][col] === undefined){
			console.log("The position of row: " + row + "and col: " + col + "has been outside of the board!");
			return false;
		}else{
			return true;
		}
	};
	//	make sure to check the Position before seting it
	boardHandler.setPosition = function(oldrow,oldcol,row,col,turnIndex){
		if(turnIndex != position.stateBeforeMove.turnIndexBeforeMove
			|| turnIndex == position.currentIndex ){
			console.log("currentIndex doesn't match!");
			return false;
		}
		position.stateBeforeMove.board = JSON.parse(JSON.stringify(position.board));  //copy board before set movement
		position.stateBeforeMove.delta = JSON.parse(JSON.stringify(position.move));	  //copy delta before set movement
		
		position.board[row][col] = turnIndex==0?'o' : 'x';	//turnIndex => 0 than 'o', turnIndex => 1 than 'x'
		if(position.board[oldrow][oldcol]==position.board[row][col]){
			position.board[oldrow][oldcol] = 'a';
			}else{
				console.log("The original position is unacceptable!");
				return false;
			}
		
		position.stateBeforeMove.turnIndexBeforeMove = position.currentIndex;  // update Index
		position.currentIndex = turnIndex;
		
		position.move = [oldrow, oldcol, row, col];  // update current delta
		
		//console.log(position.board[row][col]);
		return true;
	};
	boardHandler.setPositionAll= function(Parray){
		var i;
		for(i=0; i<Parray.length; i++){
			boardHandler.setPosition(Parray[i][0],Parray[i][1],Parray[i][2],Parray[i][3],Parray[i][4]);
		}
	};
	boardHandler.showBoard = function(){
		console.log(JSON.stringify(position.board));
	};
	return boardHandler;
}
};


var isMoveOk = (function () {
	
	function getWinner(board){
	var winStringX = JSON.stringify(
		  board[5][1] 
		+ board[5][2] + board[6][2]
		+ board[5][3] + board[6][3] + board[7][3]
		+ board[5][4] + board[6][4] + board[7][4] + board[8][4]
	);
	if (winStringX === JSON.stringify("xxxxxxxxxx")){
		return "x";
	}
	var winStringO = JSON.stringify(
		  board[13][17] 
		+ board[12][16] + board[13][16]
		+ board[11][15] + board[12][15] + board[13][15]
		+ board[10][14] + board[11][14] + board[12][14] + board[13][14]
	);
	if (winStringO === JSON.stringify("oooooooooo")){
		return "o";
	}
	return '';
	}

function getState(oldrow,oldcol,row,col,turnIndex){ 
  var pos = position.createNew();
  if (pos.checkPosition(row,col) == true){  // checkPosition 01 - boundary
  	if(pos.setPosition(oldrow,oldcol,row,col,turnIndex) === false){
  		return false;
  	}
  }
  else
  	return false;	//any function need to check the return value in case of 'false'
  return position;
}


function isEqual(object1, object2) {
    return JSON.stringify(object1) === JSON.stringify(object2);
  }


function isOneStepMove(position){
	var location = position.move;
	var oldrow = location[0];
	var oldcol = location[1];
	var row = location[2];
	var col = location[3];
	if( (Math.abs(oldrow-row)+Math.abs(oldcol-col))==1 ){
		console.log("move is one step around location");
		return true;
	}
	else if( (row==oldrow+1 && col==oldcol+1) || (row==oldrow-1 && col==oldcol-1) ){
		console.log("move is one step around location");
		return true;
	}else{
		console.log("move takes more steps around location");
		return false;
	}
}


function Jump(row,col,board) {
	var pointPool = new Array();
	var i = 0;
	if(board[row][col+1] != '' && board[row][col+1] != 'a'){
		if(board[row][col+2] == 'a'){
			pointPool[i] = [row,col+2];
			i+=1;
		}
	}
	if(board[row+1][col+1] != '' && board[row+1][col+1] != 'a'){
		if(board[row+2][col+2] == 'a'){
			pointPool[i] = [row+2,col+2];
			i+=1;
		}
	}
	if(board[row+1][col] != '' && board[row+1][col] != 'a'){
		if(board[row+2][col] == 'a'){
			pointPool[i] = [row+2,col];
			i+=1;
		}
	}
	if(board[row][col-1] != '' && board[row][col-1] != 'a'){
		if(board[row][col-2] == 'a'){
			pointPool[i] = [row,col-2];
			i+=1;
		}
	}
	if(board[row-1][col-1] != '' && board[row-1][col-1] != 'a'){
		if(board[row-2][col-2] == 'a'){
			pointPool[i] = [row-2,col-2];
			i+=1;
		}
	}
	if(board[row-1][col] != '' && board[row-1][col] != 'a'){
		if(board[row-2][col] == 'a'){
			pointPool[i] = [row-2,col];
		}
	}
	return pointPool;
}


function isContain(arr,value) {
	for(var i=0; i<arr.length; i++){
		if(arr[i][0] == value[0] && arr[i][1] == value[1]){
			return true;
		}
	}
	return false;
}


function isMultiStepMoves(position){
	var location = position.move;
	var oldrow = location[0];
	var oldcol = location[1];
	var row = location[2];
	var col = location[3];
	var boardBeforeMove = position.stateBeforeMove.board;
	var key = true;
	var _row;
	var _col;
	var tempPool;
	var pointPool = new Array();
	pointPool[0] = [oldrow,oldcol,true];
	while(true){
	 	key = false;
		for(var i=0; i<pointPool.length; i++){
			if(pointPool[i][2] == true){
				_row = pointPool[i][0];
				_col = pointPool[i][1];
				pointPool[i][2] = false;
				key = true;
				break;
			}
		}
		if(key == false){
			//do something before break
			break;
		}
		tempPool = Jump(_row,_col,boardBeforeMove);
		if(tempPool.length == 0){
			continue;
		}
		for(var j=0; j<tempPool.length; j++){
			if(isContain(pointPool,tempPool[j])==true){
				continue;
			}
			pointPool[pointPool.length] = [tempPool[j][0],tempPool[j][1],true];
		}
		if(isContain(pointPool,[row,col]) == true){
			return true;
		}	
	}
	return false;	
}


function isMoveOk(position){
	if(position == false){
		console.log("cannot set the board");
		return false;
	}
	
	try{
		var deltaValue = position.move;
		var turnIndexBeforeMove = position.stateBeforeMove.turnIndexBeforeMove;
		var boardBeforeMove = JSON.parse(JSON.stringify(position.stateBeforeMove.board));  //copy board
		var boardAfterMove = position.board;
		var deltaBeforeMove = position.stateBeforeMove.delta;
		var oldrow = deltaValue[0];
		var oldcol = deltaValue[1];
		var row = deltaValue[2];
		var col = deltaValue[3];
		var currentIndex = position.currentIndex;
		boardBeforeMove[row][col] = currentIndex==0?'o' : 'x';
		boardBeforeMove[oldrow][oldcol] = 'a';
		var expectedMove = boardBeforeMove;
		if(!isEqual(boardAfterMove, expectedMove)){
			return false;
		}
		if (isOneStepMove(position)==true){
			console.log("single movement");
			var winner = getWinner(boardAfterMove);
			if(winner != ''){
				return winner;
			}
			return true;
		}
		if(isMultiStepMoves(position)==true){
			console.log("multiple movements");
			var winner = getWinner(boardAfterMove);
			if(winner != ''){
				return winner;
			}
			return true;
		}
		else{
			return false;
		}
	} catch(e) {
		return false;
	}
  }
  console.log(isMoveOk(getState(6,4,7,5,0)));
  console.log(isMoveOk(getState(11,15,11,13,1)));
  console.log(isMoveOk(getState(7,4,7,6,0)));
  console.log(isMoveOk(getState(12,14,10,12,1)));
  console.log(JSON.stringify(position.board));
return isMoveOk;
})();








