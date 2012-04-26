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
PIXEL_SCALE = 3 #how large are the pixels?

document.body.addEventListener 'keydown', (event) ->
	if event.which is 80 then W.DEBUG_PAUSE ^= true #cool way to swap a boolean
	if event.which is 79 then W.DEBUG_RESET ^= true #didn't know about that before

window.main = () ->
	cnv = document.getElementById("cnv")
	ctx = cnv.getContext('2d')
	w = cnv.width
	h = cnv.height
	ctx.fillStyle = "#DDD"
	ctx.fillRect 0,0,w,h

	initWorld()
	initDebugDraw()

	times 5, ->
		new Invader(Math.random() * 400, Math.random() * 400)

	gameloop = () ->
		world.Step 1/FPS, 10, 10
		world.ClearForces();
		world.DrawDebugData()

	#replace this with requestAnimationFrame
	every 1/FPS, ->
		if W.DEBUG_RESET then W.location = W.location
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

	#wall left
	bodyDef.type = b2Body.b2_staticBody
	bodyDef.position.x = 0
	bodyDef.position.y = 0
	fixDef.shape = new b2PolygonShape
	fixDef.shape.SetAsBox(0.5, h)
	world.CreateBody(bodyDef).CreateFixture(fixDef)

	#wall right
	bodyDef.type = b2Body.b2_staticBody
	bodyDef.position.x = w
	bodyDef.position.y = 0
	fixDef.shape = new b2PolygonShape
	fixDef.shape.SetAsBox(0.5, h)
	world.CreateBody(bodyDef).CreateFixture(fixDef)

initDebugDraw = () ->
	debugDraw = new b2DebugDraw()
	debugDraw.SetSprite(document.getElementById("cnv").getContext("2d"))
	debugDraw.SetDrawScale(1.0)
	debugDraw.SetFillAlpha(0.3)
	debugDraw.SetLineThickness(1.0)
	debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit)
	world.SetDebugDraw(debugDraw)

class Invader
	constructor: (@x,@y) ->
		@destroyed = false
		@sp = new Sprite([
			[ 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0 ]
	        [ 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0 ]
	        [ 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0 ]
	        [ 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0 ]
	        [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ]
	        [ 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1 ]
	        [ 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1 ]
	        [ 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0 ]
		], @x, @y, -1)
		@sp.addToWorld()

		every 1/FPS, =>
			if @destroyed is true then return
			for pi in @sp.pixels
				#b2Body.ApplyForce(/* b2Vec2 how much */, /* b2Vec2 from where */)
				pi.p.body.SetLinearVelocity(new b2Vec2(0, 0)) #Don't use this!!
				if pi.p.body.GetContactList()? and destroyed is false
					if pi.p.body.GetContactList().contact.IsTouching() then pi.p.body.m_fixtureList.m_filter.groupIndex = 1 and destroyed = true

class Sprite
	# de facto PixelManager
	constructor: (sp, @x, @y, @group) ->
		@pixels = []
		#this is ugly but whatever bro
		((if val is 1 then @pixels.push({p:new Pixel(),x:x,y:y})) for val, x in li for li, y in sp)
	
	addToWorld: () ->
		for pi in @pixels
			pi.p.addToWorld(pi.x*(PIXEL_SCALE*2+2) + @x, pi.y*(PIXEL_SCALE*2+2) + @y)

class Pixel
	constructor: () ->
		@fixDef = new b2FixtureDef
		@fixDef.density = 1.0
		@fixDef.friction = 0.5
		@fixDef.restitution = 0.2
		@fixDef.shape = new b2PolygonShape
		@fixDef.shape.SetAsBox(PIXEL_SCALE, PIXEL_SCALE)
		@bodyDef = new b2BodyDef
		@bodyDef.type = b2Body.b2_dynamicBody
		@

	addToWorld: (x, y) ->
		@bodyDef.position.x = x
		@bodyDef.position.y = y
		@body = world.CreateBody(@bodyDef)
		@fixture = @body.CreateFixture(@fixDef)

	#for drawing, later
	x: -> @body.position.x
	y: -> @body.position.y
