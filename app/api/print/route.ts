import { NextResponse } from 'next/server';
import { Interface, OutEndpoint } from 'usb';

export async function GET() {
  return NextResponse.json({ message: 'Print API is ready to receive POST requests' });
}

export async function POST(request: Request) {
  const { upc, printMethod } = await request.json();
  console.log('Received UPC:', upc);
  console.log('Selected Print Method:', printMethod);

  const cpclData = Buffer.from(`
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
`);

  try {
    if (printMethod === 'wifi') {
      const response = await fetch('http://localhost:3001/print', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cpclData: cpclData.toString() }),
      });

      if (response.ok) {
        const responseBody = await response.text();
        console.log('Print server response:', responseBody);
        return NextResponse.json({ message: 'Print job sent via WiFi' });
      } else {
        const errorText = await response.text();
        console.error('Error response from print server:', errorText);
        return NextResponse.json({ message: 'Error sending print job via WiFi', error: errorText }, { status: 500 });
      }
    } else if (printMethod === 'usb') {
      const usb = await import('usb');
      const printer = usb.findByIds(0x1234, 0x5678); // Replace with your printer's vendorId and productId

      if (!printer) {
        throw new Error('Printer not found');
      }

      printer.open();

      if (!printer.interfaces || printer.interfaces.length === 0) {
        throw new Error('No interfaces found on the printer');
      }

      const iface: Interface = printer.interfaces[0];
      iface.claim();
      const outEndpoint: OutEndpoint = iface.endpoints.find(
        (e) => e.direction === 'out'
      ) as OutEndpoint;

      if (outEndpoint) {
        outEndpoint.transfer(cpclData, (error) => {
          if (error) {
            console.error('Error sending data to printer:', error);
            throw error;
          }
          console.log('Data sent to USB printer successfully');
        });
      } else {
        throw new Error('No valid OUT endpoint found');
      }

      printer.close();
      return NextResponse.json({ message: 'Printer interaction successful' });
    } else if (printMethod === 'bluetooth') {
      const noble = await import('noble');
      // Implement Bluetooth printing logic here
      return NextResponse.json({ message: 'Bluetooth printer interaction successful' });
    } else {
      throw new Error('Unsupported print method');
    }
  } catch (error) {
    console.error('Error processing print job:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ message: 'Error processing print job', error: errorMessage }, { status: 500 });
  }
}