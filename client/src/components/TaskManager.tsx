import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Clock, Users, Target, Settings } from 'lucide-react';

export default function TaskManager() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Task Manager</h2>
          <p className="text-muted-foreground">Create and manage customer engagement tasks and quests</p>
        </div>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </Button>
      </div>

      {/* Task Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
            <Target className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Currently available</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completions Today</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+12% from yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rewards Paid</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$156</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Participants</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92</div>
            <p className="text-xs text-muted-foreground">Active users</p>
          </CardContent>
        </Card>
      </div>

      {/* Example Tasks */}
      <Card>
        <CardHeader>
          <CardTitle>Popular Tasks</CardTitle>
          <CardDescription>Most completed engagement tasks this week</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                name: "Newsletter Signup",
                description: "Subscribe to Aveenix weekly newsletter",
                reward: "$2.00",
                completions: 45,
                status: "active",
                type: "signup"
              },
              {
                name: "Product Review",
                description: "Write a detailed review for purchased items",
                reward: "$5.00",
                completions: 28,
                status: "active",
                type: "review"
              },
              {
                name: "Social Media Follow",
                description: "Follow Aveenix on Twitter and Instagram",
                reward: "$1.50",
                completions: 67,
                status: "active",
                type: "social"
              },
              {
                name: "Refer a Friend",
                description: "Invite friends to join Aveenix",
                reward: "$10.00",
                completions: 12,
                status: "active",
                type: "referral"
              },
              {
                name: "Complete Profile",
                description: "Fill out complete user profile",
                reward: "$3.00",
                completions: 34,
                status: "active",
                type: "profile"
              }
            ].map((task, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="h-3 w-3 rounded-full bg-green-400"></div>
                  <div>
                    <div className="font-medium">{task.name}</div>
                    <div className="text-sm text-muted-foreground">{task.description}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-right">
                  <div>
                    <div className="font-medium text-green-600">{task.reward}</div>
                    <div className="text-xs text-muted-foreground">{task.completions} completed</div>
                  </div>
                  <Badge variant="outline" className="capitalize">
                    {task.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Coming Soon */}
      <Card className="border-dashed border-2">
        <CardContent className="p-8 text-center">
          <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">Advanced Task Management</h3>
          <p className="text-muted-foreground mb-4">
            Create custom tasks with points/rewards, frequency controls, cooldowns, and verification types.
            Full CRUD interface coming soon to manage customer engagement campaigns.
          </p>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div>• Custom task creation with reward configuration</div>
            <div>• Automated verification through events and webhooks</div>
            <div>• Frequency controls (once, daily, weekly, monthly)</div>
            <div>• Cooldown periods and user eligibility tracking</div>
            <div>• Analytics and performance metrics</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}