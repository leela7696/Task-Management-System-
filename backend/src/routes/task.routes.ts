import { Router } from 'express';
import { TaskController } from '../controllers/task.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { taskValidation } from '../middleware/validation.middleware';

const router = Router();
const taskController = new TaskController();

// All task routes require authentication
router.use(authMiddleware);

router.get('/', taskController.getAll);
router.post('/', taskValidation, taskController.create);
router.get('/:id', taskController.getById);
router.patch('/:id', taskValidation, taskController.update);
router.delete('/:id', taskController.delete);
router.patch('/:id/status', taskController.updateStatus);

export default router;
