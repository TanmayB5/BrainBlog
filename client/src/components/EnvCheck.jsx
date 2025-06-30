import React from 'react';

const EnvCheck = () => {
  const envVars = {
    'VITE_API_URL': import.meta.env.VITE_API_URL,
    'NODE_ENV': import.meta.env.NODE_ENV,
    'MODE': import.meta.env.MODE,
    'DEV': import.meta.env.DEV,
    'PROD': import.meta.env.PROD,
  };

  return (
    <div className="p-4 bg-yellow-100 rounded-lg border border-yellow-300">
      <h3 className="text-lg font-semibold mb-4 text-yellow-800">Environment Variables Check</h3>
      <div className="space-y-2">
        {Object.entries(envVars).map(([key, value]) => (
          <div key={key} className="flex justify-between">
            <span className="font-medium text-yellow-700">{key}:</span>
            <span className={`font-mono text-sm ${value ? 'text-green-600' : 'text-red-600'}`}>
              {value || 'NOT SET'}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-4 p-3 bg-gray-100 rounded">
        <p className="text-sm text-gray-700">
          <strong>Expected:</strong> VITE_API_URL should be set to: https://brainblog.onrender.com/api
        </p>
      </div>
    </div>
  );
};

export default EnvCheck; 