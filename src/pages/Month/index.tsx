/* eslint-disable no-undef */
import { EnterTheDetailService } from '@/services';
import { downloadBlobFile } from '@/utils/download';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  PageContainer,
  ProFormDatePicker,
  ProTable,
  QueryFilter,
} from '@ant-design/pro-components';
import { Button } from 'antd';
import dayjs from 'dayjs';
import { useRef, useState } from 'react';
import DetailModal, { DetailModalRef } from './component/DetailModal';
import { MonthSearchParams, MonthType } from './type';

const Company: React.FC = () => {
  const incomeActionRef = useRef<ActionType>();
  const expenseActionRef = useRef<ActionType>();

  const detailModalRef = useRef<DetailModalRef | null>(null);

  const [year, setYear] = useState<string>(dayjs().format('YYYY'));

  const getColumns = (type: number): ProColumns<MonthType>[] => {
    // 动态生成月份列
    const monthColumns: ProColumns<MonthType>[] = [];

    for (let i = 1; i <= 12; i++) {
      monthColumns.push({
        title: `${i}月`,
        align: 'center',
        dataIndex: `month${i}` as keyof MonthType,
        ellipsis: true,
        width: 150,
        hideInSearch: true,
        render: (_, record) => {
          const amount = record[`month${i}` as keyof MonthType];
          // @ts-ignore
          if (!amount || amount === 0) {
            return '0';
          }
          return (
            <Button
              type="link"
              onClick={() => {
                detailModalRef.current?.showModal({
                  tradeDateYear: year,
                  tradeDateMonth: i,
                  businessTypeId: record.businessTypeId,
                  type,
                  businessTypeName: record.businessTypeName,
                });
              }}
            >
              {new Intl.NumberFormat('zh-CN', {
                style: 'currency',
                currency: 'CNY',
              }).format(+amount)}
            </Button>
          );
        },
      });
    }

    return [
      {
        title: '序号',
        dataIndex: 'index',
        valueType: 'index', // 使用带边框的索引列
        width: 80,
        fixed: 'left',
        align: 'center',
        render: (_, __, index, action) => {
          // 获取当前页码和每页条数
          const { current = 1, pageSize = 10 } = action?.pageInfo || {};

          // 计算序号：(当前页码 - 1) * 每页条数 + 当前行索引 + 1
          return (current - 1) * pageSize + index + 1;
        },
      },
      {
        title: '业务类型',
        align: 'center',
        dataIndex: 'businessTypeName',
        fixed: 'left',
        ellipsis: true,
        hideInSearch: true,
        width: 150,
      },
      ...monthColumns,
      // 年度合计
      {
        title: '年度合计',
        align: 'center',
        dataIndex: 'total',
        ellipsis: true,
        hideInSearch: true,
        fixed: 'right',
        width: 150,
        render: (_, record) => {
          const amount = record.total;
          // @ts-ignore
          if (!amount || amount === 0) {
            return '0';
          }
          return (
            <Button
              type="link"
              onClick={() => {
                detailModalRef.current?.showModal({
                  tradeDateYear: year,
                  tradeDateMonth: null,
                  businessTypeId: record.businessTypeId,
                  type,
                  businessTypeName: record.businessTypeName,
                });
              }}
            >
              {new Intl.NumberFormat('zh-CN', {
                style: 'currency',
                currency: 'CNY',
              }).format(+amount)}
            </Button>
          );
        },
      },
    ];
  };

  return (
    <PageContainer>
      <QueryFilter<{
        year: string;
      }>
        style={{ backgroundColor: '#fff', marginBottom: 16 }}
        onFinish={async (values) => {
          setYear(dayjs(values.year).format('YYYY'));
        }}
        onReset={async () => {
          setYear(dayjs().format('YYYY'));
        }}
        initialValues={{
          year: dayjs(),
        }}
      >
        <ProFormDatePicker
          name="year"
          label="年"
          fieldProps={{
            format: 'YYYY',
            picker: 'year',
            allowClear: false,
          }}
        />
      </QueryFilter>

      <ProTable<MonthType, API.PageParams & MonthSearchParams>
        actionRef={incomeActionRef}
        rowKey="id"
        search={false}
        pagination={{
          defaultPageSize: 10,
        }}
        //  x轴滚动
        scroll={{ x: 1200 }}
        title={() => <h2>收入</h2>}
        toolBarRender={() => [
          <Button
            key="export"
            type="primary"
            onClick={async () => {
              const res = await EnterTheDetailService.exportMonth({
                year,
              } as any);
              if (res.success) {
                downloadBlobFile(res.data, `${year}月度统计.xlsx`);
              }
            }}
          >
            月度收支统计导出
          </Button>,
        ]}
        params={{ year } as any}
        request={(params) => EnterTheDetailService.getMonth<MonthType>({ ...params, type: 1 })}
        // @ts-ignore
        columns={getColumns(1)}
        columnEmptyText=""
        bordered
      />

      <ProTable<MonthType, API.PageParams & MonthSearchParams>
        actionRef={expenseActionRef}
        rowKey="id"
        search={false}
        pagination={{
          defaultPageSize: 10,
        }}
        //  x轴滚动
        scroll={{ x: 1200 }}
        title={() => <h2>支出</h2>}
        params={{ year } as any}
        request={(params) => EnterTheDetailService.getMonth<MonthType>({ ...params, type: 2 })}
        // @ts-ignore
        columns={getColumns(2)}
        columnEmptyText=""
        bordered
      />

      <DetailModal ref={detailModalRef} />
    </PageContainer>
  );
};

export default Company;
