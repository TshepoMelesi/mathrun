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
const categoryEl = document.querySelector(".category")
const addCategoryEl = document.querySelector(".add-category")
const addCategoryBtn = document.querySelector(".add-category-btn")
const confirm = document.querySelector(".confirm")
const confirmTitle = document.querySelector(".confirm-title")
const confirmText = document.querySelector(".confirm-text")
const confirmActions = document.querySelector(".confirm-actions")

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
const sanitizeText = (input, flag = false) => {
    if(!flag) return input.trim().replace(/[^a-zA-Z0-9 .,!?-]/g, "")

    return input
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
const getNoteById = (id, db) => {
    let searchedNote = null

    db.notes.forEach(category => {
        category.notes.forEach(note=> {
            if(note.id === id) searchedNote = note
        })
    })

    return searchedNote
}
const addNoteToDb = () => {
    const db = getDb()

    const noteTitle = sanitizeText(noteTitleEl.value.trim())
    const noteBody = sanitizeText(noteBodyEl.value.trim(), true)
    const noteCategory = sanitizeText(categoryEl.value)

    if(tempNote){
        // WE ARE EDITING EXISTING NOTE
        const note = getNoteById(tempNote.id, db)

        if(!note) return alert("Cannot edit this note.")
        
        note.title = noteTitle
        note.body = noteBody
        note.categoryName = noteCategory

        saveDb(db)
        return handleRead(db.notes.findIndex(cat => cat.category === note.categoryName), note.id)
    }
    
    if(!noteBody){
        alert("Add something in the body.")
        return false
    }
    
    const categoryIdx = db.notes.findIndex(cat => cat.category === noteCategory)

    if(categoryIdx < 0) return alert("This category cannot be found!")
    const date = new Date()
    const note = {
        categoryName : noteCategory,
        id: generateId(999999999, 11111), 
        title:noteTitle || "Untitled-" + date.getDay() + "-" + (date.getMonth() + 1) + "-" + (date.getFullYear()),
        body:noteBody
    }
    db.notes[categoryIdx].notes.push(note)
    saveDb(db)

    return note
}
//===================================================================
// LIST CATEGORIES ==================================================
//===================================================================
const listCategories = () => {
    notesListContainer.innerHTML = ""
    categoryEl.innerHTML = ""

    const db = getDb()
    const categories = db.notes

    categories.forEach((category, categoryIdx) => {
        const categoryOption = createElem(
            "option",
            ["innerText", category.category],
            categoryEl
        )
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
        const addNoteBtn = createElem(
            "button",
            ["class", "hovering-addNoteBtn", "innerText", "add note"], 
            details
        )

        addNoteBtn.onclick = () => {
            routeTo("ADD_PAGE")
            handleAdd()
            categoryEl.value = category.category
        }

        category.notes.forEach(note => {
            const item = createElem(
                "li",
                ["class", "note-item", "href", "#"],
                notes
            )
            const title = createElem(
                "h3", 
                ["class", "notes-title", "innerText", note.title],
                item
            )
            const actionsContainer = createElem(
                "div",
                ["class", "actions"],
                item
            )
            const editBtn = createElem(
                "button",
                ["class", "timestamp", "innerText", "edit"],
                actionsContainer
            )
            const deleteBtn = createElem(
                "button",
                ["class", "timestamp", "innerText", "delete"],
                actionsContainer
            )
            deleteBtn.onclick = (event) => {
                event.stopPropagation()
                handleDelete(categoryIdx, note.id)
            }
            editBtn.onclick = (event) => {
                event.stopPropagation()
                handleEdit(note)
            }
            item.onclick = () => handleRead(categoryIdx, note.id)
        })
    })
}

const addCategory = () => {
    const input = sanitizeText(addCategoryEl.value)

    if(input.length < 1) return alert("Write something")

    const db = getDb()

    if(!db) return alert("Please reload this application. I cant find your DB.")

    const category = {}
    category.notes = []
    category.category = input

    db.notes.push(category)

    saveDb(db)

    listCategories()
}
//===================================================================
// POPULATE READ PAGE ===============================================
//===================================================================
const populateReadPage = (note) => {
    if(!note) return alert("Cannot read this note.")
    readNoteTitleEl.innerText = note.title 
    readNoteBodyEl.innerText = note.body
}
//===================================================================
// POPULATE ADD PAGE ===============================================
//===================================================================
const populateAddPage = (note) => {
    noteTitleEl.value = note.title
    noteBodyEl.value = note.body
}
const clearAddPage = () => {
    noteTitleEl.value = ""
    noteBodyEl.value = ""
}
//===================================================================
// HANDLE CONFIRM ACTIONS ===========================================
//===================================================================
const cancelConfirmation = () => {
    // confirm.style.left = "100%"
}
const setConfirmation = (text, callback) => {
    confirmActions.innerHTML = ""
    confirm.style.left = 0;
    confirmTitle.innerText = text[0]
    confirmText.innerText = text[1]

    const deleteBtn = createElem(
        "button", 
        [
            "class", "confirm-btn delete", 
            "onclick", () => {
                callback()
                confirm.style.left = "100%"
            }, 
            "innerText", "delete"
        ], 
        confirmActions
    )
    const cancelBtn = createElem(
        "button", 
        [
            "class", "confirm-btn cancel", 
            "onclick", () => {
                cancelConfirmation()
                confirm.style.left = "100%"
            }, 
            "innerText", "cancel"
        ], 
        confirmActions
    )
}
//===================================================================
// HANDLE ACTIONS ===================================================
//===================================================================
const handleEdit = (note = null) => {
    universal.style.display = "none"
    if(note){
        tempNote = note
    }
    if(!tempNote) return alert("Cannot handle the requested edit.")

    populateAddPage(tempNote)
    routeTo("ADD_PAGE")
}
const handleAdd = () => {
    universal.style.display = "none"
    tempNote = null
    clearAddPage()
    routeTo("ADD_PAGE")
}
const handleDelete = (categoryIdx, id) => {
    const db = getDb()
    let dbNotes = db.notes[categoryIdx].notes
    const filteredNotes = dbNotes.filter(note => note.id !== id)
    // set confirmation here
    setConfirmation(
        ["Delete Note", "Are you sure you want to delete this note?"],
        function (){
            db.notes[categoryIdx].notes = filteredNotes
            saveDb(db)
            routeTo("NOTES_PAGE")
        }
    )
    cancelConfirmation()
}
const handleRead = (categoryIdx, id) => {
    const db = getDb()
    if(!db.notes[categoryIdx].notes){
        return alert("Requested note doesnt exist")
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
    const db = getDb()
    setConfirmation(
        ["Delete All Notes", "Are you sure you want to wipe your notePad?"],
        () => {
            db.notes = [{category : "misc", notes : []}]
            saveDb(db)
            routeTo("NOTES_PAGE")
        }
    )
}
const handleSelect = () => {

}
const handleNotes = () => {
    listCategories()
    routeTo("NOTES_PAGE")
}

addNote.addEventListener("click", event => handleAdd())

addCategoryBtn.onclick = () => addCategory()

//===================================================================
// HANDLE BUTTONS ===================================================
//===================================================================
const handleLeftAction = () => {
    pages.pageList[pages.currentPage].leftAction.func()
}
const handleRightAction = () => {
    pages.pageList[pages.currentPage].rightAction.func()
}
routeTo("NOTES_PAGE")