import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-[#F0312F] text-white py-10 px-4 sm:px-6 md:px-10 lg:px-20 font-inter -mb-10 mt-auto">
            <div className="flex flex-col md:flex-row justify-between gap-10 max-w-7xl mx-auto">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold mb-5">Enabled.</h1>
                    <p className="text-sm leading-relaxed">
                        +62857-7873-7390 <span className="block mt-1">(Founder - Tia)</span>
                    </p>
                    <p className="mt-4 text-sm leading-relaxed">
                        +62877-8462-9666 <span className="block mt-1">(Co-Founder - Via)</span>
                    </p>
                </div>
                <div className="min-w-0">
                    <h2 className="font-semibold mb-5">Impact Outcomes</h2>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
                        <ul className="space-y-2">
                            <li>
                                <Link href="/donation-distribution" className="underline hover:text-gray-200 transition-colors py-1 inline-block min-h-[44px] flex items-center">
                                    Donation Distribution
                                </Link>
                            </li>
                            <li>
                                <Link href="/online-support-group" className="underline hover:text-gray-200 transition-colors py-1 inline-flex items-center min-h-[44px]">
                                    Online Support Group
                                </Link>
                            </li>
                            <li>
                                <Link href="/online-webinar-sessions" className="underline hover:text-gray-200 transition-colors py-1 inline-flex items-center min-h-[44px]">
                                    Online Webinar Sessions
                                </Link>
                            </li>
                            <li>
                                <Link href="/patient-consultation-support" className="underline hover:text-gray-200 transition-colors py-1 inline-flex items-center min-h-[44px]">
                                    Patient Consultation Support
                                </Link>
                            </li>
                            <li>
                                <Link href="/patient-journey-documentary" className="underline hover:text-gray-200 transition-colors py-1 inline-flex items-center min-h-[44px]">
                                    Patient Journey Documentary
                                </Link>
                            </li>
                        </ul>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/pediatric-tracheostomy-care-booklet" className="underline hover:text-gray-200 transition-colors py-1 inline-flex items-center min-h-[44px]">
                                    Pediatric Tracheostomy Care Booklet
                                </Link>
                            </li>

                            <li>
                                <Link href="/pro-bono-consulting-project" className="underline hover:text-gray-200 transition-colors py-1 inline-flex items-center min-h-[44px]">
                                    Pro Bono Consulting Project
                                </Link>
                            </li>
                            <li>
                                <Link href="/research" className="underline hover:text-gray-200 transition-colors py-1 inline-flex items-center min-h-[44px]">
                                    Research
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="flex items-center justify-center">
                    <a
                        href="https://wa.me/6287784629666"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white text-red-600 px-5 py-3 rounded-full font-medium hover:bg-red-500 hover:text-white transition inline-block text-center min-h-[44px] flex items-center justify-center"
                    >
                        Get In Touch
                    </a>
                </div>
            </div>
        </footer>
    );
}
