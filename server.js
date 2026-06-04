const express = require("express")
const data = require('./data.json')
const rateLimit = require('express-rate-limit')
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100, 
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true, 
    legacyHeaders: false, 
})
const app = express()
function shuffle(arr){
    const shuffled = [...arr]
    for(let i = shuffled.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * (i + 1))
        [shuffled[i],shuffled[j]] = [shuffled[j],shuffled[i]]
    }
    return shuffled
}
app.get('/get',(req,res)=>{
    let {element,path,rarity,amount,random,faction,startVersion,endVersion} = req.query
    element = element === undefined ? 'all' : element
    path = path === undefined ? 'all' : path
    rarity = rarity === undefined ? 'all': rarity
    amount = amount === undefined ? Object.keys(data).length : amount
    random = random === undefined ? 'false' : random
    startVersion = startVersion === undefined ? 1.0 : startVersion
    endVersion = endVersion === undefined ? 100 : endVersion
    let returnData = []
    let tmp = []
    if(element !== 'all'){
        for(let key in data){
            if(data[key].element === element){returnData.push(key)}
        }
    } else {returnData = Object.keys(data)}
    if(path !== 'all'){
        for(let i = 0; i < returnData.length; i++){
            if(data[returnData[i]].path === path){tmp.push(returnData[i])}
        }
    } else {tmp = returnData; returnData = []}
    
    if(rarity !== 'all'){
        for(let i = 0; i < tmp.length; i++){
            if(data[tmp[i]].rarity === rarity){returnData.push(tmp[i])}
        }
    } else {returnData = tmp; tmp = []}
    for(let i = 0; i < returnData.length; i++){
        if(data[returnData[i]].version >= startVersion && data[returnData[i]].version <= endVersion){tmp.push(returnData[i])}
    }
    returnData = tmp
    if(random === true){returnData = shuffle(returnData)}
    return res.json(returnData.slice(0,amount))
})
app.listen(8080)