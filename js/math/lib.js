const random = (max = 1, min = 0) => {
    return Math.round(Math.random() * (max - min) + min)
}

const getOperator = (pref = "random") => {
    const ops = {
        "random" : ["x", "+", "-", "/"][random(3, 0)],
        "addition" : "+",
        "subtraction" : "-",
        "multiplication" : "x",
    }

    return ops[pref]? ops[pref] : ops.random
}