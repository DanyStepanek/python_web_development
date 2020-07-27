
var game = null;
var window_x = 800;
var window_y = 600;

function setup(){
  game = new Game();
  game.snake.addHead();
  game.play();
}

function refreshPage(){
    window.location.reload();
} 

function Snake(){
  /*  dir == 0 => up
   *  dir == 1 => left
   *  dir == 2 => right
   *  dir == 3 => down
   */
  this.direction = 0;
  this.head = null;
  this.body = [];

}

function Piece(x, y){
  this.id = 0;
  this.x = x;
  this.y = y;

}

function Game(){
  this.checkpoint = new Piece(window_x / 2, window_y / 2);
  this.snake = new Snake();
  this.score = 0;
  this.path = [];

}

Game.prototype.play = function(){

  var elem = document.getElementById("snake");
  var point = document.getElementById("point");

  var id = setInterval(frame, 50);
  var i = 0;
  var result = 0;
  function frame() {
    if (game.snake.head.x == game.checkpoint.x &&
        game.snake.head.y == game.checkpoint.y) {
      game.pointEated();
      clearInterval(id);
      if(result != -1){
        game.play();
      }
      else{
        console.log("Game Over!");
      }
    }
    else {
      i++;
      result = game.snake.search();

      point.style.left = game.checkpoint.x + 'px';
      point.style.top = game.checkpoint.y + 'px';

      elem.style.left = game.snake.head.x + 'px';
      elem.style.top = game.snake.head.y + 'px';

      for (var i = 0; i < game.snake.body.length; i++) {
        piece = document.getElementById(game.snake.body[i].id);
        piece.style.left = game.snake.body[i].x + 'px';
        piece.style.top = game.snake.body[i].y + 'px';
        piece.style.width = "10px";
        piece.style.height = "10px";
        piece.style.position = "absolute";
        piece.style.background = "white";
        piece.style.border = "thin dotted red";
      }

  //    console.log('point: ' + game.snake.path[len]);
  //    console.log('head: ' + game.snake.path[i]);
    }
    document.getElementById("score").innerHTML = game.score;
  }
}

Game.prototype.draw = function(){
  this.checkpoint.showPoint();
  this.snake.show();

}

Game.prototype.addScore = function(){
  this.score += 1
  //this.snake.body.length;
}

Snake.prototype.search = function(){
  wanted_x = game.checkpoint.x;
  wanted_y = game.checkpoint.y;

  head_x = this.head.x;
  head_y = this.head.y;

//  console.log('direction: ' + this.direction);
/************possible moves***********************/
  possible_moves = [[0, 0],
                    [1, 0],
                    [2, 0],
                    [3, 0]];

  this.body.forEach(element => {
    if(element.x > head_x){
        possible_moves[2][1] += 1;
    }
    if(element.x < head_x){
      possible_moves[1][1] += 1;
    }
    if(element.y > head_y){
      possible_moves[3][1] += 1;
    }
    if(element.y < head_y){
      possible_moves[0][1] += 1;
    }
  });

/* dvojokoli */
/*  this.body.forEach(element => {
    if((element.x == head_x + 10 || element.x == head_x + 20) && element.y == head_y){
    //  console.log("not_right");
      possible_moves = possible_moves.filter(item => item[0] !== 2);
    }
    if((element.x == head_x - 10 || element.x == head_x - 20) && element.y == head_y){
  //    console.log("not_left");
      possible_moves = possible_moves.filter(item => item[0] !== 1);
    }
    if(element.x == head_x && (element.y == head_y + 10 || element.y == head_y + 20)){
    //  console.log("not_down");
      possible_moves = possible_moves.filter(item => item[0] !== 3);
    }
    if(element.x == head_x && (element.y == head_y - 10 || element.y == head_y - 20)){
  //    console.log("not_up");
      possible_moves = possible_moves.filter(item => item[0] !== 0);
    }
  });
*/

  /**jednookoli*/
  this.body.forEach(element => {
    if((element.x == head_x + 10) && element.y == head_y){
    //  console.log("not_right");
      possible_moves = possible_moves.filter(item => item[0] !== 2);
    }
    if((element.x == head_x - 10) && element.y == head_y){
  //    console.log("not_left");
      possible_moves = possible_moves.filter(item => item[0] !== 1);
    }
    if(element.x == head_x && (element.y == head_y + 10)){
    //  console.log("not_down");
      possible_moves = possible_moves.filter(item => item[0] !== 3);
    }
    if(element.x == head_x && (element.y == head_y - 10)){
  //    console.log("not_up");
      possible_moves = possible_moves.filter(item => item[0] !== 0);
    }
  });

/* borders */
  if(window_x == head_x + 10){
  //  console.log("not_right");
    possible_moves = possible_moves.filter(item => item[0] !== 2);
  }
  if(head_x - 10 < 0){
//    console.log("not_left");
    possible_moves = possible_moves.filter(item => item[0] !== 1);
  }
  if(head_y + 10 == window_y){
//    console.log("not_down");
    possible_moves = possible_moves.filter(item => item[0] !== 3);
  }
  if(head_y -10 < 0){
//    console.log("not_up");
    possible_moves = possible_moves.filter(item => item[0] !== 0);
  }



/**************moving********************/
  if(possible_moves.length == 2){
    if(3 - game.path[game.path.length - 2] == game.path[game.path.length - 4] &&
       3 - game.path[game.path.length - 1] == game.path[game.path.length - 3]){
         console.log("equal moves: 2,4: " + game.path[game.path.length - 2] + " " + game.path[game.path.length - 4]);
         console.log("equal moves: 1,3: " + game.path[game.path.length - 1] + " " + game.path[game.path.length - 3]);
         possible_moves = possible_moves.filter(item => item[0] !== game.path[game.path.length - 4]);
    }
  }
  moves = [];
  possible_moves.forEach(element => {moves.push(element[0])});
  console.log("possible_moves: " + moves);

  if(wanted_x < head_x && moves.includes(1)){
    this.move(-10, 0);
    if(game.path[game.path.length - 1] != 1){
        console.log('normal_left');
        game.path.push(1);
    }
    return 0;
  }
  else if(wanted_x > head_x && moves.includes(2)){
    this.move(10, 0);
    if(game.path[game.path.length - 1] != 2){
        game.path.push(2);
        console.log('normal_right');
    }
    return 0;
  }
  else if(wanted_y < head_y && moves.includes(0)){
    this.move(0, -10);
    if(game.path[game.path.length - 1] != 0){
        game.path.push(0);
        console.log('normal_up');
    }
    return 0;
  }
  else if(wanted_y > head_y && moves.includes(3)){
    this.move(0, 10);
    if(game.path[game.path.length - 1] != 3){
        game.path.push(3);
        console.log('normal_down');
    }
    return 0;
  }

/****************more logic********************/

  var min = Infinity;
  var min_index = -1;
  possible_moves.forEach(element => {
    if(element[1] <= min){
      min = element[1];
      min_index = element[0];
    }
  });

  switch (min_index) {
    case 0:
      this.move(0, -10);
      if(game.path[game.path.length -1] != 0){
          game.path.push(0);
          console.log('logic_up');
      }
      break;
    case 1:
      this.move(-10, 0);
      if(game.path[game.path.length - 1] != 1){
          game.path.push(1);
          console.log('logic_left');
      }
      break;
    case 2:
      this.move(10, 0);
      if(game.path[game.path.length - 1] != 2){
          game.path.push(2);
          console.log('logic_right');
      }
      break;
    case 3:
      this.move(0, 10);
      if(game.path[game.path.length - 1] != 3){
          game.path.push(3);
          console.log('logic_down');
      }
      break;
    default:
      console.log("path: " + game.path);
      return -1;

  }
}

