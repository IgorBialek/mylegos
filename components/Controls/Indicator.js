import css from "./Indicator.module.css";
import { faArrowUp, faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Indicator(props) {
  let indicator = ((props.base - props.value) / props.base) * -100;

  return (
    <div
      className={`${props.customStyle ?? css.indicator} ${
        indicator.toFixed(2) >= 0 ? css.positive : css.negative
      }`}
    >
      {indicator.toFixed(2)}%
      <FontAwesomeIcon
        icon={indicator.toFixed(2) >= 0 ? faArrowUp : faArrowDown}
      ></FontAwesomeIcon>
    </div>
  );
}
