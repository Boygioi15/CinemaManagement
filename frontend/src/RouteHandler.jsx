import { Route, Routes } from "react-router-dom";
import { ROUTES } from "./utils/RouteEnum";
const renderUserRouter = () => {
  const userRouters = [
    {
      path: ROUTES.USER.HOME,
      component: <HomePage />,
    },
  ];
  return (  
    <MasterLayout>
      <Routes>
        {userRouters.map((item, key) => (
          <Route key={key} path={item.path} element={item.component} />
        ))}
      </Routes>
    </MasterLayout>
  );
};
const RouterCustom = () => {
  return renderUserRouter();
};
export default RouterCustom;
