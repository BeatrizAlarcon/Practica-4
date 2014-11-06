/*

  Requisitos:

  El objetivo de este prototipo es que se detecten colisiones entre
  varios tipos de sprites:
  
  - Los misiles tienen ahora una nueva propiedad: el daño (damage) que
    infligen a una nave enemiga cuando colisionan con ella. Cuando un
    misil colisione con una nave enemiga le infligirá un daño de
    cierta cuantía (damage) a la nave enemiga con la que impacta, y
    desaparecerá.

  - Las naves enemigas tienen ahora una nueva propiedad: su salud
    (health).  El daño ocasionado a una nave enemiga por un misil hará
    que disminuya la salud de la nave enemiga, y cuando llegue a cero,
    la nave enemiga desaparecerá.

  - cuando una nave enemiga colisione con la nave del jugador, deberá
    desaparecer tanto la nave enemiga como la nave del jugador.



  Especificación:

  En el prototipo 07-gameboard se añadió el constructor GameBoard. El
  método overlap() de los objetos creados con GameBoard() ofrece
  funcionalidad para comprobar si los rectángulos que circunscriben a
  los sprites que se le pasan como parámetros tienen intersección no
  nula. El método collide() de GameBoard utiliza overlap() para
  detectar si el objeto que se le pasa como primer parámetro ha
  colisionado con algún objeto del tipo que se le pasa como segundo
  parámetro.

  En este prototipo se utilizará el método collide() para detectar los
  siguientes tipos de colisiones:

    a) detectar si un misil disparado por la nave del jugador
       colisiona con una nave enemiga

    b) detectar si una nave enemiga colisiona con la nave del jugador


  En el método step() de los objetos creados con PlayerMissile() y
  Enemy(), tras "moverse" a su nueva posición calculada, se comprobará
  si han colisionado con algún objeto del tipo correspondiente. 

  No interesa comprobar si se colisiona con cualquier otro objeto,
  sino sólo con los de ciertos tipos. El misil tiene que comprobar si
  colisiona con naves enemigas. Por otro lado, tras moverse una nave
  enemiga, ésta tiene que comprobar si colisiona con la nave del
  jugador. Para ello cada sprite tiene un tipo y cuando se comprueba
  si un sprite ha colisionado con otros, se pasa como segundo
  argumento a collide() el tipo de sprites con los que se quiere ver
  si ha colisionado el objeto que se pasa como primer argumento.

  Cuando un objeto detecta que ha colisionado con otro, llama al
  método hit() del objeto con el que ha colisionado. 


  Efectos de las colisiones de un misil con una nave enemiga:

    Cuando el misil llama al método hit() de una nave enemiga, pasa
    como parámetro el daño que provoca para que la nave enemiga pueda
    calcular la reducción de salud que conlleva la colisión. Cuando
    una nave enemiga recibe una llamada a su método .hit() realizada
    por un misil que ha detectado la colisión, la nave enemiga
    recalcula su salud reduciéndola en tantas unidades como el daño
    del misil indique, y si su salud llega a 0 desaparece del tablero
    de juegos, produciéndose en su lugar la animación de una
    explosión.

    El misil, tras informar llamando al métod hit() de la nave enemiga
    con la que ha detectado colisión, desaparece.


  Efectos de las colisiones de una nave enemiga con la nave del jugador:

    Cuando la nave del jugador recibe la llamada .hit() realizada por
    una nave enemiga que ha detectado la colisión, la nave del jugador
    desaparece del tablero.

    La nave enemiga, tras informar llamando a hit() de la nave del
    jugador, desaparece también.

*/
describe("Collision", function(){


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

  it("misil colisiona enemigo y no explota", function(){
    SpriteSheet.map ={
      ship: { sx: 0, sy: 0, w: 37, h: 42, frames: 1 },
      missile: { sx: 0, sy: 30, w: 2, h: 10, frames: 1 },
      enemy_purple: { sx: 37, sy: 0, w: 42, h: 43, frames: 1 },
      explosion: { sx: 0, sy: 64, w: 64, h: 64, frames: 12 },
    };
    var gameBoard = new GameBoard();
    basics = { x: 0, y: 0, sprite: 'enemy_purple', health:200};
    var myenemy = new Enemy(basics);
    var mymissile = new PlayerMissile(0,1);
    mymissile.damage = 2;
    mymissile.vy=0;    

    gameBoard.add(mymissile);
    gameBoard.add(myenemy);

    //se han añadido los dos objetos
    expect(gameBoard.objects.length).toBe(2);
    expect(gameBoard.objects[0].sprite).toBe('missile');  
    expect(gameBoard.objects[1].sprite).toBe('enemy_purple'); 

    gameBoard.step(1);

    //no ha explotado, y se ha destruido el misil
    expect(gameBoard.objects.length).toBe(1); 
    expect(gameBoard.objects[0].sprite).toBe('enemy_purple'); 
    expect(gameBoard.objects[0].health).toBe(198); 


  });

  it("misil colisiona enemigo y explota", function(){
    SpriteSheet.map ={
      ship: { sx: 0, sy: 0, w: 37, h: 42, frames: 1 },
      missile: { sx: 0, sy: 30, w: 2, h: 10, frames: 1 },
      enemy_purple: { sx: 37, sy: 0, w: 42, h: 43, frames: 1 },
      explosion: { sx: 0, sy: 64, w: 64, h: 64, frames: 12 },
    };
    var gameBoard = new GameBoard();
    basics = { x: 0, y: 0, sprite: 'enemy_purple', health:2};
    var myenemy = new Enemy(basics);
    var mymissile = new PlayerMissile(0,1);
    mymissile.damage = 200;
    mymissile.vy=0;    

    gameBoard.add(mymissile);
    gameBoard.add(myenemy);

    //se han añadido los dos objetos
    expect(gameBoard.objects.length).toBe(2);
    expect(gameBoard.objects[0].sprite).toBe('missile');  
    expect(gameBoard.objects[1].sprite).toBe('enemy_purple'); 

    gameBoard.step(1);

    //ha explotado
    expect(gameBoard.objects.length).toBe(1); 
    expect(gameBoard.objects[0].sprite).toBe('explosion');  


  });

  it("bola de fuego colisiona enemigo y no explota",function(){
    SpriteSheet.map ={
      ship: { sx: 0, sy: 0, w: 37, h: 42, frames: 1 },
      enemy_purple: { sx: 37, sy: 0, w: 42, h: 43, frames: 1 },
      explosion: { sx: 0, sy: 64, w: 64, h: 64, frames: 12 },
      fireball: {sx: 0, sy: 64, w: 64, h: 64, frames: 1}
    };
    var gameBoard = new GameBoard();
    basics = { x: 100, y: 200, sprite: 'enemy_purple', health:200 };
    var fireBall = new FireBall(100, 201, "dch");

    fireBall.vx=0;
    fireBall.vy=0;
    fireBall.damage=2;
   

    var myenemy = new Enemy(basics);

    gameBoard.add(myenemy);
    gameBoard.add(fireBall);

    //se ha añadido los dos objetos
    expect(gameBoard.objects.length).toBe(2);
    expect(gameBoard.objects[0].sprite).toBe('enemy_purple');
    expect(gameBoard.objects[1].sprite).toBe('fireball');  


    gameBoard.step(1);

    //ha explotado y la bola de fuego sigue existiendo
    expect(gameBoard.objects.length).toBe(2);
    expect(gameBoard.objects[0].sprite).toBe('enemy_purple'); 
    expect(gameBoard.objects[1].sprite).toBe('fireball'); 
    expect(gameBoard.objects[0].health).toBe(198); 
    

  });

  it("bola de fuego colisiona enemigo y explota",function(){
    SpriteSheet.map ={
      ship: { sx: 0, sy: 0, w: 37, h: 42, frames: 1 },
      enemy_purple: { sx: 37, sy: 0, w: 42, h: 43, frames: 1 },
      explosion: { sx: 0, sy: 64, w: 64, h: 64, frames: 12 },
      fireball: {sx: 0, sy: 64, w: 64, h: 64, frames: 1}
    };
    var gameBoard = new GameBoard();
    basics = { x: 100, y: 200, sprite: 'enemy_purple', health:2 };
    var fireBall = new FireBall(100, 201, "dch");

    fireBall.vx=0;
    fireBall.vy=0;
    fireBall.damage=200;
   

    var myenemy = new Enemy(basics);

    gameBoard.add(myenemy);
    gameBoard.add(fireBall);

    //se ha añadido los dos objetos
    expect(gameBoard.objects.length).toBe(2);
    expect(gameBoard.objects[0].sprite).toBe('enemy_purple');
    expect(gameBoard.objects[1].sprite).toBe('fireball');  


    gameBoard.step(1);

    //ha explotado y la bola de fuego sigue existiendo
    expect(gameBoard.objects.length).toBe(2); 
    expect(gameBoard.objects[0].sprite).toBe('fireball'); 
    expect(gameBoard.objects[1].sprite).toBe('explosion'); 
    

  });

  it("nave colisiona enemigo", function(){
    SpriteSheet.map ={
      ship: { sx: 0, sy: 0, w: 37, h: 42, frames: 1 },
      explosion: { sx: 0, sy: 64, w: 64, h: 64, frames: 12 },
      enemy_purple: { sx: 37, sy: 0, w: 42, h: 43, frames: 1 }
    };
    basics = { x: 100, y: 101, sprite: 'enemy_purple', health: 2 };
    var gameBoard = new GameBoard();
    var myenemy = new Enemy(basics);
    var myship = new PlayerShip();
    myship.x=100;
    myship.y=100;
   
    gameBoard.add(myenemy);
    gameBoard.add(myship);

    expect(gameBoard.objects.length).toBe(2);
    gameBoard.step(1);

    //al chocar se eliminan los dos objetos y se añade la explosion
    expect(gameBoard.objects.length).toBe(1);
    expect(gameBoard.objects[0].sprite).toEqual("explosion");

  });

});
