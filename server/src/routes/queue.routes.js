const express = require('express');
const router = express.Router();
const queueController = require('../controllers/queue.controller');
const authMiddleware = require('../middlewares/authMiddleware');

// Public route to get current status of a loket queue
router.get('/loket/:id/status', queueController.getStatus);

// Public route to take a new ticket for a specific loket
router.post('/loket/:id/take-ticket', queueController.takeTicket);

// Protected route for admin to call the next ticket for a specific loket
router.post('/loket/:id/call-next', authMiddleware, queueController.callNext);

// Protected routes for admin to mark ticket as done or skipped
router.post('/loket/:id/ticket/:ticketId/done', authMiddleware, queueController.markDone);
router.post('/loket/:id/ticket/:ticketId/skip', authMiddleware, queueController.markSkipped);

// Protected route to get full queue status for admin dashboard
router.get('/loket/:id/admin-status', authMiddleware, queueController.getAdminStatus);

module.exports = router;
