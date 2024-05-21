var canvas = document.getElementById('canvas')
var ctx = canvas.getContext('2d')

function minifyAngle(angle) {
  let full = Math.PI * 2
  while (angle > full) {
    angle -= full 
  }
  while (angle < 0) {
    angle += full 
  }
  return angle
}

function generateCofactor(angle) {
  angle = minifyAngle(angle)
  if (angle <= Math.PI /2) {
    return [Math.sin(angle), 0]
  }
  else if (angle <= Math.PI) {
    return [1 / Math.sin(angle - Math.PI / 2), Math.sin(angle - Math.PI / 2)]
  }
}

canvas.width = 800
canvas.height = 800
var angle = 0
function main(){
  ctx.save()
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  var x = 100, y = 100
  var r = Math.sqrt(x**2, y**2)
  var theta = Math.atan(y / x)
  var theta2 = theta + angle 
  var x2 = r*Math.cos(theta2), y2 = r*Math.sin(theta2)
  var dx = x2 - x
  var dy = y2 - y
  ctx.translate(-dx, -dy)
  ctx.rotate(angle)
  
  ctx.fillRect(0, 0, 100, 100)
  angle += Math.PI / 180
  angle = minifyAngle(angle)
  ctx.restore()
  requestAnimationFrame(main)
}

// console.log(coff)
requestAnimationFrame(main)