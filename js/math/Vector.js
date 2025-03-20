class Vector{
    constructor(x, y){
            this.x = x
            this.y = y
    }
    
    add({ x, y }){
            return new Vector(this.x + x, this.y + y)
    }
    
    sub({ x, y }){
            return new Vector(this.x - x, this.y - y)
    }
    
    scale(s){
            return new Vector(this.x * s, this.y * s)
    }
    
    distance(tail = new Vector(0, 0)){
            const diff = this.sub(tail)

            return Math.hypot(diff.x, diff.y)
    }

    direction(){
            return Math.atan2(this.y, this.x)
    }

    normal(){
            const dis = this.distance()

            if(dis === 0){
                    return new Vector(0, 0)
            } else {
                    return new Vector(this.x / dis, this.y / dis)
            }                
    }

    rotate(angle){
            const dis = this.distance()
            const dir = this.direction() + angle
            
            return new Vector(dis * Math.cos(dir), dis * Math.sin(dir))
    }
}