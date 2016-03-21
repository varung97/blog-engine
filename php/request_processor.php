<?php
	session_start();

	require_once('api.php');

	if (isset($input['function'])) {
		$result = array();
		switch ($input['function']) {
			case 'new_post':
				$result = new_post($input);
				break;
	    case 'get_title':
	      $result = get_title();
				break;
			case 'login':
				$result = login($input['username'], $input['password']);
				break;
			case 'logout':
				$result = logout();
				break;
			case 'is_logged_in':
				$result = is_logged_in();
				break;
			case 'signup':
				$result = signup($input['username'], $input['password']);
				break;
			case 'get_posts':
				$result = get_posts($input['only_user_posts'], $input['page_number']);
				break;
			case 'get_post':
				$result = get_post($input['Post_ID']);
				break;
			case 'edit_post':
				$result = edit_post($input);
				break;
			case 'delete_post':
				$result = delete_post($input['Post_ID']);
				break;
			case 'comment_submit':
				$result = comment_submit($input);
				break;
			case 'get_comments':
				$result = get_comments($input['Post_ID']);
				break;
			case 'comment_delete':
				$result = comment_delete($input['Comment_ID']);
				break;
		}
	}

	header('Content-Type: application/json');
	echo json_encode($result);

	$con->close();
?>
