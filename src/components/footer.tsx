import { Layout } from "antd";
import {
  FacebookFilled,
  TwitterSquareFilled,
  LinkedinFilled,
  InstagramFilled,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import React from "react";
import { Link } from "react-router-dom";

const { Footer: AntFooter } = Layout;

const Footer:React.FC = ()=> {
  return (
    <AntFooter className="!bg-primary font-inter text-white py-12">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Logo + Brand */}
        <div>
          <div className="flex items-center gap-3">
            <img src="/images/logo.jpg" alt="Logo" className="w-12 h-12" />
            <div>
              <h3 className="font-bold text-lg text-white">
                African Healthpreneurship Hub
              </h3>
              <p className="text-lightGray text-sm">
                Empowering Healthcare Innovation
              </p>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold text-lg mb-4 text-white">Quick Links</h4>
          <ul className="space-y-2 text-lightGray">
            <li><Link to="#home" className="hover:text-teal">Home</Link></li>
            <li><Link to="#about" className="hover:text-teal">About</Link></li>
            <li><Link to="#services" className="hover:text-teal">Services</Link></li>
            <li><Link to="#events" className="hover:text-teal">Events</Link></li>
            <li><Link to="#contact" className="hover:text-teal">Contact</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="font-semibold text-lg mb-4 text-white">Contact Us</h4>
          <ul className="space-y-3 text-lightGray">
            <li className="flex items-center gap-2 hover:text-teal transition">
              <MailOutlined /> info@ahc.org
            </li>
            <li className="flex items-center gap-2 hover:text-teal transition">
              <PhoneOutlined /> +250 789 123 456
            </li>
            <li className="flex items-center gap-2 hover:text-teal transition">
              <EnvironmentOutlined /> Kigali, Rwanda
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h4 className="font-semibold text-lg mb-4 text-white">Follow Us</h4>
          <div className="flex gap-4 text-2xl text-lightGray">
            <a href="#" className="hover:text-teal"><FacebookFilled /></a>
            <a href="#" className="hover:text-teal"><TwitterSquareFilled /></a>
            <a href="#" className="hover:text-teal"><LinkedinFilled /></a>
            <a href="#" className="hover:text-teal"><InstagramFilled /></a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-10 border-t border-lightGray/30 pt-6 text-center text-lightGray text-sm">
        © {new Date().getFullYear()} African Healthpreneurship Hub. All rights reserved.
      </div>
    </AntFooter>
  );
}

export default Footer;
