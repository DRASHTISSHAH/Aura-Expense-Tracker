// controllers/walletController.js
const supabase = require("../config/supabase");
const { createClient } = require('@supabase/supabase-js');

const getUserSupabase = (req) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return supabase;
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY, {
    global: { headers: { Authorization: `Bearer ${token}` } }
  });
};

const walletController = {
  getWallets: async (req, res) => {
    try {
      const userId = req.user.id;
      const userSupabase = getUserSupabase(req);

      const { data, error } = await userSupabase
        .from("wallets")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      res.json(data || []);
    } catch (error) {
      console.error("Fetch Wallets Error:", error);
      res.status(500).json({ error: error.message });
    }
  },

  createWallet: async (req, res) => {
    try {
      const { name, type, balance, cardNumber, color, currency } = req.body;
      const userId = req.user.id;
      const userSupabase = getUserSupabase(req);

      const { data, error } = await userSupabase
        .from("wallets")
        .insert([{ 
          name, 
          type, 
          balance: parseFloat(balance), 
          card_number: cardNumber, 
          color, 
          currency: currency || 'USD',
          user_id: userId 
        }])
        .select();

      if (error) throw error;
      res.status(201).json(data[0]);
    } catch (error) {
      console.error("Create Wallet Error:", error);
      res.status(500).json({ error: error.message });
    }
  },

  updateWallet: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, type, balance, cardNumber, color, currency } = req.body;
      const userId = req.user.id;
      const userSupabase = getUserSupabase(req);

      const { data, error } = await userSupabase
        .from("wallets")
        .update({ name, type, balance: parseFloat(balance), card_number: cardNumber, color, currency })
        .eq("id", id)
        .eq("user_id", userId)
        .select();

      if (error) throw error;
      res.json(data[0]);
    } catch (error) {
      console.error("Update Wallet Error:", error);
      res.status(500).json({ error: error.message });
    }
  },

  deleteWallet: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const userSupabase = getUserSupabase(req);

      const { error } = await userSupabase.from("wallets").delete().eq("id", id).eq("user_id", userId);
      if (error) throw error;
      res.json({ message: "Deleted" });
    } catch (error) {
      console.error("Delete Wallet Error:", error);
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = walletController;
