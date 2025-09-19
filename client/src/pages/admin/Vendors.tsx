import AdminSidebar from '@/modules/admin/components/AdminSidebar';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getQueryFn, apiRequest } from '@/lib/queryClient';

export default function AdminVendorsPage() {
  const { data: applications, refetch, isLoading } = useQuery({
    queryKey: ['/api/vendor/applications'],
    queryFn: getQueryFn<{ id: number; name: string; email: string; storeName: string; status: string; createdAt: string; }[]>({ on401: 'throw' })
  });

  const approveMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest('POST', `/api/vendor/applications/${id}/approve`);
      return await res.json();
    },
    onSuccess: () => refetch(),
  });

  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Vendor Applications</h1>
        {isLoading && <p>Loading...</p>}
        <div className="bg-white rounded-lg border">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left p-3">ID</th>
                <th className="text-left p-3">Name</th>
                <th className="text-left p-3">Email</th>
                <th className="text-left p-3">Store</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(applications || []).map((a) => (
                <tr key={a.id} className="border-t">
                  <td className="p-3">{a.id}</td>
                  <td className="p-3">{a.name}</td>
                  <td className="p-3">{a.email}</td>
                  <td className="p-3">{a.storeName}</td>
                  <td className="p-3 capitalize">{a.status}</td>
                  <td className="p-3">
                    {a.status !== 'approved' && (
                      <button
                        className="px-3 py-1 bg-green-600 text-white rounded"
                        disabled={approveMutation.isPending}
                        onClick={() => approveMutation.mutate(a.id)}
                      >
                        {approveMutation.isPending ? 'Approving...' : 'Approve'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}


