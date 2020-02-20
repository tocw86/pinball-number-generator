PINBALL.helpers = function(){


    

    function getImageWidth(game, image_name){

        return game.cache.getImage(image_name, true).width;
    }


    return {

        getImageWidth : getImageWidth
    }
}();