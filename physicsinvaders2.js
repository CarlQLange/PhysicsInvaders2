(function() {
  var FPS, Invader, PIXEL_SCALE, Pixel, Sprite, W, b2AABB, b2Body, b2BodyDef, b2CircleShape, b2DebugDraw, b2Fixture, b2FixtureDef, b2MassData, b2PolygonShape, b2Vec2, b2World, h, initDebugDraw, initWorld, w, world, _ref, _ref2;

  b2Vec2 = Box2D.Common.Math.b2Vec2;

  b2AABB = Box2D.Collision.b2AABB;

  _ref = Box2D.Dynamics, b2BodyDef = _ref.b2BodyDef, b2Body = _ref.b2Body, b2FixtureDef = _ref.b2FixtureDef, b2Fixture = _ref.b2Fixture, b2World = _ref.b2World, b2DebugDraw = _ref.b2DebugDraw;

  _ref2 = Box2D.Collision.Shapes, b2MassData = _ref2.b2MassData, b2PolygonShape = _ref2.b2PolygonShape, b2CircleShape = _ref2.b2CircleShape;

  W = window;

  FPS = 60;

  W.DEBUG_PAUSE = false;

  W.DEBUG_RESET = false;

  world = null;

  w = h = null;

  PIXEL_SCALE = 3;

  document.body.addEventListener('keydown', function(event) {
    if (event.which === 80) W.DEBUG_PAUSE ^= true;
    if (event.which === 79) return W.DEBUG_RESET ^= true;
  });

  window.main = function() {
    var cnv, ctx, gameloop;
    cnv = document.getElementById("cnv");
    ctx = cnv.getContext('2d');
    w = cnv.width;
    h = cnv.height;
    ctx.fillStyle = "#DDD";
    ctx.fillRect(0, 0, w, h);
    initWorld();
    initDebugDraw();
    times(5, function() {
      return new Invader(Math.random() * 400, Math.random() * 400);
    });
    gameloop = function() {
      world.Step(1 / FPS, 10, 10);
      world.ClearForces();
      return world.DrawDebugData();
    };
    return every(1 / FPS, function() {
      if (W.DEBUG_RESET) W.location = W.location;
      if (!W.DEBUG_PAUSE) return gameloop();
    });
  };

  initWorld = function() {
    var bodyDef, fixDef;
    world = new b2World(new b2Vec2(0, 100), true);
    fixDef = new b2FixtureDef;
    fixDef.density = 1.0;
    fixDef.friction = 0.5;
    fixDef.restitution = 0.2;
    bodyDef = new b2BodyDef;
    bodyDef.type = b2Body.b2_staticBody;
    bodyDef.position.x = 0;
    bodyDef.position.y = h;
    fixDef.shape = new b2PolygonShape;
    fixDef.shape.SetAsBox(w, 0.5);
    world.CreateBody(bodyDef).CreateFixture(fixDef);
    bodyDef.type = b2Body.b2_staticBody;
    bodyDef.position.x = 0;
    bodyDef.position.y = 0;
    fixDef.shape = new b2PolygonShape;
    fixDef.shape.SetAsBox(0.5, h);
    world.CreateBody(bodyDef).CreateFixture(fixDef);
    bodyDef.type = b2Body.b2_staticBody;
    bodyDef.position.x = w;
    bodyDef.position.y = 0;
    fixDef.shape = new b2PolygonShape;
    fixDef.shape.SetAsBox(0.5, h);
    return world.CreateBody(bodyDef).CreateFixture(fixDef);
  };

  initDebugDraw = function() {
    var debugDraw;
    debugDraw = new b2DebugDraw();
    debugDraw.SetSprite(document.getElementById("cnv").getContext("2d"));
    debugDraw.SetDrawScale(1.0);
    debugDraw.SetFillAlpha(0.3);
    debugDraw.SetLineThickness(1.0);
    debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
    return world.SetDebugDraw(debugDraw);
  };

  Invader = (function() {

    function Invader(x, y) {
      this.x = x;
      this.y = y;
      this.sp = new Sprite([[0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0], [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0], [0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0], [0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0], [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], [1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1], [1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1], [0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0]], this.x, this.y).addToWorld();
    }

    return Invader;

  })();

  Sprite = (function() {

    function Sprite(sp, x, y) {
      var li, val, _len, _len2;
      this.x = x;
      this.y = y;
      this.pixels = [];
      for (y = 0, _len = sp.length; y < _len; y++) {
        li = sp[y];
        for (x = 0, _len2 = li.length; x < _len2; x++) {
          val = li[x];
          if (val === 1) {
            this.pixels.push({
              p: new Pixel(),
              x: x,
              y: y
            });
          }
        }
      }
    }

    Sprite.prototype.addToWorld = function() {
      var pi, _i, _len, _ref3, _results;
      _ref3 = this.pixels;
      _results = [];
      for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
        pi = _ref3[_i];
        _results.push(pi.p.addToWorld(pi.x * (PIXEL_SCALE * 2 + 2) + this.x, pi.y * (PIXEL_SCALE * 2 + 2) + this.y));
      }
      return _results;
    };

    return Sprite;

  })();

  Pixel = (function() {

    function Pixel() {
      this.fixDef = new b2FixtureDef;
      this.fixDef.density = 1.0;
      this.fixDef.friction = 0.5;
      this.fixDef.restitution = 0.2;
      this.fixDef.shape = new b2PolygonShape;
      this.fixDef.shape.SetAsBox(PIXEL_SCALE, PIXEL_SCALE);
      this.bodyDef = new b2BodyDef;
      this.bodyDef.type = b2Body.b2_dynamicBody;
      this;
    }

    Pixel.prototype.addToWorld = function(x, y) {
      this.bodyDef.position.x = x;
      this.bodyDef.position.y = y;
      return world.CreateBody(this.bodyDef).CreateFixture(this.fixDef);
    };

    Pixel.prototype.x = function() {
      return this.bodyDef.position.x;
    };

    Pixel.prototype.y = function() {
      return this.bodyDef.position.y;
    };

    return Pixel;

  })();

}).call(this);
