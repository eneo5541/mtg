var MTGDB_endPoint = "http://api.mtgdb.info/";
var Deckbrew_endPoint = "https://api.deckbrew.com/mtg/";

$(document).ready(function() 
{
	$header = $("#header");
	$content = $("#content");
	
	if (getParameterByName("set") != null)
		loadCardsList(getParameterByName("set"), 0);
	else if (getParameterByName("search") != null)
		searchForCard(getParameterByName("search"));  // Assuming no one needs more than 100 search results
	else
		loadSetsList();
});

function searchForCard(cardName)
{
	hideSearch();
	showSubmit();
	
	$content.html('');
	$header.html('Loading cards for ' + cardName);
	
	var url = Deckbrew_endPoint + "cards/typeahead?q=" + cardName;
	var request = $.get(url);
	request.done(function(data)
	{
		$header.html('Found ' + data.length + ' matches for ' + cardName);
		
		var templateSource = $("#cardListItemTemplate").html();
		var template = Handlebars.compile(templateSource);
		
		for (i = 0; i < data.length; i++) 
		{
			var card = data[i];
			if ((card.types == "land" && card.supertypes == "basic") || card.types == "vanguard")
				continue;
			
			for (j = 0; j < card.editions.length; j++)
			{
				var edition = card.editions[j];
				var cardData = {};
				cardData.name = card.name;
				cardData.colours = card.colors;
				cardData.id = edition.multiverse_id;
				cardData.rarity = parseRarity(edition.rarity);
				cardData.price = (edition.price.high / 100);
				
				if ((card.colors == null || card.colors.length == 0) && card.cmc > 0)
					cardData.colours = ["none"];
				
				var html = template(cardData);
				$content.append(html);
			}
		}
	});
}

function loadCardsList(setID, page)
{
	hideSearch();
	showSubmit();
	
	if (page == 0)
		$content.html('');
	$header.html('Loading cards for ' + setID);
	
	var url = Deckbrew_endPoint + "cards/?set=" + setID + "&page=" + page;
	var request = $.get(url);
	request.done(function(data)
	{
		var templateSource = $("#cardListItemTemplate").html();
		var template = Handlebars.compile(templateSource);
		
		for (i = 0; i < data.length; i++) 
		{
			var card = data[i];
			if ((card.types == "land" && card.supertypes == "basic") || card.types == "vanguard")
				continue;
			
			var cardData = {};
			cardData.name = card.name;
			cardData.colours = card.colors;
			if ((card.colors == null || card.colors.length == 0) && card.cmc > 0)
				cardData.colours = ["none"];
			
			for (j = 0; j < card.editions.length; j++)
			{
				var edition = card.editions[j];
				if (edition.set_id == setID)
				{
					cardData.id = edition.multiverse_id;
					cardData.rarity = parseRarity(edition.rarity);
					cardData.price = (edition.price.high / 100);
				}
			}
			
			var html = template(cardData);
			$content.append(html);
		}
		
		if (data.length >= 100)
			loadCardsList(setID, (page+1));
		else
			getSetData(setID);
	});
}

function getSetData(setID)
{
	var url = Deckbrew_endPoint + "sets/" + setID;
	var request = $.get(url);
	request.done(function(data)
	{
		$header.html(data.name); 
	});
}

function loadSetsList()
{
	hideSubmit();
	showSearch();
	
	$content.html('');
	$header.html('Loading sets...');
	
	var url = MTGDB_endPoint + "sets/";
	var request = $.get(url);
	request.done(function(data)
	{
		$header.html('Done. Loaded ' + data.length + ' sets.');
		var templateSource = $("#setListItemTemplate").html();
		var template = Handlebars.compile(templateSource);
		
		var setsList = data.reverse();
		var promoList = []
		
		var setData = { title:"Core and Expansions", sets:[] };
		for (i = 0; i < setsList.length; i++) 
		{ 
			var set = setsList[i];
			if (set.type == "Online")
			{
				continue;
			}
			else if (set.type != "Expansion" && set.type != "Core")
			{	
				promoList.push(set);
				continue;
			}
			
			setData.sets.push(parseSetData(set));
		}
		
		var html = template(setData);
		$content.append(html);
		
		setData = { title:"Promotional", sets:[] };
		for (i = 0; i < promoList.length; i++) 
		{ 
			setData.sets.push(parseSetData(promoList[i]));
		}
		
		html = template(setData);
		$content.append(html);
	}); 
}

function parseSetData(set)
{
	var setData = {};
	setData.name = set.name;
	setData.link = '?set=' + set.id;
	
	return setData;
}

function parseRarity(rarity)
{
	switch (rarity)
	{
		case "common":
			return "C";
		case "uncommon":
			return "U";
		case "rare":
			return "R";
		case "mythic":
			return "M";
		default:
			return "";
	}
}

function getParameterByName(name)
{
	name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
	var regexS = "[\\?&]"+name+"=([^&#]*)";
	var regex = new RegExp( regexS );
	var results = regex.exec( window.location.href );
	if( results == null )
		return null;
	else
		return decodeURIComponent(results[1].replace(/\+/g, " "));
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
	$("#submit")/*.removeAttr('disabled')*/.show();  // Not ready to set form data yet
}