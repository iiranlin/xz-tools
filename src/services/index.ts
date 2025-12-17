// @ts-ignore
/* eslint-disable */
import { BankType } from '@/pages/Dict/Bank/type';
import { CompanyType } from '@/pages/Dict/Company/type';
import { OtherCompanyType } from '@/pages/Dict/OtherCompany/type';
import { EnterFormType } from '@/pages/EnterTheDetail/type';
import { request } from '@umijs/max';

// 分页参数类型定义
export interface PageParams {
  current?: number;
  pageSize?: number;
  keyword?: string;
  [key: string]: any;
}

// 分页响应类型定义
export interface PageResponse<T> {
  data: T[];
  total: number;
  success: boolean;
  pageSize: number;
  current: number;
}

// 公司服务类
export class CompanyService {
  // 查询公司列表（用于ProTable）
  static async getCompanyList<T>(params: PageParams): Promise<{
    data: T[];
    total: number;
    success: boolean;
  }> {
    try {
      const { current: pageNum, pageSize, ...rest } = params;
      const res = await request<{
        data: {
          list: T[];
          total: number;
        };
        code: number;
      }>('/api/corporationDict/listPage', {
        method: 'GET',
        params: {
          pageNum,
          pageSize,
          ...rest,
        },
      });

      return {
        data: res.data.list || [],
        total: res.data.total || 0,
        success: res.code === 0,
      };
    } catch (error) {
      console.error('获取公司列表出错:', error);
      return {
        data: [],
        total: 0,
        success: false,
      };
    }
  }

  // 添加公司
  static async addCompany(data: Omit<CompanyType, 'id'>): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const res = await request('/api/corporationDict/create', {
        method: 'POST',
        data,
      });
      return {
        success: res.code === 0,
        message: res.message || '添加成功',
      };
    } catch (error) {
      console.error('添加公司出错:', error);
      return {
        success: false,
        message: '添加失败',
      };
    }
  }

  // 更新公司
  static async updateCompany(data: Partial<CompanyType>): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const res = await request(`/api/corporationDict/modify`, {
        method: 'POST',
        data,
      });
      return {
        success: res.code === 0,
        message: res.message || '更新成功',
      };
    } catch (error) {
      console.error('更新公司出错:', error);
      return {
        success: false,
        message: '更新失败',
      };
    }
  }

  // 删除公司
  static async deleteCompany(id: string): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const res = await request(`/api/corporationDict/deleteBatch`, {
        method: 'POST',
        data: [id],
      });
      return {
        success: res.code === 0,
        message: res.message || '删除成功',
      };
    } catch (error) {
      console.error('删除公司出错:', error);
      return {
        success: false,
        message: '删除失败',
      };
    }
  }
}

// 对手方公司字典
export class OtherCompanyService {
  // 查询公司列表（用于ProTable）
  static async getCompanyList<T>(params: PageParams): Promise<{
    data: T[];
    total: number;
    success: boolean;
  }> {
    try {
      const { current: pageNum, pageSize, ...rest } = params;
      const res = await request<{
        data: {
          list: T[];
          total: number;
        };
        code: number;
      }>('/api/otherCorporationDict/listPage', {
        method: 'GET',
        params: {
          pageNum,
          pageSize,
          ...rest,
        },
      });

      return {
        data: res.data.list || [],
        total: res.data.total || 0,
        success: res.code === 0,
      };
    } catch (error) {
      console.error('获取公司列表出错:', error);
      return {
        data: [],
        total: 0,
        success: false,
      };
    }
  }

  // 添加公司
  static async addCompany(data: Omit<OtherCompanyType, 'id'>): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const res = await request('/api/otherCorporationDict/create', {
        method: 'POST',
        data,
      });
      return {
        success: res.code === 0,
        message: res.message || '添加成功',
      };
    } catch (error) {
      console.error('添加公司出错:', error);
      return {
        success: false,
        message: '添加失败',
      };
    }
  }

  // 更新公司
  static async updateCompany(data: Partial<OtherCompanyType>): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const res = await request(`/api/otherCorporationDict/modify`, {
        method: 'POST',
        data,
      });
      return {
        success: res.code === 0,
        message: res.message || '更新成功',
      };
    } catch (error) {
      console.error('更新公司出错:', error);
      return {
        success: false,
        message: '更新失败',
      };
    }
  }

  // 删除公司
  static async deleteCompany(id: string): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const res = await request(`/api/otherCorporationDict/deleteBatch`, {
        method: 'POST',
        data: [id],
      });
      return {
        success: res.code === 0,
        message: res.message || '删除成功',
      };
    } catch (error) {
      console.error('删除公司出错:', error);
      return {
        success: false,
        message: '删除失败',
      };
    }
  }
}

