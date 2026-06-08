
<?php

	$inData = getRequestInfo();
	
	$id = 0;
	$firstName = "";
	$lastName = "";
	$contactsList = [];

	if (!$inData["login"] | !$inData["password"])
	{
		returnWithError("One or more required fields are missing.");
		exit;
	}

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331"); 	
	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		$stmt1 = $conn->prepare("SELECT ID,FirstName,LastName FROM Users WHERE Login=? AND Password =?");
                $stmt1->bind_param("ss", $inData["login"], $inData["password"]);
                $stmt1->execute();
                $result1 = $stmt1->get_result();

		if( $row = $result1->fetch_assoc()  )
		{
			$id = $row['ID'];
			$firstName = $row['FirstName'];
			$lastName = $row['LastName'];

			$formatted_name = "%" . $inData["contactname"] . "%";
		}
			else
			{
				returnWithError("No User Found");
				exit;
			}

		$stmt2 = $conn->prepare("SELECT ID,Name,Phone,Email FROM Contacts WHERE UserID = ? AND Name LIKE ?");
		$stmt2->bind_param("is", $id, $formatted_name);
		$stmt2->execute();
		$result2 = $stmt2->get_result();

		foreach ($result2->fetch_all(MYSQLI_ASSOC) as $row)
		{
			$formatted_row = '{"id":' . $row['ID'] . ',"name":"' . $row['Name'] . '","phone":"' . $row['Phone'] . '","email":"' . $row['Email'] . '"}';
			array_push($contactsList, $formatted_row);
		}

		returnWithInfo($firstName, $lastName, $id, $contactsList);

		$stmt1->close();
		$stmt2->close();
		$conn->close();
	}
	
	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $firstName, $lastName, $id, $contactsList )
	{
		$retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","contacts":[' . implode(", ", $contactsList) . '],"error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>
