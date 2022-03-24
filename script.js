import { imgList } from "./js/createimglist.js";
import { getMode } from "./js/sidebuttons.js";
import { setCollision } from "./js/collision.js";



const canvas = document.getElementById("canvas")
const context = canvas.getContext('2d');

canvas.width = 1200
canvas.height = 600

const getMousePos = evt => {
  var rect = canvas.getBoundingClientRect(), // abs. size of element
      scaleX = canvas.width / rect.width,    // relationship bitmap vs. element for X
      scaleY = canvas.height / rect.height;  // relationship bitmap vs. element for Y

  propsContext.mousePos = {
    x: (evt.clientX - rect.left) * scaleX,   // scale mouse coordinates after they have
    y: (evt.clientY - rect.top) * scaleY,   // been adjusted to be relative to element
    sx: Math.round(((evt.clientX - rect.left) * scaleX) / propsContext.backgroundGridSize) * propsContext.backgroundGridSize,
    sy: Math.round(((evt.clientY - rect.top) * scaleY) / propsContext.backgroundGridSize) * propsContext.backgroundGridSize
  }
}

const createSvgItem = (mode, type, posx, posy) => {
  let item = {}
  item.nome = mode
  item.type = type
  item.posx = posx
  item.posy = posy
  item.selecioned = false
  item.preSelecioned = false
  return item
}

const createLine = (inLine, point) => {
  let outLine = {}
  if(!!inLine){
    outLine = inLine
    outLine.endPoint = point
    outLine.completed = true
    outLine.logicLevel = false
  } else {
    outLine.completed = false
    outLine.initPoint = point
  }
  return outLine
}


const canvasClick = evt => {
  if(propsContext.defaultProps[propsContext.activeMode].drawSvg){
    propsContext.itens.push(createSvgItem(propsContext.activeMode, propsContext.defaultProps[propsContext.activeMode].type, propsContext.mousePos.sx - 40, propsContext.mousePos.sy - 40 ))
  } else {
    propsContext.itens.forEach(item => {
      item.selecioned = item.preSelecioned
    })
  }

  if(propsContext.activeMode === "line"){
    let contentLine = propsContext.lines.find(line => (line.completed === false))
    let indexOfLine = propsContext.lines.indexOf(contentLine)
    let point = {x: propsContext.mousePos.sx, y: propsContext.mousePos.sy}
    let line = propsContext.lines[indexOfLine]
    if(!!line){
      propsContext.lines[indexOfLine] = createLine(line, point)
    } else {
      propsContext.lines.push(createLine(line,point))
    }
    console.log(propsContext.lines)
    
  }
  propsContext.calcSignals = true
}

canvas.addEventListener("mousemove",getMousePos)
canvas.addEventListener("click", canvasClick)

const functionOr = (...input) => {
  return input.some(item => !!item)
}

const functionAnd = (...input) => {
  return !input.some(item => !item)
}

const functionNot = (input) => {
  return !input
}

const propsContext = {
  backgroundGridSize: 10,
  itens: [
    {nome: "svgAnd", type: "2", posx: 600, posy: 300, preSelecioned: true, selecioned: false},
    {nome: "svgOr", type: "3", posx: 300, posy: 200, preSelecioned: false, selecioned: true},
  ],
  lines: [],
  activeMode: "svgAnd",
  mousePos: {x: 0, y: 0, sx: 0, sy: 0},
  drawMousePos: true,
  arrOfConnections: [],
  calcSignals: false,
  inputPosition: {
    1:[{y: 40}],
    2:[{y: 20} , {y: 60}],
    3:[{y: 20} , {y: 40} , {y: 60}],
    4:[{y: 10} , {y: 30} , {y: 50} , {y: 70}],
  },
  defaultProps: {
    cursor: {type: "", drawSvg: false},
    line: {type: "", drawSvg: false},
    svgOr: {type: "2", drawSvg: true, function: functionOr},
    svgAnd: {type: "2", drawSvg: true, function: functionAnd},
    svgNot: {type: "1", drawSvg: true, function: functionNot},
    svgIn: {type: "1", drawSvg: true},
    svgOut: {type: "0", drawSvg: true},
  }
}