// 银行名称

export class BankService {
  // 查询银行列表（用于ProTable）
  static async getBankList<T>(params: PageParams): Promise<{
    data: T[];
    total: number;
    success: boolean;
  }> {
    try {
      const { current: pageNum, pageSize, ...rest } = params;
      const res = await request<{
        data: {
          list: T[];
          total: number;
        };
        code: number;
      }>('/api/bankDict/listPage', {
        method: 'GET',
        params: {
          pageNum,
          pageSize,
          ...rest,
        },
      });

      return {
        data: res.data.list || [],
        total: res.data.total || 0,
        success: res.code === 0,
      };
    } catch (error) {
      console.error('获取公司列表出错:', error);
      return {
        data: [],
        total: 0,
        success: false,
      };
    }
  }

  // 添加银行
  static async addBank(data: Omit<BankType, 'id'>): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const res = await request('/api/bankDict/create', {
        method: 'POST',
        data,
      });
      return {
        success: res.code === 0,
        message: res.message || '添加成功',
      };
    } catch (error) {
      console.error('添加公司出错:', error);
      return {
        success: false,
        message: '添加失败',
      };
    }
  }

  // 更新银行
  static async updateBank(data: Partial<BankType>): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const res = await request(`/api/bankDict/modify`, {
        method: 'POST',
        data,
      });
      return {
        success: res.code === 0,
        message: res.message || '更新成功',
      };
    } catch (error) {
      console.error('更新公司出错:', error);
      return {
        success: false,
        message: '更新失败',
      };
    }
  }

  // 删除银行
  static async deleteCompany(id: string): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const res = await request(`/api/bankDict/deleteBatch`, {
        method: 'POST',
        data: [id],
      });
      return {
        success: res.code === 0,
        message: res.message || '删除成功',
      };
    } catch (error) {
      console.error('删除公司出错:', error);
      return {
        success: false,
        message: '删除失败',
      };
    }
  }
}

// 业务类型
export class BusinessService {
  // 查询银行列表（用于ProTable）
  static async getBusinessList<T>(params: PageParams): Promise<{
    data: T[];
    total: number;
    success: boolean;
  }> {
    try {
      const { current: pageNum, pageSize, ...rest } = params;
      const res = await request<{
        data: {
          list: T[];
          total: number;
        };
        code: number;
      }>('/api/businessTypeDict/listPage', {
        method: 'GET',
        params: {
          pageNum,
          pageSize,
          ...rest,
        },
      });

      return {
        data: res.data.list || [],
        total: res.data.total || 0,
        success: res.code === 0,
      };
    } catch (error) {
      console.error('获取公司列表出错:', error);
      return {
        data: [],
        total: 0,
        success: false,
      };
    }
  }

  // 添加银行
  static async addBusiness(data: Omit<BankType, 'id'>): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const res = await request('/api/businessTypeDict/create', {
        method: 'POST',
        data,
      });
      return {
        success: res.code === 0,
        message: res.message || '添加成功',
      };
    } catch (error) {
      console.error('添加公司出错:', error);
      return {
        success: false,
        message: '添加失败',
      };
    }
  }

  // 更新银行
  static async updateBusiness(data: Partial<BankType>): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const res = await request(`/api/businessTypeDict/modify`, {
        method: 'POST',
        data,
      });
      return {
        success: res.code === 0,
        message: res.message || '更新成功',
      };
    } catch (error) {
      console.error('更新公司出错:', error);
      return {
        success: false,
        message: '更新失败',
      };
    }
  }

  // 删除银行
  static async deleteCompany(id: string): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const res = await request(`/api/businessTypeDict/deleteBatch`, {
        method: 'POST',
        data: [id],
      });
      return {
        success: res.code === 0,
        message: res.message || '删除成功',
      };
    } catch (error) {
      console.error('删除公司出错:', error);
      return {
        success: false,
        message: '删除失败',
      };
    }
  }
}

// 录入明细
export class EnterTheDetailService {
  // 查询银行列表（用于ProTable）
  static async getList<T>(params: PageParams): Promise<{
    data: T[];
    total: number;
    success: boolean;
  }> {
    try {
      const { current: pageNum, pageSize, ...rest } = params;
      const res = await request<{
        data: {
          list: T[];
          total: number;
        };
        code: number;
      }>('/api/enterTheDetails/listPage', {
        method: 'GET',
        params: {
          pageNum,
          pageSize,
          ...rest,
        },
      });

      return {
        data: res.data.list || [],
        total: res.data.total || 0,
        success: res.code === 0,
      };
    } catch (error) {
      console.error('获取公司列表出错:', error);
      return {
        data: [],
        total: 0,
        success: false,
      };
    }
  }

