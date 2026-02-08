import express from 'express';
const router = express.Router();
import { sendMessage } from '../controllers/chatController.js';

router.post('/', sendMessage);

export default router;
