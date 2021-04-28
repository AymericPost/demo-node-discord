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
