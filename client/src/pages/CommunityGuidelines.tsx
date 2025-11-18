import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Heart } from "lucide-react";

export default function CommunityGuidelines() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 px-4 py-12 max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <Heart className="w-12 h-12 mx-auto mb-4 text-primary" />
          <h1 className="text-4xl font-bold mb-2" data-testid="guidelines-title">Community Guidelines</h1>
          <p className="text-muted-foreground">Be kind, respectful, and make friends safely</p>
        </div>

        <div className="space-y-8 text-foreground">
          <section>
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p className="leading-relaxed">
              Talkastranger exists to help people from around the world connect, share experiences, and make genuine friendships. We're committed to providing a safe, welcoming environment for everyone.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Core Values</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">1. Respect Everyone</h3>
                <p className="leading-relaxed">
                  Treat all users with kindness and respect, regardless of their background, beliefs, or identity. Remember there's a real person on the other side of the screen.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2">2. Keep It Clean</h3>
                <p className="leading-relaxed">
                  No nudity, sexually explicit content, or inappropriate behavior. Talkastranger is for friendly conversations, not adult content.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2">3. Stay Safe</h3>
                <p className="leading-relaxed">
                  Never share personal information like your full name, address, phone number, or financial details. Protect your privacy and safety online.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2">4. Be Yourself</h3>
                <p className="leading-relaxed">
                  Authenticity creates the best connections. Don't impersonate others or misrepresent yourself.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2">5. Report Issues</h3>
                <p className="leading-relaxed">
                  If you encounter inappropriate behavior, use the report button immediately. Help us keep the community safe for everyone.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Prohibited Behavior</h2>
            <p className="leading-relaxed mb-4">The following actions will result in immediate banning:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Nudity or sexual content of any kind</li>
              <li>Harassment, bullying, or threats</li>
              <li>Hate speech or discrimination</li>
              <li>Violence or self-harm content</li>
              <li>Spam, advertising, or solicitation</li>
              <li>Sharing others' personal information</li>
              <li>Recording or screenshotting without consent</li>
              <li>Using the platform if you're under 18</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Best Practices for Great Conversations</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Start with a friendly greeting</strong> - A simple "Hi, how are you?" goes a long way</li>
              <li><strong>Ask open-ended questions</strong> - Learn about their culture, interests, and experiences</li>
              <li><strong>Be patient with language barriers</strong> - Not everyone speaks English fluently</li>
              <li><strong>Stay positive</strong> - Share good vibes and interesting stories</li>
              <li><strong>Know when to skip</strong> - If a conversation isn't working, it's okay to move on politely</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Safety Tips</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Never share personal contact information</li>
              <li>Don't click suspicious links shared in chat</li>
              <li>Use the platform in a private, safe location</li>
              <li>Trust your instincts - if something feels wrong, skip or report</li>
              <li>Remember conversations are not recorded by us, but users might try to record</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Enforcement</h2>
            <p className="leading-relaxed">
              Violations of these guidelines may result in temporary or permanent bans from the platform. We review all reports and take appropriate action. Serious violations may be reported to law enforcement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
            <p className="leading-relaxed">
              Questions about these guidelines? Contact us at support@talkastranger.com
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
