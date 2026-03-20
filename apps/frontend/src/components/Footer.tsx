import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="w-full border-t pt-16 pb-8 mt-12 transition-colors duration-300"
      style={{ background: "#EFEADD", borderColor: "#E2DDD0" }}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6">

        {/* Gold shimmer divider at top */}
        <div className="h-px mb-12" style={{ background: "linear-gradient(90deg, transparent, #B8962E66, transparent)" }} />

        {/* Links grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-12">

          {/* Brand */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-black tracking-tight mb-3">
              <span style={{ color: "#C1492E" }}>Casano</span>
              <span style={{ color: "#2A2B2A" }}>.in</span>
            </h2>
            <p className="text-sm leading-relaxed mb-3" style={{ color: "#5A5B5A" }}>
              Hyperlocal delivery from your neighbourhood Kirana store — in 15 minutes.
            </p>
            <Link
              href="/about"
              className="inline-flex items-center gap-1.5 text-sm font-semibold mb-5 transition-colors"
              style={{ color: "#C1492E" }}
            >
              About Us
              <span className="text-xs">→</span>
            </Link>
            <div className="flex items-center gap-3 mb-5">
              {[
                { Icon: Instagram, hover: "#C1492E" },
                { Icon: Twitter, hover: "#214A36" },
                { Icon: Facebook, hover: "#214A36" },
                { Icon: Linkedin, hover: "#214A36" },
              ].map(({ Icon, hover }, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
                  style={{ background: "#FDFBF7", color: "#5A5B5A", border: "1px solid #E2DDD0" }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLAnchorElement).style.color = hover;
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = hover;
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLAnchorElement).style.color = "#5A5B5A";
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = "#E2DDD0";
                  }}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
            <Link
              href="https://form.typeform.com/to/lQOu4edG#user_id=xxxxx&first_name=xxxxx&last_name=xxxxx&email=xxxxx&phone_number=xxxxx&product_id=xxxxx&auth_code=xxxxx"
              target="_blank"
              className="inline-flex items-center gap-1.5 text-sm font-semibold transition-colors"
              style={{ color: "#214A36" }}
            >
              Add Your Store
              <span className="text-xs">→</span>
            </Link>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-bold mb-4 text-[15px]" style={{ color: "#2A2B2A" }}>Categories</h3>
            <ul className="flex flex-col gap-2.5">
              {["Grocery & Staples", "Vegetables & Fruits", "Dairy & Bakery", "Snacks & Branded Foods", "Beverages", "Personal Care"].map(c => (
                <li key={c}>
                  <Link href="#" className="text-sm transition-colors" style={{ color: "#5A5B5A" }}
                    onMouseEnter={e => ((e.target as HTMLAnchorElement).style.color = "#C1492E")}
                    onMouseLeave={e => ((e.target as HTMLAnchorElement).style.color = "#5A5B5A")}
                  >{c}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Useful Links */}
          <div>
            <h3 className="font-bold mb-4 text-[15px]" style={{ color: "#2A2B2A" }}>Company</h3>
            <ul className="flex flex-col gap-2.5">
              {[["About Us", "/about"], ["Careers", "/careers"], ["Contact Us", "https://form.typeform.com/to/lQOu4edG#user_id=xxxxx&first_name=xxxxx&last_name=xxxxx&email=xxxxx&phone_number=xxxxx&product_id=xxxxx&auth_code=xxxxx"], ["Delivery Areas", "/delivery-areas"], ["Investor Relations", "/investors"], ["Press & Media", "/press"], ["Blog", "/blog"]].map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="text-sm transition-colors" style={{ color: "#5A5B5A" }}
                    onMouseEnter={e => ((e.target as HTMLAnchorElement).style.color = "#C1492E")}
                    onMouseLeave={e => ((e.target as HTMLAnchorElement).style.color = "#5A5B5A")}
                  >{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Store Owners */}
          <div>
            <h3 className="font-bold mb-4 text-[15px]" style={{ color: "#2A2B2A" }}>For Store Owners 🏪</h3>
            <ul className="flex flex-col gap-2.5">
              <li>
                <Link href="/partner" className="text-sm font-semibold" style={{ color: "#214A36" }}>
                  Become a Partner Store →
                </Link>
              </li>
              {[["Vendor App Login", "/vendor"], ["How It Works", "/partner/how-it-works"], ["Partner FAQ", "/partner/faq"]].map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="text-sm transition-colors" style={{ color: "#5A5B5A" }}
                    onMouseEnter={e => ((e.target as HTMLAnchorElement).style.color = "#214A36")}
                    onMouseLeave={e => ((e.target as HTMLAnchorElement).style.color = "#5A5B5A")}
                  >{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Download App */}
          <div className="lg:col-span-1">
            <h3 className="font-bold mb-4 text-[15px]" style={{ color: "#2A2B2A" }}>Download App</h3>
            <div className="flex flex-col gap-3">
              <a href="#" className="inline-block hover:opacity-80 transition-opacity">
                <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" className="h-10 w-auto" />
              </a>
              <a href="#" className="inline-block hover:opacity-80 transition-opacity">
                <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="App Store" className="h-10 w-auto" />
              </a>
            </div>
            <p className="text-xs mt-5 leading-relaxed" style={{ color: "#9A9B9A" }}>
              Shop on the go. Get the best of Casano delivered in 15 minutes.
            </p>
          </div>
        </div>

        {/* Bottom */}
        <div
          className="flex flex-col md:flex-row items-center justify-between pt-8 mt-2"
          style={{ borderTop: "1px solid #E2DDD0" }}
        >
          <p className="text-xs font-medium mb-3 md:mb-0" style={{ color: "#9A9B9A" }}>
            © {currentYear} Casano Technologies Private Limited. All rights reserved.
          </p>
          <div className="text-xs font-medium" style={{ color: "#9A9B9A" }}>
            &quot;Casano&quot; is owned &amp; managed by Casano Technologies Private Limited.
          </div>
        </div>
      </div>
    </footer>
  );
}
