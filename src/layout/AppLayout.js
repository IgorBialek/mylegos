import Navbar from "../../components/Global/Navbar";
import useAuth from "../hook/auth";
import useMylegos from "../hook/mylegos";

export default function AppLayout({ children }) {
  const auth = useAuth();
  const mylegos = useMylegos();

  return (
    <div className="container">
      <Navbar auth={auth} mylegos={mylegos}></Navbar>
      <main>{children}</main>
    </div>
  );
}
