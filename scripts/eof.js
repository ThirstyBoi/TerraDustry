//Script owned by Eye of Darkness

var totalSegments = 19;

var segmentOffset = 30;

const tempVec = new Vec2();
const tempVecB = new Vec2();
const tempVecC = new Vec2();
const tempVecD = new Vec2();

var persistantTiles = [];
//var expectedHealth = [];

/*const clearHoles = (array) => {
	return array != null;
};*/

const clearHoles = function(array){
	return array != null;
};

const updatePersistantTiles = () => {
	if(persistantTiles.length == 0 || Vars.state.is(GameState.State.menu) || Vars.state.isPaused()) return;
	persistantTiles = persistantTiles.filter(clearHoles);
	//expectedHealth = expectedHealth.filter(clearHoles);
	
	for(var i = 0; i < persistantTiles.length; i++){
		var tileB = persistantTiles[i];
		//var eHealth = expectedHealth[i];
		//if(tileB == null) continue;
		var entityB = tileB.ent();
		
		/*if(entityB != null && entityB.health() > Math.min(entityB.maxHealth() - 0.0001, Math.max(eHealth + 50, 0)) && !entityB.isDead() && tileB != null){
			entityB.kill();
			persistantTiles[i] = null;
			expectedHealth[i] = null;
		}else{
			persistantTiles[i] = null;
			expectedHealth[i] = null;
		};*/
		if(entityB != null && /*Mathf.equal(entityB.health(), entityB.maxHealth(), 9) &&*/ tileB != null){
			var lastHealth = entityB.health();
			//print("last:" + lastHealth);
			entityB.damage(5);
			//print(lastHealth + "/" + entityB.health);
			if(Mathf.equal(lastHealth, entityB.health, 0.001) || Mathf.equal(entityB.health, entityB.maxHealth(), 2)){
				//print(lastHealth + "/" + entityB.health);
				entityB.kill();
				//print("test");
			};
		};
		persistantTiles[i] = null;
	};
	//print(persistantTiles + "\n" + expectedHealth);
};

Events.on(EventType.ResetEvent, cons(event => {
	/*for(var i = 0; i < persistantTiles.length; i++){
		persistantTiles[i] = null;
	}*/
	persistantTiles = [];
}));

Events.on(EventType.Trigger.update, run(() => {updatePersistantTiles()}));

const segmentBullet = new BasicBulletType(8, 17, "shell");
segmentBullet.lifetime = 4;
segmentBullet.bulletWidth = 10;
segmentBullet.bulletHeight = 15;
segmentBullet.bulletShrink = 0.1;
segmentBullet.keepVelocity = false;
segmentBullet.frontColor = Pal.missileYellow;
segmentBullet.backColor = Pal.missileYellowBack;

const eofMissile = extend(BasicBulletType, {
	update(b){
		this.super$update(b);
		
		if(Mathf.chance(Time.delta() * 0.2)){
			Effects.effect(Fx.missileTrail, Pal.missileYellowBack, b.x, b.y, 2);
		};
		
		b.velocity().rotate(Mathf.sin(Time.time() + b.id * 4422, this.weaveScale, this.weaveMag) * Time.delta());
	}
});
eofMissile.speed = 7;
eofMissile.damage = 6;
eofMissile.bulletSprite = "missile";
eofMissile.weaveScale = 9;
eofMissile.weaveMag = 2;
eofMissile.homingPower = 1;
eofMissile.homingRange = 60;
eofMissile.splashDamage = 20;
eofMissile.splashDamageRadius = 25;
eofMissile.hitEffect = Fx.hitMeltdown;
eofMissile.despawnEffect = Fx.none;
eofMissile.hitSize = 4;
eofMissile.lifetime = 4;
eofMissile.bulletWidth = 10;
eofMissile.bulletHeight = 16;
eofMissile.bulletShrink = 0.1;
eofMissile.keepVelocity = false;
eofMissile.frontColor = Pal.missileYellow;
eofMissile.backColor = Pal.missileYellowBack;

const tempRect = new Rect();

