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
          dangerouslySetInnerHTML={{ __html: `<div class="min-h-screen flex flex-col"><div class="flex-1 py-12 px-4 sm:px-6 lg:px-8"><div class="max-w-6xl mx-auto"><div class="text-center mb-12" ><h1 class="text-4xl font-bold text-gray-800 mb-6">Online Webinar Sessions</h1><p class="text-lg text-gray-600 max-w-3xl mx-auto">Our comprehensive webinar series provides expert knowledge and practical guidance for families, caregivers, and healthcare professionals working with pediatric tracheostomy patients.</p></div><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12" ><div class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300" ><div class="aspect-video"><iframe src="https://www.youtube-nocookie.com/embed/JeNBQ-7cCE0?feature=oembed" title="Pediatric Tracheostomy Care Basics" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen="" class="w-full h-full"></iframe></div><div class="p-6"><h3 class="text-lg font-semibold text-gray-800 mb-2">Pediatric Tracheostomy Care Basics</h3><p class="text-gray-600 text-sm text-justify">Essential care techniques and best practices for pediatric tracheostomy patients.</p></div></div><div class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300" ><div class="aspect-video"><iframe src="https://www.youtube-nocookie.com/embed/L3B3N0Ig_Kg?feature=oembed" title="Swallowing Disorders &amp; Pediatric  Emergencies" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen="" class="w-full h-full"></iframe></div><div class="p-6"><h3 class="text-lg font-semibold text-gray-800 mb-2">Swallowing Disorders &amp; Pediatric  Emergencies</h3><p class="text-gray-600 text-sm text-justify">A discussion on the phases of swallowing disorders and emergency cases in pediatric tracheostomy patients </p></div></div><div class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300" ><div class="aspect-video"><iframe src="https://www.youtube-nocookie.com/embed/AyaWMLDIs4s?feature=oembed" title="Aspiration &amp; Decannulation in Pediatric Tracheostomy Patients" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen="" class="w-full h-full"></iframe></div><div class="p-6"><h3 class="text-lg font-semibold text-gray-800 mb-2">Aspiration &amp; Decannulation in Pediatric Tracheostomy Patients</h3><p class="text-gray-600 text-sm text-justify"> Addressing the critical questions of aspiration and the signs that indicate when children are ready for decannulation </p></div></div><div class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300" ><div class="aspect-video"><iframe src="https://www.youtube-nocookie.com/embed/Nc677AcyslA?feature=oembed" title="The Importance of Mental Health for Parents of Children with Special Needs" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen="" class="w-full h-full"></iframe></div><div class="p-6"><h3 class="text-lg font-semibold text-gray-800 mb-2">The Importance of Mental Health for Parents of Children with Special Needs</h3><p class="text-gray-600 text-sm text-justify">Discussion on how parents can navigate their mental health while raising children with special needs </p></div></div><div class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300" ><div class="aspect-video"><iframe src="https://www.youtube-nocookie.com/embed/ZD_BYqDRCfY?feature=oembed" title="Medical Rehabilitation for Pediatric Tracheostomy Patients" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen="" class="w-full h-full"></iframe></div><div class="p-6"><h3 class="text-lg font-semibold text-gray-800 mb-2">Medical Rehabilitation for Pediatric Tracheostomy Patients</h3><p class="text-gray-600 text-sm text-justify"> Exploring the Role of Medical Rehabilitation in Supporting Pediatric Tracheostomy Patients </p></div></div><div class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300" ><div class="aspect-video"><iframe src="https://www.youtube-nocookie.com/embed/3uQKwuw7xwo?feature=oembed" title="Medical Interventions for Patients with Pierre Robin Sequence (PRS) and Pediatric Tracheostomy" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen="" class="w-full h-full"></iframe></div><div class="p-6"><h3 class="text-lg font-semibold text-gray-800 mb-2">Medical Interventions for Patients with Pierre Robin Sequence (PRS) and Pediatric Tracheostomy</h3><p class="text-gray-600 text-sm text-justify">Discussion on treatment approaches for Pierre Robin Sequence and their impact on the pediatric tracheostomy journey </p></div></div><div class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300" ><div class="aspect-video"><iframe src="https://www.youtube-nocookie.com/embed/e3C-2s-w0ng?feature=oembed" title="Q&amp;A Session: Drooling Procedure" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen="" class="w-full h-full"></iframe></div><div class="p-6"><h3 class="text-lg font-semibold text-gray-800 mb-2">Q&amp;A Session: Drooling Procedure</h3><p class="text-gray-600 text-sm text-justify"> The description: Discussion on how drooling management procedures can address challenges in pediatric tracheostomy patients</p></div></div><div class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300" ><div class="aspect-video"><iframe src="https://www.youtube-nocookie.com/embed/smdHoCob7J8?feature=oembed" title="Parental Burnout pada Caregiver Anak Trakeostomi" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen="" class="w-full h-full"></iframe></div><div class="p-6"><h3 class="text-lg font-semibold text-gray-800 mb-2">Parental Burnout on Caregivers of Children with Tracheostomy</h3><p class="text-gray-600 text-sm text-justify">Discussion with dr. Winengku Basuki Adi on parental burnout and mental health support for caregivers of pediatric tracheostomy patients.</p></div></div></div><div class="bg-gradient-to-r from-red-50 to-pink-50 rounded-lg p-8 mb-12" ><h2 class="text-2xl font-semibold text-gray-800 mb-6 text-center">Webinar Series Benefits</h2><div class="grid grid-cols-1 md:grid-cols-3 gap-6"><div class="text-center"><div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"><svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg></div><h3 class="text-lg font-semibold text-gray-800 mb-2">Expert Knowledge</h3><p class="text-gray-600">Learn from healthcare professionals and experienced caregivers</p></div><div class="text-center"><div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"><svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg></div><h3 class="text-lg font-semibold text-gray-800 mb-2">Practical Guidance</h3><p class="text-gray-600">Receive step-by-step instructions and real-world applications</p></div><div class="text-center"><div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"><svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg></div><h3 class="text-lg font-semibold text-gray-800 mb-2">Community Support</h3><p class="text-gray-600">Connect with other families and share experiences</p></div></div></div></div></div></div>` }}
        />
        <Footer />
      </div>
    </div>
  );
}
