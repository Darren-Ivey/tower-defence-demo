import Phaser from "phaser";
import spriteSheetImg from "./assets/spritesheet.png";
import spriteSheetJson from './assets/spritesheet.json'
import bulletImg from './assets/bullet.png';
import Bullet, {
  damageEnemy
} from './components/bullet';
import Enemy from './components/enemy';
import Turret, {
  placeTurret
} from './components/turret';
import {
  grid,
  drawLines
} from './components/map';

var config = {
  type: Phaser.AUTO,
  parent: 'content',
  width: 640,
  height: 512,
  physics: {
    default: 'arcade'
  },
  scene: {
    key: 'main',
    preload: preload,
    create: create,
    update: update
  }
};

function preload() {
  this.load.atlas('sprites', spriteSheetImg, spriteSheetJson);
  this.load.image('bullet', bulletImg);
}

function create() {
  // Draw grid
  var path;
  var graphics = this.add.graphics();
  drawLines(graphics);
  path = this.add.path(96, -32);
  path.lineTo(96, 164);
  path.lineTo(480, 164);
  path.lineTo(480, 544);
  graphics.lineStyle(2, 0xffffff, 1);
  path.draw(graphics);

  // Enemy
  this.nextEnemy = 0;
  this.enemies = this.physics.add.group({
    classType: () => {
      return new Enemy(this, path)
    },
    runChildUpdate: true
  });

  // Bullets
  this.bullets = this.physics.add.group({
    classType: () => {
      return new Bullet(this)
    },
    runChildUpdate: true
  });

  this.physics.add.overlap(this.enemies, this.bullets, damageEnemy);

  // Turrets
  this.turrets = this.add.group({
    classType: () => {
      return new Turret(this, grid, this.enemies, this.bullets)
    },
    runChildUpdate: true
  });

  this.input.on('pointerdown', (pointer) => {
    placeTurret(pointer, this.turrets)
  });
}

function update(time, delta) {
  if (time > this.nextEnemy) {
    var enemy = this.enemies.get();
    if (enemy) {
      enemy.setActive(true);
      enemy.setVisible(true);
      enemy.startOnPath();
      this.nextEnemy = time + 2000;
    }
  }
}

new Phaser.Game(config);