import React, { useEffect, useState } from 'react';
import {
  Table,
  Card,
  Spin,
  Typography,
  Button,
  Drawer,
  Tag,
  Input,
  Space,
  List,
} from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import axiosInstance from '../config/axiosConfig';

const { Title } = Typography;

interface Mentee {
  user_id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  created_at: string;
  is_approved: boolean;
  profile_details: string | null;
}

interface Venture {
  venture_id: number;
  venture_name: string;
  description: string;
  created_at: string;
}

interface MentorStatsResponse {
  potential_mentees: Mentee[];
}

const MymenteeComponet: React.FC = () => {
  const [mentees, setMentees] = useState<Mentee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [selectedMentee, setSelectedMentee] = useState<Mentee | null>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [ventures, setVentures] = useState<Venture[]>([]);
  const [venturesLoading, setVenturesLoading] = useState(false);

  useEffect(() => {
    axiosInstance
      .get<MentorStatsResponse>('/dashboard/mentor')
      .then((res) => {
        setMentees(res.data.potential_mentees || []);
      })
      .catch((err) => {
        console.error(err);
        setMentees([]);
      })
      .finally(() => setLoading(false));
  }, []);

  // Fetch ventures when a mentee is selected
  useEffect(() => {
    if (selectedMentee) {
      setVenturesLoading(true);
      axiosInstance
        .get<Venture[]>(`/dashboard/mentees/${selectedMentee.user_id}/ventures`)
        .then((res) => setVentures(res.data))
        .catch(() => setVentures([]))
        .finally(() => setVenturesLoading(false));
    }
  }, [selectedMentee]);

  // Filtered mentees based on search text
  const filteredMentees = mentees.filter(
    (m) =>
      m.first_name.toLowerCase().includes(searchText.toLowerCase()) ||
      m.last_name.toLowerCase().includes(searchText.toLowerCase()) ||
      m.email.toLowerCase().includes(searchText.toLowerCase())
  );

  // ✅ Type-safe columns definition
  const columns: ColumnsType<Mentee> = [
    {
      title: 'Name',
      dataIndex: 'first_name',
      key: 'name',
      sorter: (a, b) =>
        (a.first_name + a.last_name).localeCompare(
          b.first_name + b.last_name
        ),
      render: (_: string, record) =>
        `${record.first_name} ${record.last_name}`,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: (a, b) => a.email.localeCompare(b.email),
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search email"
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() => confirm()}
            style={{ marginBottom: 8, display: 'block' }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => confirm()}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              Search
            </Button>
            <Button onClick={() => clearFilters?.()} size="small" style={{ width: 90 }}>
              Reset
            </Button>
          </Space>
        </div>
      ),
      onFilter: (value, record) =>
        record.email.toLowerCase().includes((value as string).toLowerCase()),
    },
    {
      title: 'Joined',
      dataIndex: 'created_at',
      key: 'created_at',
      sorter: (a, b) =>
        new Date(a.created_at).getTime() -
        new Date(b.created_at).getTime(),
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button
          type="link"
          onClick={() => {
            setSelectedMentee(record);
            setDrawerVisible(true);
          }}
        >
          View Profile
        </Button>
      ),
    },
  ];

  return (
    <Card className="m-6">
      <Title level={4}>My Mentees</Title>
      <Input
        placeholder="Search by name or email"
        prefix={<SearchOutlined />}
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        style={{ width: 300, marginBottom: 16 }}
        allowClear
      />

      {loading ? (
        <div className="flex justify-center py-12">
          <Spin size="large" tip="Loading mentees..." />
        </div>
      ) : (
        <Table<Mentee>
          dataSource={filteredMentees}
          columns={columns}
          rowKey="user_id"
          pagination={{ pageSize: 6 }}
        />
      )}

      {/* Drawer for mentee details */}
      <Drawer
        title={
          selectedMentee
            ? `${selectedMentee.first_name} ${selectedMentee.last_name}`
            : 'Mentee Details'
        }
        open={drawerVisible}
        onClose={() => {
          setDrawerVisible(false);
          setSelectedMentee(null);
          setVentures([]);
        }}
        width={420}
      >
        {selectedMentee && (
          <div>
            <p>
              <strong>Email:</strong> {selectedMentee.email}
            </p>
            <p>
              <strong>Role:</strong> {selectedMentee.role}
            </p>
            <p>
              <strong>Joined:</strong>{' '}
              {new Date(selectedMentee.created_at).toLocaleDateString()}
            </p>
            <p>
              <strong>Approved:</strong>{' '}
              <Tag color={selectedMentee.is_approved ? 'green' : 'red'}>
                {selectedMentee.is_approved ? 'Yes' : 'No'}
              </Tag>
            </p>
            <div>
              <strong>Profile Details:</strong>
              <p className="mt-2 text-gray-600">
                {selectedMentee.profile_details || 'No details available.'}
              </p>
            </div>

            <div className="mt-4">
              <strong>Ventures:</strong>
              {venturesLoading ? (
                <Spin size="small" className="ml-2" />
              ) : ventures.length === 0 ? (
                <p className="text-gray-500 mt-2">No ventures found.</p>
              ) : (
                <List
                  size="small"
                  dataSource={ventures}
                  renderItem={(venture) => (
                    <List.Item key={venture.venture_id}>
                      <div>
                        <strong>{venture.venture_name}</strong>
                        <div className="text-xs text-gray-500">
                          {new Date(venture.created_at).toLocaleDateString()}
                        </div>
                        <div>{venture.description}</div>
                      </div>
                    </List.Item>
                  )}
                />
              )}
            </div>
          </div>
        )}
      </Drawer>
    </Card>
  );
};

export default MymenteeComponet;
