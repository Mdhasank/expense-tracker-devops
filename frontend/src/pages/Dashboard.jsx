import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import ExpenseCard from "../components/ExpenseCard";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseFilters from "../components/ExpenseFilters";
import SpendingChart from "../components/SpendingChart";

import {
  createExpense,
  deleteExpense,
  getExpenses,
  getExpenseStats,
  updateExpense,
} from "../services/expenseService";

const Dashboard = () => {
  // =====================================================
  // Expenses
  // =====================================================

  const [expenses, setExpenses] = useState([]);

  const [loading, setLoading] =
    useState(true);

  // =====================================================
  // Dashboard Statistics
  // =====================================================

  const [stats, setStats] = useState({
    totalSpent: 0,
    thisMonth: 0,
    averageExpense: 0,
    totalTransactions: 0,
    topCategory: "—",
  });

  const [monthlySpending, setMonthlySpending] =
    useState([]);

  const [categoryBreakdown, setCategoryBreakdown] =
    useState([]);

  // =====================================================
  // Expense Modal
  // =====================================================

  const [showForm, setShowForm] =
    useState(false);

  const [editingExpense, setEditingExpense] =
    useState(null);

  // =====================================================
  // Filters
  // =====================================================

  const [search, setSearch] =
    useState("");

  const [category, setCategory] =
    useState("all");

  const [month, setMonth] =
    useState("");

  // =====================================================
  // Pagination
  // =====================================================

  const [pagination, setPagination] =
    useState({
      currentPage: 1,
      totalPages: 1,
      totalExpenses: 0,
      limit: 10,
    });

  // =====================================================
  // Load Expenses
  // =====================================================

  const loadExpenses = async (
    page = 1
  ) => {
    try {
      setLoading(true);

      const data = await getExpenses({
        page,
        limit: 10,
        search,
        category,
        month,
      });

      setExpenses(
        data.expenses || []
      );

      setPagination(
        data.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalExpenses: 0,
          limit: 10,
        }
      );
    } catch (error) {
      console.error(
        "Failed to load expenses:",
        error
      );

      setExpenses([]);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // Load Dashboard Statistics
  // =====================================================

  const loadStats = async () => {
    try {
      const data =
        await getExpenseStats();

      setStats(
        data.stats || {
          totalSpent: 0,
          thisMonth: 0,
          averageExpense: 0,
          totalTransactions: 0,
          topCategory: "—",
        }
      );

      setMonthlySpending(
        data.monthlySpending || []
      );

      setCategoryBreakdown(
        data.categoryBreakdown || []
      );
    } catch (error) {
      console.error(
        "Failed to load expense statistics:",
        error
      );
    }
  };

  // =====================================================
  // Load Expenses When Filters Change
  // =====================================================

  useEffect(() => {
    loadExpenses(1);
  }, [
    search,
    category,
    month,
  ]);

  // =====================================================
  // Load Statistics On Dashboard Load
  // =====================================================

  useEffect(() => {
    loadStats();
  }, []);

  // =====================================================
  // Create Expense
  // =====================================================

  const handleCreate = async (
    data
  ) => {
    try {
      await createExpense(data);

      setShowForm(false);

      setEditingExpense(null);

      await Promise.all([
        loadExpenses(1),
        loadStats(),
      ]);
    } catch (error) {
      console.error(
        "Failed to create expense:",
        error
      );
    }
  };

  // =====================================================
  // Update Expense
  // =====================================================

  const handleUpdate = async (
    data
  ) => {
    try {
      await updateExpense(
        editingExpense._id,
        data
      );

      setEditingExpense(null);

      setShowForm(false);

      await Promise.all([
        loadExpenses(
          pagination.currentPage
        ),
        loadStats(),
      ]);
    } catch (error) {
      console.error(
        "Failed to update expense:",
        error
      );
    }
  };

  // =====================================================
  // Delete Expense
  // =====================================================

  const handleDelete = async (
    id
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this expense?"
      );

    if (!confirmed) {
      return;
    }

    try {
      await deleteExpense(id);

      const nextPage =
        expenses.length === 1 &&
        pagination.currentPage > 1
          ? pagination.currentPage - 1
          : pagination.currentPage;

      await Promise.all([
        loadExpenses(nextPage),
        loadStats(),
      ]);
    } catch (error) {
      console.error(
        "Failed to delete expense:",
        error
      );
    }
  };

  // =====================================================
  // Edit Expense
  // =====================================================

  const handleEdit = (
    expense
  ) => {
    setEditingExpense(expense);

    setShowForm(true);
  };

  // =====================================================
  // Close Expense Form
  // =====================================================

  const handleCloseForm = () => {
    setShowForm(false);

    setEditingExpense(null);
  };

  // =====================================================
  // Clear Filters
  // =====================================================

  const handleClearFilters = () => {
    setSearch("");

    setCategory("all");

    setMonth("");
  };

  // =====================================================
  // Render
  // =====================================================

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-8 lg:px-8">

        {/* =================================================
            Header
        ================================================== */}

        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">
              Overview
            </p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Expense Dashboard
            </h1>

            <p className="mt-2 text-sm text-slate-500 sm:text-base">
              Keep track of where your money goes.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setEditingExpense(null);

              setShowForm(true);
            }}
            className="w-full rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-700 sm:w-auto"
          >
            + Add Expense
          </button>
        </div>

        {/* =================================================
            Statistics Cards
        ================================================== */}

        <div className="mt-6 grid gap-4 sm:mt-8 sm:grid-cols-2 xl:grid-cols-4">

          {/* Total Spent */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <p className="text-sm font-medium text-slate-500">
              Total Spent
            </p>

            <p className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">
              ₹
              {Number(
                stats.totalSpent
              ).toLocaleString(
                "en-IN"
              )}
            </p>

            <p className="mt-2 text-xs text-slate-400">
              Across all your expenses
            </p>
          </div>

          {/* This Month */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <p className="text-sm font-medium text-slate-500">
              This Month
            </p>

            <p className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">
              ₹
              {Number(
                stats.thisMonth
              ).toLocaleString(
                "en-IN"
              )}
            </p>

            <p className="mt-2 text-xs text-slate-400">
              Current month spending
            </p>
          </div>

          {/* Transactions */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <p className="text-sm font-medium text-slate-500">
              Transactions
            </p>

            <p className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">
              {stats.totalTransactions}
            </p>

            <p className="mt-2 text-xs text-slate-400">
              Total expense records
            </p>
          </div>

          {/* Top Category */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <p className="text-sm font-medium text-slate-500">
              Top Category
            </p>

            <p className="mt-3 truncate text-xl font-bold text-slate-900 sm:text-2xl">
              {stats.topCategory}
            </p>

            <p className="mt-2 text-xs text-slate-400">
              Average ₹
              {Number(
                stats.averageExpense
              ).toLocaleString(
                "en-IN",
                {
                  maximumFractionDigits: 0,
                }
              )}{" "}
              per transaction
            </p>
          </div>
        </div>

        {/* =================================================
            Filters
        ================================================== */}

        <div className="mt-6">
          <ExpenseFilters
            search={search}
            setSearch={setSearch}
            category={category}
            setCategory={setCategory}
            month={month}
            setMonth={setMonth}
          />
        </div>

        {/* =================================================
            Chart + Categories
        ================================================== */}

        <div className="mt-6 grid gap-6 lg:grid-cols-3">

          {/* Spending Chart */}

          <div className="lg:col-span-2">
            <SpendingChart
              monthlySpending={
                monthlySpending
              }
            />
          </div>

          {/* Category Breakdown */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

            <h2 className="text-lg font-semibold text-slate-900">
              Categories
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Spending distribution
            </p>

            <div className="mt-6 space-y-5">

              {categoryBreakdown.map(
                (item) => {
                  const amount =
                    Number(
                      item.amount
                    );

                  const percentage =
                    Number(
                      stats.totalSpent
                    ) > 0
                      ? (amount /
                          Number(
                            stats.totalSpent
                          )) *
                        100
                      : 0;

                  return (
                    <div
                      key={
                        item.category
                      }
                    >
                      <div className="flex items-center justify-between gap-3 text-sm">

                        <span className="truncate font-medium text-slate-700">
                          {
                            item.category
                          }
                        </span>

                        <span className="shrink-0 font-semibold text-slate-900">
                          ₹
                          {amount.toLocaleString(
                            "en-IN"
                          )}
                        </span>
                      </div>

                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-slate-900 transition-all duration-500"
                          style={{
                            width: `${Math.min(
                              percentage,
                              100
                            )}%`,
                          }}
                        />
                      </div>

                      <p className="mt-1 text-xs text-slate-400">
                        {percentage.toFixed(
                          1
                        )}
                        %
                      </p>
                    </div>
                  );
                }
              )}

              {categoryBreakdown.length ===
                0 && (
                <div className="py-10 text-center">
                  <p className="text-sm text-slate-400">
                    No spending data yet.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* =================================================
            Transactions
        ================================================== */}

        <div className="mt-8">

          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Transactions
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {pagination.totalExpenses}{" "}
                result
                {pagination.totalExpenses !==
                1
                  ? "s"
                  : ""}
              </p>
            </div>
          </div>

          {/* Loading */}

          {loading ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">

              <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900" />

              <p className="mt-4 text-sm text-slate-500">
                Loading expenses...
              </p>
            </div>
          ) : expenses.length ===
            0 ? (

            /* Empty State */

            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center sm:p-12">

              <div className="text-4xl">
                💸
              </div>

              <h3 className="mt-4 font-semibold text-slate-900">
                No expenses found
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Try changing your search
                or filters.
              </p>

              {(search ||
                category !== "all" ||
                month) && (
                <button
                  type="button"
                  onClick={
                    handleClearFilters
                  }
                  className="mt-5 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (

            /* Expense List */

            <div className="space-y-3">
              {expenses.map(
                (expense) => (
                  <ExpenseCard
                    key={
                      expense._id
                    }
                    expense={
                      expense
                    }
                    onEdit={
                      handleEdit
                    }
                    onDelete={
                      handleDelete
                    }
                  />
                )
              )}
            </div>
          )}

          {/* =================================================
              Pagination
          ================================================== */}

          {!loading &&
            pagination.totalPages >
              1 && (
              <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">

                <p className="text-center text-sm text-slate-500 sm:text-left">
                  Page{" "}
                  <span className="font-semibold text-slate-900">
                    {
                      pagination.currentPage
                    }
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-slate-900">
                    {
                      pagination.totalPages
                    }
                  </span>
                </p>

                <div className="flex w-full gap-2 sm:w-auto">

                  <button
                    type="button"
                    disabled={
                      pagination.currentPage ===
                        1 ||
                      loading
                    }
                    onClick={() =>
                      loadExpenses(
                        pagination.currentPage -
                          1
                      )
                    }
                    className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none"
                  >
                    ← Previous
                  </button>

                  <button
                    type="button"
                    disabled={
                      pagination.currentPage ===
                        pagination.totalPages ||
                      loading
                    }
                    onClick={() =>
                      loadExpenses(
                        pagination.currentPage +
                          1
                      )
                    }
                    className="flex-1 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none"
                  >
                    Next →
                  </button>

                </div>
              </div>
            )}
        </div>
      </main>

      {/* =================================================
          Expense Modal
      ================================================== */}

      {showForm && (
        <ExpenseForm
          editingExpense={
            editingExpense
          }
          onSubmit={
            editingExpense
              ? handleUpdate
              : handleCreate
          }
          onClose={
            handleCloseForm
          }
        />
      )}
    </div>
  );
};

export default Dashboard;