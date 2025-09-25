import { Card, Button } from "antd";
import { CalendarOutlined, ClockCircleOutlined } from "@ant-design/icons";
import React from "react";


const events = [
  {
    key: "1",
    title: "Healthcare Innovation Bootcamp",
    date: "Oct 12, 2025",
    time: "10:00 AM - 4:00 PM",
    description:
      "A hands-on workshop where students design solutions to pressing healthcare challenges.",
    image: "/images/event1.png",
    link: "/events/bootcamp",
  },
  {
    key: "2",
    title: "Mentorship Networking Night",
    date: "Nov 5, 2025",
    time: "6:00 PM - 9:00 PM",
    description:
      "An evening connecting students with healthcare professionals, investors, and mentors.",
    image: "/images/event2.png",
    link: "/events/networking-night",
  },
  {
    key: "3",
    title: "AHC Annual Conference",
    date: "Dec 15, 2025",
    time: "9:00 AM - 6:00 PM",
    description:
      "A full-day conference showcasing student projects, keynote speakers, and innovation pitches.",
    image: "/images/event3.png",
    link: "/events/annual-conference",
  },
];

const UpcomingEvents: React.FC  = ()=>  {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6 text-center">
        {/* Section Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6 animate-fadeInUp">
          Upcoming Events
        </h2>
        <p
          className="text-lg text-gray-600 mb-12 animate-fadeInUp"
          style={{ animationDelay: "0.3s" }}
        >
          Stay updated with our latest activities and opportunities to engage.
        </p>

        {/* Event Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {events.map((event, index) => (
            <Card
              key={event.key}
              hoverable
              cover={
                <img
                  src={event.image}
                  alt={event.title}
                  className="h-48 object-cover rounded-t-lg"
                />
              }
              className="shadow-md rounded-xl animate-fadeInUp flex flex-col justify-between"
              style={{
                animationDelay: `${index * 0.3 + 0.6}s`,
                animationFillMode: "forwards",
              }}
            >
              <div className="flex flex-col flex-grow">
                <h3 className="text-xl font-semibold text-primary mb-2">
                  {event.title}
                </h3>
                <p className="flex items-center text-gray-600 text-sm mb-1">
                  <CalendarOutlined className="mr-2 text-teal" /> {event.date}
                </p>
                <p className="flex items-center text-gray-600 text-sm mb-3">
                  <ClockCircleOutlined className="mr-2 text-teal" /> {event.time}
                </p>
                <p className="text-gray-600 flex-grow">{event.description}</p>
              </div>

              {/* Learn More Button */}
              <Button
                type="primary"
                href={event.link}
                className="mt-4 bg-teal hover:!bg-white hover:!text-primary font-semibold"
              >
                Learn More
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export default UpcomingEvents;
