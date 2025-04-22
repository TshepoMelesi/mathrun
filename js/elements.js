const setAttribs = (elem, options) => {
    if(!options) return
    
    for(let i = 0; i < options.length; i += 2){
        if(options[i] === "innerText"){
            elem.innerText = options[i + 1]
        } else if(options[i] === "textContent"){
            elem.textContent = options[i + 1]
        }else{
            elem.setAttribute(options[i], options[i + 1])
        }
    }
    return elem
} 

const createElem = (type, options = null, parent = null) => {
    const elem = document.createElement(type)
    
    setAttribs(elem, options)
    if(parent) childToParent([elem], parent)
    
    return elem    
}

const childToParent = (children, parent) => {
    children.forEach(child => parent.appendChild(child))

    return parent
}
