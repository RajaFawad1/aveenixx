import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface WooCategory {
  id: number;
  name: string;
  slug: string;
  count?: number;
  parent?: number;
}

export default function WooCategoriesPanel() {
  const [categories, setCategories] = React.useState<WooCategory[]>([]);
  const [selected, setSelected] = React.useState<WooCategory | null>(null);
  const [products, setProducts] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/woocommerce/categories');
        if (!res.ok) return;
        const data = await res.json();
        setCategories(Array.isArray(data) ? data : []);
      } catch {}
    };
    load();
  }, []);

  const tree = React.useMemo(() => {
    const byParent: Record<number, WooCategory[]> = {};
    categories.forEach(c => {
      const pid = c.parent || 0;
      if (!byParent[pid]) byParent[pid] = [];
      byParent[pid].push(c);
    });
    return byParent;
  }, [categories]);

  const roots = tree[0] || [];

  const fetchProducts = async (cat: WooCategory) => {
    setSelected(cat);
    setLoading(true);
    try {
      const res = await fetch(`/api/woocommerce/products/by-category/${encodeURIComponent(cat.name)}`);
      const data = await res.json();
      setProducts(Array.isArray(data?.products) ? data.products : []);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle>WooCommerce Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-sm font-semibold mb-2">Main Categories</h3>
              <ul className="space-y-2">
                {roots.map(cat => (
                  <li key={cat.id}>
                    <button
                      className={`w-full text-left px-3 py-2 rounded-md text-sm ${selected?.id === cat.id ? 'bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                      onClick={() => fetchProducts(cat)}
                    >
                      {cat.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-2">Subcategories</h3>
              <ul className="space-y-2">
                {(selected ? (tree[selected.id] || []) : []).map(cat => (
                  <li key={cat.id}>
                    <button
                      className={`w-full text-left px-3 py-2 rounded-md text-sm ${selected?.id === cat.id ? 'bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                      onClick={() => fetchProducts(cat)}
                    >
                      {cat.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-2">Actions</h3>
              <div className="space-y-2 text-sm">
                <button
                  className="px-3 py-2 rounded-md bg-gray-900 text-white dark:bg-gray-700"
                  onClick={async () => {
                    await fetch('/api/woocommerce/categories/sync', { method: 'POST' });
                    alert('Categories synced to main store');
                  }}
                >
                  Sync to Main Store
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle>{selected ? `Products in ${selected.name}` : 'Select a category'}</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-sm text-gray-500">Loading products...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((p) => (
                <div key={p.id} className="p-3 rounded border border-gray-200 dark:border-gray-700">
                  <div className="font-semibold mb-1 truncate">{p.name}</div>
                  <div className="text-xs text-gray-500">{p.category}</div>
                </div>
              ))}
              {!products.length && (
                <div className="text-sm text-gray-500">No products to show.</div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


