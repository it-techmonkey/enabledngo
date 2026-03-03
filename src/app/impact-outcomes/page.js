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

  const htmlContent = `
    <div class="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50">
      <div class="relative bg-gradient-to-r from-[#F0312F] to-[#c92826] text-white py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div class="absolute inset-0 bg-black opacity-10"></div>
        <div class="relative max-w-7xl mx-auto text-center z-10">
          <h1 class="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">Our Impact Outcomes</h1>
          <p class="text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed">
            Through heartfelt collaboration, we empower Indonesian pediatric tracheostomy children and special needs families to live life to the fullest. Explore our initiatives making a real difference in their lives.
          </p>
          <div class="absolute top-10 left-10 w-20 h-20 border-4 border-white opacity-20 rounded-full"></div>
          <div class="absolute bottom-10 right-10 w-32 h-32 border-4 border-white opacity-20 rounded-full"></div>
        </div>
      </div>
      <div class="flex-1 py-16 px-4 sm:px-6 lg:px-8">
        <div class="max-w-7xl mx-auto">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div>
              <a href="/donation-distribution">
                <div class="h-full bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group">
                  <div class="bg-red-50 p-6 relative overflow-hidden">
                    <div class="absolute inset-0 bg-gradient-to-br from-red-500 to-pink-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                    <div class="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-4 transform group-hover:scale-110 transition-transform duration-300 shadow-md">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart w-8 h-8 text-red-600"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>
                    </div>
                    <h3 class="text-xl font-bold text-gray-800 group-hover:text-[#F0312F] transition-colors duration-300">Donation Distribution</h3>
                  </div>
                  <div class="p-6">
                    <p class="text-gray-600 leading-relaxed mb-4">Purchasing tracheostomy tubes and redistributing surplus medical supplies to families in need across Indonesia.</p>
                    <div class="flex items-center text-[#F0312F] font-semibold group-hover:translate-x-2 transition-transform duration-300">
                      <span>Learn More</span>
                      <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                    </div>
                  </div>
                </div>
              </a>
            </div>
            <div>
              <a href="/online-support-group">
                <div class="h-full bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group">
                  <div class="bg-blue-50 p-6 relative overflow-hidden">
                    <div class="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                    <div class="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-4 transform group-hover:scale-110 transition-transform duration-300 shadow-md">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-users w-8 h-8 text-blue-600"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                    </div>
                    <h3 class="text-xl font-bold text-gray-800 group-hover:text-[#F0312F] transition-colors duration-300">Online Support Group</h3>
                  </div>
                  <div class="p-6">
                    <p class="text-gray-600 leading-relaxed mb-4">TemanBercerita: Grief support sessions providing personalized compassionate support through structured programs.</p>
                    <div class="flex items-center text-[#F0312F] font-semibold group-hover:translate-x-2 transition-transform duration-300">
                      <span>Learn More</span>
                      <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                    </div>
                  </div>
                </div>
              </a>
            </div>
            <div>
              <a href="/online-webinar-sessions">
                <div class="h-full bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group">
                  <div class="bg-purple-50 p-6 relative overflow-hidden">
                    <div class="absolute inset-0 bg-gradient-to-br from-purple-500 to-indigo-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                    <div class="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mb-4 transform group-hover:scale-110 transition-transform duration-300 shadow-md">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-video w-8 h-8 text-purple-600"><path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"></path><rect x="2" y="6" width="14" height="12" rx="2"></rect></svg>
                    </div>
                    <h3 class="text-xl font-bold text-gray-800 group-hover:text-[#F0312F] transition-colors duration-300">Online Webinar Sessions</h3>
                  </div>
                  <div class="p-6">
                    <p class="text-gray-600 leading-relaxed mb-4">Educational webinars featuring healthcare professionals sharing insights on pediatric care and special needs support.</p>
                    <div class="flex items-center text-[#F0312F] font-semibold group-hover:translate-x-2 transition-transform duration-300">
                      <span>Learn More</span>
                      <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                    </div>
                  </div>
                </div>
              </a>
            </div>
            <div>
              <a href="/patient-consultation-support">
                <div class="h-full bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group">
                  <div class="bg-green-50 p-6 relative overflow-hidden">
                    <div class="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                    <div class="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mb-4 transform group-hover:scale-110 transition-transform duration-300 shadow-md">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-message-circle w-8 h-8 text-green-600"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path></svg>
                    </div>
                    <h3 class="text-xl font-bold text-gray-800 group-hover:text-[#F0312F] transition-colors duration-300">Patient Consultation Support</h3>
                  </div>
                  <div class="p-6">
                    <p class="text-gray-600 leading-relaxed mb-4">Comprehensive support services connecting families with medical professionals for personalized consultations.</p>
                    <div class="flex items-center text-[#F0312F] font-semibold group-hover:translate-x-2 transition-transform duration-300">
                      <span>Learn More</span>
                      <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                    </div>
                  </div>
                </div>
              </a>
            </div>
            <div>
              <a href="/patient-journey-documentary">
                <div class="h-full bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group">
                  <div class="bg-orange-50 p-6 relative overflow-hidden">
                    <div class="absolute inset-0 bg-gradient-to-br from-orange-500 to-amber-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                    <div class="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mb-4 transform group-hover:scale-110 transition-transform duration-300 shadow-md">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-text w-8 h-8 text-orange-600"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path><path d="M14 2v4a2 2 0 0 0 2 2h4"></path><path d="M10 9H8"></path><path d="M16 13H8"></path><path d="M16 17H8"></path></svg>
                    </div>
                    <h3 class="text-xl font-bold text-gray-800 group-hover:text-[#F0312F] transition-colors duration-300">Patient Journey Documentary</h3>
                  </div>
                  <div class="p-6">
                    <p class="text-gray-600 leading-relaxed mb-4">Documenting and sharing real stories of families navigating the challenges of pediatric tracheostomy care.</p>
                    <div class="flex items-center text-[#F0312F] font-semibold group-hover:translate-x-2 transition-transform duration-300">
                      <span>Learn More</span>
                      <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                    </div>
                  </div>
                </div>
              </a>
            </div>
            <div>
              <a href="/pediatric-tracheostomy-care-booklet">
                <div class="h-full bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group">
                  <div class="bg-teal-50 p-6 relative overflow-hidden">
                    <div class="absolute inset-0 bg-gradient-to-br from-teal-500 to-cyan-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                    <div class="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center mb-4 transform group-hover:scale-110 transition-transform duration-300 shadow-md">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book-open w-8 h-8 text-teal-600"><path d="M12 7v14"></path><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"></path></svg>
                    </div>
                    <h3 class="text-xl font-bold text-gray-800 group-hover:text-[#F0312F] transition-colors duration-300">Pediatric Tracheostomy Care Booklet</h3>
                  </div>
                  <div class="p-6">
                    <p class="text-gray-600 leading-relaxed mb-4">Comprehensive guide providing essential information and best practices for pediatric tracheostomy care at home.</p>
                    <div class="flex items-center text-[#F0312F] font-semibold group-hover:translate-x-2 transition-transform duration-300">
                      <span>Learn More</span>
                      <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                    </div>
                  </div>
                </div>
              </a>
            </div>
            <div>
              <a href="/pro-bono-consulting-project">
                <div class="h-full bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group">
                  <div class="bg-violet-50 p-6 relative overflow-hidden">
                    <div class="absolute inset-0 bg-gradient-to-br from-violet-500 to-purple-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                    <div class="w-16 h-16 bg-violet-50 rounded-2xl flex items-center justify-center mb-4 transform group-hover:scale-110 transition-transform duration-300 shadow-md">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-briefcase w-8 h-8 text-violet-600"><path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path><rect width="20" height="14" x="2" y="6" rx="2"></rect></svg>
                    </div>
                    <h3 class="text-xl font-bold text-gray-800 group-hover:text-[#F0312F] transition-colors duration-300">Pro Bono Consulting Project</h3>
                  </div>
                  <div class="p-6">
                    <p class="text-gray-600 leading-relaxed mb-4">Collaborative partnerships with professionals offering free consulting services to support families and improve care quality.</p>
                    <div class="flex items-center text-[#F0312F] font-semibold group-hover:translate-x-2 transition-transform duration-300">
                      <span>Learn More</span>
                      <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                    </div>
                  </div>
                </div>
              </a>
            </div>
            <div>
              <a href="/research">
                <div class="h-full bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group">
                  <div class="bg-indigo-50 p-6 relative overflow-hidden">
                    <div class="absolute inset-0 bg-gradient-to-br from-indigo-500 to-blue-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                    <div class="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4 transform group-hover:scale-110 transition-transform duration-300 shadow-md">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-flask-conical w-8 h-8 text-indigo-600"><path d="M14 2v6a2 2 0 0 0 .245.96l5.51 10.08A2 2 0 0 1 18 22H6a2 2 0 0 1-1.755-2.96l5.51-10.08A2 2 0 0 0 10 8V2"></path><path d="M6.453 15h11.094"></path><path d="M8.5 2h7"></path></svg>
                    </div>
                    <h3 class="text-xl font-bold text-gray-800 group-hover:text-[#F0312F] transition-colors duration-300">Research</h3>
                  </div>
                  <div class="p-6">
                    <p class="text-gray-600 leading-relaxed mb-4">Evidence-based research initiatives advancing understanding of pediatric care, parental stress, and support strategies.</p>
                    <div class="flex items-center text-[#F0312F] font-semibold group-hover:translate-x-2 transition-transform duration-300">
                      <span>Learn More</span>
                      <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                    </div>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div class="bg-gradient-to-r from-[#F0312F] to-[#c92826] text-white py-16 px-4 sm:px-6 lg:px-8 mt-16">
        <div class="max-w-4xl mx-auto text-center">
          <h2 class="text-3xl sm:text-4xl font-bold mb-6">Join Us in Making a Difference</h2>
          <p class="text-lg mb-8 leading-relaxed">Every contribution helps us continue our mission to support Indonesian pediatric tracheostomy children and their families. Together, we can create lasting impact.</p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <a class="bg-white text-[#F0312F] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300 inline-block" href="/products">Visit Impact Shop</a>
            <button class="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-[#F0312F] transition-all duration-300 inline-block">Learn About Us</button>
          </div>
        </div>
      </div>
    </div>
  `;

  return (
    <div className="font-sans">
      <div className="flex flex-col min-h-screen font-inter">
        <Navbar />
        <main
          ref={mainRef}
          className="flex-grow"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
        <Footer />
      </div>
    </div>
  );
}
