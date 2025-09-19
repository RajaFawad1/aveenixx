import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import ReferralSystem from "@/components/ReferralSystem";
import AchievementSystem from "@/components/AchievementSystem";
import { 
  DollarSign, 
  Trophy, 
  Star, 
  Users, 
  Target, 
  Gift,
  TrendingUp,
  Award,
  Crown,
  Zap,
  Heart,
  MessageSquare,
  ThumbsUp,
  Eye,
  Share2,
  Coins,
  Gem,
  UserPlus
} from "lucide-react";

export default function CommunityRewards() {
  const [userStats, setUserStats] = useState({
    totalEarnings: 247.50,
    availableCredits: 89,
    currentLevel: "rising",
    questionsAsked: 23,
    solutionsProvided: 12,
    helpfulVotes: 156,
    referrals: 8,
    moderationPoints: 45
  });

  const earningOpportunities = [
    {
      category: "Question Askers Earn",
      icon: MessageSquare,
      color: "bg-blue-50 border-blue-200",
      opportunities: [
        { 
          title: "Quality Question Bonus", 
          reward: "$2-10", 
          description: "Earn credits for asking detailed, helpful questions that generate community engagement",
          requirement: "Include clear context, what you've tried, and specific needs"
        },
        { 
          title: "Trending Question Royalties", 
          reward: "5% ongoing", 
          description: "When your question generates monetized solutions, earn ongoing royalties",
          requirement: "Question must receive 100+ views and 5+ quality solutions"
        },
        { 
          title: "Community Builder Referrals", 
          reward: "$5-25", 
          description: "Earn commission when friends you invite become active creators or buyers",
          requirement: "Referred user must be active for 30+ days"
        }
      ]
    },
    {
      category: "Community Reviewers Earn",
      icon: ThumbsUp,
      color: "bg-green-50 border-green-200",
      opportunities: [
        { 
          title: "Solution Review Rewards", 
          reward: "$0.50-2", 
          description: "Get paid for rating and writing helpful reviews on community solutions",
          requirement: "Detailed reviews with photos/results earn higher rewards"
        },
        { 
          title: "Trending Prediction Bonus", 
          reward: "$10-50", 
          description: "Early upvoting solutions that become trending earns prediction bonuses",
          requirement: "Vote within first 48 hours, solution reaches top 10"
        },
        { 
          title: "Quality Control Champion", 
          reward: "$3-8", 
          description: "Help maintain community standards by reporting and moderating content",
          requirement: "Consistent accurate reporting with 90%+ approval rate"
        }
      ]
    },
    {
      category: "Community Ambassadors",
      icon: Crown,
      color: "bg-purple-50 border-purple-200",
      opportunities: [
        { 
          title: "Regional Ambassador Income", 
          reward: "$100-500/mo", 
          description: "Part-time income for growing and managing local community chapters",
          requirement: "Apply for ambassador role, manage 50+ local members"
        },
        { 
          title: "Content Curation Specialist", 
          reward: "$50-200/mo", 
          description: "Organize trending solutions, create collections, and maintain categories",
          requirement: "Experience in content organization, 3+ hours weekly"
        },
        { 
          title: "Mentor Program Leader", 
          reward: "$25-100/session", 
          description: "Guide new creators through their first solutions and monetization setup",
          requirement: "Expert+ creator level, successful track record"
        }
      ]
    },
    {
      category: "Platform Growth Sharing",
      icon: TrendingUp,
      color: "bg-orange-50 border-orange-200",
      opportunities: [
        { 
          title: "Revenue Sharing Pool", 
          reward: "Share of 10%", 
          description: "Active community members share in platform advertising and partnership revenue",
          requirement: "Top 1000 contributors by community impact score"
        },
        { 
          title: "Growth Milestone Bonuses", 
          reward: "$50-500", 
          description: "All community members earn bonuses when platform hits user/revenue milestones",
          requirement: "Active account with positive community standing"
        },
        { 
          title: "Community Equity Program", 
          reward: "Platform shares", 
          description: "Long-term contributors earn equity-like rewards in platform growth",
          requirement: "2+ years active, significant community contribution"
        }
      ]
    }
  ];

  const gamificationRewards = [
    { level: "Rookie", points: "0-100", reward: "$5 welcome bonus", color: "bg-gray-100" },
    { level: "Helper", points: "100-500", reward: "5% marketplace discount", color: "bg-blue-100" },
    { level: "Contributor", points: "500-1500", reward: "$25 monthly credit", color: "bg-green-100" },
    { level: "Expert", points: "1500-5000", reward: "Premium features unlocked", color: "bg-purple-100" },
    { level: "Champion", points: "5000+", reward: "Revenue sharing eligibility", color: "bg-yellow-100" }
  ];

  const currentChallenges = [
    {
      title: "January Beauty Solutions Challenge",
      description: "Share your best skincare routines and win cash prizes",
      prize: "$1,000 total prizes",
      deadline: "31 days left",
      participants: 234
    },
    {
      title: "Budget Cooking Champions",
      description: "Create delicious meals under $10 per serving",
      prize: "$500 + cookbook deal",
      deadline: "15 days left", 
      participants: 89
    },
    {
      title: "Tech Problem Solvers",
      description: "Help solve the most challenging tech questions",
      prize: "$750 + tech gear",
      deadline: "22 days left",
      participants: 156
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Community Rewards Hub</h1>
          <p className="text-xl text-blue-100">Where Everyone Earns - Questions, Answers, Reviews, and More!</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="opportunities" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="opportunities">Earning Opportunities</TabsTrigger>
            <TabsTrigger value="challenges">Active Challenges</TabsTrigger>
            <TabsTrigger value="referrals">Referral System</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="levels">Reward Levels</TabsTrigger>
            <TabsTrigger value="dashboard">My Earnings</TabsTrigger>
          </TabsList>

          {/* Earning Opportunities Tab */}
          <TabsContent value="opportunities">
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  360° Community Economy - Everyone Earns
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Whether you ask questions, provide answers, review solutions, or build community - there's a way to earn
                </p>
              </div>

              {earningOpportunities.map((category, categoryIndex) => (
                <Card key={categoryIndex} className={`${category.color} border-2`}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                        <category.icon className="h-5 w-5 text-gray-700" />
                      </div>
                      {category.category}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-1 gap-4">
                      {category.opportunities.map((opp, oppIndex) => (
                        <div key={oppIndex} className="bg-white rounded-lg p-4 shadow-sm border">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-gray-900">{opp.title}</h3>
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              {opp.reward}
                            </Badge>
                          </div>
                          <p className="text-gray-600 text-sm mb-3">{opp.description}</p>
                          <div className="text-xs text-gray-500 bg-gray-50 rounded p-2">
                            <strong>Requirement:</strong> {opp.requirement}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Active Challenges Tab */}
          <TabsContent value="challenges">
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Monthly Community Challenges
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Compete with other community members for cash prizes and recognition
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                {currentChallenges.map((challenge, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{challenge.title}</CardTitle>
                          <CardDescription className="mt-1">{challenge.description}</CardDescription>
                        </div>
                        <Trophy className="h-6 w-6 text-yellow-500" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Prize Pool:</span>
                          <span className="font-semibold text-green-600">{challenge.prize}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Deadline:</span>
                          <span className="font-semibold text-orange-600">{challenge.deadline}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Participants:</span>
                          <span className="font-semibold">{challenge.participants} creators</span>
                        </div>
                        <Button className="w-full">Join Challenge</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements">
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Community Achievements & Badges
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Unlock achievements and earn rewards for your community contributions
                </p>
              </div>
              
              <AchievementSystem />
            </div>
          </TabsContent>

          {/* Reward Levels Tab */}
          <TabsContent value="levels">
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Community Reward Levels
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Earn points through community activity and unlock increasing rewards
                </p>
              </div>

              <div className="space-y-4">
                {gamificationRewards.map((level, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 ${level.color} rounded-full flex items-center justify-center`}>
                            {index === 0 && <Star className="h-6 w-6 text-gray-600" />}
                            {index === 1 && <Heart className="h-6 w-6 text-blue-600" />}
                            {index === 2 && <Zap className="h-6 w-6 text-green-600" />}
                            {index === 3 && <Award className="h-6 w-6 text-purple-600" />}
                            {index === 4 && <Crown className="h-6 w-6 text-yellow-600" />}
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{level.level}</h3>
                            <p className="text-gray-600">{level.points} points</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-green-600">{level.reward}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Referral System Tab */}
          <TabsContent value="referrals">
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Referral Program - Earn $25 Per Active Referral
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Share AVEENIX with friends and earn ongoing commissions from their community activity
                </p>
              </div>
              
              <ReferralSystem userId="usr_123456" userDisplayName="Alex Johnson" />
            </div>
          </TabsContent>

          {/* My Earnings Dashboard Tab */}
          <TabsContent value="dashboard">
            <div className="space-y-6">
              <div className="grid lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <DollarSign className="h-5 w-5 text-green-600" />
                      Total Earnings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      ${userStats.totalEarnings}
                    </div>
                    <p className="text-sm text-gray-600">This month: +$89.50</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Coins className="h-5 w-5 text-blue-600" />
                      Available Credits
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {userStats.availableCredits}
                    </div>
                    <p className="text-sm text-gray-600">≈ ${(userStats.availableCredits * 0.5).toFixed(2)} value</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Trophy className="h-5 w-5 text-purple-600" />
                      Community Level
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-purple-600 mb-2 capitalize">
                      {userStats.currentLevel}
                    </div>
                    <Progress value={65} className="h-2" />
                    <p className="text-sm text-gray-600 mt-2">650/1000 to Expert</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Earning Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Question Rewards</span>
                      <span className="font-semibold">$67.50</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Review Bonuses</span>
                      <span className="font-semibold">$89.25</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Referral Commissions</span>
                      <span className="font-semibold">$45.00</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Challenge Prizes</span>
                      <span className="font-semibold">$45.75</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Community Activity</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Questions Asked</span>
                      <Badge variant="secondary">{userStats.questionsAsked}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Solutions Provided</span>
                      <Badge variant="secondary">{userStats.solutionsProvided}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Helpful Votes Given</span>
                      <Badge variant="secondary">{userStats.helpfulVotes}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Successful Referrals</span>
                      <Badge variant="secondary">{userStats.referrals}</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}