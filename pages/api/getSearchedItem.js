//Gets searched items
export default async function handler(req, res) {
  var query = req.body.query;

  const apiKey = process.env.BRICKSET_API_KEY;
  const userHash = process.env.BRICKSET_USER_HASH;

  const setUrl = `https://brickset.com/api/v3.asmx/getSets?apiKey=${apiKey}&userHash=${userHash}&params={'query': '${query}', 'orderBy' : 'YearFromDESC', 'pageSize':'500'}`;

  const minifigureUrl = `https://brickset.com/api/v3.asmx/getMinifigCollection?apiKey=${apiKey}&userHash=${userHash}&params={'query': '${query}', 'orderBy' : 'YearFromDESC', 'pageSize':'500'}`;

  //Gets sets
  var sets = await fetch(setUrl);

  sets = await sets.json();

  sets = sets.sets;

  //Gets minifigures
  var minifigures = await fetch(minifigureUrl);

  minifigures = await minifigures.json();

  minifigures = minifigures.minifigs;

  //Connects it
  var items = [];
  if (sets.count != 0 && minifigures.count != 0) {
    items = [...sets, ...minifigures];

    //Prepare thumbnail image
    items.map((item) => {
      if (item.minifigNumber != null) {
        item.image = {};
        item.image.imageURL =
          "//img.bricklink.com/ML/" + item.minifigNumber + ".jpg";
      }
    });
  } else if (sets.count != 0) {
    items = [...sets];
  } else if (minifigures.count != 0) {
    items = [...minifigures];

    //Prepare thumbnail image
    items.map((item) => {
      if (item.minifigNumber != null) {
        item.image = {};
        item.image.imageURL =
          "//img.bricklink.com/ML/" + item.minifigNumber + ".jpg";
      }
    });
  }

  res.status(200).json(items);
}
