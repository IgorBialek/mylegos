import { useEffect, useState } from "react";
import SearchItems from "../components/Item/SearchItems";
import { withProtected } from "../src/hook/route";

function Search() {
  const [searchCounter, setSearchCounter] = useState("🙊");

  useEffect(() => {
    async function init() {
      //Takes data for counter
      setSearchCounter((await (await fetch("/api/getAppData")).json()).count);
    }

    init();
  }, []);

  return <SearchItems counter={searchCounter}></SearchItems>;
}

export default withProtected(Search);
