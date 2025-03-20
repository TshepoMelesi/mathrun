class Term{
    static operators = ["*", "+", "/", "-"]
    static getTerm(index = 0, operatorType = "random"){
        return index ? Term.getOperator(operatorType) + " " + random(5000, 1) : random(5000, 1)
    }
    
    static getOperator = (operatorType = "random") => {
        // TODO: make operator switch feature
        return Term.operators[random(Term.operators.length - 1, 0)]
    }
}

class Question{
    constructor(type = "random", level = 3){
        this.type = type
        this.level = Math.max(level, 2)
        this.quizz = []
        this.answer = 0
    }

    calcAnswer(quizz){
        // TODO: return a calculated answer
        return 0
    }

    generateQuestion(){
        for(let i = 0; i < this.level; i++){
            const term = Term.getTerm(i)
            this.quizz.push(term)
        }

        return {quizz : this.quizz, answer  : this.calcAnswer(this.answer)}
    }
}

const myQuestion = new Question("random", 2)
console.log(myQuestion.generateQuestion())