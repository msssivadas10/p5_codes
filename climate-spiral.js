/**
 * @file climate-spiral.js
 * @author M. S. Suryan Sivadas <ms3.msssivadas@gmail.com>
 * 
 * Climate spiral in p5, using global temperature anomaly data from <https://data.giss.nasa.gov/gistemp/>!
 * 
 */

let monthRadius = 200;

let months;
let table;

let currentRow = 0, currentColumn = 0;

function preload() {

    table  = loadTable('assets/global-temp.csv', 'csv', 'header');
}

function setup() {

    createCanvas(600, 600);

    months = table.columns.slice(1, 13);

}

function draw() {


    background(0);
    strokeWeight(2);
    textSize(20);

    translate(width/2, height/2);

    drawDataLines(); // draw data

    createHandles(); // draw axis

    // frameRate(5);
}

function createHandles(){

    // draw circles as axis and value indicators
    noFill();
    stroke(255);
    circle(0., 0., 2*monthRadius); // for month labels

    // to show values -1, 0 and +1
    for (let frac = 0.25; frac < 1.; frac += 0.25){
        
        stroke(55);
        circle(0., 0., 2 * monthRadius * frac);
    }

    // add month labels
    noStroke();
    fill(255);
    for (let i = 0; i < months.length; i++){

        textAlign(CENTER, CENTER);

        let angle = (i - 2.) * PI / 6.;

        let x = 1.1 * monthRadius * cos(angle);
        let y = 1.1 * monthRadius * sin(angle);

        push();

        translate(x, y);
        rotate(angle + PI / 2);
        text(months[i], 0., 0.);

        pop();

    }

    // add value labels
    for (let frac = 0.25, _value = -1; frac < 1.; frac += 0.25, _value += 1.){
        push();

        noStroke();        
        translate(monthRadius * frac, 0.);

        fill(0);
        circle(0., 0., 15);

        fill(255);
        text(_value, 0., 0.);

        pop();
    }
}

function drawDataLines(){

    let currentYear  = table.getRow(currentRow).get("Year");
    let currentValue = table.getRow(currentRow).get( months[currentColumn] );

    noStroke();
    fill(255);

    // show the year
    textAlign(CENTER, CENTER);
    if (currentValue !== "***")
        if (currentValue < 0.)
            fill( lerpColor(color("white"), color("blue"), abs(currentValue)) );
        else
            fill( lerpColor(color("white"), color("red"), currentValue) );
    else
        fill(255);
    text(currentYear, 0., 0.);

    let prevX, prevY;
    let start = true;

    for (let j = 0; j <= currentRow; j++){

        let row = table.getRow(j);
        let nMonths = (j == currentRow ? currentColumn : months.length-1);

        for (let i = 0; i <= nMonths; i++){

            let __value = row.get( months[i] );
            if (__value === "***") 
                continue;

            let radius = map(__value, -1, 1, 0.25, 0.75) * monthRadius;
            let angle  = (i - 2.) * PI / 6.;

            let x = radius * cos(angle);
            let y = radius * sin(angle);

            if (!start){

                let colour;
                if (__value < 0.)
                    colour = lerpColor(color("white"), color("blue"), abs(__value));
                else
                    colour = lerpColor(color("white"), color("red"), __value);

                stroke(colour);
                line(prevX, prevY, x, y);
            }

            prevX = x;
            prevY = y;
            start = false;
        }
    }

    // update data point
    currentColumn++;
    if (currentColumn >= 12){

        currentColumn = 0;
        currentRow += 1;
    }
    if (currentRow >= table.getRowCount()){

        currentRow = 0;
    }
}