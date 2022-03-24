export const setCollision = ({itens, mousePos}) => {
  let arrColision = []
  let outMousePos = mousePos
  itens.forEach(({posx, posy}) => {
    arrColision = [
      (outMousePos.sx - 120 < posx), 
      (outMousePos.sx + 40 > posx), 
      (outMousePos.sy + 40 > posy),
      (outMousePos.sy - 120 < posy )
    ]
    
    if(arrColision[0] && arrColision[1] && arrColision[2] && arrColision[3]){
      if(Math.abs(posx - outMousePos.sx + 40) > Math.abs(posy - outMousePos.sy + 40)){
        if((posx - outMousePos.sx + 40)> 0){
          outMousePos.sx = posx - 40
        } else {
          outMousePos.sx = posx + 120
        }
      } else {
        if((posy - outMousePos.sy + 40)> 0){
          outMousePos.sy = posy - 40
        } else {
          outMousePos.sy = posy + 120
        }
      }
    }
  })
  return outMousePos
}