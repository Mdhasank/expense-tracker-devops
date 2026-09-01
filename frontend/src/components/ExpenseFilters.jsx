const ExpenseFilters = ({
  search,
  setSearch,
  category,
  setCategory,
  month,
  setMonth,
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid gap-4 md:grid-cols-3">
        {/* Search */}
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Search
          </label>

          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search expenses..."
              className="w-full rounded-xl border border-slate-200 px-4 py-3 pl-10 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-100"
            />

            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 16 16">
                <path fill="#7b828bff" d="m10.878.283l.348 1.07a2.2 2.2 0 0 0 1.398 1.398l1.072.348l.021.005a.423.423 0 0 1 0 .798l-1.071.348a2.2 2.2 0 0 0-1.399 1.397L10.9 6.718a.423.423 0 0 1-.798 0l-.348-1.07a2.2 2.2 0 0 0-1.399-1.403l-1.072-.348a.423.423 0 0 1 0-.798l1.072-.348a2.2 2.2 0 0 0 1.377-1.397L10.08.283a.423.423 0 0 1 .799 0m4.905 7.93l-.765-.248a1.58 1.58 0 0 1-1-.998l-.248-.765a.302.302 0 0 0-.57 0l-.25.765a1.58 1.58 0 0 1-.983.998l-.765.249a.303.303 0 0 0 0 .57l.765.248a1.58 1.58 0 0 1 1 1.002l.248.765a.302.302 0 0 0 .57 0l.249-.765a1.58 1.58 0 0 1 .999-.998l.765-.249a.303.303 0 0 0 0-.57zM6.5 2.002q.379 0 .74.06l-.29.093a1.43 1.43 0 0 0-.871.872a3.5 3.5 0 1 0 3.673 4.77q.176.109.372.158c-.08.17-.12.36-.12.55c0 .218.051.429.155.617a5 5 0 0 1-.143.188l3.838 3.838a.5.5 0 0 1-.708.707L9.31 10.017A4.5 4.5 0 1 1 6.5 2"></path>
              </svg>
            </span>
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Category
          </label>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-100"
          >
            <option value="all">All categories</option>
            <option value="Food">Food</option>
            <option value="Transport">Transport</option>
            <option value="Shopping">Shopping</option>
            <option value="Bills">Bills</option>
            <option value="Entertainment">
              Entertainment
            </option>
            <option value="Health">Health</option>
            <option value="Education">Education</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Month */}
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Month
          </label>

          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-100"
          />
        </div>
      </div>
    </div>
  );
};

export default ExpenseFilters;