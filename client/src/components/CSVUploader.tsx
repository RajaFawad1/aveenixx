import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
// Table component simplified for CSV preview
const Table = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`w-full overflow-auto ${className}`}>
    <table className="w-full caption-bottom text-sm">{children}</table>
  </div>
);

const TableHeader = ({ children }: { children: React.ReactNode }) => (
  <thead className="[&_tr]:border-b">{children}</thead>
);

const TableBody = ({ children }: { children: React.ReactNode }) => (
  <tbody className="[&_tr:last-child]:border-0">{children}</tbody>
);

const TableRow = ({ children }: { children: React.ReactNode }) => (
  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">{children}</tr>
);

const TableHead = ({ children }: { children: React.ReactNode }) => (
  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">{children}</th>
);

const TableCell = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <td className={`p-4 align-middle [&:has([role=checkbox])]:pr-0 ${className}`}>{children}</td>
);
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, CheckCircle, AlertCircle, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CSVField {
  name: string;
  type: 'text' | 'number' | 'url' | 'category';
  required: boolean;
  sample?: string;
}

interface CSVMapping {
  [key: string]: string; // maps CSV column to product field
}

interface CSVUploadState {
  file: File | null;
  headers: string[];
  preview: any[];
  mapping: CSVMapping;
  validation: {
    valid: boolean;
    errors: string[];
    warnings: string[];
  };
  uploadProgress: number;
  processing: boolean;
}

const REQUIRED_FIELDS: CSVField[] = [
  { name: 'name', type: 'text', required: true },
  { name: 'price', type: 'number', required: true },
  { name: 'description', type: 'text', required: false },
  { name: 'category', type: 'category', required: false },
  { name: 'image_url', type: 'url', required: false },
  { name: 'stock', type: 'number', required: false },
  { name: 'sku', type: 'text', required: false },
  { name: 'weight', type: 'number', required: false }
];

