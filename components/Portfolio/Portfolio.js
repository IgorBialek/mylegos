import useMylegos from "../../src/hook/mylegos";
import Indicator from "../Controls/Indicator";
import css from "./Portfolio.module.css";
import useExchange from "../../src/hook/exchange";
import { faSyncAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Toggle from "../Controls/Toggle";
import useSettings from "../../src/hook/settings";
import Select from "../Controls/Select";

export default function Portfolio() {
  const mylegos = useMylegos();
  const exchange = useExchange();
  const settings = useSettings();

  //Calculate sum of retails
  let sumOfRetails = 0;
  mylegos.itemsList
    .filter((item) => {
      return settings.type == item.type;
    })
    .forEach((item) => {
      sumOfRetails +=
        (item.item.LEGOCom && item.item.LEGOCom.DE.retailPrice
          ? item.item.LEGOCom.DE.retailPrice
          : 0) *
        exchange.exchange.rates.PLN *
        item.count;
    });

  //Calculate count of sets
  let countOfSets = 0;
  mylegos.itemsList
    .filter((item) => {
      return settings.type == item.type;
    })
    .forEach((item) => {
      countOfSets += item.count;
    });

  //Calculate sum of values
  let valueOfSets = 0;
  mylegos.itemsList
    .filter((item) => {
      return settings.type == item.type;
    })
    .forEach((item) => {
      valueOfSets += item.count * item.priceGuide.avg_price;
    });

  async function refreshHandler() {
    await mylegos.refreshPrices();
  }

  return (
    <div className={css.container}>
      <div className={css.action}>
        <div className={`${css.refresh} hover`} onClick={refreshHandler}>
          {mylegos.updateState.status.done == 0 ? (
            "Refresh"
          ) : (
            <div>
              <FontAwesomeIcon icon={faSyncAlt}></FontAwesomeIcon>
              {mylegos.updateState.status.done +
                " / " +
                mylegos.updateState.status.toDo}
            </div>
          )}
        </div>
        <div
          className={`${css.refresh} hover`}
          onClick={() => {
            settings.setEditable((prevState) => {
              return !prevState;
            });
          }}
        >
          {settings.editable ? "Okey, i'm done" : "Edit list"}
        </div>
      </div>
      <div className={css.info}>
        <div>
          <p>
            <b>Value of the sets: </b>
            {valueOfSets.toFixed()} zł
          </p>
          <Indicator
            value={valueOfSets.toFixed()}
            base={sumOfRetails.toFixed()}
          ></Indicator>
        </div>
        <div>
          <p>
            <b>Count of the sets: </b>
            {countOfSets}
          </p>
        </div>
      </div>
      <div className={css.filter}>
        <Toggle
          sync={true}
          type={(type) => {
            settings.setType(type);
          }}
        ></Toggle>
        <Select></Select>
      </div>
    </div>
  );
}
