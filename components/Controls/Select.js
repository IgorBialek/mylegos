import { useState } from "react";
import css from "./Select.module.css";
import { faArrowUp, faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useMylegos from "../../src/hook/mylegos";
import { useEffect } from "react";
import useSettings from "../../src/hook/settings";

export default function Select(props) {
  let options = [
    { type: "Release date", asc: false },
    { type: "Value", asc: false },
    { type: "Retail", asc: false },
    { type: "Count", asc: false },
    { type: "Change", asc: false },
  ];

  const [iconHovered, setIconHovered] = useState(false);
  const [display, setDisplay] = useState(false);

  const mylegos = useMylegos();
  const settings = useSettings();

  function selectHandler(opt) {
    settings.setSorting((prevState) => {
      if (prevState != opt) {
        return opt;
      }
    });
    setDisplay((prevState) => {
      return !prevState;
    });
  }

  function ascHandler() {
    settings.setSorting((prevState) => {
      return { type: prevState.type, asc: !prevState.asc };
    });
  }

  useEffect(() => {
    mylegos.sort(settings.sorting.type, settings.sorting.asc);
  }, [settings.sorting]);

  return display ? (
    <div className={css.container}>
      <div className={css.list}>
        {options.map((opt) => {
          return (
            <div
              key={Math.random()}
              className={`${css.option} hover2Link`}
              onClick={() => {
                selectHandler(opt);
              }}
            >
              <p>{opt.type}</p>
            </div>
          );
        })}
      </div>
    </div>
  ) : (
    <div
      className={`${css.setted} hover`}
      onClick={() => {
        {
          iconHovered
            ? null
            : setDisplay((prevState) => {
                return !prevState;
              });
        }
      }}
    >
      {settings.sorting.type}
      <FontAwesomeIcon
        icon={settings.sorting.asc ? faArrowUp : faArrowDown}
        onClick={ascHandler}
        onMouseEnter={() => {
          setIconHovered(true);
        }}
        onMouseLeave={() => {
          setIconHovered(false);
        }}
      ></FontAwesomeIcon>
    </div>
  );
}
