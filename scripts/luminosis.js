const luminosis = extendContent(GenericSmelter, "luminosis", {
	load(){
		this.super$load();
		
		this.tlRegion = Core.atlas.find(this.name + "-tl");
		this.trRegion = Core.atlas.find(this.name + "-tr");
		this.brRegion = Core.atlas.find(this.name + "-br");
		this.blRegion = Core.atlas.find(this.name + "-bl");
	},
	
	draw(tile){
		this.super$draw(tile);
		entity = tile.ent();
		h = entity.warmup;
		Draw.rect(this.tlRegion, tile.drawx() - (10 + 5 * h)/4, tile.drawy() + (10 + 5 * h)/4);
		Draw.rect(this.trRegion, tile.drawx() + (10 + 5 * h)/4, tile.drawy() + (10 + 5 * h)/4);
		Draw.rect(this.brRegion, tile.drawx() + (10 + 5 * h)/4, tile.drawy() - (10 + 5 * h)/4);
		Draw.rect(this.blRegion, tile.drawx() - (10 + 5 * h)/4, tile.drawy() - (10 + 5 * h)/4);
	},
	
	generateIcons(){
	return [
		Core.atlas.find(this.name + "-icon")
	];},
});