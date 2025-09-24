import { Layout, Button } from "antd";
import React from "react";

const { Content } = Layout;

function WhyUs() {
  return (
    <Content className="py-20 bg-white">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
        
        {/* Right: Image */}
        <div className="flex-1 flex justify-center">
          <img
            src="/images/event3.png"
            alt="About Us"
            className="rounded-2xl shadow-lg w-full max-w-md"
          />
        </div>

        {/* Left: Text */}
        <div className="flex-1 text-left">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
            Why Us
          </h2>
          <p className="text-lg text-darkGray mb-6">
            The African Healthpreneurship Hub empowers Africa’s next generation
            of healthcare entrepreneurs. Our mission is to foster innovation,
            sustainability, and collaboration within the healthcare ecosystem.
          </p>
          <p className="text-lg text-darkGray mb-6">
            We provide students and innovators with resources, mentorship, and
            opportunities to transform healthcare challenges into impactful
            solutions for communities across Africa.
          </p>

          <Button
            type="primary"
            className="bg-teal hover:!bg-primary hover:!text-white font-semibold shadow-md"
            size="large"
          >
            Learn More
          </Button>
        </div>

        
      </div>
    </Content>
  );
}

export default WhyUs;
