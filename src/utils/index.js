import axios from "axios";
import  { Parser as XmlParser } from "xml2js";

import config from "../../config.json"

export async function fetchRss() {
    return await axios.get(config["rss-feed"])
    .then(resp => {
        return new Promise((resolve, reject) => {
            (new XmlParser()).parseString(resp.data, (err, data) => {
                if(err) {
                    reject(err);
                }
                
                resolve(data);
            })
        })
    })
}

export async function asyncForEach(array, cb) {
    for( let i = 0 ; i < array.length ; i++ ) {
        await cb(array[i]);
    }
}

export function asyncWhileEach(array, cb) {
    return new Promise( async (resolve, reject) => {
        const resultArray = [];
        let i = 0;

        if(!array[0])
            reject("Ceci n'est pas un tableau");

        while(true) {
            if(array[i]) {
                resultArray.push( 
                    await cb(array[i])
                    .catch(err => {
                        reject(err)
                    }) 
                );
                i++;
            } else {
                resolve(resultArray);
                break;
            }
        }
    });
}
