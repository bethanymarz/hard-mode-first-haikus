import Anthropic from '@anthropic-ai/sdk';
import RSSParser from 'rss-parser';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const parser = new RSSParser();

async function getLatestBlogPost() {
  try {
    const feed = await parser.parseURL('https://api.paragraph.xyz/blogs/rss/@bethanycrystal');
    return feed.items[0];
  } catch (error) {
    throw new Error('Failed to fetch blog post: ' + error.message);
  }
}

async function generateHaikuWithClaude(blogPost) {
  const prompt = `
    Create a haiku about this blog post: "${blogPost.title}"
    
    Rules:
    1. Follow 5-7-5 syllable structure
    2. Be thoughtful yet playful
    3. Use vivid imagery
    
    IMPORTANT: Respond ONLY with a JSON object in this EXACT format, nothing else:
    {
      "title": "${blogPost.title}",
      "haiku": [
        "first line here",
        "second line goes here now",
        "third line goes here"
      ]
    }
  `;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-opus-20240229',
      max_tokens: 150,
      messages: [{
        role: 'user',
        content: prompt
      }],
      temperature: 0.7,
      system: "You are a haiku generator that ONLY responds with valid JSON objects."
    });

    console.log('Claude response:', response.content[0].text); // Add this for debugging

    try {
      const parsed = JSON.parse(response.content[0].text.trim());
      return parsed;
    } catch (parseError) {
      console.error('Failed to parse Claude response:', response.content[0].text);
      return {
        title: blogPost.title,
        haiku: [
          "Apps like mixtapes flow",
          "Digital dreams shared with care",
          "New stories unfold"
        ]
      };
    }
  } catch (error) {
    console.error('Claude API error:', error);
    throw new Error('Failed to generate haiku: ' + error.message);
  }
}

// Make the handler async and actually use the functions
export default async function handler(req, res) {
  try {
    const { postId } = req.query;
    let blogPost = await getLatestBlogPost();
    
    // If postId is provided, find that specific post
    if (postId) {
      const feed = await parser.parseURL('https://api.paragraph.xyz/blogs/rss/@bethanycrystal');
      const selectedPost = feed.items.find(item => item.guid === postId || item.link === postId);
      if (selectedPost) {
        blogPost = selectedPost;
      }
    }
    
    const haikuResponse = await generateHaikuWithClaude(blogPost);
    
    res.status(200).json({
      title: blogPost.title,
      haiku: haikuResponse.haiku,
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