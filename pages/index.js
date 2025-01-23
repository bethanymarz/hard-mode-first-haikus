import { useState } from 'react';

export default function Home() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const testApi = async () => {
    try {
      const response = await fetch('/api/hello');
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: error.message });
    }
  };

  const generateHaiku = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/haiku');
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Haiku API</h1>
      <div style={{ display: 'flex', gap: '10px', margin: '20px 0' }}>
        <button 
          onClick={testApi}
          style={{ 
            padding: '10px 20px',
            borderRadius: '5px'
          }}
        >
          Test Hello API
        </button>
        <button 
          onClick={generateHaiku}
          disabled={loading}
          style={{ 
            padding: '10px 20px',
            borderRadius: '5px'
          }}
        >
          {loading ? 'Generating...' : 'Generate Haiku'}
        </button>
      </div>
      {result && (
        <pre style={{ 
          background: '#f0f0f0', 
          padding: '20px',
          borderRadius: '5px'
        }}>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
} 