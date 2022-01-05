const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const usersRouter = require("./api/routes/user");
const todoRouter  = require("./api/routes/todo");
const isAuth = require("./middleware/is-auth");
const cors = require('cors')

const app = express();

app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

app.use(isAuth);

app.use("/user", usersRouter);
app.use("/todo", todoRouter);


mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@clustertodo.w5b8q.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`    
  )
  .then(app.listen(8000))
  .catch((err) => console.log(err));
