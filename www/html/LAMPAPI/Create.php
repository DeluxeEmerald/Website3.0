
<?php

	$inData = getRequestInfo();
	
	$id = 0;
	$contactsList = [];

	if (!$inData["login"] | !$inData["password"] | !$inData["contact"]["name"] | !$inData["contact"]["phone"] | !$inData["contact"]["email"])
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
                }
                else
                {
                    returnWithError("No User Found");
					exit;
                }

        $stmt2 = $conn->prepare("INSERT INTO Contacts (Name, Phone, Email, UserID) VALUES (?, ?, ?, ?)");
		$stmt2->bind_param("sssi", $inData["contact"]["name"], $inData["contact"]["phone"], $inData["contact"]["email"], $id);
		try {
			$result2 = $stmt2->execute();
			returnWithError("");
		}
		catch (Exception $e) {
			returnWithError($e->getMessage());
		}

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
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
?>
