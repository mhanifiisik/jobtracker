import axios from 'axios';
import cheerio from 'cheerio';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    // Different sites have different structures
    // This is a simplified example for LinkedIn
    let jobData = {
      title: $('.job-title').text().trim() || $('h1').first().text().trim(),
      company: $('.company-name').text().trim() || $('.company').text().trim(),
      location: $('.job-location').text().trim() || $('.location').text().trim(),
      description: $('.description').html() || $('.job-description').html(),
      link: url
    };

    return res.status(200).json(jobData);
  } catch (error) {
    console.error('Error importing job:', error);
    return res.status(500).json({ error: 'Failed to import job' });
  }
}