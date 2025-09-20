import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
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
  UserPlus,
  CheckCircle,
  Circle,
  Clock,
  RefreshCw
} from "lucide-react";

interface Task {
  id: string;
  name: string;
  description: string;
  reward: string;
  pointsReward: number;
  cashReward: number;
  status: 'available' | 'in_progress' | 'completed';
  progress?: number;
  maxProgress?: number;
  category: string;
}

interface UserRewardStats {
  totalEarnings: number;
  availableCredits: number;
  currentLevel: string;
  questionsAsked: number;
  solutionsProvided: number;
  helpfulVotes: number;
  referrals: number;
  moderationPoints: number;
  completedTasks: number;
  availableBalance: number;
}

export default function CommunityRewards() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [userStats, setUserStats] = useState<UserRewardStats>({
    totalEarnings: 0,
    availableCredits: 0,
    currentLevel: "rookie",
    questionsAsked: 0,
    solutionsProvided: 0,
    helpfulVotes: 0,
    referrals: 0,
    moderationPoints: 0,
    completedTasks: 0,
    availableBalance: 0
  });

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 'complete_profile',
      name: 'Complete Your Profile',
      description: 'Add your name, bio, and profile picture to get started',
      reward: '$2.00',
      pointsReward: 100,
      cashReward: 200,
      status: 'available',
      progress: 0,
      maxProgress: 3,
      category: 'Getting Started'
    },
    {
      id: 'first_question',
      name: 'Ask Your First Question',
      description: 'Share a question with the community to get help',
      reward: '$3.00',
      pointsReward: 150,
      cashReward: 300,
      status: 'available',
      category: 'Community Engagement'
    },
    {
      id: 'first_review',
      name: 'Write Your First Review',
      description: 'Review a product or service to help other users',
      reward: '$1.50',
      pointsReward: 75,
      cashReward: 150,
      status: 'available',
      category: 'Content Creation'
    },
    {
      id: 'daily_login',
      name: 'Daily Login Streak',
      description: 'Login for 7 consecutive days',
      reward: '$5.00',
      pointsReward: 250,
      cashReward: 500,
      status: 'available',
      progress: 0,
      maxProgress: 7,
      category: 'Engagement'
    },
    {
      id: 'invite_friend',
      name: 'Invite a Friend',
      description: 'Invite a friend to join and earn when they become active',
      reward: '$10.00',
      pointsReward: 500,
      cashReward: 1000,
      status: 'available',
      category: 'Referrals'
    },
    {
      id: 'make_purchase',
      name: 'Make Your First Purchase',
      description: 'Buy something from our marketplace',
      reward: '$15.00',
      pointsReward: 750,
      cashReward: 1500,
      status: 'available',
      category: 'Shopping'
    },
    {
      id: 'weekly_active',
      name: 'Weekly Active User',
      description: 'Be active on the platform for 4 weeks',
      reward: '$25.00',
      pointsReward: 1250,
      cashReward: 2500,
      status: 'available',
      progress: 0,
      maxProgress: 4,
      category: 'Engagement'
    },
    {
      id: 'product_upload',
      name: 'Upload a Product',
      description: 'List your first product or service',
      reward: '$20.00',
      pointsReward: 1000,
      cashReward: 2000,
      status: 'available',
      category: 'Vendor'
    }
  ]);

  const [loading, setLoading] = useState(false);

  // Load user stats and task progress from backend
  const loadUserStats = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/rewards/dashboard/${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setUserStats({
          totalEarnings: data.totalEarnings || 0,
          availableCredits: data.totalCredits || 0,
          currentLevel: data.communityLevel || 'rookie',
          questionsAsked: data.questionsAsked || 0,
          solutionsProvided: data.solutionsProvided || 0,
          helpfulVotes: data.helpfulVotes || 0,
          referrals: data.referralStats?.totalReferrals || 0,
          moderationPoints: data.moderationPoints || 0,
          completedTasks: data.completedTasks || 0,
          availableBalance: data.availableBalance || 0
        });

        // Update tasks with user progress
        if (data.userTasks) {
          setTasks(prevTasks => 
            prevTasks.map(task => {
              const userTask = data.userTasks.find((ut: any) => ut.taskId === task.id);
              if (userTask) {
                return {
                  ...task,
                  status: userTask.status,
                  progress: userTask.progress || 0
                };
              }
              return task;
            })
          );
        }
      }
    } catch (error) {
      console.error('Error loading user stats:', error);
    } finally {
      setLoading(false);
    }
  };

  // Complete a task and award rewards
  const completeTask = async (taskId: string) => {
    if (!user?.id) {
      toast({
        title: "Authentication Required",
        description: "Please log in to complete tasks",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);

      // Award points for community activity
      const response = await fetch('/api/rewards/award-points', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          activityType: 'task_completed',
          targetId: taskId,
          points: tasks.find(t => t.id === taskId)?.pointsReward || 0,
          metadata: { taskId }
        })
      });

      if (response.ok) {
        // Update task status
        setTasks(prevTasks => 
          prevTasks.map(task => 
            task.id === taskId 
              ? { ...task, status: 'completed' as const }
              : task
          )
        );

        // Add reward to community rewards
        const rewardResponse = await fetch('/api/community/rewards', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: user.id,
            rewardType: 'task_completion',
            amount: (tasks.find(t => t.id === taskId)?.cashReward || 0) / 100,
            credits: tasks.find(t => t.id === taskId)?.pointsReward || 0,
            sourceId: taskId,
            description: `Completed task: ${tasks.find(t => t.id === taskId)?.name}`,
            status: 'approved'
          })
        });

        if (rewardResponse.ok) {
          toast({
            title: "Task Completed! 🎉",
            description: `You earned ${tasks.find(t => t.id === taskId)?.reward} and ${tasks.find(t => t.id === taskId)?.pointsReward} points!`,
          });

          // Reload user stats
          loadUserStats();
        }
      } else {
        throw new Error('Failed to complete task');
      }
    } catch (error) {
      console.error('Error completing task:', error);
      toast({
        title: "Error",
        description: "Failed to complete task. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Start a task
  const startTask = async (taskId: string) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId 
          ? { ...task, status: 'in_progress' as const }
          : task
      )
    );

    toast({
      title: "Task Started",
      description: "Good luck! Complete the requirements to earn your reward.",
    });
  };

  // Load user data on mount
  useEffect(() => {
    loadUserStats();
  }, [user?.id]);

  const getTaskIcon = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'in_progress':
        return <Clock className="h-5 w-5 text-blue-600" />;
      default:
        return <Circle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getTasksByCategory = () => {
    const categories = tasks.reduce((acc, task) => {
      if (!acc[task.category]) {
        acc[task.category] = [];
      }
      acc[task.category].push(task);
      return acc;
    }, {} as Record<string, Task[]>);

    return categories;
  };

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
        <Tabs defaultValue="tasks" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="tasks">Available Tasks</TabsTrigger>
            <TabsTrigger value="opportunities">Earning Opportunities</TabsTrigger>
            <TabsTrigger value="challenges">Active Challenges</TabsTrigger>
            <TabsTrigger value="referrals">Referral System</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="dashboard">My Earnings</TabsTrigger>
          </TabsList>

          {/* Tasks Tab */}
          <TabsContent value="tasks">
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Complete Tasks & Earn Rewards
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Complete simple tasks to earn points and cash rewards instantly
                </p>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
                  <span className="ml-2 text-gray-600">Loading tasks...</span>
                </div>
              ) : (
                <div className="space-y-6">
                  {Object.entries(getTasksByCategory()).map(([category, categoryTasks]) => (
                    <Card key={category} className="border-2">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                          <Target className="h-5 w-5 text-blue-600" />
                          {category}
                        </CardTitle>
                        <CardDescription>
                          {categoryTasks.filter(t => t.status === 'completed').length} of {categoryTasks.length} completed
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {categoryTasks.map((task) => (
                            <div key={task.id} className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                              <div className="flex items-start justify-between">
                                <div className="flex items-start gap-3 flex-1">
                                  {getTaskIcon(task.status)}
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <h3 className="font-semibold text-gray-900 dark:text-white">
                                        {task.name}
                                      </h3>
                                      <Badge 
                                        variant={
                                          task.status === 'completed' ? 'default' :
                                          task.status === 'in_progress' ? 'secondary' : 'outline'
                                        }
                                        className={
                                          task.status === 'completed' ? 'bg-green-100 text-green-800 border-green-200' :
                                          task.status === 'in_progress' ? 'bg-blue-100 text-blue-800 border-blue-200' : ''
                                        }
                                      >
                                        {task.status === 'completed' ? 'Completed' :
                                         task.status === 'in_progress' ? 'In Progress' : 'Available'}
                                      </Badge>
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                                      {task.description}
                                    </p>
                                    {task.progress !== undefined && task.maxProgress && (
                                      <div className="mb-2">
                                        <div className="flex items-center justify-between mb-1">
                                          <span className="text-xs text-gray-500">Progress</span>
                                          <span className="text-xs text-gray-500">{task.progress}/{task.maxProgress}</span>
                                        </div>
                                        <Progress 
                                          value={task.maxProgress > 0 ? (task.progress / task.maxProgress) * 100 : 0} 
                                          className="h-2" 
                                        />
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="text-right space-y-2">
                                  <div className="flex flex-col items-end gap-1">
                                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                                      {task.reward}
                                    </Badge>
                                    <span className="text-xs text-gray-500">{task.pointsReward} points</span>
                                  </div>
                                  {task.status === 'available' && (
                                    <Button 
                                      size="sm" 
                                      onClick={() => startTask(task.id)}
                                      disabled={loading}
                                    >
                                      Start Task
                                    </Button>
                                  )}
                                  {task.status === 'in_progress' && (
                                    <Button 
                                      size="sm" 
                                      onClick={() => completeTask(task.id)}
                                      disabled={loading}
                                      className="bg-blue-600 hover:bg-blue-700"
                                    >
                                      Complete
                                    </Button>
                                  )}
                                  {task.status === 'completed' && (
                                    <div className="flex items-center gap-1 text-green-600">
                                      <CheckCircle className="h-4 w-4" />
                                      <span className="text-sm font-medium">Done!</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

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
              <div className="grid lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <DollarSign className="h-5 w-5 text-green-600" />
                      Total Earnings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      ${userStats.totalEarnings.toFixed(2)}
                    </div>
                    <p className="text-sm text-gray-600">Available: ${userStats.availableBalance.toFixed(2)}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Coins className="h-5 w-5 text-blue-600" />
                      Credits & Points
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {userStats.availableCredits}
                    </div>
                    <p className="text-sm text-gray-600">Total points earned</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Target className="h-5 w-5 text-orange-600" />
                      Tasks Completed
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-orange-600 mb-2">
                      {tasks.filter(t => t.status === 'completed').length}
                    </div>
                    <p className="text-sm text-gray-600">of {tasks.length} available tasks</p>
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
                    <Progress value={Math.min((userStats.availableCredits / 1000) * 100, 100)} className="h-2" />
                    <p className="text-sm text-gray-600 mt-2">{userStats.availableCredits}/1000 to next level</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Task Progress</CardTitle>
                    <CardDescription>Your completed and ongoing tasks</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {Object.entries(getTasksByCategory()).map(([category, categoryTasks]) => {
                      const completed = categoryTasks.filter(t => t.status === 'completed').length;
                      const total = categoryTasks.length;
                      const progress = total > 0 ? (completed / total) * 100 : 0;
                      
                      return (
                        <div key={category} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600 text-sm">{category}</span>
                            <span className="font-semibold text-sm">{completed}/{total}</span>
                          </div>
                          <Progress value={progress} className="h-2" />
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Community Activity</CardTitle>
                    <CardDescription>Your engagement statistics</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Tasks Completed</span>
                      <Badge variant="secondary">{tasks.filter(t => t.status === 'completed').length}</Badge>
                    </div>
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

              {/* Recent Task Completions */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Task Completions</CardTitle>
                  <CardDescription>Your latest completed tasks and rewards</CardDescription>
                </CardHeader>
                <CardContent>
                  {tasks.filter(t => t.status === 'completed').length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No completed tasks yet</p>
                      <p className="text-sm">Start completing tasks to see your progress here</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {tasks.filter(t => t.status === 'completed').map((task) => (
                        <div
                          key={task.id}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            <div>
                              <div className="font-medium">{task.name}</div>
                              <div className="text-sm text-muted-foreground">{task.category}</div>
                            </div>
                          </div>
                          <div className="text-right space-y-1">
                            <div className="font-medium text-green-600">{task.reward}</div>
                            <div className="text-sm text-muted-foreground">{task.pointsReward} points</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}