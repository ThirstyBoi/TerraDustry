const shootGas = newEffect(33, e => {
  Draw.color(Color.valueOf("54ff62"), Color.valueOf("2bbd37"), Color.gray, e.fin());
  const ci = new Floatc2(){get: (x, y) => {
    Fill.circle(e.x + x, e.y + y, 1.3 + e.fout() * 3.2);
  }};
  Angles.randLenVectors(e.id, 10, e.finpow() * 250, e.rotation, 3, ci);
});

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
  draw(b){
  }
});

gas.ammoMultiplier = 4;
gas.hitSize = 7;
gas.lifetime = 225;
gas.pierce = true;
gas.drag = 0.01;
gas.statusDuration = 60 * 6;
gas.shootEffect = shootGas;
gas.hitEffect = hitGas;
gas.despawnEffect = Fx.none;
gas.status = StatusEffects.burning;
gas.damage = 100;

const acursed = extendContent(Weapon, "none-equip", {
});

acursed.length = 16;
acursed.shootSound = Sounds.fire;
acursed.width = 1;
acursed.ignoreRotation = false;
acursed.reload = 0;
acursed.alternate = false;
acursed.bullet = gas;
acursed.shootEffect = shootGas;
acursed.recoil = 0;
acursed.inaccuracy = 0;


const spazmatism = extendContent(UnitType, "spazmatism", {
	load(){
    this.weapon.load()
    this.region = Core.atlas.find(this.name)
	},
	
	getPowerCellRegion(){
	  return Core.atlas.find("clear");
	},
});

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
					if (unit.target == null && unit.isCommanded() && unit.getCommand() != UnitCommand.attack) {
						unit.onCommand(unit.getCommand());
					}
					if (unit.getClosestSpawner() == null && unit.getSpawner() != null && unit.target == null) {
						unit.target = unit.getSpawner();
						unit.circle(80 + Mathf.randomSeed(unit.id) * 120);
					}else if(unit.target != null){
						unit.attack(unit.type.attackLength);
						if(unit.getTimer() <= 360){
							if(
								(
									Angles.near(unit.angleTo(unit.target), unit.rotation, unit.type.shootCone) ||
									unit.getWeapon().ignoreRotation) &&
								unit.dst(unit.target) < unit.getWeapon().bullet.range()
							){
								ammo = unit.getWeapon().bullet;
								if(unit.type.rotateWeapon){
									for(var i = 0; i < 2; i++){
										left = Mathf.booleans[i];
										wi = Mathf.num(left);
										wx = unit.x + Angles.trnsx(unit.rotation - 90, unit.getWeapon().width * Mathf.sign(left));
										wy = unit.y + Angles.trnsy(unit.rotation - 90, unit.getWeapon().width * Mathf.sign(left));
										
										unit.weaponAngles[wi] = Mathf.slerpDelta(unit.weaponAngles[wi], Angles.angle(wx, wy, unit.target.getX(), unit.target.getY()), 0.1);
									
										Tmp.v2.trns(unit.weaponAngles[wi], unit.getWeapon().length);
										unit.getWeapon().update(unit, wx + Tmp.v2.x, wy + Tmp.v2.y, unit.weaponAngles[wi], left);
									} 
								}else{
									to = Predict.intercept(unit, unit.target, ammo.speed);
									unit.getWeapon().update(unit, to.x, to.y);
								}
							}
						}else{
							if(unit.timer.get(unit.timerTarget2, 48)){
								Tmp.v1.set(unit.target.getX() - unit.x, unit.target.getY() - unit.y);
								Tmp.v1.setLength(30);
								unit.velocity().add(Tmp.v1);
							}
							if(unit.velocity().len() > unit.type.maxVelocity * 0.72){
								Damage.damage(unit.getTeam(), unit.getX(), unit.getY(), unit.type.hitSize * 1.2, 5);
							}
						}
					}
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
        getStartState(){
            return this._attack;
        },
		onCommand(command){
			this.state.set((command == UnitCommand.retreat) ? this.retreat : ((command == UnitCommand.attack) ? this._attack : ((command == UnitCommand.rally) ? this._rally : null)));
		},
        update(){
            this.super$update();
            if(this.state.current() != null){this.state.current().update();}
			this.setTimer(this.getTimer() + Time.delta());
        },
		setTimer(val){
			this._timer = val;
		},
		getTimer(){
			return this._timer % 720;
		}
    });
	unit.setTimer(0);
    return unit;
}));
		

spazmatism.localizedName = "Spazmatism";
spazmatism.description = "Nomnomnom...";
spazmatism.weapon = acursed;
spazmatism.retreatPercent = 0;
spazmatism.speed = 0.05;
spazmatism.mass = 1;
spazmatism.hitsize = 40;
spazmatism.maxVelocity = 4;
spazmatism.rotateWeapon = false;
spazmatism.drag = 0.04;
spazmatism.flying = true;
spazmatism.shootCone = 8;
spazmatism.health = 10000;
spazmatism.engineOffset = 25;
spazmatism.engineSize = 10;
spazmatism.rotatespeed = 5;
spazmatism.baseRotateSpeed = 3;
spazmatism.range = 150;