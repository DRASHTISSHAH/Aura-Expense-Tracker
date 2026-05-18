// expense-tracker-api/utils/dateHelper.js

/**
 * Returns date range objects for Supabase filtering
 * @param {string} range - '1m', '6m', '1y', 'all'
 * @returns { { startDate: string | null, endDate: string | null } }
 */
const getDateRange = (range) => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    let startDate = new Date();

    switch (range) {
        case '1m':
            // Start of 1 month ago
            startDate.setMonth(now.getMonth() - 1);
            // End date is today (exclusive for 'Last 1 Month' logic if following previous MySQL logic)
            return { 
                startDate: startDate.toISOString().split('T')[0], 
                endDate: today 
            };
        case '6m':
            startDate.setMonth(now.getMonth() - 6);
            return { startDate: startDate.toISOString().split('T')[0], endDate: null };
        case '1y':
            startDate.setFullYear(now.getFullYear() - 1);
            return { startDate: startDate.toISOString().split('T')[0], endDate: null };
        case 'all':
            return { startDate: null, endDate: null };
        default:
            startDate.setMonth(now.getMonth() - 6);
            return { startDate: startDate.toISOString().split('T')[0], endDate: null };
    }
};

module.exports = { getDateRange };
