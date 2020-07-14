terror = extendContent(UnitType, "terror", {
  load(){
    this.weapon.load();
    this.region = Core.atlas.find(this.name);
  },

  halfRegion(){
    return Core.atlas.find(this.name + "-halfhp");
  }
});

terror.create(prov(() => extend(FlyingUnit, {
  draw(){
      Draw.mixcol(Color.white, this.hitTime / this.hitDuration);
    if(this.health < this.type.health * 0.5){
      Draw.rect(this.type.halfRegion(), this.x, this.y, this.rotation + -90);
    } else {
      Draw.rect(this.type.region, this.x, this.y, this.rotation + -90);
    }
      this.drawWeapons();
      
      Draw.mixcol();
  }
})));