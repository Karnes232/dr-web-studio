'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { getStripe } from '@/lib/stripe-client';
import { 
  CheckCircle, 
  ArrowRight, 
  Download, 
  Mail, 
  Calendar,
  Home,
  CreditCard,
  User,
  DollarSign
} from 'lucide-react';

export default function PaymentSuccess() {
  const [message, setMessage] = useState<string>('Payment successful!');
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      const paymentIntentId = searchParams.get('payment_intent');
      const paymentIntentClientSecret = searchParams.get('payment_intent_client_secret');
      
      if (paymentIntentId) {
        try {
          // Option 1: Fetch from your API endpoint
          const response = await fetch(`/api/payment-details/${paymentIntentId}`);
          const data = await response.json();
          
          if (data.success) {
            setPaymentDetails(data.paymentIntent);
            setMessage(`Payment of $${(data.paymentIntent.amount / 100).toFixed(2)} completed successfully!`);
          }
        } catch (error) {
          console.error('Error fetching payment details:', error);
          
          // Option 2: Fallback - retrieve from Stripe client-side
          if (paymentIntentClientSecret) {
            const stripe = await getStripe();
            if (stripe) {
              const { paymentIntent } = await stripe.retrievePaymentIntent(paymentIntentClientSecret);
              
              if (paymentIntent) {
                setPaymentDetails(paymentIntent);
                setMessage(`Payment of $${(paymentIntent.amount / 100).toFixed(2)} completed successfully!`);
              }
            }
          }
        }
      }
    };

    fetchPaymentDetails();
  }, [searchParams]);

  const handleContinue = () => {
    window.location.href = '/';
  };

  const handleDownloadReceipt = () => {
    // Implement receipt download functionality
    console.log('Download receipt');
  };

  const handleScheduleCall = () => {
    // Redirect to calendar scheduling
    window.location.href = '#calendar';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-orange-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        
        {/* Success Animation Container */}
        <div className="text-center mb-8">
          <div className="relative">
            {/* Animated Success Icon */}
            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-r from-teal-400 to-teal-600 mb-4 shadow-lg animate-pulse">
              <CheckCircle className="h-12 w-12 text-white animate-bounce" />
            </div>
            
            {/* Confetti-like decoration */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-ping" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-teal-400 rounded-full animate-ping" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Payment Successful!
          </h1>
          <p className="text-slate-600 text-lg">
            Thank you for your payment. Your transaction has been completed successfully.
          </p>
        </div>

        {/* Main Success Card */}
        <div className="bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden mb-6">
          
          {/* Payment Details Section */}
          <div className="p-8">
            <div className="bg-gradient-to-r from-teal-50 to-teal-100 rounded-lg p-6 mb-6">
              <div className="flex items-center mb-4">
                <CreditCard className="h-6 w-6 text-teal-600 mr-3" />
                <h2 className="text-lg font-semibold text-teal-800">Payment Details</h2>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Transaction ID:</span>
                  <span className="font-mono text-sm text-slate-800">#TXN-{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Amount:</span>
                  <span className="font-semibold text-slate-800 flex items-center">
                    <DollarSign className="h-4 w-4 mr-1" />
                    {paymentDetails?.amount ? `${(paymentDetails.amount / 100).toFixed(2)}` : 'Loading...'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Date:</span>
                  <span className="text-slate-800">{new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Status:</span>
                  <span className="flex items-center text-teal-600">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Completed
                  </span>
                </div>
              </div>
            </div>

            {/* Success Message */}
            <div className="text-center mb-6">
              <div className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-4 py-3 rounded-lg inline-block">
                <p className="font-medium">{message}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              {/* Primary Action */}
              <button
                onClick={handleContinue}
                className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-orange-600 hover:to-yellow-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center"
              >
                <Home className="h-5 w-5 mr-2" />
                Back to Home
                <ArrowRight className="h-5 w-5 ml-2" />
              </button>

              {/* Secondary Actions */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleDownloadReceipt}
                  className="flex items-center justify-center py-3 px-4 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors duration-200 font-medium"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Receipt
                </button>
                
                <button
                  onClick={handleScheduleCall}
                  className="flex items-center justify-center py-3 px-4 bg-teal-100 text-teal-700 rounded-lg hover:bg-teal-200 transition-colors duration-200 font-medium"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Call
                </button>
              </div>
            </div>
          </div>

          {/* Next Steps Section */}
          <div className="bg-slate-50 px-8 py-6 border-t border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
              <Mail className="h-5 w-5 mr-2 text-orange-500" />
              What's Next?
            </h3>
            
            <div className="space-y-3 text-sm text-slate-600">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                  1
                </div>
                <p>You'll receive a confirmation email with your receipt and payment details within 5 minutes.</p>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 bg-teal-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                  2
                </div>
                <p>Our team will contact you within 24 hours to discuss your project requirements.</p>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                  3
                </div>
                <p>We'll schedule a consultation call to plan your website development project.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 text-center">
          <h3 className="text-lg font-semibold text-slate-800 mb-2">
            Need Help?
          </h3>
          <p className="text-slate-600 mb-4">
            Have questions about your payment or project? We're here to help!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="mailto:info@drwebstudio.com"
              className="flex items-center justify-center px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors duration-200 font-medium"
            >
              <Mail className="h-4 w-4 mr-2" />
              Email Us
            </a>
            
            <a
              href="https://wa.me/18091234567"
              className="flex items-center justify-center px-4 py-2 bg-teal-100 text-teal-700 rounded-lg hover:bg-teal-200 transition-colors duration-200 font-medium"
            >
              <User className="h-4 w-4 mr-2" />
              WhatsApp
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-slate-500">
          <p>
            Powered by{' '}
            <span className="font-semibold text-orange-600">DR Web Studio</span>
          </p>
          <p className="mt-1">
            Professional Website Development • Dominican Republic
          </p>
        </div>
      </div>
    </div>
  );
}