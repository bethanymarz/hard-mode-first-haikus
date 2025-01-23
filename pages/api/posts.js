import RSSParser from 'rss-parser';

const parser = new RSSParser();

export default async function handler(req, res) {
  try {
    const feed = await parser.parseURL('https://api.paragraph.xyz/blogs/rss/@bethanycrystal');
    const posts = feed.items.map((item, index) => ({
      id: item.guid || index.toString(),
      title: item.title,
      link: item.link
    }));

    res.status(200).json({ 
      posts,
      success: true 
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: error.message,
      success: false 
    });
  }
} 