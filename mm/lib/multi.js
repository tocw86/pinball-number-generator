var engine = {};
engine.multi = function () {

    var default_container_width = 667;
    var default_container_height = 300;
    var main_container = $('#multi-container');
    var radio_type = $('input[name="game_type"]');
    var results = [];
    var set_numbers_win = [];
    var set_numbers_loose = [];
    var choosed_to_win = [];
    var winner_value = 0;
    var user_numbers = [];
    var plus = false;
    var intervalId = null;
    var cell_padding = null;
    var ntab = null;
    var printer_gif_object = {};
    //typ gry : chybił trafił / własne liczby
    var game_type = 'hit_or_miss';
    var game_types = ['hit_or_miss', 'custom_numbers'];

    //kalkulator
    var stawka = 1;
    var il = 1;
    var cost = 2;


    var promotion_start = 1526860800;
    var promotion_end = 1527465599;

    //kwoty wygranych (bez plusa, bez promocji) { ilosc_liczb: { ilość_trafien: kwota_wygranej  }}
    var winner_prices_default = {
        1: {
            1: 4,
        },
        2: {
            1: 0,
            2: 16,
        },
        3: {
            1: 0,
            2: 2,
            3: 54,
        },
        4: {
            1: 0,
            2: 2,
            3: 8,
            4: 84
        },
        5: {
            1: 0,
            2: 0,
            3: 4,
            4: 20,
            5: 700,
        },
        6: {
            1: 0,
            2: 0,
            3: 2,
            4: 8,
            5: 120,
            6: 1300,
        },
        7: {
            1: 0,
            2: 0,
            3: 2,
            4: 4,
            5: 20,
            6: 200,
            7: 6000,
        },
        8: {
            1: 0,
            2: 0,
            3: 0,
            4: 4,
            5: 20,
            6: 60,
            7: 600,
            8: 22000,
        },
        9: {
            1: 0,
            2: 0,
            3: 0,
            4: 2,
            5: 8,
            6: 42,
            7: 300,
            8: 2000,
            9: 70000
        },
        10: {
            1: 0,
            2: 0,
            3: 0,
            4: 2,
            5: 4,
            6: 12,
            7: 140,
            8: 520,
            9: 10000,
            10: 250000
        }
    };

    var winner_prices_plus = {
        1: {
            1: 88,
        },
        2: {
            1: 24,
            2: 120,
        },
        3: {
            1: 18,
            2: 28,
            3: 214,
        },
        4: {
            1: 16,
            2: 16,
            3: 48,
            4: 384
        },
        5: {
            1: 14,
            2: 10,
            3: 20,
            4: 80,
            5: 1800
        },
        6: {
            1: 14,
            2: 10,
            3: 12,
            4: 20,
            5: 320,
            6: 4300
        },
        7: {
            1: 14,
            2: 8,
            3: 8,
            4: 14,
            5: 70,
            6: 700,
            8: 22000
        },
        8: {
            1: 14,
            2: 4,
            3: 4,
            4: 14,
            5: 48,
            6: 180,
            7: 1800,
            8: 130000
        },
        9: {
            1: 14,
            2: 4,
            3: 4,
            4: 6,
            5: 22,
            6: 122,
            7: 900,
            8: 10000,
            9: 300000
        },
        10: {
            1: 10,
            2: 4,
            3: 4,
            4: 6,
            5: 12,
            6: 36,
            7: 380,
            8: 1520,
            9: 50000,
            10: 2500000
        }
    };

    /**
     * Sprawdzenie czy jest promocja
     */
    function isPromotion() {

        var date = Math.round(new Date().getTime() / 1000);

        if (date >= promotion_start && data <= promotion_end) {
            return true;
        } else {
            return false;
        }

    }

    /**
     * Losowa kolejność
     */
    function shuffle(a) {
        var j, x, i;
        for (i = a.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            x = a[i];
            a[i] = a[j];
            a[j] = x;
        }
        return a;
    }

    /**
     * Wybiera losową liczbę
     * @param {int} min 
     * @param {int} max 
     */
    function get_random_int(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    /**
     * Losuje liczby i dodaje do tablicy
     * 
     * @param {array} param_array 
     * @param {int} number 
     */
    function check_and_set(param_array, number) {
        if (param_array.indexOf(number) > -1) {
            return check_and_set(param_array, get_random_int(1, 24));
        } else {
            param_array.push(number);
        }
    };
    /**
     * Losuje liczby i dodaje do tablicy (podczas własnych liczb)
     * 
     * @param {array} param_array 
     * @param {int} number 
     */
    function check_and_set_custom_numbers(param_array, number, user_numbers_arr) {
        if (param_array.indexOf(number) == -1 && user_numbers_arr.indexOf(number) == -1) {
            param_array.push(number);
        } else {
            return check_and_set_custom_numbers(param_array, get_random_int(1, 24), user_numbers_arr);
        }
    };

    /**
     * Start loterii
     */
    function lottery_start() {
        var max_numbers = 40;
        var choosed = il;

        for (var i = 0; i < max_numbers; i++) {
            check_and_set(results, get_random_int(1, 80));
        }

        //ustawienie wygranych liczb
        set_numbers_win = results.slice(0, 20);

        //przegrane
        set_numbers_loose = results.slice(20, 40);

        //pobranie ilości trafień
        var winner = lottery_engine();
        winner_value = winner;

        var clone = 0;
        for (var i = 0; i < choosed; i++) {
            if (clone < winner) {
                user_numbers.push(set_numbers_win[i]);
                choosed_to_win.push(set_numbers_win[i]);
                clone++;
            } else {
                user_numbers.push(set_numbers_loose[i]);
            }
        }
        user_numbers = user_numbers.sort(function (a, b) {
            return a - b
        });
        results = set_numbers_win.sort(function (a, b) {
            return a - b
        });
        choosed_to_win = choosed_to_win.sort(function (a, b) {
            return a - b
        });

    };

    function str_random() {

        return Math.random().toString(36).substring(7);

    }
    /**
     * Prawdopodobieństwo
     */
    function lottery_engine() {
        var num = get_random_int(1, 100);

        switch (il) {
            case 1:
                //dla 1 liczby: 80% na 1 , 20% na 0
                if (num <= 80) {
                    return 1;
                } else {
                    return 0;
                }
                break;
            case 2:
                //dla 2 liczb: 70% szans na 1, 30% szans na 2
                if (num <= 70) {
                    return 1;
                } else if (num > 70 && num <= 100) {
                    return 2;
                }
                break;
            case 3:
                //dla 3 liczb: 45% szans na 1, 40% szans na 2, 15% szans na 3
                if (num <= 45) {
                    return 1;
                } else if (num > 45 && num <= 85) {
                    return 2;
                } else {
                    return 3;
                }
                break;
            case 4:
                //dla 4 liczb: 45% szans na 1, 30% szans na 2, 15% szans na 3, 10% szans na 4
                if (num <= 45) {
                    return 1;
                } else if (num > 45 && num <= 75) {
                    return 2;
                } else if (num > 75 && num <= 90) {
                    return 3;
                } else {
                    return 4;
                }
                break;
            case 5:

                //dla 5 liczb: 40% szans na 1, 25% szans na 2, 20% szans na 3, 10% szans na 4, 5% szans na 5
                if (num <= 40) {
                    return 1;
                } else if (num > 40 && num <= 65) {
                    return 2;
                } else if (num > 65 && num <= 85) {
                    return 3;
                } else if (num > 85 && num <= 95) {
                    return 4;
                } else {
                    return 5;
                }

                break;

            case 6:
                //Dla 6 liczb: 35% szans na 1, 25% szans na 2, 15% szans na 3, 12% szans na 4, 8% szans na 5, 5% szans na 6 
                if (num <= 35) {
                    return 1;
                } else if (num > 35 && num <= 60) {
                    return 2;
                } else if (num > 60 && num <= 75) {
                    return 3;
                } else if (num > 75 && num <= 87) {
                    return 4;
                } else if (num > 87 && num <= 95) {
                    return 5;
                } else {
                    return 6;
                }

                break;

            case 7:
                //Dla 7 liczb: 35% szans na 1, 25% szans na 2, 15% szans na 3, 10% szans na 4, 8% szans na 5, 4% szans na 6, 3% szans na 7

                if (num <= 35) {
                    return 1;
                } else if (num > 35 && num <= 60) {
                    return 2;
                } else if (num > 60 && num <= 75) {
                    return 3;
                } else if (num > 75 && num <= 85) {
                    return 4;
                } else if (num > 85 && num <= 93) {
                    return 5;
                } else if (num > 93 && num <= 97) {
                    return 6;
                } else {
                    return 7;
                }

                break;

            case 8:
                //Dla 8 liczb: 35% szans na 1, 20% szans na 2, 15% szans na 3, 12% szans na 4, 7% szans na 5, 5% szans na 6, 3% szans na 7 , 3% szans na 8
                if (num <= 35) {
                    return 1;
                } else if (num > 35 && num <= 55) {
                    return 2;
                } else if (num > 55 && num <= 70) {
                    return 3;
                } else if (num > 70 && num <= 82) {
                    return 4;
                } else if (num > 82 && num <= 89) {
                    return 5;
                } else if (num > 89 && num <= 94) {
                    return 6;
                } else if (num > 94 && num <= 97) {
                    return 7;
                } else {
                    return 8;
                }

                break;

            case 9:
                //Dla 9 liczb: 30% szans na 1, 20% szans na 2, 15% szans na 3, 12% szans na 4, 8% szans na 5, 5% szans na 6, 4% szans na 7, 3% szans na 8 , 3% szans na 9
                if (num <= 30) {
                    return 1;
                } else if (num > 30 && num <= 50) {
                    return 2;
                } else if (num > 50 && num <= 65) {
                    return 3;
                } else if (num > 65 && num <= 77) {
                    return 4;
                } else if (num > 77 && num <= 85) {
                    return 5;
                } else if (num > 85 && num <= 90) {
                    return 6;
                } else if (num > 90 && num <= 94) {
                    return 7;
                } else if (num > 94 && num <= 97) {
                    return 8;
                } else {
                    return 9;
                }

                break;

            case 10:
                //Dla 10 liczb: 30% szans na 1, 20% szans na 2, 15% szans na 3, 12% szans na 4, 8% szans na 5, 5% szans na 6, 4% szans na 7, 3% szans na 8, 2% szans na 9, 1% szans na 10
                if (num <= 30) {
                    return 1;
                } else if (num > 30 && num <= 50) {
                    return 2;
                } else if (num > 50 && num <= 65) {
                    return 3;
                } else if (num > 65 && num <= 77) {
                    return 4;
                } else if (num > 77 && num <= 85) {
                    return 5;
                } else if (num > 85 && num <= 90) {
                    return 6;
                } else if (num > 90 && num <= 94) {
                    return 7;
                } else if (num > 94 && num <= 97) {
                    return 8;
                } else if (num > 97 && num <= 99) {
                    return 9;
                } else {
                    return 10;
                }

                break;
        }
    };

    //ze strony lotto
    function separation(nStr) {
        nStr += '';
        var x = nStr.split('.');
        var x1 = x[0];
        var x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ' ' + '$2');
        }
        return x1 + x2;
    };



    //ze strony lotto
    function calculate(stawka, il) {

        if (document.getElementById('plus').checked) {
            cost = 5;
            switch (il) {
                case 1:
                    $('#wygrana').html('WYGRANA: ' + 88 * stawka + ' zł');
                    break;
                case 2:
                    $('#wygrana').html('WYGRANA: ' + 120 * stawka + ' zł');
                    break;
                case 3:
                    $('#wygrana').html('WYGRANA: ' + 214 * stawka + ' zł');
                    break;
                case 4:
                    $('#wygrana').html('WYGRANA: ' + 384 * stawka + ' zł');
                    break;
                case 5:
                    $('#wygrana').html('WYGRANA: ' + separation(1800 * stawka) + ' zł');
                    break;
                case 6:
                    $('#wygrana').html('WYGRANA: ' + separation(4300 * stawka) + ' zł');
                    break;
                case 7:
                    $('#wygrana').html('WYGRANA: ' + separation(22000 * stawka) + ' zł');
                    break;
                case 8:
                    $('#wygrana').html('WYGRANA: ' + separation(130000 * stawka) + ' zł');
                    break;
                case 9:
                    $('#wygrana').html('WYGRANA: ' + separation(300000 * stawka) + ' zł');
                    break;
                case 10:
                    $('#wygrana').html('WYGRANA: ' + separation(2500000 * stawka) + ' zł' + '<br/><span id="bonus">z Bonusem</span>');
                    break;

            }

        } else {
            cost = 2.5;

            switch (il) {
                case 1:
                    $('#wygrana').html('WYGRANA: ' + 4 * stawka + ' zł');
                    break;
                case 2:
                    $('#wygrana').html('WYGRANA: ' + 16 * stawka + ' zł');
                    break;
                case 3:
                    $('#wygrana').html('WYGRANA: ' + 54 * stawka + ' zł');
                    break;
                case 4:
                    $('#wygrana').html('WYGRANA: ' + 84 * stawka + ' zł');
                    break;
                case 5:
                    $('#wygrana').html('WYGRANA: ' + 700 * stawka + ' zł');
                    break;
                case 6:
                    $('#wygrana').html('WYGRANA: ' + separation(1300 * stawka) + ' zł');
                    break;
                case 7:
                    $('#wygrana').html('WYGRANA: ' + separation(6000 * stawka) + ' zł');
                    break;
                case 8:
                    $('#wygrana').html('WYGRANA: ' + separation(22000 * stawka) + ' zł');
                    break;
                case 9:
                    $('#wygrana').html('WYGRANA: ' + separation(70000 * stawka) + ' zł');
                    break;
                case 10:
                    $('#wygrana').html('WYGRANA: ' + separation(250000 * stawka) + ' zł' + '<br/><span id="bonus">z Bonusem</span>');
                    break;

            }
        }

        $('#kwota').html('Cena kuponu: ' + stawka * cost + ' zł');

    }
    /**
     * Akcja chybił trafił
     */
    function hit_or_miss() {
        lottery_start();
        fourth_slide();
    };

    function checkTag(params) {
        var term = $.trim(params.term);

        if (term > 80 || term < 1) {
            return null;
        }

        return {
            id: term,
            text: term,
            newTag: true // add additional parameters
        }
    };

    /**
     * Akcja własne liczby
     */
    function custom_numbers() {
        $('div #custom_numbers').show();

        $('.rate').text(stawka);
        $('.numbers_count').text(il);
        $('.plus_value').text(plus);

        var container = document.getElementById('form-container');

        var array = [];

        for (var i = 1; i < 81; i++) {
            array.push({
                id: i,
                value: i,
                text: i,
            });
        }

        for (var i = 0; i < il; i++) {
            var select = document.createElement('select');
            select.name = 'my_numbers[]';
            container.appendChild(select);

            $(select).select2({
                tags: true,
                createTag: checkTag,
                style: 'background:pink',
                data: array,
            });

        }

        var button = document.createElement('button');
        button.type = 'submit';
        button.innerHTML = '<i class="fa fa-print"></i>&nbsp;Dalej&nbsp;<i class="fa fa-chevron-right"></i>';
        button.className = 'btn-submit';
        container.appendChild(button);

        $('#form-container').submit(function () {

            var user_numbers_tmp = [];

            //sprawdzenie powtarzalności liczb
            var numbers = $('select[name="my_numbers[]"]');

            numbers.each(function () {

                var num = this.value;

                if (user_numbers_tmp.indexOf(num) == -1) {
                    user_numbers_tmp.push(num);
                } else {
                    alert('Liczba: ' + num + ' się powtarza!');
                    user_numbers_tmp = [];
                }
            });

            if (user_numbers_tmp.length == il) {

                winner_value = lottery_engine();
                user_numbers = shuffle(user_numbers_tmp);

                var tmp_choosed = [];

                for (var i = 0; i < winner_value; i++) {
                    tmp_choosed.push(parseInt(user_numbers[i]));
                    choosed_to_win.push(parseInt(user_numbers[i]));
                }

                var max_numbers = 20 - tmp_choosed.length;

                results = tmp_choosed;

                for (var i = 0; i < max_numbers; i++) {
                    check_and_set_custom_numbers(results, get_random_int(1, 80), user_numbers);
                }

                results = results.sort(function (a, b) {
                    return a - b
                });
                user_numbers = user_numbers.sort(function (a, b) {
                    return a - b
                });
                choosed_to_win = choosed_to_win.sort(function (a, b) {
                    return a - b
                });

                printer_gif_object.play();

                return false;
            }

            return false;

        });

    };

    /**
     * Drugi slajd
     */
    function second_slide() {
        $('#first-slide').hide();
        $('#second-slide').fadeIn("slow", function () {});
    };

    /**
     * Trzeci slajd
     */
    function third_slide() {
        $('#second-slide').hide();
      
        $('#third-slide').fadeIn("slow", function () {});
 
        switch (game_type) {

            case 'hit_or_miss':
                $('.jsgif').remove();
                hit_or_miss();
                break;

            case 'custom_numbers':
                custom_numbers();
                break;

            default:
                break;
        }
    }

    /**
     * Kalkulacja wygranej
     */
    function calculateWinnings() {

        var number_of_numbers = il;
        var number_of_win = winner_value;
        var rate = stawka;

        var prize = 0;

        if (plus === 'tak') {
            prize = winner_prices_plus[number_of_numbers][number_of_win] * rate;
        } else {
            prize = winner_prices_default[number_of_numbers][number_of_win] * rate;
        }
        //promocja 21-27 maj
        if (isPromotion()) {
            if (number_of_numbers == 7 && number_of_win == 7) {
                prize = prize * 2;
            }
        }
        return prize;
    };



    /**
     * 
     * Animacja losowania
     * 
     * @param {*} size 
     * @param {*} num 
     */
    function ballStart(size, num) {

        var i = 0;
        var ntab = num;
        var nsize = size;

        intervalId = setInterval(function () {
            if (i < ntab.length) {

                nsize = $('#my_canvas').width();
                var small_width = $('.mm-results td').width();
                var result_number = ntab[i];
                var ball = document.createElement('div');

                ball.classList.add('mm-ball');
                ball.classList.add('extra-bold');
                ball.setAttribute('data-result', result_number);
                ball.style.width = nsize / 2 + 'px';
                ball.style.height = nsize / 2 + 'px';
                ball.style.fontSize = nsize / 4.5 + 'px';
                ball.id = 'keno_ball_' + i;

                document.getElementById('mm-preloader-container').appendChild(ball);

                // $('#mm-preloader-container').append($('<div id="keno_ball_' + i + '" class="mm-ball extra-bold" data-result="' + ntab[i] + '" style="width:' + nsize / 2 + 'px;height:' + nsize / 2 + 'px;border-radius:' + nsize / 4 + 'px;font-size: ' + nsize / 2.8 + 'px;"></div>'));

                var keno_ball = $('#keno_ball_' + i);
                keno_ball.text(result_number);

                var center = (nsize / 2);
                var position = $('#my_canvas').offset();

                var ball_left = (position.left + center) - (keno_ball.width() / 2);
                var ball_top = (position.top + center) - (keno_ball.height() / 2);

                keno_ball.offset({
                    top: ball_top,
                    left: ball_left
                });

                setTimeout(function () {
                    var td_cell = $('#mm_cell_' + i);
                    var ball_to_table_top = td_cell.offset();

                    keno_ball.offset({
                        top: ball_to_table_top.top,
                        left: ball_to_table_top.left
                    });

                    keno_ball.width(small_width + 'px');
                    keno_ball.height(small_width + 'px');
                    // keno_ball.css('border-radius', small_width / 4);
                    keno_ball.css('font-size', small_width * 0.5);
                    keno_ball.css('background-image', 'url(images/pink-ball.png)');

                    setTimeout(function () {
                        keno_ball.prependTo(td_cell);
                        keno_ball.css('position', 'initial');
                        var td_result = $('td[data-result="' + result_number + '"]');

                        if (td_result.length > 0) {
                            td_result.css('background-image', 'url("images/marker.png")');
                            td_result.css('background-size', 'contain');
                            td_result.css('background-repeat', 'no-repeat');
                            td_result.css('background-position', 'center');
                        }

                    }, 1000);

                    i++;
                }, 1000);
            } else {
                clearInterval(intervalId);
                ballEnd();
            }
        }, 2500);

    };

    /**
     * Ostatni slajd
     */
    function fifth_slide() {

        var i = 0;
        $('.mm-end-ball-pink').each(function () {
            this.innerHTML = results[i];
            i++;
        });


        $('#fourth-slide').hide();
        $('#fifth-slide').fadeIn("slow", function () {});

        var prize = calculateWinnings();

        if (prize > 0) {
            $('#mm-win-container').html('Wygrałeś <span class="money c-y">' + separation(prize) + ' zł !</span>');
        } else {
            $('#mm-win-container').html('<small>Tym razem się nie udało.</small>');
        }

    }

    /**
     * Na koniec canvasa
     */
    function ballEnd() {
        $('#my_canvas').remove();
        fifth_slide();
    };

    /**
     * Tworzy odpowiednie kule
     * @param {int} csize 
     * @param {int} count 
     */
    function circle_maker(csize, count) {
        var tmparr = [];
        for (var i = 0; i < count; i++) {
            tmparr.push({
                x: get_random_int(12, 80),
                y: get_random_int(12, 80),
                r: csize,
                vx: get_random_int(4, 6) * $('.canvas-container').width() / 400,
                vy: get_random_int(4, 6) * $('.canvas-container').width() / 400,
                color: 100

            });
        }
        return tmparr;
    };

    /**
     * Maszyna losująca (canvas)
     */
    function canvas_start() {
        var size = $('.canvas-container').width() / 1.87;
        $('#canvas-container').prepend($('<canvas id="my_canvas" width="' + size + '" height="' + size + '"></canvas>'));
        var canvas = document.getElementById("my_canvas");
        var ctx = canvas.getContext("2d");

        var container = {
            x: 0,
            y: 0,
            width: size,
            height: size,
        };

        var bsize = size * 0.0425;

        var circles = circle_maker(bsize, 19);

        function animate() {
            //createRadialGradient(75,50,5,90,60,100);

            var machine_gradient = ctx.createRadialGradient(35, 15, 5, 90, 60, 100);
            machine_gradient.addColorStop(0, "white");
            machine_gradient.addColorStop(1, "#b772b0");

            ctx.fillStyle = machine_gradient;
            ctx.fillRect(container.x, container.y, container.width, container.height);

            for (var i = 0; i < circles.length; i++) {
                ctx.fillStyle = 'rgb(255, 216, 41)';
                ctx.beginPath();
                ctx.arc(circles[i].x, circles[i].y, circles[i].r, 0, Math.PI * 2, true);
                ctx.fill();
                if (circles[i].x - circles[i].r + circles[i].vx < container.x || circles[i].x + circles[i].r + circles[i].vx > container.x + container.width) {
                    circles[i].vx = -circles[i].vx;
                }
                if (circles[i].y + circles[i].r + circles[i].vy > container.y + container.height || circles[i].y - circles[i].r + circles[i].vy < container.y) {
                    circles[i].vy = -circles[i].vy;
                }
                circles[i].x += circles[i].vx;
                circles[i].y += circles[i].vy;
            }
            requestAnimationFrame(animate);
        }
        requestAnimationFrame(animate);

    };

    /**
     * Czwarty slide / losowanie
     */
    function fourth_slide() {
        $('#third-slide').hide();
        $('#fourth-slide').fadeIn("slow", function () {});

        //usunięcie drukarki
        $('.jsgif').remove();

        $('#paper-container').fadeIn("slow", function () {});

        canvas_start();

        var width = $('#my_canvas').width();
        var shuffled = shuffle(results);

        $('.rate').text(stawka);
        $('.plus_value').text(plus);

        //losowanie kul
        ballStart(width, shuffled);

        var ww = $('#fifth-slide').width();

        var tbody = document.getElementById('my_number_tbody');
        // var end_user_numbers = document.getElementById('end-user-numbers');

        for (var i = 0; i < user_numbers.length; i++) {
            if (i % 5 == 0 || i == 0) {
                var tr = document.createElement('tr');
                tbody.appendChild(tr);
            }
            var td = document.createElement('td');
            td.style.position = 'relative';
            td.setAttribute('data-result', user_numbers[i]);
            td.innerHTML = user_numbers[i];

            tr.appendChild(td);

            //ostatni slajd
            var ball = document.createElement('span');
            ball.classList.add('mm-ball-pink');
            ball.classList.add('extra-bold');
            // ball.style.width =   (ww /5) - 1 +'px';
            // ball.style.height =  (ww /5) - 1 +'px';
            ball.innerHTML = user_numbers[i];
            // end_user_numbers.appendChild(ball);


        }

    }

    /**
     * Podpięcie wyboru typu z slajdu 1
     */
    function eventRadio() {
        radio_type.change(function () {
            game_type = this.value;
            // second_slide();
        });
    };

    /**
     * przeliczanie proporcji
     */
    function aspect_ratio() {
        return default_container_height / default_container_width;
    };

    /**
     * przeliczenie aspect ratio 
     */
    function calculate_aspect_ratio() {
        var width = main_container.width();
        var height = width * aspect_ratio();
        main_container.height(height);

    };

    /**
     * skalowanie całego modułu
     */
    function scaling() {

        var sc = main_container.width() / default_container_width;

        if (main_container.height() <= default_container_height) {
            if (sc < 1)
                main_container.attr('style', 'transform: scale(' + sc + ');transform-origin: 0 0;');
        }

    };

    /**
     * Eventy ze wszystkich slajdów
     */
    function events() {
        $('#start-slide-click').click(function () {
            $('#start-slide').hide();
            $('#first-slide').fadeIn("slow", function () {});
        });

        $('#first-slide-click').click(function () {
            $('#first-slide').hide();
            $('#second-slide').fadeIn("slow", function () {});
        });

        radio_type.change(function () {
            game_type = this.value;
            // second_slide();
        });

        plus = document.getElementById('plus').checked ? 'tak' : 'nie';

        $('#plus').click(function () {
            plus = this.checked ? 'tak' : 'nie';
            calculate(stawka, il);
        });

        $("#stawka").slider({
            step: 1,
            animate: "fast",
            min: 1,
            max: 10,
            slide: function (event, ui) {
                stawka = ui.value;
                calculate(stawka, il);
            }
        });

        $("#il").slider({
            min: 1,
            step: 1,
            animate: "fast",
            max: 10,
            slide: function (event, ui) {
                il = ui.value;
                calculate(stawka, il);
            }
        });

        //Button dalej
        $('#second-slide-next').click(function () {
            
            plus = document.getElementById('plus').checked ? 'tak' : 'nie';
 
            if (game_type == 'hit_or_miss')
                printer_gif_object.play();
            else
                third_slide();
        });

        /**
         * Trzeci slider
         */
        $('#third-slide-next').click(function () {
            fourth_slide();
        });


        /** GIF */

        printer_gif_object = new SuperGif({
            gif: document.getElementById('start-gif'),
            loop_mode: false,
            progressbar: false,
            progressbar_height: 0,
            max_width: 220,
            on_end: function () {
                if (game_type == 'hit_or_miss')
                    third_slide();
                else
                    fourth_slide();
            },
        });

        printer_gif_object.load();
    };

    /**
     * start
     */
    function init() {
        events();
    };

    return {
        'init': init,
        'scaling': scaling
    };

}();