import { withProtected } from "../../../src/hook/route";
import { useRouter } from "next/router";
import useMylegos from "../../../src/hook/mylegos";
import Item from "../../../components/Item/Item";
import { useEffect, useState } from "react";
import Loader from "../../../components/Global/Loader";
import useExchange from "../../../src/hook/exchange";

function ItemPage() {
  const mylegos = useMylegos();
  const exchange = useExchange();
  const router = useRouter();
  const { number } = router.query;
  const { type } = router.query;
  const [item, setItem] = useState(null);

  useEffect(() => {
    async function init() {
      await exchange.getExchange();

      //Defines if item data is taken from db or api
      if (type == "searched") {
        console.log(number, type);
        setItem(await mylegos.getItem(number));
      } else {
        console.log(number, type);
        setItem(await mylegos.getInitItemData(number));
      }
    }
    init();
  }, []);

  return item ? (
    <div className="content">
      <Item item={item}></Item>
    </div>
  ) : (
    <Loader></Loader>
  );
}

export default withProtected(ItemPage);
