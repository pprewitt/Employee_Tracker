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

connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  showLogo()
  beginQuestions()
})

const beginQuestions = () => {
  return inquirer.prompt({
    name: "userSelection",
    type: "list",
    message: "What would you like to do today?",
    choices: [
      "View All Employees",
      "View All Departments",
      "View All Roles",
      "Add a New Employee",
      "Add a New Department",
      "Add a New Role",
      "Update an Employee Role",
      "End Application"
    ]
  }).then(answer => {
  switch (answer.userSelection) {
    case ("View All Employees"):
      viewAllEmployees();
      break;
    case ("View All Departments"):
      viewAllDepartments();
      break;
    case ("View All Roles"):
      viewAllRoles();
      break;
    case ("Add a New Employee"):
      addEmployee();
      break;
    case ("Add a New Department"):
      addDepartment();
      break;
    case ("Add a New Role"):
      addRole();
      break;
    case ("View All Employees by Department"):
      viewAllEmployeesByDepartment();
      break;
    case ("Update an Employee Role"):
      updateRole();
      break;
    case ("End Application"):
      console.log("Goodbye!");
      showLogo();
      connection.end();
      break;
    default:
      console.log("An error Occurred");
      connection.end();
  }
});
}



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