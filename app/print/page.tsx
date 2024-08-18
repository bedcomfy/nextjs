'use client';
import { useState } from 'react';

export default function PrintPage() {
  const [upc, setUpc] = useState('');
  const [printMethod, setPrintMethod] = useState('wifi'); // Default to WiFi
  const [printerConnected, setPrinterConnected] = useState(false);

  const checkPrinterConnection = async () => {
    try {
      const response = await fetch('/api/print', {
        method: 'GET',
      });
      const result = await response.json();
      setPrinterConnected(response.ok);
      alert(result.message);
    } catch (error) {
      console.error('Error checking printer connection:', error);
      alert('Error checking printer connection');
    }
  };

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
    <div className="container">
      <h1>Print Page</h1>
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
        >
          <option value="wifi">WiFi</option>
          <option value="usb">USB</option>
        </select>
        <button type="submit">Print</button>
      </form>
      <button onClick={checkPrinterConnection}>Check Printer Connection</button>
      {printerConnected ? (
        <p>Zebra ZQ630 printer is connected via USB.</p>
      ) : (
        <p>Zebra ZQ630 printer is not connected via USB.</p>
      )}
    </div>
  );
}