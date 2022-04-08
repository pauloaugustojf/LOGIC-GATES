let thisPointsAreEqual = (pointOne, pointTwo) => {
  return (pointOne.x === pointTwo.x) && (pointOne.y === pointTwo.y)
}

export const calcSignal = ({itens, defaultProps, connectionList, inputPosition}) => {
  
  let newConnectionList = connectionList
  let newItens = itens.map(item => {
    let funcItem = defaultProps[item.mode].function
    let inputsLevel = item.inputConnections.map(input => !!input.logicLevel)
    if(funcItem){
      let returnAddres = defaultProps[item.mode].returnTo
      Object.assign(!!returnAddres? item[returnAddres]: item, funcItem(...inputsLevel,item))
    }

    if(item.outputConnection && !!item.outputConnection.connected){
      newConnectionList[item.outputConnection.connectionId].logicLevel = item.outputConnection.logicLevel
    }
   
    if(item.inputConnection && !!item.inputConnection.connected){
      item.inputConnections.forEach((input,index) => {
        item.inputConnections[index].logicLevel = !!newConnectionList[input.connectionId].logicLevel
        
      })
    }

    
    return item
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

    arrItensToCheckOutputs.forEach(item => {
      outputPoint = {x: (item.posx + 80) , y: (item.posy + 40) }

    })

  }

  checkConnections()*/

  
  const createConnection = (logicLevel = 0, inputs = [], outputs = []) => (
    {inputs, outputs, logicLevel}
  )
  
  const pushConnectionToList = (obj, connection) => {
    let index = Object.keys(obj).length
    return Object.assign(obj,{index: connection})
  }

  const changeLevelOfConnection = (connection, logicLevel) => (
    Object.assign(connection,{logicLevel})
  )
  
  const addPointsInConnection = (connection, type, ...points) => (
    Object.assign(connection, {[type]: connection[type].concat(...points)})
  )

  const pointIsInConnection = (connection, point) => (
    connection.inputs.find(input => thisPointsAreEqual(input,point))? "inputs": false || 
    connection.outputs.find(output => thisPointsAreEqual(output,point))? "outputs": false
  )

/*

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
  return {itens: newItens, connectionList: newConnectionList}//{newConnectionList}
}