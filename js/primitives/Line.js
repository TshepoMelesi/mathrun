class Line extends Vector{
    constructor(pointA, pointB){
            super(pointA.x, pointA.x)
            this.end = pointB
            this.lineWidth = 10
            this.strokeColor = "white"
    }

    draw(context){
            context.beginPath()
            context.strokeStyle = this.strokeColor
            context.lineCap = "round"
            context.lineWidth = this.lineWidth
            context.moveTo(this.x, this.y)
            context.lineTo(this.end.x, this.end.y)
            context.stroke()
            context.closePath()
    }
}