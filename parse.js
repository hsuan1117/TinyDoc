import * as fs from 'fs/promises';

function parser(text){
    let a = {}

    let headers = text.split('\n@').map(x=>x.split('\n#')[0]).map(x=>x.startsWith('@')?x:'@'+x)
    let bodies = [...text.matchAll(/###\n([\s\S]*)/g)].map(x=>x[1])
    console.log(bodies)

    headers.forEach(text=>{
        let result = [...text.matchAll((/@(.*)->([\s\S]*)/g))].map(x=>{
            // matching key
            // TODO: Fix when header doesn't have type
            return [...x[1].replace(/\s+$/, '').matchAll(/(.*)<(.*)>/g)].map(x=>[x[1],x[2]])
        }).flat()
        result.forEach(x=>{

            if(a.hasOwnProperty('attributes')){
                if(a.attributes.hasOwnProperty(x[0])){
                    if(Array.isArray(a.attributes[x[0]])){
                        a.attributes[x[0]].push(x[1])
                    } else {
                        a.attributes[x[0]] = [x[1]]
                    }
                } else {
                    a.attributes[x[0]] = x[1]
                }
            } else {
                a.attributes = {}
                a.attributes[x[0]] = x[1]
            }

        })
    })


    return a
}

export default function test(){
    fs.readFile('./demo.tinydoc').then(function (data) {
        console.log(parser(data.toString()))
    }).catch(err=>console.log(err.message))

}
