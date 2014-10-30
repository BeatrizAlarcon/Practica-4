/*

  Requisitos: 

  La nave del usuario disparar� 2 misiles si est� pulsada la tecla de
  espacio y ha pasado el tiempo de recarga del arma.

  El arma tendr� un tiempo de recarga de 0,25s, no pudi�ndose enviar
  dos nuevos misiles antes de que pasen 0,25s desde que se enviaron
  los anteriores



  Especificaci�n:

  - Hay que a�adir a la variable sprites la especificaci�n del sprite
    missile

  - Cada vez que el usuario presione la tecla de espacio se a�adir�n
    misiles al tablero de juego en la posici�n en la que est� la nave
    del usuario. En el c�digo de la clase PlayerSip es donde tienen
    que a�adirse los misiles

  - La clase PlayerMissile es la que implementa los misiles. Es
    importante que la creaci�n de los misiles sea poco costosa pues va
    a haber muchos disparos, para lo cual se declarar�n los m�todos de
    la clase en el prototipo

*/
describe("Clase PlayerMissile", function(){


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

  it("PlayerMissile", function(){
    //preparo el SpriteSheet necesario
    SpriteSheet.map = {
      missile: {w:2, h:10} 
    };
    //compruebo para los par�metros concretos, es m�s util hacerlo m�s gen�rico
    var playerMissile = new PlayerMissile(10,10);
    expect(playerMissile.w).toBe(2);
    expect(playerMissile.h).toBe(10);
    expect(playerMissile.x).toBe(9);
    expect(playerMissile.y).toBe(0);
    expect(playerMissile.vy).toBe(-700);
  });

  it("PlayerMissile.step",function(){
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

  it("PlayerMissile.draw",function(){
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