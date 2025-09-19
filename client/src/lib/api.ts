export async function getVendorProducts() {
  try {
    const response = await fetch('/api/vendor/products');

    if (!response.ok) {
      throw new Error('Failed to fetch vendor products');
    }

    const products = await response.json();
    
    // Transform the data to match the expected format
    return products.map((product: any) => ({
      id: product.id,
      name: product.name,
      price: parseFloat(product.price),
      image: product.imageUrl || 'https://via.placeholder.com/300x300?text=No+Image',
      category: product.category,
      description: product.description,
      sku: product.sku,
      stock: product.stockQuantity,
      approvalStatus: product.approvalStatus
    }));
  } catch (error) {
    console.error('Error fetching vendor products:', error);
    // Return empty array on error
    return [];
  }
}