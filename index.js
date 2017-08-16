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
        }
      };
      onclick = async e => {
        if (s === 1 && hasHitCircle(e, 0, -20, 16)) {
          transition();
        }
      }
    };
  })(),
  () => {
    drawTriangle(0, -20);
    drawText('Nothing here yet', 'center', 0, 40);
  }
];
