import Phaser from "phaser";
import spriteSheetImg from "./assets/spritesheet.png";
import spriteSheetJson from './assets/spritesheet.json'
import bulletImg from './assets/bullet.png';
import Bullet from './components/bullet';
import Enemy from './components/enemy';
import Turret from './components/turret';

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

var game = new Phaser.Game(config);
var enemies;
var turrets;

var grid = [
  [0, -1, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, -1, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, -1, -1, -1, -1, -1, -1, -1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, -1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, -1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, -1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, -1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, -1, 0, 0]
];

function preload() {
  this.load.atlas('sprites', spriteSheetImg, spriteSheetJson);
  this.load.image('bullet', bulletImg);
}

function damageEnemy(enemy, bullet) {
  var BULLET_DAMAGE = 20;
  // only if both enemy and bullet are alive
  if (enemy.active === true && bullet.active === true) {
    // we remove the bullet right away
    bullet.setActive(false);
    bullet.setVisible(false);
    // decrease the enemy hp with BULLET_DAMAGE
    enemy.receiveDamage(BULLET_DAMAGE);
  }
}

function drawLines(graphics) {
  graphics.lineStyle(1, 0x0000ff, 0.8);
  for (var i = 0; i < 8; i++) {
    graphics.moveTo(0, i * 64);
    graphics.lineTo(640, i * 64);
  }
  for (var j = 0; j < 10; j++) {
    graphics.moveTo(j * 64, 0);
    graphics.lineTo(j * 64, 512);
  }
  graphics.strokePath();
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

function placeTurret(pointer) {
  var turretCount = 0;
  var turretMax = 3;

  function canPlaceTurret(i, j) {
    return grid[i][j] === 0;
  }
  var i = Math.floor(pointer.y / 64);
  var j = Math.floor(pointer.x / 64);
  if (canPlaceTurret(i, j) && turretCount < turretMax) {
    var turret = turrets.get();
    if (turret) {
      turret.setActive(true);
      turret.setVisible(true);
      turret.place(i, j);
      turretCount++
    }
  }
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
  turrets = this.add.group({
    classType: () => {
      return new Turret(this, grid, enemies, bullets)
    },
    runChildUpdate: true
  });

  this.nextEnemy = 0;
  this.physics.add.overlap(enemies, bullets, damageEnemy);
  this.input.on('pointerdown', placeTurret);
}