import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Copy, 
  Share2, 
  Users, 
  DollarSign, 
  TrendingUp,
  Gift,
  Link,
  Twitter,
  MessageCircle,
  Mail,
  CheckCircle
} from "lucide-react";

interface ReferralSystemProps {
  userId: string;
  userDisplayName: string;
}

export default function ReferralSystem({ userId, userDisplayName }: ReferralSystemProps) {
  const [referralCode, setReferralCode] = useState(`AVEENIX_${userId.slice(-6).toUpperCase()}`);
  const [copiedLink, setCopiedLink] = useState(false);
  const { toast } = useToast();

  const referralLink = `https://aveenix.com/join?ref=${referralCode}`;
  const shortLink = `aveenix.com/r/${referralCode.slice(-6)}`;

  const referralStats = {
    totalReferrals: 8,
    activeReferrals: 6,
    pendingEarnings: 125.00,
    totalEarnings: 247.50,
    conversionRate: 75
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
    toast({
      title: "Copied!",
      description: `${type} copied to clipboard`,
    });
  };

  const shareOptions = [
    {
      name: "Twitter",
      icon: Twitter,
      color: "text-blue-400",
      message: `💡 Join me on AVEENIX - the community where everyone earns! Get real solutions from real people, plus earn money for questions, reviews, and referrals! ${referralLink} #AVEENIX #CommunityEarnings`
    },
    {
      name: "WhatsApp",
      icon: MessageCircle,
      color: "text-green-500",
      message: `Hey! 👋 I found this amazing platform called AVEENIX where people help each other solve problems AND everyone earns money! You get paid for asking questions, writing reviews, and helping others. Join using my link: ${referralLink}`
    },
    {
      name: "Email",
      icon: Mail,
      color: "text-gray-600",
      message: `Subject: Join AVEENIX - The Community Where Everyone Earns!\n\nHi!\n\nI wanted to share something exciting with you - AVEENIX, a unique community platform where everyone actually earns money!\n\nHere's how it works:\n• Ask questions and get rewarded with cash\n• Help others by reviewing solutions and earn money\n• Refer friends and earn ongoing commissions\n• Create solutions and monetize through multiple channels\n\nIt's a true 360° win-win economy where problem-askers, solution-providers, reviewers, and even moderators all earn real money.\n\nJoin using my referral link: ${referralLink}\n\nYou'll get a welcome bonus, and I'll earn a referral commission when you become active - it's a win-win!\n\nBest regards,\n${userDisplayName}`
    }
  ];

  const recentReferrals = [
    { name: "Sarah M.", status: "active", earnings: 25.00, joinedDate: "2025-01-15" },
    { name: "Mike R.", status: "active", earnings: 25.00, joinedDate: "2025-01-12" },
    { name: "Lisa K.", status: "pending", earnings: 0, joinedDate: "2025-01-18" },
    { name: "Tom J.", status: "active", earnings: 25.00, joinedDate: "2025-01-08" },
    { name: "Emma L.", status: "active", earnings: 25.00, joinedDate: "2025-01-05" }
  ];

  const handleShare = (option: typeof shareOptions[0]) => {
    if (option.name === "Twitter") {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(option.message)}`, '_blank');
    } else if (option.name === "WhatsApp") {
      window.open(`https://wa.me/?text=${encodeURIComponent(option.message)}`, '_blank');
    } else if (option.name === "Email") {
      window.location.href = `mailto:?body=${encodeURIComponent(option.message)}`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Referral Stats Overview */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Referrals</p>
                <p className="text-2xl font-bold">{referralStats.totalReferrals}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Referrals</p>
                <p className="text-2xl font-bold text-green-600">{referralStats.activeReferrals}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Earnings</p>
                <p className="text-2xl font-bold text-orange-600">${referralStats.pendingEarnings}</p>
              </div>
              <Gift className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Earned</p>
                <p className="text-2xl font-bold text-green-600">${referralStats.totalEarnings}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Referral Link Generator */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link className="h-5 w-5" />
            Your Referral Link
          </CardTitle>
          <CardDescription>
            Share your unique link and earn $25 for each friend who joins and becomes active!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Full Referral Link</label>
              <div className="flex gap-2">
                <Input 
                  value={referralLink}
                  readOnly
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  onClick={() => copyToClipboard(referralLink, "Referral link")}
                  className="px-3"
                >
                  {copiedLink ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Short Link</label>
              <div className="flex gap-2">
                <Input 
                  value={shortLink}
                  readOnly
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  onClick={() => copyToClipboard(shortLink, "Short link")}
                  className="px-3"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Custom Referral Code</label>
            <div className="flex gap-2">
              <Input 
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                placeholder="CUSTOM_CODE"
                className="flex-1"
              />
              <Button variant="outline">Update</Button>
            </div>
            <p className="text-xs text-gray-500 mt-1">Customize your referral code (letters, numbers, and underscores only)</p>
          </div>
        </CardContent>
      </Card>

      {/* Share Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Share Your Referral Link
          </CardTitle>
          <CardDescription>
            Use these pre-written messages to share AVEENIX with your network
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {shareOptions.map((option, index) => (
              <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleShare(option)}>
                <CardContent className="p-4 text-center">
                  <option.icon className={`h-8 w-8 mx-auto mb-2 ${option.color}`} />
                  <h3 className="font-medium">{option.name}</h3>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                    {option.message.slice(0, 100)}...
                  </p>
                  <Button variant="outline" size="sm" className="mt-3">
                    Share Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Referrals */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Referrals</CardTitle>
          <CardDescription>Your latest referrals and their status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentReferrals.map((referral, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {referral.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium">{referral.name}</p>
                    <p className="text-sm text-gray-600">Joined {referral.joinedDate}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={referral.status === 'active' ? 'default' : 'secondary'}>
                    {referral.status}
                  </Badge>
                  <p className="text-sm font-semibold mt-1">
                    ${referral.earnings.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Referral Program Benefits */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
        <CardHeader>
          <CardTitle>Referral Program Benefits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">How It Works:</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                  Share your unique referral link with friends
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                  They join AVEENIX using your link
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                  When they become active (30+ days), you both earn rewards
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                  You earn ongoing commissions from their activities
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Earning Potential:</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between">
                  <span>Friend joins and stays active:</span>
                  <span className="font-semibold text-green-600">$25</span>
                </li>
                <li className="flex justify-between">
                  <span>Friend becomes creator:</span>
                  <span className="font-semibold text-green-600">$50 bonus</span>
                </li>
                <li className="flex justify-between">
                  <span>Friend earns from solutions:</span>
                  <span className="font-semibold text-green-600">5% commission</span>
                </li>
                <li className="flex justify-between">
                  <span>Friend refers others:</span>
                  <span className="font-semibold text-green-600">$10 each</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}