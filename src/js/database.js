PINBALL.call = function(){

    /**
     * Zapis danych
     * 
     * @param int $score 
     * @param string $token 
     * @param string $name 
     * @return bool
     */    
    function save($score, $token, $name, $callback){

        var http = new XMLHttpRequest();
       
        var url = "complete.php";
        var str = "score=" + $score + "&token=" + $token + "&user_name=" + $name;
        var params = encodeURI(str);
        http.open("POST", url, true);
    
        //Send the proper header information along with the request
        http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        http.setRequestHeader("Content-length", params.length);
        http.setRequestHeader("Connection", "close");

        http.onreadystatechange = function () {//Call a function when the state changes.
            
            if (http.status == 200) {
                $callback.call();
            }
        }
        http.send(params);
    }


    return {
        save : save,
    }
}();