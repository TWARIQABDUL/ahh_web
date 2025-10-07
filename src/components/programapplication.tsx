import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Form,
  Input,
  Button,
  Upload,
  message,
  Typography,
  Row,
  Col,
  Spin,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import axiosInstance from "../config/axiosConfig";

const ProgramApplication: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [program, setProgram] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch program details
  useEffect(() => {
    const fetchProgram = async () => {
      try {
        const res = await axiosInstance.get(`/programs/${id}`);
        setProgram(res.data);
      } catch (error) {
        console.error(error);
        message.error("Failed to load program details.");
      } finally {
        setLoading(false);
      }
    };
    fetchProgram();
  }, [id]);

  // ✅ Handle form submission
  const handleSubmit = async (values: any) => {
    try {
      // Example payload (adjust according to your backend)
      const payload = {
        program_id: program.program_id,
        full_name: values.fullName,
        email: values.email,
        venture: values.venture,
        website: values.website,
        proposal: values.proposal,
      };

      // TODO: Replace this with your actual POST endpoint for applications
      await axios.post("https://ahh-web-2.onrender.com/applications", payload);

      message.success("Application submitted successfully!");
      navigate("/programs");
    } catch (error) {
      console.error(error);
      message.error("Failed to submit application.");
    }
  };

  const handleUpload = (info: any) => {
    if (info.file.status === "done") {
      message.success(`${info.file.name} uploaded successfully`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} upload failed`);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (!program) {
    return (
      <div className="p-6">
        <Typography.Title level={3}>Program not found</Typography.Title>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex justify-center">
      <Card className="w-full max-w-2xl shadow-lg rounded-lg">
        <Typography.Title level={3} className="text-[var(--color-primary)]">
          Apply for {program.title}
        </Typography.Title>
        <p className="text-gray-600 mb-4">{program.description}</p>
        <p className="text-sm text-gray-500 mb-2">
          <strong>Duration:</strong> {program.duration}
        </p>
        <p className="text-sm text-gray-500 mb-2">
          <strong>Requirements:</strong> {program.requirements}
        </p>
        <p className="text-sm text-gray-500 mb-4">
          <strong>Benefits:</strong> {program.benefits}
        </p>
        <p className="text-sm text-gray-500 mb-6">
          Deadline:{" "}
          <strong>
            {new Date(program.application_deadline).toLocaleDateString()}
          </strong>
        </p>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          style={{ width: "100%" }}
        >
          {/* Full Name + Email */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Full Name"
                name="fullName"
                rules={[{ required: true, message: "Please enter your full name" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Email"
                name="email"
                rules={[{ required: true, type: "email", message: "Enter valid email" }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          {/* Venture Name + Website */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Venture Name"
                name="venture"
                rules={[{ required: true, message: "Enter your venture name" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Website" name="website">
                <Input placeholder="https://example.com" />
              </Form.Item>
            </Col>
          </Row>

          {/* Proposal */}
          <Form.Item
            label="Proposal / Motivation"
            name="proposal"
            rules={[{ required: true, message: "Please provide your proposal" }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          {/* Upload Files */}
          <Form.Item label="Upload Supporting Documents" name="documents">
            <Upload
              name="files"
              listType="picture"
              multiple
              maxCount={5}
              action="https://ahh-web-2.onrender.com/upload" // Replace with real upload endpoint
              onChange={handleUpload}
            >
              <Button icon={<UploadOutlined />}>Upload Files</Button>
            </Upload>
          </Form.Item>

          {/* Submit */}
          <div className="flex justify-end">
            <Button
              type="primary"
              htmlType="submit"
              className="bg-[var(--color-teal)] hover:!bg-[var(--color-primary)]"
            >
              Submit Application
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default ProgramApplication;
