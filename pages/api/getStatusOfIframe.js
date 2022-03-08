//Checks if iframe exists

export default async function handler(req, res) {
  let url = `https://www.mecabricks.com/en/player/${req.body.number}`;

  let response = await fetch(url);

  response.status == 200 ? res.json({ good: true }) : res.json({ good: false });
}
