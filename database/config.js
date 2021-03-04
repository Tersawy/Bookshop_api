const mongoose = require("mongoose")

mongoose.set("useUnifiedTopology", true)

mongoose.set("useCreateIndex", true)

mongoose.set("runValidators", true)

mongoose
	.connect(process.env.DB_URL, { useNewUrlParser: true })
	.then(() => console.log("Connected To Database...."))
	.catch(err => console.error(err))
