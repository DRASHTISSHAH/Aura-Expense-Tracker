// src/components/SettingsAndAutomation.jsx (ERROR-FREE)

import React from 'react'; 

// ACCEPT props for Dark Mode
function SettingsAndAutomation({ isDarkMode, toggleDarkMode }) {
  
  // --- Theme Classes ---
  const DARK_BG_CARD = 'bg-white dark:bg-[#311B92]'; 
  const TEXT_DARK = 'text-text-dark dark:text-white';
  const TEXT_BODY = 'text-text-body dark:text-gray-300';


  return (
    // FIX: Props are not spread to this root div, resolving the React warning.
    <div className={`p-6 rounded-xl shadow-lg ${DARK_BG_CARD}`}>
      
      {/* ================================== */}
      {/* APPEARANCE SETTINGS (DARK MODE TOGGLE) */}
      {/* ================================== */}
      <div className={`pb-4`}>
        <h2 className={`text-2xl font-bold mb-4 ${TEXT_DARK}`}>Appearance Settings</h2>
        <div className="flex justify-between items-center">
            <span className={TEXT_BODY}>Enable Dark Mode</span>
            
            {/* TOGGLE BUTTON: Uses state to drive visual change (translate-x) for clear toggle feedback */}
            <button
                onClick={toggleDarkMode}
                // Outer track: Color changes based on state
                className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 
                  ${isDarkMode ? 'bg-purple-A700 focus:ring-purple-A700' : 'bg-gray-200 focus:ring-primary-teal'}`
                }
                role="switch"
                aria-checked={isDarkMode}
            >
                {/* Inner circle (the actual switch) */}
                <span 
                    aria-hidden="true"
                    // FIX: Positioning changes based on state (translate-x-5 for ON, translate-x-0 for OFF)
                    className={`
                        pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg transform ring-0 
                        transition ease-in-out duration-200
                        ${isDarkMode ? 'translate-x-5' : 'translate-x-0'}
                    `}
                />
            </button>
        </div>
      </div>
      
    </div>
  );
}

export default SettingsAndAutomation;