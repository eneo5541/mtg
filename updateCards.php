<?php
	$cards = array();
	foreach($_POST as $key=>$value)
	{
		$isNotBlank = (isset($value) && trim($value)!=='');
		if ((bool) $isNotBlank)
		{
			$properties = explode("_", $key);
			if (count($properties) > 1)
			{
				$id = $properties[0];
				$varName = $properties[1];
				$cards[$id][$varName] = $value;
			}
		}
	}
	
	$con=mysqli_connect("localhost", "gamescube", "gamescube01", "test_DB");  // Do not upload prod credentials to github
	if (mysqli_connect_errno())
	{
		echo "Failed to connect to MySQL: " . mysqli_connect_error();
	}
	else
	{
		$keyList = array_keys($cards);
		$totalKeys = count($keyList);
		
		$queryString = "INSERT INTO cards ( id, price, quantity ) VALUES ";
		for($i = 0; $i < $totalKeys; $i++)
		{
			$key = $keyList[$i];
			$cardProperties = $cards[$key];
			$quantity = $cardProperties['quantity'];
			$price = $cardProperties['price'];
			$priceInCents = floatval($price) * 100;
		
			$queryString .= "($key, $priceInCents, $quantity)";
			if ($i < ($totalKeys-1))
				$queryString .= ", ";
		}
		$queryString .= " ON DUPLICATE KEY UPDATE price = VALUES(price), quantity = VALUES(quantity)";
		
		mysqli_query($con, $queryString);
	}
	
	mysqli_close($con);
	
	ob_start();
	$url = $_SERVER['HTTP_REFERER'];

	while (ob_get_status()) 
	{
		ob_end_clean();
	}

	header( "Location: $url" );
	exit;
?>