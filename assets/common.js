var NIN = NIN || {};

(function( $objNS ){
	'use strict';

	$objNS.common = function ( $objOptions ) {

		var showNav,
			shiftPage,
			isOpen, isSearch,
			speed           = 0.5,
			openClass       = 'drawer-open',
			elMenuToggle    = $('.menu-toggle'),
			elHeader        = $('#global-header'),
			elHeaderDrawer  = $('#global-header-drawer'),
			elPageContainer = $('#page-container'),
			elBackToTop     = $('a.back-to-top'),
			elCopyrightYear  = $('.copyright-year'),
			elSearchInput   = elHeaderDrawer.find('input[type=search]'),
			elBody          = $('body'),
			elWindow        = $(window),
			accordionWidget,
			isToasterActive = false,
			toasterInactiveInterval = null,
			currentScrollTop = $(window).scrollTop();



		function _initialize () {
			bindEvents();

			accordionWidget = new $objNS.accordion('.accordion', {});

			if ( $objNS.is3DS ) {
				elBody.addClass('nin3DS');
			}
			
			if ( $objNS.isNew3DS ) {
				elBody.addClass('new3DS');
			}

			resizeWindow();
			_initModals();
			_initModalVideos();
		}

		function _initModals() {
			if( $('.modal-trigger').length && !$objNS.is3DS ) {
				var modal = new $objNS.modalWindow( '.modal-trigger', {});
					modal.initialize();
			}
		}

		function _initModalVideos() {
			if( $('.modal-video-trigger').length && !$objNS.is3DS ) {
				var videoModal = new $objNS.modalWindow( '.modal-video-trigger', {
					strClassName: 'modal-video',
					videoOnly: true
				});
				videoModal.initialize();
			}
		}

		function toggleNavigation ( $event ) {
			$event.preventDefault();
			$event.stopPropagation();
			var target = $( $event.currentTarget );

			isOpen = elBody.hasClass( openClass );
			isSearch = target.hasClass('icon-search');


			shiftPage = TweenMax.to( elPageContainer, speed, {
				transform: 'translate(80%, 0)',
				//transform: 'translate3d(80%, 0, 0)',
				ease: Expo.easeInOut,
				paused: true,
				onStart: function(){
					elWindow.scrollTop(0);
				},
				onComplete: function(){
					elBody.addClass( openClass );
					elHeaderDrawer.find('input').removeAttr('disabled');
				}
			});
			TweenMax.to( elHeaderDrawer, speed, {
				opacity: 1
			});

		    if ( !isOpen ) {
		        shiftPage.play();
				
				if( $objNS.isIE && $objNS.screenSize == 'tablet' ) {
					TweenMax.to( elHeader, speed, {
						left: '80%',
						ease: Expo.easeInOut
					});
				}

		        if ( isSearch ) {
		        	elHeaderDrawer.find('input').removeAttr('disabled');
		        	elSearchInput.focus();
		    	}
		    } else {
		    	hideNavigation();
		    	elSearchInput.blur();
		    }
		}



		function hideNavigation ( $event ) {

			var isOpen = elBody.hasClass( openClass );

			var resetPage = TweenMax.to( elPageContainer, speed, {
				transform: 'translate(0, 0)',
				//transform: 'translate3d(0, 0, 0)',
				ease: Expo.easeInOut,
				paused: true,
				onComplete: function(){
					elBody.removeClass( openClass );
					elHeaderDrawer.find('input').attr('disabled', 'disabled');
					elSearchInput.blur();

					//elPageContainer.removeAttr('style');
				}
			});
			
			TweenMax.to( elHeaderDrawer, speed, {
				opacity: 0
			});

			if ( isOpen ) {
			    resetPage.play();
				
				if( $event ) {
					$event.preventDefault();
				}

				if( $objNS.isIE && $objNS.screenSize == 'tablet' ) {
					TweenMax.to( elHeader, speed, {
						left: '0%',
						ease: Expo.easeInOut
					});
				}
			}

		}


		function _initAccordion () {
			accordionWidget.initialize();
		}

		function resetAccordion () {
			accordionWidget.remove();
		}


		function desktopResize () {
			resetAccordion();
			hideNavigation();
		}

		function tabletResize () {
			resetAccordion();
			hideNavigation();
		}

		function mobileResize () {
			_initAccordion();
			hideNavigation();
		}




		/**
		 * Trigger custom events when certain breakpoints are triggered
		 * @return {void}
		 */
		function resizeWindow ( $forceEvent ) {
			var winWidth = window.innerWidth;

			elBody.trigger('change');

			if ( winWidth <= $objNS.mediaQuery.mobile ) { // Trigger Mobile
				if ( $objNS.screenSize !== 'mobile' ) {
					$objNS.screenSize = 'mobile';
					elBody.trigger('mobile');
					elBody.trigger('breakpoint');
				}
			} else if ( winWidth <= $objNS.mediaQuery.tablet ) { // Trigger Tablet
				if ( $objNS.screenSize !== 'tablet' ) {
					$objNS.screenSize = 'tablet';
					elBody.trigger('tablet');
					elBody.trigger('breakpoint');
				}
			} else { 	// Trigger Desktop
				if ( $objNS.screenSize !== 'desktop' ) {
					$objNS.screenSize = 'desktop';
					elBody.trigger('desktop');
					elBody.trigger('breakpoint');
				}				
			}
		}

		/**
		 * Force the breakpoint event to fire
		 * @return {void}
		 */
		function _triggerBreakpoint() {
			resizeWindow( true );
		}

		function onWindowScroll ( $event ){

			var scrollTop = elWindow.scrollTop(),
			direction = currentScrollTop - scrollTop;
			clearTimeout(toasterInactiveInterval);
			
			if ( $objNS.screenSize !== 'desktop' ) {

				if ( scrollTop <= 400 && direction > 0 ) {
				    toasterHide();

				} else if ( scrollTop >= 400 && !isToasterActive && direction !== 0 ) {
					toasterShow();
				}

				toasterInactiveInterval = setTimeout(function() {
					toasterInactive();
				}, 1000);

			} else if(isToasterActive){
				toasterHide();
			}

			currentScrollTop = scrollTop;

			
		}


		function toasterHide () {
			elBackToTop.removeClass("is-on is-inactive").addClass("is-off");
			isToasterActive = false;
			setTimeout(function() {
				elBackToTop.addClass("is-hidden");	
			}, 600);
			/*
			TweenMax.to( elBackToTop, 0.5, {
				//transform: 'translate3d(0px, 80px, 0px)',
				opacity: 0,
				onComplete: function(){
					isToasterActive = false;
				}
			});
			*/
		}


		function toasterShow () {
			isToasterActive = true;
			elBackToTop.removeClass("is-off is-inactive is-hidden").addClass("is-on");
			/*
			if ( !$objNS.isAnimating ) {
				console.log("activating true");
			    TweenMax.to( elBackToTop, 0.5, {
			    	//transform: 'translate3d(0px, 20px, 0px)',
					opacity: 1,
			    	ease: Expo.easeInOut //ease: Back.easeInOut.config( 4 )
			    });
			}
			*/
		}

		function toasterInactive() {
			if(isToasterActive) {
				isToasterActive = false;
				
				elBackToTop.removeClass("is-on is-off is-hidden").addClass("is-inactive");
				/*
				if ( !$objNS.isAnimating ) {
				    TweenMax.to( elBackToTop, 2, {
						opacity: .2,
				    	ease: Expo.easeInOut
				    });
				}
				*/
			}
		}



		function scrollToTop ( $event ) {
			$event.preventDefault();

			TweenMax.to(window, 0.5, {
				scrollTo:{y:0, x:0},
				ease: Expo.easeInOut
			});
		}

		function onSearchFormSubmit( $event ) {
			$event.preventDefault();
			var formData = $(this).serializeArray();
			var searchTerms = formData[0].value;
			for (var sub in $objNS.substitutions) {
				if (~searchTerms.toLowerCase().indexOf(sub))
					searchTerms = searchTerms.replace(new RegExp(sub, 'ig'), $objNS.substitutions[sub]);
			}
			var newUrl = '/search/#/results/' + searchTerms + '/1';
				
			window.location = newUrl;
		}


		function bindEvents () {

			elWindow.on( 'resize', resizeWindow );
			elWindow.on( 'scroll', onWindowScroll );
			document.addEventListener("touchmove", onWindowScroll);

			elBody.on( 'desktop', desktopResize );
			elBody.on( 'tablet', tabletResize );
			elBody.on( 'mobile', mobileResize );

			elMenuToggle.on( 'click', toggleNavigation );
			elPageContainer.on( $objNS.clickTouch, hideNavigation );
			
			$('.search-form').on('submit', onSearchFormSubmit);

			$('.back-to-top').on('click', scrollToTop );
		}


		return {
			initialize: _initialize,
			triggerBreakpoint: _triggerBreakpoint
		};
	};
})(NIN);

