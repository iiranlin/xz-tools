import { EnterTheDetailService } from '@/services';
import { downloadBlobFile } from '@/utils/download';
import { Button, Modal, Table } from 'antd';
import React, { useEffect } from 'react';
import { AccountData } from '..';
const formatCurrency = (value: number) =>
  new Intl.NumberFormat('zh-CN', { style: 'currency', currency: 'CNY' }).format(value);

interface ExcelModalProps {
  visible: boolean;
  onCancel: () => void;
  searchParams: any;
}

const ExcelModal: React.FC<ExcelModalProps> = ({ visible, onCancel, searchParams }) => {
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState<AccountData[]>([]);

  // 弹窗打开时获取数据
  useEffect(() => {
    if (visible) {
      fetchData();
    }
  }, [visible, searchParams]);

  // 使用新接口获取数据
  const fetchData = async () => {
    setLoading(true);
    const res = await EnterTheDetailService.exportMonthlyReport<AccountData>(searchParams).finally(
      () => setLoading(false),
    );
    setData(res.data || []);
  };

  // 按公司分组
  const groupByCorporation = (list: AccountData[]) => {
    const map: Record<string, AccountData[]> = {};
    list.forEach((item) => {
      if (!map[item.corporationName]) map[item.corporationName] = [];
      map[item.corporationName].push(item);
    });
    return map;
  };

  const grouped = groupByCorporation(data);
  const corporationNames = Object.keys(grouped);

  // 生成表格数据
  let tableData: any[] = [];
  let totalBalance = 0;

  // 统计每个公司下银行的数量
  const corpRowSpans: Record<string, number> = {};
  corporationNames.forEach((corp) => {
    corpRowSpans[corp] = grouped[corp].length + 1; // 银行数+合计行
  });

  corporationNames.forEach((corp) => {
    const rows = grouped[corp];
    let corpBalance = 0;
    rows.forEach((row, idx) => {
      corpBalance += row.balance;
      tableData.push({
        key: `${corp}-${row.bankId}`,
        corporationName: corp,
        bankName: row.bankName,
        balance: row.balance,
        isSummary: false,
        rowSpan: idx === 0 ? rows.length : 0,
      });
    });
    tableData.push({
      key: `${corp}-summary`,
      corporationName: corp + '合计',
      bankName: '',
      balance: corpBalance,
      isSummary: true,
      rowSpan: 1,
    });
    totalBalance += corpBalance;
  });

  // 总合计行
  tableData.push({
    key: 'total-summary',
    corporationName: '各公司资金总额统计',
    bankName: '',
    balance: totalBalance,
    isSummary: true,
  });

  const columns = [
    {
      title: '公司',
      dataIndex: 'corporationName',
      render: (text: string, row: any) => {
        if (row.isSummary && text !== '各公司资金总额统计') {
          return (
            <span style={{ color: '#fff', background: '#52c41a', padding: '0 8px' }}>{text}</span>
          );
        }
        if (text === '各公司资金总额统计') {
          return (
            <span style={{ color: '#fff', background: '#1890ff', padding: '0 8px' }}>{text}</span>
          );
        }
        return text;
      },
      onCell: (row: any) => {
        // 合计行合并前两列
        if (row.isSummary && row.corporationName.endsWith('合计')) {
          return { colSpan: 2, rowSpan: row.rowSpan };
        }
        if (row.rowSpan !== undefined) {
          return { rowSpan: row.rowSpan };
        }
        return {};
      },
    },
    {
      title: '银行',
      dataIndex: 'bankName',
      render: (text: string, row: any) => {
        // 合计行隐藏银行单元格
        if (row.isSummary && row.corporationName.endsWith('合计')) {
          return { children: '', props: { colSpan: 0 } };
        }
        return row.isSummary ? '' : `${row.corporationName} - ${text}`;
      },
    },
    {
      title: '结存金额',
      dataIndex: 'balance',
      render: (text: any, row: any) =>
        row.isSummary ? <b>{formatCurrency(text)}</b> : formatCurrency(text),
    },
  ];

  // 导出功能（调用后端接口下载文件）
  const handleDownload = async () => {
    setLoading(true);
    const res = await EnterTheDetailService.exportExcelModal(searchParams).finally(() =>
      setLoading(false),
    );
    downloadBlobFile(res.data, '账户余额统计.xlsx');
  };

  return (
    <Modal
      title="账户余额统计"
      open={visible}
      onCancel={onCancel}
      width={800}
      footer={[
        <Button key="close" onClick={onCancel}>
          关闭
        </Button>,
        <Button key="download" type="primary" onClick={handleDownload}>
          下载
        </Button>,
      ]}
    >
      <Table
        loading={loading}
        scroll={{ y: 700 }}
        columns={columns}
        dataSource={tableData}
        pagination={false}
        bordered
        rowClassName={(row) => (row.isSummary ? 'summary-row' : '')}
      />
    </Modal>
  );
};

export default ExcelModal;
