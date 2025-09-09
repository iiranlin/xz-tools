/* eslint-disable no-undef */
import { EnterTheDetailService } from '@/services';
import { downloadBlobFile } from '@/utils/download';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, DatePicker } from 'antd';
import dayjs from 'dayjs';
import { useRef } from 'react';
import EditModal, { EditModalRef } from './component/EditModal';
import { CompanyType } from './type';
const Company: React.FC = () => {
  const actionRef = useRef<ActionType>();

  const modalRef = useRef<EditModalRef | null>(null);

  const searchColumns: ProColumns<{ date: string }>[] = [
    {
      title: '年',
      dataIndex: 'tradeDateYear',
      renderFormItem: () => {
        return <DatePicker.YearPicker format="YYYY" allowClear={false} />;
      },
      hideInTable: true,
      initialValue: dayjs(),
      search: {
        transform: (value: any) => dayjs(value).format('YYYY'),
      },
    },
    {
      title: '月',
      dataIndex: 'tradeDateMonth',
      valueType: 'select',
      initialValue: dayjs().format('M'),
      fieldProps: {
        options: [
          { label: '1月', value: '1' },
          { label: '2月', value: '2' },
          { label: '3月', value: '3' },
          { label: '4月', value: '4' },
          { label: '5月', value: '5' },
          { label: '6月', value: '6' },
          { label: '7月', value: '7' },
          { label: '8月', value: '8' },
          { label: '9月', value: '9' },
          { label: '10月', value: '10' },
          { label: '11月', value: '11' },
          { label: '12月', value: '12' },
        ],
      },
      hideInTable: true,
    },
  ];

  const columns: ProColumns<{ date: string }>[] = [
    ...searchColumns,
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index', // 使用带边框的索引列
      width: 80,
      align: 'center',
      render: (_, __, index, action) => {
        // 获取当前页码和每页条数
        const { current = 1, pageSize = 10 } = action?.pageInfo || {};

        // 计算序号：(当前页码 - 1) * 每页条数 + 当前行索引 + 1
        return (current - 1) * pageSize + index + 1;
      },
    },

    {
      title: '报表日期',
      align: 'center',
      dataIndex: 'name',
      ellipsis: true,
      hideInSearch: true,
      render: (_, record) => {
        return dayjs(record.date).format('MM月DD日');
      },
    },
    {
      title: '表名称',
      align: 'center',
      dataIndex: 'remark',
      ellipsis: true,
      hideInSearch: true,
      render: (_, record) => {
        return dayjs(record.date).format('YYYY年交易台账--MM月DD日');
      },
    },
    {
      width: 80,
      align: 'center',
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <Button
          type="link"
          key="edit"
          onClick={async () => {
            const date = dayjs(record.date);
            const formatted = date.format('YYYY-MM-DD');
            const res = await EnterTheDetailService.export({
              startDate: date.format('YYYY-01-01'),
              endDate: formatted,
            });
            downloadBlobFile(res.data, `${date.format('YYYY年交易台账-MM月DD日')}.xlsx`);
          }}
        >
          下载
        </Button>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<CompanyType, API.PageParams>
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 100,
        }}
        pagination={{
          defaultPageSize: 10,
        }}
        toolBarRender={false}
        request={EnterTheDetailService.getAllTransactionDates<{ date: string }>}
        // @ts-ignore
        columns={columns}
        columnEmptyText=""
        bordered
      />

      <EditModal ref={modalRef} actionRef={actionRef}></EditModal>
    </PageContainer>
  );
};

export default Company;
