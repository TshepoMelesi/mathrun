class Text extends Vector{
    constructor(x, y, message = "MATHEMATICS", size){
            super(x, y)
            this.message = message
            this.size = size
            this.font = "Monospace"
    }

    draw(context){
            context.beginPath()
            context.fillStyle = "white"
            context.textAlign = "right"
            context.textBaseline = "top"
            context.font = this.size + "px " + this.font
            context.fillText(
                    this.message,
                    this.x,
                    this.y,
            )
            context.fill()
            context.closePath()
    }
}
