const express = require("express");
var session = require("express-session");
const expressLayouts = require("express-ejs-layouts");
const bodyParser = require("body-parser");
const LocalStorage = require("node-localstorage").LocalStorage;
const localStorage = require("localStorage");
var cookieParser = require("cookie-parser");

var locuriRezervate = "";

const app = express();
app.use(
  session({
    key: "session",
    secret: "secret",
    resave: false,
    saveUninitialized: true,
  })
);

var mysql = require("mysql");
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "tickets",
});
con.connect(function (err) {
  if (err) throw err;
  console.log("Connected to tickets!");
});

const port = 6789;
const fs = require("fs");

// directorul 'views' va conține fișierele .ejs (html + js executat la server)
app.set("view engine", "ejs");

// suport pentru layout-uri - implicit fișierul care reprezintă template-ul site-ului este views/layout.ejs
app.use(expressLayouts);
// directorul 'public' va conține toate resursele accesibile direct de către client (e.g., fișiere css, javascript, imagini)
app.use(express.static("public"));
// corpul mesajului poate fi interpretat ca json; datele de la formular se găsesc în format json în req.body
app.use(bodyParser.json());
// utilizarea unui algoritm de deep parsing care suportă obiecte în obiecte
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// la accesarea din browser adresei http://localhost:6789/ se va returna textul 'Hello World'
// proprietățile obiectului Request - req - https://expressjs.com/en/api.html#req
// proprietățile obiectului Response - res - https://expressjs.com/en/api.html#res
var produse = 1;
var mesaj = null;
app.get("/", (req, res) => {
  console.log(req.body);
  //res.clearCookie("locuri");
  res.render("index");
});

app.get("/gallery", (req, res) => {
  console.log(req.body);
  res.render("gallery");
});
app.get("/concerts", (req, res) => {
  console.log(req.body);
  //res.cookie('locuri', 'buna');
  //res.cookie('locuri', locuriRezervate);
  //let locuriRez=req.cookies["locuri"];
  //res.render('concerts',{'locuriRez':(locuriRez)? locuriRez:'locuri'});
  res.cookie("locuriRezervate", locuriRezervate);
  res.render("concerts");
});

app.get("/ticket", (req, res) => {
  res.clearCookie("locuriRezervate");
  res.cookie("locuriRezervate", locuriRezervate);
  res.render("ticket");
});
app.get("/about", (req, res) => {
  console.log(req.body);
  res.render("about");
});
app.get("/desprenoi", (req, res) => {
  console.log(req.body);
  res.render("desprenoi");
});

// app.get('/desprenoi',(req,res) =>{
// 	console.log(req.body);
// 	res.render('desprenoi');
// });

app.get("/register", async (req, res) => {
  res.render("register");
});
app.get("/contact", (req, res) => {
  console.log(req.body);
  res.render("contact");
});

app.get("/autent", (req, res) => {
  //res.render('autentificare.ejs');
  let error = req.cookies["mesajEroare"];

  res.render("autent", { error: error ? error : "mesajEroare" });
});

