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
  static getAllAgeRestriction = async() =>{
    return await AgeRestrictionModel.find();
  }
  static deleteAgeRestriction = async (id) => {
    return await AgeRestrictionModel.findByIdAndDelete(id);
  };

  static createOrderType = async (ticketTypeData) => {
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

  static getTicketsInfo = async (tickets) => {
    try {
      const ticketDetails = await Promise.all(
        tickets.map(async (ticket) => {
          const ticketDetail = await TicketTypeModel.findById(ticket.id);
          if (!ticketDetail) {
            throw new Error(`Item with id ${ticket.id} not found`);
          }

          return {
            name: ticketDetail.title,
            quantity: ticket.quantity,
            unitPrice: ticketDetail.price.toString(),
          };
        })
      );

      return ticketDetails;
    } catch (error) {
      throw new Error(error.message);
    }
  };
}