Piece.prototype.move = function(move_x, move_y){
  this.x += move_x;
  this.y += move_y;

}

Snake.prototype.show = function(){
  this.head.show();
  this.body.forEach(element => element.show());
}

Snake.prototype.move = function(move_x, move_y){
  this.head.move(move_x, move_y);
  for(var i = this.body.length - 1; i >= 0; i--){
    if(i == 0){
      this.body[i].x = this.head.x;
      this.body[i].y = this.head.y;
    }
    else{
      this.body[i].x = this.body[i-1].x;
      this.body[i].y = this.body[i-1].y;
    }
  }
//  this.body.forEach(element => element.move(move_x, move_y));
}

Game.prototype.pointEated = function(){
  console.log("point Eated!!");

  this.checkpoint.createPoint();

  if(this.snake.body.length == 0){
    if(this.snake.direction == 0){
      this.snake.addPiece(this.snake.head.x, this.snake.head.y + 10);
    }
    else if(this.snake.direction == 1){
      this.snake.addPiece(this.snake.head.x + 10, this.snake.head.y);
    }
    else if(this.snake.direction == 2){
      this.snake.addPiece(this.snake.head.x - 10, this.snake.head.y);
    }
    else if(this.snake.direction == 3){
      this.snake.addPiece(this.snake.head.x, this.snake.head.y - 10);
    }
  }
  else{
    if(this.snake.direction == 0){
      this.snake.addPiece(this.snake.body[this.snake.body.length - 1].x,
         this.snake.body[this.snake.body.length - 1].y + 10);
    }
    else if(this.snake.direction == 1){
      this.snake.addPiece(this.snake.body[this.snake.body.length - 1].x + 10,
         this.snake.body[this.snake.body.length - 1].y);
    }
    else if(this.snake.direction == 2){
      this.snake.addPiece(this.snake.body[this.snake.body.length - 1].x - 10,
         this.snake.body[this.snake.body.length - 1].y);
    }
    else if(this.snake.direction == 3){
      this.snake.addPiece(this.snake.body[this.snake.body.length - 1].x,
         this.snake.body[this.snake.body.length - 1].y - 10);
    }
  }

  this.addScore();
}

Piece.prototype.createPoint = function(){

  do{
    this.x = Math.floor(Math.random() * (700));
    this.y = Math.floor(Math.random() * (500));

    tmp_x = this.x % 10;
    tmp_y = this.y % 10;

    if(tmp_x != 0){
      this.x -= tmp_x;
    }

    if(tmp_y != 0){
      this.y -= tmp_y;
    }
//    console.log("new point" + " x: " + this.x + " y: " + this.y);
  } while(collision(this.x, this.y));
}

function collision(x, y){
  console.log("check");
  game.snake.body.forEach(element => {
    if(element.x == x && element.y == y){
      console.log("collision! x: " + x + " y: " + y);
      return true;
    }});

  return false;
}

Piece.prototype.showPoint = function(){
  var point = document.getElementById("point");
  point.style.top = this.x + 'px';
  point.style.left = this.y + 'px';

}

Piece.prototype.show = function(){
  var point = document.getElementById("snake");
  point.style.top = this.x + 'px';
  point.style.left = this.y + 'px';
}

Snake.prototype.addHead = function(){
  this.head = new Piece(10, 10);
}

Snake.prototype.addPiece = function(x, y) {
  this.body.push(new Piece(x, y));
  var id = this.body.length - 1;
  this.body[id].id = id;
  // create a new div element
  var newDiv = document.createElement('div');
  newDiv.setAttribute("id", id.toString());
  // add the newly created element and its content into the DOM
  document.getElementById("game").appendChild(newDiv);

}