app.get("/register2", (req, res) => {
  //res.render('autentificare.ejs');
  let errorRegister = req.cookies["mesajEroareRegister"];

  res.render("register2", {
    errorRegister: errorRegister ? errorRegister : "mesajEroareRegister",
  });
});
app.get("/login", (req, res) => {
  console.log(req.body);
  res.render("login");
});
app.post("/login", (req, res) => {
  console.log(req.body["email"]);
  //cookies
  res.clearCookie("email");
  res.clearCookie("password");

  console.log(req.body["password"]);
  var aux = JSON.stringify(req.body);
  var x = JSON.parse(aux);

  fs.writeFile("inregistrari.json", aux, function (err) {
    if (err) {
      return console.log(err);
    }
    console.log("S-a adaugat cu succes in fisierul inregistrari.json!");
  });

  var sql = "select lastname from inregistrari where email=?;";
  //res.render('index')

  con.query(sql, [req.body["email"]], function (err, result1) {
    console.log(result1);
    if (result1.length > 0) {
      res.cookie("email", req.body["email"]);
      var sql2 = "select lastname from inregistrari where password=? ;";
      con.query(sql2, [req.body["password"]], function (err, result2) {
        if (result2.length > 0) {
          console.log("OK");
          res.cookie("password", req.body["password"]);
          res.render("index");
        } else {
          console.log("Eroare!Nu se gaseste parola!");
          //res.render('index')
          res.cookie("mesajEroare", "Wrong password!");
          res.redirect("/autent");
        }
      });
    } else {
      //res.render('index')
      res.cookie("mesajEroare", "Wrong email!");
      res.redirect("/autent");
      console.log("Eroare!Nu se gaseste email-ul!");
    }
  });
});
app.post("/ticket", (req, res) => {
  //res.clearCookie("locuri");
  console.log("heeeeiii" + req.body.concertName);
  var rezervat = [];
  con.query(
    "SELECT loc_rezervat FROM concert where name =?;",
    req.body.concertName,
    function (err, result, fields) {
      if (err) throw err;

      for (let i = 0; i < result.length; i++) {
        rezervat.push(result[i].loc_rezervat);
        locuriRezervate += "," + result[i].loc_rezervat;
      }
      console.log("Locuri rezervate " + rezervat);
      //locuriRezervate=rezervat;
      console.log("LocuriRezervateGlobal " + locuriRezervate);
      // JSON.stringify(rezervat)
      //res.cookie('locuri', locuriRezervate);
    }
  );
  res.render("ticket");
});
app.post("/adauga-client", (req, res) => {


console.log(req.body["email"]);
console.log(req.body["phonenumber"]);

  res.clearCookie("email");
  res.clearCookie("phonenumber");
  // console.log(locuriOcupate);
  var aux = JSON.stringify(req.body);
  console.log(aux)
  var x = JSON.parse(aux);
  console.log(aux)

  /*fs.writeFile("inregistrari.json", aux, function (err) {
    if (err) {
      return console.log(err);
    }
    console.log("S-a adaugat cu succes in fisier!");
  });
*/
  /*verificare email*/
  var sql2 = "select lastname from inregistrari where email=?;";
  con.query(sql2, [req.body["email"]], function (err, data) {
    if (data.length > 0) {
      res.cookie("mesajEroareRegister", "This email address already exists!");
      res.redirect("/register2");
      console.log("Exista deja un client cu aceasta adresa de email!");
      var sql3 = "select lastname from inregistrari where phonenumber=?;";
      con.query(sql3, [req.body["phonenumber"]], function (err, result) {
        if (result.length > 0) {
          //alert('An account with that email address already exists');
          console.log("Exista deja un client cu acest numar de telefon!");
          //res.render('index')
          res.cookie(
            "mesajEroareRegister",
            "This phone number already exists!"
          );
          res.redirect("/register2");
        }
      });
    } else {
      /*Verificare numar de telefon*/
     // res.cookie("email", req.body["email"]);

      var sql3 = "select lastname from inregistrari where phonenumber=?;";
      con.query(sql3, [req.body["phonenumber"]], function (err, result) {
        if (result.length > 0) {
          //res.cookie("mesajEroareRegister","This phone number already exists!")
          res.redirect("/register2");

          console.log("Exista deja un client cu acest numar de telefon!");
          //res.render('index')
        } else {
          //res.cookie("phonenumber",req.body["phonenumber"])
          console.log("vaaaii");
          var sql4 =
            "insert ignore into inregistrari (firstname, lastname,email,phonenumber, password) values(?);";
          var values = [
            x.firstname,
            x.lastname,
            x.email,
            x.phonenumber,
            x.password,
          ];
          console.log(values);

          con.query(sql4, [values], function (err, result) {
            console.log("Contul s-a creat cu succes!");
          //  res.render("login");
          });
        }
      });
    }
  });
  var reserved = req.body["places"];
  var locuri = reserved.split(";");
  var locuriOcupate = [];
  for (let i = 0; i < locuri.length - 1; i++) {
    var rand = locuri[i].split("/")[0];
    var coloana = locuri[i].split("/")[1];
    var loc = 15 * (rand - 1) + (coloana - 1);
    locuriOcupate.push(loc);
    //console.log(loc);
  }
  //console.log(locuriOcupate);
  var aux = JSON.stringify(req.body);
  var x = JSON.parse(aux);

  fs.writeFile("inregistrari.json", aux, function (err) {
    if (err) {
      return console.log(err);
    }
    console.log("S-a adaugat cu succes!");
  });

  var rezervat = [];
  con.query(
    "SELECT loc_rezervat FROM concert where name =?;",
    req.body["name"],
    function (err, result, fields) {
      if (err) throw err;

      for (let i = 0; i < result.length; i++) {
        rezervat.push(result[i].loc_rezervat);
      }
      console.log("Locuri rezervate " + rezervat);
    }
  );

  // con.query(sql1,[values], function (err, result)
  // {
  // 	if (err) throw err;
  // 	console.log("1 record inserted");

  var sql2 = "insert into concert( name,loc_rezervat,pret) values(?);";
  var price = req.body["price"];
  var name = req.body["name"];
  var locuri = reserved.split(";");
  //console.log(locuri);
  //console.log(reserved)
  //console.log(price)
  for (let i = 0; i < locuriOcupate.length; i++) {
    var values = [name, locuriOcupate[i], price];
    con.query(sql2, [values], function (err, result) {
      if (err) throw err;
      console.log("1 record inserted");
    });
  }

  res.render("login");
});

app.listen(port, () =>
  console.log(`Serverul rulează la adresa http://localhost:`)
);
