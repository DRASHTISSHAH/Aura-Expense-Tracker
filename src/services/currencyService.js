// src/services/currencyService.js
// Fetches live USD-based exchange rates with no caching (always fresh).
// Rates are only fetched when the user has explicitly chosen a display currency.

const API_KEY = import.meta.env.VITE_EXCHANGE_RATE_API_KEY;
const BASE_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`;

let lastFetchedAt = null;

export const getLastUpdated = () => lastFetchedAt;

export const fetchExchangeRates = async () => {
  try {
    const response = await fetch(BASE_URL);
    const data = await response.json();

    if (data.result === 'success') {
      lastFetchedAt = new Date().toISOString();
      return data.conversion_rates; // All rates relative to 1 USD
    }

    throw new Error(`API error: ${data['error-type'] || 'unknown'}`);
  } catch (error) {
    console.error('[CurrencyService] Failed to fetch exchange rates:', error);
    return null;
  }
};

/**
 * Convert an amount from one currency to another using USD-based pivot rates.
 * @param {number} amount
 * @param {string} fromCurrency - e.g. 'INR'
 * @param {string} toCurrency  - e.g. 'EUR'
 * @param {object} rates       - conversion_rates object (all relative to 1 USD)
 * @returns {number} converted amount rounded to 2 decimal places
 */
export const convertCurrency = (amount, fromCurrency, toCurrency, rates) => {
  if (!rates || !amount) return amount;
  if (!fromCurrency || !toCurrency || fromCurrency === toCurrency) return amount;

  const rateFrom = rates[fromCurrency];
  const rateTo   = rates[toCurrency];

  if (!rateFrom || !rateTo) return amount;

  const inUSD = amount / rateFrom;
  return Math.round(inUSD * rateTo * 100) / 100;
};
