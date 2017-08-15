const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = 640;
const height = 360;

let currentScreen = 0;

const reset = onresize = onload = () => {
  const scale = Math.min(innerWidth / width, innerHeight / height);
  canvas.width = scale * width;
  canvas.height = scale * height;

  canvas.style.left = (innerWidth - scale * width) / 2 + 'px';
  canvas.style.top = (innerHeight - scale * height) / 2 + 'px';

  ctx.scale(scale, scale);

  ctx.fillStyle = 'white';
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 2.5;
  ctx.lineJoin = 'round';
  ctx.font = '30px Bookman Old Style, serif';

  ctx.shadowColor = 'rgba(0,0,0,.5)';
  ctx.shadowBlur = 2;
  ctx.shadowOffsetX = ctx.shadowOffsetY = 2;

  screens[currentScreen]();
};

const triangle = (x, y) => {
  ctx.save();
  ctx.translate(x, y);
  ctx.moveTo(-12, -14);
  ctx.lineTo(-12, 14);
  ctx.lineTo(12, 0);
  ctx.lineTo(-12, -14);
  ctx.lineTo(-12, 14);
  ctx.stroke();
  ctx.restore();
}

const text = (text, align, x, y) => {
  ctx.textAlign = align;
  ctx.fillText(text, x, y);
};

const screens = [
  function () {
    triangle(width / 2, height / 2 - 20);
    text('You are lost', 'center', width / 2, height / 2 + 40);
  }
];
