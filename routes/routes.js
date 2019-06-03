function routes(router,handler) {

	router.route('/tap/menu')
		.get(handler.getTapMenu);

	router.route('/user/menu')
		.get(handler.getUserMenu);

	router.route('/add/user')
		.post(handler.createUserHash);

	router.route('/tap/phone/continue')
		.get(handler.continueTap);

	router.route('/tap/phone/start')
		.get(handler.doPhoneTap);
}

exports.routes = routes;
