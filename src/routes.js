import Login from './views/Login.vue'
import Register from './views/Register.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import barChart from './views/systemSetting/barChart.vue'
import Table from './views/systemSetting/Table.vue'
import Form from './views/systemSetting/Form.vue'
import user from './views/systemSetting/user.vue'
import Page4 from './views/basicInfo/Page4.vue'
import Page5 from './views/basicInfo/Page5.vue'
import Page6 from './views/statisticalAnalysis/Page6.vue'
import RoadGoods from './views/statisticalAnalysis/RoadGoods.vue'
import Index from './views/index/Index.vue'
import main from './views/Main.vue'


let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/register',
        component: Register,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    {
        path: '/',
        hidden: true,
        redirect: { path: '/login' }
    },
    //{ path: '/main', component: Main },
    {
        path: '/',
        component: Home,
        name: '',
        iconCls: 'fa fa-home',
        leaf: true,//只有一个节点
        children: [
            { path: '/index', component: Index, name: '首页' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '系统设置',
        iconCls: 'fa fa-cogs',
        children: [
            { path: '/table', component: Table, name: '用户管理' },
            { path: '/form', component: Form, name: '权限管理' },
            { path: '/user', component: user, name: '密码修改' },
            { path: '/page4', component: Page4, name: '技术支持' },
            { path: '/page5', component: Page5, name: '帮助文档' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '基础信息',
        iconCls: 'fa fa-file-text',
        children: [
            { path: '/page4', component: Page4, name: '单位信息' },
            { path: '/page4', component: Page4, name: '单位规模' },
            { path: '/page4', component: Page4, name: '车辆设备' },
            { path: '/page4', component: Page4, name: '船泊设备' },
            { path: '/page4', component: Page4, name: '港口设备' },
            { path: '/page4', component: Page4, name: '数据字典' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '统计分析',
        iconCls: 'fa fa-bar-chart-o',
        children: [
            { path: '/barChart', component: barChart,  name: '道路客运' },
            { path: '/RoadGoods', component: RoadGoods,  name: '道路货运' },
            { path: '/page4', component: Page4,  name: '出租车运输' },
            { path: '/page4', component: Page4,  name: '内河运输' },
            { path: '/page4', component: Page4,  name: '海洋货运' },
            { path: '/page4', component: Page4,  name: '海洋客运' },
            { path: '/page4', component: Page4,  name: '港口生产' },
            { path: '/page4', component: Page4,  name: '单位运距能耗指标' },
            { path: '/page4', component: Page4,  name: '能耗结构' },
            { path: '/page4', component: Page4,  name: '能源类型分时趋势' },
            { path: '/page4', component: Page4,  name: '单位能耗变化趋势' },
            { path: '/page4', component: Page4,  name: '总能耗变化趋势' },
            { path: '/page4', component: Page4,  name: '地市能耗构成图' },
            { path: '/page4', component: Page4,  name: '交通方式能耗构成图' },            
            { path: '/page4', component: Page4,  name: '年度数据对比' },
            { path: '/page4', component: Page4,  name: '分析结果发布' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '能耗采集',
        iconCls: 'fa fa-th-list',
        children: [
            { path: '/page4', component: Page4, name: '实时采集' },
            { path: '/page4', component: Page4, name: '数据校验' }
        ]
    },
     {
        path: '/',
        component: Home,
        name: '数据监测',
        iconCls: 'fa fa-eye',
        children: [
            { path: '/page4', component: Page4, name: '数据展示' },
            { path: '/page4', component: Page4, name: '客运车辆' },
            { path: '/page4', component: Page4, name: '货运车辆' },
            { path: '/page4', component: Page4, name: '出租车' },
            { path: '/page4', component: Page4, name: '公交车' },
            { path: '/page4', component: Page4, name: '内河船舶' },
            { path: '/page4', component: Page4, name: '专题图展示' }
        ]
    },
    /* {
        path: '/',
        component: Home,
        name: '导航一',
        iconCls: 'el-icon-message',//图标样式class
        children: [
            { path: '/main', component: Main, name: '主页', hidden: true },
            { path: '/table', component: Table, name: 'Table' },
            { path: '/form', component: Form, name: 'Form' },
            { path: '/user', component: user, name: '列表' },
        ]
    },
    {
        path: '/',
        component: Home,
        name: '导航二',
        iconCls: 'fa fa-id-card-o',
        children: [
            { path: '/page4', component: Page4, name: '页面4' },
            { path: '/page5', component: Page5, name: '页面5' }
        ]
    },*/
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

export default routes;