// controllers/transactionController.js
const supabase = require("../config/supabase");
const { createClient } = require('@supabase/supabase-js');
const { getDateRange } = require("../utils/dateHelper");

const getUserSupabase = (req) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return supabase;
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY, {
    global: { headers: { Authorization: `Bearer ${token}` } }
  });
};

const transactionController = {
  getTransactions: async (req, res) => {
    try {
      const { range } = req.query;
      const { start, end } = getDateRange(range);
      const userId = req.user.id;
      const userSupabase = getUserSupabase(req);

      let query = userSupabase
        .from("transactions")
        .select("*")
        .eq("user_id", userId)
        .order("transaction_date", { ascending: false });

      if (start) query = query.gte("transaction_date", start);
      if (end) query = query.lt("transaction_date", end);

      const { data, error } = await query;
      if (error) {
        console.error("Supabase Error (Fetch):", error);
        return res.status(500).json({ error: error.message, details: error.details });
      }
      res.json(data || []);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  createTransaction: async (req, res) => {
    try {
      const { amount, currency, description, category, date, main_category, wallet_id } = req.body;
      const userId = req.user.id;
      const userSupabase = getUserSupabase(req);

      // We remove wallet_id if it's not provided to avoid null constraint issues
      const insertData = { 
        amount: parseFloat(amount), 
        currency, 
        description, 
        category: category || 'General', 
        main_category: main_category || 'Variable Expenses',
        transaction_date: date, 
        user_id: userId
      };

      if (wallet_id && wallet_id !== 'cash') insertData.wallet_id = wallet_id;

      const { data, error } = await userSupabase
        .from("transactions")
        .insert([insertData])
        .select();

      if (error) {
        console.error("Supabase Error (Create):", error);
        return res.status(500).json({ error: error.message, details: error.details, hint: "Did you run the SQL migration for wallets?" });
      }
      res.status(201).json(data[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  updateTransaction: async (req, res) => {
    try {
      const { id } = req.params;
      const { amount, currency, description, category, date, main_category, wallet_id } = req.body;
      const userId = req.user.id;
      const userSupabase = getUserSupabase(req);

      const updateData = { 
        amount: parseFloat(amount), 
        currency, 
        description, 
        category, 
        main_category,
        transaction_date: date
      };
      if (wallet_id && wallet_id !== 'cash') {
        updateData.wallet_id = wallet_id;
      } else {
        updateData.wallet_id = null;
      }

      const { data, error } = await userSupabase
        .from("transactions")
        .update(updateData)
        .eq("id", id)
        .eq("user_id", userId)
        .select();

      if (error) return res.status(500).json({ error: error.message, details: error.details });
      if (!data || data.length === 0) return res.status(404).json({ error: "Unauthorized" });
      res.json(data[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  deleteTransaction: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const userSupabase = getUserSupabase(req);

      const { error } = await userSupabase.from("transactions").delete().eq("id", id).eq("user_id", userId);
      if (error) return res.status(500).json({ error: error.message });
      res.json({ message: "Deleted" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getDashboardData: async (req, res) => {
    try {
      const { range } = req.query;
      const { start, end } = getDateRange(range);
      const userId = req.user.id;
      const userSupabase = getUserSupabase(req);

      let query = userSupabase.from("transactions").select("*").eq("user_id", userId);
      if (start) query = query.gte("transaction_date", start);
      if (end) query = query.lt("transaction_date", end);

      const { data, error } = await query;
      if (error) return res.status(500).json({ error: error.message });

      const safeData = data || [];
      const income = safeData.filter(t => t.category?.toLowerCase().includes('income') || t.main_category?.toLowerCase().includes('income'))
                         .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
      const investments = safeData.filter(t => t.category?.toLowerCase().includes('investment') || t.main_category?.toLowerCase().includes('investment'))
                              .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
      const expenses = safeData.filter(t => !t.category?.toLowerCase().includes('income') && !t.category?.toLowerCase().includes('investment') && !t.main_category?.toLowerCase().includes('income') && !t.main_category?.toLowerCase().includes('investment'))
                          .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);

      res.json({
        summary: {
          total_income: income,
          total_expense: expenses,
          total_investment: investments,
          total_balance: income - expenses - investments,
          fixed_expenses: expenses * 0.4,
          variable_expenses: expenses * 0.6,
          amount_to_spend: income - expenses
        },
        cashFlow: [],
        topExpenses: []
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getCombinedAppData: async (req, res) => {
    try {
      const userId = req.user.id;
      const userSupabase = getUserSupabase(req);

      // Run all DB calls in parallel — each fails independently
      const [
        { data: transactions, error: tErr },
        { data: wallets, error: wErr },
        { data: savings, error: sErr },
        { data: investments, error: iErr }
      ] = await Promise.all([
        userSupabase.from("transactions").select("*").eq("user_id", userId).order("transaction_date", { ascending: false }).limit(50),
        userSupabase.from("wallets").select("*").eq("user_id", userId),
        userSupabase.from("savings_targets").select("*").eq("user_id", userId),
        userSupabase.from("investments").select("*").eq("user_id", userId)
      ]);

      // Log individual errors but don't fail the whole request
      if (tErr) console.error("[Combined] transactions error:", tErr.message);
      if (wErr) console.error("[Combined] wallets error:", wErr.message);
      if (sErr) console.error("[Combined] savings error:", sErr.message);
      if (iErr) console.error("[Combined] investments error:", iErr.message);

      res.json({
        transactions: tErr ? [] : (transactions || []),
        wallets: wErr ? [] : (wallets || []),
        savings: sErr ? [] : (savings || []),
        investments: iErr ? [] : (investments || [])
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = transactionController;
