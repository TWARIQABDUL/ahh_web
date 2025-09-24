import React from 'react'
import HeroSection from "../components/Hero";
import AboutUs from '../components/aboutus';
import WhyUs from '../components/whyus.tsx';
import Services from '../components/service.tsx';
const HomePage: React.FC  =()=> {
  return (
    <>
    <HeroSection/>
    <AboutUs/>
    <WhyUs/>
    <Services/>
    </>
  )
}

export default HomePage