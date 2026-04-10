'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Users } from 'lucide-react';
const CHILDREN_CACHE_KEY = 'enabledngo_children_cache_v1';

export default function BeADonorPage() {
  const router = useRouter();
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const cached = sessionStorage.getItem(CHILDREN_CACHE_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length) {
          setChildren(parsed);
          setLoading(false);
        }
      } catch (_) {}
    }

    fetch('/api/children')
      .then((r) => r.json())
      .then((data) => {
        const normalized = Array.isArray(data) ? data : [];
        setChildren(normalized);
        sessionStorage.setItem(CHILDREN_CACHE_KEY, JSON.stringify(normalized));
      })
      .catch(() => setChildren([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = children.filter((c) =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.domicile?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="font-sans">
      <div className="flex flex-col min-h-screen font-inter">
        <Navbar />
        <main className="flex-grow bg-gray-50">
          {/* Hero */}
          <section className="w-full bg-gray-100" aria-label="Hero">
            <div className="w-full flex items-center justify-center overflow-hidden">
              <img
                src="/images/image.png"
                alt="Kuat bersama Enabled – Be a donor"
                className="w-full h-auto object-contain max-h-[90vh] scale-125 sm:scale-100 transition-transform duration-300"
                loading="eager"
              />
            </div>
          </section>

          {/* Listing */}
          <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Donate to Children Who need your Support
              </h2>
              <div className="relative w-full sm:w-96">
                <input
                  type="text"
                  placeholder="Search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent text-base"
                />
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" aria-hidden="true">
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
                </svg>
              </div>
            </div>

            {loading ? (
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse flex flex-col sm:flex-row">
                    <div className="sm:w-80 w-full h-64 sm:h-80 bg-gray-200 shrink-0" />
                    <div className="flex-1 p-6 space-y-4">
                      <div className="h-8 bg-gray-200 rounded w-2/3" />
                      <div className="h-4 bg-gray-200 rounded w-full" />
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filtered.length > 0 ? (
              <div className="space-y-6">
                {filtered.map((child) => (
                  <div key={child.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <div className="flex flex-col sm:flex-row">
                      <div className="sm:w-80 w-full flex-shrink-0">
                        <img
                          src={child.image}
                          alt={child.name}
                          className="w-full h-64 sm:h-80 object-cover"
                          loading="lazy"
                          decoding="async"
                          onError={(e) => e.target.src = '/Girly.png'}
                        />
                      </div>
                      <div className="flex-1 p-4 sm:p-6 flex flex-col justify-between">
                        <div>
                          <h3 className="text-3xl font-bold text-gray-900 mb-3">{child.name}</h3>
                          <div className="mb-4">
                            <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm sm:text-lg text-gray-700">
                              <div><span className="font-bold">Age:</span> <span className="font-semibold">{child.age}</span></div>
                              <div className="hidden sm:block text-gray-300">|</div>
                              <div><span className="font-bold">Domicile:</span> <span className="font-semibold">{child.domicile}</span></div>
                              <div className="hidden sm:block text-gray-300">|</div>
                              <div><span className="font-bold">Parents Occupation:</span> <span className="font-semibold">{child.parentsOccupation || child.parentsoccupation}</span></div>
                            </div>
                          </div>
                          <p className="text-xl text-gray-600 leading-relaxed">{child.description}</p>
                        </div>
                        <div className="mt-4">
                          <button
                            onClick={() => router.push(`/donate/${child.id}`)}
                            className="bg-black text-white text-lg px-8 py-3 rounded hover:bg-gray-800 transition-colors duration-300 w-full sm:w-auto"
                          >
                            Be a Donor
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Users className="w-12 h-12 text-gray-200 mb-3" />
                <p className="text-gray-500 text-lg font-medium">
                  {search ? `No children found matching "${search}".` : 'No children have been added yet.'}
                </p>
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
