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
      "View All Employees by Department (with salaries and dept budget)",
      // "View All Employees by Manager",
      "Update an Employee Role",
      "Update an Employee's Manager",
      "Delete Employee Record",
      "Delete a Department",
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
      case ("View All Employees by Department (with salaries and dept budget)"):
        viewAllEmployeesByDepartment();
        break;
      case ("View All Employees by Manager"):
        viewAllEmployeesByManager();
        break;
      case ("Update an Employee Role"):
        updateRole();
        break;
      case ("Update an Employee's Manager"):
        updateManager();
        break;
      case ("Delete Employee Record"):
        deleteEmployee();
        break;
      case ("Delete a Department"):
        deleteDepartmentQuestions();
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

const viewAllEmployees = () => {
  connection.query("SELECT * FROM employee", function (err, res) {
    if (err) throw err;
    // Log all results of the SELECT statement
    console.table(res);
    console.log("");
    beginQuestions();
  });
}

const viewAllDepartments = () => {
  connection.query("SELECT * FROM department", function (err, res) {
    if (err) throw err;
    // Log all results of the SELECT statement
    console.table(res);
    console.log("");
    beginQuestions();
  });
}

const viewAllRoles = () => {
  connection.query("SELECT * FROM roles", function (err, res) {
    if (err) throw err;
    // Log all results of the SELECT statement
    console.table(res);
    console.log("");
    beginQuestions();
  });
}

const addEmployee = () => {
  connection.query("SELECT * FROM roles", (err, res) => {
    if (err) throw err

    return inquirer.prompt([

      {
        type: "input",
        name: "firstName",
        message: "Please enter the employee's first name:",

      },
      {
        type: "input",
        name: "lastName",
        message: "Please enter the employee's last name:"
      },
      {
        type: "list",
        name: "role",
        message: "What role is this employee filling?",
        choices: () => {
          let roleArray = [];
          for (let i = 0; i < res.length; i++) {
            roleArray.push(res[i].title + " | " + res[i].id);
          }
          return roleArray;
        }
      }
    ]).then((answer) => {
      let roleID = answer.role.split("|")[1];
      connection.query("SELECT * FROM employee", (err, res) => {
        inquirer.prompt([
          {
            type: "list",
            name: "manager",
            message: "Who will this employee report to?",
            choices: () => {
              let managerArray = [];
              for (let i = 0; i < res.length; i++) {
                managerArray.push(res[i].first_name + res[i].last_name + " | " + res[i].id);
              }
              console.log()
              return managerArray;
            }
          }

        ]).then((choice) => {
          let managerID = choice.manager.split("|")[1];
          connection.query(`INSERT into employee (first_name, last_name, role_id, manager_id) VALUES ("${answer.firstName}", "${answer.lastName}", ${roleID}, ${managerID}) `, (err, res) => {
            if (err) throw err;
            // Log all results of the SELECT statement
            console.log(`${answer.firstName} ${answer.lastName}  has been added to the team! Welcome Aboard!`);
          })
          console.log("");
          beginQuestions();
        })
      })
    })
  })
}

const addDepartment = () => {
  inquirer.prompt(
    {
      type: "input",
      name: "departmentName",
      message: "What is the new department name?"
    }

  ).then((answer) => {
    let dept = answer.departmentName
    connection.query(`INSERT into department (dept_name) VALUES ("${dept}") `, (err, res) => {
      if (err) throw err;
      // Log all results of the SELECT statement
      console.log(`${dept} has been added to departments!`);
    })
    console.log("")
    beginQuestions();
  })
}

const addRole = () => {
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
            departmentArray.push(res[i].dept_name + " | " + res[i].id);
          }
          return departmentArray;
        }
      }
    ]).then((choice) => {
      let deptID = choice.department.split("|")[1];

      connection.query(
        `INSERT into roles (title, department_id, salary) VALUES ("${choice.role}",${deptID}, "${choice.salary}") `,

        (err) => {
          if (err) throw err;
          console.log("added successfully");
          // RETURN TO START
          console.log("")
          beginQuestions();
        }
      )
    })
  })
}

const viewAllEmployeesByDepartment = () => {
  connection.query(`SELECT * FROM department`, (err, res) => {
    if (err) throw err
    inquirer.prompt(
      {
        type: "list",
        name: "whichDept",
        message: "Which department's roster would you like to view?",
        choices: () => {
          let departmentArray = [];
          //push employees into an array to display them
          for (let i = 0; i < res.length; i++) {
            departmentArray.push(res[i].dept_name + " | " + res[i].id);
          }
          return departmentArray;
        }
      }

    ).then((answer) => {
      let deptID = answer.whichDept.split("|")[1];
      connection.query(`SELECT employee.id, employee.first_name, employee.last_name, roles.salary FROM employee LEFT JOIN roles ON employee.role_id = roles.id RIGHT JOIN department department ON roles.department_id = department.id WHERE department.id = "${deptID}";`,
        function (err, res) {
          if (err) throw err
          console.table(res)
          let deptBudget = 0;
          res.forEach(employee => {
            deptBudget += parseInt(employee.salary)
          });
          console.log(`Total Dept Budget: ${deptBudget}`)
        })
      console.log("")
      beginQuestions();
    })
  }
  )

}

