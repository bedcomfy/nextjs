// /api/print.js
export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { cpclData } = req.body;

        // Send cpclData to a local service
        const response = await fetch('http://localhost:3001/print', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ cpclData }),
        });

        if (response.ok) {
            res.status(200).json({ message: 'Print job sent' });
        } else {
            res.status(500).json({ message: 'Failed to send print job' });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}