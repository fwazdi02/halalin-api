/* eslint-disable no-console */
const mongoose = require("mongoose")
const mongoosePaginate = require("mongoose-paginate-v2")

const MONGO_HOST = process.env.MONGO_HOST || "localhost"
const MONGO_DB = process.env.MONGO_DB || "halalin"
const MONGO_PORT = process.env.MONGO_PORT || "27017"

let connection = null
connection = `mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}`

mongoose.connect(connection, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const db = mongoose.connection
db.on("error", console.error.bind(console, "DB Connection Error:"))
db.once("open", () => {
  console.log("DB is ready.", new Date())
})
module.exports = db

mongoosePaginate.paginate.options = {
  lean: true,
  limit: 20
}
