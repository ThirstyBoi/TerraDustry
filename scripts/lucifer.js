const vuid = extendContent(BurstTurret, "lucifer",{
	load(){
		this.super$load();
		
		this.baseRegion = Core.atlas.find("block-" + this.size);
		this.region = Core.atlas.find(this.name);
		this.vuidRegion = Core.atlas.find(this.name + "-vd");
	},
	
	drawLayer: function(tile){
		const tr2 = new Vec2();
		
		entity = tile.ent();

		tr2.trns(entity.rotation, -entity.recoil);

		Draw.rect(this.region, tile.drawx() + tr2.x, tile.drawy() + tr2.y, entity.rotation - 90);

		Draw.color(Color.rgb(Mathf.sinDeg(Time.time()*3)*255,0,0));
		Draw.rect(this.vuidRegion, tile.drawx() + tr2.x, tile.drawy() + tr2.y, entity.rotation - 90);
		Draw.color();
	}
});