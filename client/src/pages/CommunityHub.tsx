import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  MessageCircle, 
  Users, 
  TrendingUp, 
  Search, 
  Plus, 
  Share2, 
  ThumbsUp, 
  Clock, 
  Tag,
  Eye,
  CheckCircle,
  Star,
  Filter,
  BarChart3,
  Brain,
  Target,
  Lightbulb
} from "lucide-react";

// Social media platform icons
const platformIcons = {
  twitter: "𝕏",
  linkedin: "💼",
  facebook: "📘",
  instagram: "📷",
  youtube: "📹",
  pinterest: "📌",
  tiktok: "🎵"
};

const categories = [
  "Technology", "Business", "Health", "Lifestyle", "Finance", 
  "Education", "Marketing", "Design", "Development", "General"
];

const complexityLevels = [
  { value: "simple", label: "Simple", color: "bg-green-100 text-green-800" },
  { value: "moderate", label: "Moderate", color: "bg-yellow-100 text-yellow-800" },
  { value: "complex", label: "Complex", color: "bg-orange-100 text-orange-800" },
  { value: "expert", label: "Expert", color: "bg-red-100 text-red-800" }
];

export default function CommunityHub() {
  const [activeTab, setActiveTab] = useState("ask");
  const [questionText, setQuestionText] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["twitter", "linkedin"]);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch community stats
  const { data: stats } = useQuery({
    queryKey: ["/api/community/stats"],
    refetchInterval: 30000,
  });

  // Fetch recent questions
  const { data: recentQuestionsData, isLoading: loadingQuestions } = useQuery({
    queryKey: ["/api/community/questions", { limit: 10, status: "recent" }],
  });

  // Fetch trending questions
  const { data: trendingQuestionsData } = useQuery({
    queryKey: ["/api/community/questions", { limit: 5, status: "trending" }],
  });

  // Extract questions arrays from API responses
  const recentQuestions = recentQuestionsData?.questions || [];
  const trendingQuestions = trendingQuestionsData?.questions || [];

  // Search knowledge base
  const { data: searchResultsData, isLoading: searchLoading } = useQuery({
    queryKey: ["/api/community/search", searchQuery],
    enabled: searchQuery.length > 2,
  });

  // Extract search results from API response
  const searchResults = searchResultsData?.results || [];

  // Submit question mutation
  const submitQuestionMutation = useMutation({
    mutationFn: async (questionData: {
      questionText: string;
      category: string;
      tags: string[];
      platforms: string[];
    }) => {
      return await apiRequest("POST", "/api/community/questions", questionData);
    },
    onSuccess: () => {
      toast({
        title: "Question submitted successfully!",
        description: "Your question is being distributed across selected social media platforms.",
      });
      setQuestionText("");
      setTags([]);
      setTagInput("");
      queryClient.invalidateQueries({ queryKey: ["/api/community"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error submitting question",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim()) && tags.length < 5) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const togglePlatform = (platform: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platform) 
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const handleSubmit = () => {
    if (!questionText.trim() || !category) {
      toast({
        title: "Missing information",
        description: "Please provide both question text and category.",
        variant: "destructive",
      });
      return;
    }

    submitQuestionMutation.mutate({
      questionText,
      category,
      tags,
      platforms: selectedPlatforms,
    });
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const getRetentionBadge = (retentionPeriod: number) => {
    const years = Math.round(retentionPeriod / 365 * 10) / 10;
    if (years >= 5) return <Badge variant="secondary" className="bg-purple-100 text-purple-800">Long-term ({years}y)</Badge>;
    if (years >= 2) return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Extended ({years}y)</Badge>;
    if (retentionPeriod >= 365) return <Badge variant="secondary" className="bg-green-100 text-green-800">Standard (1y)</Badge>;
    if (retentionPeriod >= 30) return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Short-term</Badge>;
    return <Badge variant="secondary" className="bg-gray-100 text-gray-800">Temporary</Badge>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            AVEENIX Community Hub
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Ask questions, get intelligent answers, and grow our community across 7 social media platforms
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Questions</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats?.totalQuestions?.toLocaleString() || "0"}
                  </p>
                </div>
                <MessageCircle className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Community Members</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats?.communityMembers?.toLocaleString() || "0"}
                  </p>
                </div>
                <Users className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Engagement</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats?.totalEngagement?.toLocaleString() || "0"}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Knowledge Base</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats?.knowledgeBaseEntries?.toLocaleString() || "0"}
                  </p>
                </div>
                <Brain className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="ask">Ask Question</TabsTrigger>
            <TabsTrigger value="browse">Browse Questions</TabsTrigger>
            <TabsTrigger value="search">Knowledge Search</TabsTrigger>
            <TabsTrigger value="trending">Trending</TabsTrigger>
          </TabsList>

          {/* Ask Question Tab */}
          <TabsContent value="ask">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Ask Your Question
                </CardTitle>
                <CardDescription>
                  Submit your question to be distributed across our community on 7 social media platforms
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Question Text */}
                <div>
                  <Label htmlFor="question">Your Question</Label>
                  <Textarea
                    id="question"
                    placeholder="What would you like to know? Be specific and clear..."
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    rows={4}
                    className="mt-2"
                  />
                  <p className="text-sm text-gray-500 mt-1">{questionText.length}/1000 characters</p>
                </div>

                {/* Category Selection */}
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat.toLowerCase()}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Tags */}
                <div>
                  <Label>Tags (Optional)</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      placeholder="Add tag..."
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addTag()}
                      className="flex-1"
                    />
                    <Button onClick={addTag} variant="outline" size="sm">
                      <Tag className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="cursor-pointer"
                        onClick={() => removeTag(tag)}
                      >
                        {tag} ×
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Platform Selection */}
                <div>
                  <Label>Select Platforms</Label>
                  <div className="grid grid-cols-4 md:grid-cols-7 gap-3 mt-2">
                    {Object.entries(platformIcons).map(([platform, icon]) => (
                      <Button
                        key={platform}
                        variant={selectedPlatforms.includes(platform) ? "default" : "outline"}
                        size="sm"
                        onClick={() => togglePlatform(platform)}
                        className="flex flex-col items-center gap-1 h-auto py-3"
                      >
                        <span className="text-lg">{icon}</span>
                        <span className="text-xs capitalize">{platform}</span>
                      </Button>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Selected: {selectedPlatforms.length} platform{selectedPlatforms.length !== 1 ? 's' : ''}
                  </p>
                </div>

                {/* Submit Button */}
                <Button 
                  onClick={handleSubmit} 
                  disabled={submitQuestionMutation.isPending || !questionText.trim() || !category}
                  className="w-full"
                  size="lg"
                >
                  {submitQuestionMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Share2 className="h-4 w-4 mr-2" />
                      Submit Question
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Browse Questions Tab */}
          <TabsContent value="browse">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Community Questions</CardTitle>
                  <CardDescription>
                    Browse questions from our community with intelligent classification
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingQuestions ? (
                    <div className="space-y-4">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="animate-pulse">
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                        </div>
                      ))}
                    </div>
                  ) : recentQuestions.length === 0 ? (
                    <div className="text-center py-12">
                      <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        No questions yet
                      </h3>
                      <p className="text-gray-500 mb-4">
                        Be the first to ask a question and start building our community knowledge base!
                      </p>
                      <Button onClick={() => setActiveTab("ask")}>
                        Ask First Question
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {recentQuestions?.map((question: any) => (
                        <Card key={question.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <p className="font-medium text-gray-900 dark:text-white mb-2">
                                  {question.questionText}
                                </p>
                                <div className="flex flex-wrap gap-2 mb-3">
                                  <Badge variant="outline">{question.category}</Badge>
                                  {complexityLevels.find(c => c.value === question.complexity) && (
                                    <Badge 
                                      variant="secondary" 
                                      className={complexityLevels.find(c => c.value === question.complexity)?.color}
                                    >
                                      {complexityLevels.find(c => c.value === question.complexity)?.label}
                                    </Badge>
                                  )}
                                  {getRetentionBadge(question.retentionPeriod)}
                                  {question.tags?.map((tag: string) => (
                                    <Badge key={tag} variant="outline" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                  <div className="flex items-center gap-1">
                                    <Eye className="h-4 w-4" />
                                    {question.totalViews || 0}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <MessageCircle className="h-4 w-4" />
                                    {question.totalResponses || 0}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <ThumbsUp className="h-4 w-4" />
                                    {question.totalEngagement || 0}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    {formatTimeAgo(question.createdAt)}
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-col items-center gap-2">
                                <div className="text-center">
                                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                    {question.problemSolvingScore}
                                  </div>
                                  <div className="text-xs text-gray-500">Problem Solving</div>
                                </div>
                                {question.isSolved && (
                                  <CheckCircle className="h-5 w-5 text-green-500" />
                                )}
                              </div>
                            </div>
                            
                            {/* Platform Distribution Status */}
                            {question.platformPosts && Object.keys(question.platformPosts).length > 0 && (
                              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                                <p className="text-xs text-gray-500 mb-2">Posted on:</p>
                                <div className="flex gap-2">
                                  {Object.entries(question.platformPosts).map(([platform, post]: [string, any]) => (
                                    <Badge
                                      key={platform}
                                      variant={post.status === 'posted' ? 'default' : 'outline'}
                                      className="text-xs"
                                    >
                                      {platformIcons[platform as keyof typeof platformIcons]} {platform}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Knowledge Search Tab */}
          <TabsContent value="search">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Knowledge Base Search
                </CardTitle>
                <CardDescription>
                  Search our intelligent knowledge base for instant answers
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Search for solutions, tips, guides..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                  />
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>

                {searchLoading && (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  </div>
                )}

                {searchResults && searchResults.length > 0 && (
                  <div className="space-y-4">
                    {searchResults.map((result: any) => (
                      <Card key={result.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                                {result.title}
                              </h3>
                              <p className="text-gray-600 dark:text-gray-300 mb-3">
                                {result.quickSolution}
                              </p>
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <div className="flex items-center gap-1">
                                  <Star className="h-4 w-4" />
                                  {result.confidenceScore}% confidence
                                </div>
                                <div className="flex items-center gap-1">
                                  <Eye className="h-4 w-4" />
                                  Used {result.usageCount} times
                                </div>
                                <div className="flex items-center gap-1">
                                  <Target className="h-4 w-4" />
                                  {result.successRate}% success rate
                                </div>
                              </div>
                            </div>
                            <Badge variant="outline">{result.difficultyLevel}</Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {searchQuery.length > 2 && searchResults && searchResults.length === 0 && !searchLoading && (
                  <div className="text-center py-8">
                    <Lightbulb className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No results found. Try asking this as a new question!</p>
                    <Button 
                      className="mt-4" 
                      onClick={() => {
                        setActiveTab("ask");
                        setQuestionText(searchQuery);
                      }}
                    >
                      Ask This Question
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Trending Tab */}
          <TabsContent value="trending">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Trending Questions
                </CardTitle>
                <CardDescription>
                  Most popular questions in our community right now
                </CardDescription>
              </CardHeader>
              <CardContent>
                {trendingQuestions.length === 0 ? (
                  <div className="text-center py-12">
                    <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      No trending questions yet
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Questions with high engagement will appear here. Ask a great question to get started!
                    </p>
                    <Button onClick={() => setActiveTab("ask")}>
                      Ask a Question
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {trendingQuestions.map((question: any, index: number) => (
                    <Card key={question.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 dark:text-white mb-2">
                              {question.questionText}
                            </p>
                            <div className="flex items-center justify-between">
                              <div className="flex gap-2">
                                <Badge variant="outline">{question.category}</Badge>
                                {getRetentionBadge(question.retentionPeriod)}
                              </div>
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <div className="flex items-center gap-1">
                                  <TrendingUp className="h-4 w-4" />
                                  {question.totalEngagement || 0}
                                </div>
                                <div className="flex items-center gap-1">
                                  <BarChart3 className="h-4 w-4" />
                                  {question.problemSolvingScore}/100
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}