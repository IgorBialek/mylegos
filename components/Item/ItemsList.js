import useMylegos from "../../src/hook/mylegos";
import ItemThumbnail from "./ItemThumbnail";
import css from "./ItemsList.module.css";
import useSettings from "../../src/hook/settings";

export default function ItemsList() {
  const mylegos = useMylegos();
  const settings = useSettings();

  return (
    <div className={css.list}>
      {mylegos.itemsList.length == 0 ? (
        <h1>Nothing here yet 😖</h1>
      ) : (
        mylegos.itemsList
          .filter((item) => {
            return settings.type == item.type;
          })
          .map((item) => {
            return (
              <ItemThumbnail key={Math.random()} type="dashboard" item={item} />
            );
          })
      )}
    </div>
  );
}
