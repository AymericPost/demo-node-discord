import mongoose from "mongoose";

import main from "./main";

mongoose.connect(
    "mongodb://localhost/web",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    },
    async err => {
        if(err) {
            console.error(err);
            process.exit(1);
        } else {
            console.log("Connexion to database established.");

            await main();

            // mongoose.connection.close();
        }
    }
)

