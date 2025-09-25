import { Button } from "antd";
import React from "react";

const CallToAction: React.FC = () => {
  return (
    <section className="relative py-20 bg-primary overflow-hidden">
      {/* Content Wrapper */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center text-white">
        <h2 className="text-3xl md:text-5xl font-bold mb-6 animate-fadeInUp">
          Ready to Make an Impact in Healthcare?
        </h2>
        <p className="text-lg md:text-xl mb-10 text-white/90 animate-fadeInUp animation-delay-300">
          Join Africa’s leading community of student innovators driving
          healthcare transformation. Whether you’re a student, mentor, or
          sponsor — your journey starts here.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fadeInUp animation-delay-600">
          <Button
            type="primary"
            className="bg-teal text-white hover:!bg-white hover:!text-primary font-semibold shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            size="large"
          >
            Join Us
          </Button>
          <Button
            className="bg-white text-primary hover:!bg-darkGray hover:!text-white font-semibold shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            size="large"
          >
            Become a Sponsor
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;