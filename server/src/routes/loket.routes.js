const express = require('express');
const router = express.Router();
const loketController = require('../controllers/loket.controller');
const authMiddleware = require('../middlewares/authMiddleware');

// Public route to get available lokets
router.get('/', loketController.getAllLoket);
router.get('/:id', loketController.getLoketById);

// Protected routes for admin management
router.post('/', authMiddleware, loketController.createLoket);
router.put('/:id', authMiddleware, loketController.updateLoket);
router.delete('/:id', authMiddleware, loketController.deleteLoket);

module.exports = router;
