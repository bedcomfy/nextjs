import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { upc } = await request.json();
  console.log('Received UPC:', upc);

  const cpclData = `
! 0 200 200 600 1
LABEL
CONTRAST 0
TONE 0
SPEED 3
PAGE-WIDTH 600
BOX 20 20 580 280 2
TEXT 4 0 30 40 Sample Label
TEXT 4 0 30 100 Zebra Printer
TEXT 4 0 30 160 CPCL Example
BARCODE 128 1 1 100 100 250 ${upc}
FORM
PRINT
SETFF 30
FORM
PRINT
`;

  try {
    const response = await fetch('http://localhost:3001/print', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cpclData }),
    });

    if (response.ok) {
      return NextResponse.json({ message: 'Print job sent' });
    } else {
      console.error('Failed to send print job', response.statusText);
      return NextResponse.json({ message: 'Failed to send print job' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ message: 'Error sending print job' }, { status: 500 });
  }
}