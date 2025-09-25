import { TeamOutlined, ProjectOutlined, BulbOutlined } from "@ant-design/icons";
import React from "react";


const stats = [
  {
    key: "1",
    icon: <TeamOutlined className="text-5xl text-teal" />,
    value: "200+",
    label: "Students Trained",
  },
  {
    key: "2",
    icon: <ProjectOutlined className="text-5xl text-teal" />,
    value: "15+",
    label: "Projects Launched",
  },
  {
    key: "3",
    icon: <BulbOutlined className="text-5xl text-teal" />,
    value: "50+",
    label: "Innovative Ideas",
  },
];

const Impact: React.FC  = ()=>  {
  return (
    <section className="py-20 bg-primary text-white">
      <div className="max-w-6xl mx-auto px-6 text-center">
        {/* Section Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6 animate-fadeInUp">
          Why Join Us?
        </h2>
        <p className="text-lg text-gray-600 mb-12 animate-fadeInUp" style={{ animationDelay: "0.3s" }}>
          Be part of a movement that empowers Africa’s next generation of healthcare entrepreneurs.
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {stats.map((item, index) => (
            <div
              key={item.key}
              className="flex flex-col items-center text-center p-6 animate-fadeInUp"
              style={{ animationDelay: `${index * 0.3 + 0.6}s`, animationFillMode: "forwards" }}
            >
              {item.icon}
              <h3 className="mt-4 text-3xl font-bold text-primary">{item.value}</h3>
              <p className="mt-2 text-gray-600">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Impact;
