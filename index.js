const screens = [
  () => {
    drawTriangle(0, -20);
    drawText('You are lost', 'center', 0, 40);
    onclick = async e => {
      if (hasHitCircle(e, 0, -20, 16)) {
        transition();
      }
    };
  },
  () => {
    drawMessage('Oh, you did that. Next time won’t be that easy!');
    onclick = transition;
  },
  (() => {
    let line, first = true;

    return () => {
      if (first) {
          first = false;
          line = new Draggable(-40, -20, {
            isHit: function (e) {
              return hasHitCircle(e, this.x, this.y, 20);
            },
            move: function (pos) {
              this.x = pos.x - width / 2 + 10;
              reset();
            },
            render: function () {
              drawLine(this.x, this.y, [-12, -14, -12, 14]);
              drawText('You', 'left', -87 + this.x, 40);
              drawText('are lost', 'left', -21, 40);
            }
          });
      }

      ctx.strokeStyle = Math.abs(line.x) < 2 ? '#fd9' : '#fff';

      line.render();
      drawLine(0, -20, [-12, -14, 12, 0, -12, 14]);

      onclick = async e => {
        if (Math.abs(line.x) < 2 && hasHitCircle(e, 0, -20, 16)) {
          transition();
        }
      };
    }
  })(),
  (() => {
    let i, a = first = 1, s, text = '';
    return () => {
      if (first) {
        first = 0;
        i = setInterval(() => { a = !a; reset()}, 800);
      }

      ctx.strokeStyle = s === 1 ? '#fd9' : '#fff';
      drawTriangle(0, -20);
      a && drawText('|', 'left', ctx.measureText(text).width - 90, 37);
      drawText(text, 'left', -88, 40);
      onkeydown = e => {
        if (e.keyCode == 8) {
          text = text.slice(0, -1);
        } else {
          let letter = String.fromCharCode(e.keyCode).toLowerCase();
          if (letter != ' ' && (letter < 'a' || letter > 'z')) {
            return;
          }
          if (e.shiftKey) {
            letter = letter.toUpperCase();
          }
          text += letter;

          if (text == 'You are lost') {
            s = 1;
            transition();
          }
        }

        reset();
      };
    };
  })(),
  (() => {
    let s = 5;
    return () => {
      ctx.scale(s, s);
      ctx.strokeStyle = s === 1 ? '#fd9' : '#fff';
      drawTriangle(0, -20);
      drawText('You are lost', 'center', 0, 40);
      onkeydown = e => {
        if (e.keyCode === 189 && s > 1) {
          --s;
          reset();
          if (s === 1) {
            transition();
          }
        }
      }
    };
  })(),
  () => {
    drawPolygon(0, -20, [-14, -14, -14, 14, 14, 14, 14, -14]);
    drawText('You are no longer lost', 'center', 0, 40);
  }
];