const eofBullet = extend(BasicBulletType, {
	update(b){
		this.super$update(b);
		
		/*b.hitbox(tempRect);
		Units.nearbyEnemies(b.getTeam(), tempRect.x, tempRect.y, tempRect.width, tempRect.height, cons(unit => {
			if(unit.getTeam() != b.getTeam()){
				var lastHealthC = unit.health();
				
				print(lastHealthC);
				
				unit.damage(1);
				
				print(lastHealthC + "/" + unit.health);
				
				if(Mathf.equal(lastHealthC, unit.health, 0.002)){
					print("killed");
					unit.kill();
				};
				
				//print("test");
				
				if(unit.health > 6000){
					unit.damage(Math.max((unit.health - 6000) * 1.3, 0));
					print(Math.max((unit.health - 6000) * 1.3, 0) + "#");
				};
			}
		}));*/
		
		b.velocity().rotate(Mathf.sin(Time.time() + b.id * 4422, this.weaveScale, this.weaveMag) * Time.delta());
	},
	
	hit(b, x, y){
		if(x == null || y == null) return;
		this.super$hit(b, x, y);
		
		b.hitbox(tempRect);
		Units.nearbyEnemies(b.getTeam(), tempRect.x, tempRect.y, tempRect.width, tempRect.height, cons(unit => {
			if(unit.getTeam() != b.getTeam()){
				var lastHealthC = unit.health();
				
				//print(lastHealthC);
				
				unit.damage(1);
				
				//print(lastHealthC + "/" + unit.health);
				
				if(Mathf.equal(lastHealthC, unit.health, 0.002)){
					//print("killed");
					unit.kill();
				};
				
				//print("test");
				
				if(unit.health > 7000){
					unit.damage(Math.max((unit.health - 7000) * 0.5, 0));
				};
			}
		}));
	},
	
	hitTile(b, tile){
		this.super$hitTile(b, tile);
		
		var entity = tile.ent();
		if(entity == null) return;
		
		var lastHealthb = entity.health();
		//print(lastHealthb);
		//var bulletDamage = this.damage + this.splashDamage;
		//var bulletDamageAlt = this.damage;
		//var expectedDamage = entity.health() - bulletDamageAlt;
		tile.block().handleBulletHit(entity, b);
		//print(lastHealthb + "/" + entity.health);
		if(Mathf.equal(lastHealthb, entity.health, 0.002)){
			entity.damage(this.damage * 2);
		};
		
		if(entity.maxHealth() > 8000){
			//bulletDamage += Math.max((entity.maxHealth() - 5000) * 4, 0);
			//expectedDamage = entity.health() - bulletDamageAlt;
			entity.damage(Math.max((entity.maxHealth() - 8000) * 4, 0));
		};
		if(persistantTiles.lastIndexOf(tile) == -1 && !entity.isDead()){
			persistantTiles.push(tile);
			//expectedHealth.push(expectedDamage);
		};
	}
});
eofBullet.speed = 7;
//eofBullet.damage = 40;
eofBullet.damage = 6;
eofBullet.bulletSprite = "shell";
eofBullet.weaveScale = 12;
eofBullet.weaveMag = 6;
eofBullet.homingPower = 1;
eofBullet.homingRange = 60;
eofBullet.splashDamage = 30;
eofBullet.splashDamageRadius = 20;
eofBullet.hitEffect = Fx.hitMeltdown;
eofBullet.despawnEffect = Fx.none;
eofBullet.hitSize = 4;
eofBullet.lifetime = 4;
eofBullet.pierce = true;
eofBullet.bulletWidth = 12;
eofBullet.bulletHeight = 21;
eofBullet.bulletShrink = 0.1;
//eofBullet.keepVelocity = false;
eofBullet.frontColor = Pal.missileYellow;
eofBullet.backColor = Pal.missileYellowBack;

//var trueBulletMultiplier = 1;

const bulletCollision = (owner, bullet, multiplier) => {
	//var threshold = Math.max(800 * owner.healthf(), 40);
	//var threshold = Math.max(30 * owner.healthf(), 30);
	//var threshold = Math.max(1400 * owner.healthf(), 130);
	//var threshold = Math.max(1500 * owner.healthf(), 280);
	
	var threshold = Math.max(4500 * owner.healthf(), 750);
	
	//print(multiplier);
	var damageMul = 1;
	var bulletType = bullet.getBulletType();
	var pierceB = bulletType.pierce ? 60 : 1;
	var tempBulletType = bulletType;
	for(var i = 0; i < 5; i++){
		if(tempBulletType.fragBullet != null){
			damageMul *= tempBulletType.fragBullets;
			tempBulletType = tempBulletType.fragBullet;
		};
	};
	var ownerBulletTypes = bulletType == eofBullet || bulletType == segmentBullet || bulletType == eofMissile;
	//print((bulletType.damage + bulletType.splashDamage) * damageMul);
	if(((bulletType.damage + bulletType.splashDamage) * pierceB * damageMul * multiplier > threshold) || ownerBulletTypes){
		var bulletOwner = bullet.getOwner();
		if(bulletOwner != null){
			var bulletAngle = Angles.angle(bullet.x, bullet.y, bulletOwner.x, bulletOwner.y);
			
			var tempB = Bullet.create(bulletType, bulletOwner, bulletOwner.getTeam(), bullet.x, bullet.y, bulletAngle);
			tempB.velocity(bulletType.speed, bulletAngle);
			if(tempB.getBulletType().speed < 1) tempB.set(bulletOwner.x, bulletOwner.y);
			//tempB.resetOwner(owner, owner.getTeam());
			tempB.resetOwner(bulletOwner, owner.getTeam());
			
			var overlay = Bullet.create(overlayBullet, owner, owner.getTeam(), bullet.x, bullet.y, 0);
			overlay.setData(tempB);
			
			bullet.deflect();
			//bullet.time(bulletType.lifetime);
			//owner.healBy(bulletType.damage + bulletType.splashDamage);
			bullet.velocity(bulletType.speed, bulletAngle);
			//bullet.resetOwner(owner, owner.getTeam());
			bullet.resetOwner(bulletOwner, owner.getTeam());
			bullet.time(0);
		}else{
			bullet.scaleTime(bulletType.lifetime / 15);
		};
		owner.healBy((bulletType.damage + bulletType.splashDamage) / (totalSegments / 2));
		//print("deflected");
	}
};

