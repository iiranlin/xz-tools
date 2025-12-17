export interface CompanyType {
  id: string | null;
  name: string;
  remark?: string;
  createTime?: string;
}

export interface MonthType {
  id: string | null;
  businessTypeName: string;
  businessTypeId: string;
  remark?: string;
  total: number;

  month1: string;
  month2: string;
  month3: string;
  month4: string;
  month5: string;
  month6: string;
  month7: string;
  month8: string;
  month9: string;
  month10: string;
  month11: string;
  month12: string;
}

enum MonthSearchType {
  INCOME = 1,
  EXPENSE = 2,
}
export interface MonthSearchParams {
  year: string;
  type: MonthSearchType;
  businessTypeId?: string;
}