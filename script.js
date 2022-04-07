import { imgList } from "./js/createimglist.js";
import { getMode } from "./js/sidebuttons.js";
import { setCollision } from "./js/collision.js";
import { calcSignal } from "./js/calcsignal.js";


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


const getInputs = ({mode, type, posx, posy}) => {
  let inputConnections = {}
  let inputs = propsContext.defaultProps[mode].dataIn
  inputConnections = !!inputs[0] ? 
  propsContext.inputPosition[inputs.find(numberOfEntries => (numberOfEntries == type)) || inputs[0]].map(({y}) => {return {inPos:{x: posx, y: posy + y}, logicLevel: 0, connected: false, inputItemId: undefined}}) : []
  return inputConnections
}

const getOutputs = ({mode, type, posx, posy}) => {
  let outputConnection = {}
  let output = propsContext.defaultProps[mode].dataOut
  outputConnection = !!output ? {outPos:{x: posx + 80, y: posy + 40}, logicLevel: 0, connected: false} : undefined
  return outputConnection
}

const createItem = (mode, type, posx, posy) => {
  let item = {}
  item.id = propsContext.itens.length
  item.mode = mode
  item.type = type
  item.posx = posx
  item.posy = posy
  item.selecioned = false
  item.preSelecioned = false
  
  item.inputConnections = getInputs(item)

  item.outputConnection = getOutputs(item)

  console.log(item.inputConnections,item.outputConnection)
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
    propsContext.itens.push(createItem(propsContext.activeMode, propsContext.defaultProps[propsContext.activeMode].type, propsContext.mousePos.sx - 40, propsContext.mousePos.sy - 40 ))
    //console.log(propsContext.itens)
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
  }

  if(propsContext.activeMode === "cursor"){
    calcSignal(propsContext)
  }
  propsContext.calcSignals = true
}

canvas.addEventListener("mousemove",getMousePos)
canvas.addEventListener("click", canvasClick)

const functionOr = (...input) => input.some(item => !!item)

const functionAnd = (...input) => input.every(item => !!item)

const functionNot = input => !input

const functionXOr = (...input) => {
  let arr = input.map((data1,indexmap) => {
    let arrNot = [data1, ...input.filter((_,indexfilter) => (indexmap != indexfilter)).map(data2 => !data2)]
    return functionAnd(...arrNot)
  })
  return functionOr(...arr)
}

const functionIn = (...input) => {return !!+input.pop().type}

const functionOut = (input) => +input


const propsContext = {
  backgroundGridSize: 10,
  itens: [
    /*{
      id: 0, 
      mode: "svgAnd", 
      type: "2", 
      posx: 600, 
      posy: 300, 
      preSelecioned: true, 
      selecioned: false, 
      inputConnections: {}, 
      outputConnection: false
    },
    {
      id: 1, 
      mode: "svgOr", 
      type: "3", 
      posx: 300, 
      posy: 200, 
      preSelecioned: false, 
      selecioned: true, 
      inputConnections: {}, 
      outputConnection: false
    },*/
  ],
  lines: [],
  activeMode: "svgAnd",
  mousePos: {x: 0, y: 0, sx: 0, sy: 0},
  drawMousePos: true,
  connectionList: [],
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
    svgOr: {type: "2", drawSvg: true, dataIn: [2,3,4], dataOut: 1, function: functionOr, returnTo: "outputConnection.logicLevel"},
    svgAnd: {type: "2", drawSvg: true, dataIn: [2,3,4], dataOut: 1, function: functionAnd, returnTo: "outputConnection.logicLevel"},
    svgNot: {type: "1", drawSvg: true, dataIn: [1], dataOut: 1, function: functionNot, returnTo: "outputConnection.logicLevel"},
    svgIn: {type: "1", drawSvg: true, dataIn: [0], dataOut: 1, function: functionIn, returnTo: "outputConnection.logicLevel"},
    svgOut: {type: "0", drawSvg: true, dataIn: [1], dataOut: 0, function: functionOut, returnTo: "type"},
  }
}


const frameRender = () => {
  propsContext.activeMode = getMode()
  
  if(propsContext.defaultProps[propsContext.activeMode].drawSvg){
    propsContext.mousePos = setCollision(propsContext)
  }

  if(propsContext.calcSignals){
    Object.assign(propsContext, calcSignal(propsContext))
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
      context.drawImage(eval(imgList[item.mode + item.type]), item.posx, item.posy, 80, 80)
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