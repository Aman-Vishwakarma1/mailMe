const express = require("express");
const dotenv = require("dotenv");

dotenv.config();
const app = express();

const PORT = 3000;

app.use(express.json());
app.set("trust proxy", true);

app.get("/", require("./controller/apiInfo").apiInfo);
app.post("/mailme/:mailto", require("./controller/mailmeController").sendMail);

app.listen(PORT, (err) => {
  if (!err) {
    return console.log(`http://localhost:${PORT}`);
  }
  console.error(err);
});
