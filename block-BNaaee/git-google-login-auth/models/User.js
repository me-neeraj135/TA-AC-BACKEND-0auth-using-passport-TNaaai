/** @format */

let mongoose = require(`mongoose`);
let Schema = mongoose.Schema;

let userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    github: {
      name: { type: String },
      username: { type: String },
      avatar: { type: String },
    },
    google: {
      name: { type: String },
      avatar: { type: String },
    },
    providers: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model(`User`, userSchema);
