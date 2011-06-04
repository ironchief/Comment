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


// Disqus API
require('disqusapi/disqusapi.php');

// Fetch list of threads
$secret_key = Z2svV8MrCFPAxsgypNlvyiNCX6SaZsqx0GY6DCdODlTaBTy8tcoWFj4Jl8xoQQ1G;
$disqus = new DisqusAPI($secret_key);
$threads = $disqus->threads->list(array('forum'=>'kazizlocalhost'));

//print_r($threads[0]);
//echo $secret_key;

$listOfThreads;
//Parse JSON and extract useful info from the thread data, and put that info in an array
for ($i = 0; $i < count($threads); $i++) {

	$aThread = new Thread();
	
	$aThread->threadID = $threads[$i]->id;
	$aThread->threadURL = $threads[$i]->link;
	$aThread->threadName = $threads[$i]->title;
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
	echo "<div style=\"border: 4px solid rgb(0, 0, 0)\">";
	echo "<div style=\"margin: 15px\">";

	echo "<h2><a href =".$listOfThreads[$i]->threadURL.">".$listOfThreads[$i]->threadName."</a>:</h2>";

//	print_r($posts[1]);
	
	//Parse JSON and make new comment object
	for ($j = 0; $j < count($posts); $j++) {

		$aComment = new Comment();

		$aComment->userName = $posts[$j]->author->name;
		$aComment->storyName = $listOfThreads[$i]->threadName;
		$aComment->storyURL = $listOfThreads[$i]->threadURL;
		$aComment->commentContent = $posts[$j]->message;
		$aComment->commentLikes = $posts[$j]->likes;
		$aComment->bestConfidence = wilsonScore($aComment->commentLikes, 0);
				
		$commentArray[$j] = $aComment;
		
		//echo "<br><br>".$commentContent."<br><br>";
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

/*

	
	
	
	echo "</div></div>";
	echo "<br><br>";
}
*/
?>

</body>
</html>
