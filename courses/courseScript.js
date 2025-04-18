const cardList = document.querySelector(".course-list")
const createCard = (course) => {
    const card                  = createElem("div", ["class", "course-card", "data-id", course.id])
    const thumbnailContainer    = createElem("div", ["class", "thumbnail-container"], card)
    const thumbnail             = createElem("img", ["class", "thumbnail", "src", "../assets/thumbnails/thumbnail.png", "alt", "a thumbnail of a course"], thumbnailContainer)
    const infoContainer         = createElem("div", ["class", "info-container"], card)
    const courseTags            = createElem("div", ["class", "course-tags"], infoContainer) 
    const courseTitle           = createElem("h3",  ["class", "course-title", "innerText", course.title], infoContainer)
    const updateTime            = createElem("p", ["innerText", "Estimated duration: 4 hours", "class", "course-update-time"], infoContainer)
    const shortDescription      = createElem("p", ["innerText", course.shortDescription[0], "class", "course-short-description"], infoContainer)
    const courseAction          = createElem(
                                    "button", 
                                    [
                                        "href", "../course/course.html", 
                                        "onclick", `populateCoursePlayer("${course.id}", "${course.link}")`,  
                                        "class", "course-action", 
                                        "innerText", course.action
                                    ], infoContainer)

    if(!course.tags.length) course.tags.push("ALL")
        
    course.tags.forEach(tag => createElem("div", ["class", "tag", "innerText", tag], courseTags))

    return card
}

const populateCoursePlayer = (courseId, redirectLink) => {
    sessionStorage.setItem("asm-video-id", courseId)

    window.location.href = redirectLink
}

courseList.forEach(course => {
    const card = createCard(course)

    childToParent([card], cardList)
})