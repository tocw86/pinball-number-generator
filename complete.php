<?php
$ini_array = parse_ini_file("config/config.ini");
session_start();

$mysqli = new mysqli($ini_array['host'], $ini_array['user'], $ini_array['password'], $ini_array['base']);

if ($mysqli->connect_errno) {
    _error($mysqli);
}

if (!empty($_POST['token']) && isset($_POST['score']) && !empty($_POST['user_name'])) {
    if (($_POST['token'] == $_SESSION['token'])) {
        // Proceed to process the form data
        $score = (int)$_POST['score'];
        $created_at = date("Y-m-d H:i:s");
        $name = preg_replace("/[^a-zA-Z0-9]/", "", $_POST['user_name']);

        if (!empty($score) && !empty($created_at) && !empty($name)) {

            try {

                $insert = $mysqli->prepare("INSERT INTO scores (score,name,created_at) VALUES (?, ?, ?)");
                $insert->bind_param('iss', $score, $name, $created_at);

                if (!$insert->execute()) {
                    $_SESSION['token'] = null;
                    _error($mysqli);
                } else {
                    $mysqli->close();
                    $_SESSION['token'] = null;
                    header('Content-type:application/json;charset=utf-8');
                    echo json_encode(array('message' => 'success'));
                    exit;

                }

            } catch (Exception $ex) {
                _error($mysqli);
            }

        } else {
            _error($mysqli);
        }

    } else {
        _error($mysqli);
    }

} else {
    _error($mysqli);
}


function _error($mysqli)
{
    if (!empty($mysqli)) {
        $mysqli->close();
    }
    header('Content-type:application/json;charset=utf-8');
    echo json_encode(array('message' => 'error'));
    exit;
}

?>