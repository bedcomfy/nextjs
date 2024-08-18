import { NextApiRequest, NextApiResponse } from 'next';
import { ZEBRA_VENDOR_ID, ZQ630_PRODUCT_ID, handleUsbPrinting } from './constants';

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  const { upc } = req.body;

  try {
    // Implement your printing logic here
    const cpclData = Buffer.from(`! 0 200 200 210 1\nTEXT 4 0 30 40 ${upc}\nFORM\nPRINT\n`);
    await handleUsbPrinting(cpclData);
    return res.status(200).json({ message: 'Print job submitted successfully' });
  } catch (error: any) {
    console.error('Error processing print job:', error);
    return res.status(500).json({ message: 'Error processing print job', error: error.message });
  }
}

async function handleGet(_req: NextApiRequest, res: NextApiResponse) {
  try {
    const usb = await import('usb');
    const printer = usb.findByIds(ZEBRA_VENDOR_ID, ZQ630_PRODUCT_ID);

    if (printer) {
      return res.status(200).json({ message: 'Zebra ZQ630 printer is connected via USB.' });
    } else {
      return res.status(404).json({ message: 'Zebra ZQ630 printer is not connected via USB.' });
    }
  } catch (error: any) {
    console.error('Error checking printer connection:', error);
    return res.status(500).json({ message: 'Error checking printer connection', error: error.message });
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'POST':
      return handlePost(req, res);
    case 'GET':
      return handleGet(req, res);
    default:
      res.setHeader('Allow', ['POST', 'GET']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}