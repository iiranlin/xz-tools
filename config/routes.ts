/**
 * @name umi 的路由配置
 * @description 只支持 path,component,routes,redirect,wrappers,name,icon 的配置
 * @param path  path 只支持两种占位符配置，第一种是动态参数 :id 的形式，第二种是 * 通配符，通配符只能出现路由字符串的最后。
 * @param component 配置 location 和 path 匹配后用于渲染的 React 组件路径。可以是绝对路径，也可以是相对路径，如果是相对路径，会从 src/pages 开始找起。
 * @param routes 配置子路由，通常在需要为多个路径增加 layout 组件时使用。
 * @param redirect 配置路由跳转
 * @param wrappers 配置路由组件的包装组件，通过包装组件可以为当前的路由组件组合进更多的功能。 比如，可以用于路由级别的权限校验
 * @param name 配置路由的标题，默认读取国际化文件 menu.ts 中 menu.xxxx 的值，如配置 name 为 login，则读取 menu.ts 中 menu.login 的取值作为标题
 * @param icon 配置路由的图标，取值参考 https://ant.design/components/icon-cn， 注意去除风格后缀和大小写，如想要配置图标为 <StepBackwardOutlined /> 则取值应为 stepBackward 或 StepBackward，如想要配置图标为 <UserOutlined /> 则取值应为 user 或者 User
 * @doc https://umijs.org/docs/guides/routes
 */
export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        name: '登录',
        locale: false,
        path: '/user/login',
        component: './User/Login',
      },
    ],
  },

  {
    path: '/incomeExpenseTransactionManagement',
    name: '收支交易管理',
    locale: false,
    icon: 'BarChartOutlined',
    routes: [
      {
        path: '/incomeExpenseTransactionManagement',
        redirect: '/incomeExpenseTransactionManagement/welcome',
      },
      {
        path: '/incomeExpenseTransactionManagement/welcome',
        name: '台账看板',
        locale: false,
        // icon: 'BarChartOutlined',
        component: './Kanban',
      },
      {
        path: '/incomeExpenseTransactionManagement/days',
        name: '每日报表',
        locale: false,
        // icon: 'SnippetsOutlined',
        component: './EveryDay',
      },
      {
        path: '/incomeExpenseTransactionManagement/month',
        name: '月度统计',
        locale: false,
        // icon: 'SnippetsOutlined',
        component: './Month',
      },
      {
        path: '/incomeExpenseTransactionManagement/enterTheDetail',
        name: '交易明细',
        locale: false,
        // icon: 'DiffOutlined',
        component: './EnterTheDetail',
      },

    ],
  },
  {
    path: '/loan',
    name: '贷款利息管理',
    locale: false,
    icon: 'MoneyCollectOutlined',
    routes: [
      {
        path: '/loan',
        redirect: '/loan/loanInterest',
      },
      {
        path: '/loan/loanInterest',
        name: '贷款列表',
        locale: false,
        component: './Loan/LoanInterest',
      },
      {
        path: '/loan/addLogn',
        name: '新增贷款利息',
        locale: false,
        component: './Loan/AddLogn',
        // 隐藏自己和子菜单
        hideInMenu: true,
      },
      {
        path: '/loan/repaymentList',
        name: '还款列表',
        locale: false,
        component: './Loan/RepaymentList',
      },
    ],
  },
  {
    path: '/dict',
    name: '字典配置',
    icon: 'FileSearchOutlined',
    locale: false,
    routes: [
      {
        path: '/dict',
        redirect: '/dict/company',
      },
      {
        path: '/dict/company',
        name: '公司名称',
        locale: false,
        component: './Dict/Company',
      },
      {
        path: '/dict/bank',
        name: '银行名称',
        locale: false,
        component: './Dict/Bank',
      },
      {
        path: '/dict/otherCompany',
        name: '对手方名称',
        locale: false,
        component: './Dict/OtherCompany',
      },
      {
        path: '/dict/businessType',
        name: '业务类型',
        locale: false,
        component: './Dict/BusinessType',
      },
    ],
  },

  {
    path: '/',
    redirect: '/incomeExpenseTransactionManagement/welcome',
  },
  {
    path: '*',
    layout: false,
    component: './404',
  },
];
