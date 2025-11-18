import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Users, MessageCircle, Home, Sparkles, Shield } from "lucide-react";

export default function MarriageGuidance() {
  return (
    <section className="px-4 py-12 max-w-6xl mx-auto" data-testid="section-marriage-guidance">
      <div className="text-center mb-10">
        <Sparkles className="w-12 h-12 mx-auto mb-4 text-primary" />
        <h2 className="text-3xl md:text-4xl font-bold mb-3" data-testid="heading-marriage-guidance">
          Finding Your Life Partner on TalkAStranger
        </h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto" data-testid="text-marriage-intro">
          Connect with potential spouses worldwide while maintaining Islamic values and family involvement
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <Card data-testid="card-find-bride">
          <CardHeader>
            <Heart className="w-8 h-8 mb-2 text-primary" />
            <CardTitle data-testid="title-find-bride">How to Find a Bride</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-relaxed text-muted-foreground">
            <p>
              <strong className="text-foreground">Be Clear About Your Intentions:</strong> When you connect with someone, introduce yourself respectfully and express that you're looking for marriage. Honesty from the start builds trust.
            </p>
            <p>
              <strong className="text-foreground">Look for Character and Faith:</strong> Focus on finding someone with strong Islamic values, good character, and similar life goals. Observe how they communicate and treat others.
            </p>
            <p>
              <strong className="text-foreground">Involve Your Family Early:</strong> Once you find someone compatible, introduce them to your family through video chat. Your family's wisdom and support are invaluable.
            </p>
            <p>
              <strong className="text-foreground">Take Time to Know Each Other:</strong> Discuss important topics like faith, family values, career goals, and future plans. Meaningful conversations reveal true compatibility.
            </p>
            <p>
              <strong className="text-foreground">Respect Islamic Guidelines:</strong> Maintain proper boundaries, avoid being alone in private chats without family knowledge, and keep conversations purposeful and respectful.
            </p>
          </CardContent>
        </Card>

        <Card data-testid="card-find-groom">
          <CardHeader>
            <Users className="w-8 h-8 mb-2 text-primary" />
            <CardTitle data-testid="title-find-groom">How to Find a Groom</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-relaxed text-muted-foreground">
            <p>
              <strong className="text-foreground">Assess Character First:</strong> Look for someone with good manners, strong faith, and respect for family. Character matters more than superficial qualities.
            </p>
            <p>
              <strong className="text-foreground">Ask Important Questions:</strong> Discuss his career, education, family background, and future aspirations. Understanding his goals helps assess long-term compatibility.
            </p>
            <p>
              <strong className="text-foreground">Observe Communication Style:</strong> Notice how he speaks about his family, handles disagreements, and treats others. These reveal his true nature.
            </p>
            <p>
              <strong className="text-foreground">Involve Your Mahram:</strong> Keep your guardian or family informed about your conversations. Their involvement protects you and ensures proper Islamic conduct.
            </p>
            <p>
              <strong className="text-foreground">Trust Your Instincts:</strong> If something feels wrong or rushed, take a step back. A good spouse will respect your pace and family's involvement.
            </p>
          </CardContent>
        </Card>

        <Card data-testid="card-family-communication">
          <CardHeader>
            <MessageCircle className="w-8 h-8 mb-2 text-primary" />
            <CardTitle data-testid="title-family-communication">Communicating with Their Family</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-relaxed text-muted-foreground">
            <p>
              <strong className="text-foreground">Show Respect and Courtesy:</strong> Address family members with proper titles and formality. First impressions with the family are crucial for building trust.
            </p>
            <p>
              <strong className="text-foreground">Be Your Authentic Self:</strong> Share your background, education, and values honestly. Families appreciate sincerity and transparency.
            </p>
            <p>
              <strong className="text-foreground">Ask About Their Traditions:</strong> Show genuine interest in their family culture and values. Understanding their background helps you prepare for marriage.
            </p>
            <p>
              <strong className="text-foreground">Address Concerns Openly:</strong> If the family has questions or concerns, address them respectfully and honestly. This builds confidence in your character.
            </p>
            <p>
              <strong className="text-foreground">Include Your Own Family:</strong> Arrange video calls between both families. When families connect, it strengthens the foundation for marriage.
            </p>
          </CardContent>
        </Card>

        <Card data-testid="card-new-family">
          <CardHeader>
            <Home className="w-8 h-8 mb-2 text-primary" />
            <CardTitle data-testid="title-new-family">Starting Your New Family</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-relaxed text-muted-foreground">
            <p>
              <strong className="text-foreground">Establish Independence Together:</strong> Create your own home and routines while maintaining strong ties with both families. Balance is key to a healthy marriage.
            </p>
            <p>
              <strong className="text-foreground">Set Clear Expectations:</strong> Discuss roles, responsibilities, and boundaries early. Clear communication prevents misunderstandings later.
            </p>
            <p>
              <strong className="text-foreground">Build on Islamic Foundation:</strong> Make prayer, Quran reading, and Islamic learning central to your home. A strong faith foundation sustains your marriage through challenges.
            </p>
            <p>
              <strong className="text-foreground">Communicate Continuously:</strong> Create safe space for open dialogue about feelings, concerns, and dreams. Regular communication strengthens your bond.
            </p>
            <p>
              <strong className="text-foreground">Seek Guidance When Needed:</strong> Don't hesitate to consult Islamic scholars, experienced couples, or family when facing challenges. Asking for help is a sign of wisdom.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-primary/5 border-primary/20" data-testid="card-important-reminder">
        <CardContent className="p-8 text-center">
          <Shield className="w-12 h-12 mx-auto mb-4 text-primary" />
          <h3 className="text-2xl font-bold mb-3" data-testid="heading-important-reminder">Important Reminder</h3>
          <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto" data-testid="text-important-reminder">
            TalkAStranger is a platform for halal connections. Always maintain Islamic etiquette, involve your family, 
            keep conversations purposeful, and seek Allah's guidance through Istikhara prayer. May Allah bless you with 
            a righteous spouse and a blessed marriage.
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
