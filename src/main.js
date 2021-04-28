import axios from "axios";
import mongoose from "mongoose";

import { fetchRss, asyncForEach } from "./utils";
import config from "../config.json";
import RssGUID from "./models/RssGUID";

export default async function main() {

    const parsedRSS = await fetchRss();

    const items = parsedRSS.rss.channel[0].item;

    const embeds = [];

    await asyncForEach(items, async anItem => {
        const hasAlreadyBeenPosted = await RssGUID.exists({
            guid: anItem.link[0]
        });

        if (embeds.length < 10 && !hasAlreadyBeenPosted) {
            embeds.push({
                title: anItem.title[0],
                description: anItem.description[0],
                image: {
                    url: anItem.enclosure[0].$.url
                },
                url: anItem.link[0],
                timestamp: new Date(anItem.pubDate[0])
            });

            
            // const guid = new RssGUID({
            //     guid: anItem.link[0]
            // });

            // guid.save();

        }
    });

    console.log(await RssGUID.countDocuments())
    // items.forEach(async anItem => {
    //     const hasAlreadyBeenPosted = await RssGUID.exists({
    //         guid: anItem.link[0]
    //     });

    //     if (embeds.length < 10 && !hasAlreadyBeenPosted) {
    //         embeds.push({
    //             title: anItem.title[0],
    //             description: anItem.description[0],
    //             image: {
    //                 url: anItem.enclosure[0].$.url
    //             },
    //             url: anItem.link[0],
    //             timestamp: new Date(anItem.pubDate[0])
    //         });

    //         console.log(embeds)
    //         // const guid = new RssGUID({
    //         //     guid: anItem.link[0]
    //         // });

    //         // guid.save();

    //     }
    // })


    // axios.post(config["discord-webhook"], {
    //     embeds: embeds.reverse()
    // }).catch(err => {
    //     console.log(err)
    // })

}