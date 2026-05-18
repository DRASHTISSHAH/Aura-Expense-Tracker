// controllers/savingsController.js
const supabase = require("../config/supabase");
const { createClient } = require('@supabase/supabase-js');

const getUserSupabase = (req) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return supabase;
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY, {
    global: { headers: { Authorization: `Bearer ${token}` } }
  });
};

const savingsController = {
  getSavingsTargets: async (req, res) => {
    try {
      const userId = req.user.id;
      const userSupabase = getUserSupabase(req);

      const { data, error } = await userSupabase
        .from("savings_targets")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      res.json(data || []);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  createSavingsTarget: async (req, res) => {
    try {
      const { name, target_amount, current_amount, deadline, color } = req.body;
      const userId = req.user.id;
      const userSupabase = getUserSupabase(req);

      const { data, error } = await userSupabase
        .from("savings_targets")
        .insert([{ 
          name, 
          target_amount: parseFloat(target_amount), 
          current_amount: parseFloat(current_amount || 0), 
          deadline, 
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

  updateSavingsTarget: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, target_amount, current_amount, deadline, color } = req.body;
      const userId = req.user.id;
      const userSupabase = getUserSupabase(req);

      const { data, error } = await userSupabase
        .from("savings_targets")
        .update({ name, target_amount, current_amount, deadline, color })
        .eq("id", id)
        .eq("user_id", userId)
        .select();

      if (error) throw error;
      res.json(data[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  deleteSavingsTarget: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const userSupabase = getUserSupabase(req);

      const { error } = await userSupabase.from("savings_targets").delete().eq("id", id).eq("user_id", userId);
      if (error) throw error;
      res.json({ message: "Deleted" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = savingsController;
