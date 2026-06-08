
<?php

	$inData = getRequestInfo();
	
	$id = 0;
	$contactid = 0;

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

		if( $row1 = $result1->fetch_assoc()  )
                {
                    $id = $row1['ID'];
                }
                else
                {
                    returnWithError("No User Found");
                    exit;
                }

        $stmt2 = $conn->prepare("SELECT ID FROM Contacts WHERE Name=? AND Phone=? AND Email=? AND UserID=?");
        $stmt2->bind_param("sssi", $inData["contact"]["name"], $inData["contact"]["phone"], $inData["contact"]["email"], $id);
        $stmt2->execute();
		$result2 = $stmt2->get_result();

		if( $row2 = $result2->fetch_assoc()  )
                {
                    $contactid = $row2['ID'];
                }
                else
                {
                    returnWithError("No Contact Found");
                }

        $stmt3 = $conn->prepare("DELETE FROM Contacts WHERE ID = ?");
		$stmt3->bind_param("i", $contactid);
		$result3 = $stmt3->execute();

        if ($result3)
        {
            returnWithError("");
        } 
        else {
            returnWithError($conn->error);
        }

		$stmt1->close();
        $stmt2->close();
        $stmt3->close();
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
        exit;
	}
?>