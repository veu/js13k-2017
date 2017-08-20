let draggables = [];
let dragging = false;

onmousedown = e => {
  draggables.some(draggable => {
    if (!transitioning && draggable.isHit(e)) {
      dragging = draggable;
      const pos = getScreenPos(e);
      return true;
    }
  });
};

onmousemove = e => {
  if (!dragging) {
    return;
  }
  dragging.move(getScreenPos(e));
};

onmouseup = onmouseout = onmouseleave = e => {
  dragging = false;
};

class Draggable {
  constructor(x, y, {isHit, move, render, start}) {
    this.x = x;
    this.y = y;
    this.isHit = isHit;
    this.move = move;
    this.render = render;
    this.start = start;
    draggables.push(this);
  }
}

for (const event of ['onclick', 'onkeydown']) {
  window[event] = e => {
    if (!transitioning && screens[currentScreen][event]) {
      screens[currentScreen][event](e);
    }
  };
}

class Screen {
  constructor({init, render, onclick, onkeydown}) {
    this.init = init || (() => {});
    this.render = render;
    this.onclick = onclick;
    this.onkeydown = onkeydown;
  }
}
