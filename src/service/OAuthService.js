import { OAuth } from "oauth";

const bricklink = new OAuth(
  "",
  "",
  process.env.NEXT_PUBLIC_BRICKLINK_CONSUMER_KEY,
  process.env.NEXT_PUBLIC_BRICKLINK_CONSUMER_SECRET,
  "1.0",
  null,
  "HMAC-SHA1"
);

export default bricklink;
