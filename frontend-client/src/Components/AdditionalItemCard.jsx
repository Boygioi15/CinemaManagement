import "../style/additionalStyle.css";
import { FaPlus, FaMinus } from "react-icons/fa";

import { useState } from "react";
const AdditionalItemCard = ({ onChangeQuantity, itemDetail }) => {
  return (
    <div className="AdditionalItemCard">
      <img src={itemDetail.thumbnailURL} />
      <div className="item-details">
        <span className="name">{itemDetail.name}</span>
        {itemDetail.price}VNĐ
        <QuantitySelector
          quantity={itemDetail.quantity}
          onIncrement={() => onChangeQuantity(itemDetail.quantity + 1)}
          onDecrement={() => onChangeQuantity(itemDetail.quantity - 1)}
        />
      </div>
    </div>
  );
};
function QuantitySelector({ quantity, onIncrement, onDecrement }) {
  return (
    <div className="QuantitySelector">
      <FaMinus className="button" onClick={onDecrement} />
      <span>{quantity}</span>
      <FaPlus className="button" onClick={onIncrement} />
    </div>
  );
}
export default AdditionalItemCard;
