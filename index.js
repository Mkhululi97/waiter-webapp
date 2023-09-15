/* ##### BRING IN EXPRESS ##### */
import express from "express";
/* ##### BRING IN HANDLEBARS ##### */
import { engine } from "express-handlebars";
/* ##### BRING IN BOBYPARSER ##### */
import bodyParser from "body-parser";
/* ##### BRING IN EXPRESS-FLASH ##### */
import flash from "express-flash";
/* ##### BRING IN EXPRESS-SESSION ##### */
import session from "express-session";
/* ##### BRING IN WAITER FACTORY FUNCTION ##### */
import Waiter from "./Waiter.js";
/* ##### BRING IN THE DATABASE ##### */
import db from "./database.js";
/* ##### BRING IN WAITER ROUTE ##### */
import routesFunction from "./routes/waiterRoute.js";
/* ##### BRING IN DATABASE FACTORY FUNCTION ##### */
import dbFunctions from "./Waiterdb.js";

/* -------------------- ALL INSTANCES -------------------- */

/* INITIALIZE EXPRESS */
const app = express();
/* INITIALIZE FACTORY FUNCTION */
const factoryFunc = Waiter();
/* INITIALIZE DATABASE FACTORY FUNCTION */
const dbFunc = dbFunctions(db);
/* INITIALIZE ROUTES FUNCTION */
const waiterRoute = routesFunction(factoryFunc, dbFunc);

/* -------------------- ALL INSTANCES -------------------- */

/* -------------------- SETUP ENGINE -------------------- */
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");

/* -------------------- GET ACCESS TO OUR STATIC FILES -------------------- */
app.use(express.static("public"));

/* -------------------- USE BODY PARSER -------------------- */
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
/* -------------------- USE BODY PARSER -------------------- */

/* -------------------- USE SESSION MIDDLEWARE -------------------- */
app.use(
  session({
    secret: "mkhululicoder",
    resave: true,
    saveUninitialized: true,
  })
);

/* -------------------- USE FLASH MIDDLEWARE -------------------- */
app.use(flash());
/* -------------------- ALL ROUTES -------------------- */
app.get("/", waiterRoute.home);
app.post("/register", waiterRoute.register);
app.get("/waiters", waiterRoute.waitersPage);
app.get("/admin", waiterRoute.adminPage);
app.get("/info", waiterRoute.info);
app.post("/days", waiterRoute.days);
/* -------------------- ALL ROUTES -------------------- */

// CREATE PORT VARIABLE
const PORT = process.env.PORT || 3002;
// GET NOTIFIED WHEN APP STARTS SUCCESSFULLY
app.listen(PORT, function () {
  console.log(`app started on port: ${PORT}`);
});
