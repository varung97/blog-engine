<?php

  $new_post_stmt = $con->prepare("INSERT INTO articles (username, title, text) VALUES (?, ?, ?)");
  $edit_post_stmt = $con->prepare("UPDATE articles SET title = ?, text = ? WHERE Post_ID = ?");
  $comment_submit_stmt = $con->prepare("INSERT INTO comments (Post_ID, replied_to, username, text) VALUES (?, ?, ?, ?)");

?>
