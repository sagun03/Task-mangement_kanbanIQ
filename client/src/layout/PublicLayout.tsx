import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const PublicLayout = () => {
  console.log("PublicLayout");
  return (
    <div>
      <Navbar isSideBar={false}/>
      <Outlet />
    </div>
  );
};

export default PublicLayout;