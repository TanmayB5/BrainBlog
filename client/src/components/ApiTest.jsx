import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../services/api';

const ApiTest = () => {
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState(false);

  const testEndpoint = async (endpoint, name) => {
    try {
      const url = `${API_BASE_URL}${endpoint}`;
      console.log(`Testing ${name}:`, url);
      
      const response = await fetch(url);
      const data = await response.json();
      
      setTestResults(prev => ({
        ...prev,
        [name]: {
          status: response.status,
          success: response.ok,
          data: data,
          url: url
        }
      }));
    } catch (error) {
      console.error(`Error testing ${name}:`, error);
      setTestResults(prev => ({
        ...prev,
        [name]: {
          status: 'ERROR',
          success: false,
          error: error.message,
          url: `${API_BASE_URL}${endpoint}`
        }
      }));
    }
  };

  const runAllTests = async () => {
    setLoading(true);
    setTestResults({});
    
    console.log('API_BASE_URL:', API_BASE_URL);
    
    await Promise.all([
      testEndpoint('', 'Root API'),
      testEndpoint('/test', 'Test Endpoint'),
      testEndpoint('/auth/test', 'Auth Test'),
      testEndpoint('/blogs', 'Blogs List'),
    ]);
    
    setLoading(false);
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">API Connection Test</h3>
      
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">
          <strong>API Base URL:</strong> {API_BASE_URL}
        </p>
        <button 
          onClick={runAllTests}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Run API Tests'}
        </button>
      </div>

      <div className="space-y-2">
        {Object.entries(testResults).map(([name, result]) => (
          <div key={name} className={`p-3 rounded border ${result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium">{name}</h4>
                <p className="text-sm text-gray-600">{result.url}</p>
                <p className="text-sm">
                  Status: <span className={result.success ? 'text-green-600' : 'text-red-600'}>
                    {result.status}
                  </span>
                </p>
              </div>
              <span className={`px-2 py-1 text-xs rounded ${result.success ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                {result.success ? 'SUCCESS' : 'FAILED'}
              </span>
            </div>
            {result.error && (
              <p className="text-sm text-red-600 mt-1">Error: {result.error}</p>
            )}
            {result.data && (
              <pre className="text-xs bg-gray-100 p-2 rounded mt-2 overflow-auto">
                {JSON.stringify(result.data, null, 2)}
              </pre>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApiTest; 