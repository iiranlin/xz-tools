import { Dayjs } from 'dayjs';
import { BankType } from '../Dict/Bank/type';
import { BusinessType } from '../Dict/BusinessType/type';
import { CompanyType } from '../Dict/Company/type';
import { OtherCompanyType } from '../Dict/OtherCompany/type';
import { BlongProjectType } from '../Dict/BlongProject/type';
import { ExpenseType } from '../Dict/ExpenseType/type';

export interface EnterTheDetailType {
  id: string | null;
  name: string;
  remark?: string;
  createTime?: string;
}

export type TransactionType = 'income' | 'expense';

export interface EnterFormType {
  id: string | null;
  tradeDate?: string | Dayjs;
  bankId?: string;
  corporationId?: string;
  businessTypeId?: string;
  otherCorporationId?: string;
  belongProjectId?:string;
  costTypeId?:string;
  incomeAmount?: string | null | number;
  expenseAmount?: string | null | number;
  transactionType?: TransactionType;
  amount?: string | null | number;
  remark?: string;
}

export interface OptionsListType {
  companyList: CompanyType[];
  otherCompanyList: OtherCompanyType[];
  bankList: BankType[];
  businessList: BusinessType[];
  blongProjectList: BlongProjectType[];
  expenseList:ExpenseType[];
}

export type SegmentedType = 'single' | 'multiple';

export interface MultipleRef {
  onOk: () => Promise<void>;
}
