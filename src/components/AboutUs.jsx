export default function AboutUs() {
    return (
        <section id="about-us" className="bg-[#fafafa] overflow-x-hidden">
            <h2 className="text-xl sm:text-2xl font-bold mx-4 sm:mx-6 md:mx-10 lg:mx-20 mt-15 w-fit sm:place-self-center md:place-self-start pt-10">
                About Us
            </h2>
            <div className="flex flex-col-reverse md:flex-row items-center gap-6 lg:gap-10 px-4 sm:px-6 md:px-10 lg:px-20 pb-10 max-w-7xl mx-auto">
                <div className="md:w-1/2 text-justify min-w-0">
                    <p className="text-sm sm:text-base mb-10 text-gray-800 leading-relaxed">
                        Enabled. was founded in November 2021, four months after our angel,
                        Amadea Jasmine Soetama, moved to a better place. Since then, Enabled.
                        has worked with people across disciplines—from doctors to border
                        professionals—to ensure Indonesian pediatric tracheostomy patients
                        receive the care they deserve. Thus, we named our foundation Yayasan
                        Kuat Bersama Enabled.—KUAT as both a symbol of the strength of
                        Indonesian pediatric tracheostomy children and an abbreviation of
                        Kolaborasi Untuk Anak Trakeostomi. Through heartfelt collaboration,
                        we help these children live life to the fullest. We focus donations
                        on purchasing tracheostomy tubes and redistributing surplus medical
                        supplies from families in privileged settings or those grieving a loss.
                        Beyond this, we run various initiatives to support Indonesia's broader
                        special needs community. We believe these children fight with all
                        they have to survive—now it's our turn to give our all to help them thrive.
                    </p>
                </div>
                <div className="lg:w-1/2 flex justify-center">
                    <img
                        alt="About Us"
                        className="w-full max-w-[350px] rounded shadow mb-15 object-cover"
                        src="/images/RealGirl.jpg"
                    />
                </div>
            </div>
        </section>
    );
}
