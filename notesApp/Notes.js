const main = document.querySelector(".app-main")
const notesListContainer = document.querySelector(".category-list-container")
const universal = document.querySelector(".universal")
const addNote = document.querySelector(".add-note")
const readPage = document.querySelector(".read")
const notesPage = document.querySelector(".home")
const addPage = document.querySelector(".add")
const footerActionBtns= document.querySelectorAll(".footer-action")
const appTitle = document.querySelector(".app-title")
const noteTitleEl = document.querySelector(".note-title")
const noteBodyEl = document.querySelector(".note-body")
const readNoteTitleEl = document.querySelector(".read-note-title")
const readNoteBodyEl = document.querySelector(".read-note-body")
let tempNote = null

const pages = {
    currentPage : "NOTES_PAGE",
    pageList : {
        "READ_PAGE": {
            title : "Your Notes (private)",
            element : readPage,
            "leftAction" : {
                func : () => handleEdit(), 
                name : "edit note"
            },
            "rightAction" : {
                func : () => handleNotes(), 
                name : "view notes"
            },
        },
        "ADD_PAGE": {
            title : "Add New Note",
            element : addPage,
            "leftAction" : {
                func : () => handleSaveNote(), 
                name : "save note"
            },
            "rightAction" : {
                func : () => handleNotes("ADD_CARD"), 
                name : "view notes"
            },
        },
        "NOTES_PAGE": {
            title : "Your Memory Line",
            element : notesPage,
            "leftAction" : {
                func : () => handleClearAll(), 
                name : "Clear All"
            },
            "rightAction" : {
                func : () => handleSelect(), 
                name : "Select Notes"
            },
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


//===================================================================
// HANDLE DATABASE =================================================
//===================================================================
let notes = []
if(getDb()){
    if(!getDb().notes){
        // create Note App collection
        const db = getDb()
        db["notes"] = [{category : "misc", notes : []}]
        saveDb(db)
    }else{
        notes = getDb()["notes"]
    }
} else{
    alert("Database doesn't exist. Please Refresh.")
}

//===================================================================
// HANDLE ROUTING ===================================================
//===================================================================
const pagesEls = Object.entries(pages).map(p => p[1])
const elems = Object.entries(pagesEls[1]).map(e => e[1].element)

const setPage = (page) => {
    pages.currentPage = page
    // hide all pages
    elems.forEach(e=> e.style.top = "100%")

    // show selected page
    pages.pageList[page].element.style.top = 0;
    pages.pageList[page].element.style.zIndex = "1000";
}
const routeTo = (page) => {
    if(page === "NOTES_PAGE"){
        universal.style.display = "grid"
        listCategories()
    }
    setPage(page)

    footerActionBtns[0].innerText = pages.pageList[page].leftAction.name
    footerActionBtns[1].innerText = pages.pageList[page].rightAction.name
}


//===================================================================
// HANDLE ADD NOTE ==================================================
//===================================================================
const addNoteToDb = () => {
    const noteTitle = sanitizeText(noteTitleEl.value.trim())
    const noteBody = sanitizeText(noteBodyEl.value.trim())
    
    if(!noteTitle || !noteBody) return false
    
    const db = getDb()
    const note = {
        id: generateId(999999999, 11111), 
        title:noteTitle,
        body:noteBody
    }
    db.notes[0].notes.push(note)
    saveDb(db)

    return true
}

//===================================================================
// LIST CATEGORIES =================================================
//===================================================================
const listCategories = () => {
    notesListContainer.innerHTML = ""

    const db = getDb()
    const categories = db.notes

    categories.forEach((category, categoryIdx) => {
        const details = createElem(
            "details", 
            ["class","category"], 
            notesListContainer
        )
        const summary = createElem(
            "summary", 
            ["class","category-title", "innerText", category["category"]],
            details
        )
        const notes = createElem(
            "ul",
            ["class","notes-list"],
            details
        )

        category.notes.forEach(note => {
            const item = createElem(
                "li",
                ["class", "note-item"],
                notes
            )
            const title = createElem(
                "h3", 
                ["class", "notes-title", "innerText", note.title],
                item
            )
            const action = createElem(
                "button",
                ["class", "timestamp", "innerText", "read"],
                item
            )
            action.onclick = () => handleRead(categoryIdx, note.id)
        })
    })
}

//===================================================================
// POPULATE READ PAGE ===============================================
//===================================================================
const populateReadPage = (note) => {
    readNoteTitleEl.innerText = note.title
    readNoteBodyEl.innerText = note.body
}

//===================================================================
// POPULATE ADD PAGE ===============================================
//===================================================================
const populateAddPage = (note) => {
    console.log(noteTitleEl)
    noteTitleEl.value = note.title
    noteBodyEl.value = note.body
}
const clearAddPage = () => {
    noteTitleEl.value = ""
    noteBodyEl.value = ""
}
//===================================================================
// HANDLE ACTIONS ===================================================
//===================================================================
const handleEdit = () => {
    if(!tempNote) return alert("Cannot handle the requested edit.")

    populateAddPage(tempNote)
    routeTo("ADD_PAGE")
}

const handleAdd = () => {
    clearAddPage()
    routeTo("ADD_PAGE")
}

const handleRead = (categoryIdx, id) => {
    const db = getDb()
    if(!db.notes[categoryIdx].notes){
        return console.log("Requested note doesnt exist")
    }else{
        tempNote = db.notes[categoryIdx].notes.find(note => note.id === id)
        populateReadPage(tempNote)
    }
    routeTo("READ_PAGE")
}
const handleSaveNote = () => {
    if(!addNoteToDb()) return
    routeTo("NOTES_PAGE")
}
const handleClearAll = () => {
    routeTo("NOTES_PAGE")
}
const handleSelect = () => {

}
const handleNotes = () => {
    listCategories()
    routeTo("NOTES_PAGE")
}

addNote.addEventListener("click", event => {
    handleAdd()
    universal.style.display = "none"
})
//===================================================================
// HANDLE BUTTONS =================================================
//===================================================================
const handleLeftAction = () => {
    pages.pageList[pages.currentPage].leftAction.func()
}

const handleRightAction = () => {
    pages.pageList[pages.currentPage].rightAction.func()
}


routeTo("NOTES_PAGE")