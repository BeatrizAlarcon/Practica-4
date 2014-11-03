describe("Clase FireBall", function(){


var canvas, ctx;

  beforeEach(function(){
    loadFixtures('index.html');

    canvas = $('#game')[0];
    expect(canvas).toExist();

    ctx = canvas.getContext('2d');
    expect(ctx).toBeDefined();

    oldGame = Game;
  });

  afterEach(function(){
    Game = oldGame;
  }); 

  it("FireBall", function(){
    //preparo el SpriteSheet necesario
    SpriteSheet.map = {
      missile: {w:2, h:10} 
    };
    //compruebo para los parámetros concretos, es más util hacerlo más genérico
    var playerMissile = new PlayerMissile(10,10);
    expect(playerMissile.w).toBe(2);
    expect(playerMissile.h).toBe(10);
    expect(playerMissile.x).toBe(9);
    expect(playerMissile.y).toBe(0);
    expect(playerMissile.vy).toBe(-700);
  });

  it("FireBall.step",function(){
    SpriteSheet.map = {
      missile: {w:2, h:10} 
    };
    var playerMissile = new PlayerMissile(10,10);
    var gameBoard = {remove: function(x){}};
    spyOn(gameBoard, "remove");

    playerMissile.board = gameBoard;

    //0<-10 =>no llama a remove
    playerMissile.step(0);
    expect(gameBoard.remove).not.toHaveBeenCalled();
    //(-700*1)<-10 =>no llama a remove
    playerMissile.step(1);
    expect(gameBoard.remove).toHaveBeenCalledWith(playerMissile);

  });

  it("FireBall.draw",function(){
    SpriteSheet= {
      draw: function(a, b, c, d){}
    };
    SpriteSheet.map = {
      missile: {w:2, h:10} 
    };
    ctx ={};
    var playerMissile = new PlayerMissile(10,20);
    spyOn(SpriteSheet, "draw");

    playerMissile.draw(ctx);
    expect(SpriteSheet.draw).toHaveBeenCalledWith(ctx,'missile',playerMissile.x, playerMissile.y)
  });


});