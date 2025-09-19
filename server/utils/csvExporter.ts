// CSV Export utility for Product Management
export function generateProductsCSV(products: any[]): string {
  if (!products || products.length === 0) {
    return 'No products to export';
  }

  // CSV headers
  const headers = [
    'ID',
    'Name', 
    'Category',
    'Price',
    'Regular Price',
    'Sale Price',
    'Stock Status',
    'Stock Quantity',
    'Rating',
    'Type',
    'Status',
    'Source Platform',
    'External URL',
    'Short Description',
    'Tags',
    'Created At',
    'Updated At'
  ];

  // Convert products to CSV rows
  const csvRows = [
    headers.join(','), // Header row
    ...products.map(product => [
      escapeCSV(product.id || ''),
      escapeCSV(product.name || ''),
      escapeCSV(product.category || ''),
      escapeCSV(product.price || ''),
      escapeCSV(product.regularPrice || ''),
      escapeCSV(product.salePrice || ''),
      escapeCSV(product.stockStatus || ''),
      escapeCSV(product.stockQuantity || ''),
      escapeCSV(product.rating || ''),
      escapeCSV(product.type || ''),
      escapeCSV(product.approvalStatus || product.status || ''),
      escapeCSV(product.sourcePlatform || ''),
      escapeCSV(product.externalUrl || ''),
      escapeCSV(product.shortDescription || ''),
      escapeCSV((product.tags || []).join('; ') || ''),
      escapeCSV(product.createdAt || ''),
      escapeCSV(product.updatedAt || '')
    ].join(','))
  ];

  return csvRows.join('\n');
}

// Escape CSV field values
function escapeCSV(value: string | number): string {
  if (value === null || value === undefined) {
    return '';
  }
  
  const stringValue = String(value);
  
  // If the value contains comma, quote, or newline, wrap in quotes and escape quotes
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  
  return stringValue;
}