import mongoose, {
    Schema
} from "mongoose";

const additionalItemSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    thumbnailURL: {
        type: String,
        required: true
    },
    inStorage: {
        type: Number,
        required: true
    },
    deleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const additionalItemModel = mongoose.model("additionalItems", additionalItemSchema);
export default additionalItemModel;