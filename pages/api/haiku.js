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
    Create a single haiku that captures the essence of this blog post. 
    The haiku should be thoughtful yet playful, with lively imagery or metaphors that feel personal and vibrant.
    Follow the 5-7-5 syllable structure.
    
    Blog post title: ${blogPost.title}
    Blog post content: ${blogPost.content}
    
    Return ONLY a JSON object in this exact format:
    {
      "title": "blog post title here",
      "haiku": ["line 1", "line 2", "line 3"]
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
      temperature: 0.7
    });

    // Add error handling for JSON parsing
    try {
      return JSON.parse(response.content[0].text);
    } catch (parseError) {
      console.error('Failed to parse Claude response:', response.content[0].text);
      return {
        title: blogPost.title,
        haiku: [
          "Error parsing haiku",
          "Claude's response was not JSON",
          "Please try again soon"
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
    const blogPost = await getLatestBlogPost();
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