// function viewAllEmployeesByManager() {
//   connection.query("SELECT * from employee",
//       function (err, res) {
//           if (err) throw err
//           console.log(res)

//           // runSearch();
//       })

//   console.log("");
//   beginQuestions();
// }

const updateRole = () => {
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
                  roleArray.push(res[i].title + " | " + res[i].id);
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
                  console.log("");
                  beginQuestions();
                }
              )
            })
        })

      })
  }
  )
}

const updateManager = () => {
  //pull all the employees first
  connection.query("SELECT * FROM employee", (err, res) => {
    if (err) throw err

    //display prompt
    inquirer.prompt([
      {
        type: "list",
        name: "name",
        message: "Whose manager are you updating?",
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

        connection.query("SELECT * FROM employee", (err, res) => {
          if (err) throw err

          inquirer.prompt([
            {
              type: "list",
              name: "manager",
              message: "Who will be supervising this employee?",
              choices: () => {
                let roleArray = [];
                for (let i = 0; i < res.length; i++) {
                  roleArray.push(res[i].first_name + " " + res[i].last_name + " | " + res[i].id);
                }
                console.log()
                return roleArray;
              }
            }

          ])
            .then((choice) => {

              let managerID = choice.manager.split("|")[1];
              connection.query(
                `UPDATE employee SET manager_id = "${managerID}" WHERE first_name = "${splitName[0]}" and last_name = "${splitName[1]}"`,

                (err) => {
                  if (err) throw err;
                  console.log("added successfully");
                  // RETURN TO START
                  console.log("");
                  beginQuestions();
                }
              )
            })
        })

      })
  }
  )
}

const deleteEmployee = () => {
  connection.query("SELECT * FROM employee", function (err, res) {
    if (err) throw err;
    inquirer.prompt([
      {
        type: "list",
        name: "name",
        message: "What employee record are you deleting?",
        choices: () => {
          let employeeArray = [];
          //push employees into an array to display them
          for (let i = 0; i < res.length; i++) {
            employeeArray.push(res[i].first_name + " " + res[i].last_name + " | " + res[i].id);
          }
          return employeeArray;
        }
      },


    ]).then((choice) => {

      let employeeID = choice.name.split("|")[1];
      connection.query(
        `DELETE FROM employee WHERE employee.id = ${employeeID} `,
        (err) => {
          if (err) throw err;
          console.log("Deleted Successfully");
          // RETURN TO START
          console.log("");
          beginQuestions();
        }
      )
    })
    console.log("");
    beginQuestions();
  });
}

const deleteDepartmentQuestions = () => {
  inquirer.prompt(
    {
      name: "delete",
      type: "list",
      message: "This action will delete the department and any associated roles and employees, continue?",
        choices: [
        "Continue",
        "Start Over"
      ]
    }
    ).then(answer => {
      switch (answer.delete) {
        case ("Start Over"):
          console.log("");
          beginQuestions();
          break;
        case ("Continue"):
          deleteDept();
          break;
        default:
          console.log("An error Occurred");
          beginQuestions();
      };
    })
}
const deleteDept = () => {
  connection.query(`SELECT * FROM department`, (err, res) => {
    if (err) throw err
    inquirer.prompt([
      {
        type: "list",
        name: "name",
        message: "Which department would you like to delete?",
        choices: () => {
            let departmentArray = [];
            //push employees into an array to display them
            for (let i = 0; i < res.length; i++) {
              departmentArray.push(res[i].dept_name + " | " + res[i].id);
            }
            return departmentArray;
          }
  }
]).then((choice) => {

  let deptID = choice.name.split("|")[1];
  connection.query(
    `DELETE employee, roles, department FROM employee LEFT JOIN roles ON employee.role_id = roles.id  RIGHT JOIN department ON roles.department_id = department.id WHERE department.id = "${deptID}";`,

    (err) => {
      if (err) throw err;
      console.log("Department deleted successfully");
      // RETURN TO START
      console.log("");
      beginQuestions();
    }
  )
})
})
}

const showLogo = () => {
    console.log("");
    console.log("");
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
    console.log("");
  };