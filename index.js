const screens = [
  new Screen({
    onclick: function (e) {
      if (hasHitCircle(e, 0, -20, 16)) {
        transition();
      }
    },
    render: () => {
      drawTriangle(0, -20);
      drawText('You are lost', 'center', 0, 40);
    },
  }),
  new Screen({
    onclick: () => transition(),
    render: () => drawMessage('Oh, you did that. Next time won’t be that easy!')
  }),
  new Screen({
    init: function () {
      this.line = new Draggable(-40, -20, {
        isHit: function (e) {
          return hasHitCircle(e, this.x, this.y, 20);
        },
        move: function (pos) {
          this.x = pos.x - width / 2 + 10;
          if (Math.abs(this.x) < 2) {
            this.s = 1;
            transition();
          }
          reset();
        },
        render: function () {
          ctx.strokeStyle = this.s ? '#fd9' : '#fff';
          drawLine(this.x, this.y, [-12, -14, -12, 14]);
          drawText('You', 'left', -87 + this.x, 40);
          drawText('are lost', 'left', -21, 40);
        }
      });
    },
    render: function () {
      this.line.render();
      drawLine(0, -20, [-12, -14, 12, 0, -12, 14]);
    }
  }),
  new Screen({
    init: function () {
      this.a = 1;
      this.text = '';
      this.i = setInterval(() => { this.a = !this.a; reset()}, 800);
    },
    onkeydown: function (e) {
      if (e.keyCode == 8) {
        this.text = this.text.slice(0, -1);
      } else {
        let letter = String.fromCharCode(e.keyCode).toLowerCase();
        if (letter != ' ' && (letter < 'a' || letter > 'z')) {
          return;
        }
        if (e.shiftKey) {
          letter = letter.toUpperCase();
        }
        this.text += letter;

        if (this.text == 'You are lost') {
          this.s = 1;
          clearInterval(this.i);
          transition();
        }
      }

      reset();
    },
    render: function () {
      ctx.strokeStyle = this.s ? '#fd9' : '#fff';
      drawTriangle(0, -20);
      this.a && drawText('|', 'left', ctx.measureText(this.text).width - 90, 37);
      drawText(this.text, 'left', -88, 40);
    }
  }),
  new Screen({
    init: function () {
      this.s = 5;
    },
    onkeydown: function (e) {
      if (e.keyCode === 187) {
        ++this.s;
      }
      if (e.keyCode === 189) {
        --this.s;
        if (this.s === 1) {
          transition();
        }
      }
      reset();
    },
    render: function () {
      ctx.scale(this.s, this.s);
      ctx.strokeStyle = this.s === 1 ? '#fd9' : '#fff';
      drawTriangle(0, -20);
      drawText('You are lost', 'center', 0, 40);
    }
  }),
  new Screen({
    init: function () {
      this.s = this.t = this.u = 0;
      this.i = setInterval(() => { ++this.t; this.s && ++this.u; reset() }, 33);
    },
    onclick: async function(e) {
      if (!this.s && hasHitCircle(e, 240, 120, 20)) {
        this.s = 1;
        await wait(2000);
        clearInterval(this.i);
        transition();
      }
    },
    render: function () {
      const a = Math.sin(this.t / 24);
      const b = Math.sin((this.t + 6) / 24);
      const c = Math.sin(this.t / 30);
      ctx.save();
      ctx.rotate(c / 30 % 20);
      ctx.strokeStyle = this.s ? '#fd9' : '#fff';
      drawTriangle(0, -20 + a * 10 + this.u / 2);
      ctx.restore();
      ctx.save();
      ctx.rotate(c / 33 % 20);
      drawText('You are lost', 'center', 0, 40 + b * 11 + this.u / 2);
      ctx.restore();
      ctx.fillStyle = '#000';
      drawEllipse(120, 120, 20, 10);
      ctx.fillStyle = 'rgba(36,36,36,.7)';
      drawEllipse(120, 120 - this.u, 20, 10);
    }
  }),
  new Screen({
    render: () => {
      drawPolygon(0, -20, [-14, -14, -14, 14, 14, 14, 14, -14]);
      drawText('You are no longer lost', 'center', 0, 40);
    }
  })
];

screens[currentScreen].init();
