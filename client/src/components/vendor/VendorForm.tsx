import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Store, User, Mail, FileText, Building, Upload, Phone, MapPin, Globe, IdCard } from 'lucide-react';

interface VendorFormData {
  businessName: string;
  businessType: string;
  businessDescription: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  taxId: string;
  website?: string;
  businessRegistration?: File;
}

const vendorFormSchema = z.object({
  businessName: z.string().min(2, 'Business name must be at least 2 characters'),
  businessType: z.enum(['individual', 'company', 'partnership', 'llc', 'corporation']),
  businessDescription: z.string().min(10, 'Business description must be at least 10 characters'),
  contactName: z.string().min(2, 'Contact name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(5, 'Please enter a valid phone number'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  city: z.string().min(2, 'City must be at least 2 characters'),
  state: z.string().min(2, 'State must be at least 2 characters'),
  zipCode: z.string().min(3, 'Zip code must be at least 3 characters'),
  country: z.string().min(2, 'Country must be at least 2 characters'),
  taxId: z.string().min(9, 'Tax ID must be at least 9 characters'),
  website: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
});

type VendorFormValues = z.infer<typeof vendorFormSchema>;

export default function VendorForm() {
  const { toast } = useToast();
  const [businessRegistration, setBusinessRegistration] = useState<File | null>(null);

  const form = useForm<VendorFormValues>({
    resolver: zodResolver(vendorFormSchema),
    defaultValues: {
      businessName: '',
      businessType: 'individual',
      businessDescription: '',
      contactName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      taxId: '',
      website: '',
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: VendorFormData) => {
      return await apiRequest('POST', '/api/vendor/apply', {
        businessName: data.businessName,
        businessType: data.businessType,
        businessDescription: data.businessDescription,
        contactName: data.contactName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        country: data.country,
        taxId: data.taxId,
        website: data.website || null,
      });
    },
    onSuccess: () => {
      toast({
        title: 'Registration Submitted',
        description: 'Your vendor application has been submitted successfully. We will review it and get back to you soon.',
      });
      form.reset();
      setBusinessRegistration(null);
    },
    onError: (error) => {
      toast({
        title: 'Registration Failed',
        description: error.message || 'There was an error submitting your application. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: VendorFormValues) => {
    registerMutation.mutate({
      ...data,
      businessRegistration: businessRegistration || undefined,
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setBusinessRegistration(file);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-blue-100 rounded-full">
            <Store className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <CardTitle className="text-2xl">Become a Vendor</CardTitle>
        <CardDescription>
          Join our marketplace and start selling your products to thousands of customers
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Business Name */}
          <div className="space-y-2">
            <Label htmlFor="businessName">Business Name</Label>
            <div className="relative">
              <Building className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                id="businessName"
                placeholder="Enter your business name"
                className="pl-10"
                {...form.register('businessName')}
              />
            </div>
            {form.formState.errors.businessName && (
              <p className="text-sm text-red-600">{form.formState.errors.businessName.message}</p>
            )}
          </div>

          {/* Business Type */}
          <div className="space-y-2">
            <Label htmlFor="businessType">Business Type</Label>
            <Select
              value={form.watch('businessType')}
              onValueChange={(value) => form.setValue('businessType', value as any)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="individual">Individual/Sole Proprietor</SelectItem>
                <SelectItem value="company">Company</SelectItem>
                <SelectItem value="partnership">Partnership</SelectItem>
                <SelectItem value="llc">LLC</SelectItem>
                <SelectItem value="corporation">Corporation</SelectItem>
              </SelectContent>
            </Select>
            {form.formState.errors.businessType && (
              <p className="text-sm text-red-600">{form.formState.errors.businessType.message}</p>
            )}
          </div>

          {/* Contact Name */}
          <div className="space-y-2">
            <Label htmlFor="contactName">Contact Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                id="contactName"
                placeholder="Enter contact person's name"
                className="pl-10"
                {...form.register('contactName')}
              />
            </div>
            {form.formState.errors.contactName && (
              <p className="text-sm text-red-600">{form.formState.errors.contactName.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                className="pl-10"
                {...form.register('email')}
              />
            </div>
            {form.formState.errors.email && (
              <p className="text-sm text-red-600">{form.formState.errors.email.message}</p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                id="phone"
                type="tel"
                placeholder="Enter your phone number"
                className="pl-10"
                {...form.register('phone')}
              />
            </div>
            {form.formState.errors.phone && (
              <p className="text-sm text-red-600">{form.formState.errors.phone.message}</p>
            )}
          </div>

          {/* Tax ID */}
          <div className="space-y-2">
            <Label htmlFor="taxId">Tax ID</Label>
            <div className="relative">
              <IdCard className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                id="taxId"
                placeholder="Enter your tax identification number"
                className="pl-10"
                {...form.register('taxId')}
              />
            </div>
            {form.formState.errors.taxId && (
              <p className="text-sm text-red-600">{form.formState.errors.taxId.message}</p>
            )}
          </div>

          {/* Business Description */}
          <div className="space-y-2">
            <Label htmlFor="businessDescription">Business Description</Label>
            <Textarea
              id="businessDescription"
              placeholder="Describe your business and what you sell"
              rows={4}
              {...form.register('businessDescription')}
            />
            {form.formState.errors.businessDescription && (
              <p className="text-sm text-red-600">{form.formState.errors.businessDescription.message}</p>
            )}
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                id="address"
                placeholder="Enter your business address"
                className="pl-10"
                {...form.register('address')}
              />
            </div>
            {form.formState.errors.address && (
              <p className="text-sm text-red-600">{form.formState.errors.address.message}</p>
            )}
          </div>

          {/* City, State, Zip Code, Country */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                placeholder="City"
                {...form.register('city')}
              />
              {form.formState.errors.city && (
                <p className="text-sm text-red-600">{form.formState.errors.city.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                placeholder="State"
                {...form.register('state')}
              />
              {form.formState.errors.state && (
                <p className="text-sm text-red-600">{form.formState.errors.state.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="zipCode">Zip Code</Label>
              <Input
                id="zipCode"
                placeholder="Zip Code"
                {...form.register('zipCode')}
              />
              {form.formState.errors.zipCode && (
                <p className="text-sm text-red-600">{form.formState.errors.zipCode.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                placeholder="Country"
                {...form.register('country')}
              />
              {form.formState.errors.country && (
                <p className="text-sm text-red-600">{form.formState.errors.country.message}</p>
              )}
            </div>
          </div>

          {/* Website */}
          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <div className="relative">
              <Globe className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                id="website"
                type="url"
                placeholder="https://yourwebsite.com"
                className="pl-10"
                {...form.register('website')}
              />
            </div>
            {form.formState.errors.website && (
              <p className="text-sm text-red-600">{form.formState.errors.website.message}</p>
            )}
          </div>

          {/* Business Registration (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="businessRegistration">
              Business Registration Document
              <span className="text-sm text-gray-500 ml-1">(Optional)</span>
            </Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <input
                id="businessRegistration"
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="businessRegistration"
                className="cursor-pointer flex flex-col items-center gap-2"
              >
                <Upload className="w-8 h-8 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {businessRegistration ? businessRegistration.name : 'Click to upload or drag and drop'}
                </span>
                <span className="text-xs text-gray-500">
                  PDF, DOC, DOCX, JPG, PNG up to 10MB
                </span>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={registerMutation.isPending}
          >
            {registerMutation.isPending ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Submitting Application...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Submit Application
              </div>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}