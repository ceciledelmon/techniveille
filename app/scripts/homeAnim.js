let mesh;
let cloth;
let spacingX = 5;
let spacingY = 5;
let accuracy = 1;

let opts = {
  image: './images/back.png',
  gravity: 800,
  friction: 0.99,
  bounce: 0.3,
  pointsX: 100,
  pointsY: 50,
  renderCloth: true,
  mouseInfluence: 39,
  pinCorners: true,
  randomImage(){
    this.image = 'https://unsplash.it/400/400?image=' + Math.floor(Math.random() * 1100);
    loadTexture();
  }
};


let canvas = document.createElement('canvas');
let ctx = canvas.getContext('2d');
document.getElementById('cloth').appendChild(canvas);

ctx.strokeStyle = '#FFF';

let mouse = {
  down: false,
  x: 0,
  y: 0,
  px: 0,
  py: 1
}

/*////////////////////////////////////////*/

let stage = new PIXI.Container();
let renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight, { transparent: true });

document.getElementById('cloth').append(renderer.view, canvas);
renderer.render(stage);

canvas.width = renderer.width;
canvas.height = renderer.height;


/*////////////////////////////////////////*/

function loadTexture() {
  document.body.className = 'loading';

  let texture = new PIXI.Texture.fromImage(opts.image);
  texture.opacity = 0;

  texture.on('error', function(){ console.error('AGH!'); });

  texture.on('update',function(){
    document.body.className = '';

    if ( mesh ) { stage.removeChild(mesh); }

    mesh = new PIXI.mesh.Plane( this, opts.pointsX, opts.pointsY);
    mesh.width = this.width;
    mesh.height = this.height;
    mesh.blendMode = PIXI.BLEND_MODES.MULTIPLY;

    spacingX = mesh.width / (opts.pointsX-1) ;
    spacingY = mesh.height / (opts.pointsY-1) ;

    cloth = new Cloth(opts.pointsX-1, opts.pointsY-1, !opts.pinCorners);

    stage.addChild(mesh);
  });
}

loadTexture(opts.image);

;(function update() {
  requestAnimationFrame(update);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if ( cloth ) { cloth.update(0.016) }
  renderer.render(stage);
})(0)

/*////////////////////////////////////////*/

class Point {
  constructor (x, y) {
    this.x = x
    this.y = y
    this.px = x
    this.py = y
    this.vx = 0
    this.vy = 0
    this.pinX = null
    this.pinY = null

    this.constraints = []
  }

  update (delta) {
    if (this.pinX && this.pinY) return this

    if (mouse.down) {
      let dx = this.x - mouse.x
      let dy = this.y - mouse.y
      let dist = Math.sqrt(dx * dx + dy * dy)

      if (mouse.button === 1 && dist < opts.mouseInfluence) {
        this.px = this.x - (mouse.x - mouse.px)
        this.py = this.y - (mouse.y - mouse.py)
      } else if (dist < mouse.cut) {
        this.constraints = []
      }
    }

    this.addForce(0, opts.gravity)

    let nx = this.x + (this.x - this.px) * opts.friction + this.vx * delta
    let ny = this.y + (this.y - this.py) * opts.friction + this.vy * delta

    this.px = this.x
    this.py = this.y

    this.x = nx
    this.y = ny

    this.vy = this.vx = 0

    if (this.x >= canvas.width) {
      this.px = canvas.width + (canvas.width - this.px) * opts.bounce
      this.x = canvas.width
    } else if (this.x <= 0) {
      this.px *= -1 * opts.bounce
      this.x = 0
    }

    if (this.y >= canvas.height) {
      this.py = canvas.height + (canvas.height - this.py) * opts.bounce
      this.y = canvas.height
    } else if (this.y <= 0) {
      this.py *= -1 * opts.bounce
      this.y = 0
    }

    return this
  }

  draw () {
    let i = this.constraints.length
    while (i--) this.constraints[i].draw()
  }

