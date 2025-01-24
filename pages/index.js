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
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      padding: '20px',
      maxWidth: '100%',
      margin: '0 auto',
      marginTop: '20px',
      fontFamily: '"Comic Sans MS", "Chalkboard SE", "Comic Neue", cursive, sans-serif',
      color: '#333',
      backgroundImage: 'url(/hmf-haiku.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center top',
      backgroundRepeat: 'no-repeat',
      border: '5px solid #FFD700',
      borderRadius: '10px',
      boxShadow: '0 0 10px #FF69B4',
      textAlign: 'center'
    }}>
      <div style={{ flex: '1' }}>
        <div style={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.8)', 
          padding: '20px', 
          borderRadius: '10px',
          marginBottom: '20px',
          marginTop: '300px'
        }}>
          <p style={{ 
            fontSize: '1.5rem', 
            lineHeight: '1.75', 
            color: '#800080'
          }}>
            Tired of reading 1000-word blog posts?<br/>
            Have a haiku instead. &hearts;
          </p>

          <a 
            href="https://hardmodefirst.xyz/" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ 
              display: 'inline-block',
              margin: '20px 0',
              color: '#FF4500',
              textDecoration: 'underline',
              fontWeight: 'bold',
              fontSize: '1.5rem'
            }}
          >
            Visit my blog
          </a>
        </div>

        <div style={{ 
          padding: '20px', 
          borderRadius: '10px',
          marginBottom: '20px',
          marginTop: '150px'
        }}>
          <h2 style={{ marginBottom: '1rem', color: '#000000', fontSize: '2rem' }}>Select a Blog Post</h2>
          <select 
            onChange={(e) => setSelectedPost(e.target.value)}
            style={{
              width: '90%',
              padding: '0.5rem',
              marginBottom: '1rem',
              borderRadius: '0.375rem',
              border: '2px solid #FFD700',
              fontSize: '1rem',
              backgroundColor: '#FFFACD',
              color: '#000000'
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
              backgroundColor: '#FF4500',
              color: 'white',
              padding: '0.75rem 1rem',
              borderRadius: '0.375rem',
              border: 'none',
              cursor: loading ? 'wait' : 'pointer',
              opacity: loading ? 0.7 : 1,
              fontSize: '1rem',
              boxShadow: '0 0 5px #FFD700'
            }}
          >
            {loading ? 'Generating...' : 'Generate Haiku'}
          </button>
        </div>

        {result && !result.error && (
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            padding: '20px',
            borderRadius: '10px',
            boxShadow: '0 0 10px #FF69B4',
            marginTop: '20px'
          }}>
            <h3 style={{ 
              marginBottom: '1rem',
              color: '#FF4500',
              fontSize: '1.5rem'
            }}>
              {result.title}
            </h3>
            <div style={{
              fontFamily: '"Comic Sans MS", "Chalkboard SE", "Comic Neue", cursive, sans-serif',
              fontSize: '1.25rem',
              lineHeight: '1.75',
              color: '#000000'
            }}>
              {result.haiku.map((line, index) => (
                <p key={index} style={{ margin: '0.5rem 0' }}>{line}</p>
              ))}
            </div>
            <a 
              href={result.url} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ 
                display: 'inline-block',
                marginTop: '20px',
                color: '#FF4500',
                textDecoration: 'underline',
                fontWeight: 'bold',
                fontSize: '1.5rem'
              }}
            >
              Read the full blog post
            </a>
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

      <footer style={{ 
        marginTop: '40px', 
        fontSize: '1rem', 
        color: '#000000' 
      }}>
        Made with {"♥"} by Bethany Crystal, with the help of Cursor, Vercel, Claude, Flux, and Paragraph.xyz.
      </footer>
    </div>
  );
} 