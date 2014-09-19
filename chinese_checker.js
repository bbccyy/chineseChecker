// write by yixun wang
/*
	     x-axis 7         7 y-axis
                 / 6	     |6
		/ 5	     |5
	       / 4  	     |4
	      / 3	     |3
	     / 2             |2
	    / 1		     |1
      x-axis 0 		      0 y-axis
*/
var isMoveOk = (function () {
	
	function getWinner(board){
	var winStringX = JSON.stringify(
		  board[5][1] 
		+ board[5][2] + board[6][2]
		+ board[5][3] + board[6][3] + board[7][3]
		+ board[5][4] + board[6][4] + board[7][4] + board[8][4]
	);
	if (winStringX === JSON.stringify("XXXXXXXXXX")){
		return "X";
	}
	var winStringO = JSON.stringify(
		  board[13][17] 
		+ board[12][16] + board[13][16]
		+ board[11][15] + board[12][15] + board[13][15]
		+ board[10][14] + board[11][14] + board[12][14] + board[13][14]
	);
	if (winStringO === JSON.stringify("OOOOOOOOOO")){
		return "O";
	}
	return '';
	}




function isEqual(object1, object2) {
    return JSON.stringify(object1) === JSON.stringify(object2);
  }


function checkPosition(row,col,board){
	if(board[row][col] === '' || board[row][col] === undefined){
			console.log("The position of row: " + row + "and col: " + col + "has been outside of the board!");
			return false;
		}else{
			return true;
		}
}


function isOneStepMove(oldrow,oldcol,row,col){
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


function isMultiStepMoves(oldrow,oldcol,row,col,boardBeforeMove){
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


function createMove(oldrow,oldcol,row,col,turnIndexBeforeMove,boardBeforeMove,turnIndex){ 
	
	if(boardBeforeMove === undefined) {
		boardBeforeMove = [
		['','','','','','','','','','','','','','',''],
		['','','','','','a','','','','','','','','',''],
		['','','','','','a','a','','','','','','','',''],
		['','','','','','a','a','a','','','','','','',''],
		['','','','','','a','a','a','a','','','','','','','','',''],
		['','O','O','O','O','a','a','a','a','a','a','a','a','a',''],
		['','','O','O','O','a','a','a','a','a','a','a','a','a',''],
		['','','','O','O','a','a','a','a','a','a','a','a','a',''],
		['','','','','O','a','a','a','a','a','a','a','a','a',''],
		['','','','','','a','a','a','a','a','a','a','a','a',''],
		['','','','','','a','a','a','a','a','a','a','a','a','X',''],
		['','','','','','a','a','a','a','a','a','a','a','a','X','X',''],
		['','','','','','a','a','a','a','a','a','a','a','a','X','X','X',''],
		['','','','','','a','a','a','a','a','a','a','a','a','X','X','X','X',''],
		['','','','','','','','','','','a','a','a','a','','','','','','','',''],
		['','','','','','','','','','','','a','a','a',''],
		['','','','','','','','','','','','','a','a',''],
		['','','','','','','','','','','','','','a',''],
		['','','','','','','','','','','','','','','']
		];
	}
	
    //check the correctness of movement
 	if (checkPosition(row,col,boardBeforeMove) === false){  // checkPosition 01 - boundary
  		throw new Error("One can not make a move outside of the board!");
  	}
  	if(boardBeforeMove[row][col] !== 'a'){
  		throw new Error("One can only make a move in an empty position!");
  	}
  	var boardAfterMove = JSON.parse(JSON.stringify(boardBeforeMove));
  	boardAfterMove[row][col] = turnIndexBeforeMove===0?'O' : 'X';	    //Index => 0 than 'O', turnIndex => 1 than 'X'
  	if(boardAfterMove[oldrow][oldcol]===boardAfterMove[row][col]){
		boardAfterMove[oldrow][oldcol] = 'a';
	}else{
		throw new Error("The original chess piece is not the expected one!");
	}
	
	var winner = getWinner(boardAfterMove);
	var firstOperation;
	if(winner !== ''){
		firstOperation = {endMatch: {endMatchScores:
        (winner === 'O' ? [1, 0] : (winner === 'X' ? [0, 1] : [0, 0]))}};
        console.log("player: "+ winner + " WIN!");
	}else{
		firstOperation = {setTurn: {turnIndex: 1 - turnIndexBeforeMove}};
		if(turnIndex !== 1 - turnIndexBeforeMove){
			throw new Error("current Index doesn't match!");
		}
	}
	
	if (isOneStepMove(oldrow,oldcol,row,col)===true){
		console.log("single movement");
		return [firstOperation,
            {set: {key: 'board', value: boardAfterMove}},
            {set: {key: 'delta', value: {oldrow: oldrow, oldcol: oldcol, row: row, col: col}}}];
	}
	if(isMultiStepMoves(oldrow,oldcol,row,col,boardBeforeMove)===true){
		console.log("multiple movements");
		return [firstOperation,
            {set: {key: 'board', value: boardAfterMove}},
            {set: {key: 'delta', value: {oldrow: oldrow, oldcol: oldcol, row: row, col: col}}}];
	}
	else{
		console.log("illegal move!");
		throw new Error("Illegal move!");
	} 	
}


function isMoveOk(params){
	
	try{
		var move = params.move;
		var turnIndexBeforeMove = params.turnIndexBeforeMove; 
    	var stateBeforeMove = params.stateBeforeMove;
    	var turnIndex = move[0].setTurn.turnIndex;
    	
    	var deltaValue = move[2].set.value;
    	var oldrow = deltaValue.oldrow;
      	var oldcol = deltaValue.oldcol;
      	var row = deltaValue.row;
      	var col = deltaValue.col;
      	var boardBeforeMove = stateBeforeMove.board;
      	var boardAfterMove = move[1].set.value;
      	
		var expectedMove = createMove(oldrow,oldcol,row,col,turnIndexBeforeMove,boardBeforeMove,turnIndex);
		if(!isEqual(move[1], expectedMove[1]) || !isEqual(move[2], expectedMove[2])){
			return false;
		}
	} catch(e) {
		return false;
	}
	return true;
  }
  
  // expected output: ture(single), ture(multi), false(illegal move), ture(X WIN)
  console.log(
      isMoveOk({turnIndexBeforeMove: 0, stateBeforeMove: {}, 
        move: [{setTurn: {turnIndex : 1}},
          {set: {key: 'board', value: [
		['','','','','','','','','','','','','','',''],
		['','','','','','a','','','','','','','','',''],
		['','','','','','a','a','','','','','','','',''],
		['','','','','','a','a','a','','','','','','',''],
		['','','','','','a','a','a','a','','','','','','','','',''],
		['','O','O','O','a','O','a','a','a','a','a','a','a','a',''],
		['','','O','O','O','a','a','a','a','a','a','a','a','a',''],
		['','','','O','O','a','a','a','a','a','a','a','a','a',''],
		['','','','','O','a','a','a','a','a','a','a','a','a',''],
		['','','','','','a','a','a','a','a','a','a','a','a',''],
		['','','','','','a','a','a','a','a','a','a','a','a','X',''],
		['','','','','','a','a','a','a','a','a','a','a','a','X','X',''],
		['','','','','','a','a','a','a','a','a','a','a','a','X','X','X',''],
		['','','','','','a','a','a','a','a','a','a','a','a','X','X','X','X',''],
		['','','','','','','','','','','a','a','a','a','','','','','','','',''],
		['','','','','','','','','','','','a','a','a',''],
		['','','','','','','','','','','','','a','a',''],
		['','','','','','','','','','','','','','a',''],
		['','','','','','','','','','','','','','','']
		]}},
          {set: {key: 'delta', value: {oldrow: 5, oldcol: 4, row: 5, col: 5}}}]}) );
  
  
  
  console.log(
      isMoveOk({turnIndexBeforeMove: 0, stateBeforeMove: {
      	board:[
		['','','','','','','','','','','','','','',''],
		['','','','','','a','','','','','','','','',''],
		['','','','','','a','a','','','','','','','',''],
		['','','','','','a','a','a','','','','','','',''],
		['','','','','','a','a','a','a','','','','','','','','',''],
		['','O','O','a','O','O','a','a','a','a','a','a','a','a',''],
		['','','O','a','O','a','a','a','a','a','a','a','a','a',''],
		['','','','O','O','a','a','a','a','a','a','a','a','a',''],
		['','','','','O','O','a','a','a','a','a','a','a','a',''],
		['','','','','','a','a','a','a','a','a','a','a','a',''],
		['','','','','','a','a','a','a','a','a','a','a','a','X',''],
		['','','','','','a','a','a','a','a','a','a','a','X','X','a',''],
		['','','','','','a','a','a','a','a','a','a','a','X','X','a','X',''],
		['','','','','','a','a','a','a','a','a','a','a','a','X','X','X','X',''],
		['','','','','','','','','','','a','a','a','a','','','','','','','',''],
		['','','','','','','','','','','','a','a','a',''],
		['','','','','','','','','','','','','a','a',''],
		['','','','','','','','','','','','','','a',''],
		['','','','','','','','','','','','','','','']
		],
		delta: {oldrow: 5, oldcol: 3, row: 5, col: 5}
      }, 
        move: [{setTurn: {turnIndex : 1}},
          {set: {key: 'board', value: [
		['','','','','','','','','','','','','','',''],
		['','','','','','a','','','','','','','','',''],
		['','','','','','a','a','','','','','','','',''],
		['','','','','','a','a','a','','','','','','',''],
		['','','','','','a','a','a','a','','','','','','','','',''],
		['','a','O','a','O','O','a','a','a','a','a','a','a','a',''],
		['','','O','a','O','a','a','a','a','a','a','a','a','a',''],
		['','','','O','O','a','a','a','a','a','a','a','a','a',''],
		['','','','','O','O','a','a','a','a','a','a','a','a',''],
		['','','','','','O','a','a','a','a','a','a','a','a',''],
		['','','','','','a','a','a','a','a','a','a','a','a','X',''],
		['','','','','','a','a','a','a','a','a','a','a','X','X','a',''],
		['','','','','','a','a','a','a','a','a','a','a','X','X','a','X',''],
		['','','','','','a','a','a','a','a','a','a','a','a','X','X','X','X',''],
		['','','','','','','','','','','a','a','a','a','','','','','','','',''],
		['','','','','','','','','','','','a','a','a',''],
		['','','','','','','','','','','','','a','a',''],
		['','','','','','','','','','','','','','a',''],
		['','','','','','','','','','','','','','','']
		]}},
          {set: {key: 'delta', value: {oldrow: 5, oldcol: 1, row: 9, col: 5}}}]}) );
          
console.log(
      isMoveOk({turnIndexBeforeMove: 0, stateBeforeMove: {
      	board:[
		['','','','','','','','','','','','','','',''],
		['','','','','','a','','','','','','','','',''],
		['','','','','','a','a','','','','','','','',''],
		['','','','','','a','a','a','','','','','','',''],
		['','','','','','a','a','a','a','','','','','','','','',''],
		['','O','O','a','O','O','a','a','a','a','a','a','a','a',''],
		['','','O','a','O','a','a','a','a','a','a','a','a','a',''],
		['','','','O','O','a','a','a','a','a','a','a','a','a',''],
		['','','','','O','O','a','a','a','a','a','a','a','a',''],
		['','','','','','a','a','a','a','a','a','a','a','a',''],
		['','','','','','a','a','a','a','a','a','a','a','a','X',''],
		['','','','','','a','a','a','a','a','a','a','a','X','X','a',''],
		['','','','','','a','a','a','a','a','a','a','a','X','X','a','X',''],
		['','','','','','a','a','a','a','a','a','a','a','a','X','X','X','X',''],
		['','','','','','','','','','','a','a','a','a','','','','','','','',''],
		['','','','','','','','','','','','a','a','a',''],
		['','','','','','','','','','','','','a','a',''],
		['','','','','','','','','','','','','','a',''],
		['','','','','','','','','','','','','','','']
		],
		delta: {oldrow: 5, oldcol: 3, row: 5, col: 5}
      }, 
        move: [{setTurn: {turnIndex : 1}},
          {set: {key: 'board', value: [
		['','','','','','','','','','','','','','',''],
		['','','','','','a','','','','','','','','',''],
		['','','','','','a','a','','','','','','','',''],
		['','','','','','a','a','a','','','','','','',''],
		['','','','','','a','a','a','a','','','','','','','','',''],
		['','a','O','a','O','O','a','a','a','a','a','a','a','a',''],
		['','','O','a','O','O','a','a','a','a','a','a','a','a',''],
		['','','','O','O','a','a','a','a','a','a','a','a','a',''],
		['','','','','O','O','a','a','a','a','a','a','a','a',''],
		['','','','','','a','a','a','a','a','a','a','a','a',''],
		['','','','','','a','a','a','a','a','a','a','a','a','X',''],
		['','','','','','a','a','a','a','a','a','a','a','X','X','a',''],
		['','','','','','a','a','a','a','a','a','a','a','X','X','a','X',''],
		['','','','','','a','a','a','a','a','a','a','a','a','X','X','X','X',''],
		['','','','','','','','','','','a','a','a','a','','','','','','','',''],
		['','','','','','','','','','','','a','a','a',''],
		['','','','','','','','','','','','','a','a',''],
		['','','','','','','','','','','','','','a',''],
		['','','','','','','','','','','','','','','']
		]}},
          {set: {key: 'delta', value: {oldrow: 5, oldcol: 1, row: 6, col: 5}}}]}) );
  
  
  
console.log(
      isMoveOk({turnIndexBeforeMove: 1, stateBeforeMove: {
      	board:[
		['','','','','','','','','','','','','','',''],
		['','','','','','a','','','','','','','','',''],
		['','','','','','a','a','','','','','','','',''],
		['','','','','','a','a','a','','','','','','',''],
		['','','','','','a','a','a','a','','','','','','','','',''],
		['','X','X','X','X','a','a','a','a','a','a','a','a','a',''],
		['','','X','a','X','a','a','a','a','a','a','a','a','a',''],
		['','','','X','X','a','a','a','a','a','a','a','a','a',''],
		['','','','','X','X','a','a','a','a','a','a','a','a',''],
		['','','','','','a','a','a','a','a','a','a','a','a',''],
		['','','','','','a','a','a','a','a','a','a','a','a','O',''],
		['','','','','','a','a','a','a','a','a','a','a','a','O','O',''],
		['','','','','','a','a','a','a','a','a','a','a','O','O','a','O',''],
		['','','','','','a','a','a','a','a','a','a','a','a','O','O','O','O',''],
		['','','','','','','','','','','a','a','a','a','','','','','','','',''],
		['','','','','','','','','','','','a','a','a',''],
		['','','','','','','','','','','','','a','a',''],
		['','','','','','','','','','','','','','a',''],
		['','','','','','','','','','','','','','','']
		],
		delta: {oldrow: 5, oldcol: 3, row: 5, col: 5}
      }, 
        move: [{setTurn: {turnIndex : 0}},
          {set: {key: 'board', value: [
		['','','','','','','','','','','','','','',''],
		['','','','','','a','','','','','','','','',''],
		['','','','','','a','a','','','','','','','',''],
		['','','','','','a','a','a','','','','','','',''],
		['','','','','','a','a','a','a','','','','','','','','',''],
		['','X','X','X','X','a','a','a','a','a','a','a','a','a',''],
		['','','X','X','X','a','a','a','a','a','a','a','a','a',''],
		['','','','X','X','a','a','a','a','a','a','a','a','a',''],
		['','','','','X','a','a','a','a','a','a','a','a','a',''],
		['','','','','','a','a','a','a','a','a','a','a','a',''],
		['','','','','','a','a','a','a','a','a','a','a','a','O',''],
		['','','','','','a','a','a','a','a','a','a','a','a','O','O',''],
		['','','','','','a','a','a','a','a','a','a','a','O','O','a','O',''],
		['','','','','','a','a','a','a','a','a','a','a','a','O','O','O','O',''],
		['','','','','','','','','','','a','a','a','a','','','','','','','',''],
		['','','','','','','','','','','','a','a','a',''],
		['','','','','','','','','','','','','a','a',''],
		['','','','','','','','','','','','','','a',''],
		['','','','','','','','','','','','','','','']
		]}},
          {set: {key: 'delta', value: {oldrow: 8, oldcol: 5, row: 6, col: 3}}}]}) );
          
           // expected output: ture(single), ture(multi), false(illegal move), ture(X WIN)
  
return isMoveOk;
})();








