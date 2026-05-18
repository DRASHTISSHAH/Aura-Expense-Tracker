// src/utils/formatters.js

export const formatCurrency = (value, currency = 'INR') => {
    const amount = parseFloat(value || 0);
    
    let symbol = currency;
    if (currency === 'INR') {
        symbol = '₹';
    } else if (currency === 'USD') {
        symbol = '$';
    } else if (currency === 'EUR') {
        symbol = '€';
    } else if (currency === 'GBP') {
        symbol = '£';
    }

    const isWhole = amount % 1 === 0;
    const formattedAmount = isWhole 
        ? amount.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) 
        : amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    return `${symbol} ${formattedAmount}`;
};
