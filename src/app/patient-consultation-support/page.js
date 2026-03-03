'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Page() {
  const router = useRouter();
  const mainRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      // Handle internal link navigation
      const link = e.target.closest('a[href]');
      if (link) {
        const href = link.getAttribute('href');
        if (href && href.startsWith('/')) {
          e.preventDefault();
          router.push(href);
          window.scrollTo(0, 0);
          return;
        }
      }
      // Handle button interactions
      const btn = e.target.closest('button');
      if (btn) {
        const text = btn.innerText?.trim();
        if (text === 'Be a Donor') {
          const card = btn.closest('.rounded-lg, .bg-white') || btn.closest('div');
          const name = card?.querySelector('h3, h2')?.innerText?.trim() || 'a child in need';
          const msg = encodeURIComponent(`Hi, I would like to be a donor and support ${name}. Please guide me through the process.`);
          window.open(`https://wa.me/6287784629666?text=${msg}`, '_blank', 'noopener,noreferrer');
        } else if (text === 'Add to Cart' || text === 'Add To Cart') {
          const card = btn.closest('.rounded-xl, .rounded-lg') || btn.closest('div');
          const title = card?.querySelector('h2, h3, [class*="font-bold"]')?.innerText?.trim() || 'item';
          alert(`"${title}" has been added to your cart!`);
        } else if (text === 'Get In Touch' || text === 'Contact Us') {
          window.open('https://wa.me/6287784629666', '_blank', 'noopener,noreferrer');
        }
      }
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      const form = e.target;
      const data = Object.fromEntries(new FormData(form).entries());
      console.log('Form submitted:', data);
      alert('Thank you! Your form has been submitted. We will get back to you on WhatsApp shortly.');
    };

    const el = mainRef.current;
    if (el) {
      el.addEventListener('click', handleClick);
      el.addEventListener('submit', handleSubmit);
    }
    return () => {
      if (el) {
        el.removeEventListener('click', handleClick);
        el.removeEventListener('submit', handleSubmit);
      }
    };
  }, [router]);

  return (
    <div className="font-sans">
      <div className="flex flex-col min-h-screen font-inter">
        <Navbar />
        <main
          ref={mainRef}
          className="flex-grow"
          dangerouslySetInnerHTML={{ __html: `<div class="min-h-screen flex flex-col"><div class="flex-1 py-12 px-4 sm:px-6 lg:px-8"><div class="max-w-6xl mx-auto"><div class="text-center mb-12" ><h1 class="text-4xl font-bold text-gray-800 mb-6">Patient Consultation Support</h1><p class="text-lg text-gray-600 max-w-4xl mx-auto">Our consultation support services provide personalized guidance and expert advice for families and caregivers of pediatric tracheostomy patients, ensuring the best possible care and outcomes.</p></div><div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12" ><div class="bg-white rounded-lg shadow-lg p-6"><h2 class="text-2xl font-semibold text-gray-800 mb-4">Our Consultation Services</h2><div class="space-y-4"><div class="flex items-start"><div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-1"><svg class="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg></div><div><h3 class="font-semibold text-gray-800">Family Guidance</h3><p class="text-gray-600 text-sm">Personalized support for families adjusting to tracheostomy care</p></div></div><div class="flex items-start"><div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-1"><svg class="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg></div><div><h3 class="font-semibold text-gray-800">Caregiver Training</h3><p class="text-gray-600 text-sm">Comprehensive training for caregivers on daily care routines</p></div></div><div class="flex items-start"><div class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3 mt-1"><svg class="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg></div><div><h3 class="font-semibold text-gray-800">Medical Coordination</h3><p class="text-gray-600 text-sm">Facilitation of communication between families and medical teams</p></div></div></div></div><div class="bg-white rounded-lg shadow-lg p-6"><h2 class="text-2xl font-semibold text-gray-800 mb-4">Consultation Process</h2><div class="space-y-4"><div class="flex items-center"><div class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3 font-semibold text-gray-700">1</div><p class="text-gray-600">Initial assessment and needs identification</p></div><div class="flex items-center"><div class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3 font-semibold text-gray-700">2</div><p class="text-gray-600">Personalized consultation planning</p></div><div class="flex items-center"><div class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3 font-semibold text-gray-700">3</div><p class="text-gray-600">Expert consultation and guidance</p></div><div class="flex items-center"><div class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3 font-semibold text-gray-700">4</div><p class="text-gray-600">Follow-up support and monitoring</p></div></div></div></div><div class="mb-12" ><h2 class="text-2xl font-semibold text-gray-800 mb-6 text-center"> Consultation Sessions</h2><div class="grid grid-cols-1 md:grid-cols-3 gap-6"><div class="bg-white rounded-lg shadow-lg p-6" ><h3 class="text-lg font-semibold text-gray-800 mb-4">Family Consultation Session</h3><p class="text-gray-600 mb-4">Personalized consultation sessions for families navigating tracheostomy care.</p><div class="flex justify-center"><div class="relative w-full max-w-sm"><iframe src="https://www.instagram.com/p/C-r5pNfS4jx/embed" width="320" height="440" frameborder="0" scrolling="no" class="rounded-lg w-full" title="Instagram post - Family Consultation Session"></iframe><div class="mt-2 text-center"><a href="https://www.instagram.com/p/C-r5pNfS4jx/" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 text-sm font-medium">View on Instagram →</a></div></div></div></div><div class="bg-white rounded-lg shadow-lg p-6" ><h3 class="text-lg font-semibold text-gray-800 mb-4">Caregiver Support Meeting</h3><p class="text-gray-600 mb-4">Support meetings for caregivers to share experiences and receive guidance.</p><div class="flex justify-center"><div class="relative w-full max-w-sm"><iframe src="https://www.instagram.com/p/C-4yAX5SVnV/embed" width="320" height="440" frameborder="0" scrolling="no" class="rounded-lg w-full" title="Instagram post - Caregiver Support Meeting"></iframe><div class="mt-2 text-center"><a href="https://www.instagram.com/p/C-4yAX5SVnV/" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 text-sm font-medium">View on Instagram →</a></div></div></div></div><div class="bg-white rounded-lg shadow-lg p-6" ><h3 class="text-lg font-semibold text-gray-800 mb-4">Medical Team Consultation</h3><p class="text-gray-600 mb-4">Collaborative consultations with medical professionals and families.</p><div class="flex justify-center"><div class="relative w-full max-w-sm"><iframe src="https://www.instagram.com/p/DANfG0ry_7K/embed" width="320" height="440" frameborder="0" scrolling="no" class="rounded-lg w-full" title="Instagram post - Medical Team Consultation"></iframe><div class="mt-2 text-center"><a href="https://www.instagram.com/p/DANfG0ry_7K/" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 text-sm font-medium">View on Instagram →</a></div></div></div></div></div></div><div class="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-8" ><h2 class="text-2xl font-semibold text-gray-800 mb-6 text-center">Book Your Consultation</h2><div class="grid grid-cols-1 md:grid-cols-2 gap-8"><div><h3 class="text-lg font-semibold text-gray-800 mb-4">Why Choose Our Consultations?</h3><ul class="space-y-3 text-gray-600"><li class="flex items-start"><svg class="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>Expert guidance from experienced professionals</li><li class="flex items-start"><svg class="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>Personalized care plans tailored to your needs</li><li class="flex items-start"><svg class="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>Ongoing support and follow-up care</li><li class="flex items-start"><svg class="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>Access to comprehensive resources and tools</li></ul></div><div><h3 class="text-lg font-semibold text-gray-800 mb-4">Get Started Today</h3><p class="text-gray-600 mb-4">Ready to receive personalized consultation support? Contact us to schedule your first session and begin your journey toward better care.</p><a href="https://wa.me/6287784629666" target="_blank" rel="noopener noreferrer" class="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200 font-semibold inline-block">Schedule Consultation</a></div></div></div></div></div></div>` }}
        />
        <Footer />
      </div>
    </div>
  );
}