  // 查询月度统计
  static async getMonth<T>(params: PageParams): Promise<{
    data: T[];
    total: number;
    success: boolean;
  }> {
    try {
      const { current: pageNum, pageSize, ...rest } = params;
      const res = await request<{
        data: T[];
        code: number;
      }>('/api/enterTheDetails/statisticsByMonth', {
        method: 'GET',
        params: {
          pageNum,
          pageSize,
          ...rest,
        },
      });

      return {
        data: res.data || [],
        total: res.data.length || 0,
        success: res.code === 0,
      };
    } catch (error) {
      console.error('获取月度统计出错:', error);
      return {
        data: [],
        total: 0,
        success: false,
      };
    }
  }

  // 添加银行
  static async add(data: Omit<EnterFormType, 'id'>): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const res = await request('/api/enterTheDetails/create', {
        method: 'POST',
        data,
      });
      return {
        success: res.code === 0,
        message: res.message || '添加成功',
      };
    } catch (error) {
      console.error('添加公司出错:', error);
      return {
        success: false,
        message: '添加失败',
      };
    }
  }

  // 更新银行
  static async update(data: Partial<BankType>): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const res = await request(`/api/enterTheDetails/modify`, {
        method: 'POST',
        data,
      });
      return {
        success: res.code === 0,
        message: res.message || '更新成功',
      };
    } catch (error) {
      console.error('更新公司出错:', error);
      return {
        success: false,
        message: '更新失败',
      };
    }
  }

  // 删除银行
  static async delete(ids: string[]): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const res = await request(`/api/enterTheDetails/deleteBatch`, {
        method: 'POST',
        data: ids,
      });
      return {
        success: res.code === 0,
        message: res.message || '删除成功',
      };
    } catch (error) {
      console.error('删除公司出错:', error);
      return {
        success: false,
        message: '删除失败',
      };
    }
  }

  // 导出
  static async export(params: PageParams): Promise<{
    success: boolean;
    data: Blob;
  }> {
    try {
      const res = await request(`/api/enterTheDetails/export`, {
        method: 'GET',
        params,
        responseType: 'blob',
      });
      return {
        success: true,
        data: res,
      };
    } catch (error) {
      console.error('导出出错:', error);
      return {
        success: false,
        data: new Blob(),
      };
    }
  }

  // 月度统计导出
  static async exportMonth(params: PageParams): Promise<{
    success: boolean;
    data: Blob;
  }> {
    try {
      const res = await request(`/api/enterTheDetails/statisticsByMonthExport`, {
        method: 'GET',
        params,
        responseType: 'blob',
      });
      return {
        success: true,
        data: res,
      };
    } catch (error) {
      console.error('月度统计导出出错:', error);
      return {
        success: false,
        data: new Blob(),
      };
    }
  }

  // 交易明细导出
  static async exportDetails(params: PageParams): Promise<{
    success: boolean;
    data: Blob;
  }> {
    try {
      const res = await request(`/api/enterTheDetails/transactionDetailsExport`, {
        method: 'GET',
        params,
        responseType: 'blob',
      });
      return {
        success: true,
        data: res,
      };
    } catch (error) {
      console.error('导出出错:', error);
      return {
        success: false,
        data: new Blob(),
      };
    }
  }

  // 汇总查询
  static async summary(params: PageParams): Promise<{
    success: boolean;
    data: any;
  }> {
    try {
      const res = await request(`/api/enterTheDetails/monthlyReport`, {
        method: 'GET',
        params,
      });
      return {
        success: res.code === 0,
        data: res.data,
      };
    } catch (error) {
      console.error('汇总查询出错:', error);
      return {
        success: false,
        data: [],
      };
    }
  }

  // 收支看板数据
  static async getBudgetData(params: { startDate: string; endDate: string }): Promise<{
    success: boolean;
    data: any;
  }> {
    try {
      const res = await request(`/api/enterTheDetails/budget`, {
        method: 'GET',
        params,
      });
      return {
        success: res.code === 0,
        data: res.data,
      };
    } catch (error) {
      return {
        success: false,
        data: [],
      };
    }
  }

  // Excel Modal 导出
  static async exportExcelModal(params: PageParams): Promise<{
    success: boolean;
    data: Blob;
  }> {
    try {
      const res = await request(`/api/enterTheDetails/budgetExport`, {
        method: 'GET',
        params,
        responseType: 'blob',
      });
      return {
        success: true,
        data: res,
      };
    } catch (error) {
      console.error('导出出错:', error);
      return {
        success: false,
        data: new Blob(),
      };
    }
  }

  // 对手支出看板数据
  static async getExpenditureData(params: { startDate: string; endDate: string }): Promise<{
    success: boolean;
    data: any;
  }> {
    try {
      const res = await request(`/api/enterTheDetails/groupByOtherCorporation`, {
        method: 'GET',
        params,
      });
      return {
        success: res.code === 0,
        data: res.data,
      };
    } catch (error) {
      return {
        success: false,
        data: [],
      };
    }
  }
  // 业务类型收支看板
  static async getBusinessTypeData(params: { startDate: string; endDate: string }): Promise<{
    success: boolean;
    data: any;
  }> {
    try {
      const res = await request(`/api/enterTheDetails/groupByBusinessType`, {
        method: 'GET',
        params,
      });
      return {
        success: res.code === 0,
        data: res.data,
      };
    } catch (error) {
      return {
        success: false,
        data: [],
      };
    }
  }

  // 获取所有交易日期
  static async getAllTransactionDates<T>(params: PageParams): Promise<{
    data: any;
    total: number;
    success: boolean;
  }> {
    try {
      const { current: pageNum, pageSize, ...rest } = params;
      const res = await request<{
        data: {
          list: T[];
          total: number;
        };
        code: number;
      }>('/api/enterTheDetails/getTradeDateList', {
        method: 'GET',
        params: {
          pageNum,
          pageSize,
          ...rest,
        },
      });

      return {
        data:
          res.data.list.map((x) => ({
            date: x,
          })) || [],
        total: res.data.total || 0,
        success: res.code === 0,
      };
    } catch (error) {
      console.error('获取公司列表出错:', error);
      return {
        data: [],
        total: 0,
        success: false,
      };
    }
  }

  // 统计收支和数据sumEnterTheDetails
  static async sumEnterTheDetails(params: PageParams): Promise<{
    success: boolean;
    data: any;
  }> {
    try {
      const res = await request(`/api/enterTheDetails/sumEnterTheDetails`, {
        method: 'GET',
        params,
      });
      return {
        success: res.code === 0,
        data: res.data,
      };
    } catch (error) {
      return {
        success: false,
        data: [],
      };
    }
  }
}
// 用户登录 修改密码
export class UserService {
  // 用户登录
  static async login(data: { account: string; password: string }): Promise<{
    success: boolean;
    message: string;
    data: any;
  }> {
    try {
      const res = await request('/api/user/login', {
        method: 'POST',
        data,
      });
      return {
        success: res.code === 0,
        message: res.message || '登录成功',
        data: res.data,
      };
    } catch (error) {
      return {
        success: false,
        message: '登录失败',
        data: {},
      };
    }
  }
  // 修改密码
  static async updatePassword(data: { oldPassword: string; password: string }): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const res = await request('/api/user/updatePassword', {
        method: 'POST',
        data,
      });
      return {
        success: res.code === 0,
        message: res.message || '修改成功',
      };
    } catch (error) {
      return {
        success: false,
        message: '修改失败',
      };
    }
  }
}

