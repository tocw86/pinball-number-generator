PINBALL.vectors = function(){

    //track
    var outlineVertices = [
        55, 135,
        80, 117,
        95, 110,
        110, 107,
        300, 107,
        315, 110,
        325, 115,
        335, 120,
        355, 145,
        367, 160,
        367, 165,
        367, 625,
        346, 625,
        346, 185,
        342, 185,
        282, 290,
        280, 305,
        285, 307,
        295, 304,
        305, 309,
        305, 318,
        297, 325,
        297, 333,
        320, 333,
        332, 336,
        340, 350,
        340, 475,
        330, 485,
        288, 517,
        286, 522,
        295, 530,
        298, 535,
        298, 545,
        293, 555,
        220, 597,
        215, 600,
        215, 620,
        163, 620,
        163, 600,
        130, 580,
        90, 558,
        80, 550,
        78, 535,
        85, 525,
        88, 518,
        50, 489,
        40, 478,
        36, 470,
        36, 380,
        32, 380,
        32, 550,
        8, 550,
        8, 360,
        49, 323,
        49, 258,
        27, 238,
        15, 220,
        10, 200,
        15, 180,
        30, 160,

    ];


//launcher pod
var launcherVertices = [370, 520, 348, 520];

//left filpper
var leftFlipperVertices = [56, 32, 149, 32, 149, 45, 56, 55];

//bumper left
var bumperLeft = [76,356,144,469];

var bumperLeftVerticles = [
    136,467,
    140, 473,
    131, 483,
    100, 460,
    62, 432,
    62,365,
    66, 358,
    70, 356,
];

//bumper right
var bumperRight = [296,356,232,467];
var bumperRightVerticles  = [
    300, 356,
    307,358,
    312,362,
    312,432,
    246,480,
    238,479,
    232,472,
];


    return {
        outlineVertices: outlineVertices,
        launcherVertices : launcherVertices,
        leftFlipperVertices: leftFlipperVertices,
        bumperLeftVerticles:bumperLeftVerticles,
        bumperLeft:bumperLeft,
        bumperRight:bumperRight,
        bumperRightVerticles:bumperRightVerticles
    };
}();