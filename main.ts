interface AnguloLinearVector {
  x: number,
  y:number,
  a: number, // angle of rotation
}
interface Position {
  x: number, y: number 
}

interface Pillar {
  pos: Position,
  width: number,
  height: number,
  gapPos: Position,
  gapHeight: number,
}

class FlappyBirdGame {
  canvas: HTMLCanvasElement = document.getElementById('canvas')! as HTMLCanvasElement
  ctx: CanvasRenderingContext2D = this.canvas.getContext('2d')!
  minScreenSize: number = window.innerHeight > window.innerWidth?  
  window.innerWidth: window.innerHeight
  canvasSize = 500 > this.minScreenSize? this.minScreenSize: 500
  birdSize: number = this.canvasSize / 12
  halfBirdSize: number = this.birdSize / 2
  birdImages: Array<HTMLImageElement> = []
  totalBirdImages: number = 0
  birdImagesIndex: number = 0
  backgroundImage: HTMLImageElement
  // pillar
  totalPillar = 3
  pillarWidth = this.canvasSize / (2 * this.totalPillar - 1)
  pillars:Array<Pillar> = []
  firstPillar = 0
  lastPillar = this.totalPillar - 1
  pillarVelocity = this.valueRefactor(0.2)
  pillarGapHeight = this.birdSize * 6
  gapBetweenTwoPillarX: number = this.pillarWidth * 1.5
  pillarGapUnitWidth: number = this.pillarWidth + this.gapBetweenTwoPillarX
  // velocity
  velocity:AnguloLinearVector = {
    x: 0, y: 0, a: 0
  }
  // acceleration
  acceleration: AnguloLinearVector = {
    x: 0, y: this.valueRefactor(0.0009), a: this.valueRefactor(0.000005)
  }
  lastTime: number = 0
  birdState:AnguloLinearVector = {
    x: (this.pillarWidth * 1.5 - this.birdSize) / 2, y: 0, a: 0
  }
  birdStateEx: number = this.birdState.x + this.birdSize

  freedom = {
    x: this.canvasSize - this.birdSize,
    y: this.canvasSize - this.birdSize,
    a: Math.PI / 4
  }

  fullAngle:number = Math.PI * 2

  velocityOnFlap = {
    x: 0,
    y: this.valueRefactor(-0.5),
    a: this.valueRefactor(-0.003),
  }

  totalResources: number = 0
  loadedResources: number = 0

  resourceCheckInterval: number
  skyHeight = this.canvasSize * 0.7
  groundHeight = this.canvasSize - this.skyHeight
  skyGradient = this.ctx.createLinearGradient(0, 0, 0, this.skyHeight)
  groundGradient = this.ctx.createLinearGradient(
    0, this.skyHeight, 0, this.canvasSize)

  GHBSConstant: number = this.pillarGapHeight - this.birdSize
  SCOREBOARDUPDATEINTERVALID = 0
  score = document.getElementById('score')!
  gameScore = 0
  constructor() {
    console.log(this.canvasSize)
    for (let i = 0; i < this.totalPillar; i += 1) {
      this.pillars.push({
        pos: {
          x: this.canvasSize + i * (this.pillarGapUnitWidth),
          y: 0,
        },
        width: this.pillarWidth,
        height: this.canvasSize,
        gapHeight: this.pillarGapHeight,
        gapPos: {
          x: 0,
          y: this.generateGapPos()
        }
      })
    }
    this.skyGradient.addColorStop(0, 'deepskyblue')
    this.skyGradient.addColorStop(1, 'white')
    this.groundGradient.addColorStop(0, 'yellowgreen')
    this.groundGradient.addColorStop(1, 'darkgreen')

    this.canvas.width = this.canvasSize
    this.canvas.height = this.canvasSize

    let birdImage1 = new Image()
    birdImage1.src = 'flappy-bird-assets-master/sprites/bluebird-midflap.png'
    this.totalResources += 1
    birdImage1.onload = (event)=>{
      this.loadedResources += 1
    }
    this.birdImages.push(birdImage1)
    this.totalBirdImages += 1
    
    let birdImage2 = new Image()
    birdImage2.src = 'flappy-bird-assets-master/sprites/bluebird-upflap.png'
    this.totalResources += 1
    birdImage2.onload = (event)=>{
      this.loadedResources += 1
    }
    this.birdImages.push(birdImage2)
    this.totalBirdImages += 1

    let birdImage3 = new Image()
    birdImage3.src = 'flappy-bird-assets-master/sprites/bluebird-midflap.png'
    this.totalResources += 1
    birdImage3.onload = (event)=>{
      this.loadedResources += 1
    }
    this.birdImages.push(birdImage3)
    this.totalBirdImages += 1

    let birdImage4 = new Image()
    birdImage4.src = 'flappy-bird-assets-master/sprites/bluebird-downflap.png'
    this.totalResources += 1
    birdImage4.onload = (event)=>{
      this.loadedResources += 1
    }
    this.birdImages.push(birdImage4)
    this.totalBirdImages += 1

    this.backgroundImage = new Image()
    this.backgroundImage.src = 'flappy-bird-assets-master/sprites/background-day.png'
    this.totalResources += 1
    this.backgroundImage.onload = (event)=>{
      this.loadedResources += 1 
    }

    // check if the resources are fully loaded
    this.resourceCheckInterval = setInterval(()=>{
      if (this.totalResources == this.loadedResources) {
        console.log('All resources loaded!')
        clearInterval(this.resourceCheckInterval)
        this.startGame()
        this.canvas.onclick = this.flap.bind(this)
      }
    }, 500)
    
  }
  startGame(){
    requestAnimationFrame(this.game.bind(this))
    this.SCOREBOARDUPDATEINTERVALID = setInterval(
      ()=>{
        this.score.innerText = `${this.gameScore}`
        this.gameScore += 1
      },
      100
    )
  }
  valueRefactor(v) {
    return (v / this.minScreenSize) * this.canvasSize
  }

