let inquirer = require('inquirer');
var mysql = require("mysql");
const consoleTable = require("console.table");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "employees_DB"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  showLogo()
  // beginQuestions()
})

const showLogo = () => {
  console.log('8888888888                        888                                     ');
  console.log('888                               888                                     ');
  console.log('888                               888                                     ');
  console.log('8888888    88888b.d88b.  88888b.  888  .d88b.  888  888  .d88b.   .d88b.  ');
  console.log('888        888 "888 "88b 888 "88b 888 d88""88b 888  888 d8P  Y8b d8P  Y8b ');
  console.log('888        888  888  888 888  888 888 888  888 888  888 88888888 88888888 ');
  console.log('888        888  888  888 888 d88P 888 Y88..88P Y88b 888 Y8b.     Y8b.     ');
  console.log('8888888888 888  888  888 88888P"  888  "Y88P"   "Y88888  "Y8888   "Y8888  ');
  console.log('                         888                        888                   ');
  console.log('                         888                   Y8b d88P                   ');
  console.log('                         888                    "Y88P"                    ');
  console.log('888888888                          888                                    ');
  console.log('   888                             888                                    ');
  console.log('   888                             888                                    ');
  console.log('   888  88bd88b.  8888b.   .d88b.  888   88  .d88b.   88bd88b.            ');
  console.log('   888  888   Y8      88b d88  Y8  888  88  d8P  Y8b  888   Y8            ');
  console.log('   888  888      .d888888 888      88888    88888888  888                 ');
  console.log('   888  888      888  888 Y88.  Y8 888  88  Y8b.      888                 ');
  console.log('   888  888      "Y888888  "Y88P"  888   88  "Y8888   888                 ');
};