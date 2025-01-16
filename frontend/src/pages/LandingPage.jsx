import React from 'react';
import {
  FaMoneyBillWave,
  FaRegListAlt,
  FaEdit,
  FaChartLine,
  FaBell,
  FaUserShield,
} from 'react-icons/fa';
import { BsFacebook, BsTwitter, BsInstagram, BsLinkedin } from 'react-icons/bs';
import { Link} from 'react-router-dom';

const Navbar = () => (
  <nav className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 shadow-md fixed top-0 left-0 w-full z-50">
    <div className="max-w-7xl mx-auto flex justify-between items-center">
      <h1 className="text-2xl font-bold">FinTrackr</h1>
      <ul className="flex space-x-6">
        <li>
          <a href="#features" className="hover:underline">
            Features
          </a>
        </li>
        <li>
          <a href="#benefits" className="hover:underline">
            Benefits
          </a>
        </li>
        <li>
          <a href="#testimonials" className="hover:underline">
            Testimonials
          </a>
        </li>
        <li>
        <Link to="/login">
          <button className="bg-white text-blue-600 px-3 py-1 rounded-md hover:bg-gray-200 transition">
            Login
          </button>
          </Link>
        </li>
        <li>
        <Link to="/signup">
          <button className="bg-purple-700 px-3 py-1 rounded-md hover:bg-purple-800 transition">
            Signup
          </button>
          </Link>                          
        </li>
      </ul>
    </div>
  </nav>
);

const LandingPage = () => (
  <div className="min-h-screen bg-gradient-to-r from-purple-100 via-pink-100 to-blue-100 text-gray-800">
    {/* Navbar */}
    <Navbar />

    {/* Hero Section */}
    <section
      className="h-screen flex flex-col justify-center items-center text-center bg-gradient-to-r from-blue-500 to-purple-600 text-white"
      id="hero"
    >
      <h1 className="text-5xl font-extrabold mb-6">
        Empowering Your Financial Journey
      </h1>
      <p className="text-lg mb-8 max-w-2xl">
        Welcome to the future of loan management! Take control of your
        finances with our intuitive and secure system.
      </p>
      <Link to="/home">
      <button className="bg-white text-blue-600 px-8 py-4 rounded-lg shadow-lg hover:scale-105 transition">
        Get Started Now
      </button>
      </Link>
    </section>

    {/* Features Section */}
    <section id="features" className="p-8 bg-white">
      <h2 className="text-3xl font-bold text-center text-blue-900 mb-12">
        Features That Make a Difference
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <FeatureCard
          icon={<FaMoneyBillWave className="text-blue-500 text-5xl" />}
          title="Add New Loan Record"
          description="Easily add loan details with automatic calculations for total payable amount."
        />
        <FeatureCard
          icon={<FaRegListAlt className="text-green-500 text-5xl" />}
          title="View Loan Records"
          description="List and filter loans by name, phone, or date with detailed information."
        />
        <FeatureCard
          icon={<FaEdit className="text-yellow-500 text-5xl" />}
          title="Edit Loan Records"
          description="Update loan details or mark loans as paid/unpaid."
        />
        <FeatureCard
          icon={<FaChartLine className="text-purple-500 text-5xl" />}
          title="Generate Reports"
          description="Get insights on earnings, overdue loans, and export data."
        />
        <FeatureCard
          icon={<FaBell className="text-red-500 text-5xl" />}
          title="Notifications"
          description="Receive alerts for due dates and overdue payments."
        />
        <FeatureCard
          icon={<FaUserShield className="text-indigo-500 text-5xl" />}
          title="User Authentication"
          description="Secure the system with user authentication and role-based access."
        />
      </div>
    </section>

    {/* Testimonials Section */}
    <section id="testimonials" className="p-8 bg-gradient-to-r from-purple-50 to-blue-50">
      <h2 className="text-3xl font-bold text-center text-blue-900 mb-12">
        What Our Clients Say
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <TestimonialCard
          name="John Doe"
          feedback="This system has completely transformed how we manage our loans. It's fast, reliable, and easy to use!"
        />
        <TestimonialCard
          name="Jane Smith"
          feedback="I can now track overdue payments effortlessly. Highly recommend this tool for businesses."
        />
        <TestimonialCard
          name="Robert Brown"
          feedback="The detailed reports have helped us identify trends and optimize our lending process. A must-have!"
        />
      </div>
    </section>

    {/* Footer */}
    <footer className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 text-center">
      <p className="text-sm">
        &copy; 2025 FinTrackr. All Rights Reserved.
      </p>
      <div className="mt-4 space-x-4">
        <BsFacebook className="inline-block text-xl hover:scale-110 transition cursor-pointer" />
        <BsTwitter className="inline-block text-xl hover:scale-110 transition cursor-pointer" />
        <BsInstagram className="inline-block text-xl hover:scale-110 transition cursor-pointer" />
        <BsLinkedin className="inline-block text-xl hover:scale-110 transition cursor-pointer" />
      </div>
    </footer>
  </div>
);

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white p-6 shadow-md rounded-lg text-center transition-transform transform hover:scale-105">
    <div className="mb-4">{icon}</div>
    <h4 className="text-lg font-bold mb-2 text-blue-900">{title}</h4>
    <p className="text-gray-700">{description}</p>
  </div>
);

const TestimonialCard = ({ name, feedback }) => (
  <div className="bg-white p-6 shadow-md rounded-lg transition-transform transform hover:scale-105">
    <p className="italic mb-4 text-gray-700">"{feedback}"</p>
    <h5 className="font-bold text-blue-900">- {name}</h5>
  </div>
);

export default LandingPage;
