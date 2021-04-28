import { Schema, model } from "mongoose";

const RssGUIDSchema = new Schema({
    guid: {
        type: String,
        unique: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

export default model("RssGUID", RssGUIDSchema);