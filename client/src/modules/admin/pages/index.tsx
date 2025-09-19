import AdminSidebar from '../components/AdminSidebar';
import { Link } from 'wouter';

export default function AdminDashboard() {
  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border rounded-lg bg-white">
            <h2 className="font-semibold mb-2">Vendor Applications</h2>
            <p className="text-sm text-gray-600 mb-3">Review and approve vendor applications submitted by users.</p>
            <Link href="/admin/vendors" className="text-blue-600 underline">Go to Vendors</Link>
          </div>
        </div>
      </main>
    </div>
  );
}