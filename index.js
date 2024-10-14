const express = require("express");
const connectToMogo = require("./models/db");
const cors = require("cors");
const app = express();
const port = 5000;

connectToMogo();

/* Middleware */
app.use(cors());
app.use(express.json());

/* Available routes */
app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(port, () => {
  console.log(`server is running on port http://localhost:${port}`);
});
