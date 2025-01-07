import mongoose from "mongoose";

const orderSchemaV1 = new mongoose.Schema({
  verifyCode: {
    type: String,
  },
  filmName: {
    type: String,
    required: false,
  },
  ageRestriction: {
    type: String,
    required: false,
  },
  date: {
    type: String,
    required: false,
  },
  time: {
    type: String,
    required: false,
  },
  roomName: {
    type: String,
    required: false,
  },
  seatNames: [{
    type: String,
  }, ],
  totalMoney: {
    type: Number,
    required: true,
  },
  totalMoneyAfterDiscount: {
    type: Number,
    required: true,
  },
  tickets: [{
    name: {
      type: String,
      required: false,
    },
    quantity: {
      type: String,
      required: false,
    },
    unitPrice: {
      type: String,
      required: false,
    },
  }, ],
  items: [{
    name: {
      type: String,
      required: false,
    },
    quantity: {
      type: String,
      required: false,
    },
    unitPrice: {
      type: String,
      required: false,
    },
  }, ],
  customerID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  customerInfo: {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
  },
  online: {
    type: Boolean,
    default: true,
  },
  printed: {
    type: Boolean,
    default: false,
  },
  served: {
    type: Boolean,
    default: false,
  },
  invalidReason_Printed: {
    type: String,
    default: "",
  },
  invalidReason_Served: {
    type: String,
    default: "",
  },
  promotionID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "promotions",
  },
}, {
  timestamps: true,
});

const orderSchemaV2 = new mongoose.Schema({
  verifyCode: {
    type: String,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  totalPriceAfterDiscount: {
    type: Number,
    required: true,
  },
  customerInfo: {
    customerRef: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    }
  }
}, {
  timestamps: true,
});

const Orders_Data_FilmShow = new mongoose.Schema({
  orderRef: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  filmName: {
    type: String,
    required: false,
  },
  ageRestriction: {
    type: String,
    required: false,
  },
  showDate: {
    type: String,
    required: false,
  },
  showTime: {
    type: String,
    required: false,
  },
  roomName: {
    type: String,
    required: false,
  },
  seatNames: [{
    type: String,
  }, ],
  tickets: [{
    name: {
      type: String,
      required: false,
    },
    quantity: {
      type: String,
      required: false,
    },
    price: {
      type: String,
      required: false,
    },
  }, ]

}, {
  timestamps: true,
});

const Orders_Data_Items = new mongoose.Schema({
  orderRef: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  items: [{
    name: {
      type: String,
      required: false,
    },
    quantity: {
      type: String,
      required: false,
    },
    price: {
      type: String,
      required: false,
    },
  }, ],

}, {
  timestamps: true,
});

const Orders_Decorators_Promotions = new mongoose.Schema({
  orderRef: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  promotions: [{
    name: {
      type: String,
      required: false,
    },
    discountRate: {
      type: Number,
      required: false,
    }
  }, ],
}, {
  timestamps: true,
});

const Orders_Decorators_PointUsage = new mongoose.Schema({
  orderRef: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  pointUsed: {
    type: Number,
    required: true
  },
  param_PointToMoneyRatio: {
    type: Number,
    required: true
  }
}, {
  timestamps: true,
});

const orderModel = mongoose.model("orders", orderSchemaV2);
const ordersDataFilmShowModel = mongoose.model("ordersData_FilmShow", Orders_Data_FilmShow);
const ordersDecoratorsPointUsageModel = mongoose.model("orders_Decorators_PointUsage", Orders_Decorators_PointUsage);
const ordersDecoratorsPromotionsModel = mongoose.model("orders_Decorators_Promotions", Orders_Decorators_Promotions);
const ordersDataItemsModel = mongoose.model("orders_Data_Items", Orders_Data_Items);


export default orderModel;