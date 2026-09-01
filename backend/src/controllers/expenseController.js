const mongoose = require("mongoose");

const Expense = require("../models/Expense");

// =====================================================
// Get Expense Statistics
// =====================================================

const getExpenseStats = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(
      req.user._id
    );

    const now = new Date();

    // =================================================
    // Current Month
    // =================================================

    const startOfCurrentMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    );

    const startOfNextMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      1
    );

    // =================================================
    // Last 6 Months
    // =================================================

    const startOfSixMonthsAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 5,
      1
    );

    // =================================================
    // Total Spending + Transactions
    // =================================================

    const totalResult = await Expense.aggregate([
      {
        $match: {
          user: userId,
        },
      },
      {
        $group: {
          _id: null,

          totalSpent: {
            $sum: "$amount",
          },

          totalTransactions: {
            $sum: 1,
          },
        },
      },
    ]);

    const totalSpent =
      totalResult.length > 0
        ? totalResult[0].totalSpent
        : 0;

    const totalTransactions =
      totalResult.length > 0
        ? totalResult[0].totalTransactions
        : 0;

    // =================================================
    // This Month Spending
    // =================================================

    const currentMonthResult =
      await Expense.aggregate([
        {
          $match: {
            user: userId,

            date: {
              $gte: startOfCurrentMonth,
              $lt: startOfNextMonth,
            },
          },
        },
        {
          $group: {
            _id: null,

            amount: {
              $sum: "$amount",
            },
          },
        },
      ]);

    const thisMonth =
      currentMonthResult.length > 0
        ? currentMonthResult[0].amount
        : 0;

    // =================================================
    // Average Expense
    // =================================================

    const averageExpense =
      totalTransactions > 0
        ? totalSpent / totalTransactions
        : 0;

    // =================================================
    // Category Breakdown
    // =================================================

    const categoryResult =
      await Expense.aggregate([
        {
          $match: {
            user: userId,
          },
        },
        {
          $group: {
            _id: "$category",

            amount: {
              $sum: "$amount",
            },
          },
        },
        {
          $sort: {
            amount: -1,
          },
        },
      ]);

    const topCategory =
      categoryResult.length > 0
        ? categoryResult[0]._id
        : "—";

    const categoryBreakdown =
      categoryResult.map((item) => ({
        category: item._id,
        amount: item.amount,
      }));

    // =================================================
    // Monthly Spending - Last 6 Months
    // =================================================

    const monthlyResult =
      await Expense.aggregate([
        {
          $match: {
            user: userId,

            date: {
              $gte: startOfSixMonthsAgo,
              $lt: startOfNextMonth,
            },
          },
        },
        {
          $group: {
            _id: {
              year: {
                $year: "$date",
              },

              month: {
                $month: "$date",
              },
            },

            amount: {
              $sum: "$amount",
            },
          },
        },
        {
          $sort: {
            "_id.year": 1,
            "_id.month": 1,
          },
        },
      ]);

    // =================================================
    // Create 6 Months
    // =================================================

    const monthlySpending = [];

    for (let i = 5; i >= 0; i--) {
      const date = new Date(
        now.getFullYear(),
        now.getMonth() - i,
        1
      );

      const year = date.getFullYear();

      const month = date.getMonth() + 1;

      const monthData =
        monthlyResult.find(
          (item) =>
            item._id.year === year &&
            item._id.month === month
        );

      monthlySpending.push({
        year,

        month,

        label: date.toLocaleDateString(
          "en-IN",
          {
            month: "short",
            year: "numeric",
          }
        ),

        amount: monthData
          ? monthData.amount
          : 0,
      });
    }

    // =================================================
    // Response
    // =================================================

    res.status(200).json({
      success: true,

      stats: {
        totalSpent,
        thisMonth,
        averageExpense,
        totalTransactions,
        topCategory,
      },

      monthlySpending,

      categoryBreakdown,
    });
  } catch (error) {
    console.error(
      "Failed to get expense statistics:",
      error
    );

    res.status(500).json({
      message:
        error.message ||
        "Failed to get expense statistics",
    });
  }
};

// =====================================================
// Create Expense
// =====================================================

