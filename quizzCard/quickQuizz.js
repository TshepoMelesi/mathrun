const quizzes = []
const width = window.innerWidth
const height = window.innerHeight
const cardInner = document.querySelector(".card-inner")
const cardQuestion = document.querySelector(".card-question")
const cardAnswer = document.querySelector(".card-answer")
const dashboard = document.querySelector(".dashboard")
const quizzList = document.querySelector(".card-list")
const quizzFront = document.querySelector(".front-content")
const quizzBack = document.querySelector(".back-content")
const main = document.querySelector(".app-main")
const addCardPage = document.querySelector(".app-add-card")
const cardListPage = document.querySelector(".app-card-list")
const playCardPage = document.querySelector(".app-play-cards")
const footerActionBtns= document.querySelectorAll(".footer-action")
const track = document.querySelector(".track")
const appTitle = document.querySelector(".app-title")
const subjectEl = document.querySelector(".subject")
const typeEl = document.querySelector(".quizz-type")

const modes = ["ADD_CARD", "CARD_LIST", "PLAY_CARDS", "HOME"]
const pages = {
    currentPage : playCardPage,
    mode : "CARD",
    pageList : {
        "ADD_CARD": {
            title : "add new card",
            element : addCardPage,
            "leftAction" : {func : () => handleDashboard(), name : "view cards"},
            "rightAction" : {func : () => handleAddQuizz(), name : "save card"},
        },
        "CARD_LIST": {
            title : "deck of cards",
            element : cardListPage,
            "leftAction" : {func : () => handleClearAll(), name : "clear all"},
            "rightAction" : {func : () => routeTo("ADD_CARD"), name : "add card"},
        },
        "PLAY_CARDS": {
            title : "build good memory",
            element : playCardPage,
            "leftAction" : {func : () => handlePrev(), name : "previous"},
            "rightAction" : {func : () => handleNext(), name : "next card"},
        },
    }
}
const app = {
    name : "asm-app", 
    quizzes : [],
    quizzMode : "LOOP_ALL",
}

const sanitizeHTML = (input) => {
    const temp = document.createElement("div")
    temp.textContent = input
    return temp.innerHTML
}
const sanitizeText = (input) => {
    return input.trim().replace(/[^a-zA-Z0-9 .,!?-]/g, "")
}
const generateId = (max = 10000000, min = 0) => {
    return Math.round(Math.random() * (max - min) + min)
}
const addQuizz = (compQuizz) => {
    const id = generateId()
    // const quizz = {question, answer, id, subject, type, level, curriculum}

    saveQuizz(
        {
            id,
            s : compQuizz.s,
            f : compQuizz.f,
            l : compQuizz.l,
            c : compQuizz.c,
            b : compQuizz.b,
            t : compQuizz.t
        }
    )
}

const metadata = {
    "card" : {"s" : "subject","c" : "curriculum", "l" : "level", 
        "f" : "front", "b" : "back", "t" : "type" },
    "content" : {
      "d" : "definition",
      "f" : "formula",
      "l" : "law",
      "n" : "explain",
      "x" : "solve for x",
      "xy" : "simultaneous equation",
      "wp" : "word problem",
      "fx" : "functions",
      "sf" : "subject of the formula",
      "s" : "simplify",
      "e" : "exponents",
      "G10" : "Grade 10",
      "G11" : "Grade 11",
      "G12" : "Grade 12",
      "P" : "Physics",
      "C" : "Chemistry",
      "M" : "Mathematics"
    }
  }

const decompress = (data, metadata) => {
    const entry = {}
    Object.entries(data).forEach(d => {
        entry[metadata.card[d[0]]] = metadata.content[d[1]] || d[1]
    })
    return entry
}

