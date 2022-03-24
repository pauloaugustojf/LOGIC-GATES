let imgSources = {
  svgAnd2:  {src: "svg/and/and_2.svg"},
  svgAnd3: {src: "svg/and/and_3.svg"},
  svgAnd4: {src: "svg/and/and_4.svg"},
  svgOr2: {src: "svg/or/or_2.svg"},
  svgOr3: {src: "svg/or/or_3.svg"},
  svgOr4: {src: "svg/or/or_4.svg"},
  svgIn1: {src: "svg/in/input_1.svg"},
  svgIn0: {src: "svg/in/input_0.svg"},
  svgOut0: {src: "svg/out/out_0.svg"},
  svgOut1: {src: "svg/out/out_1.svg"},
  svgNot1: {src: "svg/not/not_1.svg"}
}

let imgList = {}

function createImgs(){
  for(let item in imgSources){
    imgList[item] = new Image()
    imgList[item].src = imgSources[item].src
  }
}
createImgs()

export { imgList }