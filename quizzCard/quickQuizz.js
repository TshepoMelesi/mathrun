const width = window.innerWidth
const height = window.innerHeight
const search = document.querySelector(".search")
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
const filterCards = document.querySelector(".filter-cards")
const infoSubject = document.querySelector(".info-subject")
const tempCards = [] // for prev and next cards
let tempCardEdit= []


const modes = ["ADD_CARD", "CARD_LIST", "PLAY_CARDS", "HOME"]
const pages = {
    currentPage : playCardPage,
    mode : "CARD",
    pageList : {
        "ADD_CARD": {
            title : "add new card",
            element : addCardPage,
            "leftAction" : {func : () => handleDashboard(), name : "view cards"},
            "rightAction" : {func : () => handleAddCard(), name : "save card"},
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
const addCard = (card) => {
    const id = card.id || generateId()
    // const quizz = {question, answer, id, subject, type, level, curriculum}
    saveCard(
        {
            id,
            s : card.s,
            f : card.f,
            l : card.l,
            c : card.c,
            b : card.b,
            t : card.t
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



//===================================================================
// HANDLE DATABASE ==================================================
//===================================================================

const saveCard = (card) => {
    const db = getDb()
    if(!db) createDb(app.name)

    if(db?.cards.find(q =>  q.f === card.f && q.b === card.b)){  
        return console.log("There is a duplicate")
    }

    if(tempCardEdit.length){
        // remove the existing card
        removeCard(card.id, db)

        clearInputs()
        tempCardEdit = []
    }
    
    // add a new or edited card
    db.cards.push(card)
    
    saveDb(db)
    refreshList()
}
const getCardIndex = (id) =>{
    return getDb().cards.findIndex(q => q.id === id)
}
const removeCard = (id, db) => {
    const cardIdx = getCardIndex(id)
    const delCard = db.cards.splice(cardIdx, 1)
    saveDb(db)
    refreshList()

    return delCard
}
const generateCard = () => {
    const db = getDb()

    if(!db.cards.length) return false

    return db.cards[Math.floor(Math.random() * db.cards.length)]
}
const display = (card) => {
    cardQuestion.innerText = card.f
    cardAnswer.innerText = card.b
}

// HANDLES OF THE APP ========================================
const handlePrev = () => {
    if(tempCards.length <1) return
    cardInner.style = "transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg);"

    tempCards.pop()
    const prevCard = tempCards[tempCards.length - 1]

    if(!prevCard) return false
    display(prevCard)
}
const handleFlip = () => {
    cardInner.style = "transform: rotateX(180deg) rotateY(0deg) rotateZ(180deg);"
    if(timer) clearInterval(timer)
}
const handleNext = () => {
    const db = getDb()
    cardInner.style = "transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg);"
    if(!listToShow.length) return
    const card = listToShow[Math.floor(Math.random() * listToShow.length)]
    display(card)
    tempCards.push(card)
    stopwatch()
}
const handleAddCard = () => {
    if(tempCardEdit.length){ // we currently have a card we are editing
        tempCardEdit[0].f = sanitizeText(sanitizeHTML(quizzFront.value))
        tempCardEdit[0].b = sanitizeText(sanitizeHTML(quizzBack.value))

        addCard(tempCardEdit[0])
        return
    }
    const s = sanitizeText(sanitizeHTML(subjectEl.options[subjectEl.selectedIndex].text))
    const t = sanitizeText(sanitizeHTML(typeEl.options[typeEl.selectedIndex].text))
    const f = sanitizeText(sanitizeHTML(quizzFront.value))
    const b = sanitizeText(sanitizeHTML(quizzBack.value))
    if(!f || !b) return

    addCard({f, b, s, t, c : "all", l : "all"})
    refreshList()
    clearInputs()
}
const handleEdit = (id) => {
    const db = getDb()
    const card = db.cards[getCardIndex(id)]
    tempCardEdit[0] = card
    routeTo("ADD_CARD")
    populateInputs(card)
    // removeCard(id)
}
const handleDelete = (id) => {
    const delCard = removeCard(id, getDb())
}
const handleClearAll = () => {
    app.cards = []
    listToShow = []

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
const handleLeftAction = () => {
    pages.pageList[getMode()].leftAction.func()
}
const handleRightAction = () => {
    pages.pageList[getMode()].rightAction.func()
}

// ============================================================

//===================================================================
// HANDLE FILTERING =================================================
//===================================================================
let listToShow = getDb()?.cards
let searchText = ""
let selectedFilter = ""
const filteringCards = () => {
    const filtered = getDb().cards.filter(card => card.s.toLowerCase().includes(selectedFilter.toLowerCase()))
    listToShow = filtered.filter(card => card.f.toLowerCase().includes(searchText.toLowerCase()))
    refreshList()
}
search.oninput = event => {
    searchText = event.target.value

    filteringCards(selectedFilter, searchText)
}

infoSubject.onchange = (event) => {
    console.log(event.target.value, listToShow)
    selectedFilter = event.target.value == "All cards" ? "" : event.target.value
    filteringCards(selectedFilter, searchText)
    refreshList()
}

filterCards.onchange = (event) => {
    selectedFilter = event.target.value == "Filter Cards" ? "" : event.target.value 
    console.log(selectedFilter, listToShow)
    searchText = ""
    filteringCards()
}

// HANDLING APP MODE ==========================================
// manages the app's current page
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

// HANDLE INPUTS ===============================================
const clearInputs = () => {
    quizzFront.value = ""
    quizzBack.value = ""
}
const populateInputs = (card) => {
    quizzFront.value = card.f
    quizzBack.value = card.b
}


// HANDLES CARD DISPLAYS ======================================
const createItem = (card) => {
    if(!card.id) return
    return `<li class="card-list-item" data-id="${card.id}">
                <div class="card-content-front">
                    <p class="content-front">${card.f}</p>
                </div>
                <div class="card-content-back">
                    <p class="content-back">${card.b}</p>
                </div>
                <div class="card-action">
                    <button class="control-btn delete" onclick="handleDelete(${card.id})">delete</button>
                    <button class="control-btn edit"  onclick="handleEdit(${card.id})">edit card</button>
                </div>
            </li>`
}

const refreshList = () =>{
    const db = getDb()

    if(!db) return false
    quizzList.innerHTML = ""

    if(searchText.length || listToShow.length || selectedFilter.length){
        listToShow.forEach(card => {
            quizzList.innerHTML += createItem(card)
        })
    } else{
        db.cards.forEach(card => {
            quizzList.innerHTML += createItem(card)
        })
    }
}
const routeTo = (mode) => {
    searchText = ""
    selectedFilter = ""
    filteringCards()
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



// HANDLE PLAY ======================================================
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


/**
 * HANDLING THE DATABASE
 * this database will only hold cards the user creates or added
 * from the Library
 */

// CREATE CARD
// DELETE CARD
// UPDATE CARD
// READ CARD
