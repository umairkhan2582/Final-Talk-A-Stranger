import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Shield } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 px-4 py-12 max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <Shield className="w-12 h-12 mx-auto mb-4 text-primary" />
          <h1 className="text-4xl font-bold mb-2" data-testid="privacy-title">Privacy Policy</h1>
          <p className="text-muted-foreground">Last updated: November 17, 2025</p>
        </div>

        <div className="space-y-8 text-foreground">
          <section>
            <h2 className="text-2xl font-bold mb-4">Introduction</h2>
            <p className="leading-relaxed">
              Talkastranger ("we," "our," or "us") respects your privacy. This Privacy Policy explains how we collect, use, and protect your information when you use our random video chat service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Information We Collect</h2>
            <h3 className="text-xl font-semibold mb-2">Anonymous Usage</h3>
            <p className="leading-relaxed mb-4">
              Talkastranger is designed for anonymous video chatting. We do not require registration or personal information to use our service. However, we may collect:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Anonymous session data (connection times, duration)</li>
              <li>Technical information (browser type, device type, IP address)</li>
              <li>Video and audio streams (processed in real-time, not stored)</li>
              <li>Chat messages (temporary, deleted after session ends)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">How We Use Your Information</h2>
            <p className="leading-relaxed mb-4">We use collected information to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Facilitate peer-to-peer video connections</li>
              <li>Improve service quality and user experience</li>
              <li>Monitor for abuse and enforce community guidelines</li>
              <li>Analyze usage patterns and optimize performance</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Data Storage and Security</h2>
            <p className="leading-relaxed">
              Video and audio streams are transmitted directly between users via WebRTC (peer-to-peer). We do not record, store, or access your video/audio content. Chat messages are stored temporarily in memory and deleted when the chat session ends. We implement industry-standard security measures to protect data transmission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Cookies and Tracking Technologies</h2>
            <h3 className="text-xl font-semibold mb-2">Types of Cookies We Use</h3>
            <p className="leading-relaxed mb-4">
              We use cookies and similar tracking technologies to enhance your experience on Talkastranger:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li><strong>Essential Cookies:</strong> Required for basic site functionality, session management, and security</li>
              <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our site (via Google Analytics)</li>
              <li><strong>Advertising Cookies:</strong> Used by Google AdSense and advertising partners to show relevant ads</li>
              <li><strong>Preference Cookies:</strong> Remember your settings and preferences for future visits</li>
            </ul>
            <p className="leading-relaxed mb-4">
              You can control cookie preferences through your browser settings. However, disabling certain cookies may limit site functionality. By continuing to use Talkastranger, you consent to our use of cookies as described in this policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Advertising and Third-Party Services</h2>
            <h3 className="text-xl font-semibold mb-2">Google Analytics</h3>
            <p className="leading-relaxed mb-4">
              We use Google Analytics (tracking ID: G-WW21DZXT79) to analyze website traffic and user behavior. Google Analytics collects information such as:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Pages visited and time spent on each page</li>
              <li>Demographic and interest data</li>
              <li>Device type, browser, and operating system</li>
              <li>Geographic location (country and city level)</li>
            </ul>
            <p className="leading-relaxed mb-4">
              This data is processed by Google and subject to Google's Privacy Policy. You can opt-out of Google Analytics tracking by installing the <a href="https://tools.google.com/dlpage/gaoptout" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Google Analytics Opt-out Browser Add-on</a>.
            </p>

            <h3 className="text-xl font-semibold mb-2 mt-6">Google AdSense</h3>
            <p className="leading-relaxed mb-4">
              We participate in the Google AdSense program to display advertisements on our website. Google AdSense uses cookies and web beacons to:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Serve ads based on your prior visits to Talkastranger or other websites</li>
              <li>Display personalized advertising based on your interests</li>
              <li>Measure ad performance and engagement</li>
              <li>Prevent fraudulent ad clicks</li>
            </ul>
            <p className="leading-relaxed mb-4">
              Google and its advertising partners may use cookies, web beacons, and similar technologies to collect and use data about your visits. You can manage your ad preferences and opt-out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Google Ads Settings</a> or <a href="http://www.aboutads.info/choices/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Digital Advertising Alliance Consumer Choice</a>.
            </p>

            <h3 className="text-xl font-semibold mb-2 mt-6">Other Third-Party Services</h3>
            <p className="leading-relaxed">
              We use STUN servers (provided by Google) to facilitate peer-to-peer WebRTC connections. These servers help establish video connections but do not store your content.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Data Retention</h2>
            <p className="leading-relaxed mb-4">
              We retain different types of data for varying periods:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Chat Messages:</strong> Deleted immediately when your session ends</li>
              <li><strong>Video/Audio Streams:</strong> Never stored - transmitted peer-to-peer only</li>
              <li><strong>Session Data:</strong> Retained for up to 90 days for analytics purposes</li>
              <li><strong>Technical Logs:</strong> Retained for up to 30 days for debugging and security</li>
              <li><strong>Analytics Data:</strong> Retained according to Google Analytics retention policies (up to 26 months)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Children's Privacy</h2>
            <p className="leading-relaxed">
              Talkastranger is intended for users aged 18 and above. We do not knowingly collect information from minors. If you are under 18, please do not use our service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Your Rights</h2>
            <p className="leading-relaxed mb-4">You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Use our service anonymously without providing personal information</li>
              <li>Disconnect from any chat at any time</li>
              <li>Report inappropriate behavior</li>
              <li>Request information about data we may have collected</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Changes to This Policy</h2>
            <p className="leading-relaxed">
              We may update this Privacy Policy periodically. Changes will be posted on this page with an updated revision date. Continued use of Talkastranger after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
            <p className="leading-relaxed">
              If you have questions about this Privacy Policy, please contact us at support@talkastranger.com
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
