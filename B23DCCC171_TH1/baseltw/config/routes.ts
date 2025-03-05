export default [
	{
		path: '/user',
		layout: false,
		routes: [
			{
				path: '/user/login',
				layout: false,
				name: 'login',
				component: './user/Login',
			},
			{
				path: '/user',
				redirect: '/user/login',
			},
		],
	},

	///////////////////////////////////
	// DEFAULT MENU
	{
		path: '/dashboard',
		name: 'Dashboard',
		component: './TrangChu',
		icon: 'HomeOutlined',
	},
	{
		path: '/gioi-thieu',
		name: 'About',
		component: './TienIch/GioiThieu',
		hideInMenu: true,
	},
	{
		path: '/random-user',
		name: 'RandomUser',
		component: './RandomUser',
		icon: 'ArrowsAltOutlined',
	},
	{
		path: '/todo-list',
		name: 'Todo List',
		component: './TodoList',
		icon: 'CheckSquareOutlined',
	},
	{
		path: '/tro_choi_doan_so',
		name: 'Trò chơi đoán số',
		component:'./TroChoiDoanSo',
		icon: "RocketOutlined",
	},
	{
		path:'/QuanLy',
		name: 'QuanLy',
		component: './QuanLy',
		icon:'ScheduleOutlined',
	},
	{
		path:'/OanTuTi',
		name:'Oẳn Tù Tì',
		component:'T:/Làm Web/B23DCCC171_TH1/baseltw/src/pages/OanTuTi',
		icon:'QuestionOutlined',
	},
	{
		path:'/QuanLyMon',
		name: 'Quản Lý Đề Thi',
		icon:'ScheduleOutlined',
		routes: [
			{
				path:'QuanLyMonHoc',
				name:'Môn Học',
				component:'./QuanLyMonHoc/QuanLyMonHoc'
			},
			{
				path:'QuanLyCauHoi',
				name:'Câu Hỏi',
				component:'./QuanLyMonHoc/QuanLyCauHoi'
			},
			{
				path:'QuanLyDeThi',
				name:'Đề Thi',
				component:'./QuanLyMonHoc/QuanLyDeThi'
			},

		]
	},

	// DANH MUC HE THONG
	// {
	// 	name: 'DanhMuc',
	// 	path: '/danh-muc',
	// 	icon: 'copy',
	// 	routes: [
	// 		{
	// 			name: 'ChucVu',
	// 			path: 'chuc-vu',
	// 			component: './DanhMuc/ChucVu',
	// 		},
	// 	],
	// },

	{
		path: '/notification',
		routes: [
			{
				path: './subscribe',
				exact: true,
				component: './ThongBao/Subscribe',
			},
			{
				path: './check',
				exact: true,
				component: './ThongBao/Check',
			},
			{
				path: './',
				exact: true,
				component: './ThongBao/NotifOneSignal',
			},
		],
		layout: false,
		hideInMenu: true,
	},
	{
		path: '/',
	},
	{
		path: '/403',
		component: './exception/403/403Page',
		layout: false,
	},
	{
		path: '/hold-on',
		component: './exception/DangCapNhat',
		layout: false,
	},
	{
		component: './exception/404',
	},
];
