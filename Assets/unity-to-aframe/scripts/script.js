// Hide browser url bar.
document.addEventListener("enter-vr", function() {
  window.scrollTo(0,document.body.scrollHeight);
});

AFRAME.registerComponent('tilt-controls', {
  tick: function () {
    // `this.el` is the element.
    // `object3D` is the three.js object.

    // `rotation` is a three.js Euler using radians. `quaternion` also available.
    //console.log(this.el.object3D.rotation);

    // `position` is a three.js Vector3.
    //console.log(this.el.object3D.position);
    const DIRECTION = {
      NONE: 0,
      LEFT: 1,
      RIGHT: 2,
      UP: 3,
      DOWN: 4,
    };
    let tilt = DIRECTION.NONE;

    // Detect the head tilting up or down.
    if (this.el.object3D.rotation.x < -0.25) {
      tilt = DIRECTION.DOWN;
    }
    else if (this.el.object3D.rotation.x > 0.25) {
      tilt = DIRECTION.UP;
    }

    if (tilt === DIRECTION.DOWN) {
      // Get the cameras world direction
      const player = document.getElementById('rig');
      const direction = new THREE.Vector3();
      this.el.sceneEl.camera.getWorldDirection(direction);

      // Set movement speed.
      direction.multiplyScalar(0.12);

      // Faster than the below code - but getAttribute wont work.
      // player.object3D.position.add(direction)
      let pos = player.getAttribute('position');
      pos.x += tilt === DIRECTION.DOWN ? direction.x : -direction.x;
      //pos.y += direction.y // uncomment this for 3D movement
      pos.z += tilt === DIRECTION.DOWN ? direction.z : -direction.z;

      player.setAttribute('position', pos);
    }
  }
});

AFRAME.registerComponent('audio', {
  schema: {
    src: { type: 'audio' },
    loop: { type: 'boolean' },
    volume: { type: 'int', default: 1 },
    distance: { type: 'int', default: 8 },
    fade: { type: 'int', default: 5000 },
  },

  init: function() {
    this.sound = new Howl({
      src: [ this.data.src ],
      loop: this.data.loop,
      volume: this.data.volume
    });

    this.camera = document.getElementById('rig');
  },

  tick: function() {
    const objPos = this.el.object3D.position;
    const camPos = this.camera.object3D.position;
    const distance = objPos.distanceTo(camPos);

    if (!this.audioId && distance < this.data.distance) {
      this.audioId = this.sound.play();
      this.sound.fade(0, 1, this.data.fade, this.audioId);
    }
    else if (this.audioId && distance >= this.data.distance) {
      this.sound.fade(1, 0, this.data.fade, this.audioId);
      this.audioId = null;
    }
  }
});