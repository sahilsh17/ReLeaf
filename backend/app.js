const PORT       = process.env.PORT || 3000;
const ENV        = process.env.ENV || "development";
const express    = require("express");
const bodyParser = require("body-parser");
const cors = require('cors')
require('dotenv').config();
const app        = express();
const morgan     = require('morgan');
const cookieSession = require('cookie-session');
const cookieParser = require("cookie-parser");

// Stripe setup 
const stripe = require("stripe")("pk_test_51IBuSOAj9EPpC5TEcXDX4CGoDapFJkSGFryFE06LaZOWzsBf9BBjJU22dAAmcswiJLFrNNdU9aGw2od6hfqNrkD5004yMieTFP");
const { v4: uuidV4 } = require('uuid');


// PG database client/connection setup
const { Pool } = require('pg');
const dbParams = require('./lib/db.js');
const db = new Pool(dbParams);
db.connect();

app.use(cookieSession({
  name: 'session',
  keys: ['1','2']
}));

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));


app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(cookieParser());
app.use(cors())

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const usersRoutes = require("./routes/users");
const checkoutRoute = require("./routes/checkout");
const categoriesRoutes = require("./routes/categories");
const creatorProfile = require("./routes/creatorProfile");
const creatorProfileUpdate = require("./routes/creatorProfileUpdate");
const userProducts = require("./routes/userProducts");
const contributions = require("./routes/contributions");


// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
app.use("/api/users", usersRoutes(db));
app.use("/api/categories", categoriesRoutes(db));
app.use("/api/userProducts", userProducts(db));
app.use("/api/creatorProfile", creatorProfile(db));
app.use("/api/creatorProfileUpdate", creatorProfileUpdate(db));
app.use("/api/checkout", checkoutRoute(db));
app.use("/api/contributions", contributions(db));


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
}); 