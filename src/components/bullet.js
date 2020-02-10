export const damageEnemy = (enemy, bullet) => {
    const BULLET_DAMAGE = 20;
    if (enemy.active === true && bullet.active === true) {
        bullet.setActive(false);
        bullet.setVisible(false);
        enemy.receiveDamage(BULLET_DAMAGE);
    }
};

export class Bullet extends Phaser.GameObjects.Image {
    constructor(scene) {
        super(scene);
        this.scene = scene;
        this.bullet(scene);
    };

    bullet(scene) {
        Phaser.GameObjects.Image.call(this, scene, 0, 0, 'bullet');
        this.incX = 0;
        this.incY = 0;
        this.lifespan = 0;
        this.speed = Phaser.Math.GetSpeed(600, 1);
    };

    fire(x, y, angle) {
        this.setActive(true);
        this.setVisible(true);
        this.setPosition(x, y);
        this.dx = Math.cos(angle);
        this.dy = Math.sin(angle);
        this.lifespan = 1000;
    };

    update(time, delta) {
        this.lifespan -= delta;
        this.x += this.dx * (this.speed * delta);
        this.y += this.dy * (this.speed * delta);
        if (this.lifespan <= 0) {
            this.setActive(false);
            this.setVisible(false);
        }
    };
};

export default Bullet;