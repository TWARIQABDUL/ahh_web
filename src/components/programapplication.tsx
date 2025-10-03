import React from "react";
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
} from "antd";
import { UploadOutlined } from "@ant-design/icons";

// Reuse same programs data for demo
const programs = [
  {
    id: "1",
    title: "Healthcare Innovation Challenge",
    description: "Submit your ideas to transform healthcare delivery in Africa.",
    deadline: "2025-11-30",
    status: "Open",
  },
  {
    id: "2",
    title: "Women in Tech Fellowship",
    description: "Empowering women innovators with mentorship and funding.",
    deadline: "2025-12-15",
    status: "Upcoming",
  },
];

const ProgramApplication: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const program = programs.find((p) => p.id === id);

  const handleSubmit = (values: any) => {
    console.log("Application Submitted:", { programId: id, ...values });
    message.success("Application submitted successfully!");
    navigate("/programs"); // redirect back after submit
  };

  const handleUpload = (info: any) => {
    if (info.file.status === "done") {
      message.success(`${info.file.name} uploaded successfully`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} upload failed`);
    }
  };

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
        <p className="text-sm text-gray-500 mb-6">
          Deadline: <strong>{program.deadline}</strong>
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

          {/* ✅ Upload Multiple Documents with Preview */}
          <Form.Item label="Upload Supporting Documents" name="documents">
            <Upload
              name="files"
              listType="picture"
              multiple
              maxCount={5}
              action="/upload" // TODO: replace with backend API
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
              className="bg-[var(--color-teal)]"
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
