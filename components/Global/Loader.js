import css from "./Loader.module.css";
import stage0 from "../../public/Loader/0";
import stage1 from "../../public/Loader/1";
import stage2 from "../../public/Loader/2";
import stage3 from "../../public/Loader/3";
import stage4 from "../../public/Loader/4";
import { useEffect, useState } from "react";

export default function Loader() {
  let index = 0;
  const [current, setCurrent] = useState(stage0);

  useEffect(() => {
    let interval = setInterval(() => {
      switch (index) {
        case 0:
          setCurrent(stage0);
          break;
        case 1:
          setCurrent(stage1);
          break;
        case 2:
          setCurrent(stage2);
          break;
        case 3:
          setCurrent(stage3);
          break;
        case 4:
          setCurrent(stage4);
          break;
      }
      if (index == 4) {
        index = 0;
      } else {
        index++;
      }
    }, 250);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className={css.loader}>
      <div>{current}</div>
    </div>
  );
}
