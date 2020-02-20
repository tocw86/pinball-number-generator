<?php
class Rank
{
    public function getRank()
    {

        $ini_array = parse_ini_file("config/config.ini");
        $mysqli = new mysqli($ini_array['host'], $ini_array['user'], $ini_array['password'], $ini_array['base']);

        if ($mysqli->connect_errno) {
            throw new Exception("Failed to connect");
            header('Content-type:application/json;charset=utf-8');
            echo json_encode(array('message' => 'error'));
            exit;
        }

        $top = array();
        $sql = "SELECT * FROM scores WHERE !ISNULL(score) AND !ISNULL(name) order by score DESC limit 10";

        $results = $mysqli->query($sql);
        while ($row = $results->fetch_assoc()) {
            $top[] = $row;
        }
        $mysqli->close();

        return $top;

    }
}
?>
