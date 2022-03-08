import { useEffect, useState } from "react";
import ItemsList from "../components/Item/ItemsList";
import { withProtected } from "../src/hook/route";
import Portfolio from "../components/Portfolio/Portfolio";
import useMylegos from "../src/hook/mylegos";
import Loader from "../components/Global/Loader";
import useExchange from "../src/hook/exchange";

function Dashboard(props) {
  const mylegos = useMylegos();
  const exchange = useExchange();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    //Takes all data
    async function init() {
      await mylegos.getInitData();
      await exchange.getExchange();
      setIsLoading(false);
    }

    init();
  }, []);

  return !isLoading ? (
    <div className="content">
      <Portfolio></Portfolio>
      <ItemsList></ItemsList>
    </div>
  ) : (
    <Loader></Loader>
  );
}

export default withProtected(Dashboard);
