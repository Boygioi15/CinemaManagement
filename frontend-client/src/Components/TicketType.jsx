import QuantitySelector from "./QuantitySelector";

const TicketType = ({ name, isPair, price }) => {
  return (
    <div className="border border-white px-4 lg:px-32 py-6 flex flex-row justify-between lg:flex-col lg:justify-center items-center w-full space-y-8 group">
      <div className="flex flex-col gap-6 items-start justify-center lg:items-center font-interBold w-full">
        <span className="text-xl group-hover:text-[#f2ea28]">NGƯỜI LỚN</span>
        <span className="text-[#f2ea28] text-lg">{isPair ? "Đôi" : "Đơn"}</span>
        <span className="text-lg">{price} VNĐ</span>
      </div>
      <QuantitySelector />
    </div>
  );
};

export default TicketType;