  generateGapPos():number{
    let x = this.canvasSize - (this.birdSize * 2 + this.pillarGapHeight)
    return this.birdSize + Math.random() * x
  }

  flap(){
    this.velocity.y = this.velocityOnFlap.y 
    this.velocity.a = this.velocityOnFlap.a
  }

  minifyAngle(angle:number):number {
    while(angle >= this.fullAngle) {
      angle -= this.fullAngle
    }
    while (angle <= -this.fullAngle) {
      angle += this.fullAngle
    }
    return angle
  }

  game(timestamp) {
    // dt analysis
    if (this.lastTime == 0) {
      this.lastTime = timestamp
    }
    let dt = timestamp - this.lastTime
    this.lastTime = timestamp
    // clearing previous shit
    this.ctx.clearRect(0, 0, this.canvasSize, this.canvasSize)
    // this.ctx.drawImage(this.backgroundImage, 0, 0, this.canvasSize, this.canvasSize)
    // this.ctx.fillStyle = this.skyGradient
    // this.ctx.fillRect(0, 0, this.canvasSize, this.skyHeight)

    // this.ctx.fillStyle = this.groundGradient
    // this.ctx.fillRect(0, this.skyHeight, this.canvasSize, this.groundHeight)

    // drawing pillar
    this.ctx.fillStyle = 'red'
    for (let pillar of this.pillars) {
      this.ctx.fillRect(
        pillar.pos.x, pillar.pos.y, pillar.width, pillar.gapPos.y
      )
      let v = pillar.gapPos.y + pillar.gapHeight
      this.ctx.fillRect(
        pillar.pos.x, v, 
        pillar.width, pillar.height - v
      )
      pillar.pos.x -= this.pillarVelocity * dt
    }

    // iterating the pillar
    let fp = this.pillars[this.firstPillar]
    if (fp.pos.x < -this.pillarWidth) {
      // let pillar = this.pillars.shift()!
      fp.pos.x = this.pillars[this.lastPillar].pos.x + this.pillarGapUnitWidth
      fp.gapPos.y = this.generateGapPos()
      this.firstPillar += 1
      this.lastPillar += 1
      if (this.firstPillar > this.totalPillar - 1) {
        this.firstPillar = 0
      }
      if (this.lastPillar > this.totalPillar - 1) {
        this.lastPillar = 0
      }
    }
    
    // calculating vars w/ AnguloLinear Mechanics
    this.velocity.y += this.acceleration.y * dt
    this.birdState.y += this.velocity.y * dt
    this.velocity.a += this.acceleration.a * dt 
    this.birdState.a += this.velocity.a * dt 

    // drawing the stuff
    this.ctx.save()
    this.ctx.translate(
      this.birdState.x + this.halfBirdSize, this.birdState.y + this.halfBirdSize)
    this.ctx.rotate(this.birdState.a)
    this.ctx.drawImage(
      this.birdImages[this.birdImagesIndex], 
      -this.halfBirdSize, -this.halfBirdSize,
      this.birdSize, this.birdSize)
    this.ctx.restore()
    this.birdImagesIndex += 1
    if (this.birdImagesIndex >= this.totalBirdImages) {
      this.birdImagesIndex = 0
    }
    // check collision
    fp = this.pillars[this.firstPillar]
    let birdPillarDistance = this.birdStateEx - fp.pos.x
    if (birdPillarDistance >= 0 && birdPillarDistance < this.pillarWidth) {
      if (this.birdState.y < fp.gapPos.y || this.birdState.y >= (fp.gapPos.y + this.GHBSConstant)) {
        return this.gameOver()
      } 
    }
    // modulating variables
    if (this.birdState.y < 0) {
      this.birdState.y = 0
      this.velocity.y = 0
    }
    else if (this.birdState.y > this.freedom.y) {
      return this.gameOver()
      this.birdState.y = this.freedom.y
      this.velocity.y = 0
    }
    if (this.birdState.a > this.freedom.a) {
      this.birdState.a = this.freedom.a
      this.velocity.a = 0
    }
    else if (this.birdState.a < -this.freedom.a) {
      this.birdState.a = -this.freedom.a 
      this.velocity.a = 0
    }
    requestAnimationFrame(this.game.bind(this))
  }
  gameOver(){
    clearInterval(this.SCOREBOARDUPDATEINTERVALID)
  }
}

var game = new FlappyBirdGame()
console.log(game.birdImages.length)

for (let i of game.birdImages) {
  // document.appendChild(i)
  console.log(i.src)
}
