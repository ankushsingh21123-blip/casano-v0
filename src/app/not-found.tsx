import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--background)',
      gap: '2rem',
      textAlign: 'center',
      padding: '2rem',
    }}>
      <ul className="casano-pound-loader">
        <li /><li /><li /><li /><li />
      </ul>

      <div>
        <h1 style={{
          fontSize: '5rem', fontWeight: 900, color: '#C1492E',
          lineHeight: 1, fontFamily: 'Playfair Display, serif',
        }}>404</h1>
        <p style={{
          fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)',
          fontFamily: 'Plus Jakarta Sans, sans-serif', marginTop: '0.5rem',
        }}>Page not found</p>
        <p style={{
          color: 'var(--text-secondary)', fontFamily: 'Plus Jakarta Sans, sans-serif',
          fontSize: '0.9rem', marginTop: '0.5rem', maxWidth: '320px',
        }}>The page you're looking for doesn't exist or was moved.</p>
      </div>

      <Link href="/" style={{
        background: '#C1492E', color: '#fff', fontFamily: 'Plus Jakarta Sans, sans-serif',
        fontWeight: 700, padding: '0.75rem 2rem', borderRadius: '0.75rem',
        textDecoration: 'none', fontSize: '0.95rem',
      }}>← Back to Home</Link>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes casano-pound {
          to {
            transform: scale(1.2);
            box-shadow: 1px 2px 3px 0 rgba(0,0,0,0.65), 2px 6px 12px 0 rgba(0,0,0,0.5), 3px 8px 15px 0 rgba(0,0,0,0.45);
          }
        }
        ul.casano-pound-loader {
          display: block;
          position: relative;
          width: 5em;
          padding: 0;
          margin: 0;
        }
        .casano-pound-loader li {
          list-style: none;
          display: block;
          float: left;
          width: 0.5em;
          height: 3em;
          margin: 0 0.5em 0 0;
          background: linear-gradient(to bottom, #C1492E 0%, #A63C25 100%);
          box-shadow: 1px 1px 1px 0 rgba(0,0,0,0), 1px 1px 1px 0 rgba(0,0,0,0), 1px 1px 1px 0 rgba(0,0,0,0);
          animation: casano-pound 1s ease-in-out infinite alternate;
          animation-delay: 0.05s;
          transform-origin: center;
          border-radius: 2px;
        }
        .casano-pound-loader li:nth-child(2) { animation-delay: 0.25s; }
        .casano-pound-loader li:nth-child(3) { animation-delay: 0.45s; }
        .casano-pound-loader li:nth-child(4) { animation-delay: 0.65s; }
        .casano-pound-loader li:nth-child(5) { animation-delay: 0.85s; }
      `}} />
    </div>
  );
}
