import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Award,
  DollarSign,
  Users,
  TrendingUp,
  Gift,
  CreditCard,
  Target,
  Activity,
  Eye,
  Download,
  RefreshCw
} from 'lucide-react';

interface RewardsStats {
  totalDistributed: number;
  totalRedeemed: number;
  pendingRedemptions: number;
  activeVouchers: number;
  customerParticipation: number;
  averageRewardValue: number;
}

interface RedemptionRequest {
  id: number;
  userId: string;
  type: string;
  amountCents: number;
  feeCents: number;
  status: string;
  target: string;
  createdAt: string;
  processedAt?: string;
}

interface RewardsLedgerEntry {
  id: number;
  userId: string;
  sourceType: string;
  sourceId: string;
  amountCents: number;
  points: number;
  status: string;
  createdAt: string;
}

const CustomerRewardsManagement = () => {
  const [activeSubTab, setActiveSubTab] = useState<string>('overview');

  // Fetch rewards admin summary
  const { data: rewardsStats, isLoading: statsLoading } = useQuery<RewardsStats>({
    queryKey: ['/api/rewards/admin/summary'],
    enabled: true
  });

  // Fetch pending redemptions for admin review
  const { data: pendingRedemptions, isLoading: redemptionsLoading } = useQuery<RedemptionRequest[]>({
    queryKey: ['/api/rewards/admin/redemptions/pending'],
    enabled: activeSubTab === 'redemptions'
  });

  // Fetch recent rewards activity
  const { data: recentActivity, isLoading: activityLoading } = useQuery<RewardsLedgerEntry[]>({
    queryKey: ['/api/rewards/admin/activity/recent'],
    enabled: activeSubTab === 'activity'
  });

  const stats = rewardsStats || {
    totalDistributed: 0,
    totalRedeemed: 0,
    pendingRedemptions: 0,
    activeVouchers: 0,
    customerParticipation: 0,
    averageRewardValue: 0
  };

  const formatCurrency = (cents: number) => `$${(cents / 100).toFixed(2)}`;

  const renderSubTabContent = () => {
    switch (activeSubTab) {
      case 'overview':
        return (
          <div className="space-y-5">
            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <Card className="border border-gray-200 dark:border-gray-700">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Distributed</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {statsLoading ? 'Loading...' : formatCurrency(stats.totalDistributed)}
                      </p>
                    </div>
                    <div className="h-12 w-12 bg-emerald-100 dark:bg-emerald-900 rounded-lg flex items-center justify-center">
                      <Award className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-200 dark:border-gray-700">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Redeemed</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {statsLoading ? 'Loading...' : formatCurrency(stats.totalRedeemed)}
                      </p>
                    </div>
                    <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                      <CreditCard className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-200 dark:border-gray-700">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Requests</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {statsLoading ? 'Loading...' : stats.pendingRedemptions}
                      </p>
                    </div>
                    <div className="h-12 w-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
                      <RefreshCw className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-200 dark:border-gray-700">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Vouchers</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {statsLoading ? 'Loading...' : stats.activeVouchers}
                      </p>
                    </div>
                    <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                      <Gift className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-200 dark:border-gray-700">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Customer Participation</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {statsLoading ? 'Loading...' : `${stats.customerParticipation}%`}
                      </p>
                    </div>
                    <div className="h-12 w-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                      <Users className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-200 dark:border-gray-700">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Reward Value</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {statsLoading ? 'Loading...' : formatCurrency(stats.averageRewardValue)}
                      </p>
                    </div>
                    <div className="h-12 w-12 bg-teal-100 dark:bg-teal-900 rounded-lg flex items-center justify-center">
                      <Target className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Program Health Overview */}
            <Card className="border border-gray-200 dark:border-gray-700">
              <CardContent className="p-5">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Loyalty Program Health</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                    <TrendingUp className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
                    <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Program Growth</p>
                    <p className="text-xl font-bold text-emerald-700 dark:text-emerald-300">+12.5%</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <Activity className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Engagement Rate</p>
                    <p className="text-xl font-bold text-blue-700 dark:text-blue-300">67%</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <DollarSign className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <p className="text-sm font-medium text-purple-600 dark:text-purple-400">ROI</p>
                    <p className="text-xl font-bold text-purple-700 dark:text-purple-300">3.2x</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'redemptions':
        return (
          <div className="space-y-5">
            <Card className="border border-gray-200 dark:border-gray-700">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Pending Redemption Requests</h3>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                      <Download className="h-4 w-4 inline mr-2" />
                      Export
                    </button>
                  </div>
                </div>

                {redemptionsLoading ? (
                  <div className="text-center py-8">
                    <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600 dark:text-gray-400">Loading redemption requests...</p>
                  </div>
                ) : !pendingRedemptions || pendingRedemptions.length === 0 ? (
                  <div className="text-center py-8">
                    <CreditCard className="h-16 w-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                    <p className="text-gray-600 dark:text-gray-400">No pending redemption requests</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {pendingRedemptions.map((redemption) => (
                      <div key={redemption.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                                {redemption.type.toUpperCase()}
                              </span>
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                User: {redemption.userId}
                              </span>
                            </div>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">
                              {formatCurrency(redemption.amountCents)}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Requested: {new Date(redemption.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <button className="px-3 py-1 bg-emerald-600 text-white rounded text-sm hover:bg-emerald-700 transition-colors">
                              Approve
                            </button>
                            <button className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors">
                              Reject
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );

      case 'activity':
        return (
          <div className="space-y-5">
            <Card className="border border-gray-200 dark:border-gray-700">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Rewards Activity</h3>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                    <RefreshCw className="h-4 w-4 inline mr-2" />
                    Refresh
                  </button>
                </div>

                {activityLoading ? (
                  <div className="text-center py-8">
                    <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600 dark:text-gray-400">Loading activity...</p>
                  </div>
                ) : !recentActivity || recentActivity.length === 0 ? (
                  <div className="text-center py-8">
                    <Activity className="h-16 w-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                    <p className="text-gray-600 dark:text-gray-400">No recent activity</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentActivity.map((entry) => (
                      <div key={entry.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
                                {entry.sourceType.toUpperCase()}
                              </span>
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                {entry.userId}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {new Date(entry.createdAt).toLocaleDateString()} - {entry.sourceId}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">
                              +{formatCurrency(entry.amountCents)}
                            </p>
                            {entry.points > 0 && (
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {entry.points} points
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-5">
            <Card className="border border-gray-200 dark:border-gray-700">
              <CardContent className="p-5">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Rewards Program Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Commission Rate (%)
                    </label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="2.5"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Minimum Redemption Amount ($)
                    </label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="5.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      PayPal Processing Fee (%)
                    </label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="3.0"
                    />
                  </div>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Save Settings
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-5">
      {/* Customer Rewards Header */}
      <Card className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-gray-800 dark:to-gray-900 border-0">
        <CardContent className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900">
              <Award className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Customer Rewards Program</h2>
              <p className="text-gray-600 dark:text-gray-400">Manage customer loyalty, rewards distribution, and redemption requests</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 px-3 py-2 bg-white/80 dark:bg-gray-800/80 rounded-lg border border-amber-200/50 dark:border-amber-700/50">
              <Award className="w-4 h-4 text-amber-600" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {formatCurrency(stats.totalDistributed)} Distributed
              </span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-white/80 dark:bg-gray-800/80 rounded-lg border border-amber-200/50 dark:border-amber-700/50">
              <Users className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {stats.customerParticipation}% Participation
              </span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-white/80 dark:bg-gray-800/80 rounded-lg border border-amber-200/50 dark:border-amber-700/50">
              <RefreshCw className="w-4 h-4 text-yellow-600" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {stats.pendingRedemptions} Pending
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sub Tab Navigation */}
      <div className="flex flex-wrap gap-2 bg-gray-50 dark:bg-gray-800 p-2 rounded-lg">
        {[
          { key: 'overview', label: 'Overview', icon: Eye },
          { key: 'redemptions', label: 'Redemptions', icon: CreditCard },
          { key: 'activity', label: 'Activity', icon: Activity },
          { key: 'settings', label: 'Settings', icon: Target }
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveSubTab(key)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              activeSubTab === key
                ? 'bg-white dark:bg-gray-700 text-amber-600 dark:text-amber-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-white/50 dark:hover:bg-gray-700/50'
            }`}
          >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Sub Tab Content */}
      <div>
        {renderSubTabContent()}
      </div>
    </div>
  );
};

export default CustomerRewardsManagement;