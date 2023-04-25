/**
 * @file double-pendulum.js
 * @author M. S. Suryan Sivadas <ms3.msssivadas@gmail.com>
 * 
 * Double pendulum in p5!
 * 
 */


let DT = 0.1;  // time step
let G  = 10.0; // gravity 

let canvas2;

/**
 * A double pendulum class. This will be constructed by the initial angles, 
 * angular velocities and a colour. 
 */
class DoublePendulum {

    constructor(theta_1, theta_2, vel_1, vel_2, colour) {

        // position and velocity of first pendulum
        this.theta_1 = theta_1; this.vel_1 = vel_1;

        // position and velocity of second pendulum
        this.theta_2 = theta_2; this.vel_2 = vel_2;

        // size of the pendulums
        this.L1 = 100.0; this.L2 = 100.0;

        // masses of the pendulum, more mass leads to more size
        this.m1 = 10.0; this.m2 = 10.0;

        this.colour = colour;
    }

    /** Draw the pendulum to the canvas */
    draw() {

        // draw pendulum on main canvas
        push();

        stroke(this.colour);
        fill(this.colour);

        translate(width / 2, height / 2);

        // draw first pendulum
        let x1 = this.L1 * Math.sin(this.theta_1);
        let y1 = this.L1 * Math.cos(this.theta_1);
        line(0., 0., x1, y1);
        circle(x1, y1, 2*this.m1);

        // draw second pendulum
        let x2 = x1 + this.L2 * Math.sin(this.theta_2);
        let y2 = y1 + this.L2 * Math.cos(this.theta_2);
        line(x1, y1, x2, y2);
        circle(x2, y2, 2*this.m2);

        pop();

        // draw trail effect on extra canvas
        canvas2.push();

        canvas2.stroke(this.colour);
        canvas2.strokeWeight(2);
        canvas2.translate(width / 2, height / 2);
        canvas2.point(x2, y2);

        canvas2.pop();
    }

    /** Update the pendulum position and velocity */
    update() {

        let t1 = this.theta_1, t2 = this.theta_2, w1 = this.vel_1, w2 = this.vel_2;

        let d = 2 * this.m1 + this.m2 - this.m2 * Math.cos(2*t1 - 2*t2);

        let acc_1 = 0., acc_2 = 0;

        acc_1 = (
            -G * (2 * this.m1 + this.m2) * Math.sin(t1) 
                - this.m2 * G * Math.sin(t1 - 2*t2) 
                - (
                    2 * Math.sin(t1 - t2) * this.m2 
                      * ( w2**2 * this.L2 + w1**2 * this.L1 * Math.cos(t1 - t2) )
                ) 
        ) / (this.L1 * d);

        acc_2 = (
            2 * Math.sin(t1 - t2) * (w1**2 * this.L1 * (this.m1 + this.m2) 
                + G * (this.m1 + this.m2) * Math.cos(t1) 
                + w2**2 * this.L2 * this.m2 * Math.cos(t1 - t2)) 
        ) / (this.L2 * d);

        // euler integration O(1)
        this.theta_1 += w1 * DT;
        this.theta_2 += w2 * DT;

        this.vel_1 += acc_1 * DT;
        this.vel_2 += acc_2 * DT;
    }
}


///////////////////////////////////////////////////////////////////////

let colours = ["#f9d1d1", "#ffa4b6", "#f765a3", "#a155b9", "#165baa", "#0b1354"];
let pendulums = [];

function setup(){

    createCanvas(600, 600);

    // extra canvas for trails
    canvas2 = createGraphics(600, 600);
    canvas2.clear();

    // create some pendulums...
    for (let i = 0, theta = PI / 4; i < 4; i++){

        let pendulum = new DoublePendulum(theta, PI / 8, 0.1, 0.0, color(colours[i]) );
        pendulums.push( pendulum );

        theta += 0.1;
    }

}

function draw(){

    background(0);

    for (let pendulum of pendulums){

        pendulum.draw();
        pendulum.update();
    }

    image(canvas2, 0, 0);
}