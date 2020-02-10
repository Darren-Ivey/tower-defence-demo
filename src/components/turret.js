import {
    grid
} from "./map";

const addBullet = (bullets, x, y, angle) => {
    const bullet = bullets.get();
    if (bullet) {
        bullet.fire(x, y, angle);
    }
};

const getEnemy = (x, y, distance, enemies) => {
    const enemyUnits = enemies.getChildren();
    for (var i = 0; i < enemyUnits.length; i++) {
        if (enemyUnits[i].active && Phaser.Math.Distance.Between(x, y, enemyUnits[i].x, enemyUnits[i].y) < distance)
            return enemyUnits[i];
    }
    return false;
};

export const placeTurret = (pointer, turrets) => {
    let turretCount = 0;
    const turretMax = 3;
    const i = Math.floor(pointer.y / 64);
    const j = Math.floor(pointer.x / 64);
    const canPlaceTurret = (i, j) => grid[i][j] === 0;

    if (canPlaceTurret(i, j) && turretCount < turretMax) {
        const turret = turrets.get();
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
        const range = 200;
        const enemy = getEnemy(this.x, this.y, range, this.enemies);
        if (enemy) {
            const angle = Phaser.Math.Angle.Between(this.x, this.y, enemy.x, enemy.y);
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