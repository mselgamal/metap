function routes(router,handler) {

	router.route('/tap/menu')
		.get(handler.getTapMenu);

	router.route('/tap/phone/continue')
		.get(handler.continueTap);

	router.route('/tap/phone/start')
		.get(handler.doPhoneTap);
}

exports.routes = routes;
