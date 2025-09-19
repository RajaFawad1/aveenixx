import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import MainEcommerceLayout from '@/components/layout/MainEcommerceLayout';
import { 
  Ticket, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Clock, 
  User, 
  AlertCircle, 
  CheckCircle, 
  MessageSquare, 
  Archive, 
  Star,
  TrendingUp,
  Users,
  Timer,
  Target,
  Mail,
  Phone,
  Calendar,
  Tag,
  FileText,
  Settings,
  Download,
  Upload,
  BarChart3,
  Activity,
  Zap,
  Shield,
  Globe,
  Database
} from 'lucide-react';

interface TicketData {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'pending' | 'resolved' | 'closed';
  category: string;
  customer: {
    name: string;
    email: string;
    company?: string;
  };
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  tags: string[];
  messages: TicketMessage[];
}

interface TicketMessage {
  id: string;
  content: string;
  author: string;
  timestamp: string;
  isInternal: boolean;
}

interface Agent {
  id: string;
  name: string;
  email: string;
  role: 'agent' | 'supervisor' | 'admin';
  status: 'online' | 'offline' | 'away';
  assignedTickets: number;
  resolvedToday: number;
}

export default function Helpdesk() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<TicketData | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [showNewTicketForm, setShowNewTicketForm] = useState(false);

  // Sample data - in production, this would come from API
  const sampleTickets: TicketData[] = [
    {
      id: 'TK-001',
      title: 'Login Issues - Unable to Access Dashboard',
      description: 'Customer cannot login to their account dashboard after password reset',
      priority: 'high',
      status: 'open',
      category: 'Authentication',
      customer: {
        name: 'John Smith',
        email: 'john@example.com',
        company: 'Tech Solutions Inc'
      },
      assignedTo: 'Sarah Johnson',
      createdAt: '2025-01-17T08:30:00Z',
      updatedAt: '2025-01-17T09:15:00Z',
      dueDate: '2025-01-17T16:00:00Z',
      tags: ['urgent', 'authentication'],
      messages: [
        {
          id: 'msg-1',
          content: 'Customer reported unable to login after password reset',
          author: 'System',
          timestamp: '2025-01-17T08:30:00Z',
          isInternal: false
        }
      ]
    },
    {
      id: 'TK-002',
      title: 'Payment Processing Error',
      description: 'Transaction failed during checkout process',
      priority: 'urgent',
      status: 'in_progress',
      category: 'Billing',
      customer: {
        name: 'Emma Davis',
        email: 'emma@businesscorp.com',
        company: 'Business Corp'
      },
      assignedTo: 'Mike Chen',
      createdAt: '2025-01-17T07:45:00Z',
      updatedAt: '2025-01-17T08:20:00Z',
      dueDate: '2025-01-17T12:00:00Z',
      tags: ['payment', 'critical'],
      messages: []
    },
    {
      id: 'TK-003',
      title: 'Feature Request - Export Functionality',
      description: 'Request to add CSV export feature to reports',
      priority: 'medium',
      status: 'pending',
      category: 'Feature Request',
      customer: {
        name: 'Alex Johnson',
        email: 'alex@startup.io'
      },
      createdAt: '2025-01-16T14:30:00Z',
      updatedAt: '2025-01-17T09:00:00Z',
      tags: ['enhancement', 'reports'],
      messages: []
    }
  ];

  const sampleAgents: Agent[] = [
    {
      id: 'agent-1',
      name: 'Sarah Johnson',
      email: 'sarah@aveenix.com',
      role: 'supervisor',
      status: 'online',
      assignedTickets: 8,
      resolvedToday: 3
    },
    {
      id: 'agent-2',
      name: 'Mike Chen',
      email: 'mike@aveenix.com',
      role: 'agent',
      status: 'online',
      assignedTickets: 12,
      resolvedToday: 5
    },
    {
      id: 'agent-3',
      name: 'Lisa Rodriguez',
      email: 'lisa@aveenix.com',
      role: 'agent',
      status: 'away',
      assignedTickets: 6,
      resolvedToday: 2
    }
  ];

  useEffect(() => {
    setTickets(sampleTickets);
    setAgents(sampleAgents);
  }, []);

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || ticket.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || ticket.priority === filterPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'pending': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300';
      case 'resolved': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'closed': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <AlertCircle className="w-4 h-4" />;
      case 'in_progress': return <Clock className="w-4 h-4" />;
      case 'pending': return <Timer className="w-4 h-4" />;
      case 'resolved': return <CheckCircle className="w-4 h-4" />;
      case 'closed': return <Archive className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const dashboardStats = {
    totalTickets: tickets.length,
    openTickets: tickets.filter(t => t.status === 'open').length,
    inProgressTickets: tickets.filter(t => t.status === 'in_progress').length,
    resolvedToday: tickets.filter(t => t.status === 'resolved' && 
      new Date(t.updatedAt).toDateString() === new Date().toDateString()).length,
    avgResponseTime: '2.5 hours',
    customerSatisfaction: '4.8/5',
    activeAgents: agents.filter(a => a.status === 'online').length,
    totalAgents: agents.length
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Tickets</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{dashboardStats.totalTickets}</p>
              </div>
              <div className="p-2 rounded-full" style={{ backgroundColor: 'color-mix(in srgb, var(--primary-color) 20%, transparent)' }}>
                <Ticket className="w-5 h-5" style={{ color: 'var(--primary-color)' }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Open Tickets</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{dashboardStats.openTickets}</p>
              </div>
              <div className="p-2 rounded-full bg-red-100 dark:bg-red-900/20">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">In Progress</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{dashboardStats.inProgressTickets}</p>
              </div>
              <div className="p-2 rounded-full bg-yellow-100 dark:bg-yellow-900/20">
                <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Resolved Today</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{dashboardStats.resolvedToday}</p>
              </div>
              <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/20">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Avg Response Time</span>
                <span className="font-medium">{dashboardStats.avgResponseTime}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Customer Satisfaction</span>
                <span className="font-medium">{dashboardStats.customerSatisfaction}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Active Agents</span>
                <span className="font-medium">{dashboardStats.activeAgents}/{dashboardStats.totalAgents}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Team Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {agents.map(agent => (
                <div key={agent.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-3 ${
                      agent.status === 'online' ? 'bg-green-500' : 
                      agent.status === 'away' ? 'bg-yellow-500' : 'bg-gray-500'
                    }`}></div>
                    <div>
                      <p className="font-medium text-sm">{agent.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{agent.role}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{agent.assignedTickets} assigned</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{agent.resolvedToday} resolved today</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderTicketList = () => (
    <div className="space-y-4">
      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search tickets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterPriority} onValueChange={setFilterPriority}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Filter by priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
        <Button 
          onClick={() => setShowNewTicketForm(true)}
          className="whitespace-nowrap"
          style={{ backgroundColor: 'var(--primary-color)' }}
        >
          <Plus className="w-4 h-4 mr-2" />
          New Ticket
        </Button>
      </div>

      {/* Ticket List */}
      <div className="space-y-3">
        {filteredTickets.map(ticket => (
          <Card key={ticket.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedTicket(ticket)}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-medium text-sm text-gray-500 dark:text-gray-400">{ticket.id}</span>
                    <Badge className={`${getPriorityColor(ticket.priority)} text-xs`}>
                      {ticket.priority}
                    </Badge>
                    <Badge className={`${getStatusColor(ticket.status)} text-xs flex items-center gap-1`}>
                      {getStatusIcon(ticket.status)}
                      {ticket.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-1">{ticket.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{ticket.description}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {ticket.customer.name}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </span>
                    {ticket.assignedTo && (
                      <span className="flex items-center gap-1">
                        <Target className="w-3 h-3" />
                        {ticket.assignedTo}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {ticket.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            Helpdesk Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="text-base font-medium mb-3 block">Business Hours</Label>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Monday - Friday</span>
                  <span className="text-sm">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Saturday</span>
                  <span className="text-sm">10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Sunday</span>
                  <span className="text-sm">Closed</span>
                </div>
              </div>
            </div>
            <div>
              <Label className="text-base font-medium mb-3 block">SLA Settings</Label>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Urgent Priority</span>
                  <span className="text-sm">2 hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">High Priority</span>
                  <span className="text-sm">4 hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Medium Priority</span>
                  <span className="text-sm">24 hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Low Priority</span>
                  <span className="text-sm">48 hours</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="w-5 h-5 mr-2" />
            Data Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" className="flex items-center justify-center">
              <Download className="w-4 h-4 mr-2" />
              Export Tickets
            </Button>
            <Button variant="outline" className="flex items-center justify-center">
              <Upload className="w-4 h-4 mr-2" />
              Import Tickets
            </Button>
            <Button variant="outline" className="flex items-center justify-center">
              <BarChart3 className="w-4 h-4 mr-2" />
              Generate Reports
            </Button>
            <Button variant="outline" className="flex items-center justify-center">
              <Archive className="w-4 h-4 mr-2" />
              Archive Old Tickets
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <MainEcommerceLayout>
      <div className="max-w-7xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Helpdesk</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Comprehensive ticket management and customer support
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Activity className="w-4 h-4 mr-2" />
            Live Stats
          </Button>
          <Button variant="outline" size="sm">
            <Globe className="w-4 h-4 mr-2" />
            Multi-Tenant
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="tickets">Tickets</TabsTrigger>
          <TabsTrigger value="agents">Agents</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          {renderDashboard()}
        </TabsContent>

        <TabsContent value="tickets">
          {renderTicketList()}
        </TabsContent>

        <TabsContent value="agents">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Support Agents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {agents.map(agent => (
                    <div key={agent.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                      <div className="flex items-center">
                        <div className={`w-4 h-4 rounded-full mr-4 ${
                          agent.status === 'online' ? 'bg-green-500' : 
                          agent.status === 'away' ? 'bg-yellow-500' : 'bg-gray-500'
                        }`}></div>
                        <div>
                          <p className="font-medium">{agent.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{agent.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <p className="text-sm font-medium">{agent.assignedTickets}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Assigned</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-medium">{agent.resolvedToday}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Resolved Today</p>
                        </div>
                        <Badge variant="outline" className="capitalize">{agent.role}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings">
          {renderSettings()}
        </TabsContent>
      </Tabs>

      {/* Selected Ticket Modal would go here */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {selectedTicket.id}: {selectedTicket.title}
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className={getPriorityColor(selectedTicket.priority)}>
                      {selectedTicket.priority}
                    </Badge>
                    <Badge className={getStatusColor(selectedTicket.status)}>
                      {selectedTicket.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
                <Button variant="ghost" onClick={() => setSelectedTicket(null)}>
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{selectedTicket.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Customer</h4>
                    <p className="text-sm">{selectedTicket.customer.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{selectedTicket.customer.email}</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Assigned To</h4>
                    <p className="text-sm">{selectedTicket.assignedTo || 'Unassigned'}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      </div>
    </MainEcommerceLayout>
  );
}