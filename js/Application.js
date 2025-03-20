class Application{
    constructor(canvas, {width, height, level, topic, colors} = {}){
            this.canvas         = canvas
            this.context        = this.canvas.getContext("2d")
            this.level          = level ? level : 0
            this.topic          = topic ? topic : 0
            this.colors         = colors ? colors : ["black", "white"]
            
            this.width          = width ? width : 100
            this.height         = height ? height : 100

            this.display        = new Display(this.width, this.height, 3, [33445, "+ 343", "- 34"])
            this.screenOffset   = 10
            this.card           = {
                                        x : this.screenOffset,
                                        y : this.screenOffset,
                                        width : this.width - (2 * this.screenOffset),
                                        height : 
                                        this.height - 4 - ( 3.5 * this.screenOffset) - buttonContainer.getBoundingClientRect().height,
                                        round : 10
                                }
            this.mainCard       = new Card(this.card)

            // this.setChallenge()
    }

    setChallenge(){
        const quizz = []

        quizz.push(random(10000, 1))

        for(let i = 0; i < this.level + 1; i++){
            quizz.push(getOperator() + " " + random(1000, 1))
        }

        this.display.setQuizz(quizz)

        this.draw()
    }

    draw(){
        this.context.clearRect(0, 0, this.width, this.height)
        this.mainCard.draw(this.context)
        this.display.draw(this.context)
    }
}
