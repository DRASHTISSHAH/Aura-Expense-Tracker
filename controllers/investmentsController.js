// controllers/investmentsController.js
const supabase = require("../config/supabase");
const { createClient } = require('@supabase/supabase-js');

const getUserSupabase = (req) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return supabase;
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY, {
    global: { headers: { Authorization: `Bearer ${token}` } }
  });
};

const investmentsController = {
  getInvestments: async (req, res) => {
    try {
      const userId = req.user.id;
      const userSupabase = getUserSupabase(req);

      const { data, error } = await userSupabase
        .from("investments")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      res.json(data || []);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  createInvestment: async (req, res) => {
    try {
      const { name, asset_type, invested_amount, current_value, color } = req.body;
      const userId = req.user.id;
      const userSupabase = getUserSupabase(req);

      const { data, error } = await userSupabase
        .from("investments")
        .insert([{ 
          name, 
          asset_type, 
          invested_amount: parseFloat(invested_amount), 
          current_value: parseFloat(current_value), 
          color, 
          user_id: userId 
        }])
        .select();

      if (error) throw error;
      res.status(201).json(data[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  updateInvestment: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, asset_type, invested_amount, current_value, color } = req.body;
      const userId = req.user.id;
      const userSupabase = getUserSupabase(req);

      const { data, error } = await userSupabase
        .from("investments")
        .update({ name, asset_type, invested_amount, current_value, color })
        .eq("id", id)
        .eq("user_id", userId)
        .select();

      if (error) throw error;
      res.json(data[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  deleteInvestment: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const userSupabase = getUserSupabase(req);

      const { error } = await userSupabase.from("investments").delete().eq("id", id).eq("user_id", userId);
      if (error) throw error;
      res.json({ message: "Deleted" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = investmentsController;