  resolve () {
    if (this.pinX && this.pinY) {
      this.x = this.pinX
      this.y = this.pinY
      return
    }

    this.constraints.forEach((constraint) => constraint.resolve())
  }

  attach (point) {
    this.constraints.push(new Constraint(this, point))
  }

  free (constraint) {
    this.constraints.splice(this.constraints.indexOf(constraint), 1)
  }

  addForce (x, y) {
    this.vx += x
    this.vy += y
  }

  pin (pinx, piny) {
    this.pinX = pinx
    this.pinY = piny
  }

  unpin(){
    this.pinX = null;
    this.pinY = null;
  }
}

/*////////////////////////////////////////*/

class Constraint {
  constructor (p1, p2, length) {
    this.p1 = p1
    this.p2 = p2
    this.length = length || spacingX
  }

  resolve () {
    let dx = this.p1.x - this.p2.x
    let dy = this.p1.y - this.p2.y
    let dist = Math.sqrt(dx * dx + dy * dy)

    if (dist < this.length) return

    let diff = (this.length - dist) / dist

    //if (dist > tearDist) this.p1.free(this)

    let mul = diff * 0.5 * (1 - this.length / dist)

    let px = dx * mul
    let py = dy * mul

    !this.p1.pinX && (this.p1.x += px)
    !this.p1.pinY && (this.p1.y += py)
    !this.p2.pinX && (this.p2.x -= px)
    !this.p2.pinY && (this.p2.y -= py)

    return this
  }

  draw () {
    ctx.moveTo(this.p1.x, this.p1.y)
    ctx.lineTo(this.p2.x, this.p2.y)
  }
}

/*////////////////////////////////////////*/

let count = 0;

class Cloth {
  constructor (clothX, clothY, free) {
    this.points = []

    let startX = canvas.width / 3 - clothX * spacingX / 2;
    let startY = canvas.height * 0.01;

    for (let y = 0; y <= clothY; y++) {
      for (let x = 0; x <= clothX; x++) {
        let point = new Point(
          startX + x * spacingX - (spacingX * Math.sin(y) ),
          y * spacingY + startY + ( y !== 0 ? 5 * Math.cos(x) : 0 )
        )
        !free && y === 0 && point.pin(point.x, point.y)
        x !== 0 && point.attach(this.points[this.points.length - 1])
        y !== 0 && point.attach(this.points[x + (y - 1) * (clothX + 1)])

        this.points.push(point)
      }
    }

  }

  update (delta) {
    let i = accuracy

    while (i--) {
      this.points.forEach((point) => {
        point.resolve()
      })
    }

    ctx.beginPath();

    this.points.forEach((point,i) => {
      point.update(delta * delta)

      if ( opts.renderCloth ) { point.draw(); }

      if ( mesh ) {
        i *= 2;
        mesh.vertices[i] = point.x;
        mesh.vertices[i+1] = point.y;
      }
    });

    ctx.stroke()
    ctx.strokeStyle='#00ffe4';
  }
}

function pointerMove(e) {
  let pointer = e.touches ? e.touches[0] : e;
  mouse.px = mouse.x || pointer.clientX
  mouse.py = mouse.y || pointer.clientY
  mouse.x = pointer.clientX
  mouse.y = pointer.clientY
}

function pointerDown(e){
  mouse.down = true
  mouse.button = 1
  pointerMove(e);
}

function pointerUp(e){
  mouse.down = false;
  mouse.px = null;
  mouse.py = null;
}

document.getElementById('mouseListener').addEventListener('mouseover', pointerDown);
document.getElementById('mouseListener').addEventListener('touchstart', pointerDown);

document.getElementById('mouseListener').addEventListener('mousemove',pointerMove);
document.getElementById('mouseListener').addEventListener('touchmove', pointerMove);

document.getElementById('mouseListener').addEventListener('mouseout', pointerUp);
document.getElementById('mouseListener').addEventListener('touchend', pointerUp);
document.getElementById('mouseListener').addEventListener('mouseleave', pointerUp);
