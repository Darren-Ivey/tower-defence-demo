import {
    grid
} from "./map";

const addBullet = (bullets, x, y, angle) => {
    var bullet = bullets.get();
    if (bullet) {
        bullet.fire(x, y, angle);
    }
};

const getEnemy = (x, y, distance, enemies) => {
    var enemyUnits = enemies.getChildren();
    for (var i = 0; i < enemyUnits.length; i++) {
        if (enemyUnits[i].active && Phaser.Math.Distance.Between(x, y, enemyUnits[i].x, enemyUnits[i].y) < distance)
            return enemyUnits[i];
    }
    return false;
};

export const placeTurret = (pointer, turrets) => {
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
};

export class Turret extends Phaser.GameObjects.Image {
    constructor(scene, grid, enemies, bullets) {
        super(scene);
        this.scene = scene;
        this.grid = grid;
        this.enemies = enemies;
        this.bullets = bullets;
        this.turret(scene);
    }

    turret(scene) {
        Phaser.GameObjects.Image.call(this, scene, 0, 0, 'sprites', 'turret');
        this.nextTic = 0;
    };

    place(i, j) {
        this.y = i * 64 + 64 / 2;
        this.x = j * 64 + 64 / 2;
        this.grid[i][j] = 1;
    };

    fire() {
        var enemy = getEnemy(this.x, this.y, 200, this.enemies);
        if (enemy) {
            var angle = Phaser.Math.Angle.Between(this.x, this.y, enemy.x, enemy.y);
            console.log("Shoot")
            addBullet(this.bullets, this.x, this.y, angle);
            this.angle = (angle + Math.PI / 2) * Phaser.Math.RAD_TO_DEG;
        }
    };

    update(time) {
        if (time > this.nextTic) {
            this.fire();
            this.nextTic = time + 1000;
        }
    };
};

export default Turret;