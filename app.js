var endPoint = "http://api.mtgdb.info/";

$(document).ready(function() 
{
	$header = $("#header");
	$preview = $("#preview");
	$content = $("#content");
	if (getParameterByName("set") != null)
		loadCardsList(getParameterByName("set"));
	else
		loadSetsList();
});

function loadCardsList(setID)
{
	$header.html('Loading cards for ' + setID);
	
	var url = endPoint + "sets/" + setID + "/cards/?fields=id,name,colors,cardSetName,rarity,type";
	var request = $.get(url);
	request.done(function(data)
	{
		$content.html('');
		var templateSource = $("#cardListItemTemplate").html();
		var template = Handlebars.compile(templateSource);
		
		for (i = 0; i < data.length; i++) 
		{
			var card = data[i];
			
			if (i == 0)
				$header.html(card.cardSetName);
			
			var cardData = {};
			cardData.name = card.name;
			cardData.id = card.id;
			cardData.rarity = parseRarity(card.rarity);
			
			var colours = parseColours(card.colors);
			if (colours == "None" && card.type == "Artifact")   // Replace colours with dots rather than letters
				colours = "A";
			cardData.colours = colours;
			
			var html = template(cardData);
			$content.append(html);
		}
	});
}

function parseRarity(rarity)
{
	switch (rarity)
	{
		case "Common":
			return "C";
		case "Uncommon":
			return "U";
		case "Rare":
			return "R";
		case "Mythic Rare":
			return "M";
		default:
			return "";
	}
}

function parseColours(colors)
{
	var colours = colors.toString();
	
	colours = colours.replace("white", "W");
	colours = colours.replace("red", "R");
	colours = colours.replace("blue", "U");
	colours = colours.replace("green", "G");
	colours = colours.replace("black", "B");
	
	return colours;
}

function loadSetsList()
{
	$header.html('Loading character data...');
	
	var url = endPoint + "sets/";
	var request = $.get(url);
	request.done(function(data)
	{
		$header.html('Done. Loaded ' + data.length + ' sets.');
		$content.html('');
		var templateSource = $("#setListItemTemplate").html();
		var template = Handlebars.compile(templateSource);
		
		var setsList = data.reverse();
		var promoList = [];
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
			
			var setData = parseSetData(set);
			var html = template(setData);
			$content.append(html);
		}
		
		for (i = 0; i < promoList.length; i++) 
		{ 
			var setData = parseSetData(promoList[i]);
			var html = template(setData);
			$content.append(html);
		}
	}); 
}

function parseSetData(set)
{
	var setData = {};
	setData.name = set.name;
	setData.link = '?set=' + set.id;
	
	return setData;
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
	$preview.offset({ top: $( document ).scrollTop() });
	$preview.attr("src", "http://api.mtgdb.info/content/card_images/" + img.id + ".jpeg");
	$preview.show();
}

function closePreview(img)
{
	$preview.hide();
}