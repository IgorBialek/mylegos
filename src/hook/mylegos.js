import { createContext, useContext, useState } from "react";
import {
  doc,
  getDoc,
  getFirestore,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import useAuth from "./auth";
import Router from "next/router";
import useExchange from "./exchange";
import useSettings from "./settings";

const mylegosContext = createContext();

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

export default function useMylegos() {
  return useContext(mylegosContext);
}

export function MylegosProvider(props) {
  const db = getFirestore();
  const { user, error } = useAuth();
  const [itemsList, SetItemsList] = useState([]);
  const [updateState, setUpdateState] = useState({
    status: { done: 0, toDo: 0 },
    updatesList: [],
  });
  const exchange = useExchange();
  const settings = useSettings();

  //Loading items from database
  const getInitData = async () => {
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);

    var tempList = null;

    if (docSnap.exists()) {
      tempList = docSnap.data().items ?? [];
    } else {
      return;
    }

    sort(settings.sorting.type, settings.sorting.asc, tempList);
  };

  //Get item with data from db
  const getInitItemData = async (number) => {
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);

    var tempList = null;
    let correctItem = null;

    if (docSnap.exists()) {
      tempList = docSnap.data().items ?? [];
    } else {
      return;
    }

    console.log("number: ", number);

    tempList.forEach((item) => {
      if (
        (item.item.minifigNumber ??
          item.item.number + "-" + item.item.numberVariant) == number
      ) {
        correctItem = item;
        console.log(correctItem);
      }
    });

    return correctItem;
  };

  //Refresh all prices
  const refreshPrices = async () => {
    var tempList = itemsList.slice();

    let index = 0;

    //Get all prices
    const getPriceGuides = async () => {
      await asyncForEach(tempList, async (item) => {
        item.priceGuide = await getPriceGuide(
          item.item.type,
          item.item.minifigNumber ??
            item.item.number + "-" + item.item.numberVariant
        );
        index++;
        setUpdateState((prevState) => ({
          ...prevState,
          status: {
            done: index,
            toDo: tempList.length,
          },
        }));
      });

      //Checks for new prices
      let updatesList = [];
      tempList.forEach((item) => {
        item.priceGuide.price_detail.forEach((priceDetail) => {
          if (!item.priceGuide.price_detail.includes(priceDetail)) {
            item.priceGuide.price_detail.push(priceDetail);
            updatesList.push({
              number:
                item.item.minifigNumber ??
                item.item.number + "-" + item.item.numberVariant,
              price: priceDetail,
            });
          }
        });
      });

      setUpdateState({
        status: {
          done: 0,
          toDo: tempList.length,
        },
        updatesList: updatesList,
      });

      //Sort
      tempList.forEach((item) => {
        item.priceGuide.price_detail.sort((a, b) => {
          return new Date(a.date_ordered) - new Date(b.date_ordered);
        });
      });

      //Saving
      try {
        await setDoc(
          doc(db, "users", user.uid),
          {
            items: [...tempList],
          },
          { merge: true }
        );
      } catch (e) {
        console.log(e);
        alert("Error adding document: ", e.message);
      }

      await getInitData();
    };

    await getPriceGuides();
  };

  //Get searched items by phrase
  const getSearchedItem = async (query) => {
    var config = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: query,
      }),
    };

    const response = await fetch("/api/getSearchedItem", config);

    const responseJson = await response.json();

    return responseJson;
  };

  //Get item with all data
  const getItem = async (number) => {
    console.log("Get item data ", number);
    let obj = await getSearchedItem(number);

    console.log(obj);

    let item = obj[0];
    if (item.minifigNumber != null) {
      item.type = "MINIFIG";
      item.id = item.minifigNumber;
    } else {
      item.type = "SET";
      item.id = item.number + "-" + item.numberVariant;
    }

    if (item.category == "Gear") {
      item.type = "GEAR";
    }

    var newItem = item;

    const priceGuide = await getPriceGuide(item.type, item.id);

    return (newItem = { item: newItem, count: 1, priceGuide: priceGuide });
  };

  //Get price guide
  const getPriceGuide = async (type, number) => {
    var config = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        number: number,
        type: type,
      }),
    };

    const response = await fetch("/api/getPriceGuide", config);
    const responseJson = await response.json();

    responseJson.price_detail.forEach((detail) => {
      delete detail.buyer_country_code;
      delete detail.quantity;
      delete detail.qunatity;
      delete detail.seller_country_code;
    });

    return responseJson;
  };

  //Appending new item to list and saving it to database
  const appendNewItem = async (obj, type) => {
    console.log(type);
    let item = obj.item;
    if (item.minifigNumber != null) {
      item.type = "MINIFIG";
      item.id = item.minifigNumber;
    } else {
      item.type = "SET";
      item.id = item.number + "-" + item.numberVariant;
    }

    if (item.category == "Gear") {
      item.type = "GEAR";
    }

    var newItem = item;

    const priceGuide = await getPriceGuide(item.type, item.id);

    //Configuring data
    var tempList = itemsList.slice();

    var duplicate = false;

    if (tempList.length != 0) {
      tempList.forEach((item) => {
        console.log(item.type, type);
        if (
          (item.item.minifigNumber ??
            item.item.number + "-" + item.item.numberVariant) == newItem.id &&
          item.type == type
        ) {
          duplicate = true;
          console.log(duplicate);
        }
      });
    }

    var newList = itemsList.slice();

    if (duplicate) {
      const index = tempList.findIndex(
        (x) =>
          (x.item.minifigNumber ??
            x.item.number + "-" + x.item.numberVariant) == newItem.id &&
          x.type == type
      );

      newList[index].count += 1;
      SetItemsList([...newList]);
    } else {
      newItem = { item: newItem, count: 1, priceGuide: priceGuide, type: type };
      newList.push(newItem);
      SetItemsList([...newList]);
    }

    //Saving
    try {
      await setDoc(
        doc(db, "users", user.uid),
        {
          items: [...newList],
        },
        { merge: true }
      );
    } catch (e) {
      alert("Error adding document: ", e);
    }
  };

  //Incrementing count of item
  const addItem = async (data) => {
    //Configuring data
    var tempList = itemsList.slice();

    const index = tempList.findIndex(
      (x) =>
        JSON.stringify(x.item, Object.keys(x.item).sort()) ===
          JSON.stringify(data.item, Object.keys(data.item).sort()) &&
        data.type === x.type
    );

    var newList = itemsList.slice();

    newList[index].count += 1;
    sort(settings.sorting.type, settings.sorting.asc, newList);

    //Saving data
    try {
      await setDoc(
        doc(db, "users", user.uid),
        {
          items: [...newList],
        },
        { merge: true }
      );
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  //Decrementing count of item
  const removeItem = async (data) => {
    //Configuring data
    var tempList = itemsList.slice();

    const index = tempList.findIndex(
      (x) =>
        JSON.stringify(x.item, Object.keys(x.item).sort()) ===
          JSON.stringify(data.item, Object.keys(data.item).sort()) &&
        data.type === x.type
    );

    var newList = itemsList.slice();

    newList[index].count -= 1;

    if (newList[index].count == 0) {
      if (Router.pathname != "/dashboard") {
        Router.replace("/dashboard");
      }

      newList.splice(index, 1);
    }

    sort(settings.sorting.type, settings.sorting.asc, newList);

    //Saving data
    try {
      await setDoc(
        doc(db, "users", user.uid),
        {
          items: [...newList],
        },
        { merge: true }
      );
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const deleteItem = async (data) => {
    //Configuring data
    var tempList = itemsList.slice();

    const index = tempList.findIndex(
      (x) =>
        JSON.stringify(x.item, Object.keys(x.item).sort()) ===
          JSON.stringify(data.item, Object.keys(data.item).sort()) &&
        data.type === x.type
    );

    var newList = itemsList.slice();

    newList.splice(index, 1);

    sort(settings.sorting.type, settings.sorting.asc, newList);

    //Saving data
    try {
      await setDoc(
        doc(db, "users", user.uid),
        {
          items: [...newList],
        },
        { merge: true }
      );
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  //Transfer item
  const transferItem = async (data) => {
    var tempList = itemsList.slice();

    const index = tempList.findIndex(
      (x) =>
        JSON.stringify(x.item, Object.keys(x.item).sort()) ===
          JSON.stringify(data.item, Object.keys(data.item).sort()) &&
        data.type === x.type
    );

    var newList = itemsList.slice();

    newList[index].type = "owned";

    sort(settings.sorting.type, settings.sorting.asc, newList);

    //Saving data
    try {
      await setDoc(
        doc(db, "users", user.uid),
        {
          items: [...newList],
        },
        { merge: true }
      );
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  //sort and return list
  const sort = (type, asc, list) => {
    console.log(list);
    var tempList = list ? list.slice() : itemsList.slice();

    switch (type) {
      case "Release date":
        tempList.sort((a, b) => {
          return asc
            ? new Date(
                a.item.LEGOCom
                  ? a.item.LEGOCom.DE.dateFirstAvailable ?? null
                  : null
              ) -
                new Date(
                  b.item.LEGOCom
                    ? b.item.LEGOCom.DE.dateFirstAvailable ?? null
                    : null
                )
            : new Date(
                b.item.LEGOCom
                  ? b.item.LEGOCom.DE.dateFirstAvailable ?? null
                  : null
              ) -
                new Date(
                  a.item.LEGOCom
                    ? a.item.LEGOCom.DE.dateFirstAvailable ?? null
                    : null
                );
        });

        break;

      case "Value":
        tempList.sort((a, b) => {
          let aValue = a.priceGuide.avg_price;
          let aBase =
            a.item.LEGOCom && a.item.LEGOCom.DE.retailPrice
              ? a.item.LEGOCom.DE.retailPrice * exchange.exchange.rates.PLN
              : a.item.LEGOCom && a.item.LEGOCom.US.retailPrice
              ? a.item.LEGOCom.US.retailPrice * exchange.exchange.rates.PLN
              : 0;

          let bValue = b.priceGuide.avg_price;
          let bBase =
            b.item.LEGOCom && b.item.LEGOCom.DE.retailPrice
              ? b.item.LEGOCom.DE.retailPrice * exchange.exchange.rates.PLN
              : b.item.LEGOCom && b.item.LEGOCom.US.retailPrice
              ? b.item.LEGOCom.US.retailPrice * exchange.exchange.rates.PLN
              : 0;

          let aIndicator = ((aBase - aValue) / aBase) * -100;
          let bIndicator = ((bBase - bValue) / bBase) * -100;

          return asc ? aIndicator - bIndicator : bIndicator - aIndicator;
        });
        break;

      case "Retail":
        tempList.sort((a, b) => {
          return asc
            ? new Date(
                a.item.LEGOCom.DE.retailPrice ??
                  a.item.LEGOCom.US.retailPrice ??
                  null
              ) -
                new Date(
                  b.item.LEGOCom.DE.retailPrice ??
                    a.item.LEGOCom.US.retailPrice ??
                    null
                )
            : new Date(
                b.item.LEGOCom.DE.retailPrice ??
                  b.item.LEGOCom.US.retailPrice ??
                  null
              ) -
                new Date(
                  a.item.LEGOCom.DE.retailPrice ??
                    b.item.LEGOCom.US.retailPrice ??
                    null
                );
        });
        break;

      case "Count":
        tempList.sort((a, b) => {
          return asc ? a.count - b.count : b.count - a.count;
        });
        break;

      case "Change":
        tempList.sort((a, b) => {
          let lastASale;
          let lastBSale;
          let lastSecondASale;
          let lastSecondBSale;

          if (
            a.priceGuide.price_detail.length > 1 &&
            b.priceGuide.price_detail.length > 1
          ) {
            lastASale =
              a.priceGuide.price_detail[a.priceGuide.price_detail.length - 1]
                .unit_price;

            lastBSale =
              b.priceGuide.price_detail[b.priceGuide.price_detail.length - 1]
                .unit_price;

            lastSecondASale =
              a.priceGuide.price_detail[a.priceGuide.price_detail.length - 2]
                .unit_price;

            lastSecondBSale =
              b.priceGuide.price_detail[b.priceGuide.price_detail.length - 2]
                .unit_price;
          }

          return asc
            ? ((lastSecondASale - lastASale) / lastSecondASale) * -100 -
                ((lastSecondBSale - lastBSale) / lastSecondBSale) * -100
            : ((lastSecondBSale - lastBSale) / lastSecondBSale) * -100 -
                ((lastSecondASale - lastASale) / lastSecondASale) * -100;
        });
        break;
    }

    SetItemsList([...tempList]);
    console.log(itemsList);
  };

  const value = {
    itemsList,
    updateState,
    getInitData,
    getSearchedItem,
    getItem,
    appendNewItem,
    addItem,
    removeItem,
    SetItemsList,
    getInitItemData,
    refreshPrices,
    sort,
    deleteItem,
    transferItem,
  };

  return <mylegosContext.Provider value={value} {...props} />;
}
