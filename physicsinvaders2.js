(function() {
  var FPS, W, b2AABB, b2Body, b2BodyDef, b2CircleShape, b2DebugDraw, b2Fixture, b2FixtureDef, b2MassData, b2PolygonShape, b2Vec2, b2World, h, initDebugDraw, initWorld, w, world, _ref, _ref2;

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
    times(200, function() {
      var bodyDef, fixDef;
      fixDef = new b2FixtureDef;
      fixDef.density = 1.0;
      fixDef.friction = 0.5;
      fixDef.restitution = 0.2;
      fixDef.shape = new b2PolygonShape;
      fixDef.shape.SetAsBox(5, 5);
      bodyDef = new b2BodyDef;
      bodyDef.type = b2Body.b2_dynamicBody;
      bodyDef.position.x = Math.random() * 300;
      bodyDef.position.y = Math.random() * 300;
      return world.CreateBody(bodyDef).CreateFixture(fixDef);
    });
    gameloop = function() {
      world.Step(1 / FPS, 10, 10);
      world.ClearForces();
      return world.DrawDebugData();
    };
    return every(1 / FPS, function() {
      if (W.DEBUG_RESET === true) W.location = W.location;
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

}).call(this);
