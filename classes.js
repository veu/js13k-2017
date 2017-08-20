let draggables = [];
let dragging = false;

onmousedown = e => {
  draggables.some(draggable => {
    if (draggable.isHit(e)) {
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

class Screen {
  constructor({init, render}) {
    this.init = init || (() => {});
    this.render = render;
  }
}