const calcSignal = ({itens, defaultProps, arrOfConnections, inputPosition}) => {

  const createConnection = (index, points, level) => {
    let connection = {index, points, level: !!level}
    return connection
  }

  const addPointInConnection = (inConnection, inPoint) => {
    let connection = inConnection
    connection.points.push(inPoint)
    return connection
  }

  const findConnection = (inPoint) => {
    let connection = arrOfConnections.find(connection => {
      const point = connection.points.find(point => {
        const isEquals = point.x === inPoint.x && point.y === inPoint.y
        return isEquals
      })
      return !!point
    }) 
    return connection
  }

  arrOfConnections.push(createConnection(1,[{x: 10, y: 20}, {x: 30, y: 40}]))
  console.log(arrOfConnections)
  console.log(findConnection({x: 30, y: 40}))

  /*itens.forEach(item => {
    if(item.nome === "svgIn" && item.type == 1){
      let point = {x: (item.posx + 80) , y: (item.posy + 40) }
      let connection = findConnection(point)
      if(connection){
        addPointInConnection(connection,point)
      } else {
        createConnection(arrOfConnections.lenght, point, true)
      }
    } else if(item.nome === "svgIn" && item.type == 0){
      let point = {x: (item.posx + 80) , y: (item.posy + 40) }
      let connection = findConnection(point)
      if(connection){
        addPointInConnection(connection,point)
      } else {
        createConnection(arrOfConnections.lenght, point, true)
      }
    }

    const funcItem = defaultProps[item.nome].function
    if(!!funcItem){
      let posInputsLow = []
      posInputsLow = inputPosition[item.type].map(({y}) => {
        return {x: item.posx, y: item.posy + y}
      })
      let posInputsHigh = []
      posInputsHigh = arrOfConnections.filter(({x,y}) => {
        for(let [index, pos] of posInputsLow.entries()){
          if(pos.x === x && pos.y === y){
            posInputsLow.splice(index,1)
            return true
          }
        }
        
      })
      let inputsLevel = []
      inputsLevel = posInputsHigh.map(()=>{return true}).concat(posInputsLow.map(()=>{return false}))
      if(funcItem(...inputsLevel)){
        arrOfConnections.push({x: (item.posx + 80) , y: (item.posy + 40) })
      }
    }

    if(item.nome === "svgOut" && item.type == 0){
      arrOfConnections.some(({x,y}) => {
        if(item.posx === x && (item.posy + 40) === y){
          item.type = 1
        }
      })
    }


  })



  propsContext.lines.forEach((line, index) => {
    arrOfConnections.some(({x,y}) => {
      if((line.initPoint.x === x && line.initPoint.y === y) || (line.endPoint.x === x && line.endPoint.y === y)){
        line.logicLevel = true

      }
    })
  })
*/

  arrOfConnections = []
  propsContext.calcSignals = false
}

const frameRender = () => {
  propsContext.activeMode = getMode()
  
  if(propsContext.defaultProps[propsContext.activeMode].drawSvg){
    propsContext.mousePos = setCollision(propsContext)
  }

  if(propsContext.calcSignals){
    calcSignal(propsContext)
  }

  draw()


  requestAnimationFrame(frameRender)
}

const draw = () => {
  const preFrame = () => {
    context.clearRect(0,0,canvas.width,canvas.height)
    context.beginPath()
  }

  const drawCrosLines = ({backgroundGridSize}) => {
    context.beginPath()
    context.strokeStyle = "#ddd";
    for(let x = 0; x <= canvas.width; x += backgroundGridSize){
      context.moveTo(x, 0)
      context.lineTo(x, canvas.height)
    }
    for(let y = 0; y <= canvas.height; y += backgroundGridSize){
      context.moveTo(0, y)
      context.lineTo(canvas.width, y)
    }
    context.stroke()
  }
  

  const drawMousePos = () => {
    if(propsContext.drawMousePos && !propsContext.defaultProps[propsContext.activeMode].drawSvg ){
      context.beginPath()
      context.strokeStyle = "#000"
      context.fillStyle = "#000"
      context.arc(propsContext.mousePos.sx, propsContext.mousePos.sy, 3, 0, Math.PI * 2)
      context.fill();
      context.stroke();
    }
    
  }
  const drawSelecioned = () => {
    
    
    propsContext.itens.forEach(item =>{
      context.beginPath()
      context.moveTo(item.posx, item.posy)
      context.lineTo(item.posx + 80, item.posy)
      context.lineTo(item.posx + 80, item.posy + 80)
      context.lineTo(item.posx, item.posy + 80)
      context.lineTo(item.posx, item.posy)
      context.closePath()
      if(context.isPointInPath(propsContext.mousePos.x, propsContext.mousePos.y)){
        item.preSelecioned = true
      } else {
        item.preSelecioned = false
      }
      if(item.preSelecioned || item.selecioned){
        context.strokeStyle = "#000"
        context.setLineDash([4, 2]);
        context.lineDashOffset = -10;
        context.strokeRect(item.posx, item.posy, 80, 80);
      }
    })
    context.closePath()
    
  }

  const drawSvg = () =>{
    propsContext.itens.forEach(item =>{
      context.drawImage(eval(imgList[item.nome + item.type]), item.posx, item.posy, 80, 80)
    })

    if(propsContext.defaultProps[propsContext.activeMode].drawSvg){
      context.drawImage(eval(imgList[propsContext.activeMode + propsContext.defaultProps[propsContext.activeMode].type]), propsContext.mousePos.sx - 40, propsContext.mousePos.sy - 40, 80, 80)
    }
  }

  const drawLines = () => {
    context.strokeStyle = "#000"
    propsContext.lines.forEach(line => {
      if(line.completed){
        context.beginPath()
        context.moveTo(line.initPoint.x, line.initPoint.y)
        context.lineTo(line.endPoint.x, line.endPoint.y)
        context.closePath()
        context.stroke();
      } else {
        context.beginPath()
        context.moveTo(line.initPoint.x, line.initPoint.y)
        context.lineTo(propsContext.mousePos.sx, propsContext.mousePos.sy)
        context.closePath()
        context.stroke();
      }
    })
    
  }

  preFrame()
  drawCrosLines(propsContext)
  drawMousePos()
  drawSvg()
  drawSelecioned()
  drawLines()
  
}



window.onload = () => frameRender()