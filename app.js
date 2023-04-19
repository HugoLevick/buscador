const express = require("express");
const indexRouter = require("./routes/indexRouter");
const app = express();
const port = 3000;

app.use("/", indexRouter);

app.use(express.static("public"));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
