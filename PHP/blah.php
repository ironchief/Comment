<html>
<body>

<?php
class Comment {

	public $userName;
	public $storyName;
	public $storyURL;
	public $commentContent;
	public $commentLikes;
	public $bestConfidence;

}

class Thread {
	public $threadID;
	public $threadURL;
	public $threadName;
}

//comment sorting comparison
function cmp($a, $b)
{
	$a = $a->bestConfidence;
	$b = $b->bestConfidence;
    if ($a == $b) {
        return 0;
    }
    return ($a < $b) ? 1 : -1;
}

// Wilson scoring algorithm
function wilsonScore($likes, $dislikes)
{
	$n = $likes + $dislikes;
	if ($n == 0){
		return 0;
	}
	$z = 1; //1.0 = 85%, 1.6 = 95%
	$phat = $likes / $n;
	$score = sqrt($phat+$z*$z/(2*$n)-$z*(($phat*(1-$phat)+$z*$z/(4*$n))/$n))/(1+$z*$z/$n);
	return $score;
}

function hotScore($likes, $time)
{
	$order = log(max($likes, 1), 10);
	$source = strtotime($time);
	$now = getdate();
	date_default_timezone_set('UTC');
	//$interval = date_diff($source, $now);
	$seconds = round(abs($now-$source));
	$score = round(order + sign * seconds / 45000, 7);
	return $score;
}

$response = file_get_contents("http://disqus.com/api/get_thread_list?user_api_key=az2jNJ6gR0S4fFI5g6teYJiEHdFEmzrm19iDJWpf5IYz8jFLUxHgHH2xg2uRKW31&api_version=1.1&forum_id=806579&limit=30");
//echo $response . "<br>";

$json_array = json_decode($response,true);
$threadIDs;

//Parse JSON and extract the Threads
for ($i = 0; $i < count($json_array["message"]); $i++) {

	$aThread = new Thread();
	
	$aThread->threadID = $json_array["message"][$i]["id"];
	$aThread->threadURL = $json_array["message"][$i]["url"];
	$aThread->threadName = $json_array["message"][$i]["title"];
	$threadIDs[$i] = $aThread;	
}

//Comments
for ($i = 0; $i < count($threadIDs); $i++) {

	//echo "Thread count: ".count($threadIDs)."<br>";
	//echo "Thread ID: ".$threadIDs[$i]." ".$i."<br>";

	$response = file_get_contents("http://disqus.com/api/get_thread_posts?user_api_key=az2jNJ6gR0S4fFI5g6teYJiEHdFEmzrm19iDJWpf5IYz8jFLUxHgHH2xg2uRKW31&api_version=1.1&thread_id=".$threadIDs[$i]->threadID."&limit=5");

	$json_array = json_decode($response,true);
	//echo "<br>".$response."<br>";

	if ($json_array["message"] == NULL) {
		continue;
	}

	echo "<div style=\"border: 4px solid rgb(0, 0, 0)\">";
	echo "<div style=\"margin: 15px\">";

	echo "<h2><a href =".$threadIDs[$i]->threadURL.">".$threadIDs[$i]->threadName."</a>:</h2>";

	//Parse JSON and make new comment object
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
		$commentLikes = $json_array["message"][$j]["likes"];

		$aComment = new Comment();
		$aComment->userName = $userName;
		$aComment->storyName = $storyName;
		$aComment->storyURL = $storyURL;
		$aComment->commentContent = $commentContent;
		$aComment->commentLikes = $commentLikes;
		$aComment->bestConfidence = wilsonScore($commentLikes, 0);

		$commentArray[$j] = $aComment;
				
	}
	
	//Sort Comments
	usort($commentArray, "cmp");
	
	//Display comments
	for ($j = 0; $j < count($commentArray); $j++) {

		echo "<b>".$commentArray[$j]->userName."</b> <i>says:</i>";
		echo "<br>";
		echo "<ul>\"".$commentArray[$j]->commentContent."\"</ul>";
	}	
	echo "</div></div>";
	echo "<br><br>";
}

?>

</body>
</html>
