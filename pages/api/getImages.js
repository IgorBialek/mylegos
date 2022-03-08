//Gets additional images
export default async function handler(req, res) {
  const apiKey = process.env.BRICKSET_API_KEY;

  let url = `https://brickset.com/api/v3.asmx/getAdditionalImages?apiKey=${apiKey}&setID=${req.body.setID}`;

  let response = await fetch(url);

  let responseJson = await response.json();

  let images = [];

  responseJson.additionalImages.forEach((image) => {
    images.push(image.imageURL);
  });

  res.status(200).json(images);
}
