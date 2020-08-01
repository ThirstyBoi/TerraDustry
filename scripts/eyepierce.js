const rbHitEffect = newEffect(12, e => {
	Draw.blend(Blending.additive);
	Draw.color(Color.valueOf("ff0000ff").shiftHue(Time.time() * 4.0));
	Lines.stroke(e.fout() * 1.5);
	
	const hl = new Floatc2({get: function(x, y){
		const ang = Mathf.angle(x, y);
		Lines.lineAngle(e.x + x, e.y + y, ang, e.fout() * 8 + 1.5);
	}});
	
	Angles.randLenVectors(e.id, 6, e.finpow() * 50.0, e.rotation, 60.0, hl);
	Draw.blend();
	Draw.reset();
});

const rainbowBullet = extend(BasicBulletType, {
	draw(b){
		Draw.color(Color.valueOf("ff000").shiftHue(Time.time()*2); 
		Draw.rect(this.region,b.x,b.y,b.rotation);
		Draw.reset();
	} 
});

rainbowBullet.bulletSprite = "ballofchungus"
rainbowBullet.speed = 1;
rainbowBullet.damage = 100;
rainbowBullet.lifetime = 400;
rainbowBullet.hitEffect = rbHitEffect;
rainbowBullet.despawnEffect = Fx.shockwave;
rainbowBullet.hitSize = 5;
rainbowBullet.drawSize = 310;
rainbowBullet.pierce = true;

const rainbow = extendContent(DoubleTurret, "eyepierce",{
	load(){
		this.super$load();
		
		this.region = Core.atlas.find(this.name);
		this.baseRegion = Core.atlas.find("block-" + this.size);
		this.rainbowRegion = Core.atlas.find(this.name + "-rainbow");
	},
	
	init(){
      this.ammo(
        Items.surgealloy, rainbowBullet
      );
      this.super$init();
    }
});

rainbow.localizedName = "EyePiercer";
rainbow.description = "Twins go brrrrr";
rainbow.health = 1000;
rainbow.size = 4;
rainbow.reload = 120;
rainbow.shootCone = 40;
rainbow.shotWidth = 5;
rainbow.range = 240;
rainbow.ammoUseEffect = Fx.none;
rainbow.recoil = 5;
rainbow.targetAir = true;
rainbow.shootSound = Sounds.bang;
 