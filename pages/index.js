import { useState, useEffect } from 'react';

export default function Home() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [blogPosts, setBlogPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);

  // Fetch blog posts on component mount
  useEffect(() => {
    async function fetchBlogPosts() {
      try {
        const response = await fetch('/api/posts');
        const data = await response.json();
        setBlogPosts(data.posts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    }
    fetchBlogPosts();
  }, []);

  const generateHaiku = async (postId) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/haiku?postId=${postId || ''}`);
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      padding: '40px',
      maxWidth: '800px',
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif',
      color: '#333'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 style={{ 
          fontSize: '2.5rem',
          marginBottom: '2rem',
          color: '#2C5282'
        }}>
          Hard Mode First Haiku Generator
        </h1>
        <img 
          src="/hard-mode-first.png" 
          alt="Hard Mode First Logo" 
          style={{ width: '300px', height: 'auto', marginLeft: '20px' }}
        />
      </div>

      <p>
        I know, I know, my blog posts are wayyyy too long for any human audience. 
        But now you can turn any one of my blog posts into an instant haiku.
      </p>

      <a 
        href="https://hardmodefirst.xyz/" 
        target="_blank" 
        rel="noopener noreferrer"
        style={{ 
          display: 'inline-block',
          margin: '20px 0',
          color: '#2C5282',
          textDecoration: 'underline'
        }}
      >
        Visit my blog
      </a>

      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1rem', color: '#2C5282' }}>Select a Blog Post</h2>
        <select 
          onChange={(e) => setSelectedPost(e.target.value)}
          style={{
            width: '100%',
            padding: '0.5rem',
            marginBottom: '1rem',
            borderRadius: '0.375rem',
            border: '1px solid #CBD5E0',
            fontSize: '1rem'
          }}
        >
          <option value="">Latest Post</option>
          {blogPosts.map((post) => (
            <option key={post.id} value={post.id}>
              {post.title}
            </option>
          ))}
        </select>

        <button 
          onClick={() => generateHaiku(selectedPost)}
          disabled={loading}
          style={{
            backgroundColor: '#2C5282',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.375rem',
            border: 'none',
            cursor: loading ? 'wait' : 'pointer',
            opacity: loading ? 0.7 : 1,
            fontSize: '1rem'
          }}
        >
          {loading ? 'Generating...' : 'Generate Haiku'}
        </button>
      </div>

      {result && !result.error && (
        <div style={{
          backgroundColor: '#EDF2F7',
          padding: '2rem',
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          marginTop: '2rem'
        }}>
          <h3 style={{ 
            marginBottom: '1rem',
            color: '#2C5282',
            fontSize: '1.25rem'
          }}>
            {result.title}
          </h3>
          <div style={{
            fontFamily: 'Georgia, serif',
            fontSize: '1.125rem',
            lineHeight: '1.75',
            color: '#2D3748'
          }}>
            {result.haiku.map((line, index) => (
              <p key={index} style={{ margin: '0.5rem 0' }}>{line}</p>
            ))}
          </div>
        </div>
      )}

      {result?.error && (
        <div style={{
          backgroundColor: '#FED7D7',
          color: '#C53030',
          padding: '1rem',
          borderRadius: '0.375rem',
          marginTop: '1rem'
        }}>
          {result.error}
        </div>
      )}
    </div>
  );
} 