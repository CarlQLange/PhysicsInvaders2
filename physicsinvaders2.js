(function() {

  window.main = function() {
    var cnv, ctx, h, w;
    cnv = document.getElementById("cnv");
    ctx = cnv.getContext('2d');
    w = cnv.width;
    h = cnv.height;
    ctx.fillStyle = "#DDD";
    return ctx.fillRect(0, 0, w, h);
  };

}).call(this);
