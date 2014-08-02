<?php
$cardsList=$_POST['cardIds'];
$totalCards = count($cardsList);

if ($totalCards > 0)
{
	$con=mysqli_connect("localhost", "gamescube", "gamescube01", "test_DB");  // Do not upload prod credentials to github
	if (mysqli_connect_errno())
	{
		echo "Failed to connect to MySQL: " . mysqli_connect_error();
	}
	else
	{
		$queryString = "SELECT * FROM cards WHERE ";
		for($i = 0; $i < $totalCards; $i++)
		{
			$queryString .= "id = $cardsList[$i]";
			if ($i < ($totalCards-1))
				$queryString .= " OR ";
		}
		
		$response = array();
		$result = mysqli_query($con, $queryString);
		
		while($row = mysqli_fetch_array($result))
		{
			array_push($response,  array( "id"=>$row['id'],"price"=>$row['price'],"quantity"=>$row['quantity'] ) );
		}
		echo json_encode($response);
	}
	
	mysqli_close($con);
}
?>

