'use client';
import { useState } from 'react';

export default function PrintPage() {
  const [upc, setUpc] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const response = await fetch('/api/print', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ upc }),
    });

    const result = await response.json();
    alert(result.message);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="upc">Enter UPC:</label>
        <input
          type="text"
          id="upc"
          name="upc"
          value={upc}
          onChange={(e) => setUpc(e.target.value)}
          required
        />
        <button type="submit">Print</button>
      </form>
    </div>
  );
}