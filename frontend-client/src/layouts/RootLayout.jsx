import Footer from "../Components/footer";
import Header from "../Components/header";
import { Outlet } from "react-router-dom";
import "../style/rootLayout.css";

export default function RootLayout() {
  return (
    <div>
      <Header />
      <div className="fullscreen-gradient w-full">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
