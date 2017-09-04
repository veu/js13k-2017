let draggables = [];
let dragging = false;

onmousedown = e => {
  draggables.some(draggable => {
    if (!transitioning && draggable.isHit(e)) {
      dragging = draggable;
      return true;
    }
  });
};

onmousemove = e => {
  if (!dragging) {
    if (!transitioning && screens[currentScreen].onmousemove) {
      screens[currentScreen].onmousemove(e);
    }

    return;
  }
  dragging.move(getScreenPos(e));
};

onmouseup = onmouseout = onmouseleave = e => {
  dragging = false;
};

class Draggable {
  constructor(x, y, methods) {
    this.x = x;
    this.y = y;
    for (const i in methods) {
      this[i] = methods[i];
    }
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
  constructor(methods) {
    for (const i in methods) {
      this[i] = methods[i];
    }
    this.init = this.init || (() => {});
  }
}
