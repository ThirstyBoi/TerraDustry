const shootGas = newEffect(33, e => {
	Draw.color(Color.valueOf("54ff62"), Color.valueOf("2bbd37"), Color.gray, e.fin());
	const ci = new Floatc2(){get: (x, y) => {
		Fill.circle(e.x + x, e.y + y, 1.3 + e.fout() * 3.2);
	}};
	Angles.randLenVectors(e.id, 10, e.finpow() * 250, e.rotation, 3, ci);
});

const collisionDmg = extend(BasicBulletType, {
	draw(b){}
});
collisionDmg.damage = 400;
collisionDmg.hitSize = 70;
collisionDmg.pierce = true;
collisionDmg.lifetime = 1;
collisionDmg.hitEffect = Fx.blastExplosion;
collisionDmg.despawnEffect = Fx.none;

const hitGas = newEffect(14, e => {
	Draw.color(Color.valueOf("7dff7d"), Color.valueOf("66ff66"), e.fin());
	Lines.stroke(0.5 + e.fout());
	const hi = new Floatc2(){get: (x, y) => {
		ang = Mathf.angle(x, y);
		Lines.lineAngle(e.x + x, e.y + y, ang, e.fout() * 3 + 1);
	}};
	Angles.randLenVectors(e.id, 2, e.fin() * 15, e.rotation, 50, hi);
});

const gas = extend(BasicBulletType, {
	draw(b){},
	init(b){
		if(typeof(b) !== "undefined"){
			this.super$init();
			Effects.effect(shootGas, b.x, b.y, b.rot());
		}
	}
});

gas.ammoMultiplier = 4;
gas.hitSize = 7;
gas.speed = 15;
gas.lifetime = 14;
gas.pierce = true;
gas.statusDuration = 360;
gas.smokeEffect = Fx.none;
gas.hitEffect = hitGas;
gas.despawnEffect = Fx.none;
gas.status = StatusEffects.burning;
gas.damage = 50;
gas.inaccuracy = 3;

const acursed = extendContent(Weapon, "none-equip", {});
acursed.length = 16;
acursed.shootSound = Sounds.fire;
acursed.width = 0;
acursed.ignoreRotation = false;
acursed.reload = 30;
acursed.shots = 15;
acursed.shotDelay = 1;
acursed.spacing = 0;
acursed.alternate = true;
acursed.bullet = gas;
acursed.recoil = 0;
acursed.inaccuracy = 3;

const spazmatism = extendContent(UnitType, "spazmatism", {
	load(){
		this.weapon.load();
		this.region = Core.atlas.find(this.name);
	},
	getPowerCellRegion(){
		return Core.atlas.find("clear");
	},
	added(){
		  this.super$added();
		  type = Vars.content.getByName(ContentType.unit, "overdriven-retinazer");
		  unit = type.create(this.getTeam());
		  unit.set(this.x, this.y);
		  unit.add();
		  this.setRetina(unit);
	},
	setRetina(val){
		  this._retina = val;
	},
	getRetina(){
		  return this._retina;
	},
	drawUnder(){
		  this.drawEngine();
		  Drawf.laser(Core.atlas.find("overdriven-spine"), Core.atlas.find("overdriven-spine-end"), this.x, this.y, this.getRetina().getX(), this.getRetina().getY(), 100);
	}
});
spazmatism.localizedName = "Spazmatism";
spazmatism.description = "Nomnomnom...";
spazmatism.weapon = acursed;
spazmatism.retreatPercent = 0;
spazmatism.speed = 0.8;
spazmatism.mass = 4;
spazmatism.hitsize = 40;
spazmatism.maxVelocity = 2;
spazmatism.rotateWeapon = false;
spazmatism.drag = 0.03;
spazmatism.flying = true;
spazmatism.shootCone = 10;
spazmatism.health = 10000;
spazmatism.engineOffset = 25;
spazmatism.engineSize = 10;
spazmatism.rotatespeed = 0.1;
spazmatism.baseRotateSpeed = 0.05;
spazmatism.range = 180;
spazmatism.attackLength = 165;
spazmatism.create(prov(() => {
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

const factorys = extendContent(UnitFactory, "factoryspaz", {});
factorys.description = "Make your very own portable giant flying flamethrower";
factorys.unitType = spazmatism;
