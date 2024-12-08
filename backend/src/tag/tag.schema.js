import mongoose from "mongoose";

const tagSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        unique: true
    },
    description: {
        type: String,
    },

}, {
    timestamps: true,
});

const tagModel = mongoose.model("tags", tagSchema);
export default tagModel;