import css from "./Navbar.module.css";
import Link from "next/link";
import { faCog } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Navbar(props) {
  return (
    <nav className={props.auth.user ? css.navbar : null}>
      {props.auth.user && (
        <div className={`${css.elements} hover2Link`}>
          <Link href="/dashboard">
            <p>Dashboard</p>
          </Link>
          <Link href="/search">
            <p>Search</p>
          </Link>
          <Link href="/settings">
            <p>
              <FontAwesomeIcon icon={faCog} />
            </p>
          </Link>
        </div>
      )}
    </nav>
  );
}
