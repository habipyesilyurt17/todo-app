const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const todoSchema = new Schema({
  todo: {
    type: String,
    required: true,
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  completed: {
    type: Boolean,
    required: true,
  }
});

module.exports = mongoose.model("Todo", todoSchema);
