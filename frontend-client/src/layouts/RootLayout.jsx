import Footer from "../Components/footer";
import Header from "../Components/header";
import { Outlet } from "react-router-dom";
import "../style/rootLayout.css";
import background from "../assets/background.png"
export default function RootLayout() {
  return (
    <div style={{backgroundColor: "#0f172a", backgroundImage: `url(${background})`,backgroundRepeat:"repeat-y", backgroundSize: "100% auto"}}>
      <Header />
      <div style={{paddingTop:"70px", minHeight:"1000px"}}className=" w-full">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
