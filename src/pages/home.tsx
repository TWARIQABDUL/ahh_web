import React from 'react'
import HeroSection from "../components/Hero";
import AboutUs from '../components/aboutus';
import WhyUs from '../components/whyus.tsx';
import Services from '../components/service.tsx';
import Testimonial from '../components/testimonials.tsx';
import Impact from '../components/impact.tsx';
import UpcomingEvents from '../components/upcomingevents.tsx';
import Partners from '../components/partiners.tsx';
import CallToAction from '../components/calltoaction.tsx';
const HomePage: React.FC = () => {
  return (
    <>
      <HeroSection />
      <AboutUs />
      <WhyUs />
      <Services />
      <Impact />
      <Testimonial />
      <UpcomingEvents />
      <Partners />
      <div className="!bg-primary">
        <CallToAction />
      </div>
    </>
  )
}

export default HomePage