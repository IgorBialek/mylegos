import css from "./ZoomableImage.module.css";
import {
  faCube,
  faChevronLeft,
  faChevronRight,
  faCircle,
} from "@fortawesome/free-solid-svg-icons";
import { faCircle as faRegularCircle } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Fragment, useEffect, useState } from "react";
import Router from "next/router";
import wheelzoom from "../../../src/libs/wheelzoom";
import Loader from "../../Global/Loader";

export default function ZoomableImage(props) {
  const [images, setImages] = useState([]);
  const [index, setIndex] = useState(0);

  const handleModelView = () => {
    Router.push(`/item/${Router.query.number}/model`);
  };

  useEffect(() => {
    //Set up zoomable image
    async function init() {
      var config = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          setID: props.item.item.setID,
        }),
      };

      const response = await fetch("/api/getImages", config);

      const additionalImages = await response.json();

      setImages([props.item.item.image.imageURL, ...additionalImages]);
      wheelzoom(document.querySelector("#setImg"));
    }

    console.log(props.item.item.setID);

    if (props.item.item.setID) {
      init();
    } else {
      setImages([props.item.item.image.imageURL]);
      wheelzoom(document.querySelector("#setImg"));
    }
  }, []);

  return images.length > 0 ? (
    <Fragment>
      <div className={`${css.button} hover`} onClick={handleModelView}>
        <FontAwesomeIcon icon={faCube}></FontAwesomeIcon> Model 3D
      </div>
      <FontAwesomeIcon
        icon={faChevronLeft}
        className={css.prevControl}
        onClick={() => {
          if (index > 0) {
            setIndex((prevState) => {
              return (prevState -= 1);
            });
          } else {
            setIndex(images.length - 1);
          }

          console.log(index);
        }}
      >
        {"prev"}
      </FontAwesomeIcon>
      <div className={css.image}>
        <img alt=":(" src={images[index]} id="setImg" />
      </div>
      <div className={css.bulletsContainer}>
        {images.map((image) => {
          if (index == images.indexOf(image)) {
            return <FontAwesomeIcon icon={faCircle} />;
          } else {
            return <FontAwesomeIcon icon={faRegularCircle} />;
          }
        })}
      </div>
      <FontAwesomeIcon
        icon={faChevronRight}
        className={css.nextControl}
        onClick={() => {
          if (index < images.length - 1) {
            setIndex((prevState) => {
              return (prevState += 1);
            });
          } else {
            setIndex(0);
          }

          console.log(index);
        }}
      >
        {"next"}
      </FontAwesomeIcon>
    </Fragment>
  ) : (
    <Loader></Loader>
  );
}
