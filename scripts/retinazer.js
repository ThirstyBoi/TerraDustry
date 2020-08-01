
const bigLaser = extend(BasicBulletType, {
});
bigLaser.damage = 75;
bigLaser.hitSize = 10;
bigLaser.pierce = true;
bigLaser.lifetime = 60;
bigLaser.speed = 9;
bigLaser.hitEffect = Fx.shockwave;
bigLaser.despawnEffect = Fx.none;
bigLaser.bulletSprite = "overdriven-retina-lazer";
bigLaser.bulletWidth = 20;
bigLaser.bulletHeight = 50;

const collisionDmg = extend(BasicBulletType, {
	draw(b){}
});
collisionDmg.damage = 200;
collisionDmg.hitSize = 70;
collisionDmg.pierce = true;
collisionDmg.lifetime = 1;
collisionDmg.hitEffect = Fx.blastExplosion;
collisionDmg.despawnEffect = Fx.none;

const blaser = extendContent(Weapon, "none-equip", {});
blaser.length = 16;
blaser.width = 0;
blaser.ignoreRotation = false;
blaser.shootSound = Sounds.laser;
blaser.reload = 30;
blaser.shots = 1;
blaser.shotDelay = 1;
blaser.spacing = 0;
blaser.alternate = true;
blaser.bullet = bigLaser;
blaser.recoil = 0;
blaser.inaccuracy = 0;

const retinazer = extendContent(UnitType, "retinazer", {
	load(){
		this.weapon.load();
		this.region = Core.atlas.find(this.name);
	},
	getPowerCellRegion(){
		return Core.atlas.find("clear");
	},
});
retinazer.localizedName = "Retinazer";
retinazer.description = "Pewpewpewpew...";
retinazer.weapon = blaser;
retinazer.retreatPercent = 0;
retinazer.speed = 0.8;
retinazer.mass = 4;
retinazer.hitsize = 40;
retinazer.maxVelocity = 2;
retinazer.rotateWeapon = false;
retinazer.drag = 0.03;
retinazer.flying = true;
retinazer.shootCone = 10;
retinazer.health = 10000;
retinazer.engineOffset = 25;
retinazer.engineSize = 10;
retinazer.rotatespeed = 0.1;
retinazer.baseRotateSpeed = 0.05;
retinazer.range = 180;
retinazer.attackLength = 180;
retinazer.create(prov(() => {
    const unit = extend(HoverUnit, {
        _attack: new UnitState(){
            entered(){
                unit.target = null;
			},
            update(){
				if(Units.invalidateTarget(unit.target, unit.getTeam(), unit.x, unit.y)){
					unit.target = null;
				}
				if(unit.retarget()){
					unit.targetClosest();
					if(unit.target == null){unit.targetClosestEnemyFlag(BlockFlag.producer);}
					if(unit.target == null){unit.targetClosestEnemyFlag(BlockFlag.turret);}
					if(unit.target == null && unit.isCommanded() && unit.getCommand() != UnitCommand.attack){
						unit.onCommand(unit.getCommand());
					}
					if(unit.getClosestSpawner() == null && unit.getSpawner() != null && unit.target == null){
						unit.target = unit.getSpawner();
						unit.circle(80 + Mathf.randomSeed(unit.id) * 120);
					}else if(unit.target != null){
						unit.attack(unit.type.attackLength);
						if(unit.getTimerCharge() <= 360){
							if(unit.target.withinDst(unit.x, unit.y, unit.getWeapon().bullet.range())){
								ammo = unit.getWeapon().bullet;
								to = Predict.intercept(unit, unit.target, ammo.speed);
								unit.getWeapon().update(unit, to.x, to.y);
							}
						}else{
							if(unit.timer.get(unit.timerTarget2, 30)){
								unit.setCharging(true);
								unit.setChargeTarget(new Vec2().set(
									unit.target.getX() - unit.x, unit.target.getY() - unit.y
								).setAngle(
									unit.angleTo(unit.target)
								));
							}
						}
					}else{
						unit.target = unit.getClosestSpawner();
						unit.moveTo(Vars.state.rules.dropZoneRadius + 120);
					}
				}
				if(unit.isCharging()){
					if(unit.getChargeTime() >= 20){
						unit.setChargeTime(0);
						unit.setCharging(false);
						return;
					}
					unit.setChargeTime(unit.getChargeTime() + 1);
					unit.attack2(unit.getChargeTarget().setLength(
						16 - (unit.getChargeTime() / 1.5)
					));
				}
			}
		},
		_rally: new UnitState(){
			update(){
				if(unit.retarget()){
					unit.targetClosestAllyFlag(BlockFlag.rally);
					unit.targetClosest();
					if(unit.target != null && !Units.invalidateTarget(unit.target, unit.team, unit.x, unit.y)){
						unit.setState(unit._attack);
						return;
					}
					if(unit.target == null){unit.target = unit.getSpawner();}
				}
				if(unit.target != null){
					unit.circle(65 + Mathf.randomSeed(unit.id) * 100);
				}
			}
		},
		attack2(vec){
			this.rotation = Mathf.lerpDelta(this.rotation, vec.angle(), 0.2);
			Bullet.create(collisionDmg, this, this.getTeam(), this.x, this.y, this.rotation, 1, 1);
			this.velocity().add(vec);
		},
		maxVelocity(){
			return this.isCharging() ? this.type.maxVelocity + (16 - (this.getChargeTime() / 1.5)) : this.type.maxVelocity;
		},
        getStartState(){
            return this._attack;
        },
		onCommand(command){
			this.state.set((command == UnitCommand.retreat) ? this.retreat : ((command == UnitCommand.attack) ? this._attack : ((command == UnitCommand.rally) ? this._rally : null)));
		},
        update(){
            this.super$update();
            if(this.state.current() != null){this.state.current().update();}
			this.setTimerCharge((this.getTimerCharge() + Time.delta()) % 720);
        },
		setTimerCharge(val){
			this._timer = val;
		},
		getTimerCharge(){
			return this._timer;
		},
		setChargeTime(val){
			this._time = val;
		},
		getChargeTime(){
			return this._time;
		},
		setCharging(bool){
			this._charging = bool;
		},
		isCharging(){
			return this._charging;
		},
		setChargeTarget(vec){
			this._target = vec;
		},
		getChargeTarget(){
			return this._target;
		}
    });
	unit.setTimerCharge(0);
	unit.setChargeTime(0);
	unit.setCharging(false);
	unit.setChargeTarget(null);
    return unit;
}));
