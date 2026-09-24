import bgImg from "../assets/bannerImg/banner.png";

export default function Banner() {
  return (
    <section
      aria-labelledby="banner-title"
      className="relative flex min-h-[520px] items-center justify-center bg-cover bg-center px-5 py-20 text-center text-white sm:min-h-[620px]"
      style={{ backgroundImage: `url("${bgImg.src}")` }}
    >
      <div className="absolute inset-0 bg-emerald-950/75" />

      <div className="relative z-10 mx-auto max-w-5xl">
        <h1
          id="banner-title"
          className="text-4xl font-bold leading-tight sm:text-5xl lg:text-7xl"
        >
          ডিজিটাল লিগ্যাল এইড সিস্টেমে আপনাকে স্বাগতম
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/90 sm:text-xl">
          আইনগত সহায়তা সম্পর্কিত তথ্য ও সেবায় সহজে প্রবেশের জন্য আপনার
          নির্ভরযোগ্য ডিজিটাল প্ল্যাটফর্ম।
        </p>
      </div>
    </section>
  );
}