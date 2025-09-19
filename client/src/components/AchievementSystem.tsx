import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Trophy, 
  Star, 
  Award, 
  Crown, 
  Target,
  Zap,
  Heart,
  Users,
  MessageSquare,
  ThumbsUp,
  TrendingUp,
  Gift,
  CheckCircle,
  Lock
} from "lucide-react";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: any;
  category: 'community' | 'creator' | 'earnings' | 'special';
  difficulty: 'bronze' | 'silver' | 'gold' | 'platinum';
  progress: number;
  maxProgress: number;
  reward: {
    credits: number;
    cash: number;
    perks: string[];
  };
  unlocked: boolean;
  completedAt?: string;
}

export default function AchievementSystem() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'community' | 'creator' | 'earnings' | 'special'>('all');

  const achievements: Achievement[] = [
    // Community Achievements
    {
      id: 'first_question',
      title: 'First Question',
      description: 'Ask your first question in the community',
      icon: MessageSquare,
      category: 'community',
      difficulty: 'bronze',
      progress: 1,
      maxProgress: 1,
      reward: { credits: 10, cash: 5, perks: ['Welcome bonus'] },
      unlocked: true,
      completedAt: '2025-01-15'
    },
    {
      id: 'helpful_voter',
      title: 'Helpful Voter',
      description: 'Cast 50 helpful votes on community solutions',
      icon: ThumbsUp,
      category: 'community',
      difficulty: 'silver',
      progress: 34,
      maxProgress: 50,
      reward: { credits: 25, cash: 10, perks: ['Voter badge', 'Priority support'] },
      unlocked: false
    },
    {
      id: 'community_champion',
      title: 'Community Champion',
      description: 'Help 100 people with solutions and reviews',
      icon: Crown,
      category: 'community',
      difficulty: 'gold',
      progress: 67,
      maxProgress: 100,
      reward: { credits: 100, cash: 50, perks: ['Champion badge', 'Revenue sharing eligibility', 'Ambassador consideration'] },
      unlocked: false
    },
    {
      id: 'trending_predictor',
      title: 'Trending Predictor',
      description: 'Predict 10 solutions that become trending within 48 hours',
      icon: TrendingUp,
      category: 'community',
      difficulty: 'platinum',
      progress: 3,
      maxProgress: 10,
      reward: { credits: 200, cash: 100, perks: ['Oracle badge', 'Early access to features', 'Premium analytics'] },
      unlocked: false
    },
    
    // Creator Achievements
    {
      id: 'first_solution',
      title: 'First Solution',
      description: 'Provide your first solution to help someone',
      icon: Star,
      category: 'creator',
      difficulty: 'bronze',
      progress: 1,
      maxProgress: 1,
      reward: { credits: 15, cash: 10, perks: ['Creator badge'] },
      unlocked: true,
      completedAt: '2025-01-16'
    },
    {
      id: 'solution_master',
      title: 'Solution Master',
      description: 'Create 25 highly-rated solutions',
      icon: Award,
      category: 'creator',
      difficulty: 'gold',
      progress: 12,
      maxProgress: 25,
      reward: { credits: 75, cash: 40, perks: ['Master badge', 'Featured creator status', 'Higher commission rates'] },
      unlocked: false
    },
    {
      id: 'viral_creator',
      title: 'Viral Creator',
      description: 'Get 10,000 total views across all your solutions',
      icon: Zap,
      category: 'creator',
      difficulty: 'platinum',
      progress: 4567,
      maxProgress: 10000,
      reward: { credits: 300, cash: 150, perks: ['Viral badge', 'Promotion boost', 'Brand partnership opportunities'] },
      unlocked: false
    },
    
    // Earnings Achievements
    {
      id: 'first_dollar',
      title: 'First Dollar',
      description: 'Earn your first dollar from community activity',
      icon: Gift,
      category: 'earnings',
      difficulty: 'bronze',
      progress: 1,
      maxProgress: 1,
      reward: { credits: 20, cash: 5, perks: ['Earner badge', 'Payment method setup'] },
      unlocked: true,
      completedAt: '2025-01-17'
    },
    {
      id: 'hundred_club',
      title: '$100 Club',
      description: 'Earn $100 total from all community activities',
      icon: Trophy,
      category: 'earnings',
      difficulty: 'silver',
      progress: 67.50,
      maxProgress: 100,
      reward: { credits: 50, cash: 25, perks: ['VIP badge', 'Higher earning multipliers'] },
      unlocked: false
    },
    {
      id: 'thousand_earner',
      title: 'Thousand Dollar Earner',
      description: 'Reach $1,000 in total earnings',
      icon: Crown,
      category: 'earnings',
      difficulty: 'platinum',
      progress: 247.50,
      maxProgress: 1000,
      reward: { credits: 500, cash: 200, perks: ['Elite badge', 'Revenue sharing boost', 'Personal account manager'] },
      unlocked: false
    },
    
    // Special Achievements
    {
      id: 'referral_champion',
      title: 'Referral Champion',
      description: 'Successfully refer 20 active community members',
      icon: Users,
      category: 'special',
      difficulty: 'gold',
      progress: 8,
      maxProgress: 20,
      reward: { credits: 150, cash: 100, perks: ['Ambassador badge', 'Referral bonus multiplier', 'Community leadership role'] },
      unlocked: false
    },
    {
      id: 'early_adopter',
      title: 'Early Adopter',
      description: 'Join AVEENIX in the first 1000 community members',
      icon: Heart,
      category: 'special',
      difficulty: 'platinum',
      progress: 1,
      maxProgress: 1,
      reward: { credits: 250, cash: 0, perks: ['Founder badge', 'Lifetime premium features', 'Community equity consideration'] },
      unlocked: true,
      completedAt: '2025-01-10'
    }
  ];

  const categories = [
    { id: 'all' as const, label: 'All Achievements', count: achievements.length },
    { id: 'community' as const, label: 'Community', count: achievements.filter(a => a.category === 'community').length },
    { id: 'creator' as const, label: 'Creator', count: achievements.filter(a => a.category === 'creator').length },
    { id: 'earnings' as const, label: 'Earnings', count: achievements.filter(a => a.category === 'earnings').length },
    { id: 'special' as const, label: 'Special', count: achievements.filter(a => a.category === 'special').length }
  ];

  const filteredAchievements = selectedCategory === 'all' 
    ? achievements 
    : achievements.filter(a => a.category === selectedCategory);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'bronze': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'silver': return 'text-gray-600 bg-gray-50 border-gray-200';
      case 'gold': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'platinum': return 'text-purple-600 bg-purple-50 border-purple-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTotalRewards = () => {
    const unlockedAchievements = achievements.filter(a => a.unlocked);
    const totalCredits = unlockedAchievements.reduce((sum, a) => sum + a.reward.credits, 0);
    const totalCash = unlockedAchievements.reduce((sum, a) => sum + a.reward.cash, 0);
    return { totalCredits, totalCash, count: unlockedAchievements.length };
  };

  const rewards = getTotalRewards();

  return (
    <div className="space-y-6">
      {/* Achievement Overview */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Achievements Unlocked</p>
                <p className="text-3xl font-bold text-green-600">{rewards.count}</p>
                <p className="text-sm text-gray-500">of {achievements.length} total</p>
              </div>
              <Trophy className="h-10 w-10 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Credits Earned</p>
                <p className="text-3xl font-bold text-blue-600">{rewards.totalCredits}</p>
                <p className="text-sm text-gray-500">from achievements</p>
              </div>
              <Star className="h-10 w-10 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Cash Rewards</p>
                <p className="text-3xl font-bold text-green-600">${rewards.totalCash}</p>
                <p className="text-sm text-gray-500">achievement bonuses</p>
              </div>
              <Gift className="h-10 w-10 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Achievement Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className="flex items-center gap-2"
              >
                {category.label} ({category.count})
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Achievement Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {filteredAchievements.map((achievement) => (
          <Card key={achievement.id} className={`transition-all hover:shadow-lg ${achievement.unlocked ? 'ring-2 ring-green-200' : ''}`}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${achievement.unlocked ? 'bg-green-100' : 'bg-gray-100'}`}>
                    {achievement.unlocked ? (
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    ) : (
                      <Lock className="h-6 w-6 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <achievement.icon className="h-5 w-5" />
                      {achievement.title}
                    </CardTitle>
                    <CardDescription>{achievement.description}</CardDescription>
                  </div>
                </div>
                <Badge className={getDifficultyColor(achievement.difficulty)}>
                  {achievement.difficulty}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Progress */}
                {!achievement.unlocked && (
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progress</span>
                      <span>{Math.floor((achievement.progress / achievement.maxProgress) * 100)}%</span>
                    </div>
                    <Progress value={(achievement.progress / achievement.maxProgress) * 100} />
                    <p className="text-xs text-gray-500 mt-1">
                      {achievement.progress} / {achievement.maxProgress}
                    </p>
                  </div>
                )}

                {/* Completion Date */}
                {achievement.unlocked && achievement.completedAt && (
                  <div className="text-sm text-green-600 font-medium">
                    ✓ Completed on {new Date(achievement.completedAt).toLocaleDateString()}
                  </div>
                )}

                {/* Rewards */}
                <div className="border-t pt-3">
                  <h4 className="font-medium text-sm mb-2">Rewards:</h4>
                  <div className="flex items-center gap-4 text-sm">
                    {achievement.reward.credits > 0 && (
                      <span className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-blue-500" />
                        {achievement.reward.credits} credits
                      </span>
                    )}
                    {achievement.reward.cash > 0 && (
                      <span className="flex items-center gap-1">
                        <Gift className="h-4 w-4 text-green-500" />
                        ${achievement.reward.cash}
                      </span>
                    )}
                  </div>
                  {achievement.reward.perks.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs text-gray-600 mb-1">Special Perks:</p>
                      <div className="flex flex-wrap gap-1">
                        {achievement.reward.perks.map((perk, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {perk}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Achievement Tips */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
        <CardHeader>
          <CardTitle>Achievement Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Quick Wins:</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Target className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
                  Ask detailed questions with context for instant credit rewards
                </li>
                <li className="flex items-start gap-2">
                  <Target className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
                  Write helpful reviews with photos to earn reviewer badges
                </li>
                <li className="flex items-start gap-2">
                  <Target className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
                  Vote early on quality solutions to predict trending content
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Long-term Goals:</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Crown className="h-4 w-4 text-purple-600 mt-0.5 shrink-0" />
                  Build consistent community engagement for champion status
                </li>
                <li className="flex items-start gap-2">
                  <Crown className="h-4 w-4 text-purple-600 mt-0.5 shrink-0" />
                  Create high-quality solutions to unlock creator achievements
                </li>
                <li className="flex items-start gap-2">
                  <Crown className="h-4 w-4 text-purple-600 mt-0.5 shrink-0" />
                  Refer friends for referral champion status and bonuses
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}