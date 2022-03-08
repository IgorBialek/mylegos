import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import css from "./CountControls.module.css";
import useMylegos from "../../src/hook/mylegos";

export default function CountControls(props) {
  const mylegos = useMylegos();

  return (
    <div className={`${props.customStyle ?? css.count} hover`}>
      <FontAwesomeIcon
        icon={faMinus}
        onClick={() => mylegos.removeItem(props.item)}
      ></FontAwesomeIcon>
      <p>{props.item.count}</p>
      <FontAwesomeIcon
        icon={faPlus}
        onClick={() => mylegos.addItem(props.item)}
      ></FontAwesomeIcon>
    </div>
  );
}