export class TempEnterTheDetailsService {
  // 导出
  static async export(params: { refId: string }): Promise<{
    success: boolean;
    data: Blob;
  }> {
    try {
      const res = await request(`/api/tempEnterTheDetails/export`, {
        method: 'POST',
        params,
        responseType: 'blob',
      });
      return {
        success: true,
        data: res,
      };
    } catch (error) {
      return {
        success: false,
        data: new Blob(),
      };
    }
  }

  // 保存
  static async save(params: { refId: string }): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const res = await request(`/api/tempEnterTheDetails/saveEnterTheDetails`, {
        method: 'POST',
        params,
      });
      return {
        success: res.code === 0,
        message: res.message || '保存成功',
      };
    } catch (error) {
      return {
        success: false,
        message: '保存失败',
      };
    }
  }
}

// 贷款利息
export class LoanService {
  // 查询公司列表（用于ProTable）
  static async getList<T>(params: PageParams): Promise<{
    data: T[];
    total: number;
    success: boolean;
  }> {
    try {
      const { current: pageNum, pageSize, ...rest } = params;
      const res = await request<{
        data: {
          list: T[];
          total: number;
        };
        code: number;
      }>('/api/loanInterest/listPage', {
        method: 'GET',
        params: {
          pageNum,
          pageSize,
          ...rest,
        },
      });

      return {
        data: res.data.list || [],
        total: res.data.total || 0,
        success: res.code === 0,
      };
    } catch (error) {
      console.error('获取公司列表出错:', error);
      return {
        data: [],
        total: 0,
        success: false,
      };
    }
  }

