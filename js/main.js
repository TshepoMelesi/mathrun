const buttonContainer = document.querySelector(".button-container")
const board = document.querySelector(".board")
const context = board.getContext("2d")


// 3 MAIN BUTTONS
const prevBtn = document.querySelector(".prev-btn")
const revealBtn = document.querySelector(".reveal-btn")
const nextBtn = document.querySelector(".next-btn")

const random = (max = 1, min = 0) => {
        return Math.round(Math.random() * (max - min) + min)
}

const getOperator = () => {
        const operators = ["*", "+", "/", "-"]
        return operators[random(3, 0)]
}

const generateChallenge = (level = 1) => {
        const terms = []
        let challenge = ""
        level += level % 2 == 0 ? 2 : 1

        for(let i = 0; i <= level; i++){
                let item

                if(i % 2 == 0){
                        item = random(30, 0)
                } else { 
                        item = getOperator()
                }
                terms.push(item)
        }

        challenge = terms.join(" ")
        return challenge
}

class Vector{
        constructor(x, y){
                this.x = x
                this.y = y
        }
}

class Card extends Vector{
        constructor({x, y, width, height, round}){
                super(x, y)
                this.width = width ? width : 100
                this.height = height ? height : 100
                this.round = [round, round, round, round]
                this.fillColor = "black"
        }

        draw(context){
                context.beginPath()
                context.fillStyle = this.fillColor
                context.roundRect(
                        this.x,
                        this.y,
                        this.width,
                        this.height,
                        this.round
                )
                context.fill()
                context.closePath()
        }
}

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

class Line extends Vector{
        constructor(x, y, x1, y1){
                super(x, y)
                this.end = new Vector(x1, y1)
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

class Graphics {
        constructor(graphics = []){
              this.graphics = graphics  
        }

        addComponent(component, size){
                this.graphics.push(component)
        }

        draw(context){
                this.graphics.forEach(items => {
                        items.draw(context)
                })
        }
}

class Application{
        constructor(canvas, {width, height, level, topic, colors} = {}){
                this.canvas = canvas
                this.context = this.canvas.getContext("2d")
                this.level = level ? level : 0
                this.topic = topic ? topic : 0
                this.colors = colors ? colors : ["black", "white"]
                
                this.width = width ? width : 100
                this.height = height ? height : 100

                this.graphics = new Graphics()
                this.screenOffset = 10
                this.card = {
                        x : this.screenOffset,
                        y : this.screenOffset,
                        width : this.width - (2 * this.screenOffset),
                        height : this.height - 4 - ( 2 * this.screenOffset) - buttonContainer.getBoundingClientRect().height,
                        round : 10
                }
                this.mainCard = new Card(this.card)
        }

        setChallenge(){
                this.graphics.graphics = []
                const size = 100
                this.graphics.addComponent(
                        new Text(
                                this.width - 50, 
                                50, 
                                random(5000, 1000),
                                size
                        )
                )
                this.graphics.addComponent(
                        new Text(
                                this.width - 50, 
                                140, 
                                random(1000, 50),
                                size
                        )
                )

                this.graphics.addComponent(
                        new Line(
                                40,
                                2 * size + 40,
                                this.width - 40,
                                2 * size + 40
                        )
                )
                
                const op = random(10, 0)
                this.graphics.addComponent(
                        new Line(
                                40,
                                op < 5 ? 2 * size - 15 : 2 * size - 30,
                                70,
                                op < 5 ? 2 * size - 15 : 2 * size + 10
                        )
                )

                this.graphics.addComponent(
                        new Line(
                                op < 5 ? 55 : 70,
                                2 * size - 30,
                                op < 5 ? 55 : 40,
                                2 * size + 10
                        )
                )
                this.draw()

        }

        draw(){
                this.mainCard.draw(this.context)

                this.graphics.draw(this.context)
        }
}

const handlePrev = () => {
        console.log("prev pressed")
}
prevBtn.ontouchstart = () => handlePrev()
// prevBtn.onmousedown = () => handlePrev()

const handleReveal = () => {
        console.log("reveal pressed")
}
revealBtn.ontouchstart = () => handleReveal()
// revealBtn.onmousedown = () => handleReveal()

window.addEventListener("load", () => {
        const WIDTH = window.innerWidth
        const HEIGHT = window.innerHeight

        board.width = WIDTH
        board.height = HEIGHT

        const myApp = new Application(
                board, 
                {
                        width : WIDTH, 
                        height : HEIGHT
                }
        )
        myApp.draw()

        myApp.setChallenge()

                        
        const handleNext = () => {
                myApp.setChallenge()
        }
        nextBtn.ontouchstart = () => handleNext()
        // nextBtn.onmousedown = () => handleNext()

})
