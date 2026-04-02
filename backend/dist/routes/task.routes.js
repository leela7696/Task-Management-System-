"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const task_controller_1 = require("../controllers/task.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const validation_middleware_1 = require("../middleware/validation.middleware");
const router = (0, express_1.Router)();
const taskController = new task_controller_1.TaskController();
// All task routes require authentication
router.use(auth_middleware_1.authMiddleware);
router.get('/', taskController.getAll);
router.post('/', validation_middleware_1.taskValidation, taskController.create);
router.get('/:id', taskController.getById);
router.patch('/:id', validation_middleware_1.taskValidation, taskController.update);
router.delete('/:id', taskController.delete);
router.patch('/:id/toggle', taskController.toggle);
exports.default = router;
