const beltCol = extendContent(Conveyor, "lightbelt",{
    draw(tile){
        var h = tile.ent().items.first();
        if(h != null) Draw.color(h.color);
        this.super$draw(tile);
        Draw.reset();
    }
});

beltCol.entityType = prov(() => {
  entity = extend(Conveyor.ConveyorEntity, {
    _col: new Color(),
    setCol(newColor){
  this._col.lerp(newColor, 0.7);
    },
    getCol(){
      return this._col;
    }
  });
  entity.setCol(Color.white);
  return entity;
});