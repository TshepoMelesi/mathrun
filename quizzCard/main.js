const quizzes = []
const width = window.innerWidth
const height = window.innerHeight
const cardInner = document.querySelector(".card-inner")
const cardQuestion = document.querySelector(".card-question")
const cardAnswer = document.querySelector(".card-answer")
const dashboard = document.querySelector(".dashboard")
const quizzList = document.querySelector(".quizz-list")
const dashboardContent = document.querySelector(".dashboard-content")
const quizzFront = document.querySelector(".quizz-front")
const quizzBack = document.querySelector(".quizz-back")

const app = {name : "asm-app", quizzes : [], mode : "CARD"}

const generateId = (max = 10000000, min = 0) => {
    return Math.round(Math.random() * (max - min) + min)
}
const addQuizz = (question, answer) => {
    const id = generateId()
    const quizz = {question, answer, id}

    saveQuizz(quizz)
}
const createDb = (name = null) => {
    if(!name) return console.log("Db name needed!")
    console.log("create db => ", name)
    localStorage.setItem(app.name, JSON.stringify(app))
}
const saveQuizz = (quizz) => {
    let appDb = JSON.parse(localStorage.getItem(app.name))

    if(!appDb) {
        createDb(app.name)
        let appDb = JSON.parse(localStorage.getItem(app.name))
    }

    if(appDb?.quizzes.find(q => 
        q.question == quizz.question && 
        q.answer == quizz.answer)
    ){
        return //console.log("found a duplicate of", quizz)
    }

    appDb.quizzes.push(quizz)

    localStorage.setItem(app.name, JSON.stringify(appDb))
}
const getQuizzIndex = (id) =>{
    const db = getDb()
    return db.quizzes.findIndex(q => q.id === id)
}
const removeQuizz = (id) => {
    const quizzIdx = getQuizzIndex(id)
    const delQuizz = db.quizzes.splice(quizzIdx, 1)
    app.quizzes = db.quizzes
    localStorage.setItem(app.name, JSON.stringify(app))
    refreshList()

    return delQuizz
}
const getDb = () => {
    const db = localStorage.getItem(app.name)

    if(!db) {
        createDb(app.name)
        return console.log("Just set a localStorage DB")
    }
    return JSON.parse(db)
}
let db = getDb()    
const generateQuizz = () => {
    const quizz = db.quizzes[Math.floor(Math.random() * db.quizzes.length)]

    quizzes.push(quizz)
    return quizz
}
const display = (quizz) => {
    cardQuestion.innerText = quizz.question
    cardAnswer.innerText = quizz.answer
}
const handlePrev = () => {

    if(quizzes.length <1) return
    cardInner.style = "transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg);"

    quizzes.pop()
    const quizz = quizzes[quizzes.length - 1]

    if(!quizz) return
    display(quizz)
}
const handleFlip = () => {
    cardInner.style = "transform: rotateX(180deg) rotateY(0deg) rotateZ(180deg);"
}
const handleNext = () => {
    cardInner.style = "transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg);"
    if(!getDb().quizzes.length) return
    const quizz = generateQuizz()
    display(quizzes[quizzes.length - 1])
}
const toggleMode = () =>{
    if(app.mode == "DASHBOARD"){
        app.mode = "HOME"
    } else {
        app.mode = "DASHBOARD"
    }
}
const clearInputs = () => {
    quizzFront.value = ""
    quizzBack.value = ""
}
const populateInputs = (quizz) => {
    quizzFront.value = quizz.question
    quizzBack.value = quizz.answer
}
const handleAddQuizz = () => {
    const front = quizzFront.value
    const back = quizzBack.value

    if(!front || !back) return

    addQuizz(front, back)
    db = getDb()
    refreshList()
    clearInputs()
}

const handleEdit = (id) => {
    const quizz = db.quizzes[getQuizzIndex(id)]

    populateInputs(quizz)
    console.log(id, quizz)
    removeQuizz(id)
}
const handleDelete = (id) => {
    console.log("delete is triggered")
    const delQuizz = removeQuizz(id)
}
const createItem = (data) => {
    return`<li class="quizz" data-id="${data.id}">
                <p class="question"><strong>${data.question}</strong></p>
                <p class="answer">${data.answer}</p>
                <div class="card-actions">
                    <button class="edit" onclick="handleEdit(${data.id})">edit</button>
                    <button class="delete" onclick="handleDelete(${data.id})">delete</button>
                </div>
            </li>`
}
const refreshList = () =>{
    const db = getDb()

    quizzList.innerHTML = ""
    db.quizzes.forEach(q => {
        quizzList.innerHTML += createItem(q)
    })
}

const handleDashboard = () => {
    toggleMode()

    if(app.mode == "DASHBOARD"){
        dashboard.style.zIndex = 1000000
        dashboard.style.display = "flex"

        refreshList()
    } else {
        dashboard.style.display = "none"
        dashboard.style.zIndex = -1000000
    }
}

const handleHome = () => {
        app.mode = "HOME"
        dashboard.style.display = "none"
        dashboard.style.zIndex = -1000000
}

refreshList()

if(width > height){
    // 16/9
    dashboardContent.style.flexDirection = "row"
} else{
    // 9/16
    dashboardContent.style = `
        flex-direction : column;
        gap: 2em;
        align-items : center;
        justify-content: start;
    `
}