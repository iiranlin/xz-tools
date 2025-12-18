/* eslint-disable no-undef */
import { useResizableColumns } from '@/hooks/useResizableColumns';
import {
  BankService,
  BusinessService,
  CompanyService,
  EnterTheDetailService,
  OtherCompanyService,
} from '@/services';
import { downloadBlobFile } from '@/utils/download';
import { DownloadOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns, ProFormInstance } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, DatePicker, message, Modal, Popconfirm, Select, Table } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useRef, useState } from 'react';
import { BankType } from '../Dict/Bank/type';
import { BusinessType } from '../Dict/BusinessType/type';
import { CompanyType } from '../Dict/Company/type';
import { OtherCompanyType } from '../Dict/OtherCompany/type';
import EditModal, { EditModalRef } from './component/EditModal';
import { EnterFormType } from './type';
const EnterTheDetail: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const formRef = useRef<ProFormInstance>();

  const modalRef = useRef<EditModalRef | null>(null);

  const [companyList, setCompanyList] = React.useState<CompanyType[]>([]);
  const [otherCompanyList, setOtherCompanyList] = React.useState<OtherCompanyType[]>([]);
  const [bankList, setBankList] = React.useState<BankType[]>([]);
  const [businessList, setBusinessList] = React.useState<BusinessType[]>([]);

  const params = {
    pageSize: 99999,
    current: 1,
  };

  const getOptions = async () => {
    const res = await Promise.all([
      CompanyService.getCompanyList<CompanyType>(params),
      OtherCompanyService.getCompanyList<OtherCompanyType>(params),
      // BankService.getBankList<BankType>(params),
      BusinessService.getBusinessList<BusinessType>(params),
    ]);

    setCompanyList(
      res[0]?.data?.map((x) => ({
        label: x.name,
        value: x.id,
        ...x,
      })),
    );
    setOtherCompanyList(
      res[1]?.data?.map((x) => ({
        label: x.name,
        value: x.id,
        ...x,
      })),
    );
    // setBankList(
    //   res[2]?.data?.map((x) => ({
    //     label: x.name,
    //     value: x.id,
    //     ...x,
    //   })),
    // );
    setBusinessList(
      res[2]?.data?.map((x) => ({
        label: x.name,
        value: x.id,
        ...x,
      })),
    );
  };
  const optionsList = {
    companyList,
    otherCompanyList,
    bankList,
    businessList,
  }; // 选项列

  useEffect(() => {
    getOptions();
  }, []);

  useEffect(() => {
    if (!formRef.current?.getFieldValue('tradeDateYear')) {
      formRef.current?.setFieldValue('tradeDateYear', new Date().getFullYear());
    }
  }, []);

  // Bank Service
  const fetchBankListByCorporation = async (corporationId?: string) => {
    if (!corporationId) {
      setBankList([]);
      return;
    }
    const res = await BankService.getBankList<BankType>({
      corporationId,
      pageSize: 99999,
      current: 1,
    });
    if (res.success) {
      setBankList(
        res.data?.map((x) => ({
          label: x.name,
          value: x.id,
          ...x,
        })) || [],
      );
    }
  };

  const searchColumns: ProColumns<EnterFormType>[] = [
    {
      title: '年',
      align: 'center',
      dataIndex: 'tradeDateYear',
      hideInTable: true,
      renderFormItem: () => {
        // @ts-ignore
        return <DatePicker.YearPicker allowClear={false} format="YYYY" />;
      },
      initialValue: dayjs(),
      search: {
        transform: (value: any) => dayjs(value).format('YYYY'),
      },
    },
    {
      title: '月',
      align: 'center',
      dataIndex: 'tradeDateMonth',
      hideInTable: true,
      renderFormItem: () => {
        return (
          <Select
            allowClear
            showSearch
            optionFilterProp="label"
            placeholder="请选择"
            options={[
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
            ]}
          />
        );
      },
    },
    {
      title: '公司名称',
      align: 'center',
      dataIndex: 'corporationId',
      valueType: 'select',
      hideInTable: true,
      renderFormItem: () => {
        return (
          <Select
            allowClear
            showSearch
            optionFilterProp="label"
            placeholder="请选择"
            options={companyList.map((item) => ({
              label: item.name,
              value: item.id,
            }))}
          />
        );
      },
    },
    {
      title: '银行名称',
      align: 'center',
      dataIndex: 'bankId',
      valueType: 'select',
      hideInTable: true,
      renderFormItem: () => {
        return (
          <Select
            allowClear
            showSearch
            optionFilterProp="label"
            placeholder="请选择"
            options={bankList}
          />
        );
      },
    },
    {
      title: '对手方名称',
      align: 'center',
      dataIndex: 'otherCorporationId',
      valueType: 'select',
      hideInTable: true,
      renderFormItem: () => {
        return (
          <Select
            allowClear
            showSearch
            optionFilterProp="label"
            placeholder="请选择"
            options={otherCompanyList.map((item) => ({
              label: item.name,
              value: item.id,
            }))}
          />
        );
      },
    },
    {
      title: '业务类型',
      align: 'center',
      dataIndex: 'businessTypeId',
      valueType: 'select',
      hideInTable: true,
      renderFormItem: () => {
        return (
          <Select
            allowClear
            showSearch
            optionFilterProp="label"
            placeholder="请选择"
            options={businessList.map((item) => ({
              label: item.name,
              value: item.id,
            }))}
          />
        );
      },
    },
  ];

  const columns: ProColumns<EnterFormType>[] = [
    ...searchColumns,
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index', // 使用带边框的索引列
      width: 80,
      align: 'center',
      fixed: 'left',
      render: (_, __, index, action) => {
        // 获取当前页码和每页条数
        const { current = 1, pageSize = 10 } = action?.pageInfo || {};

        // 计算序号：(当前页码 - 1) * 每页条数 + 当前行索引 + 1
        return (current - 1) * pageSize + index + 1;
      },
    },
    {
      title: '年',
      align: 'center',
      dataIndex: 'tradeDateYear',
      ellipsis: true,
      hideInSearch: true,
      fixed: 'left',
      width: 60,
    },
    {
      title: '月',
      align: 'center',
      dataIndex: 'tradeDateMonth',
      ellipsis: true,
      hideInSearch: true,
      fixed: 'left',
      width: 60,
    },

    {
      title: '日',
      align: 'center',
      dataIndex: 'tradeDateDay',
      ellipsis: true,
      hideInSearch: true,
      fixed: 'left',
      width: 60,
    },
    {
      title: '公司名称',
      align: 'center',
      dataIndex: 'corporationName',
      ellipsis: true,
      hideInSearch: true,
      width: 180,
    },
    {
      title: '银行名称',
      align: 'center',
      dataIndex: 'bankName',
      ellipsis: true,
      hideInSearch: true,
      width: 200,
    },
    {
      title: '对手方名称',
      align: 'center',
      dataIndex: 'otherCorporationName',
      ellipsis: true,
      hideInSearch: true,
      width: 180,
    },

    {
      title: '业务类型',
      align: 'center',
      dataIndex: 'businessTypeName',
      ellipsis: true,
      hideInSearch: true,
      width: 180,
    },
    {
      title: '备注',
      align: 'center',
      dataIndex: 'remark',
      ellipsis: true,
      hideInSearch: true,
      width: 180,
    },
    {
      title: '收入金额/元',
      align: 'center',
      dataIndex: 'incomeAmount',
      ellipsis: true,
      hideInSearch: true,
      width: 180,
      valueType: 'money',
      render: (value, record) => {
        return record.incomeAmount === 0 ? '' : value;
      },
    },
    {
      title: '支出金额/元',
      align: 'center',
      dataIndex: 'expenseAmount',
      ellipsis: true,
      hideInSearch: true,
      width: 180,
      valueType: 'money',
      render: (value, record) => {
        return record.expenseAmount === 0 ? '' : value;
      },
    },
    {
      width: 150,
      align: 'center',
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      fixed: 'right',
      render: (_, record) => [
        <Button
          type="link"
          key="edit"
          onClick={() => {
            modalRef.current?.showModal(record);
          }}
        >
          修改
        </Button>,
        <Popconfirm
          key={'delete'}
          title="确定删除当前交易明细吗？"
          description=""
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
          onConfirm={() => onDelete([record.id || ''])}
          onCancel={() => {}}
          okText="确定"
          cancelText="取消"
        >
          <Button type="link" key="delete" danger>
            删除
          </Button>
        </Popconfirm>,
      ],
    },
  ];

  const onDownload = async () => {
    const formValues = formRef.current?.getFieldsValue();
    const res = await EnterTheDetailService.exportDetails({
      ...formValues,
      tradeDateYear: dayjs(formValues?.tradeDateYear).format('YYYY'),
    });
    if (res.success) {
      // 文件流下载
      downloadBlobFile(res.data, '交易明细.xlsx');
      message.success('导出成功');
    }
  };

  const [summaryData, setSummaryData] = useState({
    incomeAmount: 0,
    expenseAmount: 0,
  });

  const [requestParams, setRequestParams] = useState({});
  const getSummary = async (params?: undefined | any) => {
    const res = await EnterTheDetailService.sumEnterTheDetails(params || requestParams);
    setSummaryData(
      res.data || {
        incomeAmount: 0,
        expenseAmount: 0,
      },
    );
  };

  const onInit = async () => {
    const res = await EnterTheDetailService.sumEnterTheDetails({
      tradeDateYear: dayjs().format('YYYY'),
    });
    setSummaryData(res.data);
  };
  useEffect(() => {
    onInit();
  }, []);

  const onDelete = async (ids: string[]) => {
    try {
      const res = await EnterTheDetailService.delete(ids);
      if (res.success) {
        message.success('删除成功');
        actionRef.current?.reload();
        getSummary();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [selectedRowKeys, setSelectedRowKeys] = React.useState<React.Key[]>([]);
  const handleBatchDelete = async () => {
    // 批量删除confirm 确认框
    Modal.confirm({
      title: '确定删除选中的明细吗？',
      content: '删除后无法恢复',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          const res = await EnterTheDetailService.delete(selectedRowKeys as string[]);
          if (res.success) {
            message.success('批量删除成功');
            setSelectedRowKeys([]);
            actionRef.current?.reload();
            getSummary();
          }
        } catch (error) {
          message.error('批量删除失败');
        }
      },
    });
  };

  // 应用列宽拖拽配置
  const { columns: resizableColumns, components } = useResizableColumns(columns);

  return (
    <PageContainer>
      <ProTable<EnterFormType, API.PageParams>
        actionRef={actionRef}
        rowKey="id"
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys,
        }}
        formRef={formRef}
        form={{
          onValuesChange: (changedValues) => {
            if (changedValues.corporationId) {
              fetchBankListByCorporation(changedValues.corporationId);
              // 还可以清空银行选择，防止脏数据
              formRef.current?.setFieldValue('bankId', undefined);
            }
          },
        }}
        scroll={{ x: 1300 }}
        search={{
          labelWidth: 100,
          defaultCollapsed: false,
        }}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              modalRef.current?.showModal({
                id: null,
                transactionType: 'income',
              });
            }}
          >
            <PlusOutlined /> 新增交易
          </Button>,
          <Button key="download" onClick={onDownload}>
            <DownloadOutlined /> 下载
          </Button>,
          <Button
            danger
            key="batchDelete"
            disabled={selectedRowKeys.length === 0}
            onClick={handleBatchDelete}
          >
            批量删除
          </Button>,
        ]}
        request={(params) => {
          setRequestParams(params);
          getSummary(params);

          return EnterTheDetailService.getList<EnterFormType>(params);
        }}
        summary={() => (
          <Table.Summary fixed>
            <Table.Summary.Row>
              {/* 前面合并单元格，用于展示“全部合计” */}
              <Table.Summary.Cell index={0} colSpan={columns.length - 8}>
                <div style={{ textAlign: 'left', fontWeight: 600 }}>全部合计：</div>
              </Table.Summary.Cell>

              {/* 收入金额列 */}
              <Table.Summary.Cell index={1}>
                <div
                  style={{
                    color: 'green',
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    textAlign: 'center',
                  }}
                >
                  {new Intl.NumberFormat('zh-CN', {
                    style: 'currency',
                    currency: 'CNY',
                  }).format(summaryData?.incomeAmount)}
                </div>
              </Table.Summary.Cell>

              {/* 支出金额列 */}
              <Table.Summary.Cell index={2}>
                <div
                  style={{
                    color: 'red',
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    textAlign: 'center',
                  }}
                >
                  {new Intl.NumberFormat('zh-CN', {
                    style: 'currency',
                    currency: 'CNY',
                  }).format(summaryData?.expenseAmount)}
                </div>
              </Table.Summary.Cell>

              {/* 操作列占位 */}
              <Table.Summary.Cell index={3} />
            </Table.Summary.Row>
          </Table.Summary>
        )}
        // onSubmit={getSummary}
        columns={resizableColumns}
        components={components}
        columnEmptyText=""
        bordered
      />

      <EditModal
        ref={modalRef}
        actionRef={actionRef}
        optionsList={optionsList}
        getSummary={getSummary}
      ></EditModal>
    </PageContainer>
  );
};

export default EnterTheDetail;
