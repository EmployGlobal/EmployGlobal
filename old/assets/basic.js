/*
	Init basic functionality to a page.
	This is necessary for global navigation/footer accordions, responsive breakpoints and other functions.

*/

var NIN = NIN || {};
(function($objNS){
	'use strict';
	
	var common = $objNS.common();
	common.initialize();
	
	// Universal interactions
	$(".js-basic-popup").on("click", function(e) {
		e.preventDefault();
		
		var url = $(this).attr("href");
		window.open(url, "Nintendo.com Popup",'width=800,height=600,scrollbars=no');
		
	});

	

})(NIN);

