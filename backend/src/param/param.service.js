import {
  AgeRestrictionModel,
  ParamModel,
  TicketTypeModel
} from "./param.schema.js";

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
  static getAllAgeRestriction = async () => {
    return await AgeRestrictionModel.find();
  };
  static deleteAgeRestriction = async (id) => {
    return await AgeRestrictionModel.findByIdAndDelete(id);
  };

  static createTicketType = async (ticketTypeData) => {
    const { price } = ticketTypeData;
    if (price <= 0) {
      throw customError("Giá cho loại vé phải là một số nguyên không âm", 400);
    }
    return await TicketTypeModel.create(ticketTypeData);
  };
  static updateTicketType = async (id, ticketTypeData) => {
    const { price } = ticketTypeData;
    if (price <= 0) {
      throw customError("Giá cho loại vé phải là một số nguyên không âm", 400);
    }
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
            loyalPointRate: ticketDetail.loyalPointRate,
          };
        })
      );

      return ticketDetails;
    } catch (error) {
      throw new Error(error.message);
    }
  };



  static getParams = async () => {
    const params = await ParamModel.findOne();
    return params;
  };

  static updateParams = async (data) => {
    const params = await ParamModel.findOneAndUpdate({}, data, {
      new: true,
      upsert: true,
    });
    return params;
  };

}