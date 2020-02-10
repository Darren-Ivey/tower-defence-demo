export class Enemy extends Phaser.GameObjects.Image {
  constructor(scene, path) {
    super(scene);
    this.scene = scene;
    this.path = path;
    this.enemy();
  };

  enemy() {
    Phaser.GameObjects.Image.call(this, this.scene, 0, 0, 'sprites', 'enemy');
    this.follower = {
      t: 0,
      vec: new Phaser.Math.Vector2()
    };
    this.hp = 0;
  };

  startOnPath() {
    this.follower.t = 0;
    this.hp = 100;
    this.path.getPoint(this.follower.t, this.follower.vec);
    this.setPosition(this.follower.vec.x, this.follower.vec.y);
  };

  receiveDamage(damage) {
    this.hp -= damage;
    if (this.hp <= 0) {
      this.setActive(false);
      this.setVisible(false);
    }
  };

  update(time, delta) {
    this.follower.t += (Math.random() / 3000) * delta;
    this.path.getPoint(this.follower.t, this.follower.vec);
    this.setPosition(this.follower.vec.x, this.follower.vec.y);
    if (this.follower.t >= 1) {
      this.setActive(false);
      this.setVisible(false);
    }
  };
}

export default Enemy;