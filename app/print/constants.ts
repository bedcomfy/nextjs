import { Endpoint } from 'usb';

const ZEBRA_VENDOR_ID = 0x0A5F; // Replace with the actual vendor ID for Zebra
const ZQ630_PRODUCT_ID = 0x014E; // Replace with the actual product ID for ZQ630

async function handleUsbPrinting(cpclData: Buffer) {
  const usb = await import('usb');
  const printer = usb.findByIds(ZEBRA_VENDOR_ID, ZQ630_PRODUCT_ID);

  if (!printer) {
    throw new Error('Printer not found');
  }

  printer.open();

  if (!printer.interfaces || printer.interfaces.length === 0) {
    throw new Error('No interfaces found on the printer');
  }

  const iface = printer.interfaces[0];
  iface.claim();
  const outEndpoint = iface.endpoints.find(
    (e) => e.direction === 'out'
  ) as Endpoint;

  if (!outEndpoint) {
    throw new Error('No valid OUT endpoint found');
  }

  await new Promise<void>((resolve, reject) => {
    (outEndpoint as any).bulkTransfer(cpclData, (error: Error | null) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });

  iface.release(true, (error) => {
    if (error) {
      throw new Error('Error releasing interface');
    }
  });

  printer.close();
}

export { ZEBRA_VENDOR_ID, ZQ630_PRODUCT_ID, handleUsbPrinting };