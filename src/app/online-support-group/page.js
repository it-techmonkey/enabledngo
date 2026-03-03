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
          dangerouslySetInnerHTML={{ __html: `<div class="min-h-screen flex flex-col"><div class="flex-1 py-12 px-4 sm:px-6 lg:px-8"><div class="max-w-6xl mx-auto"><div class="text-center mb-12" ><h1 class="text-4xl font-bold text-gray-800 mb-6">Online Support Group</h1><p class="text-lg text-gray-600 max-w-3xl mx-auto">TemanBercerita: Grief Support Sessions provide personalized and compassionate support through a structured three-part program designed to help participants navigate grief in a safe and empowering environment.</p></div><div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12" ><div class="bg-white rounded-lg shadow-lg p-6"><div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4"><svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg></div><h2 class="text-xl font-semibold text-gray-800 mb-4 text-center">1. Guided Learning Materials</h2><p class="text-gray-600 text-center">Each session begins with structured learning content carefully prepared and delivered by certified psychological counselors. These materials help participants understand the grieving process—what grief is, how it manifests emotionally and physically, and healthy ways to process and express it.</p></div><div class="bg-white rounded-lg shadow-lg p-6"><div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"><svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg></div><h2 class="text-xl font-semibold text-gray-800 mb-4 text-center">2. Intimate Story-sharing Circle</h2><p class="text-gray-600 text-center">Limited to maximum 3 participants per session, this safe space encourages individuals to share their stories, memories, and struggles. The small group size ensures everyone feels seen, heard, and respected while building solidarity.</p></div><div class="bg-white rounded-lg shadow-lg p-6"><div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4"><svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg></div><h2 class="text-xl font-semibold text-gray-800 mb-4 text-center">3. Grief Journal</h2><p class="text-gray-600 text-center">Each participant receives a thoughtfully designed grief journal with prompts tailored to different stages of grief, spaces for free writing, and exercises for grounding and mindfulness.</p></div></div><div class="mb-12" ><h2 class="text-2xl font-semibold text-gray-800 mb-6 text-center">Participant Reviews</h2><div class="grid grid-cols-1 md:grid-cols-2 gap-6"><div class="bg-white rounded-lg shadow-lg p-6"><div class="flex justify-center"><iframe src="https://www.instagram.com/p/C7yHrW4SSl2/embed" width="320" height="440" frameborder="0" scrolling="no" class="rounded-lg"></iframe></div></div><div class="bg-white rounded-lg shadow-lg p-6"><div class="flex justify-center"><iframe src="https://www.instagram.com/p/CZ1elY2v8YA/embed" width="320" height="440" frameborder="0" scrolling="no" class="rounded-lg"></iframe></div></div></div></div><div class="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8" ><h2 class="text-2xl font-semibold text-gray-800 mb-6 text-center">Join Our Support Group</h2><div class="grid grid-cols-1 md:grid-cols-2 gap-8"><div><h3 class="text-lg font-semibold text-gray-800 mb-4">What to Expect</h3><ul class="space-y-3 text-gray-600"><li class="flex items-start"><svg class="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>Professional guidance from certified counselors</li><li class="flex items-start"><svg class="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>A safe, intimate group setting with a maximum of 3 participants to ensure personalized attention</li><li class="flex items-start"><svg class="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>Personalized grief journal for ongoing support</li><li class="flex items-start"><svg class="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>Evidence-based psychological approaches</li></ul></div><div><h3 class="text-lg font-semibold text-gray-800 mb-4">Contact Us</h3><p class="text-gray-600 mb-4">Ready to begin your healing journey? Contact us to learn more about upcoming sessions and how to register.</p><a href="https://wa.me/628778462966" target="_blank" rel="noopener noreferrer" class="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold">Get Started Today</a></div></div></div></div></div></div>` }}
        />
        <Footer />
      </div>
    </div>
  );
}
