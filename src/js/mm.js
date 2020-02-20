PINBALL.mm = function(){   
    /**
     * Wybiera losową liczbę
     * @param {int} min 
     * @param {int} max 
     */
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    /**
     * Losuje liczby i dodaje do tablicy
     * 
     * @param {array} param_array 
     * @param {int} number 
     */
    function checkAndPush(param_array, number) {
        if (param_array.indexOf(number) > -1) {
            return checkAndPush(param_array, getRandomInt(1, 80));
        } else {
            param_array.push(number);
        }
    };
 

    return {
        getRandomInt: getRandomInt,
        checkAndPush: checkAndPush,
    }

}();