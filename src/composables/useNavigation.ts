import { NAV_ICON, USER_ICON, lc } from '~/utils/icons'

export interface NavItem {
  label: string
  to: string
  icon?: string
}

export const useNavigation = () => {
  const mainNav: NavItem[] = [
    { label: '避雷地图', to: '/map', icon: lc(NAV_ICON.map) },
    { label: '行前清单', to: '/checklist', icon: lc(NAV_ICON.checklist) },
    { label: '真假鉴别', to: '/verify', icon: lc(NAV_ICON.verify) },
    { label: '工具箱', to: '/tools', icon: lc(NAV_ICON.tools) },
    { label: '投诉电话', to: '/hotline', icon: lc(NAV_ICON.hotline) },
  ]

  const userMenu = [
    {
      label: '我的避雷清单',
      to: '/user/checklist',
      icon: lc(USER_ICON.checklist),
    },
    {
      label: '我收藏的目的地',
      to: '/user/favorites',
      icon: lc(USER_ICON.favorites),
    },
    {
      label: '我举报过的坑',
      to: '/user/reports',
      icon: lc(USER_ICON.reports),
      sub: '待审核 / 已收录',
    },
    {
      label: '城市更新提醒',
      to: '/user/alerts',
      icon: lc(USER_ICON.alerts),
    },
  ]

  const footerLinks = [
    {
      title: '工具',
      links: [
        { label: '避雷地图', to: '/map' },
        { label: '行前清单', to: '/checklist' },
        { label: '真假鉴别', to: '/verify' },
        { label: '工具箱', to: '/tools' },
      ],
    },
    {
      title: '内容',
      links: [
        { label: '今日已核实', to: '/incidents' },
        { label: '高风险城市榜', to: '/cities' },
        { label: '踩坑墙', to: '/wall' },
      ],
    },
    {
      title: '帮助',
      links: [
        { label: '投诉电话', to: '/hotline' },
        { label: '关于避过', to: '/about' },
        { label: '联系反馈', to: '/about' },
      ],
    },
  ]

  return { mainNav, userMenu, footerLinks }
}
