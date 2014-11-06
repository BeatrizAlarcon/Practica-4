/*

  Requisitos:

    El objetivo de este prototipo es añadir niveles al juego. En cada
    nivel deberán ir apareciendo baterías de enemigos según avanza el
    tiempo.

    Cada nivel termina cuando no quedan enemigos por crear en ninguno
    de sus niveles, y cuando todos los enemigos del nivel han
    desaparecido del tablero de juegos (eliminados por misiles/bolas
    de fuego o desaparecidos por la parte de abajo de la pantalla).

    Cuando terminan todos los niveles sin que la nave haya colisionado
    termina el juego, ganando el jugador.

    Cuando la nave del jugador colisiona con un enemigo debe terminar
    el juego, perdiendo el jugador.


  Especificación:

    El constructor Level() recibirá como argumentos la definición del
    nivel y la función callback a la que llamar cuando termine el
    nivel.

    La definición del nivel tiene este formato:
      [ 
        [ parametros de bateria de enemigos ] , 
        [ parametros de bateria de enemigos ] , 
        ... 
      ]


      Los parámetros de cada batería de enemigos son estos:
           Comienzo (ms),  Fin (ms),   Frecuencia (ms),  Tipo,    Override
 Ejemplo:
         [ 0,              4000,       500,              'step',  { x: 100 } ]


    Cada vez que se llame al método step() del nivel éste comprobará:

      - si ha llegado ya el momento de añadir nuevos sprites de alguna
        de las baterías de enemigos.
    
      - si hay que eliminar alguna batería del nivel porque ya ha
        pasado la ventana de tiempo durante la que hay tiene que crear
        enemigos

      - si hay que terminar porque no quedan baterías de enemigos en
        el nivel ni enemigos en el tablero de juegos.

*/

describe("Levels", function(){


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

  it("level", function(){
    var level1 = [
    //  Comienzo, Fin,   Frecuencia,  Tipo,       Override
    [ 0,        4000,  500,         'step'                 ],
    [ 6000,     13000, 800,         'ltr'                  ]
    ];

    level = new Level(level1,function(){});
    expect(level).toBeDefined();
    expect(level.levelData.length).toBe(level1.length);
  });
  it("step", function(){
    var level1 = [
    //  Comienzo, Fin,   Frecuencia,  Tipo,       Override
    [ 0,        4000,  500,         'step'                 ],
    [ 6000,     13000, 800,         'ltr'                  ]
    ];

    level = new Level(level1,function(){});

    SpriteSheet.map ={
      ship: { sx: 0, sy: 0, w: 37, h: 42, frames: 1 },
      missile: { sx: 0, sy: 30, w: 2, h: 10, frames: 1 },
      enemy_purple: { sx: 37, sy: 0, w: 42, h: 43, frames: 1 },
      enemy_bee: { sx: 79, sy: 0, w: 37, h: 43, frames: 1 },
      enemy_ship: { sx: 116, sy: 0, w: 42, h: 43, frames: 1 },
      enemy_circle: { sx: 158, sy: 0, w: 32, h: 33, frames: 1 },
      explosion: { sx: 0, sy: 64, w: 64, h: 64, frames: 12 },
      fireball: {sx: 0, sy: 64, w: 64, h: 64, frames: 1}
    };

    basics = { B : 150, C : 1.2, E : 75, t : 0, sprite : 'enemy_circle', x : 0, y : -50, health : 10, frame : 0, w : 32, h : 33 };
    override = {};
    var enemy = new Enemy(basics,override);

    basics = {  B : 75, C : 1, E : 100, t : 0, sprite : 'enemy_purple', x : 0, y : -100, health : 10, frame : 0, w : 42, h : 43 };
    var enemy2 = new Enemy(basics,override);

    var gameBoard = new GameBoard();
    gameBoard.add(level);

    spyOn(level.board, "add");

    level.step(1);
    expect(level.board.add).toHaveBeenCalledWith(enemy);
    expect(level.board.objects.length).toBe(1);

    level.board.add.reset();

    level.step(8);
    expect(level.board.add).toHaveBeenCalledWith(enemy2);

  });
});