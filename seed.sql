INSERT INTO department (dept_name, id)
VALUES  ("Management", 1), ("Accounting & Finance", 2), ("Sales", 3), ("Operations", 4), 
("Information Technology", 5);
INSERT INTO roles (id, title, salary, department_id) 
VALUES  (1, "President/CEO", 100000.00, 1), (2, "Chief Accountant/CFO", 100000.00, 2), (3, "Director of Sales", 100000.00, 3), 
(4, "Director of Operations", 95000.00, 4), (5, "Director of IT", 85000.00, 5), (8, "Pricing Analyst", 80000.00, 2), 
(9, "Regional Sales Rep", 75000.00, 3), (7, "Operations Manager", 75000.00, 4), (10, "Engineer", 75000.00, 5), (11, "Call Center Associate", 55000.00, 4);
INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (1, "David", "Wallace", 1, null), (2, "Oscar", "Martinez", 2, 1), (3, "Michael", "Scott", 3, 1), (4, "Dwight", "Schrute", 4, 2), 
(5, "Toby", "Flenderson", 5, 1), (6, "Kevin", "Malone", 8, 2), (7, "James", "Halpert", 9, 3), (8, "Creed", "Bratton", 7, 4), (9, "Kelly", "Kapur", 11, 7);
