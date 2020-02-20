<!DOCTYPE html>
<?php
require_once('rank.php');
session_start();
if (empty($_SESSION['token'])) {
    if (function_exists('mcrypt_create_iv')) {
        $_SESSION['token'] = bin2hex(mcrypt_create_iv(32, MCRYPT_DEV_URANDOM));
    } else {
        $_SESSION['token'] = bin2hex(openssl_random_pseudo_bytes(32));
    }
}
$token = $_SESSION['token'];
$ver = 7;

$url = "pinball/";
if (strpos($_SERVER['SERVER_NAME'], "test") !== false) {
    $url = "";
}

try {
    $rank = new Rank();
    $top = $rank->getRank();
} catch (Exception $e) {
    $top = array();
}

?>
<html>

<head>
    <meta charset="UTF-8" />
    <meta content="width=device-width, initial-scale=1.0"
      name="viewport"/>
    <title>Multi Multi Pinball</title>
    <style>
        canvas {
            width: inherit;
            height: inherit;
        }
    </style>
    <link rel="stylesheet" href="dist/style.css">
    <link rel="stylesheet" type="text/css" href="dist/jquery-ui.css" />

</head>

<body style="overflow-y: hidden;">
    <img src="<?= $url ?>assets/sprites/empty_result_ball.png" style="display: none" alt="empty_ball" />
    <div style="max-width: 378px;height: 823px; margin: 0 auto; position:relative" id="lotto-pinball">
        <div class="sim-container" id="first-slide-container" style="display:none">
            <div id="multi-container" class="multi-container">
                <div id="multi-panel" class="multi-panel" style="position: relative;">
                    <div class="container" id="start-slide">
                        <div id="kalkulator">
                            <div class="mm-top-text">Poznaj swoje szczęśliwe liczby</div>
                            <p class="mm-medium-text">
                            Zdecyduj ile liczb typujesz, rozpocznij grę i walcz o najlepszy wynik! <br> Możesz też pominąć grę i od razu odkryć swoje szczęśliwe liczby.</p>
                            <div class="mm-sec-yellow">
                                Ile liczb typujesz
                            </div>
                            <div id="il" class="ui-slider ui-corner-all ui-slider-horizontal ui-widget ui-widget-content">
                                <span tabindex="0" class="ui-slider-handle ui-corner-all ui-state-default" style="left: 22.2222%;"></span>
                            </div>
                            <div class="numbersCalc">
                                <span>1</span>
                                <span>2</span>
                                <span>3</span>
                                <span>4</span>
                                <span>5</span>
                                <span>6</span>
                                <span>7</span>
                                <span>8</span>
                                <span>9</span>
                                <span>10</span>
                            </div>

                            <div class="btn-printer-end" id="game-start" style="float: none;margin-top: 15px">
                                <i class="fa fa-print"></i>&nbsp;Dalej&nbsp;
                                <i class="fa fa-chevron-right"></i>
                            </div>

                            <div class="btn-printer-end" id="end-slide" style="float: none;margin-top: 15px">
                                Pomiń grę i generuj liczby
                            </div>

              
                            <div class="btn-printer-end btn-rank-slide" style="float: none;margin-top: 15px">
                                Lista wyników
                            </div>
                       

                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="sim-container" id="end-slide-container" style="display: none">
            <div class="multi-container">
                <div class="multi-panel" style="position: relative;">
                    <div class="container" id="end-slide">
                
                            <div class="mm-top-text">
                                Koniec
                            </div>
                            <br>
                            <div class="mm-sec-yellow">
                                    Twój wynik: <span style="color: black" id="user-result"></span>
                                </div>
                                <br>

                                <div class="mm-sec-yellow">
                                   Twoje szczęśliwe liczby: <span  style="text-align: center;color: black"></span>
                                    </div>
                                    <div class="mm-end-ball-container end-result-numbers">
                                    </div>

                                    <form action="complete.php"  style="margin-top:10px" id="send_form" method="post">
                                        <input type="hidden" name="token" id="token" value="<?= $token ?>" />
                                        <input type="hidden" name="score" value="" />
                                        <div class="mm-sec-yellow">Podaj nick: </div>
                                      <input name="user_name" class="pinball-input" type="text" required="">                                      </p>
                            
                                     <button class="btn-printer-end pinball-submit" type="submit">
                                        Zapisz
                                    </button>
                                    
                                    </form>

                            <div class="btn-printer-end restart-game" style="margin-top: 15px">
                                    Zagraj ponownie
                                </div>

                           <div class="btn-printer-end btn-rank-slide" style="float: none;margin-top: 15px">
                                Lista wyników
                            </div>

                       
                    </div>
                </div>
            </div>
        </div>


        <div class="sim-container" id="nogame-slide-container" style="display: none">
            <div class="multi-container">
                <div class="multi-panel" style="position: relative;">
                    <div class="container" id="end-slide">
                        <div id="kalkulator">
                            <div class="mm-top-text">
                            Twoje szczęśliwe liczby:
                            </div>
                            <br>
                            <div class="mm-end-ball-container result-numbers">
                              
                            
                            </div>
 
                            <div class="btn-printer-end restart-game" style="margin-top: 15px">
                                Zagraj ponownie
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="sim-container" id="rank-slide-container" style="display: none">
            <div class="multi-container">
                <div class="multi-panel" style="position: relative;">
                    <div class="container" id="results-slide">

                     <div class="mm-top-text">
                                Najlepsi gracze:
                            </div>
                            <?php
                            if (!empty($top)) { ?>
                                <table class="rank-table"> 
                                <tbody>
            
                          <?php
                            $i = 1;
                            foreach ($top as $result) {
                                echo '<tr>';
                                echo '<td><p class="mm-medium-text">' . $i . '.</p></td>';
                                echo '<td><p class="mm-medium-text">' . $result['name'] . '</p></td>';
                                echo '<td><p class="mm-medium-text">' . $result['score'] . 'pkt.</p></td>';
                                echo '</tr>';
                                $i++;

                            }
                            ?>
                                </tbody>
                            </table>

                            <?php

                        } else {
                            echo '<p class="mm-medium-text">Brak wyników</p>';
                        }
                        ?>
                             <div class="btn-printer-end restart-game" style="margin-top: 15px">
                                Zagraj ponownie
                            </div>
                       </div>
                </div>
            </div>
        </div>

        </div>
        
    <script src="dist/start.js?v2" type="text/javascript"></script>
    <script type="text/javascript">
    </script>

</body>

</html>