export function CSVUploader({ onUploadComplete }: { onUploadComplete?: (products: any[]) => void }) {
  const { toast } = useToast();
  const [state, setState] = useState<CSVUploadState>({
    file: null,
    headers: [],
    preview: [],
    mapping: {},
    validation: { valid: false, errors: [], warnings: [] },
    uploadProgress: 0,
    processing: false
  });

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.csv')) {
      toast({
        title: 'Invalid file type',
        description: 'Please select a CSV file',
        variant: 'destructive'
      });
      return;
    }

    setState(prev => ({ ...prev, file, processing: true }));

    try {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
      
      // Parse first 5 rows for preview
      const preview = lines.slice(1, 6).map(line => {
        const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
        const row: any = {};
        headers.forEach((header, index) => {
          row[header] = values[index] || '';
        });
        return row;
      });

      // Auto-suggest mapping based on common field names
      const autoMapping: CSVMapping = {};
      REQUIRED_FIELDS.forEach(field => {
        const matchingHeader = headers.find(header => 
          header.toLowerCase().includes(field.name.toLowerCase()) ||
          field.name.toLowerCase().includes(header.toLowerCase())
        );
        if (matchingHeader) {
          autoMapping[field.name] = matchingHeader;
        }
      });

      setState(prev => ({
        ...prev,
        headers,
        preview,
        mapping: autoMapping,
        processing: false
      }));

      validateMapping(autoMapping, headers, preview);

    } catch (error) {
      toast({
        title: 'Error reading file',
        description: 'Could not parse the CSV file. Please check the format.',
        variant: 'destructive'
      });
      setState(prev => ({ ...prev, processing: false }));
    }
  };

  const validateMapping = (mapping: CSVMapping, headers: string[], preview: any[]) => {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check required fields
    REQUIRED_FIELDS.filter(f => f.required).forEach(field => {
      if (!mapping[field.name]) {
        errors.push(`Required field "${field.name}" is not mapped`);
      }
    });

    // Validate data types in preview
    Object.entries(mapping).forEach(([field, csvColumn]) => {
      const fieldDef = REQUIRED_FIELDS.find(f => f.name === field);
      if (!fieldDef) return;

      preview.forEach((row, index) => {
        const value = row[csvColumn];
        if (!value) return;

        if (fieldDef.type === 'number' && isNaN(Number(value))) {
          errors.push(`Row ${index + 2}: "${field}" should be a number but got "${value}"`);
        }
        if (fieldDef.type === 'url' && value && !value.match(/^https?:\/\/.+/)) {
          warnings.push(`Row ${index + 2}: "${field}" may not be a valid URL: "${value}"`);
        }
      });
    });

    // Check for missing mappings
    if (Object.keys(mapping).length === 0) {
      errors.push('No field mappings configured');
    }

    setState(prev => ({
      ...prev,
      validation: {
        valid: errors.length === 0,
        errors,
        warnings
      }
    }));
  };

  const updateMapping = (fieldName: string, csvColumn: string) => {
    const newMapping = { ...state.mapping, [fieldName]: csvColumn };
    setState(prev => ({ ...prev, mapping: newMapping }));
    validateMapping(newMapping, state.headers, state.preview);
  };

  const processUpload = async () => {
    if (!state.file || !state.validation.valid) return;

    setState(prev => ({ ...prev, processing: true, uploadProgress: 0 }));

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setState(prev => ({
          ...prev,
          uploadProgress: Math.min(prev.uploadProgress + 10, 90)
        }));
      }, 200);

      const formData = new FormData();
      formData.append('file', state.file);
      formData.append('mapping', JSON.stringify(state.mapping));

      const response = await fetch('/api/csv/import', {
        method: 'POST',
        body: formData
      });

      clearInterval(progressInterval);
      setState(prev => ({ ...prev, uploadProgress: 100 }));

      const result = await response.json();

      if (response.ok) {
        toast({
          title: 'Upload successful',
          description: `Imported ${result.count} products from CSV`
        });
        onUploadComplete?.(result.products);
        
        // Reset form
        setState({
          file: null,
          headers: [],
          preview: [],
          mapping: {},
          validation: { valid: false, errors: [], warnings: [] },
          uploadProgress: 0,
          processing: false
        });
      } else {
        throw new Error(result.error || 'Upload failed');
      }

    } catch (error) {
      toast({
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: 'destructive'
      });
      setState(prev => ({ ...prev, processing: false, uploadProgress: 0 }));
    }
  };

  const removeFile = () => {
    setState({
      file: null,
      headers: [],
      preview: [],
      mapping: {},
      validation: { valid: false, errors: [], warnings: [] },
      uploadProgress: 0,
      processing: false
    });
  };

  return (
    <div className="space-y-6">
      {/* File Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            CSV File Upload
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!state.file ? (
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
              <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Upload CSV File</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Drag and drop your CSV file here, or click to browse
                </p>
                <Input
                  type="file"
                  accept=".csv"
                  onChange={handleFileSelect}
                  className="max-w-xs mx-auto"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8 text-blue-500" />
                  <div>
                    <p className="font-medium">{state.file.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {(state.file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={removeFile}>
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {state.processing && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Processing file...</span>
                    <span>{state.uploadProgress}%</span>
                  </div>
                  <Progress value={state.uploadProgress} />
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Field Mapping */}
      {state.headers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Field Mapping</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {REQUIRED_FIELDS.map(field => (
                <div key={field.name} className="space-y-2">
                  <Label className="flex items-center gap-2">
                    {field.name}
                    {field.required && <Badge variant="destructive" className="text-xs">Required</Badge>}
                  </Label>
                  <Select
                    value={state.mapping[field.name] || ''}
                    onValueChange={(value) => updateMapping(field.name, value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select CSV column" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">-- Not mapped --</SelectItem>
                      {state.headers.map(header => (
                        <SelectItem key={header} value={header}>{header}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Preview Data */}
      {state.preview.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Data Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {state.headers.map(header => (
                      <TableHead key={header}>{header}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {state.preview.map((row, index) => (
                    <TableRow key={index}>
                      {state.headers.map(header => (
                        <TableCell key={header} className="max-w-32 truncate">
                          {row[header]}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Validation Results */}
      {(state.validation.errors.length > 0 || state.validation.warnings.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle>Validation Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {state.validation.errors.map((error, index) => (
                <div key={index} className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">{error}</span>
                </div>
              ))}
              {state.validation.warnings.map((warning, index) => (
                <div key={index} className="flex items-center gap-2 text-yellow-600">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">{warning}</span>
                </div>
              ))}
              {state.validation.valid && (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm">File is ready for import</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload Button */}
      {state.file && (
        <div className="flex justify-end">
          <Button
            onClick={processUpload}
            disabled={!state.validation.valid || state.processing}
            className="gap-2"
          >
            <Upload className="w-4 h-4" />
            {state.processing ? 'Processing...' : 'Import Products'}
          </Button>
        </div>
      )}
    </div>
  );
}