//const tempRect = new Rect();

const overlayBullet = extend(BasicBulletType, {
	update(b){
		var otherBullet = b.getData();
		if(otherBullet == null){
			b.time(this.lifetime);
			return;
		};
		var otherBType = otherBullet.getBulletType();
		if(otherBullet.getOwner() instanceof Unit){
			otherBullet.hitbox(tempRect);
			Units.nearbyEnemies(b.getTeam(), tempRect.x, tempRect.y, tempRect.width, tempRect.height, cons(unit => {
				if(unit == otherBullet.getOwner()){
					unit.damage(otherBullet.damage());
					unit.velocity().add(Tmp.v3.set(unit.getX(), unit.getY()).sub(otherBullet.x, otherBullet.y).setLength(otherBType.knockback / unit.mass()));
					unit.applyEffect(otherBType.status, otherBType.statusDuration);
					otherBType.hit(otherBullet, otherBullet.x, otherBullet);
					if(!otherBType.pierce){
						b.time(this.lifetime);
						otherBullet.time(otherBType.lifetime);
					};
				}
			}));
		}
	},
	
	despawned(b){},
	
	hit(b){},
	
	hit(b, x, y){},
	
	draw(b){}
});
overlayBullet.speed = 0.0001;
overlayBullet.damage = 1;
overlayBullet.collidesTiles = false;
overlayBullet.pierce = true;
overlayBullet.lifetime = 1 * 2;

