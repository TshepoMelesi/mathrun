const app = {
    name : "asm-app", 
    cards : [],
    notes : [{category: "misc", notes : [{id: 1, title:"Test title",body:"Test body"}]}],
    quizzMode : "LOOP_ALL",
}

// create empty database initially.
const createDb = (name = null) => {
    if(!name) return console.log("Db name needed!")
    console.log("create db => ", name)
    localStorage.setItem(app.name, JSON.stringify(app))
}

// GET THE DATABASE
const getDb = () => {
    const db = localStorage.getItem(app.name)

    if(!db) {
        createDb(app.name)
        console.log("Just set a localStorage DB")
    }
    return JSON.parse(localStorage.getItem(app.name))
}

const saveDb = (appData) => {
    localStorage.setItem(app.name, JSON.stringify(appData))
}