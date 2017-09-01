let d1;
const screens = [
  d1 = new Screen({
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
  d1,
  new Screen({
    onclick: () => transition(),
    render: () => drawMessage('Okay, it was literally just as easy. No more!')
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
    init: function () {
      this.n = [];
      for (let i = 8; i--;) {
        this.n.push({x: (i/7)*400-250+Math.random()*100, y: -10+Math.random()*20, m: .5 + Math.random() / 2})
      }
      this.n.sort((a, b) => a.m - b.m);
      this.i = setInterval(() => {
        this.n.forEach(n => n.m += Math.max(1.5 - n.m, 0) / 60);
        reset();
      }, 33);
    },
    onclick: function (e) {
      const {x, y} = getScreenPos(e);
      this.n = this.n.filter(n => {
        if (Math.abs(n.x - x + width / 2) < (1+n.m) * 25 && Math.abs(n.y - y + height / 2) < (1+n.m) * 40) {
          n.m = Math.max(n.m - .3 - Math.random() * .7, 0);
          n.h = 20;
        }
        return n.m;
      });
      this.n.sort((a, b) => a.m - b.m);
      if (!this.n.length) {
        transition();
      }
    },
    render: function () {
      ctx.strokeStyle = this.n.length ? '#fff' : '#fd9';
      drawTriangle(0, -20);
      drawText('You are lost', 'center', 0, 40);

      for (const n of this.n) {
        n.h = Math.max(0, n.h - 1);

        ctx.save();
        ctx.translate(n.x, n.y);
        ctx.scale(1+n.m,2*(1+n.m));

        ctx.beginPath();
        ctx.moveTo(0,-20);
        ctx.lineTo(-25,20);
        ctx.quadraticCurveTo(0,26,25,20);

        const gradient = ctx.createRadialGradient(0, -10, 90, 0, -20, 0);
        gradient.addColorStop(1, `rgb(${50+n.m*150|0},${50+n.m*150|0},${50+n.m*150|0})`);
        gradient.addColorStop(0, `rgb(${50+n.m*50|0},${50+n.m*50|0},${50+n.m*50|0})`);
        ctx.fillStyle = gradient;
        ctx.fill();

        ctx.fillStyle = '#000';
        ctx.scale(1.5,n.h?.2:.5);
        ctx.fillText('.', 3, 0);
        ctx.fillText('.', -3, 0);

        ctx.restore();
      }
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
