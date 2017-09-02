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
      this.p = {x: 10, y: -20};
    },
    onmousemove: function (e) {
      const {x, y} = getScreenPos(e);
      this.p = {x: width / 2 - x, y: height / 2 - y};
      if (Math.abs(this.p.x) < 1 && Math.abs(this.p.y) < 1) {
        this.p = {x: 0, y: 0};
        transition();
      }

      reset();
    },
    render: function () {
      ctx.globalAlpha = .5;
      ctx.globalCompositeOperation = 'lighter';
      ctx.strokeStyle = transitioning ? '#fd9' : '#fff';
      drawTriangle(0, -20);
      drawTriangle(this.p.x, this.p.y - 20);
      drawText('You are lost', 'center', 0, 40);
      drawText('You are lost', 'center', this.p.x, this.p.y + 40);
    },
  }),
  new Screen({
    onclick: () => transition(),
    render: () => drawMessage('Finished already? Let’s see how you handle the next one.')
  }),
  new Screen({
    init: function () {
      this.line = new Draggable(-40, -20, {
        isHit: function (e) {
          return hasHitCircle(e, this.x, this.y, 20);
        },
        move: function (pos) {
          this.x = pos.x - width / 2 + 10;
          clamp(this);
          if (Math.abs(this.x) < 2) {
            this.s = 1;
            transition();
          }
          reset();
        },
        render: function () {
          ctx.strokeStyle = this.s ? '#fd9' : '#fff';
          drawLine(this.x, this.y, [-12, -14, -12, 14]);
          const left = -ctx.measureText('You are lost').width / 2;
          drawText('You', 'left', left + this.x, 40);
          drawText('are lost', 'left', left + ctx.measureText('You ').width, 40);
        }
      });
    },
    render: function () {
      this.line.render();
      drawLine(0, -20, [-12, -14, 12, 0, -12, 14]);
    }
  }),
  new Screen({
    onclick: () => transition(),
    render: () => drawMessage('That took a bit longer. Don’t let it drag you down. ;)')
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
    onclick: () => transition(),
    render: () => drawMessage('No, you are!')
  }),
  new Screen({
    init: function () {
      this.s = 5;
    },
    onkeydown: function (e) {
      if (e.key === '+') {
        ++this.s;
      }
      if (e.key === '-') {
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
    onclick: () => transition(),
    render: () => drawMessage('I’m excited. Aren’t you? Let’s see what’s next.')
  }),
  new Screen({
    init: function () {
      this.m = {x: 0, y: 200};
      this.r = .2;
    },
    onmousemove: function (e) {
      if (this.r > 50) return;
      const {x, y} = getScreenPos(e);
      this.m = {x: x - width / 2, y: y - height / 2};
      this.r *= 1.01;
      reset();
    },
    render: async function () {
      ctx.strokeStyle = '#fff';

      ctx.save();
      ctx.beginPath();
      this.addEyePath(-50,-15);
      ctx.clip();
      const rl = Math.atan2(15 + this.m.y, 50 + this.m.x);
      drawRing(-50 + Math.cos(rl) * this.r, -15 + Math.sin(rl) * this.r, 17);
      drawEllipse(-50 + Math.cos(rl) * this.r, -15 + Math.sin(rl) * this.r, 7);
      ctx.restore();

      ctx.save();
      ctx.beginPath();
      this.addEyePath(50,-15);
      ctx.clip();
      const rr = Math.atan2(15 + this.m.y, -50 + this.m.x);
      drawRing(50 + Math.cos(rr) * this.r, -15 + Math.sin(rr) * this.r, 17);
      drawEllipse(50 + Math.cos(rr) * this.r, -15 + Math.sin(rr) * this.r, 7);
      ctx.restore();

      ctx.beginPath();
      this.addEyePath(-50,-15);
      this.addEyePath(50,-15);
      ctx.stroke();
      drawText('You are lost', 'center', 0, 40);

      if (this.r > 50) {
        ctx.strokeStyle = '#fd9';
        drawTriangle(0, -20);
        await wait(1000);
        transition();
      }
    },
    addEyePath: function (x, y) {
      ctx.moveTo(x-30,y);
      ctx.quadraticCurveTo(x,y-30,x+30,y);
      ctx.quadraticCurveTo(x,y+30,x-30,y);
    },
  }),
  new Screen({
    onclick: () => transition(),
    render: () => drawMessage('Do you get seasick?')
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
    onclick: () => transition(),
    render: () => drawMessage('I do. I’m glad that’s over.')
  }),
  new Screen({
    init: function () {
      this.d = [];
      for (let i=84;i--;) {
        this.d.push({
          x: i/83*(width-80)-width/2+20+Math.random()*20,
          y: 90 + Math.random() * 20,
          i
        });
      }
      this.t = new Draggable(-20, -20, {
        isHit: function (e) {
          return hasHitCircle(e, this.x, this.y, 20);
        },
        move: function (pos) {
          this.x = pos.x - width / 2 + 4;
          this.y = pos.y - height / 2;
          clamp(this);
          reset();
        },
        render: function () {
          ctx.strokeStyle = '#fff';
          ctx.lineWidth = 1.5;
          drawTriangle(this.x, this.y);
          ctx.fillStyle = '#fd9';
          this.s.forEach((_,i) => {
            let x, y;
            if (i < 28) {
              x = this.x - 12;
              y = this.y - 14 + +i;
            } else if (i < 56) {
              x = this.x - 12 + (i - 28) / 7 * 6;
              y = this.y - 14 + (i - 28) / 2;
            } else {
              x = this.x - 12 + (i - 56) / 7 * 6;
              y = this.y + 14 - (i - 56) / 2;
            }
            drawEllipse(x, y, 1.25);
          });
          ctx.fillStyle = '#fff';
        }
      });
      this.t.s = [];
    },
    render: function () {
      this.t.render();
      drawText('You are lost', 'center', 0, 40);

      this.d = this.d.filter(d => {
        if (Math.hypot(this.t.x - d.x, this.t.y - d.y) < 10) {
          this.t.s[d.i] = 1;
          return 0;
        }
        ctx.fillStyle = 'rgba(255,221,153,.7)';
        drawEllipse(d.x, d.y, 1.25);
        return 1;
      });

      if (!this.d.length) {
        transition();
      }
    },
  }),
  new Screen({
    onclick: () => transition(),
    render: () => drawMessage('What if I hide the triangle?')
  }),
  new Screen({
    init: function () {
      const startAnim = () => {
        const i = setInterval(() => {
          this.o += 2;
          this.e.y += 2;
          if (this.o == 240) {
            clearInterval(i);
            transition();
          }
          reset();
        }, 33);
      };

      this.o = 0;
      this.first = 1;
      this.e = new Draggable(0, 34, {
        isHit: function (e) {
          return !this.h && hasHitCircle(e, this.x, this.y, 10);
        },
        render: function () {
          ctx.save();
          ctx.translate(this.x, this.y);
          ctx.rotate(.5);
          drawText('e', 'center', 0, 6);
          ctx.restore();
        },
        move: function (pos) {
          if (this.h) return;
          this.x = pos.x - width / 2;
          this.y = pos.y - height / 2;
          clamp(this);
          if (Math.hypot(this.x - 147, this.y - 14) < 4) {
            this.x = this.h = 147;
            this.y = 14;
            startAnim();
          }

          reset();
        }
      });
    },
    render: function () {
      const left = -ctx.measureText('You are lost').width / 2;
      if (this.first) {
        this.first = 0;
        this.e.x = left + ctx.measureText('You ar').width + ctx.measureText('e').width / 2;
      }

      ctx.save();
      ctx.strokeStyle = '#aaa';
      ctx.lineWidth = 1.5;
      drawLine(-8,0,[0,-200,0,200-this.o]);
      drawLine(150,0,[0,-200,0,this.o]);
      ctx.beginPath();
      ctx.arc(150,5+this.o,5,Math.PI*3/2,2.5,0);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(-8,205-this.o,5,Math.PI*3/2,2.5,0);
      ctx.stroke();
      ctx.restore();

      drawTriangle(0, 220-this.o);

      drawText('You ar', 'left', left, 40);
      drawText('lost', 'left', left + ctx.measureText('You are ').width, 40);
      this.e.render();

      ctx.save();
      ctx.strokeStyle = '#999';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(150,5 + this.o,5,Math.PI/2,3,0);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(-8,205 - this.o,5,Math.PI/2,3,0);
      ctx.stroke();
      ctx.restore();
    }
  }),
  new Screen({
    onclick: () => transition(),
    render: () => drawMessage('Admit it, you’re hooked.')
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
    onclick: () => transition(),
    render: () => drawMessage('Thanks for punching those Nazis. I like you. :)')
  }),
  new Screen({
    render: () => {
      drawPolygon(0, -20, [-14, -14, -14, 14, 14, 14, 14, -14]);
      drawText('You are no longer lost', 'center', 0, 40);
    }
  })
];
