const buttonContainer = document.querySelector(".button-container")
const board = document.querySelector(".board")
const context = board.getContext("2d")

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

window.addEventListener("load", () => {
        const WIDTH = window.innerWidth
        const HEIGHT = window.innerHeight

        board.width = WIDTH
        board.height = HEIGHT

        const myApp = new Application(
                board, 
                {
                        width : WIDTH, 
                        height : HEIGHT,
                        level : 3
                }
        )
        
        const handleNext = () => {
                myApp.setChallenge()
        }
        nextBtn.ontouchstart = () => handleNext()
        nextBtn.onmousedown = () => handleNext()
        
        myApp.draw()
        myApp.setChallenge()

        window.addEventListener("click", (event)=>{
                const mouse = {
                        x : event.offsetX,
                        y : event.offsetY,
                }

                myApp.answer = "######"
                myApp.display.collision(mouse)
                myApp.draw()
        })
})
