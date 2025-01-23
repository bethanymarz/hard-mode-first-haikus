import { useState } from 'react';

export default function Home() {
  const [result, setResult] = useState(null);

  const testApi = async () => {
    try {
      const response = await fetch('/api/hello');
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: error.message });
    }
  };

  return (
    <div>
      <h1>Haiku API</h1>
      <button onClick={testApi}>Test API</button>
      {result && (
        <pre>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
} 