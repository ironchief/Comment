<html>
<body>

<?php
/*
function myPrint($someText) {

if ($someText == "Khalid")
	echo $someText;
elseif ($someText == "Northwestern")
	echo "Go U " . $someText;
else
	echo "Whatcha saaaaay? " . $someText;

echo "<br>";

}


echo "Salaam dunya!<br>";
echo "Hello World!<br>";

$text = "You're one hell of a crazy place! <br>";
echo $text;
$num = 19;
echo "I'm $num years old. ";
$num = "nineteen";
echo "That's $num years. How old are you? <br>";

echo "<br>";
$text = "Hello World";
echo "String \"$text\" has " . strlen($text) . " characters, with world starting at " . strpos($text,"World") . ".<br>";

myPrint("Testing Function");
myPrint("Khalid");
myPrint("Northwestern");
myPrint("Bull");

$cars[0] = "Chicago";
$cars[1] = "2";
$cars[2] = "Houston";

echo $cars[0] . "<br>";

for ($i = count($cars)-1 ; $i >= 0; $i--) {
	echo $cars[$i] . " ";
}
x
echo "<br>";

foreach ($cars as $aCar) {
	echo $aCar . " ";
}

echo "<br>";
*/

class Comment {

	public $userName;
	public $storyName;
	public $storyURL;
	public $commentContent;

}
$response = file_get_contents("http://disqus.com/api/get_thread_list?user_api_key=az2jNJ6gR0S4fFI5g6teYJiEHdFEmzrm19iDJWpf5IYz8jFLUxHgHH2xg2uRKW31&api_version=1.1&forum_id=806579&limit=30");
//$response = file_get_contents("http://localhost/");
//echo $response . "<br>";

$json_array = json_decode($response,true);
$threadIDs;

for ($i = 0; $i < count($json_array["message"]); $i++) {
	
	$threadIDs[$i] = $json_array["message"][$i]["id"];

	//echo $threadIDs[$i];
	/*
	$userName = $json_array["message"][$i]["author"]["display_name"];

	if ($userName == null)
		$userName = $json_array["message"][$i]["author"]["username"];
	
	if ($userName == null)
		$userName = $json_array["message"][$i]["anonymous_author"]["name"];

	$storyName = $json_array["message"][$i]["thread"]["title"];
	$storyURL = $json_array["message"][$i]["thread"]["url"];
	$commentContent = $json_array["message"][$i]["message"];
	

	$aComment = new Comment();

	$aComment->userName = $userName;
	$aComment->storyName = $storyName;
	$aComment->StoryURL = $storyURL;
	$aComment->commentContent = $commentContent;

	$commentArray[$i] = $aComment;

	*/

//	echo "Thread ID: ".$threadIDs[$i]."<br>";
//	echo "Thread count: ".count($threadIDs)."<br>";
}

for ($i = 0; $i < count($threadIDs); $i++) {

	//echo "Thread count: ".count($threadIDs)."<br>";
	//echo "Thread ID: ".$threadIDs[$i]." ".$i."<br>";

	$response = file_get_contents("http://disqus.com/api/get_thread_posts?user_api_key=az2jNJ6gR0S4fFI5g6teYJiEHdFEmzrm19iDJWpf5IYz8jFLUxHgHH2xg2uRKW31&api_version=1.1&thread_id=".$threadIDs[$i]."&limit=5");

	$json_array = json_decode($response,true);
	//echo "<br>".$response."<br>";

	if ($json_array["message"] == NULL) {
		echo "No comments ...<br><br>";
		continue;
	}

	for ($j = 0; $j < count($json_array["message"]); $j++) {

		$aComment = new Comment();

		$userName = $json_array["message"][$j]["author"]["display_name"];

		if ($userName == null)
			$userName = $json_array["message"][$j]["author"]["username"];
	
		if ($userName == null)
			$userName = $json_array["message"][$j]["anonymous_author"]["name"];

		$storyName = $json_array["message"][$j]["thread"]["title"];
		$storyURL = $json_array["message"][$j]["thread"]["url"];
		$commentContent = $json_array["message"][$j]["message"];

		$aComment = new Comment();
		$aComment->userName = $userName;
		$aComment->storyName = $storyName;
		$aComment->storyURL = $storyURL;
		$aComment->commentContent = $commentContent;

		$commentArray[$j] = $aComment;
				
	}


	
	for ($j = 0; $j < count($commentArray); $j++) {

		echo "<b>".$commentArray[$j]->userName."</b> <i>posted a comment on</i> <a href =".$commentArray[$j]->storyURL.">".$commentArray[$j]->storyName."</a>";
		echo "<br>";
		echo "* ".$commentArray[$j]->commentContent."<br><br>";
	}	
	echo "---<br><br>";

}



?>

</body>
</html>
