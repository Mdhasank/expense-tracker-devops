import api from "./api";

// Get paginated expenses
export const getExpenses = async ({
  page = 1,
  limit = 10,
  search = "",
  category = "all",
  month = "",
} = {}) => {
  const response = await api.get("/expenses", {
    params: {
      page,
      limit,
      search,
      category,
      month,
    },
  });

  return response.data;
};

// Get dashboard statistics
export const getExpenseStats = async () => {
  const response = await api.get(
    "/expenses/stats"
  );

  return response.data;
};

// Create expense
export const createExpense = async (
  expenseData
) => {
  const response = await api.post(
    "/expenses",
    expenseData
  );

  return response.data.expense;
};

// Update expense
export const updateExpense = async (
  id,
  expenseData
) => {
  const response = await api.put(
    `/expenses/${id}`,
    expenseData
  );

  return response.data.expense;
};

// Delete expense
export const deleteExpense = async (id) => {
  const response = await api.delete(
    `/expenses/${id}`
  );

  return response.data;
};