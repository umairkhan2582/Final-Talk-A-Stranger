import { Link } from "wouter";
import { Video, Globe } from "lucide-react";
import tassyLogo from "@assets/generated_images/TASSY_mascot_character_design_a24f8778.png";

export default function Footer() {
  return (
    <footer className="border-t border-card-border bg-card/50 backdrop-blur mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <Video className="w-6 h-6 text-primary-foreground" />
              </div>
              <img src={tassyLogo} alt="TASSY Mascot" className="w-10 h-10 rounded-full object-cover" />
              <div className="flex flex-col">
                <span className="font-bold text-lg leading-none">Talkastranger</span>
                <span className="text-xs text-muted-foreground">Video Chat</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Connect with strangers worldwide through free random video chat. Make new friends, practice languages, and explore different cultures.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold mb-4" data-testid="footer-heading-quick-links">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="footer-link-home">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/countries" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="footer-link-countries">
                  Countries
                </Link>
              </li>
              <li>
                <Link href="/cities" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="footer-link-cities">
                  Cities
                </Link>
              </li>
              <li>
                <Link href="/areas" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="footer-link-areas">
                  Areas
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="footer-link-about">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="footer-link-contact">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/sitemap" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="footer-link-sitemap">
                  Sitemap
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-bold mb-4" data-testid="footer-heading-legal">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="footer-link-privacy">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="footer-link-terms">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/community-guidelines" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="footer-link-guidelines">
                  Community Guidelines
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="font-bold mb-4" data-testid="footer-heading-contact">Contact Us</h3>
            <ul className="space-y-2 text-sm">
              <li className="text-muted-foreground">
                <a href="mailto:info@talkastranger.com" className="hover:text-foreground transition-colors" data-testid="footer-email-info">
                  info@talkastranger.com
                </a>
              </li>
              <li className="text-muted-foreground">
                <a href="mailto:talkastranger.dubai@gmail.com" className="hover:text-foreground transition-colors" data-testid="footer-email-dubai">
                  talkastranger.dubai@gmail.com
                </a>
              </li>
              <li className="text-muted-foreground mt-4">
                <strong className="block mb-1">Office Address:</strong>
                5th Avenue Management<br />
                Al Furjan<br />
                Dubai, United Arab Emirates
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-card-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p data-testid="footer-copyright">
            © 2025 Talkastranger. All rights reserved.
          </p>
          <p data-testid="footer-disclaimer">
            For users 18+ only. Use responsibly and stay safe online.
          </p>
        </div>
      </div>
    </footer>
  );
}
