'use client';
import { useState } from 'react';

export default function PrintPage() {
  const [upc, setUpc] = useState('');
  const [printMethod, setPrintMethod] = useState('wifi'); // Default to WiFi

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const response = await fetch('/api/print', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ upc, printMethod }), // Include printMethod in the request body
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
        <label htmlFor="printMethod">Select Print Method:</label>
        <select
          id="printMethod"
          name="printMethod"
          value={printMethod}
          onChange={(e) => setPrintMethod(e.target.value)}
          required
        >
          <option value="wifi">WiFi</option>
          <option value="usb">USB</option>
          <option value="bluetooth">Bluetooth</option>
        </select>
        <button type="submit">Print</button>
      </form>
    </div>
  );
}