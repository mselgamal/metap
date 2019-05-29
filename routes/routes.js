function routes(router,handler) {

	router.route('/taps')
		.get(handler.getTapsMenu);

	router.route('/add/admin')
		.get(handler.getAddAdminMenu);

	router.route('/add/admin/submit')
		.post(handler.postAdminUser);

	router.route('/taps/device/submit')
		.get(handler.continueTap);

	router.route('/taps/submit')
		.get(handler.doTap);
}

exports.routes = routes;
