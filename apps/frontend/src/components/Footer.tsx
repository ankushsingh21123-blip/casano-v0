import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const SOCIAL = [
  { Icon: Instagram, href: "#", label: "Instagram" },
  { Icon: Twitter,   href: "#", label: "Twitter"   },
  { Icon: Facebook,  href: "#", label: "Facebook"  },
  { Icon: Linkedin,  href: "#", label: "LinkedIn"  },
];

const LINKS = {
  Categories: [
    ["Grocery & Staples",       "/category/groceries"  ],
    ["Vegetables & Fruits",     "/category/groceries"  ],
    ["Dairy & Bakery",          "/category/groceries"  ],
    ["Snacks & Branded Foods",  "/category/groceries"  ],
    ["Beverages",               "/category/groceries"  ],
    ["Personal Care",           "/category/pharmacy"   ],
  ],
  Company: [
    ["About Us",            "/about"      ],
    ["Careers",             "/careers"    ],
    ["Delivery Areas",      "/"           ],
    ["Investor Relations",  "/investors"  ],
    ["Press & Media",       "/"           ],
    ["Blog",                "/"           ],
  ],
  "Store Owners 🏪": [
    ["Become a Partner Store →",  "https://form.typeform.com/to/lQOu4edG#user_id=xxxxx&first_name=xxxxx&last_name=xxxxx&email=xxxxx&phone_number=xxxxx&product_id=xxxxx&auth_code=xxxxx" ],
    ["Vendor App Login",          "/vendor"       ],
    ["How It Works",              "/"             ],
    ["Partner FAQ",               "/"             ],
  ],
};

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="casano-footer">
      {/* Gold shimmer top border */}
      <div style={{ height: "2px", background: "linear-gradient(90deg, transparent, #B8962E66, transparent)" }} />

      <div className="casano-footer-inner">
        {/* ── Brand column ── */}
        <div className="casano-footer-brand">
          <Link href="/" className="casano-footer-logo">
            <span style={{ color: "#C1492E" }}>Casano</span>
            <span style={{ color: "var(--text-primary)" }}>.in</span>
          </Link>
          <p className="casano-footer-tagline">
            Hyperlocal delivery from your neighbourhood Kirana store — in 15 minutes.
          </p>

          {/* Social icons — magnetic on desktop */}
          <div className="casano-footer-socials">
            {SOCIAL.map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="casano-social-icon"
                data-cursor="link"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>

          {/* Partner CTA */}
          <Link
            href="https://form.typeform.com/to/lQOu4edG#user_id=xxxxx&first_name=xxxxx&last_name=xxxxx&email=xxxxx&phone_number=xxxxx&product_id=xxxxx&auth_code=xxxxx"
            target="_blank"
            className="casano-partner-link"
            data-cursor="link"
          >
            Add Your Store →
          </Link>

          {/* App badges */}
          <div className="casano-footer-apps">
            <a href="#" className="casano-app-badge">
              <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" style={{ height: "36px", width: "auto" }} />
            </a>
            <a href="#" className="casano-app-badge">
              <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="App Store" style={{ height: "36px", width: "auto" }} />
            </a>
          </div>
        </div>

        {/* ── Link columns ── */}
        {Object.entries(LINKS).map(([group, links]) => (
          <div key={group} className="casano-footer-col">
            <h3 className="casano-footer-col-title">{group}</h3>
            <ul className="casano-footer-col-links">
              {links.map(([label, href]) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="casano-footer-link"
                    data-cursor="link"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom strip */}
      <div className="casano-footer-bottom">
        <p>© {year} Casano Technologies Private Limited. All rights reserved.</p>
        <p>"Casano" is owned &amp; managed by Casano Technologies Private Limited.</p>
      </div>

      <style jsx global>{`
        .casano-footer {
          background: var(--surface-card);
          border-top: 1px solid var(--surface-border);
          position: relative;
          overflow: hidden;
        }
        .casano-footer::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 200px;
          background: radial-gradient(ellipse at 50% 0%, #C1492E06 0%, transparent 70%);
          pointer-events: none;
        }
        .casano-footer-inner {
          max-width: 1440px;
          margin: 0 auto;
          padding: 56px 24px 40px;
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 40px;
          position: relative;
          z-index: 1;
        }
        @media (max-width: 1100px) {
          .casano-footer-inner {
            grid-template-columns: 1fr 1fr;
          }
        }
        @media (max-width: 640px) {
          .casano-footer-inner {
            grid-template-columns: 1fr;
            padding: 40px 16px;
          }
        }

        .casano-footer-logo {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 28px;
          font-weight: 900;
          letter-spacing: -0.02em;
          display: inline-block;
          margin-bottom: 12px;
          transition: opacity 0.2s;
        }
        .casano-footer-logo:hover { opacity: 0.85; }

        .casano-footer-tagline {
          font-size: 14px;
          line-height: 1.65;
          color: var(--text-secondary);
          max-width: 280px;
          margin-bottom: 20px;
        }

        .casano-footer-socials {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
        }
        .casano-social-icon {
          width: 38px; height: 38px;
          border-radius: 10px;
          background: var(--bg-main);
          border: 1px solid var(--surface-border);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
          transition: color 0.2s, border-color 0.2s, transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.2s;
        }
        .casano-social-icon:hover {
          color: #C1492E;
          border-color: #C1492E66;
          background: #FAE8E5;
          transform: translateY(-3px);
        }

        .casano-partner-link {
          display: inline-block;
          font-size: 14px;
          font-weight: 700;
          color: #214A36;
          margin-bottom: 20px;
          transition: color 0.2s, transform 0.2s;
        }
        .casano-partner-link:hover {
          color: #C1492E;
          transform: translateX(4px);
        }

        .casano-footer-apps {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }
        .casano-app-badge {
          display: block;
          transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s;
        }
        .casano-app-badge:hover { transform: scale(1.05); opacity: 0.9; }

        .casano-footer-col-title {
          font-size: 14px;
          font-weight: 800;
          color: var(--text-primary);
          margin: 0 0 16px;
          letter-spacing: 0.01em;
        }
        .casano-footer-col-links {
          list-style: none;
          padding: 0; margin: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .casano-footer-link {
          font-size: 14px;
          color: var(--text-secondary);
          transition: color 0.2s, transform 0.2s;
          display: inline-block;
        }
        .casano-footer-link:hover {
          color: #C1492E;
          transform: translateX(4px);
        }

        .casano-footer-bottom {
          max-width: 1440px;
          margin: 0 auto;
          padding: 20px 24px;
          border-top: 1px solid var(--surface-border);
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          gap: 8px;
        }
        .casano-footer-bottom p {
          font-size: 12px;
          color: var(--text-muted);
          font-weight: 500;
          margin: 0;
        }
      `}</style>
    </footer>
  );
}