const eofSegment = prov(() => {
	eofSegmentB = extend(FlyingUnit, {
		update(){
			if((this.getParentUnit() == null || (this.getParentUnit().isDead() && this.getParentUnit() != null)) && !this.isDead()){
				//this.kill();
				this.remove();
			};
			
			if(this.isDead()){
				this.remove();
				return;
			};
			
			this.health = this.getTrueParentUnit().health();
			
			if(Vars.net.client()){
				this.interpolate();
				this.status.update(this);
				return;
			};
			
			this.updateTargeting();
			
			this.state.update();
			//this.updateVelocityStatus();
			
			if(this.target != null) this.behavior();
			
			//this.super$update();
			
			//this.updateRotation();
			
			//this.updatePosition();
		},
		
		drawUnder(){},
		
		drawEngine(){},
		
		collision(other, x, y){
			//this.getTrueParentUnit().setCollidedBool(false);
			this.getTrueParentUnit().setExplosionCounter(0);
			
			this.super$collision(other, x, y);
			
			if(other instanceof DamageTrait && other instanceof Bullet){
				if(other.getBulletType().pierce) other.scaleTime(other.getBulletType().damage / 10);
				
				if(other.getOwner() instanceof Lightning && other.getData() > 0){
					//print(other.getData());
					this.healBy((other.getData() / 20) * Math.max(this.getTrueParentUnit().getBulletMultiplier() / 32, 1));
				};
				
				bulletCollision(this, other, this.getTrueParentUnit().getBulletMultiplier());
			};
		},
		
		isDead(){
			if(this.getParentUnit() == null) return true;
			return this.getParentUnit().isDead();
		},
		
		drawSize(){
			if(!this.getDrawerUnit()) return this.getType().hitsize * 10;
			return (segmentOffset * totalSegments) * 2;
		},
		
		drawCustom(){
			this.super$drawAll();
			
			if(this.getParentUnit() == null) return;
			
			this.getParentUnit().drawCustom();
		},
		
		drawAll(){
			if(this.getDrawerUnit()){
				this.drawCustom();
			};
		},
		
		updateCustom(){
			if(this.getTrueParentUnit() != null){
				this.hitTime = this.getTrueParentUnit().getHitTime();
			};
			
			this.updateRotation();
			
			this.updatePosition();
			
			this.updateVelocityStatus();
			
			if(this.getChildUnit() == null) return;
			
			this.getChildUnit().updateCustom();
		},
		
		damage(amount){
			if(this.getTrueParentUnit() == null) return;
			this.getTrueParentUnit().damage(amount);
		},
		
		healBy(amount){
			if(this.getTrueParentUnit() == null) return;
			this.getTrueParentUnit().healBy(amount);
		},
		
		setChildUnit(a){
			this._childUnit = a;
		},
		
		getDrawerUnit(){
			return this._drawer;
		},
		
		setDrawerUnit(a){
			this._drawer = a;
		},
		
		getChildUnit(){
			if(this._childUnit != null && this._childUnit instanceof Number){
				if(this._childUnit == -1){
					this._childUnit = null;
					return null;
				};
				this.setChildUnit(Vars.unitGroup.getByID(this._childUnit));
			};
			
			return this._childUnit;
		},
		
		setParentUnit(a){
			this._parentUnit = a;
		},
		
		setTrueParentUnit(a){
			this._trueParentUnit = a;
		},
		
		getParentUnit(){
			if(this._parentUnit != null && this._parentUnit instanceof Number){
				if(this._parentUnit == -1){
					this._parentUnit = null;
					return null
				};
				this.setTrueParentUnit(Vars.unitGroup.getByID(this._parentUnit));
			};
			
			return this._parentUnit;
		},
		
		getTrueParentUnit(){
			if(this._trueParentUnit != null && this._trueParentUnit instanceof Number){
				if(this._trueParentUnit == -1){
					this._trueParentUnit = null;
					return null
				};
				this.setTrueParentUnit(Vars.unitGroup.getByID(this._trueParentUnit));
			};
			
			return this._trueParentUnit;
		},
		
		/*drawWeapons(){
			for(var s = 0; s < 2; s++){
				sign = Mathf.signs[s];
				var tra = this.rotation - 90;
				var traB = this.weaponAngles[s];
				//print(this.type.weapon.region);
				//var trY = -this.type.weapon.getRecoil(this, sign > 0) + this.type.weaponOffsetY;
				var trY = this.type.weaponOffsetY;
				var w = -sign * this.type.weapon.region.getWidth() * Draw.scl;
				
				tempVecD.trns(traB, -this.type.weapon.getRecoil(this, sign > 0));
				
				Draw.rect(this.type.weapon.region,
				this.x + Angles.trnsx(tra, this.getWeapon().width * sign, trY) + tempVecD.x,
				this.y + Angles.trnsy(tra, this.getWeapon().width * sign, trY) + tempVecD.y, w, this.type.weapon.region.getHeight() * Draw.scl, this.weaponAngles[s] - 90);
			}
		},*/
		
		getWeaponID(){
			return this._weaponId;
		},
		
		getWeapon(){
			return this.getWeaponID();
		},
		
		setWeapon(a){
			this._weaponId = a;
		},
		
		drawWeapons(){
			for(var s = 0; s < 2; s++){
				sign = Mathf.signs[s];
				var tra = this.rotation - 90;
				var traB = this.weaponAngles[s];
				//print(this.type.weapon.region);
				//var trY = -this.type.weapon.getRecoil(this, sign > 0) + this.type.weaponOffsetY;
				var trY = this.type.weaponOffsetY;
				var w = -sign * this.getWeapon().region.getWidth() * Draw.scl;
				
				tempVecD.trns(traB, -this.getWeapon().getRecoil(this, sign > 0));
				
				Draw.rect(this.getWeapon().region,
				this.x + Angles.trnsx(tra, this.getWeapon().width * sign, trY) + tempVecD.x,
				this.y + Angles.trnsy(tra, this.getWeapon().width * sign, trY) + tempVecD.y, w, this.getWeapon().region.getHeight() * Draw.scl, this.weaponAngles[s] - 90);
			}
		},
		
		drawUnder(){
		},
		
		/*updatePosition(){
			if(this.getParentUnit() == null) return;
			var parentB = this.getParentUnit();
			
			tempVecB.trns(this.rotation, segmentOffset / 2);
			tempVecB.add(this.x, this.y);
			tempVec.trns(this.getParentUnit().rotation - 180, segmentOffset / 2);
			//tempVec.trns(parentB.velocity().angle() - 180, segmentOffset / 2);
			tempVec.add(parentB.x, parentB.y);
			
			var dst = Mathf.dst(tempVecB.x, tempVecB.y, tempVec.x, tempVec.y);
			
			var angle = Angles.angle(tempVecB.x, tempVecB.y, tempVec.x, tempVec.y);
			
			tempVec.setZero();
			tempVecB.setZero();
			
			tempVec.trns(angle, dst);
			//tempVecB.set(tempVec);
			//tempVecB.scl(0.5);
			//tempVecB.limit(1);
			
			//this.velocity().add(tempVecB.x, tempVecB.y);
			
			tempVec.add(this.x, this.y);
			
			this.set(tempVec.x, tempVec.y);
			
			tempVec.setZero();
			//tempVecB.setZero()
		},*/
		
		/*updatePosition(){
			if(this.getParentUnit() == null || this.getTrueParentUnit() == null) return;
			
			//this.updatePositionAlt();
			
			var parentB = this.getParentUnit();
			
			var dst = Mathf.dst(this.x, this.y, parentB.x, parentB.y) - segmentOffset;
			
			var angle = Angles.angle(this.x, this.y, parentB.x, parentB.y);
			var vel = this.velocity();
			
			if(!Mathf.within(this.x, this.y, parentB.x, parentB.y, segmentOffset)){
				tempVec.trns(angle, dst);
				
				tempVecB.trns(angle, parentB.velocity().len());
				
				vel.add(tempVecB.x, tempVecB.y);
				if(Mathf.within(this.x + vel.x, this.y + vel.y, parentB.x, parentB.y, segmentOffset)){
					this.moveBy(-tempVec.x, -tempVec.y);
				};
				this.moveBy(tempVec.x, tempVec.y);
			};
			dst = Mathf.dst(this.x, this.y, parentB.x, parentB.y) - segmentOffset;
			if(dst < 0){
				angle = Angles.angle(this.x, this.y, parentB.x, parentB.y);
				tempVec.trns(angle, dst);
				//vel.add(tempVec.x, tempVec.y);
				this.moveBy(tempVec.x / 4, tempVec.y / 4);
			};
		},*/
		
		updatePosition(){
			if(this.getParentUnit() == null || this.getTrueParentUnit() == null) return;
			
			//this.updatePositionAlt();
			
			var parentB = this.getParentUnit();
			
			var dst = Mathf.dst(this.x, this.y, parentB.x, parentB.y) - segmentOffset;
			
			tempVecC.trns(parentB.velocity().angle, segmentOffset / 2.5);
			
			var angle = Angles.angle(this.x, this.y, parentB.x + tempVecC.x, parentB.y + tempVecC.y);
			var vel = this.velocity();
			
			if(!Mathf.within(this.x, this.y, parentB.x, parentB.y, segmentOffset)){
				tempVec.trns(angle, dst);
				
				//tempVecB.trns(angle, parentB.velocity().len());
				tempVecB.trns(angle, Math.max(parentB.velocity().len(), this.velocity().len()));
				
				vel.add(tempVecB.x * Time.delta(), tempVecB.y * Time.delta());
				if(Mathf.within(this.x + vel.x, this.y + vel.y, parentB.x, parentB.y, segmentOffset)){
					this.moveBy(-tempVec.x / 1.1, -tempVec.y / 1.1);
				};
				this.moveBy(tempVec.x / 1.01, tempVec.y / 1.01);
			};
			dst = Mathf.dst(this.x, this.y, parentB.x, parentB.y) - segmentOffset;
			if(dst < 0){
				angle = Angles.angle(this.x, this.y, parentB.x, parentB.y);
				tempVec.trns(angle, dst);
				//vel.add(tempVec.x, tempVec.y);
				this.moveBy(tempVec.x / 4, tempVec.y / 4);
			};
		},
		
		/*updatePositionAlt(){
			var parentB = this.getParentUnit();
			
			tempVecB.trns(parentB.velocity().angle() - 180, segmentOffset / 2);
			tempVecB.add(parentB.x, parentB.y);
			
			tempVec.trns(this.rotation, segmentOffset / 2);
			tempVec.add(this.x, this.y);
			
			var dst1 = Mathf.dst(tempVec.x, tempVec.y, tempVecB.x, tempVecB.y) / Time.delta();
			var angle1 = Angles.angle(tempVec.x, tempVec.y, tempVecB.x, tempVecB.y);
			
			tempVec.trns(parentB.velocity().angle() - 180, segmentOffset / 2);
			tempVec.add(parentB.x, parentB.y);
			
			var angle2 = Angles.angle(this.x, this.y, tempVec.x, tempVec.y);
			
			//var angle3 = Angles.angle(this.x, this.y, parentB.x, parentB.y);
			
			this.velocity().trns(angle2, parentB.velocity().len());
			
			if(dst1 > 0.002){
				
				if(Angles.near(angle1, this.velocity().angle(), 12)){
					this.velocity().trns(angle1, parentB.velocity().len() + dst1);
				};
				
				//tempVec.trns(angle1, dst1);
				//tempVec.trns(parentB.velocity().len() - 180, segmentOffset / 2);
				//tempVec.add(parentB.x, parentB.y);
				//tempVecB.trns(this.rotation - 180, segmentOffset / 2);
				//tempVec.add(tempVecB);
				//this.set(tempVec.x, tempVec.y);
				//this.moveBy(tempVec.x, tempVec.y);
			};
			tempVec.setZero();
			tempVecB.setZero();
		},*/
		
		updateRotation(){
			if(this.getParentUnit() == null) return;
			tempVec.trns(this.getParentUnit().rotation - 180, (segmentOffset / 4));
			tempVec.add(this.getParentUnit().x, this.getParentUnit().y);
			//tempVec.set(this.getParentUnit().x, this.getParentUnit().y);
			this.rotation = Angles.angle(this.x, this.y, tempVec.x, tempVec.y);
			tempVec.setZero();
		},
		
		/*added(){
			this.super$added();
			
			this.repairItself();
		},*/
	});
	//eofSegmentB.repaired = false;
	//eofSegmentB.parentID = -1;
	eofSegmentB.setWeapon(null);
	eofSegmentB.setDrawerUnit(false);
	eofSegmentB.setParentUnit(null);
	eofSegmentB.setTrueParentUnit(null);
	eofSegmentB.setChildUnit(null);
	return eofSegmentB;
});

