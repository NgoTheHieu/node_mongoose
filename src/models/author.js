const mongoose = require("mongoose");

// create schema 
const authorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Author name is required"],
    trim: true,
    validate: {
      validator: function (v) {
        return typeof v === "string";
      }
    }
  }
})
authorSchema.pre("save", function (next) {
  console.log(typeof this.name)
  next()
})



const Author = mongoose.model("Author", authorSchema);

module.exports = Author;




// create model



//export model