require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const noteRoute = require("./routes/note.js")
const userRoute = require("./routes/user.js")
const authRoute = require("./routes/auth.js");
const cookieParser = require("cookie-parser");
const { checkAuthentication } = require("./middleware/auth.js");



const app = express();
const port = process.env.PORT || 8000;

console.log(process.env.API_KEY)

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("MongoDb connected Successfully!"))
    .catch((err) => console.log(err))

const allowedOrigins = ['http://localhost:5173', 'https://apnanotes-1.onrender.com', 'https://apnanotes.vercel.app/'];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

app.use(cookieParser())
app.use(express.json())


app.use("/", authRoute); // ✅ enables /check-auth
app.use("/user", userRoute);
app.use("/", checkAuthentication, noteRoute);


app.listen(port, () => console.log(`Server Started At ${port}.`));