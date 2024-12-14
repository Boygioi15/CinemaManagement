import { AgeRestrictionModel, TicketTypeModel } from "./param.schema.js";

export class ParamService {
  static createAgeRestriction = async (ageResData) => {
    return await AgeRestrictionModel.create(ageResData);
  };
  static updateAgeRestriction = async (id, ageResData) => {
    return await AgeRestrictionModel.findByIdAndUpdate(id, ageResData, {
      new: true,
    });
  };
  static getAgeRestrictionID = async (id) => {
    return await AgeRestrictionModel.findById(id);
  };
  static deleteAgeRestriction = async (id) => {
    return await AgeRestrictionModel.findByIdAndDelete(id);
  };

  static createTicketType = async (ticketTypeData) => {
    return await TicketTypeModel.create(ticketTypeData);
  };
  static updateTicketType = async (id, ticketTypeData) => {
    return await TicketTypeModel.findByIdAndUpdate(id, ticketTypeData, {
      new: true,
    });
  };
  static getTicketType = async () => {
    return await TicketTypeModel.find();
  };
  static deleteTicketType = async (id) => {
    return await TicketTypeModel.findByIdAndDelete(id);
  };
}
