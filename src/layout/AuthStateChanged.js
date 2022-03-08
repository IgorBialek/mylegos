import { useEffect, useState } from "react";
import Loader from "../../components/Global/Loader";
import useAuth from "../hook/auth";
import useSettings from "../hook/settings";
import AuthService from "../service/AuthService";

export default function AuthStateChanged({ children }) {
  const { setUser } = useAuth();
  const settings = useSettings();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AuthService.waitForUser((userCred) => {
      setUser(userCred);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <Loader></Loader>;
  }

  return children;
}
