export const calcSignal = ({itens, defaultProps, connectionList, inputPosition}) => {
  let newItens = itens.map(item => {
    let funcItem = defaultProps[item.mode].function
    let inputsLevel = item.inputConnections.map(input => !!input.logicLevel)
    if(funcItem){
      item[defaultProps[item.mode].returnTo] = funcItem(...inputsLevel,item)
    }

    if(!!item.inputConnections.length){
      let inputPositions = item.inputConnections.map(({inPos}) => inPos)
      let outputPositions = itens.filter(item => !!item.outputConnection).map(({outputConnection}) => outputConnection.outPos)
      let connectedInputs = item.inputConnections.filter(({connected}) => !!connected)
      //console.log(outputPositions)
      //itens.find()
    }

    return item
    
    /*
    if(item.outputConnection){
      //console.log(item.outputConnection)
    }
    if(item.inputConnections && item.outputConnection){

    }
    */


  })
  /*const checkConnections = () => {
    const arrItensToCheckInputs = itens.filter(item => defaultProps[item.nome].dataIn)
    //const arrItensToCheckOutputs = itens.filter(item => defaultProps[item.nome].dataOut)
    
    arrItensToCheckInputs.forEach(item => {
      if(Object.keys(item.inputConnections).length === 0){
        for(let i = 0; i < defaultProps[item.nome].dataIn[]; i++){
          let obj = {[i]: inputPosition.defaultProps.dataIn[i]}
          console.log(obj)
          //Object.assign(item.inputConnections,obj)
        }
        //console.log(item.inputConnections)
      }

    })

   /* arrItensToCheckOutputs.forEach(item => {
      outputPoint = {x: (item.posx + 80) , y: (item.posy + 40) }

    })

  }

  checkConnections()*/

/*
  const changeLevelOfConnection = (inConnection, newLevel) => {
    let connection = inConnection
    connection.level = newLevel
    return connection
  }

  const createConnection = (index, point, level) => {
    let newConnectionList = {}
    newConnectionList[index] = {points: [point], level: !!level}
    return newConnectionList
  }

  const addPointInConnection = (connection, point) => {
    let changedConnection = connection
    changedConnection.points.push(point)
    return changedConnection
  }

  const findConnectionWithPoint = (inPoint) => {
    let connection = arrOfConnections.find(connection => {
      const point = connection.points.find(point => {
        const isEquals = point.x === inPoint.x && point.y === inPoint.y
        return isEquals
      })
      return !!point
    }) 
    return connection
  }


  itens.forEach(item => {

    if(item.nome === "svgIn" && item.type == 1){
      //item.output = true
      let point = {x: (item.posx + 80) , y: (item.posy + 40) }
      let connection = findConnectionWithPoint(point)
      if(connection){
        addPointInConnection(connection,point)
      } else {
        createConnection(arrOfConnections.lenght, point, true)
      }

    } else if(item.nome === "svgIn" && item.type == 0){
      //item.output = false
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
      
      /*arrOfConnections.some(({x,y}) => {
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


  arrOfConnections = [] */
  //propsContext.calcSignals = false
  return {itens: newItens}//{newConnectionList}
}