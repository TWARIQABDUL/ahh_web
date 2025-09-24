import { Layout, Card } from "antd";
import { BulbOutlined, TeamOutlined, BookOutlined } from "@ant-design/icons";
import React from "react";

const { Content } = Layout;

const services = [
  {
    key: "1",
    icon: <BulbOutlined className="text-4xl text-teal" />,
    title: "Innovation Training",
    description:
      "Workshops and bootcamps that equip students with the skills to create impactful healthcare solutions.",
  },
  {
    key: "2",
    icon: <TeamOutlined className="text-4xl text-teal" />,
    title: "Mentorship & Networking",
    description:
      "Connect with experienced mentors, entrepreneurs, and investors to grow your ideas.",
  },
  {
    key: "3",
    icon: <BookOutlined className="text-4xl text-teal" />,
    title: "Resources & Knowledge",
    description:
      "Access curated guides, reports, and tools to support your entrepreneurial journey.",
  },
];

function Services() {
  return (
    <Content className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 text-center">
        {/* Section Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6 animate-fadeInUp">
          Our Services
        </h2>
        <p className="text-lg text-gray-600 mb-12 animate-fadeInUp [animation-delay:0.3s]">
          We empower students to innovate in healthcare by providing training,
          mentorship, and resources.
        </p>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card
              key={service.key}
              hoverable
              className="shadow-md rounded-xl transition-transform transform hover:scale-105 animate-fadeInUp"
              style={{ animationDelay: `${index * 0.3 + 0.6}s` }} // staggered animation
            >
              <div className="flex flex-col items-center text-center p-6">
                {service.icon}
                <h3 className="mt-4 text-xl font-semibold text-primary">
                  {service.title}
                </h3>
                <p className="mt-2 text-gray-600">{service.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Content>
  );
}

export default Services;
