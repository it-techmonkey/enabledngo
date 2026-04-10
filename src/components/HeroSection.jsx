'use client';

import { useEffect, useState } from 'react';

export default function HeroSection() {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    return (
        <div
            className={`bg-white px-4 sm:px-6 md:px-10 lg:px-20 transition-all duration-700 ease-out overflow-x-hidden ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
        >
            <div className="max-w-7xl mx-auto w-full flex flex-col-reverse lg:flex-row items-center lg:items-center justify-between gap-8 lg:gap-12 lg:min-h-[calc(100vh-235px)] pt-10">
                <div className="w-full lg:w-1/2 flex justify-center lg:justify-start mb-8 lg:mb-0">
                    <div className="w-full sm:w-[300px] md:w-[360px] lg:w-[600px] pb-6 lg:pb-0 xl:-mb-4">
                        <img
                            alt="Hero Graphic"
                            className="w-full h-auto max-h-[300px] lg:max-h-[800px] object-contain"
                            src="/images/Girly.png"
                        />
                    </div>
                </div>
                <div className="w-full lg:w-1/2 text-center lg:text-left mb-8 lg:mb-0">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight mb-6 text-red-600">
                        Enabled.
                    </h1>
                    <p className="text-lg sm:text-xl text-gray-800 mb-4 leading-relaxed font-semibold max-w-xl mx-auto lg:mx-0">
                        Indonesia-based community support platform for special needs children's parents and bereaved parents
                    </p>
                    <p className="text-base text-gray-500">
                        Since November 2021
                    </p>
                </div>
            </div>
        </div>
    );
}
