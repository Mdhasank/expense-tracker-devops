const ExpenseCard = ({ expense, onEdit, onDelete }) => {
  const formattedDate = new Date(
    expense.date
  ).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300 hover:shadow-md sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        
        {/* Left Side */}
        <div className="flex min-w-0 items-start gap-3">
          {/* Category Icon */}
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-xl">
            {expense.category === "Food" && "🍔"}
            {expense.category === "Transport" && "🚗"}
            {expense.category === "Shopping" && "🛍️"}
            {expense.category === "Bills" && "📄"}
            {expense.category === "Entertainment" && "🎬"}
            {expense.category === "Health" && "💊"}
            {expense.category === "Education" && "📚"}
            {expense.category === "Other" && "💰"}
          </div>

          {/* Expense Information */}
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-slate-900 sm:text-base">
              {expense.title}
            </h3>

            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
              <span>{expense.category}</span>

              <span className="text-slate-300">
                •
              </span>

              <span>{formattedDate}</span>
            </div>

            {expense.description && (
              <p className="mt-2 line-clamp-2 text-xs text-slate-400 sm:text-sm">
                {expense.description}
              </p>
            )}
          </div>
        </div>

        {/* Right Side */}
        <div className="flex w-full items-center justify-between gap-3 border-t border-slate-100 pt-3 sm:w-auto sm:justify-end sm:border-0 sm:pt-0">
          
          {/* Amount */}
          <div className="text-left sm:text-right">
            <p className="text-base font-bold text-slate-900 sm:text-lg">
              ₹
              {Number(expense.amount).toLocaleString(
                "en-IN"
              )}
            </p>
          </div>

          {/* Actions */}
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => onEdit(expense)}
              className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900 sm:px-4 sm:text-sm"
            >
              Edit
            </button>

            <button
              type="button"
              onClick={() => onDelete(expense._id)}
              className="rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50 sm:px-4 sm:text-sm"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseCard;