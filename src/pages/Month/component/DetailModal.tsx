import { EnterTheDetailService } from '@/services';
import { downloadBlobFile } from '@/utils/download';
import type { ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Button, Modal } from 'antd';
import dayjs from 'dayjs';
import React, { useImperativeHandle, useState } from 'react';
import { StyleType } from '../type';

export interface DetailModalRef {
  showModal: (params: DownloadParams) => void;
}

interface DownloadParams {
  tradeDateYear: string;
  tradeDateMonth: number | null;
  businessTypeId: string;
  businessTypeName: string;
  type: number;
  style: StyleType;
}

const DetailModal: React.FC<{
  ref: any;
}> = React.forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false);
  const [params, setParams] = useState<DownloadParams>({
    tradeDateYear: '',
    tradeDateMonth: null,
    businessTypeId: '',
    type: 1,
    businessTypeName: '',
    style: StyleType.MergeStyle,
  });

  const showModal = (newParams: DownloadParams) => {
    setParams(newParams);
    setVisible(true);
  };

  useImperativeHandle(ref, () => ({
    showModal,
  }));

  const columns: ProColumns<any>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      width: 60,
      align: 'center',
    },
    {
      title: '年',
      dataIndex: 'tradeDate',
      valueType: 'date',
      width: 80,
      align: 'center',
      render: (_, record) => dayjs(record.tradeDate).format('YYYY'),
    },
    {
      title: '月',
      dataIndex: 'tradeDate',
      valueType: 'date',
      width: 60,
      align: 'center',
      render: (_, record) => dayjs(record.tradeDate).format('M'),
    },
    {
      title: '日',
      dataIndex: 'tradeDate',
      valueType: 'date',
      width: 60,
      align: 'center',
      render: (_, record) => dayjs(record.tradeDate).format('D'),
    },
    {
      title: '公司名称',
      dataIndex: 'corporationName',
      align: 'center',
    },
    {
      title: '对手方名称',
      dataIndex: 'otherCorporationName',
      align: 'center',
    },
    {
      title: '银行名称',
      dataIndex: 'bankName',
      align: 'center',
    },
    {
      title: '业务类型',
      dataIndex: 'businessTypeName',
      align: 'center',
    },
    {
      title: '备注',
      dataIndex: 'remark',
      align: 'center',
    },
    {
      title: '交易金额/元',
      valueType: 'money',
      align: 'center',
      renderText: (_, record) =>
        new Intl.NumberFormat('zh-CN', {
          style: 'currency',
          currency: 'CNY',
        }).format((Number(record.incomeAmount) || 0) + (Number(record.expenseAmount) || 0)),
    },
  ];

  const handleDownload = async () => {
    const res = await EnterTheDetailService.exportDetails(params as any);
    if (res.success) {
      downloadBlobFile(
        res.data,
        `${params.tradeDateYear}年${params.tradeDateMonth ? `${params.tradeDateMonth}月` : ''}${
          params.businessTypeName
        }${params.type === 1 ? '收入' : '支出'}明细.xlsx`,
      );
    }
  };

  return (
    <Modal
      title={`${params.type === 1 ? '收入' : '支出'}明细`}
      open={visible}
      onCancel={() => setVisible(false)}
      width={1200}
      footer={[
        <Button key="close" onClick={() => setVisible(false)}>
          关闭
        </Button>,
        <Button key="download" type="primary" onClick={handleDownload}>
          下载
        </Button>,
      ]}
    >
      <ProTable
        rowKey="id"
        search={false}
        toolBarRender={false}
        columns={columns}
        params={params}
        request={async (p) => {
          // Pass formatted params to backend
          return EnterTheDetailService.getList({
            ...p,
            tradeDateYear: params.tradeDateYear,
            tradeDateMonth: params.tradeDateMonth,
            businessTypeId: params.businessTypeId,
            type: params.type,
          });
        }}
        pagination={{
          defaultPageSize: 10,
        }}
      />
    </Modal>
  );
});

export default DetailModal;
