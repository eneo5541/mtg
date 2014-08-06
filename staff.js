getCardsFromMySQL = function (cardIds)
{
	var request = $.post("requestCards.php", {cardIds: cardIds});
	request.done(function(data)
	{
		var response = jQuery.parseJSON(data);
		for (i = 0; i < response.length; i++) 
		{
			var card = response[i];
			//$("#" + card.id + "_price_label").html("$"+(card.price / 100));
			$("#" + card.id + "_price").val(card.price / 100);
			$("#" + card.id + "_quantity").val(card.quantity);
		} 
	});
}

function openPreview(img)
{
	var $preview = $("#preview");
	$preview.offset({ top: $( document ).scrollTop() });
	$preview.attr("src", "http://api.mtgdb.info/content/card_images/" + img.id + ".jpeg");
	$preview.show();
}

function closePreview(img)
{
	$("#preview").hide();
}

switchToSubmit = function() 
{
	hideSearch();
	showSubmit();
}

switchToSearch = function() 
{
	hideSubmit();
	showSearch();
}

function hideSearch()
{
	$("#searchInput").attr('disabled', 'disabled').hide();
	$("#searchButton").attr('disabled', 'disabled').hide();
}

function showSearch()
{
	$("#searchInput").removeAttr('disabled').show();
	$("#searchButton").removeAttr('disabled').show();
}

function hideSubmit()
{
	$("#submit").attr('disabled', 'disabled').hide();
}

function showSubmit()
{
	$("#submit").removeAttr('disabled').show();
}