const eofMain = prov(() => {
	eofMainB = extend(FlyingUnit, {
		update(){
			this.super$update();
			
			//if(this.getCollidedBool()) this.setCollidedBool(false);
			if(this.getExplosionCounter() != 0) this.setExplosionCounter(0);
			
			if(this.getChildUnit() != null) this.getChildUnit().updateCustom();
			//print(this.health() + "/" + this.maxHealth());
			if(this.getTimer().get(5, 5)){
				var bulletsCounted = 0;
				var scanRange = 220;
				Vars.bulletGroup.intersect(this.x - scanRange, this.y - scanRange, scanRange * 2, scanRange * 2, cons(b => {
					if(Mathf.within(this.x, this.y, b.x, b.y, scanRange) && b.getTeam() != this.getTeam()){
						bulletsCounted += 1;
					}
				}));
				
				//trueBulletMultiplier = Math.max(bulletsCounted, 1);
				this.setBulletMultiplier(Math.max(bulletsCounted, 1));
				//print(this.getBulletMultiplier());
			};
		},
		
		drawUnder(){},
		
		drawEngine(){},
		
		added(){
			this.super$added();
			
			//if(!this.loaded) this.trueHealth = this.getType().health * totalSegments;
			//unitTypeArray = [eofUnitSegment, eofUnitSegment, eofUnitMissile, eofUnitDestroyer];
			weaponArray = [eofSegWeap, eofSegWeap, eofSegSwarmer, eofSegDestroyer];
			
			if(/*!this.loaded*/ true){
				this.trueHealth = this.getType().health * totalSegments;
				var parent = this;
				//var weaponArray = [eofSegWeap, eofSegWeap, eofSegSwarmer,eofSegDestroyer];
				for(var i = 0; i < totalSegments; i++){
					type = i < totalSegments - 1 ? eofUnitSegment : eofUnitTail;
					//type = i < totalSegments - 1 ? (i % 2) == 0 ? eofUnitMissile : eofUnitSegment : eofUnitTail;
					//type = i < totalSegments - 1 ? unitTypeArray[i % unitTypeArray.length] : eofUnitTail;
					
					base = type.create(this.getTeam());
					base.setParentUnit(parent);
					base.setTrueParentUnit(this);
					base.setDrawerUnit(type == eofUnitTail);
					base.setWeapon(weaponArray[i % weaponArray.length]);
					base.add();
					//base.set(this.x + Mathf.random(12), this.y + Mathf.random(12));
					//print(this.rotation);
					tempVec.trns(this.rotation + 180, (segmentOffset * i));
					base.set(this.x + tempVec.y, this.y + tempVec.y);
					base.rotation = this.rotation;
					parent.setChildUnit(base);
					parent = base;
				}
			};
		},
		
		getBulletMultiplier(){
			return this._bulletMultiplier;
		},
		
		setBulletMultiplier(a){
			this._bulletMultiplier = a;
		},
		
		getHitTime(){
			return this.hitTime;
		},
		
		/*getCollidedBool(){
			return this._collidedBool;
		},
		
		setCollidedBool(a){
			this._collidedBool = a;
		},*/
		
		getExplosionCounter(){
			return this._expCounter;
		},
		
		setExplosionCounter(a){
			this._expCounter = a;
		},
		
		collision(other, x, y){
			//this.setCollidedBool(false);
			
			this.setExplosionCounter(0);
			
			this.super$collision(other, x, y);
			
			if(other instanceof DamageTrait && other instanceof Bullet){
				if(other.getBulletType().pierce) other.scaleTime(other.getBulletType().damage / 10);
				
				if(other.getOwner() instanceof Lightning && other.getData() > 0){
					//print(other.getData());
					this.healBy((other.getData() / 20) * Math.max(this.getBulletMultiplier() / 32, 1));
				};
				
				bulletCollision(this, other, this.getBulletMultiplier());
			};
		},
		
		calculateDamage(amount){
			/*if(this.getCollidedBool()){
				print("test");
				return 1;
			};*/
			//print(this.getExplosionCounter());
			
			//this.setCollidedBool(true);
			
			var trueAmount = amount;
			//if(amount >= 3000) trueAmount = Math.max(6000 - amount, Math.log(amount) * 2);
			if(amount >= 3000) trueAmount = 3000 + (Math.log(amount - 2999) * 20);
			
			var counter = Mathf.clamp(1 - (this.getExplosionCounter() / (totalSegments / 5)));
			
			//print(this.getExplosionCounter());
			
			this.setExplosionCounter(this.getExplosionCounter() + 1);
			
			//print((trueAmount / (totalSegments / 2)) * Mathf.clamp(1 - this.status.getArmorMultiplier() / 100) * counter);
			//return (trueAmount / (totalSegments / 2)) * Mathf.clamp(1 - this.status.getArmorMultiplier() / 100);
			return (trueAmount / (totalSegments / 2)) * Mathf.clamp(1 - this.status.getArmorMultiplier() / 100) * counter;
		},
		
		/*health(){
			var healthTotal = 0;
			var child = this;
			for(var i = 0; i < totalSegments; i++){
				//if(child == null) break;
				healthTotal += child.health;
				child = child.getChildUnit();
				if(child == null) break;
			};
			
			return healthTotal;
			//print(this.health() + "/" + this.maxHealth());
		},
		
		maxHealth(){
			var healthTotal = 0;
			var child = this;
			for(var i = 0; i < totalSegments; i++){
				//if(child == null) break;
				healthTotal += this.getType().health;
				//child = child.getChildUnit();
				//if(child == null) break;
			};
			
			return healthTotal * Vars.state.rules.unitHealthMultiplier;
		},*/
		
		drawCustom(){
			this.drawAll();
		},
		
		drawUnder(){
		},
		
		/*maxHealth(){
			return this.getType().health * totalSegments * Vars.state.rules.unitHealthMultiplier;
		},*/
		
		getParentUnit(){
			return null;
		},
		
		setChildUnit(a){
			this._childUnit = a;
		},
		
		getChildUnit(){
			if(this._childUnit != null && this._childUnit instanceof Number){
				if(this._childUnit == -1){
					this._childUnit = null;
					return null;
				};
				
				this.setChildUnit(Vars.unitGroup.getByID(this._childUnit));
			};
			
			return this._childUnit;
		}
		
		/*writeSave(stream){
			this.writeSave(stream, false);
			stream.writeByte(this.type.id);
			stream.writeInt(this.spawner);
			stream.writeFloat(this.health);
		},
		
		readSave(stream, version){
			this.super$readSave(stream, version);
			var trueHealth = stream.readFloat();
			
			this.health = trueHealth;
		},
		
		write(data){
			this.super$write(data);
			data.writeFloat(this.health);
		},
		
		read(data){
			this.super$readSave(data, this.version());
			var trueHealth = data.readFloat();
			
			this.health = trueHealth;
		}*/
	});
	//eofMainB.trueHealth = 0;
	eofMainB.setExplosionCounter(0);
	//eofMainB.setCollidedBool(false);
	eofMainB.timer = new Interval(6);
	eofMainB.setChildUnit(null);
	eofMainB.setBulletMultiplier(1);
	return eofMainB;
})

