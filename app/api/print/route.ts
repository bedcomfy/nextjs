import { NextResponse } from 'next/server';
import usb from 'usb';
import noble from 'noble';

export async function GET() {
  return NextResponse.json({ message: 'Print API is ready to receive POST requests' });
}

export async function POST(request: Request) {
  const { upc, printMethod } = await request.json();
  console.log('Received UPC:', upc);
  console.log('Selected Print Method:', printMethod);

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
    if (printMethod === 'wifi') {
      const response = await fetch('http://localhost:3001/print', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cpclData }),
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
      const printer = usb.findByIds(0x1234, 0x5678); // Replace with your printer's vendorId and productId
      printer.open();
      const iface = printer.interfaces[0];
      iface.claim();
      const endpoint = iface.endpoints[0];
      endpoint.transfer(cpclData, (error) => {
        if (error) {
          console.error('Error sending print job via USB:', error);
          return NextResponse.json({ message: 'Error sending print job via USB', error: error.message }, { status: 500 });
        } else {
          console.log('Print job sent via USB');
          return NextResponse.json({ message: 'Print job sent via USB' });
        }
      });
    } else if (printMethod === 'bluetooth') {
      noble.on('stateChange', (state) => {
        if (state === 'poweredOn') {
          noble.startScanning();
        } else {
          noble.stopScanning();
        }
      });

      noble.on('discover', (peripheral) => {
        console.log('Discovered peripheral:', peripheral.advertisement);
        peripheral.connect((error) => {
          if (error) {
            console.error('Error connecting to peripheral:', error);
            return NextResponse.json({ message: 'Error connecting to peripheral', error: error.message }, { status: 500 });
          }
          const serviceUUIDs = ['your-service-uuid']; // Replace with your printer's service UUID
          const characteristicUUIDs = ['your-characteristic-uuid']; // Replace with your printer's characteristic UUID
          peripheral.discoverSomeServicesAndCharacteristics(serviceUUIDs, characteristicUUIDs, (error, services, characteristics) => {
            if (error) {
              console.error('Error discovering services and characteristics:', error);
              return NextResponse.json({ message: 'Error discovering services and characteristics', error: error.message }, { status: 500 });
            }
            const characteristic = characteristics[0];
            characteristic.write(Buffer.from(cpclData), true, (error) => {
              if (error) {
                console.error('Error sending print job via Bluetooth:', error);
                return NextResponse.json({ message: 'Error sending print job via Bluetooth', error: error.message }, { status: 500 });
              } else {
                console.log('Print job sent via Bluetooth');
                return NextResponse.json({ message: 'Print job sent via Bluetooth' });
              }
            });
          });
        });
      });
    } else {
      return NextResponse.json({ message: 'Invalid print method selected' }, { status: 400 });
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