window.main = () ->
	cnv = document.getElementById("cnv")
	ctx = cnv.getContext('2d')
	w = cnv.width
	h = cnv.height
	ctx.fillStyle = "#DDD"
	ctx.fillRect 0,0,w,h