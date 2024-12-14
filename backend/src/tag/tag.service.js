import tagModel from "./tag.schema.js";

export class TagService {
  static createTag = async ({ name, description }) => {
    return await tagModel.create({
      name,
      description,
    });
  };
  static getAllTag = async () => {
    return await tagModel.find();
  };
  static async getTagName(tagId) {
    return await tagModel.findById(tagId).name;
  }
}
