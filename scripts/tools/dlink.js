const dget = target => document.getElementById(target);

export const dom = {
	it: {
		page: dget("page-init"),
		flist: dget("it-flist"),
		msgload: dget("it-msgload"),
		inewf: dget("it-inewf"),
		ireloadf: dget("it-ireloadf"),
	},
	fm: {
		page: dget("page-form"),
		ititle: dget("fm-ititle"),
		idesc: dget("fm-idesc"),
		idate: dget("fm-idate"),
		isendf: dget("fm-isendf"),
		icancelf: dget("fm-icancelf"),
	},
};
