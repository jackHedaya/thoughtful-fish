class Bubble {
  maxHeight: number
  maxWidth: number

  color: string

  timeout: NodeJS.Timeout

  posX: number
  posY: number

  movementX: any
  movementY: any

  size: number

  constructor(canvasWidth: number, canvasHeight: number, color: string) {
    this.maxHeight = canvasHeight
    this.maxWidth = canvasWidth
    this.color = color
    this.randomise()

    this.timeout = null
  }

  generateDecimalBetween(min: number, max: number) {
    return Math.random() * (min - max) + max
  }

  generateIntegerBetween(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  update() {
    this.posX = this.posX - this.movementX
    this.posY = this.posY - this.movementY

    // this.maxWidth = canvasWidth
    // this.maxHeight = canvasHeight

    if (this.posY < -100 || this.posX < 0 || this.posX > this.maxWidth + 100) {
      if (this.timeout) return

      this.timeout = setTimeout(() => {
        this.randomise()
        this.posY = this.maxHeight + 100

        this.timeout = null
      }, this.generateIntegerBetween(1000, 2000))
    }
  }

  randomise() {
    // this.color = Math.random() * 255;
    // this.color = "0,0,0";
    this.size = this.generateDecimalBetween(50, 100)
    this.movementX = this.generateDecimalBetween(-0.4, 0.2)
    this.movementY = this.generateDecimalBetween(0.7, 1.5)
    this.posX = this.generateDecimalBetween(0, this.maxWidth)
    this.posY = this.generateDecimalBetween(0, this.maxHeight)
  }
}

export default class Background {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  color: string
  bubblesList: Bubble[]

  constructor(id: string, color: string) {
    this.canvas = document.getElementById(id) as HTMLCanvasElement

    if (this.canvas === null)
      throw `Unable to find canvas with id ${id}`

    this.ctx = this.canvas.getContext('2d')
    this.canvas.height = window.innerHeight
    this.canvas.width = window.innerWidth
    this.color = color
    this.bubblesList = []

    this.generateBubbles()
    this.animate()
  }

  animate() {
    let self = this
    self.ctx.clearRect(0, 0, self.canvas.width, self.canvas.height)
    self.bubblesList.forEach(function (bubble) {
      bubble.update()

      self.ctx.beginPath()
      self.ctx.arc(bubble.posX, bubble.posY, bubble.size, 0, 2 * Math.PI)
      self.ctx.fillStyle = bubble.color
      self.ctx.globalAlpha = 0.39
      self.ctx.fill()

      self.ctx.strokeStyle = bubble.color
      self.ctx.stroke()
    })

    requestAnimationFrame(this.animate.bind(this))
  }

  addBubble(bubble: Bubble) {
    return this.bubblesList.push(bubble)
  }

  generateBubbles() {
    let self = this
    for (let i = 0; i < self.bubbleDensity(); i++) {
      self.addBubble(
        new Bubble(self.canvas.width, self.canvas.height, self.color)
      )
    }
  }

  bubbleDensity() {
    return Math.sqrt((this.canvas.height, this.canvas.width) / 6)
  }
}