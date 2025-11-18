import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FileText } from "lucide-react";

export default function TermsOfService() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 px-4 py-12 max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <FileText className="w-12 h-12 mx-auto mb-4 text-primary" />
          <h1 className="text-4xl font-bold mb-2" data-testid="terms-title">Terms of Service</h1>
          <p className="text-muted-foreground">Last updated: November 17, 2025</p>
        </div>

        <div className="space-y-8 text-foreground">
          <section>
            <h2 className="text-2xl font-bold mb-4">Agreement to Terms</h2>
            <p className="leading-relaxed">
              By accessing or using Talkastranger, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using this service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Service Description</h2>
            <p className="leading-relaxed mb-4">
              Talkastranger is a free random video chat platform that connects users worldwide for spontaneous conversations. The service uses WebRTC technology for peer-to-peer video and audio connections.
            </p>
            <p className="leading-relaxed">
              Our service is supported by advertising through Google AdSense and other advertising partners. By using Talkastranger, you consent to view advertisements displayed on the platform. Third-party advertisers may use cookies and similar technologies to serve personalized ads based on your interests and browsing activity.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">User Eligibility</h2>
            <p className="leading-relaxed mb-4">
              You must be at least 18 years old to use Talkastranger. By using this service, you represent and warrant that:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>You are 18 years of age or older</li>
              <li>You have the legal capacity to enter into these Terms</li>
              <li>You will comply with all applicable laws and regulations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Prohibited Conduct</h2>
            <p className="leading-relaxed mb-4">You agree NOT to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Display nudity or sexually explicit content</li>
              <li>Harass, threaten, or abuse other users</li>
              <li>Share personal information of others without consent</li>
              <li>Use the service for commercial purposes or spam</li>
              <li>Impersonate others or misrepresent your identity</li>
              <li>Record, screenshot, or share content from video chats</li>
              <li>Use bots, scripts, or automated tools</li>
              <li>Engage in illegal activities</li>
              <li>Bypass or attempt to bypass any security features</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Content and Conduct</h2>
            <p className="leading-relaxed">
              Users are solely responsible for their conduct and any content they share during video chats. We do not monitor all communications but reserve the right to investigate reports of violations and take appropriate action, including banning users.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Disclaimer of Warranties</h2>
            <p className="leading-relaxed">
              Talkastranger is provided "as is" without any warranties, express or implied. We do not guarantee uninterrupted service, error-free operation, or that the service will meet your requirements. You use the service at your own risk.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Limitation of Liability</h2>
            <p className="leading-relaxed">
              To the maximum extent permitted by law, Talkastranger and its operators shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the service, including but not limited to interactions with other users.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Termination</h2>
            <p className="leading-relaxed">
              We reserve the right to terminate or suspend access to our service immediately, without prior notice, for any reason, including violation of these Terms. Users may discontinue use at any time by closing their browser.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Modifications to Service</h2>
            <p className="leading-relaxed">
              We reserve the right to modify, suspend, or discontinue the service at any time without notice. We shall not be liable to you or any third party for any modification, suspension, or discontinuation.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Governing Law</h2>
            <p className="leading-relaxed">
              These Terms shall be governed by and construed in accordance with applicable international laws. Any disputes shall be resolved through binding arbitration.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
            <p className="leading-relaxed">
              For questions about these Terms of Service, contact us at support@talkastranger.com
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
