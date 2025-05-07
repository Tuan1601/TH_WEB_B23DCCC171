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
	{
		path: '/travel', // Grouping travel related pages under /travel
		name: 'Travel Planner', // Main menu item name
		icon: 'CarOutlined', // Or PlaneOutlined, GlobalOutlined etc.
		routes: [
			{
				path: '/travel/explore', // Path for the explore page
				name: 'Khám phá điểm đến', // Sub-menu item name
				icon: 'CompassOutlined', // Icon for explore
				component: './HomePage', // Points to src/pages/HomePage/index.tsx
			},
			{
				path: '/travel/itinerary', // Path for the itinerary builder
				name: 'Lịch trình du lịch của tôi', // Sub-menu item name
				icon: 'ScheduleOutlined', // Icon for itinerary
				component: './Itinerary', // Points to src/pages/Itinerary/index.tsx
			},
			{
				path: '/travel/budget', // Path for budget management
				name: 'Quản lý Ngân sách', // Sub-menu item name
				icon: 'DollarOutlined', // Icon for budget
				component: './Budget', // Points to src/pages/Budget/index.tsx
			},
			{
				path: '/travel/admin', // Path for the admin dashboard
				name: 'Quản trị viên du lịch', // Sub-menu item name
				icon: 'SettingOutlined', // Icon for admin settings
				component: './Admin', // Points to src/pages/Admin/index.tsx
                // You might want to add access control here later, e.g.:
                // access: 'canAdmin',
			},
			{ // Redirect base /travel to the explore page
				path: '/travel',
				redirect: '/travel/explore',
			},
		]
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
		path: '/order-management',
		name: 'Customer',
		icon: 'ShopOutlined',
		component: './Order',
		
	},
	{
		path: '/apply',
		name: 'Đăng ký ứng tuyển',
		icon: 'UserAddOutlined',
		component: './ApplicationForm',
		
	},
	{
		path: '/applications',
		name: 'Quản lý đơn đăng ký',
		icon: 'WalletOutlined',
		component: './ApplicationList',
		
	},
	{
		path: '/members',
		name: 'Quản lý thành viên',
		icon: 'ContactsOutlined',
		component: './MemberList',
		
	},
	{
		path: '/dashboard',
		name: 'Thống kê',
		icon: 'AreaChartOutlined',
		component: './Dashboard',
		
	},
	{
		path: '/note',
		name: 'Ghi chú Cá nhân',
		icon: 'AuditOutlined',
		component: './Notes',
		
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
