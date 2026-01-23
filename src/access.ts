/**
 * @see https://umijs.org/docs/max/access#access
 * */
export default function access(initialState: { currentUser?: API.CurrentUser } | undefined) {
  const { currentUser } = initialState ?? {};
  return {
    // 允许所有用户访问（包括匿名访客）
    canAccess: true,
    canAdmin: currentUser && currentUser.access === 'admin',
  };
}
