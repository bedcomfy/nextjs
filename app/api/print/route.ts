import { NextResponse } from 'next/server';
import { ZEBRA_VENDOR_ID, ZQ630_PRODUCT_ID, handleUsbPrinting } from '../../print/constants';
import type { OutEndpoint } from 'usb';

async function handleError(error: unknown) {
  console.error('Error:', error);
  const errorMessage = error instanceof Error ? error.message : 'Unknown error';
  return NextResponse.json({ message: 'Error processing print job', error: errorMessage }, { status: 500 });
}

export async function POST(request: Request) {
  try {
    const { upc, printMethod } = await request.json();
    const cpclData = Buffer.from(`! 0 200 200 210 1\nTEXT 4 0 30 40 ${upc}\nFORM\nPRINT\n`);
    await handleUsbPrinting(cpclData);
    return NextResponse.json({ message: 'Print job submitted successfully' });
  } catch (error) {
    return handleError(error);
  }
}

export async function GET() {
  try {
    const usb = await import('usb');
    const printer = usb.findByIds(ZEBRA_VENDOR_ID, ZQ630_PRODUCT_ID);
    if (printer) {
      return NextResponse.json({ message: 'Zebra ZQ630 printer is connected via USB.' });
    } else {
      return NextResponse.json({ message: 'Zebra ZQ630 printer is not connected via USB.' }, { status: 404 });
    }
  } catch (error) {
    return handleError(error);
  }
}