import css from "./Toggle.module.css";
import { faFlagCheckered, faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import useSettings from "../../src/hook/settings";

export default function Toggle(props) {
  const settings = useSettings();
  const [checked, setChecked] = useState(
    props.sync ? (settings.type == "owned" ? true : false) : true
  );

  const changeHandler = () => {
    props.type(!checked ? "owned" : "wanted");
    setChecked((prevState) => {
      return !prevState;
    });
  };

  return (
    <div className={`${css.toggle} hover2`} onClick={changeHandler}>
      <div className={`${css.icons} ${checked ? css.unchecked : css.checked}`}>
        <div className={css.iconsBackground}>
          <FontAwesomeIcon icon={faFlagCheckered}></FontAwesomeIcon>
          <FontAwesomeIcon icon={faEye}></FontAwesomeIcon>
        </div>
        <div className={css.icon}>
          <FontAwesomeIcon
            icon={checked ? faFlagCheckered : faEye}
          ></FontAwesomeIcon>
        </div>
      </div>
    </div>
  );
}
