import express from 'express';
import cors from 'cors';
import https from 'https';
import http from 'http';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Lead Generation Route for n8n Integration
app.post('/api/leads', async (req, res) => {
  const { name, email, company, message } = req.body;
    console.log('Received lead data:', { name, email, company, message });

  // Basic validation
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required.' });
  }
  const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format.' });
  }
  console.log('Validated lead data:', { name, email, company, message });   

  // Forward data to n8n webhook (replace with your actual n8n webhook URL)
  const webhookUrl = 'https://kiran2411.app.n8n.cloud/webhook/ffa85e74-a9d3-423d-9a76-a61a62a8d266'; // <-- Replace with your n8n webhook URL
  const parsedUrl = new URL(webhookUrl);

    console.log('Parsed webhook URL:', parsedUrl);

  const postData = JSON.stringify({ name, email, company, message });

  const options = {
    hostname: parsedUrl.hostname,
    port: parsedUrl.port ? Number(parsedUrl.port) : (parsedUrl.protocol === 'https:' ? 443 : 80),
    path: parsedUrl.pathname + parsedUrl.search,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };
    console.log('Forwarding request options:', options);
  const protocol = parsedUrl.protocol === 'https:' ? https : http;

  const forwardReq = protocol.request(options, forwardRes => {
    let data = '';
    forwardRes.on('data', chunk => { data += chunk; });
    forwardRes.on('end', () => {
      if (forwardRes.statusCode >= 200 && forwardRes.statusCode < 300) {
        res.status(200).json({ message: 'Lead submitted successfully.' });
        console.log('Lead forwarded successfully:', { name, email, company, message });
      } else {
        res.status(500).json({ error: 'Failed to forward lead to n8n.' });
        console.error('Error forwarding lead:', { statusCode: forwardRes.statusCode, data });
      }
    });
  });

  forwardReq.on('error', error => {
    res.status(500).json({ error: 'Failed to forward lead to n8n.' });
    console.error('Error with request to n8n:', error);
  });

  forwardReq.write(postData);
  forwardReq.end();
});

app.listen(PORT, () => {
  console.log(`Server running on PORT: ${PORT}`);
});

export default app;