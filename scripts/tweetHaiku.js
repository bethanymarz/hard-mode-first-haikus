import { TwitterApi } from 'twitter-api-v2';
import cron from 'node-cron';
import fetch from 'node-fetch';

// Twitter client setup
const client = new TwitterApi({
  appKey: process.env.TWITTER_APP_KEY,
  appSecret: process.env.TWITTER_APP_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_SECRET,
});

// Function to fetch the latest haiku
async function fetchLatestHaiku() {
  const response = await fetch('https://your-api-endpoint/api/haiku');
  const data = await response.json();
  return {
    title: data.title,
    haiku: data.haiku.join('\n'),
    url: data.url
  };
}

// Function to tweet the haiku
async function tweetHaiku() {
  try {
    const { title, haiku, url } = await fetchLatestHaiku();
    const tweetContent = `${title}\n\n${haiku}\n\nRead more: ${url}`;
    await client.v1.tweet(tweetContent);
    console.log('Haiku tweeted successfully!');
  } catch (error) {
    console.error('Error tweeting haiku:', error);
  }
}

// Schedule the task to run daily
cron.schedule('0 9 * * *', () => {
  console.log('Running daily haiku tweet task...');
  tweetHaiku();
}); 