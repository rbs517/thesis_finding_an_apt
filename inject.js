$(document).keydown(function(e){
	// this gets the keycode of the last key pressed
	// lookup at keycode.info
	
	// the '\' key to start the extension
	if(e.which == 220){
		chrome.runtime.sendMessage({toggleScript:true});
		console.log('Ready to scrape!');

		// then we start the scraper
		scrapeOrders();
	}

});


// scrape the past orders
var orders;
var orderItems;
var orderItemsArray = [];
var orders_str;

function scrapeOrders($selector){
	// check to see if you are on the correct Seamless page- order history
	if(checkWebAddress("https://www.seamless.com/account/history?pageNum=1&pageSize=20&facet=scheduled%3Afalse&facet=orderType%3AALL&sorts=default")){
		
		// restaurant names
		// var orders = '.ghs-order-restaurantLink';

		// print the past orders
		// console.log($('.pastOrderCard-lineItem.s-col-xs-12.u-padding-top-default.u-padding-bottom-default').text());

		// store the scraped data into a variable
		orders = $('.pastOrderCard-lineItem.s-col-xs-12.u-padding-top-default.u-padding-bottom-default').text();

		// parse the text
		for (i = 0; i<orders.length; i++){
			// split the data into individual words
			orderItems = $.trim(orders.split(' ')[i]);

			// turn object into one large array
			orderItemsArray.push(orderItems);
		}

		console.log(orderItemsArray);

		// find keywords in orders
		for (j =0; j<orderItemsArray.length; j++){

			if (orderItemsArray.includes('garlic bread') || orderItemsArray.includes('Garlic Bread') || orderItemsArray.includes('Garlic bread') || orderItemsArray.includes('Garlic') || orderItemsArray.includes('garlic')){
				console.log('highbridge');
				openUrl("https://streeteasy.com/for-rent/highbridge");

			}else if (orderItemsArray.includes('Chicago') || orderItemsArray.includes('chicago')){
				console.log('uws');
				openUrl("https://streeteasy.com/for-rent/upper-west-side");

			}else if (orderItemsArray.includes('Hot Sauce') || orderItemsArray.includes('hot sauce') || orderItemsArray.includes('Hot sauce') || orderItemsArray.includes('Hot') || orderItemsArray.includes('hot')){
				console.log('soho');
				openUrl("https://streeteasy.com/for-rent/soho");

			}else if (orderItemsArray.includes('Cold Brew') || orderItemsArray.includes('Cold brew') || orderItemsArray.includes('Brew') || orderItemsArray.includes('brew') || orderItemsArray.includes('Coldbrew') || orderItemsArray.includes('ColdBrew')){
				console.log('Astoria');
				openUrl("https://streeteasy.com/for-rent/astoria");

			}else if (orderItemsArray.includes('Tenders') || orderItemsArray.includes('tenders') || orderItemsArray.includes('Chicken Tenders') || orderItemsArray.includes('Chicken tenders') || orderItemsArray.includes('chicken tenders')){
				console.log('Fordham');
				openUrl("https://streeteasy.com/for-rent/fordham");

			}else if (orderItemsArray.includes('Banana') || orderItemsArray.includes('Bananas') || orderItemsArray.includes('banana') || orderItemsArray.includes('bananas')){
				console.log('Gramercy');
				openUrl("https://streeteasy.com/for-rent/gramercy-park");

			} else if (orderItemsArray.includes('steak') || orderItemsArray.includes('Steak')){
				console.log('rich');
				openUrl("https://streeteasy.com/for-rent/nyc/price:15000-");  
			
			}else if (orderItemsArray.includes('pizza') || orderItemsArray.includes('Pizza') || orderItemsArray.includes('Soup') || orderItemsArray.includes('soup')){
				console.log('poor');
				openUrl("https://streeteasy.com/for-rent/nyc/price:500-1500%7Cno_fee:1");
				
			}else if (orderItemsArray.includes('salad') || orderItemsArray.includes('Salad')){
				console.log('average');
				openUrl("https://streeteasy.com/for-rent/nyc/price:1750-4000");

			}
		}
		

	}else{

	 }
}


function openUrl(newUrl){
	window.location.assign(newUrl);
}

function checkWebAddress(url) {
	return window.location.href.indexOf(url) >= 0;
}
	