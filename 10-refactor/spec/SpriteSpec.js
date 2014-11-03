describe("Clase Sprite", function(){


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

  it("Sprite.setup", function(){
    SpriteSheet.map = {
      explosion: {w:20, h:10} 
    };
    sprite= 'explosion';
    props=  {w:20, h:10};
    
    var mysprite = new Sprite();
    spyOn(mysprite,"merge");
    mysprite.setup(sprite,props);
    expect(mysprite.w).toBe(20);
    expect(mysprite.h).toBe(10);
    expect(mysprite.frame).toBe(0);
    expect(mysprite.sprite).toBe(sprite);
    expect(mysprite.merge).toHaveBeenCalledWith(props);

  });

  it("Sprite.merge",function(){

    props={B: 100, C: 2 , E: 100 };
    var mysprite = new Sprite();
    mysprite.merge(props);
    expect(mysprite.B).toBe(100);
    expect(mysprite.C).toBe(2);
    expect(mysprite.E).toBe(100);
  });

  it("Sprite.draw",function(){
    SpriteSheet= {
      draw: function(a, b, c, d){}
    };
    SpriteSheet.map = {
      explosion: {w:20, h:10} 
    };
    sprite='explosion';
    props={};

    ctx ={};
    var mysprite = new Sprite(sprite,props);
    mysprite.sprite=sprite;
    mysprite.frame=0;
    spyOn(SpriteSheet, "draw");

    mysprite.draw(ctx);
    expect(SpriteSheet.draw).toHaveBeenCalledWith(ctx,mysprite.sprite,mysprite.x, mysprite.y, mysprite.frame);
  });


});