import QuantitySelector from "./QuantitySelector";

const FoodCard = () => {
  return (
    <div>
      <div className="flex flex-col justi fy-between md:grid md:grid-cols-2 gap-4 group ">
        <div className="md:col-span-1 w-full">
          <img
            className="w-full object-cover"
            src="https://api-website.cinestar.com.vn/media/.thumbswysiwyg/pictures/HinhQuayconnew/lays-khoai-tay.png?rand=1719572623"
            alt=""
          />
        </div>
        <div className="md:col-span-1 flex flex-col justify-between">
          <div className="flex flex-col font-interBold gap-4 justify-center items-center md:items-start">
            <span className="text-lg group-hover:text-[#f2ea28]">
              COMBO PARTY
            </span>
            <span className="">1 Bắp Ngọt 60oz + 1 Coke 32oz</span>
            <span className="">94,000 VNĐ</span>
          </div>
          <div className="mt-4">
            <QuantitySelector />
          </div>
        </div>
      </div>
    </div>
  );
};
export default FoodCard;
