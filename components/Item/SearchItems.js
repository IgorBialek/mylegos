import { useRef, useState } from "react";
import useMylegos from "../../src/hook/mylegos";
import css from "./SearchItems.module.css";
import ItemThumbnail from "./ItemThumbnail";
import Loader from "../Global/Loader";
import { useEffect } from "react";

export default function SearchItems(props) {
  const query = useRef("");
  const mylegos = useMylegos();
  const [searchedItems, setSearchedItems] = useState("Default");

  const searchHandler = async () => {
    setSearchedItems(null);
    if (query.current.value != "") {
      setSearchedItems(
        await mylegos.getSearchedItem(query.current.value.trim())
      );
    }
  };

  const [searchCounter, setSearchCounter] = useState(null);

  useEffect(() => {
    //Gets search counter data
    async function init() {
      setSearchCounter(
        (
          1000 - (await (await fetch("/api/getAppData")).json()).count
        ).toString()
      );
    }

    init();
  }, [searchHandler]);

  return (
    <div className={css.searchContent}>
      <div className={css.container}>
        <input
          className={css.textInput}
          ref={query}
          type="text"
          placeholder="Set number"
          onKeyDown={async (e) => {
            if (e.key == "Enter") {
              searchHandler();
            }
          }}
        ></input>

        <button onClick={searchHandler} className="hover">
          Search
        </button>
        <p className={css.counter}>
          {searchCounter && `${searchCounter} / 1000`}
        </p>
      </div>
      <div className={searchedItems ? css.searchedItemsList : css.loader}>
        {searchedItems ? (
          searchedItems.length != 0 && searchedItems != "Default" ? (
            searchedItems.map((searchedItem) => {
              let item = {};

              item.item = searchedItem;

              return (
                <ItemThumbnail
                  item={item}
                  type="search"
                  key={searchedItem.number + searchedItem.minifigNumber}
                ></ItemThumbnail>
              );
            })
          ) : searchedItems == "Default" ? null : (
            <p className={css.fail}>
              No results <span>😰</span>
            </p>
          )
        ) : (
          <Loader />
        )}
      </div>
    </div>
  );
}
