<html>
<body>

<?php
class Comment {

	public $userName;
	public $storyName;
	public $storyURL;
	public $commentContent;
	public $commentLikes;
	public $commentTime;
	public $bestConfidence;

}

class Thread {
	public $threadID;
	public $threadURL;
	public $threadName;
	public $threadTime;
	public $threadComments;
}

function getTime ($time) {

	

	$now = time();


	date_default_timezone_set('UTC');
/*	
	echo date_default_timezone_get();
	echo "post time: " .date("F dS, Y",$time)." <i>at</i> ".date("g:ia",$time)."<br>";
	
	echo date_default_timezone_get();
	echo "curr time: " .date("F dS, Y",$now)." <i>at</i> ".date("g:ia",$now)."<br>";
*/	
	$timestr;
	if ($now - $time < 60)
		$timestr = strval($now-$time)." seconds ago";
	else if ($now - $time < 3600)
		$timestr = strval(floor(($now-$time)/60))." minutes ago";
	else if ($now - $time < 3600*24)
		$timestr = strval(floor(($now-$time)/(60*24)))." hours ago";
	else
		$timestr = date("F dS, Y",$time)." <i>at</i> ".date("g:ia",$time)."<br>";

	return $timestr;
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
	$interval = date_diff($source, $now);
	$seconds = round(abs($interval));
	$score = round(order + sign * seconds / 45000, 7);
	//date_default_timezone_set('America/Chicago');
	return $score;
}


// Disqus API
require('disqusapi/disqusapi.php');

// Fetch list of threads
$secret_key = 'Z2svV8MrCFPAxsgypNlvyiNCX6SaZsqx0GY6DCdODlTaBTy8tcoWFj4Jl8xoQQ1G';
$disqus = new DisqusAPI($secret_key);
$threads = $disqus->threads->list(array('forum'=>'kazizlocalhost'));

//print_r($threads[1]);
//echo $secret_key;
date_default_timezone_set('UTC');

$listOfThreads;

//Parse JSON and extract useful info from the thread data, and put that info in an array
for ($i = 0; $i < count($threads); $i++) {

	$aThread = new Thread();
	
	$aThread->threadID = $threads[$i]->id;
	$aThread->threadURL = $threads[$i]->link;
	$aThread->threadName = $threads[$i]->title;
	$aThread->threadTime = $threads[$i]->createdAt;
	$aThread->threadComments = $threads[$i]->posts;

	$listOfThreads[$i] = $aThread;	

// Test to make sure threads being taken in correctly.
/*
	echo $aThread->threadID."<br>";
	echo $aThread->threadURL."<br>";
	echo $aThread->threadName."<br>";
*/
}

//Comments

// fetch the comments from each of the threads in turn
for ($i = 0; $i < count($listOfThreads); $i++) {

	// get JSON
	$posts = $disqus->posts->list(array('thread'=>$threads[$i]->id));
	
	if (count($posts) == 0)
		continue;
	
	// echo div tags and CSS for formatting
	echo "<div style=\"margin: 15px; padding: 15px; border: 4px solid rgb(0, 0, 0); \">"; // div per box

	echo "<a href =".$listOfThreads[$i]->threadURL." style=\"text-decoration: underline; font-size: 18pt; font-family: Verdana, Helvetica, Arial, 'Lucida Grande'\">".$listOfThreads[$i]->threadName.":</a><br><br>";


	$timestamp = strtotime($listOfThreads[$i]->threadTime);
	$timestampLastPost = strtotime($posts[0]->createdAt);
	//print_r($posts[0]);
	
	echo "<b>Story posted on: </b>".date("F dS, Y",$timestamp)." <i>at</i> ".date("g:ia",$timestamp)."<br>";
	echo "<b>Number of comments: </b>".$listOfThreads[$i]->threadComments."<br><br>";
	
	//Parse JSON and make new comment object
	for ($j = 0; $j < count($posts); $j++) {

		$aComment = new Comment();

		$aComment->userName = $posts[$j]->author->name;
		$aComment->storyName = $listOfThreads[$i]->threadName;
		$aComment->storyURL = $listOfThreads[$i]->threadURL;
		$aComment->commentContent = $posts[$j]->message;
		$aComment->commentLikes = $posts[$j]->likes;
		$aComment->commentTime = $posts[$j]->createdAt;
		$aComment->bestConfidence = hotScore($aComment->commentLikes, $aComment->commentTime);
				
		$commentArray[$j] = $aComment;

		//echo "<br><br>".$commentContent."<br><br>";
	}

	//Sort Comments
	usort($commentArray, "cmp");

	
	//Display comments
	for ($j = 0; $j < count($commentArray); $j++) {

		if ($j >= 5)
			break;
		
		$timestamp = strtotime($commentArray[$j]->commentTime);
		echo "<b>".$commentArray[$j]->userName."</b> <i>says:</i><br>";
		echo "\"".$commentArray[$j]->commentContent."\"";

		echo "<div style=\"text-align: right; font-size: 8pt;\">";
		date_default_timezone_set('America/Chicago');
		
		echo "<i>comment posted on:</i> ".date("F dS, Y",$timestamp)." <i>at</i> ".date("g:ia",$timestamp);	
		echo "</div><br>";	
		date_default_timezone_set('UTC');
	}

	echo "<div style=\"text-align: center;\">";

	echo "<b>Last comment posted </b>".getTime($timestampLastPost)."<br>";
	echo "</div><br>";

	echo "<center><a href =".$listOfThreads[$i]->threadURL." style=\"text-decoration: underline; font-size: 14pt;\">Join the Conversation!</a></center>";
	
	echo "</div>";//</div>";
	echo "<br><br>";
}

?>

</body>
</html>
