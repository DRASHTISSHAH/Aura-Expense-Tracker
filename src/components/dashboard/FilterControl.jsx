// src/components/dashboard/FilterControl.jsx
import React from 'react';
import { Calendar } from 'lucide-react';
import CustomSelect from '../ui/CustomSelect';

const TIME_RANGE_OPTIONS = [
  { value: '1m', label: 'Last 1 Month' }, 
  { value: '6m', label: 'Last 6 Months' },
  { value: '1y', label: 'Last 1 Year' },
  { value: 'all', label: 'All Time' },
];

const FilterControl = ({ timeRange, setTimeRange }) => {
    return (
        <div className="flex items-center gap-3">
            <CustomSelect 
                value={timeRange} 
                onChange={setTimeRange} 
                options={TIME_RANGE_OPTIONS} 
                icon={Calendar}
            />
        </div>
    );
};

export default FilterControl;
