export default function Loading() {
  return (
    <div style={{
      minHeight: '60vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--background)',
      gap: '2rem',
    }}>
      <ul className="casano-pound-loader">
        <li /><li /><li /><li /><li />
      </ul>
      <p style={{
        color: 'var(--text-secondary)',
        fontFamily: 'Plus Jakarta Sans, sans-serif',
        fontSize: '0.9rem',
        letterSpacing: '0.05em',
      }}>Loading…</p>

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
