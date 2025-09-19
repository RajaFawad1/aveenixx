import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Upload, Package, DollarSign, Tag, Image, FileText } from 'lucide-react';
import VendorLayout from "@/components/vendor/VendorLayout";
import { useAuth } from "@/components/providers/AuthProvider";
import { useLocation } from "wouter";

export default function VendorProductUpload() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [form, setForm] = useState({
    name: "",
    sku: "",
    price: "",
    stock: "",
    category: "",
    image: "",
    description: "",
  });
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const testConnection = async () => {
    try {
      const response = await fetch('/api/test');
      const data = await response.json();
      console.log('Test connection response:', data);
      setMessage(`Server connection test: ${data.message}`);
    } catch (error) {
      console.error('Test connection error:', error);
      setMessage(`Connection test failed: ${error.message}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.category) {
      setMessage("Please fill out all required fields.");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      console.log('Submitting product data:', form);
      
      const response = await fetch('/api/vendor/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error:', errorText);
        try {
          const errorData = JSON.parse(errorText);
          setMessage(errorData.error || "Failed to upload product. Please try again.");
        } catch {
          setMessage(`Server error (${response.status}): ${errorText}`);
        }
        return;
      }

      const data = await response.json();
      console.log('Success response:', data);

      setMessage("Product uploaded successfully and is pending approval!");
      
      // Reset form after successful submission
      setForm({
        name: "",
        sku: "",
        price: "",
        stock: "",
        category: "",
        image: "",
        description: "",
      });

      // Redirect to products page after 2 seconds
      setTimeout(() => {
        setLocation('/vendor/products');
      }, 2000);
    } catch (error) {
      console.error('Error uploading product:', error);
      setMessage(`Network error: ${error.message}. Please check your connection and try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <VendorLayout>
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Upload className="w-8 h-8" />
          Upload New Product
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Add a new product to your store inventory
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Product Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  Product Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter product name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sku" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  SKU
                </Label>
                <Input
                  id="sku"
                  name="sku"
                  value={form.sku}
                  onChange={handleChange}
                  placeholder="Enter SKU"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price" className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Price
                </Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock" className="flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Stock Quantity
                </Label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  value={form.stock}
                  onChange={handleChange}
                  placeholder="Enter stock quantity"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Books">Books</option>
                  <option value="Home">Home</option>
                  <option value="Beauty">Beauty</option>
                  <option value="Sports">Sports</option>
                  <option value="Toys">Toys</option>
                  <option value="Automotive">Automotive</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image" className="flex items-center gap-2">
                  <Image className="w-4 h-4" />
                  Image URL
                </Label>
                <Input
                  id="image"
                  name="image"
                  type="url"
                  value={form.image}
                  onChange={handleChange}
                  placeholder="Enter image URL"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Enter product description"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

                <div className="flex justify-end space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={testConnection}
                  >
                    Test Connection
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setForm({
                        name: "",
                        sku: "",
                        price: "",
                        stock: "",
                        category: "",
                        image: "",
                        description: "",
                      });
                      setMessage("");
                    }}
                  >
                    Clear Form
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    <Upload className="w-4 h-4 mr-2" />
                    {isSubmitting ? "Uploading..." : "Submit Product"}
                  </Button>
                </div>
          </form>
          
          {message && (
            <div className={`mt-4 p-3 rounded-md ${
              message.includes("successfully") 
                ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" 
                : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
            }`}>
              {message}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
    </VendorLayout>
  );
}