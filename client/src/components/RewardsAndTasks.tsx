import { useEffect, useState } from 'react';
import { RewardsAPI, formatCents } from '@/lib/rewards-api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { CreditCard, DollarSign, Gift, History, Wallet, Award, TrendingUp, PiggyBank } from 'lucide-react';

interface RewardsSummary {
  confirmed: number;
  redeemed: number;
  available: number;
}

interface Redemption {
  id: number;
  type: string;
  amountCents: number;
  feeCents: number;
  status: string;
  createdAt: string;
  target?: string;
}

export default function RewardsAndTasks() {
  const [summary, setSummary] = useState<RewardsSummary | null>(null);
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);
  const [amount, setAmount] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [paypalEmail, setPaypalEmail] = useState('');
  const [giftCardBrand, setGiftCardBrand] = useState('Aveenix');
  const { toast } = useToast();

  const loadData = async () => {
    try {
      setLoading(true);
      const [summaryData, redemptionsData] = await Promise.all([
        RewardsAPI.me(),
        RewardsAPI.myRedemptions()
      ]);
      setSummary(summaryData);
      setRedemptions(redemptionsData.items || []);
    } catch (error) {
      console.error('Error loading rewards data:', error);
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
    loadData();
  }, []);

  const amountCents = Math.round(parseFloat(amount || '0') * 100);
  const available = summary?.available || 0;

  const createVoucher = async () => {
    if (amountCents <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount",
        variant: "destructive"
      });
      return;
    }

    if (amountCents > available) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough rewards for this voucher",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      await RewardsAPI.createVoucher(amountCents);
      setAmount('');
      await loadData();
      toast({
        title: "Success",
        description: "Voucher created successfully",
      });
    } catch (error) {
      console.error('Error creating voucher:', error);
      toast({
        title: "Error",
        description: "Failed to create voucher",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const requestCashout = async () => {
    if (amountCents <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount",
        variant: "destructive"
      });
      return;
    }

    if (amountCents > available) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough rewards for this cashout",
        variant: "destructive"
      });
      return;
    }

    if (!paypalEmail) {
      toast({
        title: "PayPal Email Required",
        description: "Please enter your PayPal email address",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      await RewardsAPI.createRedemption({
        type: 'cash',
        amountCents,
        target: { paypal_email: paypalEmail }
      });
      setAmount('');
      setPaypalEmail('');
      await loadData();
      toast({
        title: "Success",
        description: "Cash-out request submitted successfully",
      });
    } catch (error) {
      console.error('Error requesting cashout:', error);
      toast({
        title: "Error",
        description: "Failed to request cashout",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const requestGiftCard = async () => {
    if (amountCents <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount",
        variant: "destructive"
      });
      return;
    }

    if (amountCents > available) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough rewards for this gift card",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      await RewardsAPI.createRedemption({
        type: 'giftcard',
        amountCents,
        target: { giftcard_brand: giftCardBrand }
      });
      setAmount('');
      await loadData();
      toast({
        title: "Success",
        description: "Gift card request submitted successfully",
      });
    } catch (error) {
      console.error('Error requesting gift card:', error);
      toast({
        title: "Error",
        description: "Failed to request gift card",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      requested: "outline",
      approved: "secondary",
      processing: "secondary",
      paid: "default",
      rejected: "destructive",
      failed: "destructive"
    };
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
  };

  if (loading && !summary) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border-yellow-200 dark:border-yellow-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
            <Wallet className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">
              {formatCents(available)}
            </div>
            <p className="text-xs text-yellow-600 dark:text-yellow-400">
              Ready for redemption
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700 dark:text-green-300">
              {formatCents(summary?.confirmed || 0)}
            </div>
            <p className="text-xs text-green-600 dark:text-green-400">
              Lifetime rewards
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Redeemed</CardTitle>
            <PiggyBank className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
              {formatCents(summary?.redeemed || 0)}
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400">
              Successfully withdrawn
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="redeem" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="redeem">Redeem Rewards</TabsTrigger>
          <TabsTrigger value="history">Transaction History</TabsTrigger>
        </TabsList>

        <TabsContent value="redeem" className="space-y-6">
          {/* Amount Input */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Redeem Your Rewards
              </CardTitle>
              <CardDescription>
                Convert your earned rewards into vouchers, cash, or gift cards
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Amount (USD)</label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  max={available / 100}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Available: {formatCents(available)}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Voucher */}
                <Card className="border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-yellow-300 dark:hover:border-yellow-600 transition-colors">
                  <CardContent className="p-4 text-center space-y-3">
                    <CreditCard className="h-8 w-8 mx-auto text-yellow-600" />
                    <div>
                      <h3 className="font-medium">Instant Voucher</h3>
                      <p className="text-xs text-muted-foreground">Use on dropship items</p>
                    </div>
                    <Button 
                      onClick={createVoucher} 
                      disabled={loading || amountCents <= 0 || amountCents > available}
                      className="w-full"
                      size="sm"
                    >
                      Create Voucher
                    </Button>
                  </CardContent>
                </Card>

                {/* PayPal Cash-out */}
                <Card className="border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-600 transition-colors">
                  <CardContent className="p-4 text-center space-y-3">
                    <DollarSign className="h-8 w-8 mx-auto text-green-600" />
                    <div>
                      <h3 className="font-medium">PayPal Cash-out</h3>
                      <p className="text-xs text-muted-foreground">3% fee, $1 minimum</p>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          disabled={loading || amountCents <= 0 || amountCents > available}
                          className="w-full"
                          size="sm"
                          variant="outline"
                        >
                          Request Cash-out
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>PayPal Cash-out</DialogTitle>
                          <DialogDescription>
                            Enter your PayPal email to receive {formatCents(amountCents)}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                          <Input
                            type="email"
                            placeholder="your-email@example.com"
                            value={paypalEmail}
                            onChange={(e) => setPaypalEmail(e.target.value)}
                          />
                        </div>
                        <DialogFooter>
                          <Button variant="outline">Cancel</Button>
                          <Button onClick={requestCashout}>Submit Request</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>

                {/* Gift Card */}
                <Card className="border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 transition-colors">
                  <CardContent className="p-4 text-center space-y-3">
                    <Gift className="h-8 w-8 mx-auto text-purple-600" />
                    <div>
                      <h3 className="font-medium">Gift Card</h3>
                      <p className="text-xs text-muted-foreground">Aveenix store credit</p>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          disabled={loading || amountCents <= 0 || amountCents > available}
                          className="w-full"
                          size="sm"
                          variant="outline"
                        >
                          Request Gift Card
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Gift Card Request</DialogTitle>
                          <DialogDescription>
                            Request a {formatCents(amountCents)} gift card for {giftCardBrand}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                          <Input
                            value={giftCardBrand}
                            onChange={(e) => setGiftCardBrand(e.target.value)}
                            placeholder="Brand name"
                          />
                        </div>
                        <DialogFooter>
                          <Button variant="outline">Cancel</Button>
                          <Button onClick={requestGiftCard}>Submit Request</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>
              </div>

              <div className="text-xs text-muted-foreground p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <strong>Note:</strong> Vouchers & gift cards apply to dropship items. Cash-outs may have processing fees and take 1-3 business days.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Recent Redemptions
              </CardTitle>
              <CardDescription>
                Your redemption history and current status
              </CardDescription>
            </CardHeader>
            <CardContent>
              {redemptions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No redemptions yet</p>
                  <p className="text-sm">Start earning rewards to see your redemption history here</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {redemptions.map((redemption) => (
                    <div
                      key={redemption.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="h-2 w-2 rounded-full bg-yellow-400"></div>
                        <div>
                          <div className="font-medium capitalize">{redemption.type}</div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(redemption.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <div className="font-medium">{formatCents(redemption.amountCents)}</div>
                        {getStatusBadge(redemption.status)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}