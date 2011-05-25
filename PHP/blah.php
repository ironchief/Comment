<html>
<body>

<?php
class Comment {

	public $userName;
	public $storyName;
	public $storyURL;
	public $commentContent;

}
$response = file_get_contents("http://disqus.com/api/get_thread_list?user_api_key=az2jNJ6gR0S4fFI5g6teYJiEHdFEmzrm19iDJWpf5IYz8jFLUxHgHH2xg2uRKW31&api_version=1.1&forum_id=806579&limit=30");
//echo $response . "<br>";

$json_array = json_decode($response,true);
$threadIDs;

for ($i = 0; $i < count($json_array["message"]); $i++) {
	
	$threadIDs[$i] = $json_array["message"][$i]["id"];

}

for ($i = 0; $i < count($threadIDs); $i++) {

	//echo "Thread count: ".count($threadIDs)."<br>";
	//echo "Thread ID: ".$threadIDs[$i]." ".$i."<br>";

	$response = file_get_contents("http://disqus.com/api/get_thread_posts?user_api_key=az2jNJ6gR0S4fFI5g6teYJiEHdFEmzrm19iDJWpf5IYz8jFLUxHgHH2xg2uRKW31&api_version=1.1&thread_id=".$threadIDs[$i]."&limit=5");

	$json_array = json_decode($response,true);
	//echo "<br>".$response."<br>";

	if ($json_array["message"] == NULL) {
		//echo "No comments ...<br><br>";
		continue;
	}

	echo "<div style=\"border: 4px solid rgb(0, 0, 0)\">";
	echo "<div style=\"margin: 15px\">";

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

		echo "<b>".$commentArray[$j]->userName."</b> <i>posted a comment on</i> <a href =".$commentArray[$j]->storyURL.">".$commentArray[$j]->storyName."</a>:";
		echo "<br>";
		echo "<ul>\"".$commentArray[$j]->commentContent."\"</ul>";
	}	

	echo "</div></div>";
	echo "<br><br>";

}



?>

</body>
</html>
