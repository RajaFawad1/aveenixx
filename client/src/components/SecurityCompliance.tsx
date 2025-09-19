import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useQuery } from '@tanstack/react-query';
import { 
  Shield, 
  Lock, 
  Eye, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Search,
  FileText,
  Users,
  Settings,
  Activity,
  BarChart3,
  Clock,
  Database,
  Key,
  Zap,
  Globe,
  UserCheck,
  ShieldCheck,
  Scan,
  Ban,
  History,
  RefreshCw,
  Download,
  Upload,
  Filter,
  AlertCircle
} from 'lucide-react';

interface ComplianceCheck {
  id: string;
  productId: string;
  productName: string;
  checkType: 'FDA' | 'CE' | 'FCC' | 'RoHS' | 'CPSIA' | 'WEEE';
  status: 'compliant' | 'non_compliant' | 'pending' | 'requires_review';
  lastChecked: string;
  issues: string[];
  certificationRequired: boolean;
  expiryDate?: string;
}

interface ContentModerationResult {
  id: string;
  productId: string;
  productName: string;
  contentType: 'title' | 'description' | 'image' | 'reviews';
  status: 'approved' | 'flagged' | 'blocked' | 'under_review';
  flaggedFor: string[];
  confidence: number;
  reviewedBy?: string;
  reviewedAt?: string;
  action: 'none' | 'warning' | 'content_edit' | 'removal';
}

interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  resourceType: 'product' | 'user' | 'order' | 'settings';
  resourceId: string;
  changes: {
    field: string;
    oldValue: any;
    newValue: any;
  }[];
  ipAddress: string;
  userAgent: string;
  rollbackAvailable: boolean;
}

interface SSOProvider {
  id: string;
  name: string;
  type: 'SAML' | 'OAuth2' | 'ActiveDirectory' | 'LDAP';
  status: 'active' | 'inactive' | 'error';
  users: number;
  lastSync: string;
  configuration: {
    domain?: string;
    clientId?: string;
    endpoint?: string;
  };
}

