import { BankType } from '@/pages/Dict/Bank/type';
import { BankService } from '@/services';
import type { FormInstance } from 'antd';
import { DatePicker, Form, Input, InputNumber, Radio, Select } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import React, { useEffect } from 'react';
import { EnterFormType, OptionsListType } from '../type';
import './index.module.less';
dayjs.extend(customParseFormat);

interface AddFormProps {
  form: FormInstance<EnterFormType>;
  optionsList: OptionsListType;
}

const AddForm: React.FC<AddFormProps> = ({ form, optionsList }) => {
  const [bankList, setBankList] = React.useState<BankType[]>([]);

  const getBankList = async (corporationId: string) => {
    const res = await BankService.getBankList<BankType>({
      corporationId,
      pageSize: 99999,
      current: 1,
    });
    if (res.success) {
      setBankList(
        res.data.map((x) => ({
          label: x.name,
          value: x.id,
          ...x,
        })),
      );
    }
  };

  const onFormValuesChange = (changedValues: { corporationId: string }) => {
    if (changedValues.corporationId) {
      getBankList(changedValues.corporationId);
      form.setFieldsValue({
        bankId: undefined,
      });
    }
  };

  // 🆕 补充这段，一进来就请求银行列表！
  useEffect(() => {
    const corporationId = form.getFieldValue('corporationId');
    if (corporationId) {
      getBankList(corporationId);
    }
  }, [form]);

  return (
    <Form form={form} labelCol={{ span: 4 }} onValuesChange={onFormValuesChange}>
      <Form.Item
        label="交易日期"
        name="tradeDate"
        rules={[
          {
            required: true,
            message: '请选择交易日期',
          },
        ]}
      >
        <DatePicker
          placeholder="年 / 月 / 日"
          style={{ width: '100%' }}
          allowClear={false}
          maxDate={dayjs()}
        />
      </Form.Item>
      <Form.Item
        label="公司名称"
        name="corporationId"
        rules={[
          {
            required: true,
            message: '请选择公司名称',
          },
        ]}
      >
        <Select
          showSearch
          optionFilterProp="label"
          placeholder="请选择"
          options={optionsList.companyList}
        />
      </Form.Item>

      <Form.Item
        label="银行名称"
        name="bankId"
        rules={[
          {
            required: true,
            message: '请选择银行名称',
          },
        ]}
      >
        <Select showSearch optionFilterProp="label" placeholder="请选择" options={bankList} />
      </Form.Item>
      <Form.Item
        label="对手方名称"
        name="otherCorporationId"
        rules={[
          {
            required: true,
            message: '请选择对手方名称',
          },
        ]}
      >
        <Select
          showSearch
          optionFilterProp="label"
          placeholder="请选择"
          options={optionsList.otherCompanyList}
        />
      </Form.Item>
      <Form.Item
        label="业务类型"
        name="businessTypeId"
        rules={[
          {
            required: true,
            message: '请选择业务类型',
          },
        ]}
      >
        <Select
          showSearch
          optionFilterProp="label"
          placeholder="请选择"
          options={optionsList.businessList}
        />
      </Form.Item>

      <Form.Item
        label="项目归属类型"
        name="belongProjectId"
        rules={[
          {
            required: true,
            message: '请选择项目归属类型',
          },
        ]}
      >
        <Select
          showSearch
          optionFilterProp="label"
          placeholder="请选择"
          options={optionsList.blongProjectList}
        />
      </Form.Item>

      <Form.Item
        label="费用类型"
        name="costTypeId"
        rules={[
          {
            // required: true,
            message: '请选择费用类型',
          },
        ]}
      >
        <Select
          showSearch
          optionFilterProp="label"
          placeholder="请选择"
          options={optionsList.expenseList}
        />
      </Form.Item>

      <Form.Item
        label="交易类型"
        name="transactionType"
        rules={[
          {
            required: true,
            message: '请选择交易类型',
          },
        ]}
      >
        <Radio.Group>
          <Radio value="income">收入</Radio>
          <Radio value="expense">支出</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item
        label="交易金额"
        name="amount"
        rules={[
          {
            required: true,
            message: '请输入交易金额',
          },
        ]}
      >
        <InputNumber
          style={{ width: '100%' }}
          placeholder="请填写交易金额"
          suffix="元"
          stringMode
          min={0.01}
          precision={2}
        />
      </Form.Item>
      <Form.Item label="备注" name="remark">
        <Input.TextArea placeholder="请输入" />
      </Form.Item>
    </Form>
  );
};

export default AddForm;
