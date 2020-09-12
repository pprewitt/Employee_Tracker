let inquirer = require('inquirer');
var mysql = require("mysql");
const consoleTable = require("console.table");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "1891523",
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
      "View All Employees by Department",
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
      case ("View All Employees by Manager"):
        viewAllEmployeesByManager();
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

function viewAllEmployees() {
  connection.query("SELECT * FROM employee", function (err, res) {
    if (err) throw err;
    // Log all results of the SELECT statement
    console.table(res);
    beginQuestions();
  });
}

function viewAllDepartments() {
  connection.query("SELECT * FROM department", function (err, res) {
    if (err) throw err;
    // Log all results of the SELECT statement
    console.table(res);
    beginQuestions();
  });
}

function viewAllRoles() {
  connection.query("SELECT * FROM roles", function (err, res) {
    if (err) throw err;
    // Log all results of the SELECT statement
    console.table(res);
    beginQuestions();
  });
}

function viewAllEmployeesByDepartment() {
  connection.query("SELECT employee.id, employee.first_name, employee.last_name, department.name FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department department on role.department_id = department.id WHERE department.id;",
    function (error, res) {
      if (error) throw error
      console.table(res)
    })
  beginQuestions()
};

function viewAllEmployeesByManager() {
  connection.query("SELECT employee.id, employee.first_name, employee.last_name, department.name, employee.manager_id AS department, role.title FROM employee LEFT JOIN role on role.id = employee.role_id LEFT JOIN department ON department.id = role.department_id WHERE manager_id;",
    function (error, res) {
      if (error) throw error
      consoleTable(res)
    })
  beginQuestions()
};

updateRole = () => {
  //pull all the employees first
  connection.query("SELECT * FROM employee", (err, res) => {
    if (err) throw err

    //display prompt
    inquirer.prompt([
      {
        type: "list",
        name: "name",
        message: "Whose role are you updating?",
        choices: () => {
          let employeeArray = [];
          //push employees into an array to display them
          for (let i = 0; i < res.length; i++) {
            employeeArray.push(res[i].first_name + " " + res[i].last_name);
          }
          return employeeArray;
        }
      },


    ])
      // handle answer
      .then((answer) => {
        //split the name up for WHERE clause in query below
        let fullName = answer.name;
        console.log(fullName);
        let splitName = fullName.split(" ");

        connection.query("SELECT * FROM roles", (err, res) => {
          inquirer.prompt([
            {
              type: "list",
              name: "role",
              message: "What role would you like to assign?",
              choices: () => {
                let roleArray = [];
                for (let i = 0; i < res.length; i++) {
                  roleArray.push(res[i].title + " |" + res[i].id );
                }
                console.log()
                return roleArray;
              }
            }

          ])
            .then((choice) => {
              
              let roleID = choice.role.split("|")[1];
              connection.query(
                `UPDATE employee SET role_id = "${roleID}" WHERE first_name = "${splitName[0]}" and last_name = "${splitName[1]}"`,

                (err) => {
                  if (err) throw err;
                  console.log("added successfully");
                  // RETURN TO START
                  beginQuestions();
                }
              )
            })
        })

      })
  }
  )
}


addRole = () => {
  connection.query("SELECT * FROM department", (err, res) => {
    if (err) throw err

    return inquirer.prompt([

      {
        type: "input",
        name: "role",
        message: "Please name this new role:",

      },
      {
        type: "input",
        name: "salary",
        message: "Please enter the salary for this role:"
      },
      {
        type: "list",
        name: "department",
        message: "What department will this role be in?",
        choices: () => {
          let departmentArray = [];
          for (let i = 0; i < res.length; i++) {
            departmentArray.push(res[i].dept_name + " |" + res[i].id + ")");
          }
          return departmentArray;
        }
      }
    ]).then((choice) => {
      let deptID = choice.department.split("|")[1];

      connection.query(
        `INSERT into roles (title) = "${deptID}" , (salary) = "${choice.salary}", `,

        (err) => {
          if (err) throw err;
          console.log("added successfully");
          // RETURN TO START
          beginQuestions();
        }
      )
    })
  })
}

 addDepartment = () =>{
   inquirer.prompt([
     {
       type: "input",
       name: "departmentName",
       message: "What is the new department name?"
     }
         
   ]).then((choice) =>{
     let dept = choice.name
     connection.query(`INSERT into department (dept_name) = "${dept}" `,  (err, res) => {
      if (err) throw err;
      // Log all results of the SELECT statement
      console.table(res);
     })
   }
 }

// addEmployee()

// viewAllRoles()

// viewAllDepartments()

// viewAllEmployees()



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