const eofSegWeap = extendContent(Weapon, "eof-segment-equip", {
	load(){
		this.region = Core.atlas.find("overdriven-eof-segment-equip");
	}
});

eofSegWeap.reload = 7;
eofSegWeap.alternate = true;
eofSegWeap.length = 8;
eofSegWeap.width = 19;
eofSegWeap.ignoreRotation = true;
eofSegWeap.bullet = segmentBullet;
eofSegWeap.shootSound = Sounds.shootSnap;

const eofSegDestroyer = extendContent(Weapon, "eof-segment-destroyer", {
	load(){
		this.region = Core.atlas.find("overdriven-eof-segment-destroyer");
	}
});

eofSegDestroyer.reload = 37;
eofSegDestroyer.alternate = true;
eofSegDestroyer.length = 8;
eofSegDestroyer.width = 19;
eofSegDestroyer.spacing = 0;
eofSegDestroyer.shots = 4;
eofSegDestroyer.recoil = 5.5;
//eofSegDestroyer.recoil = 12.5;
eofSegDestroyer.inaccuracy = 4;
eofSegDestroyer.shotDelay = 3;
eofSegDestroyer.ignoreRotation = true;
eofSegDestroyer.bullet = eofBullet;
eofSegDestroyer.shootSound = Sounds.artillery;