const temp = []
const createDb = (name = null) => {
    if(!name) return console.log("Db name needed!")
    console.log("create db => ", name)
    localStorage.setItem(app.name, JSON.stringify(app))

    data.terms.forEach(d => addQuizz(d))
}
const saveQuizz = (quizz) => {
    if(!getDb()) {
        createDb(app.name)
    }
    
    let appDb = JSON.parse(localStorage.getItem(app.name))
    
    if(appDb?.quizzes.find(q => 
        q.f == quizz.f && 
        q.b == quizz.b)
    ){
        return
    }
    
    appDb.quizzes.push(quizz)
    console.log(appDb.quizzes)
    
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
    cardQuestion.innerText = quizz.f
    cardAnswer.innerText = quizz.b
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
    if(timer) clearInterval(timer)
}
const handleNext = () => {
    cardInner.style = "transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg);"
    if(!getDb().quizzes.length) return
    const quizz = generateQuizz()
    display(quizzes[quizzes.length - 1])
    stopwatch()
}
const toggleMode = () =>{
    if(getMode() == "DASHBOARD"){
        setMode("HOME")
    } else {
        setMode("DASHBOARD") 
    }
}
const setMode = (mode) => {
    if(modes.indexOf(mode) > -1){
        return pages.mode = mode
    }

    return console.log("Unknown Mode : ", mode)
}
const getMode = () => {
    return pages.mode
}
const setCurrPage = (page) => {
    return pages.currentPage = page.element
}
const getCurrPage = () => {
    return pages.currentPage
}
const clearInputs = () => {
    quizzFront.value = ""
    quizzBack.value = ""
}
const populateInputs = (quizz) => {
    console.log(quizz)
    quizzFront.value = quizz.question
    quizzBack.value = quizz.answer
}
const handleAddQuizz = () => {
    const s = sanitizeText(sanitizeHTML(subjectEl.options[subjectEl.selectedIndex].text))
    const t = sanitizeText(sanitizeHTML(typeEl.options[typeEl.selectedIndex].text))
    const f = sanitizeText(sanitizeHTML(quizzFront.value))
    const b = sanitizeText(sanitizeHTML(quizzBack.value))
    
    if(!f || !b) return

    addQuizz({f, b, s, t, c : "all", l : "all"})
    db = getDb()
    refreshList()
    clearInputs()
}
const handleEdit = (id) => {
    routeTo("ADD_CARD")
    const quizz = db.quizzes[getQuizzIndex(id)]

    populateInputs(quizz)
    removeQuizz(id)
}
const handleDelete = (id) => {
    const delQuizz = removeQuizz(id)
}
const createItem = (data) => {
    return `<li class="card-list-item" data-id="${data.id}">
                <div class="card-content-front">
                    <p class="content-front">${data.f}</p>
                </div>
                <div class="card-content-back">
                    <p class="content-back">${data.b}</p>
                </div>
                <div class="card-action">
                    <button class="control-btn delete" onclick="handleDelete(${data.id})">delete</button>
                    <button class="control-btn edit"  onclick="handleEdit(${data.id})">edit card</button>
                </div>
            </li>`
}

// TODO : add pagination
const loadQuizzes = () => {
    for(let i = 0; i < 50; i++){
        quizzes.push(db.quizzes[i])
    }
}
const refreshList = () =>{
    const db = getDb()

    quizzList.innerHTML = ""
    loadQuizzes()
    for(let i = 0; i < 50; i++){
        quizzList.innerHTML += createItem(quizzes[i])
    }
}

const handleClearAll = () => {
    app.quizzes = []

    localStorage.setItem(app.name, JSON.stringify(app))
    refreshList()
}
const handleDashboard = () => {
    routeTo("CARD_LIST")
    setMode("CARD_LIST")
}
const handleHome = () => {
        setMode("HOME")
        dashboard.style.display = "none"
        dashboard.style.zIndex = -1000000
}
const routeTo = (mode) => {
    setMode(mode)

    renderMain()
}
const renderMain = () => {
    getCurrPage().style.zIndex = "0"
    getCurrPage().style.display = "none"
    pages.pageList[getMode()].element.style.zIndex = "10"
    pages.pageList[getMode()].element.style.display = getMode() == "PLAY_CARDS" ? "flex" : getMode() == "ADD_CARD" ? "grid" : "block"
    setCurrPage(pages.pageList[getMode()])

    footerActionBtns[0].innerText = pages.pageList[getMode()].leftAction.name
    footerActionBtns[1].innerText = pages.pageList[getMode()].rightAction.name
    appTitle.innerText = pages.pageList[getMode()].title
}
const handleLeftAction = () => {
    pages.pageList[getMode()].leftAction.func()
}
const handleRightAction = () => {
    pages.pageList[getMode()].rightAction.func()
}
const initialize = () => {
    data.terms.forEach((term) => {
        addQuizz(term)
    })
}
if(getDb().quizzes.length < 100){
    console.log("initializing")
    initialize()
}
let timer = null
const stopwatch = () => {
    clearInterval(timer)
    let counter = 3
    track.style.width = counter + "%"
    timer = setInterval(() => {
        if(counter >=90){
            handleNext()
            counter = 3
            if(app.quizzMode !== "LOOP_ALL"){
                clearInterval(timer)
            }
        }
        counter += 10
        track.style.width = counter + "%"
    }, 1000 * 1.5)
}

routeTo("ADD_CARD")
routeTo("CARD_LIST")
routeTo("PLAY_CARDS")

refreshList()