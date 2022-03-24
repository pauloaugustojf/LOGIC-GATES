const sideButtons = document.querySelectorAll("#btn")
let mode = "svgAnd"

const editMode = selectedMode => {
  let modeEdited = selectedMode != "cursor" && selectedMode != "line" ? "svg" + selectedMode[0].toUpperCase() + selectedMode.substring(1): selectedMode
  return modeEdited
}

const clickBtn = ({currentTarget}) => {
  const selectedMode = currentTarget.classList[0]
  const modeEdited = editMode(selectedMode)
  //console.log(modeEdited)
  mode = modeEdited
  //propsContext.activeMode = modeEdited
  sideButtons.forEach(item => item.classList.remove("active"))
  currentTarget.classList.add("active")
}

sideButtons.forEach(button => {
  button.addEventListener("click", clickBtn)
})

export const getMode = () => {
  return mode
}

