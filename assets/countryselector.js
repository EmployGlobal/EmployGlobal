var NIN = NIN || {};

(function( $objNS ){

	'use strict';
	
	var accordionWidget = new $objNS.accordion('.accordion', {});

	_initialize();

	function _initialize () {

		if ( $objNS.is3DS ) {
			$('body').addClass('nin3DS');
		}

		_bindEvents();
		_resizeWindow();
	}		

	function _initAccordion () {
		accordionWidget.initialize();
	}

	function _resetAccordion () {
		accordionWidget.remove();
	}

	/**
	 * Trigger custom events when certain breakpoints are triggered
	 * @return {void}
	 */
	function _resizeWindow () {
		var winWidth = window.innerWidth,
			body = $('body');

		// Trigger Desktop
		if ( winWidth > $objNS.mediaQuery.tablet ) {
			if ( $objNS.screenSize !== 'desktop' ) {
		    	$objNS.screenSize = 'desktop';
		        body.trigger('desktop');
			}
		}

		// Trigger Tablet
		if ( winWidth <= $objNS.mediaQuery.tablet && winWidth >= $objNS.mediaQuery.mobile ) {
			if ( $objNS.screenSize !== 'tablet' ) {
		    	$objNS.screenSize = 'tablet';
		        body.trigger('tablet');
			}
		}

		// Trigger Mobile
		if ( winWidth <= $objNS.mediaQuery.mobile ) {		
			if ( $objNS.screenSize !== 'mobile' ) {
		    	$objNS.screenSize = 'mobile';
		        body.trigger('mobile');
			}
		}
	}

	function _bindEvents () {
		var body = $('body');

		$(window).on( 'resize', _resizeWindow );
		
		body.on( 'desktop', _resetAccordion );
		body.on( 'tablet', _resetAccordion );
		body.on( 'mobile', _initAccordion );
	}
	
	var omniture = $objNS.omniture();
	omniture.config('country').trackPage("country selector");

})(NIN);

