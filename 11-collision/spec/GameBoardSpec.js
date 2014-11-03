/*

  En el anterior prototipo (06-player), el objeto Game permite
  gestionar una colecci�n de tableros (boards). Los tres campos de
  estrellas, la pantalla de inicio, y el sprite de la nave del
  jugador, se a�aden como tableros independientes para que Game pueda
  ejecutar sus m�todos step() y draw() peri�dicamente desde su m�todo
  loop(). Sin embargo los objetos que muestran los tableros no pueden
  interaccionar entre s�. Aunque se a�adiesen nuevos tableros para los
  misiles y para los enemigos, resulta dif�cil con esta arquitectura
  pensar en c�mo podr�a por ejemplo detectarse la colisi�n de una nave
  enemiga con la nave del jugador, o c�mo podr�a detectarse si un
  misil disparado por la nave del usuario ha colisionado con una nave
  enemiga.


  Requisitos:

  Este es precisamente el requisito que se ha identificado para este
  prototipo: dise�ar e implementar un mecanismo que permita gestionar
  la interacci�n entre los elementos del juego. Para ello se dise�ar�
  la clase GameBoard. Piensa en esta clase como un tablero de un juego
  de mesa, sobre el que se disponen los elementos del juego (fichas,
  cartas, etc.). En Alien Invasion los elementos del juego ser�n las
  naves enemigas, la nave del jugador y los misiles. Para el objeto
  Game, GameBoard ser� un board m�s, por lo que deber� ofrecer los
  m�todos step() y draw(), siendo responsable de mostrar todos los
  objetos que contenga cuando Game llame a estos m�todos.

  Este prototipo no a�ade funcionalidad nueva a la que ofrec�a el
  prototipo 06.


  Especificaci�n: GameBoard debe

  - mantener una colecci�n a la que se pueden a�adir y de la que se
    pueden eliminar sprites como nave enemiga, misil, nave del
    jugador, explosi�n, etc.

  - interacci�n con Game: cuando Game llame a los m�todos step() y
    draw() de un GameBoard que haya sido a�adido como un board a Game,
    GameBoard debe ocuparse de que se ejecuten los m�todos step() y
    draw() de todos los objetos que contenga

  - debe ofrecer la posibilidad de detectar la colisi�n entre
    objetos. Un objeto sprite almacenado en GameBoard debe poder
    detectar si ha colisionado con otro objeto del mismo
    GameBoard. Los misiles disparados por la nave del jugador deber�n
    poder detectar gracias a esta funcionalidad ofrecida por GameBoard
    cu�ndo han colisionado con una nave enemiga; una nave enemiga debe
    poder detectar si ha colisionado con la nave del jugador; un misil
    disparado por la nave enemiga debe poder detectar si ha
    colisionado con la nave del jugador. Para ello es necesario que se
    pueda identificar de qu� tipo es cada objeto sprite almacenado en
    el tablero de juegos, pues cada objeto s�lo quiere comprobar si ha
    colisionado con objetos de cierto tipo, no con todos los objetos.

*/
describe("Clase GameBoard", function(){

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
  it("Gameboard.add", function() {

    var gameBoard = new GameBoard();

    //espero que lo que devuelva sea el objeto introducido
    expect(gameBoard.add(1)).toEqual(1);
    expect(gameBoard.add(2)).toEqual(2);

    //espero que se haya a�adido el objeto introducido
    expect(gameBoard.objects[0]).toEqual[1];
    expect(gameBoard.objects[1]).toEqual[2];
  });

  it("Gameboard.remove", function(){
    var gameBoard = new GameBoard();
    //comprubebo que se llama a resetRemoved
    spyOn(gameBoard, "resetRemoved").andCallThrough();
    gameBoard.resetRemoved();
    expect(gameBoard.resetRemoved).toHaveBeenCalled();
    //compruebo que elimina
    gameBoard.add(1);
    gameBoard.add(8);
    gameBoard.remove(8);
    gameBoard.remove(1);
    expect(gameBoard.removed[0]).toEqual(8);
    expect(gameBoard.removed[1]).toEqual(1);
  });

  it("Gameboard.resetRemoved", function(){
    var gameBoard = new GameBoard();
    expect(gameBoard.resetRemoved()).toEqual();
  });

  it("Gameboard.finalizeRemoved",function(){
    var gameBoard = new GameBoard();

    //comprubebo que se llama a resetRemoved
    spyOn(gameBoard, "resetRemoved").andCallThrough();
    gameBoard.resetRemoved();
    expect(gameBoard.resetRemoved).toHaveBeenCalled();

    gameBoard.add(1);
    gameBoard.add(8);
    expect(gameBoard.objects[0]).toEqual(1);
    expect(gameBoard.objects[1]).toEqual(8);
    gameBoard.remove(8);
    expect(gameBoard.removed[0]).toEqual(8);
    expect(gameBoard.objects[0]).toEqual(1);
    expect(gameBoard.objects[1]).toEqual(8);

    gameBoard.finalizeRemoved();
    expect(gameBoard.removed[0]).toEqual(8);
    expect(gameBoard.objects[0]).toEqual(1);
    expect(gameBoard.objects[1]).toEqual(undefined);

    gameBoard.remove(1);
    expect(gameBoard.removed[1]).toEqual(1);

    gameBoard.finalizeRemoved();
    expect(gameBoard.objects[0]).toEqual(undefined);
    expect(gameBoard.objects[1]).toEqual(undefined);
  });

  it("Gameboard.iterate",function(){
    var gameBoard = new GameBoard();
    //genero dummys con la funci�n que necesito
    var dummy1 ={
      funcion: function(){}
    };
    var dummy2 ={
      funcion: function(){}
    };

    //espio su funci�n
    spyOn(dummy1,"funcion");
    spyOn(dummy2,"funcion");

    //los a�ado al gameboard
    gameBoard.add(dummy1);
    gameBoard.add(dummy2);
    
    //itero sobre ellos para asegurarme que lo que hacen es llamar a su funci�n con el par�metro que se le ha pasado
    gameBoard.iterate('funcion', 'hola');
    expect(dummy1.funcion).toHaveBeenCalledWith('hola');
    expect(dummy2.funcion).toHaveBeenCalledWith('hola');

  });

    

  it("Gameboard.detect",function(){
    var gameBoard = new GameBoard();
    gameBoard.objects = [{att1:1},{att2:2}];

    //funcion verdadero si att1 es 1
    var func1 = function(){
      return this.att1==1;
    };

    //funcion verdadero si att2 es 1
    var func2 = function(){
      return this.att2==1;
    };

    expect(gameBoard.detect(func1)).toBe(gameBoard.objects[0]);
    expect(gameBoard.detect(func2)).toBe(false);
  });

  it("Gameboard.step",function(){
    var gameBoard = new GameBoard();
    var dt = 30 / 1000;

    spyOn(gameBoard, "resetRemoved");
    spyOn(gameBoard, "iterate");
    spyOn(gameBoard, "finalizeRemoved");

    gameBoard.step(dt);

    expect(gameBoard.resetRemoved).toHaveBeenCalled;
    expect(gameBoard.iterate).toHaveBeenCalledWith('step',dt);
    expect(gameBoard.finalizeRemoved).toHaveBeenCalled;
  });

  it("Gameboard.draw",function(){
    var gameBoard = new GameBoard();
    spyOn(gameBoard, "iterate");
    
    gameBoard.draw(ctx);
    expect(gameBoard.iterate).toHaveBeenCalledWith('draw',ctx);
  });

  it("Gameboard.overlap",function(){
    var gameBoard = new GameBoard();
    //objeto base
    var base = {x: 0, y:0, h:20, w:20};
    var sol = {x: 5, y:5, h:3, w:3};
    var nosol = {x: 21, y:21, h:3, w:3};
    //solape
    expect(gameBoard.overlap(base, sol)).toBeTruthy();
    //no solape
    expect(gameBoard.overlap(base, nosol)).toBeFalsy();
  });

  it("Gameboard.collide",function(){
    var gameBoard = new GameBoard();
    var base = {x:0, y:0, h:20, w:20, type:0};
    var col = {x:5, y:5, h:3, w:3, type:1};
    var nocol = {x:21, y:21 , h:3 , w:3, type:2};

    gameBoard.add(base);
    gameBoard.add(col);
    gameBoard.add(nocol);

    expect(gameBoard.collide(base,col.type)).toBe(col);
    expect(gameBoard.collide(base,nocol.type)).toBeFalsy;
  
  });
});

