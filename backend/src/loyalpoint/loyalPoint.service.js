import loyalPointModel from "./loyalPoint.schema.js";

class LoyalPointService {
    static getLoyalPoint = async (customerId) => {
        try {
            const loyalPoint = await loyalPointModel.findOne({
                customerRef: customerId,
            });
            return loyalPoint;
        } catch (error) {
            throw new Error(`Error getting loyal points: ${error.message}`);
        }
    };

    static resetLoyalPoint = async (customerId, newPointValue) => {
        try {
            const updatedLoyalPoint = await loyalPointModel.findOneAndUpdate({
                customerRef: customerId
            }, {
                currentLoyalPoint: newPointValue
            }, {
                new: true,
                upsert: true
            });
            return updatedLoyalPoint;
        } catch (error) {
            throw new Error(`Error resetting loyal points: ${error.message}`);
        }
    };

    static addLoyalPoint = async (customerId, pointsToAdd) => {
        try {
            const updatedLoyalPoint = await loyalPointModel.findOneAndUpdate({
                customerRef: customerId
            }, {
                $inc: {
                    currentLoyalPoint: pointsToAdd
                }
            }, {
                new: true,
                upsert: true
            });
            return updatedLoyalPoint;
        } catch (error) {
            throw new Error(`Error adding loyal points: ${error.message}`);
        }
    };
}

export default LoyalPointService;