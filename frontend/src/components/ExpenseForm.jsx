import { useEffect, useState } from "react";

const initialForm = {
  title: "",
  amount: "",
  category: "Food",
  date: new Date().toISOString().split("T")[0],
  description: "",
};

const ExpenseForm = ({
  onSubmit,
  onClose,
  editingExpense,
}) => {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingExpense) {
      setForm({
        title: editingExpense.title || "",
        amount: editingExpense.amount || "",
        category: editingExpense.category || "Food",
        date: new Date(editingExpense.date)
          .toISOString()
          .split("T")[0],
        description: editingExpense.description || "",
      });
    } else {
      setForm(initialForm);
    }
  }, [editingExpense]);

  const handleChange = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);

    try {
      await onSubmit({
        ...form,
        amount: Number(form.amount),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-3 backdrop-blur-sm sm:p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="
          flex w-full max-w-lg flex-col
          overflow-hidden rounded-2xl bg-white shadow-2xl
          max-h-[calc(100dvh-1.5rem)]
          sm:max-h-[90dvh]
        "
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-slate-100 bg-white px-5 py-4 sm:px-6 sm:py-5">
          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
              {editingExpense ? "Edit Expense" : "Add Expense"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {editingExpense
                ? "Update your expense details."
                : "Record a new expense."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="
              ml-4 flex h-9 w-9 shrink-0 items-center justify-center
              rounded-full text-xl text-slate-500
              transition hover:bg-slate-100 hover:text-slate-900
            "
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Scrollable Body */}
        <div
          className="
            min-h-0 flex-1 overflow-y-auto
            overscroll-contain
            px-5 sm:px-6
            scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-200
            hover:scrollbar-thumb-slate-300
          "
        >
          <form
            onSubmit={handleSubmit}
            className="space-y-5 py-5 sm:py-6"
          >
            {/* Title */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Title
              </label>

              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Grocery shopping"
                required
                className="
                  w-full rounded-xl border border-slate-200
                  px-4 py-3 text-sm outline-none
                  transition
                  focus:border-slate-900
                  focus:ring-2 focus:ring-slate-100
                "
              />
            </div>

            {/* Amount + Category */}
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Amount
                </label>

                <input
                  type="number"
                  name="amount"
                  value={form.amount}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  step="0.01"
                  required
                  className="
                    w-full rounded-xl border border-slate-200
                    px-4 py-3 text-sm outline-none
                    transition
                    focus:border-slate-900
                    focus:ring-2 focus:ring-slate-100
                  "
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Category
                </label>

                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="
                    w-full rounded-xl border border-slate-200
                    bg-white px-4 py-3 text-sm outline-none
                    transition
                    focus:border-slate-900
                    focus:ring-2 focus:ring-slate-100
                  "
                >
                  <option>Food</option>
                  <option>Transport</option>
                  <option>Shopping</option>
                  <option>Bills</option>
                  <option>Entertainment</option>
                  <option>Health</option>
                  <option>Education</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

            {/* Date */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Date
              </label>

              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                required
                className="
                  w-full rounded-xl border border-slate-200
                  px-4 py-3 text-sm outline-none
                  transition
                  focus:border-slate-900
                  focus:ring-2 focus:ring-slate-100
                "
              />
            </div>

            {/* Description */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Description
              </label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows="3"
                placeholder="Optional description..."
                className="
                  w-full resize-none rounded-xl border border-slate-200
                  px-4 py-3 text-sm outline-none
                  transition
                  focus:border-slate-900
                  focus:ring-2 focus:ring-slate-100
                "
              />
            </div>

            {/* Buttons */}
            <div className="flex flex-col-reverse gap-3 pt-1 pb-1 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onClose}
                className="
                  w-full rounded-xl border border-slate-200
                  px-5 py-3 text-sm font-medium text-slate-700
                  transition hover:bg-slate-50
                  sm:w-auto
                "
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="
                  w-full rounded-xl bg-slate-900
                  px-5 py-3 text-sm font-semibold text-white
                  transition hover:bg-slate-700
                  disabled:cursor-not-allowed disabled:opacity-50
                  sm:w-auto
                "
              >
                {loading
                  ? "Saving..."
                  : editingExpense
                    ? "Update Expense"
                    : "Add Expense"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ExpenseForm;