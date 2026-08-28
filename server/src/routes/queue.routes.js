const express = require('express');
const router = express.Router();
const queueController = require('../controllers/queue.controller');
const authMiddleware = require('../middlewares/authMiddleware');

// Public route to take a new ticket for a specific loket
router.post('/loket/:id/take-ticket', queueController.takeTicket);

// Protected route for admin to call the next ticket for a specific loket
router.post('/loket/:id/call-next', authMiddleware, queueController.callNext);

module.exports = router;
