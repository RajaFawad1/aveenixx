import VendorForm from '@/components/vendor/VendorForm';
import MainEcommerceLayout from '@/components/layout/MainEcommerceLayout';

export default function RegisterVendorPage() {
  return (
    <MainEcommerceLayout>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Start Selling on Aveenix
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of successful sellers and reach millions of customers worldwide. 
              Create your vendor account today and start growing your business.
            </p>
          </div>

          {/* Benefits Section */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Increase Your Sales</h3>
              <p className="text-gray-600">Reach millions of customers and boost your revenue with our marketplace platform.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Easy Setup</h3>
              <p className="text-gray-600">Get started in minutes with our simple registration process and user-friendly tools.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2v20M2 12h20" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Full Support</h3>
              <p className="text-gray-600">Get dedicated support, marketing tools, and analytics to grow your business.</p>
            </div>
          </div>

          {/* Vendor Form */}
          <VendorForm />

          {/* Additional Info Section */}
          <div className="mt-12 bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">What Happens Next?</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-bold text-lg">1</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Application Review</h4>
                <p className="text-sm text-gray-600">We'll review your application within 1-2 business days.</p>
              </div>
              
              <div className="text-center">
                <div className="bg-green-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-green-600 font-bold text-lg">2</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Account Setup</h4>
                <p className="text-sm text-gray-600">Once approved, you'll receive login credentials and setup instructions.</p>
              </div>
              
              <div className="text-center">
                <div className="bg-purple-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-purple-600 font-bold text-lg">3</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Start Selling</h4>
                <p className="text-sm text-gray-600">Add your products and start reaching customers immediately.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainEcommerceLayout>
  );
}