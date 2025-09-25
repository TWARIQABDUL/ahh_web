import React from "react";


const partners = [
  { key: "1", name: "WHO", logo: "/images/partners/who.png" },
  { key: "2", name: "UNICEF", logo: "/images/partners/unicef.png" },
  { key: "3", name: "Gates", logo: "/images/partners/gates.png" },
  { key: "4", name: "African Union", logo: "/images/partners/au.png" },
  { key: "5", name: "Harvard", logo: "/images/partners/harvard.png" },
  { key: "6", name: "Johnson & Johnson", logo: "/images/partners/jnj.png" },
];

const Partners:React.FC = ()=> {
  return (
    <section className="py-20 bg-gray-50 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
          Our Partners
        </h2>
        <p className="text-lg text-gray-600 mb-12">
          We collaborate with leading organizations to drive healthcare innovation in Africa.
        </p>

        {/* marquee wrapper */}
        <div className="relative w-full overflow-hidden partners">
          {/* track: must be at least 200% width to allow translateX(-50%) */}
          <div className="flex items-center gap-16 w-[200%] animate-scroll">
            {partners.concat(partners).map((p, i) => (
              <div key={`${p.key}-${i}`} className="flex items-center justify-center min-w-[160px]">
                <img
                  src={p.logo}
                  alt={p.name}
                  className="max-h-16 object-contain grayscale hover:grayscale-0 transition duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
export default Partners
