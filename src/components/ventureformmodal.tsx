import React from "react";
import { Modal, Form, Input, Select, DatePicker } from "antd";

const { Option } = Select;

interface VentureFormModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  initialValues?: any;
}

const VentureFormModal: React.FC<VentureFormModalProps> = ({
  visible,
  onCancel,
  onSubmit,
  initialValues,
}) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  return (
    <Modal
      title={initialValues ? "Edit Venture" : "Add Venture"}
      open={visible}
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            onSubmit(values);
            form.resetFields();
          })
          .catch(() => {});
      }}
    >
      <Form form={form} layout="vertical" initialValues={initialValues}>
        <Form.Item
          name="name"
          label="Venture Name"
          rules={[{ required: true, message: "Please enter the venture name" }]}
        >
          <Input placeholder="Enter venture name" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: "Please enter a description" }]}
        >
          <Input.TextArea rows={3} placeholder="Describe your venture" />
        </Form.Item>

        <Form.Item name="industry" label="Industry">
          <Select placeholder="Select industry">
            <Option value="HealthTech">HealthTech</Option>
            <Option value="AgriTech">AgriTech</Option>
            <Option value="FinTech">FinTech</Option>
            <Option value="EdTech">EdTech</Option>
            <Option value="Other">Other</Option>
          </Select>
        </Form.Item>

        <Form.Item name="stage" label="Stage">
          <Select placeholder="Select stage">
            <Option value="Idea">Idea</Option>
            <Option value="Early Stage">Early Stage</Option>
            <Option value="Growth">Growth</Option>
            <Option value="Scaling">Scaling</Option>
          </Select>
        </Form.Item>

        <Form.Item name="website" label="Website">
          <Input placeholder="https://example.com" />
        </Form.Item>

        <Form.Item name="location" label="Location">
          <Input placeholder="City, Country" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default VentureFormModal;
