class Point extends Vector{
    constructor(x, y, {radius = 10, fill = "red", stroke = "yellow", lineWidth = 4} = {}){
        super(x, y)

        this.radius = radius
        this.fillColor = fill
        this.strokeColor = stroke
        this.lineWidth = lineWidth
    }

    draw(context){
        context.beginPath()
        context.arc(
            this.x, 
            this.y,
            this.radius,
            0,
            Math.PI * 2
        )
        if(this.strokeColor){
            context.strokeStyle = strokeColor
            context.stroke()
        }
        if(this.fillColor){
            context.fillStyle = fillColor
            context.fill()
        }
        context.closePath()
    }
}