const optionsEl = document.querySelectorAll(".option")
const boardEl = document.querySelector(".board")
const height = boardEl.height = 400
const width = boardEl.width = 400
const context = boardEl.getContext("2d")

const text = (context, message, pos, size, color, align = "left", baseline = "bottom") => {
    context.beginPath()
    context.fillStyle = color
    context.textAlign = align
    context.textBaseline = baseline
    context.font = size + "px Arial"
    context.fillText(message, pos[0], pos[1])
    context.fill()
    context.closePath()
}

const line = (context, A, B, lineWidth, color) => {
    context.beginPath()
    context.strokeStyle = color
    context.lineWidth = lineWidth
    context.moveTo(A.x, A.y)
    context.lineTo(B.x, B.y)
    context.stroke()
    context.closePath()
}

class Step {
    constructor(app, tag, step){
        this.app = app
        this.tagHeight = this.app.lineHeight * 0.3
        this.stepHeight = this.app.lineHeight * 0.50
        this.stepChar = step.split(" ")
        this.tag = tag
    }
    
    draw(context, index){
        // tag
        text(
            context,
            this.tag,
            [width / 2,  this.app.lineHeight + this.app.lineHeight * index + 8],
            this.tagHeight,
            "gray",
            "center",
            "top"
        )
        // step
        text(
            context,
            this.step,
            [width / 2,this.app.lineHeight + this.app.lineHeight * (1 + index)],
            this.stepHeight,
            "white",
            "center"
        )
    }
}
class Question{
    constructor(app, quizz = "1 + 0 = 3", steps = []){
        this.app = app
        this.quizz = quizz
        this.steps = steps.map(step => new Step(this.app, ...step))
    }
    setQuizz(newQuizz){
        this.quizz = newQuizz
    }
    addStep(newStep){
        this.steps.push(new Step(this.app, newStep.tag, newStep.step))
    }
    draw(context){
        // quizz
        text(
            context,
            this.quizz,
            [width / 2, 50],
            50,
            "white",
            "center",
            "middle"
        )
        // steps
        this.steps.forEach((step, index) => {
            step.draw(context, index)
        })
    }
}

class Arithmetics{
    constructor(){
        this.lineHeight = 75
        this.questions = new Question(this,
            "45 + x = 60", 
            [
                ["Step 1 : subtract 45 on both sides", "45 + x - 45 = 60 - 45"],
                ["Step 2 : get the differences", "0 + x = 15"],
                ["Step 3 : x is then equals to...", "x = 15"],
            ]
        )

    }
    
    drawGrid(context){
        const lineNums = Math.round(height / this.lineHeight)
        for(let i = 1; i <= lineNums; i++){
            const y = i * this.lineHeight
            line(context, {x:0,y}, {x:width,y}, 1.4, "gray")
        }
    }
    draw(context){
        this.drawGrid(context)
        this.questions.draw(context)
    }
}

const myApp = new Arithmetics()
myApp.draw(context)