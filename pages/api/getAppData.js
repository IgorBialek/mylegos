//Gets user statistics (getSets api method counter)
export default async function handler(req, res) {
  const apiKey = process.env.BRICKSET_API_KEY;

  let url = `https://brickset.com/api/v3.asmx/getKeyUsageStats?apiKey=${apiKey}`;

  let response = await fetch(url);

  let responseJson = await response.json();

  res.status(200).send(responseJson.apiKeyUsage[0]);
}
