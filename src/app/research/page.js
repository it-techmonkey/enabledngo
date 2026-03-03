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
        } else if (text === 'Download PDF') {
          const card = btn.closest('.bg-white');
          const title = card?.querySelector('h3')?.innerText?.trim();
          if (title?.includes('Urban vs Rural')) {
            window.open('/pdf/journal1.pdf', '_blank');
          } else if (title?.includes('Exploring Coping Strategies')) {
            window.open('/pdf/journal2.pdf', '_blank');
          }
        } else if (text === 'View Article') {
          const card = btn.closest('.bg-white');
          const title = card?.querySelector('h3')?.innerText?.trim();
          if (title?.includes('Kolaborasi Komunitas') || title?.includes('Mendukung Ibu Berduka')) {
            window.open('http://jurnal.utu.ac.id/baktiku/article/view/11168', '_blank', 'noopener,noreferrer');
          }
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
          dangerouslySetInnerHTML={{ __html: `<div class="min-h-screen flex flex-col"><div class="flex-1 py-12 px-4 sm:px-6 lg:px-8"><div class="max-w-6xl mx-auto"><div class="text-center mb-12" ><h1 class="text-4xl font-bold text-gray-800 mb-6">Research &amp; Publications</h1><p class="text-lg text-gray-600 max-w-4xl mx-auto">Our research focuses on understanding the challenges faced by parents of children with disabilities and rare diseases, examining stress levels, social support, and coping strategies. Through these insights, we aim to inform interventions and resources that strengthen family well-being and resilience.</p></div><div class="mb-12" ><h2 class="text-2xl font-semibold text-gray-800 mb-8 text-center">Latest Publications</h2><div class="grid grid-cols-1 lg:grid-cols-2 gap-8"><div class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 flex flex-col h-full" ><div class="mb-4"><h3 class="text-xl font-semibold text-gray-800 mb-2 mb-10">Kolaborasi Komunitas dalam Mendukung Ibu Berduka: Intervensi Psikologis bagi Keluarga dengan Anak Berpenyakit Langka</h3><p class="text-gray-600 text-sm mb-2"><span class="font-medium">Authors:</span> Ziadatul Hikmiah, Ade Meutia, Siti Sara Deviana</p><p class="text-gray-600 text-sm mb-2"><span class="font-medium">Journal:</span> Jurnal Pengabdian Masyarakat: Darma Bakti Teuku Umar</p><p class="text-gray-600 text-sm mb-4"><span class="font-medium">Year:</span> 2025</p><p class="text-gray-600 text-sm mb-6 text-justify">Losing a child to a rare disease is a very traumatic experience for parents, especially mothers. This community service program, held virtually from May to June 2024 in collaboration with Enabled.id, provides psychological support for grieving mothers through a structured intervention based on the PATH framework—including education on stages of grief, group sharing, mindfulness techniques, journaling, and identification of grief triggers. The program involved 15 mothers who had lost children to rare diseases or disabilities and achieved positive outcomes in emotional recovery and psychological well-being.</p></div><div class="mt-auto"><button class="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold flex items-center justify-center space-x-2" tabindex="0"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg><span>View Article</span></button></div></div><div class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 flex flex-col h-full" ><div class="mb-4"><h3 class="text-xl font-semibold text-gray-800 mb-2 mb-10">Urban vs Rural: Parental Stress and Social Support of Parents of Children with Disabilities</h3><p class="text-gray-600 text-sm mb-2"><span class="font-medium">Authors:</span> Ziadatul Hikmiah, Ari Pratiwi, Unita Werdi Rahajeng, Ade Meutia, Siti Sara Deviana, Miga Demira, Hanifah Ulya </p><p class="text-gray-600 text-sm mb-2"><span class="font-medium">Journal:</span> Journal of Pediatric Medicine</p><p class="text-gray-600 text-sm mb-4"><span class="font-medium">Year:</span> 2024</p><p class="text-gray-600 text-sm mb-6 text-justify">Parents who care for children with disabilities are known to have higher levels of stress and greater obstacles compared to parents who care for children without special needs. However, this issue has received less attention and has not been studied much. This research is a correlational quantitative study that aims to see the relationship between parental stress and social support obtained by parents of children with disabilities, which also considers the factor of residence (urban vs. rural) as a moderator. The Parental Stress Scale (PSS) and the Medical Outcomes Study Social Support Survey - MOS-SS were administered to 107 parents with children with disabilities to determine the association between stress levels and social support received. Based on the results of the correlation test, a negative and significant correlation was obtained between parental stress and social support (p&lt;.001). This indicates that the higher the social support score, the lower the parental stress score. In addition, it was found that although it did not directly affect parental stress scores and social support partially, the location where participants lived moderated the influence of social support on parental stress.</p></div><div class="mt-auto"><button class="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold flex items-center justify-center space-x-2" tabindex="0"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg><span>Download PDF</span></button></div></div><div class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 flex flex-col h-full" ><div class="mb-4"><h3 class="text-xl font-semibold text-gray-800 mb-2 mb-10">Exploring Coping Strategies of Parents of Children with Rare Diseases: A Qualitative Study </h3><p class="text-gray-600 text-sm mb-2"><span class="font-medium">Authors:</span> Ziadatul Hikmiah, Ade Meutia, Siti Sara Deviana </p><p class="text-gray-600 text-sm mb-2"><span class="font-medium">Journal:</span> Family Medicine &amp; Healthcare</p><p class="text-gray-600 text-sm mb-4"><span class="font-medium">Year:</span> 2024</p><p class="text-gray-600 text-sm mb-6 text-justify"> Parents of children with special needs, such as those with rare diseases, are to experience higher levels of stress and encounter greater challenges compared to those caring for children without special needs. However, despite its importance, this issue is often unrecognizable and remain insufficiently explored. This current study is a confirmatory study with a qualitative approach that aims to investigate how parents cope with the stress associated with caring for children with rare diseases. This study aims to explore parents’ strategies to manage challenges on daily basis. Data collection involved five parents who raise children with rare diseases to explore coping strategies in dealing with parental stress when dealing with everyday caring for children with special needs. Understanding coping strategies to face challenges and stress.</p></div><div class="mt-auto"><button class="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold flex items-center justify-center space-x-2" tabindex="0"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg><span>Download PDF</span></button></div></div></div></div><div class="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8 mb-12" ><h2 class="text-2xl font-semibold text-gray-800 mb-8 text-center">Research Focus Areas</h2><div class="grid grid-cols-1 md:grid-cols-3 gap-6"><div class="text-center"><div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4"><svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div><h3 class="text-lg font-semibold text-gray-800 mb-2">Parental Stress and Well-Being </h3><p class="text-gray-600">Examining the emotional and psychological challenges faced by parents of children with disabilities and rare diseases.</p></div><div class="text-center"><div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"><svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg></div><h3 class="text-lg font-semibold text-gray-800 mb-2"> Social Support and Community Resources</h3><p class="text-gray-600">Investigating the role of family, community, and healthcare networks in supporting caregiving parents. </p></div><div class="text-center"><div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4"><svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg></div><h3 class="text-lg font-semibold text-gray-800 mb-2"> Coping Strategies and Adaptive Practices</h3><p class="text-gray-600">Identifying practical and emotional strategies parents use to navigate the demands of caregiving. </p></div></div></div><div class="bg-white rounded-lg shadow-lg p-8 mb-12" ><h2 class="text-2xl font-semibold text-gray-800 mb-6 text-center">Research Impact</h2><div class="grid grid-cols-1 md:grid-cols-3 gap-6"><div class="text-center"><div class="text-3xl font-bold text-blue-600 mb-2">107+</div><p class="text-gray-600"> parents raising children with disabilities or rare diseases were sampled</p></div><div class="text-center"><div class="text-3xl font-bold text-green-600 mb-2">18+ <span class="text-sm">Item Scale</span></div><p class="text-gray-600"> measures both positive and negative aspects of parenting</p></div><div class="text-center"><div class="text-3xl font-bold text-purple-600 mb-2">20+  <span class="text-sm">Item Scale</span></div><p class="text-gray-600">assesses perceived social support on a Likert scale</p></div></div></div></div></div></div>` }}
        />
        <Footer />
      </div>
    </div>
  );
}
