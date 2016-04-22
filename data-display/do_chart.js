var randomScalingFactor = function() {
        return Math.random();
    };
    var randomColorFactor = function() {
        return Math.round(Math.random() * 255);
    };
    var randomColor = function(opacity) {
        return 'rgba(' + randomColorFactor() + ',' + randomColorFactor() + ',' + randomColorFactor() + ',' + (opacity || '.3') + ')';
    };

var config = {
        type: 'radar',
        data: {
            labels: ["Aggressive", "Completionist",  "Explorer", "Collector", "Friendly", "Puzzle Solver", "Speedrunner"],
            datasets: [{
                label: "My First dataset",
                backgroundColor: "rgba(120,120,120,0.4)",
                pointBackgroundColor: "rgba(120,120,120,1)",
                data: [randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor()]
            },]
        },
        options: {
        		scaleShowLabels: false,
        		pointLabelFontSize: 16,
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Player Profile'
            },
            
            showScale: false,
            scaleOverride: true,
            scaleFontSize: 200,
        }
    };


var ctx = document.getElementById("myChart").getContext("2d");
window.myRadar = new Chart(ctx, config);
