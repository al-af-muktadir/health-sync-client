import { CheckCircle, Shield, Stethoscope, HeartPulse } from "lucide-react";
import { Users } from "lucide-react"; // new icon for 5th reason
import Image from "next/image";
import im1 from "../../assets/emergency.jpg";
import im2 from "../../assets/expoer.jpeg";
import im3 from "../../assets/equip.jpeg";
import im4 from "../../assets/download.jpeg";
import im5 from "../../assets/high.jpeg"; // new image for 5th reason

export function WhyChooseUs() {
  const reasons = [
    {
      title: "24/7 Emergency Care",
      desc: "Round-the-clock medical support to ensure you get immediate attention.",
      icon: <Shield className="w-10 h-10 text-blue-400" />,
      img: im1,
    },
    {
      title: "Expert Doctors",
      desc: "Highly qualified and experienced specialists in every department.",
      icon: <Stethoscope className="w-10 h-10 text-green-400" />,
      img: im2,
    },
    {
      title: "Advanced Equipment",
      desc: "Cutting-edge technology and facilities for accurate diagnosis.",
      icon: <HeartPulse className="w-10 h-10 text-red-400" />,
      img: im3,
    },
    {
      title: "Trusted by Thousands",
      desc: "Over 50,000 satisfied patients who trust us for their health.",
      icon: <CheckCircle className="w-10 h-10 text-purple-400" />,
      img: im4,
    },
    {
      title: "High Quality Care",
      desc: "Our medical services maintain the highest standards of quality and safety.",
      icon: <Users className="w-10 h-10 text-yellow-400" />,
      img: im5,
    },
  ];

  return (
    <section className="relative py-20 bg-black">
      <div className="max-w-[1900px] mx-auto px-6 lg:px-12 text-center">
        {/* Section Header */}
        <h2 className="text-4xl font-bold text-white mb-6 animate-fade-down">
          Why <span className="text-violet-400">Choose Us?</span>
        </h2>

        <p className="text-gray-300 max-w-2xl mx-auto mb-12 animate-fade-in">
          We combine expertise, technology, and compassion to provide the best
          healthcare services for you and your family.
        </p>

        {/* Grid of Reasons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {reasons.map((item, index) => (
            <div
              key={index}
              className="bg-gray-900 rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl hover:-translate-y-2 transition duration-500 transform animate-fade-up flex flex-col"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Image container with fixed height and object-cover */}
              <div className="h-48 w-full overflow-hidden">
                <Image
                  src={item.img}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                />
              </div>

              {/* Content container */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    {item.icon}
                    <h3 className="text-lg font-semibold text-white">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-gray-400 text-sm">{item.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
