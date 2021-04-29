import axios from "axios";
import mongoose from "mongoose";

import { fetchRss, asyncForEach, asyncWhileEach } from "./utils";
import config from "../config.json";
import RssGUID from "./models/RssGUID";

export default async function main() {

    const parsedRSS = await fetchRss();

    const items = parsedRSS.rss.channel[0].item.reverse();

    const embeds = [];

    await asyncForEach(items, async anItem => {
        const hasAlreadyBeenPosted = await RssGUID.exists({
            guid: anItem.link[0]
        });

        if (!hasAlreadyBeenPosted) {
            embeds.push({
                title: anItem.title[0],
                description: anItem.description[0],
                image: {
                    url: anItem.enclosure[0].$.url
                },
                url: anItem.link[0],
                timestamp: new Date(anItem.pubDate[0])
            });
        }
    });

    asyncWhileEach(embeds, async embed => {
        return await (new Promise((resolve, reject) => {
            setTimeout(() => {
                axios
                    .post(config["discord-webhook"], {
                        embeds: [embed]
                    })
                    .then(async () => {
                        const guid = new RssGUID({
                            guid: embed.url
                        });

                        resolve(await guid.save());
                    })
                    .catch(err => {
                        reject(err)
                    })
            }, 1000);
        }));
    })
    .catch(err => {
        console.error(err);
    })
    .finally(() => {
        mongoose.connection.close();
    });
}
