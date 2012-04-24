# let's import all the important box2d stuff
b2Vec2 = Box2D.Common.Math.b2Vec2
b2AABB = Box2D.Collision.b2AABB
{b2BodyDef, b2Body, b2FixtureDef, b2Fixture, b2World, b2DebugDraw} = Box2D.Dynamics
{b2MassData, b2PolygonShape, b2CircleShape} = Box2D.Collision.Shapes #<3 Coffeescript

W = window
FPS = 60
W.DEBUG_PAUSE = false
W.DEBUG_RESET = false
world = null
w = h = null

window.main = () ->
	cnv = document.getElementById("cnv")
	ctx = cnv.getContext('2d')
	w = cnv.width
	h = cnv.height
	ctx.fillStyle = "#DDD"
	ctx.fillRect 0,0,w,h

	initWorld()
	initDebugDraw()

	#for now let's just throw in a few boxes to make sure physics is working
	times 200, ->
		fixDef = new b2FixtureDef
		fixDef.density = 1.0
		fixDef.friction = 0.5
		fixDef.restitution = 0.2
		fixDef.shape = new b2PolygonShape
		fixDef.shape.SetAsBox(5, 5)
		bodyDef = new b2BodyDef
		bodyDef.type = b2Body.b2_dynamicBody;
		bodyDef.position.x = Math.random() * 300
		bodyDef.position.y = Math.random() * 300
		world.CreateBody(bodyDef).CreateFixture(fixDef)

	gameloop = () ->
		world.Step 1/FPS, 10, 10
		world.ClearForces();
		world.DrawDebugData()

	every 1/FPS, ->
		if W.DEBUG_RESET is true then W.location = W.location
		gameloop() unless W.DEBUG_PAUSE

initWorld = () ->
	world = new b2World( new b2Vec2(0, 100), true )

	#ground
	fixDef = new b2FixtureDef
	fixDef.density = 1.0
	fixDef.friction = 0.5
	fixDef.restitution = 0.2
	
	bodyDef = new b2BodyDef

	bodyDef.type = b2Body.b2_staticBody
	bodyDef.position.x = 0
	bodyDef.position.y = h
	fixDef.shape = new b2PolygonShape
	fixDef.shape.SetAsBox(w, 0.5)
	world.CreateBody(bodyDef).CreateFixture(fixDef)

initDebugDraw = () ->
	debugDraw = new b2DebugDraw()
	debugDraw.SetSprite(document.getElementById("cnv").getContext("2d"))
	debugDraw.SetDrawScale(1.0)
	debugDraw.SetFillAlpha(0.3)
	debugDraw.SetLineThickness(1.0)
	debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit)
	world.SetDebugDraw(debugDraw)
