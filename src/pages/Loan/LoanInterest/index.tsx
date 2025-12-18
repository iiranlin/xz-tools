import React, { useRef, useState, useEffect } from 'react';
import { useResizableColumns } from '@/hooks/useResizableColumns';
import { ProTable } from '@ant-design/pro-components';
import { Button, Select, Modal, message, Popconfirm, Space } from 'antd';
import dayjs from 'dayjs';
import RepaymentTable from './component/RepaymentTable';
import { INTEREST_PERIOD_TYPE } from '@/utils/constants';
import { history } from '@umijs/max';
import { PlusOutlined } from '@ant-design/icons';
import { LoanService, LoanInterestService } from '@/services';
import useSearchOptions from '@/utils/hooks';

const LoanManagement: React.FC = () => {
  const actionRef = useRef<any>();
  const formRef = useRef<any>();
  const pagination = {
    pageSize: 99999,
    current: 1,
  };
  const { companyList, bankList, selectedCorporationId, setSelectedCorporationId } =
    useSearchOptions();

  // 删除贷款
  const handleDelete = async (id: string) => {
    try {
      const result = await LoanService.deleteCompany(id);
      if (result.success) {
        message.success('删除成功');
        actionRef.current?.reload();
      }
    } catch (error) {
      console.error('删除失败:', error);
    }
  };

  // 结束贷款
  const handleFinish = async (record: any) => {
    try {
      const result = await LoanService.updateCompany({
        ...record,
        status: 2,
      });
      if (result.success) {
        message.success('结束成功');
        actionRef.current?.reload();
      }
    } catch (error) {
      console.error('结束失败:', error);
    }
  };

  // 查看利息明细
  const showInterestDetail = async (record: any) => {
    try {
      const result = await LoanInterestService.getCompanyList({
        interestId: record.id,
        pageSize: 99999,
        current: 1,
      });

      Modal.confirm({
        centered: true,
        title: '利息明细',
        icon: null,
        content: <RepaymentTable datasource={result.data} />,
        width: 800,
        footer: (
          <Space style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={() => Modal.destroyAll()}>关闭</Button>
          </Space>
        ),
      });
    } catch (error) {
      console.error('获取利息明细失败:', error);
    }
  };

  // 搜索表单配置
  const searchColumns = [
    {
      title: '贷款公司',
      align: 'center' as const,
      dataIndex: 'corporationId',
      valueType: 'select' as const,
      hideInTable: true,
      renderFormItem: () => (
        <Select
          allowClear
          showSearch
          optionFilterProp="label"
          placeholder="请选择"
          onChange={(value: string) => {
            setSelectedCorporationId(value);
            formRef.current?.setFieldValue('bankId', undefined);
            formRef.current?.setFieldsValue({
              corporationId: value,
            });
          }}
          options={companyList.map((item) => ({
            label: item.name,
            value: item.id,
          }))}
        />
      ),
    },
    {
      title: '贷款银行',
      align: 'center' as const,
      dataIndex: 'bankId',
      valueType: 'select' as const,
      hideInTable: true,
      renderFormItem: () => (
        <Select
          allowClear
          showSearch
          optionFilterProp="label"
          placeholder="请选择"
          options={bankList}
        />
      ),
    },
    {
      title: '计息期限',
      align: 'center' as const,
      dataIndex: 'type',
      valueType: 'select' as const,
      hideInTable: true,
      renderFormItem: () => (
        <Select
          allowClear
          placeholder="请选择"
          options={Object.keys(INTEREST_PERIOD_TYPE).map((key) => ({
            label: INTEREST_PERIOD_TYPE[key as unknown as keyof typeof INTEREST_PERIOD_TYPE],
            value: key,
          }))}
        />
      ),
    },
    {
      title: '状态',
      align: 'center' as const,
      dataIndex: 'status',
      valueType: 'select' as const,
      hideInTable: true,
      renderFormItem: () => (
        <Select
          allowClear
          placeholder="请选择"
          options={[
            { label: '进行中', value: 1 },
            { label: '已结束', value: 2 },
          ]}
        />
      ),
    },
  ];

  // 表格列配置
  const tableColumns = [
    ...searchColumns,
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index' as const,
      width: 80,
      align: 'center' as const,
      render: (_: any, __: any, index: number, action: any) => {
        const { pageInfo = {} } = action || {};
        const { current = 1, pageSize = 10 } = pageInfo;
        return (current - 1) * pageSize + index + 1;
      },
    },
    {
      title: '贷款公司',
      align: 'center' as const,
      dataIndex: 'corporationName',
      ellipsis: true,
      hideInSearch: true,
      width: 200,
    },
    {
      title: '贷款银行',
      align: 'center' as const,
      dataIndex: 'bankName',
      ellipsis: true,
      hideInSearch: true,
      width: 200,
    },
    {
      title: '贷款金额',
      align: 'center' as const,
      dataIndex: 'loanAmount',
      ellipsis: true,
      hideInSearch: true,
      width: 140,
      valueType: 'money' as const,
    },
    {
      title: '计息期限',
      align: 'center' as const,
      dataIndex: 'type',
      ellipsis: true,
      hideInSearch: true,
      width: 120,
      renderText: (value: string) =>
        INTEREST_PERIOD_TYPE[value as unknown as keyof typeof INTEREST_PERIOD_TYPE],
    },
    {
      title: '贷款起始日期',
      align: 'center' as const,
      dataIndex: 'startDate',
      ellipsis: true,
      hideInSearch: true,
      width: 150,
    },
    {
      title: '贷款结束日期',
      align: 'center' as const,
      dataIndex: 'endDate',
      ellipsis: true,
      hideInSearch: true,
      width: 150,
    },
    {
      title: '贷款天数',
      align: 'center' as const,
      dataIndex: 'loanDays',
      ellipsis: true,
      hideInSearch: true,
      width: 120,
    },
    {
      title: '年利率',
      align: 'center' as const,
      dataIndex: 'annualInterestRate',
      ellipsis: true,
      hideInSearch: true,
      width: 120,
      renderText: (value: number) => `${value}%`,
    },
    {
      title: '总利息',
      align: 'center' as const,
      dataIndex: 'totalInterest',
      ellipsis: true,
      hideInSearch: true,
      width: 120,
      valueType: 'money' as const,
    },
    {
      title: '日利息/元',
      align: 'center' as const,
      dataIndex: 'dayInterest',
      ellipsis: true,
      hideInSearch: true,
      width: 120,
      valueType: 'money' as const,
    },
    {
      title: '应还款明细',
      align: 'center' as const,
      dataIndex: 'name',
      ellipsis: true,
      hideInSearch: true,
      width: 120,
      render: (_: any, record: any) => (
        <Button type="link" onClick={() => showInterestDetail(record)}>
          查看
        </Button>
      ),
    },
    {
      title: '创建人',
      align: 'center' as const,
      dataIndex: 'createBy',
      ellipsis: true,
      hideInSearch: true,
      width: 100,
    },
    {
      title: '创建时间',
      align: 'center' as const,
      dataIndex: 'createTime',
      ellipsis: true,
      hideInSearch: true,
      width: 200,
      render: (_: any, record: any) => {
        return record.createTime ? dayjs(record.createTime).format('YYYY-MM-DD HH:mm') : '';
      },
    },
    {
      width: 200,
      align: 'center' as const,
      title: '操作',
      dataIndex: 'option',
      valueType: 'option' as const,
      fixed: 'right' as const,
      render: (_: any, record: any) => {
        const actions = [
          <Popconfirm
            key="finish"
            title="确定结束当前贷款数据吗？"
            description="结束后将不能再修改"
            onConfirm={() => handleFinish(record)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link">结束</Button>
          </Popconfirm>,
          <Button
            key="edit"
            type="link"
            onClick={() => history.push(`/loan/addLogn?id=${record.id}`)}
          >
            修改
          </Button>,
          <Popconfirm
            key="delete"
            title="确定删除当前贷款利息数据吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger>
              删除
            </Button>
          </Popconfirm>,
        ];

        // 根据状态显示不同的操作按钮
        if (record.status === 1) {
          return actions;
        } else if (record.status === 2) {
          return [];
        }
        return [];
      },
    },
  ];

  const { columns: resizableColumns, components } = useResizableColumns(tableColumns);

  return (
    <div className="page-container">
      <ProTable
        actionRef={actionRef}
        formRef={formRef}
        rowKey="id"
        search={{
          labelWidth: 100,
          defaultCollapsed: false,
        }}
        pagination={{
          defaultPageSize: 10,
        }}
        scroll={{ x: 1300 }}
        toolBarRender={() => [
          <Button key="primary" type="primary" onClick={() => history.push('/loan/addLogn')}>
            <PlusOutlined /> 新增贷款
          </Button>,
        ]}
        request={LoanService.getList}
        columns={resizableColumns}
        components={components}
        columnEmptyText=""
        bordered
      />
    </div>
  );
};

export default LoanManagement;
