const curtain = document.querySelector('#curtain');
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = 640;
const height = 360;

let currentScreen = 0;
let scale;
let offsetX, offsetY;

const reset = onresize = onload = () => {
  scale = Math.min(innerWidth / width, innerHeight / height);
  canvas.width = scale * width;
  canvas.height = scale * height;

  offsetX = (innerWidth - scale * width) / 2;
  canvas.style.left = offsetX + 'px';
  offsetY = (innerHeight - scale * height) / 2;
  canvas.style.top = offsetY + 'px';

  ctx.scale(scale, scale);
  ctx.translate(width / 2, height / 2);

  ctx.fillStyle = '#fff';
  ctx.strokeStyle = '#fd9';
  ctx.lineWidth = 2.5;
  ctx.lineJoin = 'round';
  ctx.font = '30px Bookman Old Style, serif';

  ctx.shadowColor = 'rgba(0,0,0,.5)';
  ctx.shadowBlur = 2;
  ctx.shadowOffsetX = ctx.shadowOffsetY = 2;

  screens[currentScreen]();
};

const drawTriangle = (x, y) => {
  ctx.save();
  ctx.translate(x, y);
  ctx.moveTo(-12, -14);
  ctx.lineTo(-12, 14);
  ctx.lineTo(12, 0);
  ctx.lineTo(-12, -14);
  ctx.lineTo(-12, 14);
  ctx.stroke();
  ctx.restore();
};

const drawText = (text, align, x, y) => {
  ctx.textAlign = align;
  ctx.fillText(text, x, y);
};

const drawMessage = text => {
  ctx.fillStyle = '#000';
  ctx.fillRect(-width / 2, -height / 2, width, height);
  ctx.fillStyle = '#fff';
  ctx.font = '20px Bookman Old Style, serif';
  drawText(text, 'center', 0, 0);
};

const getScreenPos = e => {
  return {x: (e.pageX - offsetX) / scale, y: (e.pageY - offsetY) / scale};
};

const wait = async (time) => {
  return new Promise(resolve => {
    setTimeout(resolve, time);
  });
};

const transition = async () => {
  onclick = onkeydown = () => {};

  curtain.classList.toggle('black');
  await wait(500);

  ++currentScreen;
  reset();

  curtain.classList.toggle('black');
  await wait(500);
};

const hasHitCircle = (e, a, b, r) => {
    const {x, y} = getScreenPos(e);
    const distance = Math.hypot(width / 2 + a - x, height / 2 + b - y);
    return distance <= r;
};

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
