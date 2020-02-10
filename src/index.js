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

// Global game 
var game = new Phaser.Game(config);
var enemies;

// Main scene methods
function preload() {
  this.load.atlas('sprites', spriteSheetImg, spriteSheetJson);
  this.load.image('bullet', bulletImg);
}

function create() {
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
  enemies = this.physics.add.group({
    classType: () => {
      return new Enemy(this, path)
    },
    runChildUpdate: true
  });

  // Bullets
  const bullets = this.physics.add.group({
    classType: () => {
      return new Bullet(this)
    },
    runChildUpdate: true
  });

  // Turrets
  const turrets = this.add.group({
    classType: () => {
      return new Turret(this, grid, enemies, bullets)
    },
    runChildUpdate: true
  });

  this.nextEnemy = 0;
  this.physics.add.overlap(enemies, bullets, damageEnemy);
  this.input.on('pointerdown', (pointer) => {
    placeTurret(pointer, turrets)
  });
}

function update(time, delta) {
  if (time > this.nextEnemy) {
    var enemy = enemies.get();
    if (enemy) {
      enemy.setActive(true);
      enemy.setVisible(true);
      enemy.startOnPath();
      this.nextEnemy = time + 2000;
    }
  }
}