import React, { useContext } from "react";
import { Button, Input, Form, Space } from "antd";
import {
  GoogleOutlined,
  FacebookOutlined,
  LockOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { ROUTES } from "../routes/routes";
import { AuthContext } from "../context/authcontext";

interface LoginFormValues {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
    const authContext = useContext(AuthContext); 

    console.log(authContext);
    
;

 

  return (
    <>
      <div className="min-h-screen flex flex-col md:flex-row">
        {/* Left side image (on top for small screens) */}
        <div className="w-full md:w-1/2 flex items-center justify-center relative">
          <img
            src="/images/im1.jpg"
            alt="Organization"
            className="w-full h-48 md:h-full object-cover"
          />

          {/* Gradient overlay (hidden on small, shown on md+) */}
          <div className="hidden md:block absolute inset-0 bg-gradient-to-br from-blue-600/60 to-indigo-700/60"></div>

          {/* Text overlay (hidden on small, shown on md+) */}
          <div className="hidden md:block absolute bottom-12 text-center px-8 text-white">
            <h2 className="text-3xl font-bold drop-shadow-lg">
              Welcome to AHH
            </h2>
            <p className="mt-2 text-sm opacity-90">
              Empowering organizations with modern solutions
            </p>
          </div>
        </div>

        {/* Right side form */}
        <div className="flex w-full md:w-1/2 justify-center items-center p-6 bg-gray-50">
          <div className="w-full max-w-md bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-2xl animate-fadeIn">
            <h1 className="text-3xl font-extrabold mb-2 text-center text-gray-800">
              Welcome Back
            </h1>

            <Form<LoginFormValues>
              name="login"
              layout="vertical"
              onFinish={authContext?.login}
              className="space-y-4"
            >
              <Form.Item
                name="email"
                rules={[{ required: true, message: "Please enter your email!" }]}
              >
                <Input
                  prefix={<MailOutlined className="text-gray-400" />}
                  placeholder="Email Address"
                  size="large"
                  className="rounded-lg"
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[{ required: true, message: "Please enter your password!" }]}
              >
                <Input.Password
                  prefix={<LockOutlined className="text-gray-400" />}
                  placeholder="Password"
                  size="large"
                  className="rounded-lg"
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
        
                  loading={authContext?.loading}
                  className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 shadow-md transition-transform transform hover:scale-[1.02]"
                >
                  {authContext?.loading ? "Logging in..." : "Login"}
                </Button>
              </Form.Item>
            </Form>

            <Space />
            <div className="flex items-center my-6">
              <hr className="flex-grow border-gray-300" />
              <span className="px-3 text-gray-400 text-sm">or login with</span>
              <hr className="flex-grow border-gray-300" />
            </div>

            
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
              Don’t have an account?{" "}
              <Link to={ROUTES.REGISTER} className="text-blue-600 hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
