<!DOCTYPE html>
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

</head>

<body style="overflow-y: hidden;">
    <img src="assets/sprites/empty_result_ball.png" style="display: none" alt="empty_ball" />
    <div style="max-width: 378px;height: 823px; margin: 0 auto; position:relative" id="lotto-pinball">
        <div class="sim-container" id="first-slide-container">
            <div id="multi-container" class="multi-container">
                <div id="multi-panel" class="multi-panel" style="position: relative;">
                    <div class="container" id="results-slide">

                     <div class="mm-top-text">
                              Wystąpił błąd
                            </div>
                       </div>
                </div>
            </div>
        </div>    
    
    </div>

</body>

</html>