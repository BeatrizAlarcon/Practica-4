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
      fireball: {w:20, h:10} 
    };
    //compruebo para los parámetros concretos, es más util hacerlo más genérico
    var fireBall1 = new FireBall(10,10,"izq");
    expect(fireBall1.w).toBe(20);
    expect(fireBall1.h).toBe(10);
    expect(fireBall1.x).toBe(10-20/4);
    expect(fireBall1.y).toBe(10-10/2);
    expect(fireBall1.vy).toBe(-750);
    expect(fireBall1.vx).toBe(200);

    var fireBall2 = new FireBall(10,10,"dch");
    expect(fireBall2.w).toBe(20);
    expect(fireBall2.h).toBe(10);
    expect(fireBall2.x).toBe(10-20/4);
    expect(fireBall2.y).toBe(10-10/2);
    expect(fireBall2.vy).toBe(-750);
    expect(fireBall2.vx).toBe(-200);
  });

  it("FireBall.step",function(){
    SpriteSheet.map = {
      fireball: {w:20, h:10} 
    };
    var fireBall = new FireBall(10,10,"izq");
    var gameBoard = {
      remove: function(x){},
      collide: function(x,y){}
    };
    spyOn(gameBoard, "remove");

    fireBall.board = gameBoard;

    //no llama a remove
    fireBall.step(0);
    expect(gameBoard.remove).not.toHaveBeenCalled();
    //llama a remove
    fireBall.step(-1000000000000000000);
    expect(gameBoard.remove).toHaveBeenCalledWith(fireBall);

  });

  it("FireBall.draw",function(){
    SpriteSheet= {
      draw: function(a, b, c, d){}
    };
    SpriteSheet.map = {
      fireball: {w:20, h:10} 
    };
    ctx ={};
    var fireBall = new FireBall(10,20);
    spyOn(SpriteSheet, "draw");

    fireBall.draw(ctx);
    expect(SpriteSheet.draw).toHaveBeenCalledWith(ctx,'fireball',fireBall.x, fireBall.y, 0)
  });


});