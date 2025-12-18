/* eslint-disable no-undef */
import { useResizableColumns } from '@/hooks/useResizableColumns';
import { BankService, CompanyService } from '@/services';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, Select } from 'antd';
import { useEffect, useRef, useState } from 'react';
import EditModal, { EditModalRef } from './component/EditModal';
import { BankType } from './type';

const Bank: React.FC = () => {
  const actionRef = useRef<ActionType>();

  const modalRef = useRef<EditModalRef | null>(null);

  // const onDelete = async (id: string) => {
  //   try {
  //     const res = await BankService.deleteCompany(id);
  //     if (res.success) {
  //       message.success('删除成功');
  //       actionRef.current?.reload();
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const [compnayList, setCompnayList] = useState<BankType[]>([]);
  const getCompanyList = async () => {
    const res = await CompanyService.getCompanyList<BankType>({ pageSize: 99999, current: 1 });
    if (res.success) {
      setCompnayList(res.data);
    }
  };
  useEffect(() => {
    getCompanyList();
  }, []);

  const columns: ProColumns<BankType>[] = [
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
      title: '公司名称',
      align: 'center',
      dataIndex: 'corporationId',
      ellipsis: true,
      hideInSearch: false,
      hideInTable: true,
      renderFormItem: () => {
        return (
          <Select
            placeholder="请选择公司名称"
            showSearch
            optionFilterProp="label"
            options={compnayList.map((x) => ({
              label: x.name,
              value: x.id,
            }))}
          />
        );
      },
    },
    {
      title: '公司名称',
      align: 'center',
      dataIndex: 'corporationName',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '银行名称',
      align: 'center',
      dataIndex: 'name',
      ellipsis: true,
      hideInSearch: false,
    },
    {
      title: '期初余额',
      align: 'center',
      dataIndex: 'initialValue',
      ellipsis: true,
      hideInSearch: true,
      width: 150,
      valueType: 'money',
    },
    {
      title: '银行卡号',
      align: 'center',
      dataIndex: 'cardNumber',
      ellipsis: true,
      copyable: true,
      hideInSearch: false,
      valueType: 'text',
      formItemProps: {
        // 使用 getValueFromEvent 在值更新到 Form state 之前进行处理
        getValueFromEvent: (event: React.ChangeEvent<HTMLInputElement>) => {
          const { value } = event.target;
          // 1. 移除非数字字符
          const numericValue = value.replace(/[^0-9]/g, '');
          // 2. 截断超过19位的数字 (实时限制最大长度)
          //    注意：这里只处理最大长度，最小长度的校验还是依赖 rules
          return numericValue.slice(0, 19);
        },
      },
    },
    {
      title: '备注',
      align: 'center',
      dataIndex: 'remark',
      ellipsis: true,
      hideInSearch: true,
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
          onClick={() => {
            modalRef.current?.showModal(record);
          }}
        >
          修改
        </Button>,
        // <Popconfirm
        //   key={'delete'}
        //   title="确定删除当前银行名称吗？"
        //   description=""
        //   onConfirm={() => onDelete(record.id || '')}
        //   onCancel={() => {}}
        //   okText="确定"
        //   cancelText="取消"
        // >
        //   <Button type="link" key="delete" danger>
        //     删除
        //   </Button>
        // </Popconfirm>,
      ],
    },
  ];

  const { columns: resizableColumns, components } = useResizableColumns(columns);

  return (
    <PageContainer>
      <ProTable<BankType, API.PageParams>
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 100,
        }}
        pagination={{
          defaultPageSize: 10,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              modalRef.current?.showModal({
                name: '',
                remark: '',
                id: null,
                cardNumber: undefined,
                corporationId: undefined,
                initialValue: undefined,
              });
            }}
          >
            <PlusOutlined /> 新增
          </Button>,
        ]}
        request={BankService.getBankList<BankType>}
        columns={resizableColumns}
        components={components}
        columnEmptyText=""
        bordered
      />

      <EditModal ref={modalRef} actionRef={actionRef} compnayList={compnayList}></EditModal>
    </PageContainer>
  );
};

export default Bank;