const eofSegSwarmer = extendContent(Weapon, "eof-segment-swarmer", {
	load(){
		this.region = Core.atlas.find("overdriven-eof-segment-swarmer");
	}
});

eofSegSwarmer.reload = 20;
eofSegSwarmer.alternate = true;
eofSegSwarmer.spacing = 8;
eofSegSwarmer.shots = 6;
eofSegSwarmer.length = 8;
eofSegSwarmer.width = 19;
eofSegSwarmer.ignoreRotation = true;
eofSegSwarmer.bullet = eofMissile;
eofSegSwarmer.shootSound = Sounds.missile;

const eofHeadWeap = extendContent(Weapon, "eof-head-equip", {});

eofHeadWeap.reload = 25;
eofHeadWeap.alternate = true;
eofHeadWeap.spacing = 4;
eofHeadWeap.shots = 15;
eofHeadWeap.length = 16;
eofHeadWeap.width = 0;
eofHeadWeap.ignoreRotation = false;
eofHeadWeap.bullet = eofBullet;
eofHeadWeap.shootSound = Sounds.artillery;

const loadImmunities = unitType => {
	var statuses = Vars.content.getBy(ContentType.status);
	statuses.each(cons(stat => {
		if(stat != null){
			unitType.immunities.add(stat);
		}
	}));
};

