// 3 MAIN BUTTONS
const prevBtn = document.querySelector(".prev-btn")
const revealBtn = document.querySelector(".reveal-btn")
const nextBtn = document.querySelector(".next-btn")

const handlePrev = () => {
    console.log("prev pressed")
}
prevBtn.ontouchstart = () => handlePrev()
// prevBtn.onmousedown = () => handlePrev()



const handleReveal = () => {
    console.log("reveal pressed")
}
revealBtn.ontouchstart = () => handleReveal()
// revealBtn.onmousedown = () => handleReveal()
