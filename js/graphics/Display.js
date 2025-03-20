const addSpaces = (num) => {
    let space = []

    for(let i = 0; i < num; i++){
        space.push("#")
    }

    return space
}

const formatQuizz = (string, max = 6) => {
    if(!string.includes(" ")){

        if(string.length <= max){
            const split = string.split("")
            split.unshift(...addSpaces(max - string.length))
            return split.join("")
        }

    }

    if(string.length <= max){
        const split = string.split(" ")
        const diff = max - string.length

        if(diff >= 0){
            const op = split[0]
            let number = split[1].split("")
            number.unshift(...addSpaces(diff + 1))

            return [op, ...number].join("")
        }
    }

    return "- 1"
}

const resetQuizz = (quizz, max)=>{
    return quizz.map(q => formatQuizz(q.toString(), max))
}

class NumberContainer{
    constructor(point, width, height, content){
        this.point = point
        this.width = width
        this.content = content
        this.height = height
    }

    draw(context){

        // DEBUG ONLY
        if(1 == 0){
            context.beginPath()
            context.lineWidth = 2
            context.strokeStyle = "white"
            context.rect(
                this.point.x,
                this.point.y,
                this.width,
                this.height
            )
            context.fillStyle = "rgba(0, 0, 0, 0)"
            context.stroke()
            context.fill()
            context.closePath()

        }
        context.beginPath()
        context.textBaseline = "top"
        context.textAlign = "left"
        context.font = this.height + "px Arial"
        context.fillStyle = "white"
        context.fillText(
            this.content, 
            this.point.x + 10, 
            this.point.y + 4
        )
        context.closePath()
    }
}

class TermContainer{
    constructor(point, width, height, content = "+ 344", spaces = 5){
        this.point = point
        this.width = width
        this.height = height
        this.spaces = spaces
        this.content = content.toString().split("")

        this.containers = []            // NUMBER CONTAINERS

        this.setContainers()
    }

    setContainers(){
        const _width = this.width / this.spaces
        this.content.forEach((term, idx) =>{
            this.containers.push(
                new NumberContainer(
                    {
                        x: this.point.x + _width * (idx + 0), 
                        y: this.point.y
                    }, 
                    _width, 
                    this.height,
                    term === "#" ? "" : term
                )
            )
        })
    }

    draw(context){
        if(1 == 0){
            context.beginPath()
            context.lineWidth = 2
            context.strokeStyle = "white"
            context.strokeRect(
                this.point.x,
                this.point.y,
                this.width,
                this.height
            )
            context.stroke()
            context.closePath()
        }

        this.containers.forEach(container => container.draw(context))
    }
}

class AnswerDigit{
    constructor(point, width, height, content){
        this.point = point
        this.width = width
        this.content = "#"
        this.height = height
        this.fillColor = "white"
    }
    
    incrementDigit(){
        if(this.content === "#") this.content = 0
        this.content++
        if (this.content >= 10){
            this.content = 0
        }
    }

    collision(mouse){
        if(
            mouse.x > this.point.x && 
            mouse.x < this.point.x + this.width &&
            mouse.y > this.point.y &&
            mouse.y < this.point.y + this.height - 20
        ){
            this.incrementDigit()
        }
    }

    draw(context){

        // DEBUG ONLY
        if(1 == 1){
            context.beginPath()
            context.lineWidth = 2
            context.strokeStyle = "white"
            context.rect(
                (this.point.x + 2),
                this.point.y,
                this.width - 4,
                this.height
            )
            context.stroke()
            context.fillStyle = "rgba(180, 180, 180, 0.08)"
            context.fill()
            context.closePath()

        }
        context.beginPath()
        context.textBaseline = "top"
        context.textAlign = "left"
        context.font = this.height + "px Arial"
        context.fillStyle = this.fillColor
        context.fillText(
            this.content == "#" ? " " : this.content, 
            this.point.x + 10, 
            this.point.y + 4
        )
        context.closePath()
    }
}

class AnswerContainer{
    constructor(point, width, height, content = "+ 344", spaces = 5){
        this.point = point
        this.width = width
        this.height = height
        this.spaces = spaces
        this.content = content.toString().split("")

        this.containers = []            // NUMBER CONTAINERS

        this.setContainers()
    }

    setContainers(){
        const _width = this.width / this.spaces
        this.content.forEach((term, idx) =>{
            this.containers.push(
                new AnswerDigit(
                    {
                        x: this.point.x + _width * (idx + 0), 
                        y: this.point.y
                    }, 
                    _width, 
                    this.height,
                    "$"
                )
            )
        })
    }
    
    collision(mouse){
        this.containers.forEach(digit => {
            digit.collision(mouse)
        })
    }

    draw(context){
        if(1 == 0){
            context.beginPath()
            context.lineWidth = 2
            context.strokeStyle = "white"
            context.strokeRect(
                this.point.x,
                this.point.y,
                this.width,
                this.height
            )
            context.stroke()
            context.closePath()
        }

        this.containers.forEach(container => container.draw(context))
    }
}

class Display{
    constructor(width, height, level = 3, quizz = null){
        this.width = width
        this.height = height
        this.termHeight = 70
        this.termGap = 0
        this.level = quizz.length
        this.maxDigits = 6
        this.quizz = resetQuizz([random(100000, 10), getOperator("multiplication") + " "+ random(1000, 10), "+ "+ random(1000, 10), "+ "+ random(1000, 10), "- " + random(9000, 10)], this.maxDigits)
        this.answer = "######"
        this.point = new Point(100, 100)
        this.containers = []                // TERM CONTAINERS
        this.answerContainer = new AnswerContainer(
            {
                x: 20, 
                y: 50 + this.termHeight * this.quizz.length + 40
            }, 
            this.width - 40, 
            this.termHeight,
            this.answer,
            6
        )

        this.setContainers()
    }

    setQuizz(newQuizz){
        this.answerContainer = new AnswerContainer(
            {
                x: 20, 
                y: 50 + this.termHeight * this.quizz.length + 40
            }, 
            this.width - 40, 
            this.termHeight,
            this.answer,
            6
        )
        this.containers = []
        this.quizz = resetQuizz(newQuizz, this.maxDigits)
        this.setContainers()
    }
    getQuizz(){
        return this.quizz
    }

    setContainers(){
        const numberOfSpaces = Math.max(...this.getQuizz().map(q => q?.length))
        this.quizz.forEach((term, idx) => {
            this.containers.push(
                new TermContainer(
                    {
                        x: 20, 
                        y: 50 + (this.termHeight + this.termGap)* (idx)
                    }, 
                    this.width - 40, 
                    this.termHeight,
                    term,
                    numberOfSpaces
                ))

        })
    }

    collision(mouse){
        if(!this.containers.length) return
        this.answerContainer.collision(mouse)
    }

    draw(context){
        this.containers.forEach(container => container.draw(context))

        context.beginPath()
        context.lineWidth = 10
        context.lineCap = "round"
        context.strokeStyle = "white"
        context.moveTo(20, 30 + this.termHeight * this.quizz.length + 40)
        context.lineTo(this.width - 20,30 + this.termHeight * this.quizz.length + 40)
        context.stroke()
        context.closePath()
        this.answerContainer.draw(context)
    }
}