  // getLoanData
  static async getLoanData<T>(data: any): Promise<any> {
    try {
      const res = await request(`/api/loanInterest/interestCalculation`, {
        method: 'POST',
        data,
      });
      return {
        success: res.code === 0,
        data: res.data,
      };
    } catch (error) {
      return {
        success: false,
        data: [],
      };
    }
  }

  // 添加公司
  static async addCompany(data: Omit<CompanyType, 'id'>): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const res = await request('/api/loanInterest/create', {
        method: 'POST',
        data,
      });
      return {
        success: res.code === 0,
        message: res.message || '添加成功',
      };
    } catch (error) {
      console.error('添加公司出错:', error);
      return {
        success: false,
        message: '添加失败',
      };
    }
  }

  // 更新公司
  static async updateCompany(data: Partial<CompanyType>): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const res = await request(`/api/loanInterest/modify`, {
        method: 'POST',
        data,
      });
      return {
        success: res.code === 0,
        message: res.message || '更新成功',
      };
    } catch (error) {
      console.error('更新公司出错:', error);
      return {
        success: false,
        message: '更新失败',
      };
    }
  }

  // 删除公司
  static async deleteCompany(id: string): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const res = await request(`/api/loanInterest/deleteBatch`, {
        method: 'POST',
        data: [id],
      });
      return {
        success: res.code === 0,
        message: res.message || '删除成功',
      };
    } catch (error) {
      console.error('删除公司出错:', error);
      return {
        success: false,
        message: '删除失败',
      };
    }
  }
}

// 利息查看
export class LoanInterestService {
  // 查询公司列表（用于ProTable）
  static async getCompanyList<T>(params: PageParams): Promise<{
    data: T[];
    total: number;
    success: boolean;
  }> {
    try {
      const { current: pageNum, pageSize, ...rest } = params;
      const res = await request<{
        data: {
          list: T[];
          total: number;
        };
        code: number;
      }>('/api/loanInterestDetails/listPage', {
        method: 'GET',
        params: {
          pageNum,
          pageSize,
          ...rest,
        },
      });

      return {
        data: res.data.list || [],
        total: res.data.total || 0,
        success: res.code === 0,
      };
    } catch (error) {
      console.error('获取公司列表出错:', error);
      return {
        data: [],
        total: 0,
        success: false,
      };
    }
  }

  // 获取还款列表总计
  static async getTotal(params: PageParams): Promise<{
    success: boolean;
    data: any;
  }> {
    try {
      const res = await request(`/api/loanInterestDetails/totalAmount`, {
        method: 'GET',
        params,
      });
      return {
        success: res.code === 0,
        data: res.data,
      };
    } catch (error) {
      console.error('获取还款列表总计出错:', error);
      return {
        success: false,
        data: {
          principalAmount: 0,
          repayAmount: 0,
        },
      };
    }
  }

  static async getCompanyDetailList<T>(id: string): Promise<{
    success: boolean;
    data: any;
  }> {
    try {
      const res = await request(`/api/loanInterest/getById`, {
        method: 'GET',
        params: {
          id
        },
      });
      return {
        success: res.code === 0,
        data: res.data,
      };
    } catch (error) {
      console.error('获取公司详情出错:', error);
      return {
        success: false,
        data: [],
      };
    }
  }

  // 添加公司
  static async addCompany(data: Omit<CompanyType, 'id'>): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const res = await request('/api/loanInterest/create', {
        method: 'POST',
        data,
      });
      return {
        success: res.code === 0,
        message: res.message || '添加成功',
      };
    } catch (error) {
      console.error('添加公司出错:', error);
      return {
        success: false,
        message: '添加失败',
      };
    }
  }

  // 更新公司
  static async updateCompany(data: Partial<CompanyType>): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const res = await request(`/api/loanInterest/modify`, {
        method: 'POST',
        data,
      });
      return {
        success: res.code === 0,
        message: res.message || '更新成功',
      };
    } catch (error) {
      console.error('更新公司出错:', error);
      return {
        success: false,
        message: '更新失败',
      };
    }
  }

  // 删除公司
  static async deleteCompany(id: string): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const res = await request(`/api/loanInterest/deleteBatch`, {
        method: 'POST',
        data: [id],
      });
      return {
        success: res.code === 0,
        message: res.message || '删除成功',
      };
    } catch (error) {
      console.error('删除公司出错:', error);
      return {
        success: false,
        message: '删除失败',
      };
    }
  }
}