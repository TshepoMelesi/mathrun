class Components {
    constructor(graphics = []){
          this.graphics = graphics  
    }

    addComponent(component, size){
            this.graphics.push(component)
    }

    draw(context){
            this.graphics.forEach(items => {
                    items.draw(context)
            })
    }
}