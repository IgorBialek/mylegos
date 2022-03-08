import { withProtected } from "../../../src/hook/route";
import { useRouter } from "next/router";
import Model3D from "../../../components/Item/Views/Model3D";

function ItemModel() {
  const router = useRouter();
  const { number } = router.query;

  return <Model3D number={number}></Model3D>;
}

export default withProtected(ItemModel);
