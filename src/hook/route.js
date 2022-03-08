import { useRouter } from "next/router";
import Loader from "../../components/Global/Loader";
import useAuth from "./auth";

export function withPublic(Component) {
  return function WithPublic(props) {
    const auth = useAuth();
    const router = useRouter();

    console.log(auth.user);

    if (auth.user) {
      router.replace("/dashboard");
      return <Loader></Loader>;
    }

    return <Component auth={auth} {...props}></Component>;
  };
}

export function withProtected(Component) {
  return function WithProtected(props) {
    const auth = useAuth();
    const router = useRouter();

    if (!auth.user) {
      router.replace("/");
      return <Loader></Loader>;
    }

    return <Component auth={auth} {...props}></Component>;
  };
}
