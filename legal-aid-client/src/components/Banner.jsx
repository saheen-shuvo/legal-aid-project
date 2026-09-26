import bgImg from "../assets/bannerImg/banner.png";

export default function Banner() {
  return (
    <section
      aria-labelledby="banner-title"
      className="relative flex min-h-130 items-center justify-center bg-cover bg-center px-5 py-20 text-center text-white sm:min-h-[620px]"
      style={{ backgroundImage: `url("${bgImg.src}")` }}
    >
      <div className="absolute inset-0 bg-emerald-950/75" />

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <p className="text-sm font-medium tracking-[0.1em] text-white/80">
          ন্যায়বিচারের পথে ডিজিটাল সহায়তা
        </p>

        <h1 className="mt-4 text-6xl font-bold tracking-wide text-white md:text-8xl">
          সমাধান
        </h1>

        <div className="mx-auto my-6 h-px w-20 bg-white/50"></div>

        <h2
          id="banner-title"
          className="text-2xl font-semibold text-white md:text-4xl"
        >
          ডিজিটাল লিগ্যাল এইড সিস্টেমে আপনাকে স্বাগতম
        </h2>

        <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-white/80 md:text-base">
          সহজলভ্য ও মানবিক আইনি সহায়তার জন্য একটি নির্ভরযোগ্য ডিজিটাল
          প্ল্যাটফর্ম।
        </p>
      </div>
    </section>
  );
}
