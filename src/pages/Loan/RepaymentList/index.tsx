import React, { useEffect, useRef, useState } from 'react';
import { useResizableColumns } from '@/hooks/useResizableColumns';
import { ProTable } from '@ant-design/pro-components';
import { Select } from 'antd';
import { LoanInterestService } from '@/services'; // 自定义 API 路径
import type { ProColumns, ActionType } from '@ant-design/pro-components';
import type { FormInstance } from 'antd';
import dayjs from 'dayjs';
import useSearchOptions from '@/utils/hooks';

const LoanRepayment: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const formRef = useRef<FormInstance>();
  const { companyList, bankList, setSelectedCorporationId } = useSearchOptions();

  const [total, setTotal] = useState({
    principalAmount: 0,
    repayAmount: 0,
  });

  const fetchTotal = async (params: any) => {
    const res = await LoanInterestService.getTotal(params);
    setTotal(res?.data || {});
  };

  const columns: ProColumns<any>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      align: 'center',
      width: 80,
      render: (_, __, index, action) => {
        // 获取当前页码和每页条数
        const { current = 1, pageSize = 10 } = action?.pageInfo || {};

        // 计算序号：(当前页码 - 1) * 每页条数 + 当前行索引 + 1
        return (current - 1) * pageSize + index + 1;
      },
    },
    {
      title: '贷款公司',
      dataIndex: 'corporationId',
      valueType: 'select',
      hideInTable: true,
      align: 'center',
      renderFormItem: () => (
        <Select
          allowClear
          showSearch
          placeholder="请选择"
          optionFilterProp="label"
          options={companyList}
          onChange={(value: string) => {
            setSelectedCorporationId(value);
            formRef.current?.setFieldValue('bankId', undefined);
            formRef.current?.setFieldsValue({
              corporationId: value,
            });
          }}
        />
      ),
    },
    {
      title: '贷款银行',
      dataIndex: 'bankId',
      valueType: 'select',
      hideInTable: true,
      align: 'center',
      renderFormItem: () => (
        <Select
          allowClear
          showSearch
          placeholder="请选择"
          optionFilterProp="label"
          options={bankList}
        />
      ),
    },
    {
      title: '贷款日期',
      dataIndex: 'date',
      valueType: 'dateRange',
      hideInTable: true,
      align: 'center',
      initialValue: [dayjs().startOf('month'), dayjs().endOf('month')],
    },

    {
      title: '应还款日期',
      dataIndex: 'repayDate',
      align: 'center',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '还款总金额/元',
      dataIndex: 'total',
      align: 'center',
      hideInSearch: true,
      ellipsis: true,
      valueType: 'money',
    },
    {
      title: '还款公司',
      dataIndex: 'corporationName',
      align: 'center',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '还款银行',
      dataIndex: 'bankName',
      align: 'center',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '还款利息/元',
      dataIndex: 'repayAmount',
      align: 'center',
      hideInSearch: true,
      valueType: 'money',
      ellipsis: true,
    },
    {
      title: '还款本金',
      dataIndex: 'principalAmount',
      align: 'center',
      hideInSearch: true,
      valueType: 'money',
      ellipsis: true,
    },
  ];

  const { columns: resizableColumns, components } = useResizableColumns(columns);

  return (
    <ProTable
      actionRef={actionRef}
      formRef={formRef}
      rowKey="id"
      columns={resizableColumns}
      components={components}
      bordered
      scroll={{ x: 1300 }}
      columnEmptyText=""
      search={{ labelWidth: 100 }}
      pagination={{
        defaultPageSize: 10,
        showSizeChanger: true,
      }}
      request={async (params) => {
        let payload = { ...params };
        if (Array.isArray(payload.date) && payload.date.length === 2) {
          payload.startDate = payload.date[0]?.format?.('YYYY-MM-DD') || payload.date[0];
          payload.endDate = payload.date[1]?.format?.('YYYY-MM-DD') || payload.date[1];
          delete payload.date;
        }
        fetchTotal(payload);
        return LoanInterestService.getCompanyList(payload);
      }}
      summary={() => (
        <ProTable.Summary fixed>
          <ProTable.Summary.Row>
            <ProTable.Summary.Cell index={0} colSpan={2} align="center">
              <div style={{ fontWeight: 600 }}>合计</div>
            </ProTable.Summary.Cell>
            <ProTable.Summary.Cell index={1} align="center">
              {new Intl.NumberFormat('zh-CN', {
                style: 'currency',
                currency: 'CNY',
              }).format((total?.principalAmount || 0) + (total?.repayAmount || 0))}
            </ProTable.Summary.Cell>
            <ProTable.Summary.Cell index={3} />
            <ProTable.Summary.Cell index={4} />
            <ProTable.Summary.Cell index={5} align="center">
              {new Intl.NumberFormat('zh-CN', {
                style: 'currency',
                currency: 'CNY',
              }).format(total?.repayAmount || 0)}
            </ProTable.Summary.Cell>
            <ProTable.Summary.Cell index={6} align="center">
              <div style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                {new Intl.NumberFormat('zh-CN', {
                  style: 'currency',
                  currency: 'CNY',
                }).format(total?.principalAmount || 0)}
              </div>
            </ProTable.Summary.Cell>
          </ProTable.Summary.Row>
        </ProTable.Summary>
      )}
    />
  );
};

export default LoanRepayment;