export default function SecurityCompliance() {
  const [activeTab, setActiveTab] = useState('compliance');
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  // Fetch compliance data
  const { data: complianceChecks = [], isLoading: complianceLoading } = useQuery<ComplianceCheck[]>({
    queryKey: ['/api/security/compliance']
  });

  // Fetch content moderation data
  const { data: moderationResults = [], isLoading: moderationLoading } = useQuery<ContentModerationResult[]>({
    queryKey: ['/api/security/moderation']
  });

  // Fetch audit logs
  const { data: auditLogs = [], isLoading: auditLoading } = useQuery<AuditLogEntry[]>({
    queryKey: ['/api/security/audit-logs']
  });

  // Fetch SSO providers
  const { data: ssoProviders = [], isLoading: ssoLoading } = useQuery<SSOProvider[]>({
    queryKey: ['/api/security/sso-providers']
  });

  const getComplianceIcon = (checkType: string) => {
    switch (checkType) {
      case 'FDA': return <Shield className="w-4 h-4" />;
      case 'CE': return <CheckCircle className="w-4 h-4" />;
      case 'FCC': return <Zap className="w-4 h-4" />;
      case 'RoHS': return <Globe className="w-4 h-4" />;
      default: return <ShieldCheck className="w-4 h-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'compliant':
      case 'approved':
      case 'active':
        return <Badge variant="secondary" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Compliant</Badge>;
      case 'non_compliant':
      case 'blocked':
      case 'error':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Non-Compliant</Badge>;
      case 'pending':
      case 'under_review':
      case 'inactive':
        return <Badge variant="outline"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'flagged':
      case 'requires_review':
        return <Badge variant="outline" className="bg-orange-100 text-orange-800"><AlertTriangle className="w-3 h-3 mr-1" />Review Needed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const mockComplianceChecks: ComplianceCheck[] = [
    {
      id: 'comp_1',
      productId: 'prod_1',
      productName: 'AirPods Pro (2nd Generation)',
      checkType: 'FCC',
      status: 'compliant',
      lastChecked: '2025-01-23T05:30:00Z',
      issues: [],
      certificationRequired: true,
      expiryDate: '2026-01-23T00:00:00Z'
    },
    {
      id: 'comp_2',
      productId: 'prod_2',
      productName: 'Smart Fitness Watch Pro',
      checkType: 'FDA',
      status: 'requires_review',
      lastChecked: '2025-01-23T04:15:00Z',
      issues: ['Missing FDA registration number', 'Health claims require validation'],
      certificationRequired: true
    },
    {
      id: 'comp_3',
      productId: 'prod_3',
      productName: 'Wireless Gaming Headset',
      checkType: 'CE',
      status: 'non_compliant',
      lastChecked: '2025-01-23T03:45:00Z',
      issues: ['Missing CE marking on product', 'Declaration of Conformity not provided'],
      certificationRequired: true
    }
  ];

  const mockModerationResults: ContentModerationResult[] = [
    {
      id: 'mod_1',
      productId: 'prod_1',
      productName: 'Premium Bluetooth Speaker',
      contentType: 'description',
      status: 'flagged',
      flaggedFor: ['Potential trademark violation', 'Exaggerated claims'],
      confidence: 87.5,
      action: 'content_edit'
    },
    {
      id: 'mod_2',
      productId: 'prod_2',
      productName: 'Ergonomic Office Chair',
      contentType: 'image',
      status: 'approved',
      flaggedFor: [],
      confidence: 95.2,
      reviewedBy: 'John Smith',
      reviewedAt: '2025-01-23T05:15:00Z',
      action: 'none'
    },
    {
      id: 'mod_3',
      productId: 'prod_3',
      productName: 'Smart Home Camera',
      contentType: 'title',
      status: 'blocked',
      flaggedFor: ['Prohibited brand reference', 'Misleading feature claims'],
      confidence: 92.8,
      action: 'removal'
    }
  ];

  const mockAuditLogs: AuditLogEntry[] = [
    {
      id: 'audit_1',
      timestamp: '2025-01-23T05:30:00Z',
      userId: 'user_123',
      userName: 'Michael Prasad',
      action: 'Product Updated',
      resourceType: 'product',
      resourceId: 'prod_456',
      changes: [
        { field: 'price', oldValue: 299.99, newValue: 279.99 },
        { field: 'description', oldValue: 'Old description', newValue: 'Updated description' }
      ],
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 Chrome/120.0.0.0',
      rollbackAvailable: true
    },
    {
      id: 'audit_2',
      timestamp: '2025-01-23T05:15:00Z',
      userId: 'user_456',
      userName: 'Sarah Johnson',
      action: 'User Role Changed',
      resourceType: 'user',
      resourceId: 'user_789',
      changes: [
        { field: 'role', oldValue: 'customer', newValue: 'vendor' }
      ],
      ipAddress: '10.0.1.50',
      userAgent: 'Mozilla/5.0 Safari/605.1.15',
      rollbackAvailable: true
    }
  ];

  const mockSSOProviders: SSOProvider[] = [
    {
      id: 'sso_1',
      name: 'Microsoft Active Directory',
      type: 'ActiveDirectory',
      status: 'active',
      users: 156,
      lastSync: '2025-01-23T05:30:00Z',
      configuration: {
        domain: 'company.local',
        endpoint: 'ldap://ad.company.local'
      }
    },
    {
      id: 'sso_2',
      name: 'Google Workspace',
      type: 'OAuth2',
      status: 'active',
      users: 89,
      lastSync: '2025-01-23T05:25:00Z',
      configuration: {
        clientId: 'google-workspace-client',
        endpoint: 'https://accounts.google.com/oauth2'
      }
    },
    {
      id: 'sso_3',
      name: 'Corporate SAML',
      type: 'SAML',
      status: 'inactive',
      users: 0,
      lastSync: '2025-01-22T18:00:00Z',
      configuration: {
        endpoint: 'https://sso.company.com/saml'
      }
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Advanced Security & Compliance
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Enterprise-grade security, compliance scanning, and audit management
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Scan className="w-4 h-4 mr-2" />
            Run Scan
          </Button>
          <Button size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Compliance Rate</p>
                <p className="text-2xl font-bold">87.3%</p>
                <p className="text-xs text-green-600">+2.1% this week</p>
              </div>
              <ShieldCheck className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Content Flagged</p>
                <p className="text-2xl font-bold">12</p>
                <p className="text-xs text-orange-600">Requires review</p>
              </div>
              <Ban className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">SSO Users</p>
                <p className="text-2xl font-bold">245</p>
                <p className="text-xs text-blue-600">2 providers active</p>
              </div>
              <UserCheck className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Audit Events</p>
                <p className="text-2xl font-bold">1,247</p>
                <p className="text-xs text-purple-600">Last 30 days</p>
              </div>
              <History className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="compliance" className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            Compliance
          </TabsTrigger>
          <TabsTrigger value="moderation" className="flex items-center gap-2">
            <Ban className="w-4 h-4" />
            Moderation
          </TabsTrigger>
          <TabsTrigger value="audit" className="flex items-center gap-2">
            <History className="w-4 h-4" />
            Audit Trail
          </TabsTrigger>
          <TabsTrigger value="sso" className="flex items-center gap-2">
            <UserCheck className="w-4 h-4" />
            SSO
          </TabsTrigger>
        </TabsList>

        {/* Product Compliance Scanning Tab */}
        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scan className="w-5 h-5 text-blue-500" />
                Product Compliance Scanning
              </CardTitle>
              <CardDescription>
                Automated regulatory compliance checks for FDA, CE, FCC, and other certifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockComplianceChecks.map((check) => (
                  <div key={check.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {getComplianceIcon(check.checkType)}
                        <div>
                          <h4 className="font-medium">{check.productName}</h4>
                          <p className="text-sm text-gray-600">{check.checkType} Compliance Check</p>
                        </div>
                      </div>
                      {getStatusBadge(check.status)}
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-gray-600">Last Checked</p>
                        <p className="text-sm font-medium">
                          {new Date(check.lastChecked).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Certification Required</p>
                        <p className="text-sm font-medium">
                          {check.certificationRequired ? 'Yes' : 'No'}
                        </p>
                      </div>
                      {check.expiryDate && (
                        <div>
                          <p className="text-xs text-gray-600">Expires</p>
                          <p className="text-sm font-medium">
                            {new Date(check.expiryDate).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                      <div>
                        <p className="text-xs text-gray-600">Issues Found</p>
                        <p className="text-sm font-medium">{check.issues.length}</p>
                      </div>
                    </div>

                    {check.issues.length > 0 && (
                      <div className="mb-3">
                        <p className="text-sm font-medium mb-2">Issues:</p>
                        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                          {check.issues.map((issue, index) => (
                            <li key={index}>{issue}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Scan className="w-3 h-3 mr-1" />
                        Re-scan
                      </Button>
                      <Button variant="outline" size="sm">
                        <FileText className="w-3 h-3 mr-1" />
                        View Report
                      </Button>
                      {check.status === 'requires_review' && (
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Review
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Content Moderation AI Tab */}
        <TabsContent value="moderation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ban className="w-5 h-5 text-orange-500" />
                Content Moderation AI
              </CardTitle>
              <CardDescription>
                Automatic detection of prohibited content, trademark violations, and policy breaches
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockModerationResults.map((result) => (
                  <div key={result.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{result.productName}</h4>
                        <p className="text-sm text-gray-600 capitalize">
                          {result.contentType} Content • Confidence: {result.confidence}%
                        </p>
                      </div>
                      {getStatusBadge(result.status)}
                    </div>

                    {result.flaggedFor.length > 0 && (
                      <div className="mb-3">
                        <p className="text-sm font-medium mb-2">Flagged For:</p>
                        <div className="flex flex-wrap gap-2">
                          {result.flaggedFor.map((flag, index) => (
                            <Badge key={index} variant="outline" className="bg-red-50 text-red-700">
                              {flag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-gray-600">Content Type</p>
                        <p className="text-sm font-medium capitalize">{result.contentType}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Action Taken</p>
                        <p className="text-sm font-medium capitalize">{result.action.replace('_', ' ')}</p>
                      </div>
                      {result.reviewedBy && (
                        <div>
                          <p className="text-xs text-gray-600">Reviewed By</p>
                          <p className="text-sm font-medium">{result.reviewedBy}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-xs text-gray-600">Confidence</p>
                        <div className="flex items-center gap-2">
                          <Progress value={result.confidence} className="h-2 flex-1" />
                          <span className="text-sm font-medium">{result.confidence}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-3 h-3 mr-1" />
                        Review Content
                      </Button>
                      {result.status === 'flagged' && (
                        <>
                          <Button variant="outline" size="sm">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Approve
                          </Button>
                          <Button variant="destructive" size="sm">
                            <XCircle className="w-3 h-3 mr-1" />
                            Block
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Audit Trail Tab */}
        <TabsContent value="audit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="w-5 h-5 text-purple-500" />
                Enhanced Audit Trail
              </CardTitle>
              <CardDescription>
                Detailed logging of all system changes with user attribution and rollback capabilities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockAuditLogs.map((log) => (
                  <div key={log.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{log.action}</h4>
                        <p className="text-sm text-gray-600">
                          By {log.userName} • {new Date(log.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="capitalize">
                          {log.resourceType}
                        </Badge>
                        {log.rollbackAvailable && (
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                            Rollback Available
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="mb-3">
                      <p className="text-sm font-medium mb-2">Changes:</p>
                      <div className="space-y-2">
                        {log.changes.map((change, index) => (
                          <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded p-2 text-sm">
                            <span className="font-medium">{change.field}:</span>
                            <span className="text-red-600 mx-2">{JSON.stringify(change.oldValue)}</span>
                            →
                            <span className="text-green-600 mx-2">{JSON.stringify(change.newValue)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-3 text-sm">
                      <div>
                        <span className="text-gray-600">IP Address: </span>
                        <span className="font-medium">{log.ipAddress}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Resource ID: </span>
                        <span className="font-medium">{log.resourceId}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">User Agent: </span>
                        <span className="font-medium text-xs">{log.userAgent.substring(0, 30)}...</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-3 h-3 mr-1" />
                        View Details
                      </Button>
                      {log.rollbackAvailable && (
                        <Button variant="outline" size="sm">
                          <RefreshCw className="w-3 h-3 mr-1" />
                          Rollback Changes
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        <Download className="w-3 h-3 mr-1" />
                        Export
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Enterprise SSO Tab */}
        <TabsContent value="sso" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-blue-500" />
                Enterprise SSO Integration
              </CardTitle>
              <CardDescription>
                SAML, OAuth2, and Active Directory integration for enterprise authentication
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockSSOProviders.map((provider) => (
                  <div key={provider.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Key className="w-5 h-5 text-blue-500" />
                        <div>
                          <h4 className="font-medium">{provider.name}</h4>
                          <p className="text-sm text-gray-600">{provider.type} Integration</p>
                        </div>
                      </div>
                      {getStatusBadge(provider.status)}
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-gray-600">Active Users</p>
                        <p className="text-sm font-medium">{provider.users}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Provider Type</p>
                        <p className="text-sm font-medium">{provider.type}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Last Sync</p>
                        <p className="text-sm font-medium">
                          {new Date(provider.lastSync).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Configuration</p>
                        <p className="text-sm font-medium">
                          {provider.configuration.domain || provider.configuration.clientId || 'Configured'}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Settings className="w-3 h-3 mr-1" />
                        Configure
                      </Button>
                      <Button variant="outline" size="sm">
                        <RefreshCw className="w-3 h-3 mr-1" />
                        Sync Users
                      </Button>
                      <Button variant="outline" size="sm">
                        <BarChart3 className="w-3 h-3 mr-1" />
                        Analytics
                      </Button>
                      {provider.status === 'inactive' && (
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Activate
                        </Button>
                      )}
                    </div>
                  </div>
                ))}

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Key className="w-8 h-8 mx-auto mb-3 text-gray-400" />
                  <h3 className="font-medium mb-2">Add New SSO Provider</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Connect additional identity providers for seamless user authentication
                  </p>
                  <Button>
                    <UserCheck className="w-4 h-4 mr-2" />
                    Add SSO Provider
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}