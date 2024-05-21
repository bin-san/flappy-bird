(() => {
  // main.ts
  function _define_property(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }
    return obj;
  }
  var FlappyBirdGame = class {
    startGame() {
      requestAnimationFrame(this.game.bind(this));
      this.SCOREBOARDUPDATEINTERVALID = setInterval(() => {
        this.score.innerText = `${this.gameScore}`;
        this.gameScore += 1;
      }, 100);
    }
    valueRefactor(v) {
      return v / this.minScreenSize * this.canvasSize;
    }
    generateGapPos() {
      let x = this.canvasSize - (this.birdSize * 2 + this.pillarGapHeight);
      return this.birdSize + Math.random() * x;
    }
    flap() {
      this.velocity.y = this.velocityOnFlap.y;
      this.velocity.a = this.velocityOnFlap.a;
    }
    minifyAngle(angle) {
      while (angle >= this.fullAngle) {
        angle -= this.fullAngle;
      }
      while (angle <= -this.fullAngle) {
        angle += this.fullAngle;
      }
      return angle;
    }
    game(timestamp) {
      if (this.lastTime == 0) {
        this.lastTime = timestamp;
      }
      let dt = timestamp - this.lastTime;
      this.lastTime = timestamp;
      this.ctx.clearRect(0, 0, this.canvasSize, this.canvasSize);
      this.ctx.fillStyle = "red";
      for (let pillar of this.pillars) {
        this.ctx.fillRect(pillar.pos.x, pillar.pos.y, pillar.width, pillar.gapPos.y);
        let v = pillar.gapPos.y + pillar.gapHeight;
        this.ctx.fillRect(pillar.pos.x, v, pillar.width, pillar.height - v);
        pillar.pos.x -= this.pillarVelocity * dt;
      }
      let fp = this.pillars[this.firstPillar];
      if (fp.pos.x < -this.pillarWidth) {
        fp.pos.x = this.pillars[this.lastPillar].pos.x + this.pillarGapUnitWidth;
        fp.gapPos.y = this.generateGapPos();
        this.firstPillar += 1;
        this.lastPillar += 1;
        if (this.firstPillar > this.totalPillar - 1) {
          this.firstPillar = 0;
        }
        if (this.lastPillar > this.totalPillar - 1) {
          this.lastPillar = 0;
        }
      }
      this.velocity.y += this.acceleration.y * dt;
      this.birdState.y += this.velocity.y * dt;
      this.velocity.a += this.acceleration.a * dt;
      this.birdState.a += this.velocity.a * dt;
      this.ctx.save();
      this.ctx.translate(this.birdState.x + this.halfBirdSize, this.birdState.y + this.halfBirdSize);
      this.ctx.rotate(this.birdState.a);
      this.ctx.drawImage(this.birdImages[this.birdImagesIndex], -this.halfBirdSize, -this.halfBirdSize, this.birdSize, this.birdSize);
      this.ctx.restore();
      this.birdImagesIndex += 1;
      if (this.birdImagesIndex >= this.totalBirdImages) {
        this.birdImagesIndex = 0;
      }
      fp = this.pillars[this.firstPillar];
      let birdPillarDistance = this.birdStateEx - fp.pos.x;
      if (birdPillarDistance >= 0 && birdPillarDistance < this.pillarWidth) {
        if (this.birdState.y < fp.gapPos.y || this.birdState.y >= fp.gapPos.y + this.GHBSConstant) {
          return this.gameOver();
        }
      }
      if (this.birdState.y < 0) {
        this.birdState.y = 0;
        this.velocity.y = 0;
      } else if (this.birdState.y > this.freedom.y) {
        return this.gameOver();
        this.birdState.y = this.freedom.y;
        this.velocity.y = 0;
      }
      if (this.birdState.a > this.freedom.a) {
        this.birdState.a = this.freedom.a;
        this.velocity.a = 0;
      } else if (this.birdState.a < -this.freedom.a) {
        this.birdState.a = -this.freedom.a;
        this.velocity.a = 0;
      }
      requestAnimationFrame(this.game.bind(this));
    }
    gameOver() {
      clearInterval(this.SCOREBOARDUPDATEINTERVALID);
    }
    constructor() {
      _define_property(this, "canvas", document.getElementById("canvas"));
      _define_property(this, "ctx", this.canvas.getContext("2d"));
      _define_property(this, "minScreenSize", window.innerHeight > window.innerWidth ? window.innerWidth : window.innerHeight);
      _define_property(this, "canvasSize", 500 > this.minScreenSize ? this.minScreenSize : 500);
      _define_property(this, "birdSize", this.canvasSize / 12);
      _define_property(this, "halfBirdSize", this.birdSize / 2);
      _define_property(this, "birdImages", []);
      _define_property(this, "totalBirdImages", 0);
      _define_property(this, "birdImagesIndex", 0);
      _define_property(this, "backgroundImage", void 0);
      _define_property(this, "totalPillar", 3);
      _define_property(this, "pillarWidth", this.canvasSize / (2 * this.totalPillar - 1));
      _define_property(this, "pillars", []);
      _define_property(this, "firstPillar", 0);
      _define_property(this, "lastPillar", this.totalPillar - 1);
      _define_property(this, "pillarVelocity", this.valueRefactor(0.2));
      _define_property(this, "pillarGapHeight", this.birdSize * 6);
      _define_property(this, "gapBetweenTwoPillarX", this.pillarWidth * 1.5);
      _define_property(this, "pillarGapUnitWidth", this.pillarWidth + this.gapBetweenTwoPillarX);
      _define_property(this, "velocity", {
        x: 0,
        y: 0,
        a: 0
      });
      _define_property(this, "acceleration", {
        x: 0,
        y: this.valueRefactor(9e-4),
        a: this.valueRefactor(5e-6)
      });
      _define_property(this, "lastTime", 0);
      _define_property(this, "birdState", {
        x: (this.pillarWidth * 1.5 - this.birdSize) / 2,
        y: 0,
        a: 0
      });
      _define_property(this, "birdStateEx", this.birdState.x + this.birdSize);
      _define_property(this, "freedom", {
        x: this.canvasSize - this.birdSize,
        y: this.canvasSize - this.birdSize,
        a: Math.PI / 4
      });
      _define_property(this, "fullAngle", Math.PI * 2);
      _define_property(this, "velocityOnFlap", {
        x: 0,
        y: this.valueRefactor(-0.5),
        a: this.valueRefactor(-3e-3)
      });
      _define_property(this, "totalResources", 0);
      _define_property(this, "loadedResources", 0);
      _define_property(this, "resourceCheckInterval", void 0);
      _define_property(this, "skyHeight", this.canvasSize * 0.7);
      _define_property(this, "groundHeight", this.canvasSize - this.skyHeight);
      _define_property(this, "skyGradient", this.ctx.createLinearGradient(0, 0, 0, this.skyHeight));
      _define_property(this, "groundGradient", this.ctx.createLinearGradient(0, this.skyHeight, 0, this.canvasSize));
      _define_property(this, "GHBSConstant", this.pillarGapHeight - this.birdSize);
      _define_property(this, "SCOREBOARDUPDATEINTERVALID", 0);
      _define_property(this, "score", document.getElementById("score"));
      _define_property(this, "gameScore", 0);
      console.log(this.canvasSize);
      for (let i = 0; i < this.totalPillar; i += 1) {
        this.pillars.push({
          pos: {
            x: this.canvasSize + i * this.pillarGapUnitWidth,
            y: 0
          },
          width: this.pillarWidth,
          height: this.canvasSize,
          gapHeight: this.pillarGapHeight,
          gapPos: {
            x: 0,
            y: this.generateGapPos()
          }
        });
      }
      this.skyGradient.addColorStop(0, "deepskyblue");
      this.skyGradient.addColorStop(1, "white");
      this.groundGradient.addColorStop(0, "yellowgreen");
      this.groundGradient.addColorStop(1, "darkgreen");
      this.canvas.width = this.canvasSize;
      this.canvas.height = this.canvasSize;
      let birdImage1 = new Image();
      birdImage1.src = "flappy-bird-assets-master/sprites/bluebird-midflap.png";
      this.totalResources += 1;
      birdImage1.onload = (event) => {
        this.loadedResources += 1;
      };
      this.birdImages.push(birdImage1);
      this.totalBirdImages += 1;
      let birdImage2 = new Image();
      birdImage2.src = "flappy-bird-assets-master/sprites/bluebird-upflap.png";
      this.totalResources += 1;
      birdImage2.onload = (event) => {
        this.loadedResources += 1;
      };
      this.birdImages.push(birdImage2);
      this.totalBirdImages += 1;
      let birdImage3 = new Image();
      birdImage3.src = "flappy-bird-assets-master/sprites/bluebird-midflap.png";
      this.totalResources += 1;
      birdImage3.onload = (event) => {
        this.loadedResources += 1;
      };
      this.birdImages.push(birdImage3);
      this.totalBirdImages += 1;
      let birdImage4 = new Image();
      birdImage4.src = "flappy-bird-assets-master/sprites/bluebird-downflap.png";
      this.totalResources += 1;
      birdImage4.onload = (event) => {
        this.loadedResources += 1;
      };
      this.birdImages.push(birdImage4);
      this.totalBirdImages += 1;
      this.backgroundImage = new Image();
      this.backgroundImage.src = "flappy-bird-assets-master/sprites/background-day.png";
      this.totalResources += 1;
      this.backgroundImage.onload = (event) => {
        this.loadedResources += 1;
      };
      this.resourceCheckInterval = setInterval(() => {
        if (this.totalResources == this.loadedResources) {
          console.log("All resources loaded!");
          clearInterval(this.resourceCheckInterval);
          this.startGame();
          this.canvas.onclick = this.flap.bind(this);
        }
      }, 500);
    }
  };
  var game = new FlappyBirdGame();
  console.log(game.birdImages.length);
  for (let i of game.birdImages) {
    console.log(i.src);
  }
})();
//# sourceMappingURL=main.js.map
