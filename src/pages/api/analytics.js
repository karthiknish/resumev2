export default function handler(req, res) {
  if (req.method === 'POST') {
    // Log the analytics data or just return success
    // In a real app, you would save this to a database or forward to an analytics service
    // console.log('Analytics data received:', req.body);
    res.status(200).json({ success: true });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
