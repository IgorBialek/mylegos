import css from "./Login.module.css";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { faFlagCheckered, faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { withPublic } from "../../src/hook/route";

function Login({ auth }) {
  const { loginWithGoogle, error } = auth;
  return (
    <div className={css.container}>
      <div className={css.data}>
        <h1>Create your lego portofolio !</h1>
        <p>
          Mylegos is an app that makes monitoring your assets stored in lego
          sets easy!
        </p>{" "}
        <p>
          {" "}
          You just simply search and add item to your
          <b> owned list </b>
          <FontAwesomeIcon
            icon={faFlagCheckered}
            color={"var(--text)"}
          ></FontAwesomeIcon>{" "}
          or to your<b> wanted list </b>
          <FontAwesomeIcon icon={faEye} color={"var(--text)"}></FontAwesomeIcon>
          .
        </p>
        <p>
          Now you can watch movement of all your portfolio and individual sets
          as well.
        </p>
        <p>
          We provided advanced statictics, indicators, images and 3D models
          specially for you ❤️.
        </p>
        <div className={css.login}>
          {error && <h1>{error}</h1>}
          <b>Login in</b>
          <div onClick={loginWithGoogle} className="hover">
            <span>with Google </span>
            <FontAwesomeIcon
              icon={faGoogle}
              color={"var(--text)"}
            ></FontAwesomeIcon>
          </div>
        </div>
      </div>
      <div className={css.example}>
        <img src="example.png" />
      </div>
    </div>
  );
}

export default withPublic(Login);
