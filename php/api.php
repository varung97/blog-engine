<?php
	require_once("connect.php");
	require_once("prep_stmt.php");

	$rawInput = file_get_contents('php://input');
  $input = json_decode($rawInput, true);

	function new_post($data){
		global $con, $new_post_stmt;

		$username = $_SESSION['username'];
		$title = $data['title'];
		$text = $data['text'];

		$new_post_stmt->bind_param("sss", $username, $title, $text);
		$new_post_stmt->execute();
		$new_post_stmt->close();

		return array (
			'Status' => 'Success'
		);
	}

	function edit_post($data){
		global $con, $edit_post_stmt;

		$title = $data['title'];
		$text = $data['text'];
		$Post_ID = intval($data['Post_ID']);

		$edit_post_stmt->bind_param("ssi", $title, $text, $Post_ID);
		$edit_post_stmt->execute();
		$edit_post_stmt->close();

		return array (
			'Status' => 'Success'
		);
	}

	function get_title(){
		global $con;

		$sql = "SELECT * FROM test_table";
		$result1 = mysqli_query($con, $sql) or die("ERROR: ".mysqli_error($con));
		return array (
			'title' => mysqli_fetch_array($result1)["Number"]
		);
	}

	function login($username, $password){
		global $con;

		$sql = sprintf("SELECT * FROM login_info WHERE username = '%s'", $username);
		$result1 = mysqli_query($con, $sql) or die("ERROR: ".mysqli_error($con));

		if (mysqli_num_rows($result1) != 0) {
			$row = mysqli_fetch_array($result1);
			if($row['username'] === $username && $row['password'] === $password){
				$_SESSION["username"] = $username;
				return array(
					'Status' => 'Success'
				);
			}
		}

		return array(
			'Status' => 'Sorry'
		);
	}

	function logout(){
		session_unset();
		session_destroy();
	}

	function is_logged_in(){
		if (isset($_SESSION["username"])) {
			return array (
				'LoggedIn' => 'True',
				'username' => $_SESSION["username"]
			);
		} else {
			return array (
				'LoggedIn' => 'False'
			);
		}
	}

	function signup($username, $password){
		global $con;

		$sql = sprintf("SELECT * FROM login_info WHERE username = '%s'", $username);
		$result1 = mysqli_query($con, $sql) or die("ERROR: ".mysqli_error($con));

		if (mysqli_num_rows($result1) == 1) {
			return array (
				'Status' => 'Username taken'
			);
		} else {
			$sql = sprintf("INSERT INTO `login_info` (`username`, `password`)
											VALUES ('%s', '%s')", $username, $password);
      mysqli_query($con, $sql) or die("ERROR: ".mysqli_error($con));
			return array (
				'Status' => 'Success'
			);
		}
	}

	function get_posts($only_user_posts, $page_number){
		global $con;

		$posts_per_page = 5;
		$start = $posts_per_page * ($page_number - 1);
		$end = $posts_per_page;

		if ($only_user_posts == 'true') {
			$sql = sprintf("SELECT * FROM articles WHERE username = '%s' ORDER BY date_added DESC", $_SESSION['username']);
			$sql2 = sprintf("SELECT COUNT(1) FROM articles WHERE username = '%s'", $_SESSION['username']);
		} else {
			$sql = "SELECT * FROM articles ORDER BY Post_ID DESC";
			$sql2 = "SELECT COUNT(1) FROM articles";
		}
		$sql .= sprintf(" LIMIT %s, %s", $start, $end);

		$result1 = mysqli_query($con, $sql) or die("ERROR: ".mysqli_error($con));

		$articles = array();

		while ($article = mysqli_fetch_array($result1)) {
			array_push($articles, $article);
		}

		$result2 = mysqli_query($con, $sql2);
		$row = mysqli_fetch_array($result2);
		$total = $row[0];

		return array (
			'articles' => $articles,
			'num_pages' => ceil($total / $posts_per_page)
		);
	}

	function get_post($Post_ID){
		global $con;

		$sql = sprintf("SELECT * FROM articles WHERE Post_ID = %s", $Post_ID);
		$result1 = mysqli_query($con, $sql) or die("ERROR: ".mysqli_error($con));

		return mysqli_fetch_array($result1);
	}

	function delete_post($Post_ID){
		global $con;

		$sql = sprintf("DELETE FROM articles WHERE Post_ID = %s", $Post_ID);
		$result1 = mysqli_query($con, $sql) or die("ERROR: ".mysqli_error($con));

		return array (
			'Status' => 'Success'
		);
	}

	function comment_submit($data){
		global $con, $comment_submit_stmt;

		$username = $_SESSION['username'];
		$Post_ID = $data['Post_ID'];
		$text = $data['comment_text'];
		$replied_to = $data['replied_to'];

		$comment_submit_stmt->bind_param("iiss", $Post_ID, $replied_to, $username, $text);
		$comment_submit_stmt->execute();
		$comment_submit_stmt->close();

		return array (
			'Status' => 'Success'
		);
	}

	function get_comments($Post_ID) {
		global $con;

		$sql = sprintf("SELECT * FROM comments WHERE Post_ID = %s ORDER BY date_added", $Post_ID);
		$result1 = mysqli_query($con, $sql) or die("ERROR: ".mysqli_error($con));

		$comments = array();

		while ($comment = mysqli_fetch_array($result1)) {
			array_push($comments, $comment);
		}

		return array (
			'comments' => $comments
		);
	}

	function comment_delete($Comment_ID) {
		global $con;

		$sql = sprintf("SELECT * FROM comments WHERE replied_to = %s", $Comment_ID);
		$result1 = mysqli_query($con, $sql) or die("ERROR: ".mysqli_error($con));
		$sub_comments = array();

		while ($comment = mysqli_fetch_array($result1)) {
			array_push($sub_comments, $comment);
		}

		foreach ($sub_comments as $sub_comment) {
			// Delete all sub_comments for each sub_comment
			$sql = sprintf("DELETE FROM comments WHERE replied_to = %s", $sub_comment['Comment_ID']);
			$result1 = mysqli_query($con, $sql) or die("ERROR: ".mysqli_error($con));
		}

		// Delete sub_comments
		$sql = sprintf("DELETE FROM comments WHERE replied_to = %s", $Comment_ID);
		$result1 = mysqli_query($con, $sql) or die("ERROR: ".mysqli_error($con));

		// Delete comment
		$sql = sprintf("DELETE FROM comments WHERE Comment_ID = %s", $Comment_ID);
		$result1 = mysqli_query($con, $sql) or die("ERROR: ".mysqli_error($con));

		return array (
			'Status' => 'Success'
		);
	}
?>
