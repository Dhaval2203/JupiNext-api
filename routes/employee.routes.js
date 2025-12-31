const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employee.controller');

// GET all employees
router.get('/', employeeController.getEmployees);
router.get('/employees', employeeController.getEmployees);

// CREATE employee
router.post('/', employeeController.createEmployee);

// UPDATE employee
router.put('/:id', employeeController.updateEmployee);

// DELETE employee
router.delete('/:id', employeeController.deleteEmployee);

module.exports = router;
