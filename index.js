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
// shows sign-up or login screen
app.get("/", waiterRoute.home);
// shows login screen for waiters
app.get("/adminlogin", waiterRoute.adminLoginForm);
// action taken on the sign-up button, to submit the sign-up form
app.post("/register", waiterRoute.formDetails);
// action taken on the login button, to submit admins login form
app.post("/adminlogin", waiterRoute.adminLoginDetails);
// shows waiters page, which displays days of the week
app.get("/waiters", waiterRoute.waitersPage);
// shows admins page and displays the schedule, together with who's on the clock for the week.
app.get("/admin", waiterRoute.adminPage);
// sends data to frontend about which days are over, fully, under, booked.
app.get("/info", waiterRoute.info);
// sends data to frontend about the waiter names and their working days.
app.get("/inform", waiterRoute.inform);
// action taken on the add days button, on the waiters page.
app.post("/days", waiterRoute.days);
// action taken on the reset schedule button, on the admins page.
app.get("/resetschedule", waiterRoute.reset);
/* -------------------- ALL ROUTES -------------------- */

// CREATE PORT VARIABLE
const PORT = process.env.PORT || 3002;
// GET NOTIFIED WHEN APP STARTS SUCCESSFULLY
app.listen(PORT, function () {
  console.log(`app started on port: ${PORT}`);
});
