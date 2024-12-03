import tagModel from "./tag.schema.js"

export class TagService {
    static createTag = async ({
        name,
        description
    }) => {
        return await tagModel.create({
            name,
            description
        })
    }
}