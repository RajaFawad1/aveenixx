import React, { useEffect, useState } from 'react';
import { EnhancedRewardsAPI, formatCentsEnhanced } from '@/lib/rewards-api-enhanced';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  CheckCircle, 
  XCircle, 
  Clock,
  Download,
  RefreshCw
} from 'lucide-react';

interface AdminSummary {
  total: number;
  confirmed: number;
  redeemed: number;
  outstanding: number;
}

interface AdminRedemption {
  id: number;
  userId: string;
  type: string;
  amountCents: number;
  feeCents: number;
  status: string;
  provider: string;
  providerRef?: string;
  createdAt: string;
  processedAt?: string;
  target?: any;
}

export default function EnhancedRewardsTracking() {
  const [summary, setSummary] = useState<AdminSummary | null>(null);
  const [redemptions, setRedemptions] = useState<AdminRedemption[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const load = async () => {
    try {
      setLoading(true);
      const [summaryData, redemptionsData] = await Promise.all([
        EnhancedRewardsAPI.adminSummary(),
        EnhancedRewardsAPI.adminRedemptions()
      ]);
      setSummary(summaryData);
      setRedemptions(redemptionsData.items || []);
    } catch (error) {
      console.error('Error loading admin rewards data:', error);
      toast({
        title: "Error",
        description: "Failed to load rewards data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    load(); 
  }, []);

  const handleApprove = async (id: number) => {
    try {
      await EnhancedRewardsAPI.approve(id);
      await load();
      toast({
        title: "Approved",
        description: "Redemption has been approved",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve redemption",
        variant: "destructive"
      });
    }
  };

  const handleReject = async (id: number) => {
    try {
      await EnhancedRewardsAPI.reject(id);
      await load();
      toast({
        title: "Rejected",
        description: "Redemption has been rejected",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject redemption",
        variant: "destructive"
      });
    }
  };

  const handleMarkPaid = async (id: number) => {
    const ref = prompt('Provider Reference (optional):') || '';
    try {
      await EnhancedRewardsAPI.markPaid(id, ref);
      await load();
      toast({
        title: "Marked as Paid",
        description: "Redemption has been marked as paid",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark as paid",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      requested: "outline",
      approved: "secondary", 
      rejected: "destructive",
      paid: "default"
    };
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rewards</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summary ? formatCentsEnhanced(summary.total) : '-'}
            </div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summary ? formatCentsEnhanced(summary.confirmed) : '-'}
            </div>
            <p className="text-xs text-muted-foreground">Available for redemption</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Redeemed</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summary ? formatCentsEnhanced(summary.redeemed) : '-'}
            </div>
            <p className="text-xs text-muted-foreground">Paid out</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summary ? formatCentsEnhanced(summary.outstanding) : '-'}
            </div>
            <p className="text-xs text-muted-foreground">Awaiting processing</p>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Payouts Queue</h3>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={load}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Redemptions Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr className="text-left">
                  <th className="p-4 font-medium">ID</th>
                  <th className="p-4 font-medium">User</th>
                  <th className="p-4 font-medium">Type</th>
                  <th className="p-4 font-medium">Amount</th>
                  <th className="p-4 font-medium">Fee</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Provider</th>
                  <th className="p-4 font-medium">Created</th>
                  <th className="p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {redemptions.map((redemption) => (
                  <tr key={redemption.id} className="border-b hover:bg-muted/50">
                    <td className="p-4 font-mono text-sm">{redemption.id}</td>
                    <td className="p-4">{redemption.userId}</td>
                    <td className="p-4 capitalize">{redemption.type}</td>
                    <td className="p-4">{formatCentsEnhanced(redemption.amountCents)}</td>
                    <td className="p-4">{formatCentsEnhanced(redemption.feeCents)}</td>
                    <td className="p-4">{getStatusBadge(redemption.status)}</td>
                    <td className="p-4">{redemption.provider}</td>
                    <td className="p-4 text-sm">
                      {new Date(redemption.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-1">
                        {redemption.status === 'requested' && (
                          <>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleApprove(redemption.id)}
                            >
                              <CheckCircle className="h-3 w-3" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleReject(redemption.id)}
                            >
                              <XCircle className="h-3 w-3" />
                            </Button>
                          </>
                        )}
                        {redemption.status === 'approved' && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleMarkPaid(redemption.id)}
                          >
                            Mark Paid
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {redemptions.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              No redemption requests found
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}