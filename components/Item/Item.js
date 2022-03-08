import css from "./Item.module.css";
import Chart from "../Chart/Chart";
import Indicator from "../Controls/Indicator";
import useExchange from "../../src/hook/exchange";
import { Fragment } from "react";
import Router from "next/router";

export default function Item(props) {
  const exchange = useExchange();

  const handleImageClick = () => {
    Router.push(`/item/${Router.query.number}/image`);
  };

  return (
    <div className={css.container}>
      <div className={css.item}>
        <div className={css.image} onClick={handleImageClick}>
          <img src={props.item.item.image.imageURL} alt="lego JPEG" />
        </div>
        <div className={css.info}>
          <div>
            <b>Name:</b> {props.item.item.name}
          </div>
          <div>
            <b>Number:</b>{" "}
            {props.item.item.minifigNumber ??
              props.item.item.number + "-" + props.item.item.numberVariant}
          </div>
          {props.item.item.setID && (
            <div>
              <b>Release year:</b>
              {new Date(
                props.item.item.LEGOCom.DE.dateFirstAvailable
              ).getDate() +
                "/" +
                (new Date(
                  props.item.item.LEGOCom.DE.dateFirstAvailable
                ).getMonth() +
                  1) +
                "/" +
                new Date(
                  props.item.item.LEGOCom.DE.dateFirstAvailable
                ).getFullYear()}
            </div>
          )}
          <div>
            <b>Avarage price: </b>
            {parseFloat(props.item.priceGuide.avg_price).toFixed(2).toString() +
              " zł"}
            <Indicator
              value={props.item.priceGuide.avg_price}
              base={
                props.item.item.LEGOCom &&
                props.item.item.LEGOCom.DE.retailPrice
                  ? props.item.item.LEGOCom.DE.retailPrice *
                    exchange.exchange.rates.PLN
                  : props.item.item.LEGOCom &&
                    props.item.item.LEGOCom.US.retailPrice
                  ? props.item.item.LEGOCom.US.retailPrice *
                    exchange.exchange.rates.PLN
                  : 0
              }
            ></Indicator>
          </div>
          <div>
            <b>Last change: </b>
            {props.item.priceGuide.price_detail.length > 1 ? (
              <Fragment>
                {parseFloat(
                  props.item.priceGuide.price_detail[
                    props.item.priceGuide.price_detail.length - 1
                  ].unit_price -
                    props.item.priceGuide.price_detail[
                      props.item.priceGuide.price_detail.length - 2
                    ].unit_price
                )
                  .toFixed(2)
                  .toString() + " zł"}
                <Indicator
                  value={
                    props.item.priceGuide.price_detail[
                      props.item.priceGuide.price_detail.length - 1
                    ].unit_price
                  }
                  base={
                    props.item.priceGuide.price_detail[
                      props.item.priceGuide.price_detail.length - 2
                    ].unit_price
                  }
                ></Indicator>
              </Fragment>
            ) : (
              "Not enough data"
            )}
          </div>
        </div>
      </div>
      <div className={css.charts}>
        <Chart item={props.item}></Chart>
      </div>
    </div>
  );
}
