'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function PremiumPage() {
  const [mounted, setMounted] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [plan, setPlan] = useState('lifetime'); // 'monthly' or 'lifetime'
  
  // Form fields
  const [email, setEmail] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvc, setCvc] = useState('');
  
  // Validation errors
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    setMounted(true);
    const premiumStatus = localStorage.getItem('isPremium') === 'true';
    setIsPremium(premiumStatus);
    if (premiumStatus) {
      setPaymentSuccess(true);
    }
  }, []);

  // Formatting helpers
  const handleCardNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    const formattedValue = value
      .substring(0, 16)
      .replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formattedValue);
    if (errors.cardNumber) {
      setErrors((prev) => ({ ...prev, cardNumber: null }));
    }
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.substring(0, 4);
    
    if (value.length > 2) {
      value = `${value.substring(0, 2)}/${value.substring(2)}`;
    }
    setExpiryDate(value);
    if (errors.expiryDate) {
      setErrors((prev) => ({ ...prev, expiryDate: null }));
    }
  };

  const handleCvcChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').substring(0, 4);
    setCvc(value);
    if (errors.cvc) {
      setErrors((prev) => ({ ...prev, cvc: null }));
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (errors.email) {
      setErrors((prev) => ({ ...prev, email: null }));
    }
  };

  const handleNameChange = (e) => {
    setCardholderName(e.target.value);
    if (errors.cardholderName) {
      setErrors((prev) => ({ ...prev, cardholderName: null }));
    }
  };

  // Validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!cardholderName.trim()) {
      newErrors.cardholderName = 'Cardholder name is required';
    }

    const rawCardNumber = cardNumber.replace(/\s/g, '');
    if (!rawCardNumber) {
      newErrors.cardNumber = 'Card number is required';
    } else if (rawCardNumber.length < 15 || rawCardNumber.length > 16) {
      newErrors.cardNumber = 'Card number must be 15 or 16 digits';
    }

    if (!expiryDate) {
      newErrors.expiryDate = 'Expiry date is required';
    } else if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
      newErrors.expiryDate = 'Format must be MM/YY';
    } else {
      const [month, year] = expiryDate.split('/').map(Number);
      if (month < 1 || month > 12) {
        newErrors.expiryDate = 'Invalid month (01-12)';
      }
    }

    if (!cvc) {
      newErrors.cvc = 'CVC is required';
    } else if (cvc.length < 3 || cvc.length > 4) {
      newErrors.cvc = 'CVC must be 3 or 4 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate network delay
    setTimeout(() => {
      setIsSubmitting(false);
      setPaymentSuccess(true);
      setIsPremium(true);
      
      // Persist in localStorage
      localStorage.setItem('isPremium', 'true');
      localStorage.setItem('premiumPlan', plan);
      
      // Dispatch custom event to notify other components instantly
      window.dispatchEvent(new Event('premium-change'));
    }, 1200);
  };

  const handleRefund = () => {
    localStorage.removeItem('isPremium');
    localStorage.removeItem('premiumPlan');
    setIsPremium(false);
    setPaymentSuccess(false);
    
    // Clear form
    setEmail('');
    setCardholderName('');
    setCardNumber('');
    setExpiryDate('');
    setCvc('');
    
    // Dispatch custom event to restore ads
    window.dispatchEvent(new Event('premium-change'));
  };

  if (!mounted) {
    return (
      <main className="mx-auto w-full max-w-lg flex-1 px-6 py-16 flex items-center justify-center">
        <div className="text-zinc-500 animate-pulse">Loading secure checkout...</div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12 flex flex-col items-center">
      {paymentSuccess ? (
        <section className="w-full max-w-md rounded-3xl border border-zinc-200 bg-white p-8 shadow-2xl text-center dark:border-zinc-800 dark:bg-zinc-950 transition-all duration-300">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
            <svg
              className="h-10 w-10 animate-bounce"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          
          <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white">
            ✅ Payment complete!
          </h1>
          <p className="mt-3 text-zinc-600 dark:text-zinc-400">
            Thank you for supporting TechCart. All ads have been permanently removed from your browsing experience.
          </p>

          <div className="my-6 rounded-2xl bg-zinc-50 p-4 text-left dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-900">
            <div className="flex justify-between items-center text-sm">
              <span className="text-zinc-500">Subscription Tier:</span>
              <span className="font-semibold capitalize text-indigo-600 dark:text-indigo-400">
                {localStorage.getItem('premiumPlan') || plan} Plan
              </span>
            </div>
            <div className="mt-2 flex justify-between items-center text-sm border-t border-zinc-200/50 pt-2 dark:border-zinc-800/50">
              <span className="text-zinc-500">Ad status:</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                Removed 🚫
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Link
              href="/"
              className="w-full rounded-2xl bg-zinc-900 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
            >
              Return to Shop
            </Link>
            
            <button
              onClick={handleRefund}
              className="w-full rounded-2xl border border-zinc-200 py-3.5 text-sm font-medium text-zinc-500 transition-colors hover:bg-zinc-50 hover:text-red-500 dark:border-zinc-800 dark:hover:bg-zinc-900/60 dark:hover:text-red-400"
            >
              Cancel Subscription & Restore Ads
            </button>
          </div>
        </section>
      ) : (
        <section className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Plan Selector & Info - Left Column */}
          <div className="md:col-span-5 space-y-6">
            <div>
              <h1 className="text-4xl font-black tracking-tight text-zinc-900 dark:text-white">
                Go Ad-Free
              </h1>
              <p className="mt-3 text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Tired of blinking sidebars and infinite scrolling marquees? Get TechCart Premium and clean up your interface forever.
              </p>
            </div>

            <div className="space-y-4">
              <label className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Select your plan</label>
              
              {/* Plan cards */}
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setPlan('monthly')}
                  className={`w-full p-4 rounded-2xl border-2 text-left transition-all ${
                    plan === 'monthly'
                      ? 'border-indigo-600 bg-indigo-50/30 dark:border-indigo-500 dark:bg-indigo-950/10'
                      : 'border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-zinc-900 dark:text-white">Monthly Ad-Free</span>
                    <span className="text-lg font-black text-indigo-600 dark:text-indigo-400">$4.99/mo</span>
                  </div>
                  <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                    Cancel anytime. Billed monthly.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setPlan('lifetime')}
                  className={`w-full p-4 rounded-2xl border-2 text-left transition-all relative overflow-hidden ${
                    plan === 'lifetime'
                      ? 'border-indigo-600 bg-indigo-50/30 dark:border-indigo-500 dark:bg-indigo-950/10'
                      : 'border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900'
                  }`}
                >
                  <div className="absolute right-0 top-0 bg-indigo-600 text-[10px] font-bold text-white px-3 py-1 rounded-bl-lg uppercase tracking-wider dark:bg-indigo-500">
                    Best Value
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-zinc-900 dark:text-white">Lifetime Pass</span>
                    <span className="text-lg font-black text-indigo-600 dark:text-indigo-400">$19.99</span>
                  </div>
                  <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                    Pay once, keep it forever. Best deal.
                  </p>
                </button>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100 text-sm text-zinc-500 dark:bg-zinc-900/30 dark:border-zinc-800/50">
              💡 **No real money processed.** Feel free to enter fake card details (e.g. `4111 1111 1111 1111`, any future expiry, and any CVC) to test the integration.
            </div>
          </div>

          {/* Secure Payment Form - Right Column */}
          <div className="md:col-span-7 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800/80 rounded-3xl p-6 md:p-8 shadow-xl">
            <h2 className="text-xl font-bold mb-6 text-zinc-900 dark:text-white flex items-center gap-2">
              <svg className="h-5 w-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
              Secure Checkout
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="you@example.com"
                  className={`w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 dark:bg-zinc-900 dark:text-white ${
                    errors.email
                      ? 'border-red-500 focus:ring-red-200 dark:focus:ring-red-950'
                      : 'border-zinc-200 focus:border-indigo-600 focus:ring-indigo-100 dark:border-zinc-800 dark:focus:border-indigo-500 dark:focus:ring-indigo-950/30'
                  }`}
                />
                {errors.email && <span className="text-xs text-red-500 font-medium">{errors.email}</span>}
              </div>

              {/* Cardholder Name */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="cardholderName" className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  Cardholder Name
                </label>
                <input
                  id="cardholderName"
                  type="text"
                  value={cardholderName}
                  onChange={handleNameChange}
                  placeholder="John Doe"
                  className={`w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 dark:bg-zinc-900 dark:text-white ${
                    errors.cardholderName
                      ? 'border-red-500 focus:ring-red-200 dark:focus:ring-red-950'
                      : 'border-zinc-200 focus:border-indigo-600 focus:ring-indigo-100 dark:border-zinc-800 dark:focus:border-indigo-500 dark:focus:ring-indigo-950/30'
                  }`}
                />
                {errors.cardholderName && (
                  <span className="text-xs text-red-500 font-medium">{errors.cardholderName}</span>
                )}
              </div>

              {/* Card Number */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="cardNumber" className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  Card Number
                </label>
                <div className="relative">
                  <input
                    id="cardNumber"
                    type="text"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    placeholder="4111 1111 1111 1111"
                    className={`w-full pl-4 pr-10 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 dark:bg-zinc-900 dark:text-white ${
                      errors.cardNumber
                        ? 'border-red-500 focus:ring-red-200 dark:focus:ring-red-950'
                        : 'border-zinc-200 focus:border-indigo-600 focus:ring-indigo-100 dark:border-zinc-800 dark:focus:border-indigo-500 dark:focus:ring-indigo-950/30'
                    }`}
                  />
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                    </svg>
                  </div>
                </div>
                {errors.cardNumber && <span className="text-xs text-red-500 font-medium">{errors.cardNumber}</span>}
              </div>

              {/* Expiry & CVC Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="expiryDate" className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                    Expiry Date
                  </label>
                  <input
                    id="expiryDate"
                    type="text"
                    value={expiryDate}
                    onChange={handleExpiryChange}
                    placeholder="MM/YY"
                    className={`w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 dark:bg-zinc-900 dark:text-white ${
                      errors.expiryDate
                        ? 'border-red-500 focus:ring-red-200 dark:focus:ring-red-950'
                        : 'border-zinc-200 focus:border-indigo-600 focus:ring-indigo-100 dark:border-zinc-800 dark:focus:border-indigo-500 dark:focus:ring-indigo-950/30'
                    }`}
                  />
                  {errors.expiryDate && (
                    <span className="text-xs text-red-500 font-medium">{errors.expiryDate}</span>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="cvc" className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                    CVC
                  </label>
                  <input
                    id="cvc"
                    type="text"
                    value={cvc}
                    onChange={handleCvcChange}
                    placeholder="123"
                    className={`w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 dark:bg-zinc-900 dark:text-white ${
                      errors.cvc
                        ? 'border-red-500 focus:ring-red-200 dark:focus:ring-red-950'
                        : 'border-zinc-200 focus:border-indigo-600 focus:ring-indigo-100 dark:border-zinc-800 dark:focus:border-indigo-500 dark:focus:ring-indigo-950/30'
                    }`}
                  />
                  {errors.cvc && <span className="text-xs text-red-500 font-medium">{errors.cvc}</span>}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-4 w-full flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 py-3.5 text-sm font-bold text-white transition-all hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processing payment...
                  </>
                ) : (
                  `Pay $${plan === 'monthly' ? '4.99' : '19.99'} & Remove Ads`
                )}
              </button>
            </form>
          </div>
        </section>
      )}
    </main>
  );
}
