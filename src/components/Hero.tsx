import { Layout, Button } from "antd";
import React, { useState, useEffect } from "react";

const { Content } = Layout;

// Background images
const backgroundImages = [
  "/images/event1.png",
  "/images/event2.png",
  "/images/event3.png",
];

const HeroSection:React.FC = ()=> {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Rotate images every 5s
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % backgroundImages.length
      );
    }, 5000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <header className="w-full overflow-hidden">
      <Content
        className="relative flex items-center justify-center h-[90vh] bg-cover bg-center !bg-no-repeat transition-all duration-1000 ease-in-out animate-kenburns"
        style={{
          backgroundImage: `url('${backgroundImages[currentImageIndex]}')`,
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/70"></div>

        {/* Hero Content */}
        <div className="relative z-10 text-center text-white max-w-3xl px-6">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight animate-fadeInUp">
            Transforming Healthcare Through Student Innovation
          </h1>

          <p className="mt-6 text-lg md:text-xl text-gray-200 animate-fadeInUp animation-delay-300">
            Empowering Africa’s next generation of healthcare entrepreneurs to
            build sustainable solutions for our communities.
          </p>

          <div className="mt-8 flex justify-center gap-4 animate-fadeInUp animation-delay-600">
            <Button
              type="primary"
              className="bg-teal text-white hover:!bg-white hover:!text-primary font-semibold shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              size="large"
            >
              Join Us
            </Button>
            <Button
              className="bg-white text-primary hover:!bg-teal hover:!text-white font-semibold shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              size="large"
            >
              Learn More
            </Button>
          </div>
        </div>
      </Content>
    </header>
  );
}

export default HeroSection;