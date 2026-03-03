'use client';

import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ClipboardList, UserCircle, Film, Phone, BookOpen, Heart, Globe, CheckCircle } from 'lucide-react';

// These are the official PDF links from the enabled.ngo site
// They link to Google Drive hosted PDFs
const BOOKLET_PDFS = {
  bahasa: '/pdf/bahasa_version.pdf',
  english: '/pdf/english_version.pdf',
};

export default function PediatricCareBookletPage() {
  const router = useRouter();

  const handleDownload = (lang) => {
    window.open(BOOKLET_PDFS[lang], '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="flex flex-col min-h-screen font-inter">
      <Navbar />
      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Pediatric Tracheostomy Care Booklet</h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our comprehensive care booklet provides essential information and guidance for families and caregivers of pediatric tracheostomy patients, ensuring the best possible care and outcomes.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Download Section */}
            <div className="bg-white rounded-xl shadow-md p-8 flex flex-col">
              <div className="flex-1">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Download Booklet</h2>
                <p className="text-gray-600 mb-6">
                  Download our comprehensive Pediatric Tracheostomy Care Booklet in your preferred language. This booklet is a collection of contributions from parents of pediatric tracheostomy patients in Indonesia.
                </p>
              </div>
              <div className="space-y-3 mt-auto">
                <button
                  onClick={() => handleDownload('bahasa')}
                  className="w-full bg-purple-600 text-white px-4 py-3 rounded-xl hover:bg-purple-700 transition-all duration-200 font-semibold flex items-center justify-center gap-3 active:scale-95 shadow-md shadow-purple-100"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Download Bahasa Version</span>
                </button>
                <button
                  onClick={() => handleDownload('english')}
                  className="w-full bg-blue-600 text-white px-4 py-3 rounded-xl hover:bg-blue-700 transition-all duration-200 font-semibold flex items-center justify-center gap-3 active:scale-95 shadow-md shadow-blue-100"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Download English Version</span>
                </button>
                <p className="text-xs text-gray-400 text-center pt-1">Downloads directly — free to access</p>
              </div>
            </div>

            {/* Contents Section */}
            <div className="bg-white rounded-xl shadow-md p-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Care Booklet Contents</h2>
              <div className="space-y-5">
                {[
                  { Icon: ClipboardList, bg: 'bg-blue-100', color: 'text-blue-600', title: 'List of necessary medical supplies and equipment', desc: 'A complete inventory of essential items required for pediatric tracheostomy care.' },
                  { Icon: UserCircle, bg: 'bg-green-100', color: 'text-green-600', title: 'Instructions for pediatric tracheostomy care training', desc: 'Step-by-step guidance for safely performing and managing tracheostomy care.' },
                  { Icon: Film, bg: 'bg-purple-100', color: 'text-purple-600', title: 'List of must-watch videos for Indonesian pediatric tracheostomy patient parents', desc: 'Curated educational videos to support parents in caring for their children.' },
                  { Icon: Phone, bg: 'bg-red-100', color: 'text-red-600', title: 'List of necessary contacts', desc: 'Important support resources to reach when needed.' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${item.bg} ${item.color}`}>
                      <item.Icon className="w-5 h-5" aria-hidden />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 text-sm">{item.title}</h3>
                      <p className="text-gray-500 text-sm mt-1">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Why Our Booklet Matters */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-8 text-center">Why Our Booklet Matters</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { Icon: BookOpen, title: 'Comprehensive Guide', desc: 'All-in-one resource for tracheostomy care' },
                { Icon: Heart, title: 'Family-Friendly', desc: 'Accessible language for all family members' },
                { Icon: Globe, title: 'Bilingual', desc: 'Available in Bahasa Indonesia and English' },
                { Icon: CheckCircle, title: 'Verified Content', desc: 'Reviewed by medical professionals' },
              ].map((item, idx) => (
                <div key={idx} className="text-center">
                  <div className="inline-flex w-12 h-12 items-center justify-center rounded-full bg-white/80 mb-3">
                    <item.Icon className="w-6 h-6 text-gray-700" aria-hidden />
                  </div>
                  <h3 className="text-base font-semibold text-gray-800 mb-1">{item.title}</h3>
                  <p className="text-gray-500 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
