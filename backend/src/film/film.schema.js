import mongoose from "mongoose";

const filmSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    thumbnailURL: {
        type: String,
        required: true
    },
    trailerURL: {
        type: String
    },
    tagsRef: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "tags"
    }],
    filmDuration: {
        type: Number,
        required: true
    }, // Đơn vị: phút
    ageRestrictionRef: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    voice: {
        type: String,
        required: true
    }, // Ví dụ: lồng tiếng, phụ đề
    originatedCountry: {
        type: String,
        required: true
    }, // Ví dụ: VN, Hàn Quốc
    twoDthreeD: [{
        type: String
    }], // Ví dụ: 2D, 3D
    otherDescription: {
        type: String,
        required: true
    },
    filmDescription: {
        type: String,
        required: true
    },
    beginDate: {
        type: Date,
        required: true
    },
    deleted: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true,
});

const filmModel = mongoose.model("films", filmSchema);
export default filmModel;