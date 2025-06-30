import React, { useState } from 'react';
import { aiService } from '../services/aiService';

export default function AIStatusCheck() {
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const [testResult, setTestResult] = useState(null);

  const testAIConnection = async () => {
    setStatus('testing');
    setMessage('Testing AI connection with Hugging Face...');
    
    try {
      // Test with a simple content
      const testContent = "This is a test content to verify AI functionality is working properly.";
      const summary = await aiService.generateSummary(testContent);
      
      setStatus('success');
      setMessage('✅ AI features are working correctly with Hugging Face!');
      setTestResult({
        type: 'summary',
        input: testContent,
        output: summary
      });
    } catch (error) {
      setStatus('error');
      setMessage('❌ AI features are not working. Check the troubleshooting guide.');
      setTestResult({
        type: 'error',
        error: error.message
      });
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'success': return 'text-green-600';
      case 'error': return 'text-red-600';
      case 'testing': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white border border-medium-beige rounded-lg p-6">
      <h3 className="text-lg font-semibold text-text-dark mb-4">
        🤖 AI Features Status Check (Hugging Face)
      </h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-text-medium">AI Connection Status:</span>
          <span className={`font-medium ${getStatusColor()}`}>
            {status === 'idle' && 'Not tested'}
            {status === 'testing' && 'Testing...'}
            {status === 'success' && 'Working'}
            {status === 'error' && 'Error'}
          </span>
        </div>

        <button
          onClick={testAIConnection}
          disabled={status === 'testing'}
          className="w-full bg-dark-brown text-white py-2 px-4 rounded-lg hover:bg-brown transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === 'testing' ? 'Testing...' : 'Test AI Connection'}
        </button>

        {message && (
          <div className={`p-3 rounded-lg ${
            status === 'success' ? 'bg-green-50 text-green-800' :
            status === 'error' ? 'bg-red-50 text-red-800' :
            'bg-blue-50 text-blue-800'
          }`}>
            {message}
          </div>
        )}

        {testResult && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-text-dark mb-2">Test Result:</h4>
            {testResult.type === 'summary' ? (
              <div className="space-y-2 text-sm">
                <div>
                  <strong>Input:</strong> {testResult.input}
                </div>
                <div>
                  <strong>Generated Summary:</strong> {testResult.output}
                </div>
              </div>
            ) : (
              <div className="text-sm">
                <strong>Error:</strong> {testResult.error}
              </div>
            )}
          </div>
        )}

        {status === 'error' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-medium text-yellow-800 mb-2">Troubleshooting Steps:</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm text-yellow-700">
              <li>Check if you have a valid Hugging Face API key in your server .env file</li>
              <li>Verify your Hugging Face account is active (free signup at huggingface.co)</li>
              <li>Ensure your server is running and accessible</li>
              <li>Check the browser console for detailed error messages</li>
              <li>Run the server test script: <code className="bg-yellow-100 px-1 rounded">npm run test-ai</code></li>
              <li>If you see "Model is loading" error, wait 30-60 seconds and try again</li>
            </ol>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-800 mb-2">💡 Hugging Face Benefits:</h4>
          <ul className="list-disc list-inside space-y-1 text-sm text-blue-700">
            <li><strong>30,000 free requests per month</strong> (no credit card required)</li>
            <li>Access to thousands of open-source AI models</li>
            <li>Community-driven and completely free to start</li>
            <li>No quota limits or billing surprises</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 