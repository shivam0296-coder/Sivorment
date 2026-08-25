import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-brand"><span className="brand-mark">S</span><strong>SIVORMENT</strong><p>A digital world where nature becomes the interface.</p></div>
      <div><h3>Discover</h3><Link href="/plants">All plants</Link><Link href="/finder">Plant finder</Link><Link href="/care">Care guides</Link></div>
      <div><h3>Marketplace</h3><Link href="/sell">Become a seller</Link><Link href="/account">Your account</Link><Link href="/orders">Orders</Link></div>
      <div><h3>Grow with us</h3><p>Stories, seasonal care and new city launches.</p><form className="footer-form"><label className="sr-only" htmlFor="footer-email">Email address</label><input id="footer-email" type="email" placeholder="Email address" /><button type="submit" aria-label="Subscribe">→</button></form></div>
      <p className="footer-base">© {new Date().getFullYear()} Sivorment. Plants are living products; availability and appearance vary naturally.</p>
    </footer>
  );
}
