PINBALL.game = function () {

    /**
     * Begin
     */

    var flipperJoints = [];
    var flipperHit = false;

    var needReset = false;
    var _logoFlag = false;
    var _makeBallFlag = false;
    var _springFlag = false;

    var org_width = 378;
    var org_height = 823;

    var game_width = document.getElementById('lotto-pinball').offsetWidth;
    var game_height = parseInt(org_height * game_width / org_width);

    var _boundsX = -(org_width / 2);
    var _boundsY = -580;

    var color_yellow = "#fed111";
    var color_purple = "#8f2284";
    var color_black = "#000000";

    var flipperSpeed = 28;
    var leftFlipperBody;
    var rightFlipperBody;
    var ball;

    var endGameLine;
    var leftEndGameLine;

    var bumperLeft;
    var bumperRight;
    var bumper100;
    var bumper50;
    var bumper25;
    var logoDark;

    var gameScoreCaption;
    var gameScore = 0;
    var _scoreCounter = 200;

    var gameLives = 3;
    var userLives = 3;
    var userLivesCaption;

    var buttonLeftFlipper;
    var buttonRightFlipper;
    var buttonBothFlipper;

    var _bumperLeft;
    var _bumperRight;
    var bl;

    var buttonTilt;
    var buttonSpring;
    var launcher;
    var cursors;

    var frictionBumpers = 1.3;
    //Wyniki
    var results = [];
    var finalResults = [];

    //kalkulator

    var il = 1;

    var endGameCaption;


    var resultBallEndX;
    var resultBallEndY;

    var canvas;
    var lotto_pinball;

    var bumpersPositions = {
        b25: {},
        b50: {},
        b100: {}
    }

    var gameScale;
    var yourNumbersLabel;

    /**
     * Generuje liczby i podstawia je pod pola w html
     */
    function generateUserResults() {

        var userCount = il;
        for (var i = 0; i < userCount; i++) {
            PINBALL.mm.checkAndPush(results, PINBALL.mm.getRandomInt(1, 80));
        }
        results = results.sort(function (a, b) {
            return a - b
        });

        finalResults = Array.from(results);
        $parent = $('.result-numbers');
        $endparent = $('.end-result-numbers');

        for (var i = 0; i < finalResults.length; i++) {

            $parent.append($('<span class="mm-end-ball-pink extra-bold">' + finalResults[i] + '</span>'));
            $endparent.append($('<span class="mm-end-ball-pink extra-bold">' + finalResults[i] + '</span>'));

        }


    }

    /**
     * Pobranie cookie
     * @param string name 
     */
    function getCookie(name) {
        var value = "; " + document.cookie;
        var parts = value.split("; " + name + "=");
        if (parts.length == 2) return parts.pop().split(";").shift();
      }

    /**
     * Eventy zewnętrzne (html)
     */
    function triggerEvents() {

        if(typeof Cookies.get('pinball') != typeof undefined && Cookies.get('pinball') == 'saved'){
            $('.sim-container').hide();
            $('#rank-slide-container').show();
            Cookies.remove('pinball')
        }else{
             $('#first-slide-container').show();
        }

        $('.btn-rank-slide').click(function (e) {
            //ukrycie wszystkiego
            $('.sim-container').hide();
            $('#rank-slide-container').show();
        });

        $("#il").slider({
            value: 10,
            min: 1,
            step: 1,
            animate: "fast",
            max: 10,
            slide: function (event, ui) {
                il = ui.value;
            }
        });
        il = 10;

        $('#game-start').click(function () {
            $('#first-slide-container').hide();
            init();
        });

        $('#end-slide').click(function (e) {
            $('#first-slide-container').hide();

            //losowanie liczb
            if (typeof il == 'undefined' || il == 0 || il == false || il == null) {
                alert('Wybierz ile liczb typujesz')
            } else {

                if (finalResults.length < 1) {
                    generateUserResults();
                }

            }

            $('#nogame-slide-container').show();
        });

        $('.restart-game').click(function () {
            window.location.reload();
        });

        $('#send_form').submit(function () {

            var user_name = $('input[name="user_name"]');
            var token = $('#token');
            var score = $('input[name="score"]');

            if (user_name.length > 0 && token.length > 0 && score.length > 0) {
                score.val(gameScore);
                
                PINBALL.call.save(score.val(), token.val(), user_name.val(), function(){
                    Cookies.set('pinball', 'saved');
                    location.reload();
                });           

                return false;

            } else {
                gameScore = 0;
                alert("Wystąpił błąd. Spróbuj ponownie")
                return false;
            }

        });

    }

    /**
     * Głowny init gry
     */
    function init() {

        var game = new Phaser.Game(org_width, org_height, Phaser.AUTO, 'lotto-pinball', {
            preload: preload,
            create: create,
            update: update,
            // render: render
        });

        function resizeGame() {
            var width = document.getElementById('lotto-pinball').offsetWidth;
            var height = parseInt(org_height * document.getElementById('lotto-pinball').offsetWidth / org_width);
            game.scale.setGameSize(width, height);
        }

        function cursorsEvents() {
            //Cursors
            cursors = game.input.keyboard.createCursorKeys();
            game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
            game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        }

        function preload() {

            var url = ''
            if (window.location.href.indexOf("pinball.test") < 0) {
                url = '/pinball';
            }

            game.load.image('pinball_background', url + '/assets/sprites/pinball_background.png');

            game.load.image('ball', url + '/assets/sprites/ball_old.png');
            game.load.image('empty_result_ball', url + '/assets/sprites/empty_result_ball.png');
            game.load.image('left_flipper', url + '/assets/sprites/left_flipper_cut.png');
            game.load.image('right_flipper', url + '/assets/sprites/right_flipper_cut.png');
            game.load.image('empty', url + '/assets/sprites/empty.png');
            game.load.image('left_empty_end', url + '/assets/sprites/empty.png');
            game.load.image('bumper_left', url + '/assets/sprites/bumper_left.png');
            game.load.image('bumper_right', url + '/assets/sprites/bumper_right.png');

            game.load.image('bumper_100', url + '/assets/sprites/bumper_100.png');
            game.load.image('bumper_100_light', url + '/assets/sprites/bumper_100_light.png');


            game.load.image('bumper_50', url + '/assets/sprites/bumper_50.png');
            game.load.image('bumper_50_light', url + '/assets/sprites/bumper_50_light.png');

            game.load.image('bumper_25', url + '/assets/sprites/bumper_25.png');
            game.load.image('bumper_25_light', url + '/assets/sprites/bumper_25_light.png');

            game.load.image('logo_dark', url + '/assets/sprites/logo_dark.png');
            game.load.image('logo_light', url + '/assets/sprites/logo_light.png');
            game.load.image('spring', url + '/assets/sprites/spring.png');
            game.load.image('half_spring', url + '/assets/sprites/half_spring.png');
            game.load.image('tunnel', url + '/assets/sprites/tunnel.png');

            game.load.spritesheet('button_left_flipper', url + '/assets/sprites/button_left_flipper.png', 0, 0);
            game.load.spritesheet('button_right_flipper', url + '/assets/sprites/button_right_flipper.png', 0, 0);
            game.load.spritesheet('button_both_flippers', url + '/assets/sprites/button_both_flippers.png', 0, 0);
            game.load.spritesheet('button_tilt', url + '/assets/sprites/tilt.png', 0, 0);
            game.load.spritesheet('button_spring', url + '/assets/sprites/button_spring.png', 0, 0);


            canvas = $('canvas');
            lotto_pinball = $('#lotto-pinball');
        }

        function create() {

            cursorsEvents();
            generateUserResults();

            game.stage.backgroundColor = color_yellow;
            game.physics.startSystem(Phaser.Physics.BOX2D);
            game.physics.box2d.gravity.y = 500;
            game.physics.box2d.restitution = 0.8;

            game.world.setBounds(0, 12, game_width, game_height)
            game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;



            var margin_horizontal = 10;

            // Background
            game.add.sprite(margin_horizontal - 2, 103, 'pinball_background');

            var mainBody = new Phaser.Physics.Box2D.Body(this.game, null, 0, 0, 0);

            //Track vector
            game.physics.box2d.restitution = 0.1;
            mainBody.addLoop(PINBALL.vectors.outlineVertices);

            //Launcher vector
            game.physics.box2d.restitution = 0.1;
            launcher = game.add.sprite(360, 525, 'empty');
            game.physics.box2d.enable(launcher);
            launcher.body.static = true;

            //End
            endGameLine = mainBody.addEdge(215, 620, 163, 620);
            endGameLine.SetSensor(true);

            //Left End
            game.physics.box2d.restitution = 9;
            leftEndGameLine = game.add.sprite(20, 520, 'half_spring');
            game.physics.box2d.enable(leftEndGameLine);
            leftEndGameLine.body.static = true;

            //Left Bumper
            bumperLeft = game.add.sprite(60, 355, 'bumper_left');
            game.physics.box2d.restitution = frictionBumpers;
            _bumperLeft = mainBody.addLoop(PINBALL.vectors.bumperLeft);
            game.physics.box2d.restitution = 0.1;
            mainBody.addLoop(PINBALL.vectors.bumperLeftVerticles);


            //Right bumper
            bumperRight = game.add.sprite(230, 355, 'bumper_right');
            game.physics.box2d.restitution = frictionBumpers;
            _bumperRight = mainBody.addLoop(PINBALL.vectors.bumperRight);
            game.physics.box2d.restitution = 0.1;
            mainBody.addLoop(PINBALL.vectors.bumperRightVerticles);


            //Bumper 100
            game.physics.box2d.restitution = frictionBumpers;
            bumper100 = game.add.sprite(245, 215, 'bumper_100');
            game.physics.box2d.enable(bumper100);
            bumper100.body.static = true;
            bumper100.body.setCircle(bumper100.width / 2);

            //Bumper 50
            game.physics.box2d.restitution = frictionBumpers;
            bumper50 = game.add.sprite(130, 180, 'bumper_50');
            game.physics.box2d.enable(bumper50);
            bumper50.body.static = true;
            bumper50.body.setCircle(bumper50.width / 2);

            //Bumper 25
            game.physics.box2d.restitution = frictionBumpers;
            bumper25 = game.add.sprite(165, 280, 'bumper_25');
            game.physics.box2d.enable(bumper25);
            bumper25.body.static = true;
            bumper25.body.setCircle(bumper25.width / 2);

            //Logo dark
            logoDark = game.add.sprite(110, 320, 'logo_dark');

            //Spring
            game.add.sprite(346.3, 522, 'spring');

            //Ball
            game.physics.box2d.restitution = 0.06;
            ball = game.add.sprite(350, 400, 'ball');
            game.physics.box2d.enable(ball);
            ball.body.setCircle(ball.width / 2);
            ball.body.setFixtureContactCallback(endGameLine, onHitGutter, this);
            ball.body.setFixtureContactCallback(_bumperLeft, onHitBumperL, this);
            ball.body.setFixtureContactCallback(_bumperRight, onHitBumperR, this);
            ball.body.setBodyContactCallback(bumper25, onHitBumperNumbers, this);
            ball.body.setBodyContactCallback(bumper50, onHitBumperNumbers, this);
            ball.body.setBodyContactCallback(bumper100, onHitBumperNumbers, this);
            ball.body.setBodyContactCallback(launcher, collisionHandler, this);
            ball.body.setBodyContactCallback(leftEndGameLine, function () {
                flipperHit = false;
            }, this);

            // Flippers
            game.physics.box2d.restitution = 0.1;

            //Left
            leftFlipperBody = game.add.sprite(122, 512, 'left_flipper');
            game.physics.box2d.enable(leftFlipperBody);
            leftFlipperBody.body.setRectangle(95, 18);

            rightFlipperBody = game.add.sprite(191, 525, 'right_flipper');
            game.physics.box2d.enable(rightFlipperBody);
            rightFlipperBody.body.setRectangle(95, 18);

            ball.body.setBodyContactCallback(leftFlipperBody, function () {
                flipperHit = true;
            }, this);
            ball.body.setBodyContactCallback(rightFlipperBody, function () {
                flipperHit = true;
            }, this);

            // Flipper joints
            var motorSpeed = 60;
            var motorTorque = 180;
            // bodyA, bodyB, ax, ay, bx, by, motorSpeed, motorTorque, motorEnabled, lowerLimit, upperLimit, limitEnabled
            flipperJoints[0] = game.physics.box2d.revoluteJoint(mainBody, leftFlipperBody, 95, 540, -40,
                0, motorSpeed, motorTorque, true, -30, 30, true);
            flipperJoints[1] = game.physics.box2d.revoluteJoint(mainBody, rightFlipperBody, 283, 540, 40,
                0, motorSpeed, motorTorque, true, -30, 30, true);

            //Labels
            var caption = game.add.text(10, 10, 'Wynik:', {
                fill: color_purple,
                font: '15pt daxpro-extraboldregular'
            });
            caption.fixedToCamera = true;

            var caption = game.add.text(10, 37, 'Szanse:', {
                fill: color_purple,
                font: '13pt daxpro-extraboldregular'
            });
            caption.fixedToCamera = true;

            yourNumbersLabel = game.add.text(10, 61, 'Twoje Liczby:', {
                fill: color_purple,
                font: '11pt daxpro-extraboldregular'
            });
            yourNumbersLabel.fixedToCamera = true;

            gameScoreCaption = game.add.text(80, 10, gameScore.toString(), {
                fill: color_black,
                font: '15pt daxpro-extraboldregular'
            });
            gameScoreCaption.fixedToCamera = true;
   
            userLivesCaption = game.add.text(80, 35, userLives.toString(), {
                fill: color_black,
                font: '15pt daxpro-extraboldregular'
            });
            userLivesCaption.fixedToCamera = true;

            endGameCaption = game.add.text(285, 10, 'Pomiń grę', {
                fill: color_purple,
                font: '13pt daxpro-extraboldregular'
            });
            endGameCaption.fixedToCamera = true;
            endGameCaption.inputEnabled = true;
            endGameCaption.input.enableDrag();
            endGameCaption.input.useHandCursor = true;
            endGameCaption.events.onInputDown.add(function (item) {

                game.gamePaused();
                $('canvas').hide();
                $('.end-ball-result').hide();
                $('#end-slide').click();

            }, this);


            //Mobile
            buttonLeftFlipper = game.add.button(30, 645, 'button_left_flipper', null, this, 2, 1, 0);
            buttonLeftFlipper.onInputUp.add(onButtonUp, this);
            buttonLeftFlipper.onInputDown.add(onButtonDown, this);

            buttonBothFlipper = game.add.button(121, 645, 'button_both_flippers', null, this, 2, 1, 0);
            buttonBothFlipper.onInputUp.add(onButtonUp, this);
            buttonBothFlipper.onInputDown.add(onButtonDown, this);

            buttonRightFlipper = game.add.button(273, 645, 'button_right_flipper', null, this, 2, 1, 0);
            buttonRightFlipper.onInputUp.add(onButtonUp, this);
            buttonRightFlipper.onInputDown.add(onButtonDown, this);

            buttonTilt = game.add.button(30, 735, 'button_tilt', onButtonClickListener, this, 2, 1, 0);
            buttonSpring = game.add.button(273, 735, 'button_spring', onButtonClickListener, this, 2, 1, 0);


            game.scale.setResizeCallback(function (event) {

                var scale;

                setTimeout(function () {
                    if (event.scaleFactorInversed.x == 1 && event.scaleFactorInversed.y == 1) {
                        gameScale = game.scale.width / 378;
                    } else {
                        gameScale = event.scaleFactorInversed.x;
                    }

                    bumpersPositions.b25 = {
                        x: (bumper25.x * gameScale) - 35 / 2,
                        y: (bumper25.y * gameScale - (12 * gameScale)) - 35 / 2,
                        width: 35,
                    };

                    bumpersPositions.b50 = {
                        x: (bumper50.x * gameScale) - 35 / 2,
                        y: (bumper50.y * gameScale - (12 * gameScale)) - 35 / 2,
                        width: 35,
                    };

                    bumpersPositions.b100 = {
                        x: (bumper100.x * gameScale) - 35 / 2,
                        y: (bumper100.y * gameScale - (12 * gameScale)) - 35 / 2,
                        width: 35,
                    };

                    resultBallEndY = parseInt(yourNumbersLabel.y * gameScale - (25 * gameScale) / 2) - 1;
                    resultBallEndX = parseInt((yourNumbersLabel.x * gameScale) + (yourNumbersLabel.width * gameScale)) + 2;

                }, 100);


            }, this);

        }

        /**
         * kalulator
         * 
         * @param {int} x 
         * @param {int} y 
         */
        function calculateAspect(x, y) {

            var _gx = game.scale.width;
            var _gy = game.scale.height;


            var _sx = (_gx / org_width);
            var _sy = (_gy / org_height);

            return {
                x: x * _sx - (_sx * 10),
                y: y * _sy - (_sy * 22)
            }

        }

        function calculateWidthAfterResize(x) {
            var _gx = game.scale.width;
            var _sx = (_gx / org_width);

            return _sx * x;
        }

        /**
         * Generuje kule
         * 
         * @param {int} x 
         * @param {int} y 
         */
        function generateResultBall($position) {


            if (results.length > 0) {

                if (flipperHit) {
                    flipperHit = false;

                    var number = results.pop();
                    var ball_html = $('<div class="end-ball-result" style="top:' + $position.y + 'px;left:' + $position.x + 'px;width:' + $position.width + 'px;height:' + $position.width + '"><strong>' + number + '</strong></div>');
                    lotto_pinball.append(ball_html);

                    setTimeout(function () {

                        // ball_html.css('top',yourNumbersLabel.y * gameOver + 'px');
                        ball_html.width(parseInt(25 * gameScale));
                        ball_html.height(parseInt(25 * gameScale));
                        ball_html.css('font-size', '12px');
                        ball_html.css('top', resultBallEndY);

                        ball_html.css('left', resultBallEndX);
                        ball_html.css('font-size', parseInt(12 * gameScale))
                        // ball.offset({
                        //     top: resultBallEndY,
                        //   //  left: resultBallEndX
                        // });



                        resultBallEndX = resultBallEndX + (26 * gameScale);

                    }, 500);


                }


            }

        }

        function onButtonUp($button) {
            switch ($button.key) {
                case "button_left_flipper":
                    cursors.left.isDown = false;
                    break;
                case "button_right_flipper":
                    cursors.right.isDown = false;
                    break;
                case "button_both_flippers":
                    cursors.left.isDown = false;
                    cursors.right.isDown = false;
                    break;
                case "button_tilt":

                    break;
                case "button_spring":

                    break;
            }
        }

        function onButtonDown($button) {
            switch ($button.key) {
                case "button_left_flipper":
                    cursors.left.isDown = true;
                    break;
                case "button_right_flipper":
                    cursors.right.isDown = true;
                    break;
                case "button_both_flippers":
                    cursors.left.isDown = true;
                    cursors.right.isDown = true;
                    break;
                case "button_tilt":
                    //game.world.setBounds(-20, -20, game.width + 20, game.height + 2);
                    break;
                case "button_spring":

                    break;
            }

        }

        function onMassEndLine($ball) {

            try {
                $ball.sprite.kill();

            } catch (e) {


            }

            try {
                $ball.killNextStep = true;
                $ball.destroy();
            } catch (e) {


            }
        }

        function onHitBumperR($ball, $bumper, fixture1, fixture2, begin) {

            if (!_logoFlag) {
                _logoFlag = true;
                logoLightUp();
            }
        }

        function onHitBumperL($ball, $bumper, fixture1, fixture2, begin) {
            if (!_logoFlag) {
                logoLightUp();
            }

        }

        function logoLightUp() {
            logoDark.loadTexture("logo_light");
            setTimeout(function () {
                logoDark.loadTexture("logo_dark");
                _logoFlag = false;
            }, 1000);
        };

        function onButtonClickListener($button) {

            switch ($button.key) {

                case "button_left_flipper":

                    break;
                case "button_right_flipper":

                    break;
                case "button_both_flippers":

                    break;
                case "button_tilt":

                    tilt();

                    break;
                case "button_spring":
                    if (_springFlag) {
                        ball.body.velocity.y += -(Math.floor((Math.random() * 1200) + 1000));
                    }
                    _springFlag = false;
                    break;


            }

        };

        function tilt() {


            flipperHit = false;
            game.camera.follow();
            ball.body.velocity.y = -50;

            if (gameScale == 1) {

                game.world.setBounds(0, -20, game.width, game_height - 20);

                setTimeout(function () {
                    game.world.setBounds(0, 12, game.width, game_height);
                    game.camera.follow();
                }, 100);

            }
        }


        function calculateAbsolutePosition($bumper) {



            //  var pos = canvas.offset();
            //  lotto_pinball.append($('<div style="position:absolute;padding:15px;background:red;z-index:9999;top:0px;left:0px"></div>'));



        }

        function onHitBumperNumbers($ball, $bumper, fixture1, fixture2, begin) {

            switch ($bumper.sprite.key) {

                case "bumper_25":
                    $bumper.sprite.loadTexture("bumper_25_light");
                    setTimeout(function () {
                        generateResultBall(bumpersPositions.b25);
                        // var pos = calculateAbsolutePosition($bumper);
                        $bumper.sprite.loadTexture("bumper_25");
                    }, 500);
                    updateGameScore(25);
                    break;

                case "bumper_50":
                    $bumper.sprite.loadTexture("bumper_50_light");
                    setTimeout(function () {
                        generateResultBall(bumpersPositions.b50);
                        $bumper.sprite.loadTexture("bumper_50");
                    }, 500);
                    updateGameScore(50);
                    break;
                case "bumper_100":
                    $bumper.sprite.loadTexture("bumper_100_light");
                    setTimeout(function () {
                        generateResultBall(bumpersPositions.b100);
                        $bumper.sprite.loadTexture("bumper_100");
                    }, 500);

                    updateGameScore(100);
                    break;

            }

        }

        function updateGameScore(points) {
            gameScore += points;
            gameScoreCaption.setText(gameScore.toString());
        }

        function onHitGutter(body1, body2, fixture1, fixture2, begin) {
            needReset = true; // this occurs inside the world Step, so don't do the actual reset here
        }

        function keysEvents() {
            if (cursors.left.isDown) {
                flipperJoints[0].SetMotorSpeed(-flipperSpeed);
            } else {
                flipperJoints[0].SetMotorSpeed(flipperSpeed);
            }

            if (cursors.right.isDown) {
                flipperJoints[1].SetMotorSpeed(flipperSpeed);
            } else {
                flipperJoints[1].SetMotorSpeed(-flipperSpeed);
            }


            if (game.input.keyboard.isDown(Phaser.Keyboard.SHIFT)) {
                flipperHit = false;

                if (_springFlag) {
                    ball.body.velocity.y += -(Math.floor((Math.random() * 1200) + 1000));
                }
                _springFlag = false;
            }
            if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
                tilt();
            }

        }


        function powerUpBall($ball) {

            console.log($ball.body.y -= 300);
        }
        /**
         * Add ball
         */
        function factoryBall() {

            game.physics.box2d.restitution = 0.1;
            var tmpBall = game.add.sprite(350, 400, 'ball');
            game.physics.box2d.enable(tmpBall);
            tmpBall.body.setCircle(tmpBall.width / 2);
            tmpBall.body.setFixtureContactCallback(endGameLine, onMassEndLine, this);
            tmpBall.body.setBodyContactCallback(bumper25, onHitBumperNumbers, this);
            tmpBall.body.setBodyContactCallback(bumper50, onHitBumperNumbers, this);
            tmpBall.body.setBodyContactCallback(bumper100, onHitBumperNumbers, this);
            tmpBall.body.setFixtureContactCallback(_bumperLeft, onHitBumperL, this);
            tmpBall.body.setFixtureContactCallback(_bumperRight, onHitBumperR, this);
            tmpBall.body.setBodyContactCallback(launcher, function () {

                game.camera.follow();
                tmpBall.body.velocity.y = -1150;
            }, this);

        }
        /**
         * Main update
         */
        function update() {
            // leftFlipperBody.angle +=1;
            if (needReset) {
                endGame();
            }
            keysEvents();

            //update położenia tekstu w kulce z wynikami

            // if (needMoveTextInResultBall) {
            //     for (var key in resultBalls) {
            //         if (resultBalls[key].ball && resultBalls[key].text) {
            //             resultBalls[key].text.x = Math.floor(resultBalls[key].ball.x + resultBalls[key].ball.width / 2);
            //             resultBalls[key].text.y = Math.floor(resultBalls[key].ball.y + resultBalls[key].ball.height / 2);
            //         }
            //     }

            // }


        }

        function collisionHandler(obj1, obj2) {
            _springFlag = true;
            flipperHit = false;
        }


        /**
         * Debug mode
         */
        function render() {

            game.debug.box2dWorld();

        }

        /**
         * End game action
         */
        function endGame() {
            needReset = false;
            ball.body.x = 350;
            ball.body.y = 400;
            ball.body.velocity.x = 0;
            ball.body.velocity.y = 0;
            ball.body.angularVelocity = 0;
            flipperHit = false;

            if (userLives < 1) {
                gameOver();
            } else {
                userLives -= 0.5;
                if (userLives % 1 == 0) {
                    userLivesCaption.setText(userLives.toString());
                }
 

            }

        }

    }

    /**
     * Game over
     */
    function gameOver() {
        //game over

        gameScoreCaption.setText("0");
        userLivesCaption.setText(0);
        userLives = 3;
        flipperHit = false;

        $('.end-ball-result').hide();
        $('canvas').hide();

        $('#end-slide-container').show();
        $('#user-result').text(gameScore);

    }

    return {
        init: init,
        triggerEvents: triggerEvents
    };
}();