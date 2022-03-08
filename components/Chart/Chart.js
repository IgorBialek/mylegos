import {
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
  ComposedChart,
} from "recharts";

import css from "./Chart.module.css";
import Indicator from "../Controls/Indicator";
import useExchange from "../../src/hook/exchange";

export default function Chart(props) {
  const data = [];
  const exchange = useExchange();

  props.item.priceGuide.price_detail.forEach((detail) => {
    const date = new Date(detail.date_ordered);

    data.push({
      name: date.toUTCString(),
      price: parseInt(detail.unit_price),
      avgPrice: parseInt(props.item.priceGuide.avg_price),
      retail: parseInt(
        props.item.item.LEGOCom && props.item.item.LEGOCom.DE.retailPrice
          ? props.item.item.LEGOCom.DE.retailPrice * exchange.exchange.rates.PLN
          : props.item.item.LEGOCom && props.item.item.LEGOCom.US.retailPrice
          ? props.item.item.LEGOCom.US.retailPrice * exchange.exchange.rates.PLN
          : props.item.priceGuide.avg_price
      ),
    });
  });

  const renderCustomYAxisTick = ({ x, y, payload }) => {
    return (
      <text
        x={x - 2}
        y={y}
        fill="var(--text)"
        textAnchor="end"
        dominantBaseline="middle"
      >
        {payload.value.toString() + " zł"}
      </text>
    );
  };

  const renderCustomXAxisTick = ({ x, y, payload }) => {
    const date = new Date(payload.value);

    if (payload.index != 0) {
      return (
        <text
          x={x - 2}
          y={y}
          fill="var(--text)"
          textAnchor="middle"
          dominantBaseline="hanging"
        >
          {date.getUTCDate() +
            "/" +
            (date.getUTCMonth() + 1) +
            "/" +
            date.getUTCFullYear()}
        </text>
      );
    } else return null;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const date = new Date(label);

      return (
        <div className={css.tooltip}>
          <div>
            <b>Date:</b>
            {date.getUTCDate() +
              "/" +
              (date.getUTCMonth() + 1) +
              "/" +
              date.getUTCFullYear() +
              " " +
              (date.getUTCHours().toString().length == 1
                ? "0" + date.getUTCHours().toString()
                : date.getUTCHours().toString()) +
              ":" +
              (date.getUTCMinutes().toString().length == 1
                ? "0" + date.getUTCMinutes().toString()
                : date.getUTCMinutes().toString())}
          </div>
          <div>
            <b>Price: </b> {payload[0].value}{" "}
            <Indicator
              customStyle={css.indicator}
              value={payload[0].value}
              base={
                props.item.item.LEGOCom &&
                props.item.item.LEGOCom.DE.retailPrice
                  ? props.item.item.LEGOCom.DE.retailPrice *
                    exchange.exchange.rates.PLN
                  : props.item.item.LEGOCom &&
                    props.item.item.LEGOCom.US.retailPrice
                  ? props.item.item.LEGOCom.US.retailPrice *
                    exchange.exchange.rates.PLN
                  : props.item.priceGuide.avg_price
              }
            ></Indicator>
          </div>
          <div>
            <b>Avarage: </b> {payload[1].value}
          </div>
          <div>
            <b>Retail: </b> {payload[2].value}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div style={{ width: "100%", height: "250px", marginTop: "100px" }}>
      <h2>Bricklink data</h2>
      <ResponsiveContainer width="99%">
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="10 10" />
          <XAxis dataKey="name" tick={renderCustomXAxisTick} />
          <YAxis tick={renderCustomYAxisTick} />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="price"
            stroke="var(--text)"
            fill="var(--text)"
          />
          <Line
            dataKey="avgPrice"
            stroke="var(--text)"
            type="monotone"
            dot={null}
            strokeDasharray="20 20"
          />
          <Line
            dataKey="retail"
            stroke="var(--text)"
            type="monotone"
            dot={null}
            strokeWidth={2}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
