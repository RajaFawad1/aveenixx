import { AdminDashboard } from '@/components/AdminDashboard';

export default function AdminHome() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            SuperAdmin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Comprehensive platform administration and monitoring
          </p>
        </div>
        
        <AdminDashboard />

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
            <h2 className="font-semibold mb-2 text-gray-900 dark:text-white">Vendor Applications</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Review and approve vendors.</p>
            <a href="/admin/vendors" className="text-blue-600 underline">Manage Vendors</a>
          </div>
        </div>
      </div>
    </div>
  );
}