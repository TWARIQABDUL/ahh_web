import { Avatar } from "antd";
import { Carousel } from "antd";
import React from "react";


const testimonials = [
  {
    key: "1",
    name: "Jane Doe",
    role: "Medical Student",
    text: "Joining AHC gave me the tools and mentorship I needed to launch my first healthcare startup. Truly transformative!",
    avatar: "/images/event1.png",
  },
  {
    key: "2",
    name: "John Smith",
    role: "Healthcare Entrepreneur",
    text: "The workshops and networking sessions were amazing. I met partners who are now co-founders of my project.",
    avatar: "/images/event2.png",
  },
  {
    key: "3",
    name: "Aisha Ali",
    role: "Innovation Fellow",
    text: "AHC helped me turn my idea into a real product that is now helping my community. I’m forever grateful.",
    avatar: "/images/event3.png",
  },
];

const Testimonial: React.FC  = ()=>  {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 text-center">
        {/* Section Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6 animate-fadeInUp">
          What Our Members Say
        </h2>
        <p className="text-lg text-gray-600 mb-12 animate-fadeInUp" style={{ animationDelay: "0.3s" }}>
          Hear directly from students and entrepreneurs who are transforming healthcare with us.
        </p>

        {/* Testimonials Carousel */}
        <Carousel autoplay infinite dots className="animate-fadeInUp" style={{ animationDelay: "0.6s" }}>
          {testimonials.map((t) => (
            <div key={t.key}>
              <div className="flex flex-col items-center justify-center px-6">
                <Avatar src={t.avatar} size={80} className="mb-4" />
                <p className="italic text-lg text-gray-700 max-w-2xl">"{t.text}"</p>
                <h4 className="mt-4 font-semibold text-primary">{t.name}</h4>
                <span className="text-gray-500 text-sm">{t.role}</span>
              </div>
            </div>
          ))}
        </Carousel>
      </div>
    </section>
  );
}

export default Testimonial;
