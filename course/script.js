const sectionList = document.querySelector(".course-content-container")
const videoEl = document.querySelector(".video")
let currentVideoIdx;

const getSection = () => {
    const videoId = sessionStorage.getItem("asm-video-id")
    const courseData = courseList.find((course) => course.id === videoId)
    return courseData
}

videoEl.addEventListener("ended", () => {
    console.log("Video Ended")
    unlockNextSection(currentVideoIdx)
})

const playVideo = (videoURL) => {
    videoEl.src = videoURL
    console.log("Playing : " + videoURL)
    videoEl.play()
}

const handlePlaySection = (video) => {
    if(!video) return
    const url = "./video/" + video
    console.log("loading : " + url)
    playVideo(url)
}

const addBooks = (section, resources) => {
    if(section.books.length){
        const li = createElem("li", ["class", "resource-item"], resources)
        const resourceBook = createElem("button", ["innerText", section.books[0], "class", "resource book"], li)

    }
}

const addQuizzes = (section, resources) => {
    if(section.quizz.length){
        const li = createElem("li", ["class", "resource-item"], resources)
        const resourceQuizz = createElem("button", ["innerText", "Quizz Box", "class", "resource quizz"], li)
    }
}

const createSection = (section, sectionList) => {
    const li = createElem("li", ["class", "course-content"], sectionList)
    const detail = createElem("details", ["class", "course-content-details"], li)
    const summary = createElem("summary", ["innerText", section.title, "class", "content-title-summary"], detail)
    const span =  createElem("span", [], summary)
    const play =  createElem("button", ["class", "play-btn", "onclick", `handlePlaySection(handlePlaySection("${section.video}"))`, "innerText", "Play"], span)
    const resources = createElem("ul", ["class", "resources"], detail)

    return resources
}

const populateSections = (sections) => {
    const header = createElem("li", ["class", "course-content"], sectionList)
    const title = createElem("h3", ["innerText", "Course Sections", "class", "course-content"], header)

    sections.forEach((section) => {
        const createdSection = createSection(section, sectionList)

        addBooks(section, createdSection)
        addQuizzes(section,  createdSection)
    })
}

const loadCourse = () => {
    courseData = getSection()

    if(!courseData) return console.log("cannot find a video to play, please go to the course list and choose a video.")

    populateSections(courseData.sections)
}

loadCourse()