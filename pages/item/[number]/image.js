import { withProtected } from "../../../src/hook/route";
import { useRouter } from "next/router";
import useMylegos from "../../../src/hook/mylegos";

import { useEffect, useState } from "react";
import Loader from "../../../components/Global/Loader";

import ZoomableImage from "../../../components/Item/Views/ZoomableImage";

function ItemImage() {
  const mylegos = useMylegos();
  const router = useRouter();
  const [item, setItem] = useState(null);
  const { number } = router.query;

  useEffect(() => {
    async function init() {
      //Sets data for specific item
      setItem(await mylegos.getItem(number));
    }
    init();
  }, []);

  return item ? <ZoomableImage item={item} /> : <Loader></Loader>;
}

export default withProtected(ItemImage);
