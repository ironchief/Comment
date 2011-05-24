// fetches 10 most recent comments. You need to insert your API key, and and forum ID. Here shows you how: https://groups.google.com/group/disqus-dev/web/api-1-1#create_post

$response = file_get_contents("http://disqus.com/api/get_forum_posts?user_api_key=INSERT_API_KEY&api_version=1.1&forum_id=INSERT_FORUM_ID&limit=10");
//$response = file_get_contents("http://localhost/");
echo $response . "<br>";

$json_array = json_decode($response,true);

for ($i = 0; $i < count($json_array["message"]); $i++) {
    
    $userName = $json_array["message"][$i]["author"]["display_name"];

    if ($userName == null)
        $userName = $json_array["message"][$i]["author"]["username"];
    
    if ($userName == null)
        $userName = $json_array["message"][$i]["anonymous_author"]["name"];

    $storyName = $json_array["message"][$i]["thread"]["title"];
    $storyURL = $json_array["message"][$i]["thread"]["url"];
    $commentContent = $json_array["message"][$i]["message"];
    echo "<br>";
    
    echo "<b>".$userName."</b> <i>posted a comment on</i> <a href =".$storyURL.">". $storyName."</a>";
    echo "<br>";
    echo "* ".$commentContent."<br>";

}


?>