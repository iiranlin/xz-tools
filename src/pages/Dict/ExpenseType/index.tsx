/* eslint-disable no-undef */
import { useResizableColumns } from '@/hooks/useResizableColumns';
import { ExpenseTypeService } from '@/services';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, message } from 'antd';
import { useRef } from 'react';
import EditModal, { EditModalRef } from './component/EditModal';
import { ExpenseType } from './type';
const Blongproject: React.FC = () => {
  const actionRef = useRef<ActionType>();

  const modalRef = useRef<EditModalRef | null>(null);

  const columns: ProColumns<ExpenseType>[] = [
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
      title: '费用类型名称',
      align: 'center',
      dataIndex: 'costTypeName',
      ellipsis: true,
      hideInSearch: false,
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
        //   title="确定删除当前业务类型吗？"
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
      <ProTable<ExpenseType, API.PageParams>
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
              modalRef.current?.showModal({ costTypeName: '', remark: '', id: null });
            }}
          >
            <PlusOutlined /> 新增
          </Button>,
        ]}
        request={ExpenseTypeService.getExpenseTypeList<ExpenseType>}
        columns={resizableColumns}
        components={components}
        columnEmptyText=""
        bordered
      />

      <EditModal ref={modalRef} actionRef={actionRef}></EditModal>
    </PageContainer>
  );
};

export default Blongproject;
