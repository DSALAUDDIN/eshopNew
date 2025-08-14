import React, { useEffect, useState } from 'react';

export default function DebugCategories() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDebug = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/categories?_debug=' + Date.now());
      const json = await res.json();
      setData(json);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDebug();
    const interval = setInterval(fetchDebug, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ position: 'fixed', bottom: 0, left: 0, background: '#222', color: '#fff', zIndex: 9999, padding: 12, fontSize: 12, maxWidth: 400, maxHeight: 300, overflow: 'auto' }}>
      <strong>Debug Categories API</strong>
      <button onClick={fetchDebug} style={{ marginLeft: 8, fontSize: 12 }}>Refresh</button>
      {loading && <div>Loading...</div>}
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}
      {data && (
        <>
          <div><b>fetchedAt:</b> {data.fetchedAt}</div>
          <div><b>categories.length:</b> {data.categories?.length}</div>
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', background: '#333', color: '#0f0', padding: 8, borderRadius: 4, maxHeight: 120, overflow: 'auto' }}>{JSON.stringify(data.categories, null, 2)}</pre>
        </>
      )}
    </div>
  );
}

