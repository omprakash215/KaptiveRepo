const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const connectDB = require("./connection/mongo.js");
const routes = require("./src/routes/backendApi/routes.js");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.text({ type: "text/plain" }));

app.use("/api", routes);

app.get("/", (req, res) => res.send("Server is up!"));

const start = async () => {
  try {
    await connectDB();

    const server = app.listen(process.env.PORT || 3000, () => {
      console.log(`==Server running on port : ${process.env.PORT || 3000}`);
    });
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
  }
};

start().catch((err) => {
  console.error("Failed to start server:", err);
});