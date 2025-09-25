import React from "react";
import { Button, Input, Form, Select, message } from "antd";
import {
  GoogleOutlined,
  FacebookOutlined,
  LockOutlined,
  MailOutlined,
  UserOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "../routes/routes.";

const { Option } = Select;

interface RegisterFormValues {
  fullName: string;
  phone: string;
  email: string;
  gender: string;
  password: string;
  confirmPassword: string;
  profile_details: string;
}

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  const onFinish = async (values: RegisterFormValues) => {
    const nameParts = values.fullName.trim().split(" ");
    const first_name = nameParts[0];
    const last_name = nameParts.slice(1).join(" ");

    const payload = {
      email: values.email,
      first_name: first_name,
      last_name: last_name,
      password: values.password,
      profile_details: values.profile_details,
      role: "Member",
    };

    try {
      const response = await fetch(
        "https://ahh-backend.onrender.com/auth/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        message.success("Registration successful!");
        navigate(ROUTES.LOGIN);
      } else {
        const errorData = await response.json();
        message.error(errorData.message || "Registration failed.");
      }
    } catch (error) {
      message.error("An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side image */}
      <div className="w-full md:w-1/2 relative">
        <img
          src="/images/im1.jpg"
          alt="Organization"
          className="w-full h-48 md:h-full object-cover"
        />

        {/* Gradient overlay for better text readability */}
        <div className="hidden md:block absolute inset-0 bg-gradient-to-br from-blue-600/60 to-indigo-700/60"></div>

        {/* Text overlay */}
        <div className="hidden md:block absolute bottom-12 text-center px-8 text-white">
          <h2 className="text-3xl font-bold drop-shadow-lg">Welcome to AHH</h2>
          <p className="mt-2 text-sm opacity-90">
            Empowering organizations with modern solutions
          </p>
        </div>
      </div>

      {/* Right side form */}
      <div className="flex w-full md:w-1/2 justify-center items-center p-6 bg-gray-50">
        {/* Increased max-w from md → lg */}
        <div className="w-full max-w-lg bg-white/90 backdrop-blur-sm p-10 rounded-2xl shadow-2xl">
          <h1 className="text-3xl font-extrabold mb-2 text-center text-gray-800">
            Create an Account
          </h1>
          <p className="text-center text-gray-500 mb-8">
            Join <span className="font-semibold">AHH</span> today
          </p>

          <Form<RegisterFormValues>
            name="register"
            layout="vertical"
            onFinish={onFinish}
            className="space-y-4"
          >
            {/* Row 1: Full Name + Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Form.Item
                name="fullName"
                rules={[{ required: true, message: "Please enter your full name!" }]}
              >
                <Input
                  prefix={<UserOutlined className="text-gray-400" />}
                  placeholder="Full Name"
                  size="large"
                  className="rounded-lg"
                />
              </Form.Item>

              <Form.Item
                name="phone"
                rules={[{ required: true, message: "Please enter your phone number!" }]}
              >
                <Input
                  prefix={<PhoneOutlined className="text-gray-400" />}
                  placeholder="+250 7xx xxx xxx"
                  size="large"
                  className="rounded-lg"
                />
              </Form.Item>
            </div>

            {/* Row 2: Email + Gender */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: "Please enter your email!" },
                  { type: "email", message: "Please enter a valid email!" },
                ]}
              >
                <Input
                  prefix={<MailOutlined className="text-gray-400" />}
                  placeholder="Email Address"
                  size="large"
                  className="rounded-lg"
                />
              </Form.Item>

              <Form.Item
                name="gender"
                rules={[{ required: true, message: "Please select your gender!" }]}
              >
                <Select size="large" placeholder="Select Gender" className="rounded-lg">
                  <Option value="Male">Male</Option>
                  <Option value="Female">Female</Option>
                </Select>
              </Form.Item>
            </div>
            
            {/* Profile Details */}
            <Form.Item
              name="profile_details"
              rules={[{ required: true, message: "Please enter your profile details!" }]}
            >
              <Input.TextArea
                placeholder="Profile Details (e.g., Experienced entrepreneur in healthcare)"
                size="large"
                className="rounded-lg"
                rows={4}
              />
            </Form.Item>

            {/* Password */}
            <Form.Item
              name="password"
              rules={[{ required: true, message: "Please enter your password!" }]}
              hasFeedback
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="Password"
                size="large"
                className="rounded-lg"
              />
            </Form.Item>

            {/* Confirm Password */}
            <Form.Item
              name="confirmPassword"
              dependencies={["password"]}
              hasFeedback
              rules={[
                { required: true, message: "Please confirm your password!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Passwords do not match!"));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="Confirm Password"
                size="large"
                className="rounded-lg"
              />
            </Form.Item>

            {/* Submit */}
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 shadow-md transition-transform transform hover:scale-[1.02]"
              >
                Register
              </Button>
            </Form.Item>
          </Form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <hr className="flex-grow border-gray-300" />
            <span className="px-3 text-gray-400 text-sm">or register with</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          {/* Social buttons */}
          <div className="flex gap-4">
            <Button
              icon={<GoogleOutlined />}
              size="large"
              className="flex-1 rounded-lg border border-gray-200 shadow-sm hover:bg-red-50 text-red-500"
            >
              Google
            </Button>
            <Button
              icon={<FacebookOutlined />}
              size="large"
              className="flex-1 rounded-lg border border-gray-200 shadow-sm hover:bg-blue-50 text-blue-600"
            >
              Facebook
            </Button>
          </div>

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link to={ROUTES.LOGIN} className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
