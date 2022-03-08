import useMylegos from "../../src/hook/mylegos";
import css from "./ItemThumbnail.module.css";
import CountControls from "../Controls/CountControls";
import { useState } from "react";
import {
  faCheck,
  faTimes,
  faFlagCheckered,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Toggle from "../Controls/Toggle";
import Indicator from "../Controls/Indicator";
import useExchange from "../../src/hook/exchange";
import Router from "next/router";
import useSettings from "../../src/hook/settings";
import imageFallback from "../../public/imageFallback";

export default function ItemThumbnail(props) {
  const mylegos = useMylegos();
  const [isAdded, setIsAdded] = useState(false);
  const [type, setType] = useState("owned");
  const exchange = useExchange();
  const settings = useSettings();

  const appendHandler = (item) => {
    setIsAdded(true);
    console.log(type);
    mylegos.appendNewItem(item, type);

    //Animation helper
    setTimeout(() => {
      setIsAdded(false);
    }, 1000);
  };

  return (
    <div
      className={`${css.container} ${
        settings.editable && props.type != "search" && css.editable
      }`}
    >
      {settings.editable && props.type != "search" && (
        <div
          className={css.delete}
          onClick={() => {
            mylegos.deleteItem(props.item);
          }}
        >
          <FontAwesomeIcon icon={faTimes}></FontAwesomeIcon>
        </div>
      )}
      {settings.editable &&
        props.type != "search" &&
        settings.type == "wanted" && (
          <div
            className={css.transfer}
            onClick={() => {
              mylegos.transferItem(props.item);
            }}
          >
            <FontAwesomeIcon icon={faFlagCheckered}></FontAwesomeIcon>
          </div>
        )}
      <div>
        <p className={`${css.text} ${css.bold}`}>{props.item.item.name}</p>
        <p className={css.text}>
          {props.item.item.minifigNumber ??
            props.item.item.number + "-" + props.item.item.numberVariant}
        </p>
      </div>
      {props.item.item.image.imageURL ? (
        <img
          className={css.image}
          src={props.item.item.image.imageURL}
          alt="dupa"
        />
      ) : (
        imageFallback
      )}
      {props.type == "search" ? (
        <div className={`${css.controlsContainer} hover2Link`}>
          {
            <Toggle
              type={(x) => {
                setType(x);
              }}
            ></Toggle>
          }
          <div
            className={`${css.button} hover`}
            onClick={() =>
              Router.push(
                `/item/${
                  props.item.item.minifigNumber ??
                  props.item.item.number + "-" + props.item.item.numberVariant
                }?type=searched`
              )
            }
          >
            Info
          </div>
          {isAdded ? (
            <button className={`${css.button}`}>
              <FontAwesomeIcon icon={faCheck}></FontAwesomeIcon>
            </button>
          ) : (
            <div
              className={`${css.button} hover`}
              onClick={() => appendHandler(props.item)}
            >
              Add
            </div>
          )}
        </div>
      ) : (
        <div className={`${css.controlsContainer} hover2Link`}>
          <CountControls item={props.item}></CountControls>
          <Indicator
            value={props.item.priceGuide.avg_price}
            base={
              props.item.item.LEGOCom && props.item.item.LEGOCom.DE.retailPrice
                ? props.item.item.LEGOCom.DE.retailPrice *
                  exchange.exchange.rates.PLN
                : props.item.item.LEGOCom &&
                  props.item.item.LEGOCom.US.retailPrice
                ? props.item.item.LEGOCom.US.retailPrice *
                  exchange.exchange.rates.PLN
                : 0
            }
          ></Indicator>
          <div
            className={`${css.button} hover`}
            onClick={() =>
              Router.push(
                `/item/${
                  props.item.item.minifigNumber ??
                  props.item.item.number + "-" + props.item.item.numberVariant
                }`
              )
            }
          >
            Info
          </div>
        </div>
      )}
    </div>
  );
}
