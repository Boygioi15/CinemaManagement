import FoodSection from "../../Components/FoodSection";
import PaymentSection from "../../Components/PaymentSection/PaymentSection";

const FoodPage = () => {
  return (
    <div>
      <div className="flex flex-col gap-56 py-20">
        <FoodSection />
        <FoodSection />
        <FoodSection />
        <FoodSection />
        <FoodSection />
        <FoodSection />
        <FoodSection />
        <FoodSection />
      </div>
      <PaymentSection/>
    </div>
  );
};
export default FoodPage;