const createExpense = async (req, res) => {
  try {
    const {
      title,
      amount,
      category,
      date,
      description,
    } = req.body;

    if (
      !title ||
      amount === undefined ||
      !category ||
      !date
    ) {
      return res.status(400).json({
        message:
          "Title, amount, category and date are required",
      });
    }

    const expense = await Expense.create({
      user: req.user._id,
      title,
      amount,
      category,
      date,
      description,
    });

    res.status(201).json({
      message:
        "Expense created successfully",

      expense,
    });
  } catch (error) {
    console.error(
      "Create expense error:",
      error
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};

// =====================================================
// Get User Expenses
// =====================================================

const getExpenses = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      category = "all",
      month = "",
    } = req.query;

    const currentPage = Math.max(
      Number(page),
      1
    );

    const itemsPerPage = Math.min(
      Math.max(Number(limit), 1),
      100
    );

    const skip =
      (currentPage - 1) * itemsPerPage;

    // =================================================
    // Base Query
    // =================================================

    const query = {
      user: req.user.id,
    };

    // =================================================
    // Search
    // =================================================

    if (search.trim()) {
      query.$or = [
        {
          title: {
            $regex: search.trim(),
            $options: "i",
          },
        },

        {
          category: {
            $regex: search.trim(),
            $options: "i",
          },
        },

        {
          description: {
            $regex: search.trim(),
            $options: "i",
          },
        },
      ];
    }

    // =================================================
    // Category Filter
    // =================================================

    if (
      category &&
      category !== "all"
    ) {
      query.category = category;
    }

    // =================================================
    // Month Filter
    // =================================================

    if (month) {
      const [year, monthNumber] =
        month.split("-");

      const startDate = new Date(
        Number(year),
        Number(monthNumber) - 1,
        1
      );

      const endDate = new Date(
        Number(year),
        Number(monthNumber),
        1
      );

      query.date = {
        $gte: startDate,
        $lt: endDate,
      };
    }

    // =================================================
    // Count
    // =================================================

    const totalExpenses =
      await Expense.countDocuments(query);

    // =================================================
    // Fetch Expenses
    // =================================================

    const expenses =
      await Expense.find(query)
        .sort({
          date: -1,
          createdAt: -1,
        })
        .skip(skip)
        .limit(itemsPerPage);

    // =================================================
    // Pagination
    // =================================================

    const totalPages = Math.ceil(
      totalExpenses / itemsPerPage
    );

    // =================================================
    // Response
    // =================================================

    res.status(200).json({
      success: true,

      expenses,

      pagination: {
        currentPage,
        totalPages,
        totalExpenses,
        limit: itemsPerPage,
      },
    });
  } catch (error) {
    console.error(
      "Get expenses error:",
      error
    );

    res.status(500).json({
      message:
        error.message ||
        "Failed to fetch expenses",
    });
  }
};

// =====================================================
// Get Single Expense
// =====================================================

const getExpense = async (req, res) => {
  try {
    const expense =
      await Expense.findOne({
        _id: req.params.id,
        user: req.user._id,
      });

    if (!expense) {
      return res.status(404).json({
        message: "Expense not found",
      });
    }

    res.status(200).json({
      expense,
    });
  } catch (error) {
    console.error(
      "Get expense error:",
      error
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};

// =====================================================
// Update Expense
// =====================================================

const updateExpense = async (
  req,
  res
) => {
  try {
    const {
      title,
      amount,
      category,
      date,
      description,
    } = req.body;

    const expense =
      await Expense.findOneAndUpdate(
        {
          _id: req.params.id,

          user: req.user._id,
        },

        {
          title,
          amount,
          category,
          date,
          description,
        },

        {
          returnDocument: "after",

          runValidators: true,
        }
      );

    if (!expense) {
      return res.status(404).json({
        message: "Expense not found",
      });
    }

    res.status(200).json({
      message:
        "Expense updated successfully",

      expense,
    });
  } catch (error) {
    console.error(
      "Update expense error:",
      error
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};

// =====================================================
// Delete Expense
// =====================================================

const deleteExpense = async (
  req,
  res
) => {
  try {
    const expense =
      await Expense.findOneAndDelete({
        _id: req.params.id,

        user: req.user._id,
      });

    if (!expense) {
      return res.status(404).json({
        message: "Expense not found",
      });
    }

    res.status(200).json({
      message:
        "Expense deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete expense error:",
      error
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};

// =====================================================
// Export Controllers
// =====================================================

module.exports = {
  createExpense,
  getExpenses,
  getExpense,
  getExpenseStats,
  updateExpense,
  deleteExpense,
};