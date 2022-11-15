const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")

const input_x = document.querySelector("#x-input")
const input_y = document.querySelector("#y-input")
const input_z = document.querySelector("#z-input")

const focal_length = 500

const canvas_size = 600
const canvas_background = "#ff0000"

const line_color = "#000000"
const line_width = 5

const point_color = "#f0f0f0"
const point_radius = 5


function changeSpeed() {
  angularSpeed.x = input_x.value
  angularSpeed.y = input_y.value
  angularSpeed.z = input_z.value
}

function resetSpeed() {
  angularSpeed.x = 0
  angularSpeed.y = 0
  angularSpeed.z = 0

  input_x.value = 0
  input_y.value = 0
  input_z.value = 0
}

let angularSpeed = {
  x: 0,
  y: 0,
  z: 0
}

function calcMatrix(matrix_1, matrix_2) {
  let temp = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
  ]

  let total = [ 0, 0, 0]

  for(line in matrix_1) {
    for(num in matrix_1[line]) {
      temp[line][num] = matrix_1[line][num] * matrix_2[num]
    }
  }

  for (line in temp) {
    let sum = 0
    for(number of temp[line]) {
      sum += number
    }
    total[line] = sum
  }

  return total
}

let vertexMap = [
  {
    x: -100,
    y: -100,
    z: 100
  },
  {
    x: 100,
    y: -100,
    z: 100
  },
  {
    x: -100,
    y: 100,
    z: 100
  },
  {
    x: 100,
    y: 100,
    z: 100
  },

  {
    x: -100,
    y: -100,
    z: -100
  },
  {
    x: 100,
    y: -100,
    z: -100
  },
  {
    x: -100,
    y: 100,
    z: -100
  },
  {
    x: 100,
    y: 100,
    z: -100
  },
]

let projectedMap = []

const linesConection = [
  [0, 1],
  [1, 3],
  [2, 3],
  [2, 0],

  [4, 5],
  [5, 7],
  [6, 7],
  [6, 4],

  [0, 4],
  [1, 5],
  [2, 6],
  [3, 7]
]

function setup() {
  input_x.value = angularSpeed.x
  input_y.value = angularSpeed.y
  input_z.value = angularSpeed.z


  canvas.width = canvas_size
  canvas.height = canvas_size 

  ctx.translate(canvas_size/2, canvas_size/2)
  clear()
}
setup()

function getRad(angularSpeed) {
  return angularSpeed * (Math.PI/180)
}

function calc() {


  projectedMap = []
  for(vertex of vertexMap) {
    let x_projected = (focal_length * vertex.x) / (focal_length + vertex.z)
    let y_projected = (focal_length * vertex.y) / (focal_length + vertex.z)
    projectedMap.push({
      x: x_projected,
      y: y_projected
    })
  }

  rotateX(getRad(angularSpeed.x))
  rotateY(getRad(angularSpeed.y))
  rotateZ(getRad(angularSpeed.z))
}

function draw() {
  
  clear()
  

  for(vertex of linesConection) {
    let x1 = projectedMap[vertex[0]].x
    let y1 = projectedMap[vertex[0]].y
    let x2 = projectedMap[vertex[1]].x
    let y2 = projectedMap[vertex[1]].y

    drawLine(x1, y1, x2, y2)
  }

  for(vertex of projectedMap) {
    drawPoint(vertex.x, vertex.y)
  }
}


function runFrame() {
  calc()
  draw()
}

runFrame()

setInterval(() => {
  runFrame()
}, 1000/30);

function getMatrixX(angle) {
  return [
    [1, 0, 0],
    [0, Math.cos(angle), Math.sin(angle)],
    [0 , Math.sin(angle) * -1, Math.cos(angle)]
  ]
}

function getMatrixY(angle) {
  return [
    [Math.cos(angle), 0, Math.sin(angle)],
    [0, 1, 0],
    [Math.sin(angle) * -1, 0, Math.cos(angle)]
  ]
}

function getMatrixZ(angle) {
  return [
    [Math.cos(angle), Math.sin(angle), 0],
    [Math.sin(angle) * -1, Math.cos(angle, 0)],
    [0 , 0, 1]
  ]
}

function rotateX(angle) {
  let matrix_1 = getMatrixX(angle)
  for(vertex in vertexMap) {
    let matrix_2 = [vertexMap[vertex].x, vertexMap[vertex].y, vertexMap[vertex].z]
    let rotated = calcMatrix(matrix_1, matrix_2)
    vertexMap[vertex].x = rotated[0]
    vertexMap[vertex].y = rotated[1]
    vertexMap[vertex].z = rotated[2]
  }
}

function rotateY(angle) {
  let matrix_1 = getMatrixY(angle)
  for(vertex in vertexMap) {
    let matrix_2 = [vertexMap[vertex].x, vertexMap[vertex].y, vertexMap[vertex].z]
    let rotated = calcMatrix(matrix_1, matrix_2)
    vertexMap[vertex].x = rotated[0]
    vertexMap[vertex].y = rotated[1]
    vertexMap[vertex].z = rotated[2]
  }
}

function rotateZ(angle) {
  let matrix_1 = getMatrixZ(angle)
  for(vertex in vertexMap) {
    let matrix_2 = [vertexMap[vertex].x, vertexMap[vertex].y, vertexMap[vertex].z]
    let rotated = calcMatrix(matrix_1, matrix_2)
    vertexMap[vertex].x = rotated[0]
    vertexMap[vertex].y = rotated[1]
    vertexMap[vertex].z = rotated[2]
  }
}


function drawPoint(x, y) {
  ctx.beginPath()
  ctx.arc(x, y, point_radius, 0, 2 * Math.PI)
  ctx.fillStyle = point_color
  ctx.fill()
}

function drawLine(x1, y1, x2, y2) {
  ctx.beginPath()
  ctx.moveTo(x1, y1)
  ctx.lineTo(x2, y2)
  ctx.lineWidth = line_width
  ctx.strokeStyle = line_color
  ctx.stroke()
}

function clear() {
  ctx.beginPath()
  ctx.rect(canvas_size/2*-1, canvas_size/2*-1, canvas_size, canvas_size)
  ctx.fillStyle = canvas_background
  ctx.fill()
}
