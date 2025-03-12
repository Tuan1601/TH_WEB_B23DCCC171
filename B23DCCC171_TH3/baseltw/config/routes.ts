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
		name: 'TodoList',
		icon: 'OrderedListOutlined',
		component: './TodoList',
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
		component:'./OanTuTi',
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
	{
		path: '/dat-lich',
		name: 'DatLich',
		icon: 'CalendarOutlined',
		routes: [
		  {
			path: '/dat-lich/lich-hen',
			name: 'LichHen',
			component: './DatLich/LichHen',
			icon: 'ScheduleOutlined',
		  },
		  {
			path: '/dat-lich/nhan-vien',
			name: 'NhanVien',
			component: './DatLich/NhanVien',
			icon: 'TeamOutlined',
		  },
		  {
			path: '/dat-lich/dich-vu',
			name: 'DichVu',
			component: './DatLich/DichVu',
			icon: 'AppstoreOutlined',
		  },
		  {
			path: '/dat-lich/bao-cao',
			name: 'BaoCao',
			component: './DatLich/BaoCao',
			icon: 'BarChartOutlined',
		  },
		],
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
