const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
  createExpense,
  getExpenses,
  getExpense,
  getExpenseStats,
  updateExpense,
  deleteExpense,
} = require("../controllers/expenseController");

const router = express.Router();

// Protect all expense routes
router.use(protect);

// Create expense
router.post("/", createExpense);

// Get paginated expenses
router.get("/", getExpenses);

// Get expense statistics
router.get("/stats", getExpenseStats);

// Get single expense
router.get("/:id", getExpense);

// Update expense
router.put("/:id", updateExpense);

// Delete expense
router.delete("/:id", deleteExpense);

module.exports = router;