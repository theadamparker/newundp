import $ from 'jquery';
import { Plugin } from 'foundation-sites/js/foundation.core.plugin';

class Waves extends Plugin {

    _setup(element, options) {
      this.$element = element;
      this.options = $.extend({}, Waves.defaults, this.$element.data(), options);
      this.className = 'Waves'; // ie9 back compat

      this._init();

    }

    _init() {
      var that = this;

      var $canvas = that.$element.find('canvas');
      if ($canvas.length < 1) {
        $canvas = $('<canvas>').prependTo(that.$element);
      }

      var canvas = $canvas.get(0);
      canvas.width = that.$element.width();
      canvas.height = that.$element.height();
      this.canvas = canvas;

      var img = new Image();
      img.onload = function(){
        that.waves();
      };
      img.src = that.options.src;
      this.img = img;
      //console.log($(img));

      // redraw on resize
      $(window).one('resize', function(){
        that._init();
      });


    }

    waves() {
      var that = this;

      var ctx = that.canvas.getContext("2d"),
          w = that.canvas.width,
          h = that.canvas.height;

      var cropped = document.createElement("canvas"),  // off-screen canvas for cropped image
          cctx = cropped.getContext("2d");

          cropped.width = w; cropped.height = h;
      that.drawImageProp(cctx, that.img, 0, 0, w, h);
      ctx.drawImage(cropped, 0, 0);

      var o1 = new that.Osc(0.05), o2 = new that.Osc(0.03), o3 = new that.Osc(0.06),  // osc. for vert
          o4 = new that.Osc(0.08), o5 = new that.Osc(0.04), o6 = new that.Osc(0.067), // osc. for hori

          // source grid lines
          x0 = 0, x1 = w * 0.25, x2 = w * 0.5, x3 = w * 0.75, x4 = w,
          y0 = 0, y1 = h * 0.25, y2 = h * 0.5, y3 = h * 0.75, y4 = h,

          // cache source widths/heights
          sw0 = x1, sw1 = x2 - x1, sw2 = x3 - x2, sw3 = x4 - x3,
          sh0 = y1, sh1 = y2 - y1, sh2 = y3 - y2, sh3 = y4 - y3,

          vcanvas = document.createElement("canvas"),  // off-screen canvas for 2. pass
          vctx = vcanvas.getContext("2d");

      vcanvas.width = w; vcanvas.height = h;           // set to same size as main canvas

      (function loop() {
        ctx.clearRect(0, 0, w, h);

        for (var y = 0; y < h; y++) {

          // segment positions
          var n = y * 0.2;
          var lx1 = x1 + o1.current(n) * 2.5,
              lx2 = x2 + o2.current(n) * 2.0,
              lx3 = x3 + o3.current(n) * 1.5,

              // segment widths
              w0 = lx1,
              w1 = lx2 - lx1,
              w2 = lx3 - lx2,
              w3 =  x4 - lx3;

          // draw image lines
          ctx.drawImage(cropped, x0, y, sw0, 1, 0        , y, w0      , 1);
          ctx.drawImage(cropped, x1, y, sw1, 1, lx1 - 0.5, y, w1 + 0.5, 1);
          ctx.drawImage(cropped, x2, y, sw2, 1, lx2 - 0.5, y, w2 + 0.5, 1);
          ctx.drawImage(cropped, x3, y, sw3, 1, lx3 - 0.5, y, w3 + 0.5, 1);
        }

        // pass 1 done, copy to off-screen canvas:
        vctx.clearRect(0, 0, w, h);    // clear off-screen canvas (only if alpha)
        vctx.drawImage(that.canvas, 0, 0);
        ctx.clearRect(0, 0, w, h);     // clear main (onlyif alpha)

        for (var x = 0; x < w; x++) {
          var ly1 = y1 + o4.current(x * 0.32),
              ly2 = y2 + o5.current(x * 0.3) * 2,
              ly3 = y3 + o6.current(x * 0.4) * 1.5;

          ctx.drawImage(vcanvas, x, y0, 1, sh0, x, 0        , 1, ly1);
          ctx.drawImage(vcanvas, x, y1, 1, sh1, x, ly1 - 0.5, 1, ly2 - ly1 + 0.5);
          ctx.drawImage(vcanvas, x, y2, 1, sh2, x, ly2 - 0.5, 1, ly3 - ly2 + 0.5);
          ctx.drawImage(vcanvas, x, y3, 1, sh3, x, ly3 - 0.5, 1,  y4 - ly3 + 0.5);
        }

        requestAnimationFrame(loop);
      })();
    }

    Osc(speed) {

      var frame = 0;

      this.current = function(x) {
        frame += 0.002 * speed;
        return Math.sin(frame + x * speed * 10);
      };
    }

    drawImageProp(ctx, img, x, y, w, h, offsetX, offsetY) {

      if (arguments.length === 2) {
          x = y = 0;
          w = ctx.canvas.width;
          h = ctx.canvas.height;
      }

      // default offset is center
      offsetX = typeof offsetX === "number" ? offsetX : 0.5;
      offsetY = typeof offsetY === "number" ? offsetY : 0.5;

      // keep bounds [0.0, 1.0]
      if (offsetX < 0) offsetX = 0;
      if (offsetY < 0) offsetY = 0;
      if (offsetX > 1) offsetX = 1;
      if (offsetY > 1) offsetY = 1;

      var iw = img.width,
          ih = img.height,
          r = Math.min(w / iw, h / ih),
          nw = iw * r,   // new prop. width
          nh = ih * r,   // new prop. height
          cx, cy, cw, ch, ar = 1;

      // decide which gap to fill
      if (nw < w) ar = w / nw;
      if (Math.abs(ar - 1) < 1e-14 && nh < h) ar = h / nh;  // updated
      nw *= ar;
      nh *= ar;

      // calc source rectangle
      cw = iw / (nw / w);
      ch = ih / (nh / h);

      cx = (iw - cw) * offsetX;
      cy = (ih - ch) * offsetY;

      // make sure source rectangle is valid
      if (cx < 0) cx = 0;
      if (cy < 0) cy = 0;
      if (cw > iw) cw = iw;
      if (ch > ih) ch = ih;

      // fill image in dest. rectangle
      ctx.drawImage(img, cx, cy, cw, ch,  x, y, w, h);
  }
}

Waves.defaults = {
}

export {Waves};