const eofUnitTail = extendContent(UnitType, "eof-tail", {
	init(){
		this.super$init();
		
		loadImmunities(this);
	},
	
	isHidden(){
		return true;
	},
	
	getPowerCellRegion(){
	  return Core.atlas.find("overdriven-none");
	}
});

eofUnitTail.localizedName = "Eater Tail";
eofUnitTail.create(eofSegment);
eofUnitTail.weapon = eofSegWeap;
eofUnitTail.engineSize = 0;
eofUnitTail.engineOffset = 0;
eofUnitTail.flying = true;
eofUnitTail.rotateWeapon = true;
eofUnitTail.shootCone = 360;
eofUnitTail.health = 500;
eofUnitTail.mass = 11;
eofUnitTail.hitsize = segmentOffset / 1.5;
eofUnitTail.speed = 0;
eofUnitTail.drag = 0.07;
eofUnitTail.attackLength = 130;
eofUnitTail.range = 150;
eofUnitTail.maxVelocity = 4.92;

const eofUnitSegment = extendContent(UnitType, "eof-segment", {
	init(){
		this.super$init();
		
		loadImmunities(this);
	},
	
	load(){
		this.super$load();
		
		weaponArray = [eofSegSwarmer, eofSegDestroyer];
		
		for(var s = 0; s < weaponArray.length; s++){
			weaponArray[s].load();
		}
	},
	
	isHidden(){
		return true;
	},
	
	getPowerCellRegion(){
	  return Core.atlas.find("overdriven-none");
	}
});

eofUnitSegment.localizedName = "Eater Segment";
eofUnitSegment.create(eofSegment);
eofUnitSegment.weapon = eofSegWeap;
eofUnitSegment.engineSize = 0;
eofUnitSegment.engineOffset = 0;
eofUnitSegment.flying = true;
eofUnitSegment.rotateWeapon = true;
eofUnitSegment.shootCone = 360;
eofUnitSegment.health = 500;
eofUnitSegment.mass = 11;
eofUnitSegment.hitsize = segmentOffset / 1.5;
eofUnitSegment.speed = 0;
eofUnitSegment.drag = 0.07;
eofUnitSegment.attackLength = 130;
eofUnitSegment.range = 150;
eofUnitSegment.maxVelocity = 4.92;

const eofUnit = extendContent(UnitType, "eof", {
	init(){
		this.super$init();
		
		loadImmunities(this);
	},
	
	getPowerCellRegion(){
	  return Core.atlas.find("overdriven-none");
	},
	
	displayInfo(table){
		table.table(cons(title => {
			title.addImage(this.icon(Cicon.xlarge)).size(8 * 6);
			title.add("[accent]" + this.localizedName).padLeft(5);
		}));
		
		table.row();
		
		table.addImage().height(3).color(Color.lightGray).pad(15).padLeft(0).padRight(0).fillX();
		
		table.row();
		
		if(this.description != null){
			table.add(this.displayDescription()).padLeft(5).padRight(5).width(400).wrap().fillX();
			table.row();

			table.addImage().height(3).color(Color.lightGray).pad(15).padLeft(0).padRight(0).fillX();
			table.row();
		};
		
		table.left().defaults().fillX();

		table.add(Core.bundle.format("unit.health", this.health));
		table.row();
		table.add(Core.bundle.format("unit.speed", Strings.fixed(this.speed, 1)));
		table.row();
		var resistance = (1 - (1 / (totalSegments / 2))) * 100;
		table.add("Damage Resistance: " + resistance.toFixed(1) + "%").color(Color.lightGray);
		table.row();
		table.row();
	}
});

eofUnit.localizedName = "Eater of Factories";
eofUnit.create(eofMain);
eofUnit.description = "Prepare to lose Everything.";
eofUnit.weapon = eofHeadWeap;
eofUnit.engineSize = 0;
eofUnit.engineOffset = 0;
eofUnit.flying = true;
eofUnit.health = 500;
eofUnit.mass = 11;
eofUnit.hitsize = segmentOffset / 1.5;
eofUnit.speed = 0.34;
eofUnit.drag = 0.09;
eofUnit.attackLength = 170;
eofUnit.range = 180;
eofUnit.maxVelocity = 4.92;
eofUnit.shootCone = 30;
eofUnit.rotatespeed = 0.015;
eofUnit.baseRotateSpeed = 0.005;

/*const tempFac = extendContent(UnitFactory, "temp-factory", {});

tempFac.unitType = eofUnit;*/