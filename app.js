const express = require("express");
const cors = require("cors");
const indexRouter = require("./routes");
const { PORT } = require("./config");
const port = PORT
const app = express();

// Common middlewares
app.use(express.json());

app.use(cors());
app.use("/v1", indexRouter);


app.listen(port, () => {
  console.log("Server connected on port = ", port);
});
