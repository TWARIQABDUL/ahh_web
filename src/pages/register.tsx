import React, { useState } from "react";
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

  const baseUrl = import.meta.env.VITE_BASE_URL
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm<RegisterFormValues>();

  const onFinish = async (values: RegisterFormValues) => {
    setLoading(true);

    const nameParts = values.fullName.trim().split(" ");
    const first_name = nameParts[0];
    const last_name = nameParts.slice(1).join(" ");

    const payload = {
      email: values.email,
      first_name,
      last_name,
      password: values.password,
      profile_details: values.profile_details,
      role: "Member",
    };

    try {
      const response = await fetch(
        `${baseUrl}/auth/signup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (response.ok) {
        message.success("Registration successful!");
        navigate(ROUTES.LOGIN);
      } else {
        // ✅ Handle field-specific errors
        if (data.detail && data.detail.toLowerCase().includes("email")) {
          form.setFields([
            {
              name: "email",
              errors: [data.detail],
            },
          ]);
        } else if (data.errors && Array.isArray(data.errors)) {
          data.errors.forEach((err: string) =>
            message.error(err)
          );
        } else if (typeof data.message === "string") {
          message.error(data.message);
        } else {
          message.error("Registration failed. Please check your details.");
        }
      }
    } catch (error) {
      message.error("Network error. Please try again.");
    } finally {
      setLoading(false);
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
        <div className="hidden md:block absolute inset-0 bg-gradient-to-br from-blue-600/60 to-indigo-700/60"></div>
        <div className="hidden md:block absolute bottom-12 text-center px-8 text-white">
          <h2 className="text-3xl font-bold drop-shadow-lg">Welcome to AHH</h2>
          <p className="mt-2 text-sm opacity-90">
            Empowering organizations with modern solutions
          </p>
        </div>
      </div>

      {/* Right side form */}
      <div className="flex w-full md:w-1/2 justify-center items-center p-6 bg-gray-50">
        <div className="w-full max-w-lg bg-white/90 backdrop-blur-sm p-10 rounded-2xl shadow-2xl">
          <h1 className="text-3xl font-extrabold mb-2 text-center text-gray-800">
            Create an Account
          </h1>
          <p className="text-center text-gray-500 mb-8">
            Join <span className="font-semibold">AHH</span> today
          </p>

          <Form<RegisterFormValues>
            form={form}
            name="register"
            layout="vertical"
            onFinish={onFinish}
            className="space-y-4"
          >
            {/* Full Name + Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Form.Item
                name="fullName"
                rules={[{ required: true, message: "Please enter your full name!" }]}
              >
                <Input prefix={<UserOutlined />} placeholder="Full Name" size="large" />
              </Form.Item>

              <Form.Item
                name="phone"
                rules={[{ required: true, message: "Please enter your phone number!" }]}
              >
                <Input prefix={<PhoneOutlined />} placeholder="+250 7xx xxx xxx" size="large" />
              </Form.Item>
            </div>

            {/* Email + Gender */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: "Please enter your email!" },
                  { type: "email", message: "Please enter a valid email!" },
                ]}
              >
                <Input prefix={<MailOutlined />} placeholder="Email Address" size="large" />
              </Form.Item>

              <Form.Item
                name="gender"
                rules={[{ required: true, message: "Please select your gender!" }]}
              >
                <Select size="large" placeholder="Select Gender">
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
              <Input.TextArea rows={4} placeholder="Profile details..." />
            </Form.Item>

            {/* Password */}
            <Form.Item
              name="password"
              rules={[{ required: true, message: "Please enter your password!" }]}
              hasFeedback
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Password" size="large" />
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
              <Input.Password prefix={<LockOutlined />} placeholder="Confirm Password" size="large" />
            </Form.Item>

            {/* Submit */}
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={loading}
                className="w-full rounded-lg bg-blue-600 hover:bg-blue-700"
              >
                {loading ? "Registering..." : "Register"}
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
            <Button icon={<GoogleOutlined />} size="large" className="flex-1">
              Google
            </Button>
            <Button icon={<FacebookOutlined />} size="large" className="flex-1">
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
