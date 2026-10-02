import { useState } from "react";
import { useAccount } from "wagmi";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Register from "./pages/Register";
import MyCats from "./pages/MyCats";
import Account from "./pages/Account";
import BottomNav from "./components/BottomNav";
import { Marketplace, Messages, Notifications, Doctors, Pharmacy, Clinics } from "./pages/Placeholders";

export default function App() {
  const { isConnected } = useAccount();
  const [page, setPage] = useState("home");

  if (!isConnected) return <Login />;

  const withNav = (el) => (
    <>
      {el}
      <BottomNav page={page} setPage={setPage} />
    </>
  );

  switch (page) {
    case "register":
      return <Register setPage={setPage} />;
    case "cats":
      return withNav(<MyCats setPage={setPage} />);
    case "market":
      return withNav(<Marketplace />);
    case "messages":
      return withNav(<Messages />);
    case "notifications":
      return withNav(<Notifications />);
    case "doctors":
      return <Doctors setPage={setPage} />;
    case "pharmacy":
      return <Pharmacy setPage={setPage} />;
    case "clinics":
      return <Clinics setPage={setPage} />;
    case "account":
      return withNav(<Account setPage={setPage} />);
    default:
      return withNav(<Home setPage={setPage} />);
  }
}
