import bricklink from "../../src/service/OAuthService";

//Gets price guide for item
export default async function handler(req, res) {
  var number = req.body.number;
  var type = req.body.type;

  //I can say it is synchronization of two diffrent api's
  if (number.includes("col")) {
    type = "MINIFIG";
  }

  if (type == "GEAR") {
    //Gear can't have "-" in number
    number = number.split("-")[0];
  }

  //Needed to return promise to await sending response
  function getPromise() {
    return new Promise(async (resolve) => {
      function getSubSetPromise() {
        return new Promise(async (resolve) => {
          if (parseInt(number.split("-")[1]) > 1) {
            //It gets sets with sub sets

            var subSetsUrl = `https://api.bricklink.com/api/store/v1/items/${type}/${
              number.split("-")[0] + "-1"
            }/subsets`;

            await bricklink.get(
              subSetsUrl,
              process.env.NEXT_PUBLIC_BRICKLINK_TOKEN,
              process.env.NEXT_PUBLIC_BRICKLINK_TOKEN_SECRET,
              function (error, data) {
                if (error) {
                  res.status(404).json({ error });
                }

                const response = JSON.parse(data);

                response.data[0].entries.forEach((subSet) => {
                  if (subSet.item.no.split("-")[1] == number.split("-")[1]) {
                    number = subSet.item.no;
                    resolve(number);
                  }
                });
              }
            );
          } else {
            resolve(number);
          }
        });
      }

      var priceGuideUrl = `https://api.bricklink.com/api/store/v1/items/${type}/${await getSubSetPromise()}/price?currency_code=PLN&guide_type=sold`;

      //Finally gets data
      await bricklink.get(
        priceGuideUrl,
        process.env.NEXT_PUBLIC_BRICKLINK_TOKEN,
        process.env.NEXT_PUBLIC_BRICKLINK_TOKEN_SECRET,
        function (error, data) {
          if (error) {
            res.status(404).json(error);
          }

          const response = JSON.parse(data);
          console.log(response);

          resolve(response.data);
        }
      );
    });
  }

  res.status(200).json(await getPromise());
}
