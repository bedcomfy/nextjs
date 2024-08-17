import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'Print API is ready to receive POST requests' });
}

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
      const errorText = await response.text();
      console.error('Error response from print server:', errorText);
      return NextResponse.json({ message: 'Error sending print job', error: errorText }, { status: 500 });
    }
  } catch (error) {
    console.error('Error sending print job:', error);
    if (error instanceof Error) {
      return NextResponse.json({ message: 'Error sending print job', error: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ message: 'Error sending print job', error: String(error) }, { status: 500 });
    }
  }
}