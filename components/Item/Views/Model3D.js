import { faImage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Fragment, useState, useEffect } from "react";
import Router from "next/router";
import css from "./Model3D.module.css";
import Loader from "../../Global/Loader";

export default function Model3D(props) {
  const [loaded, setLoaded] = useState(null);

  const handleImagesView = () => {
    Router.push(`/item/${Router.query.number}/image`);
  };

  useEffect(() => {
    console.log(props.number);
    //Gets status of iframe
    async function init() {
      var config = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          number: props.number,
        }),
      };

      const response = await fetch("/api/getStatusOfIframe", config);

      const { good } = await response.json();

      good ? setLoaded(true) : setLoaded(false);
    }

    init();
  }, []);

  return (
    <Fragment>
      <div className={`${css.button} hover`} onClick={handleImagesView}>
        <FontAwesomeIcon icon={faImage}></FontAwesomeIcon> Images
      </div>
      {loaded ? (
        <div className={css.model}>
          <iframe
            frameBorder="0"
            height="100%"
            width="100%"
            allowFullScreen
            webkitallowfullscreen="true"
            mozallowfullscreen="true"
            onmousewheel=""
            src={`https://www.mecabricks.com/en/player/${props.number}`}
          ></iframe>
        </div>
      ) : loaded == null ? (
        <Loader></Loader>
      ) : (
        <h1>No model available :(</h1>
      )}
    </Fragment>
  );
}
