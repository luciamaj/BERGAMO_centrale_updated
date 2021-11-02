//  MARK: - TODO: c'è un problema a volte nell'ordine in cui vengono registrati i
//  MARK: - TODO: fare l'emit dell'url sono una volta

let sky;
let bgVideo;
var hotPointsArray = [];
var playersArray = [];
var oldStations = [];
var newStations = [];
const poly = [];
var createPurpleStarImg = null;
var gif_createImg;
let w = 1920
let h = 1920
let playersGroup = null;
let hotPointsGroup = null;

let squareDim = 1920;

let oldposX;
let oldposY;

let isDebug = configuration.isDebug;

function preload() {
}

function setup() { 
    createCanvas(w, h);
    collideDebug(true);
    rectMode(CENTER);
    angleMode(DEGREES);

    playersGroup = new Group();
    hotPointsGroup = new Group();

    Object.keys(joysticks).forEach(function(name) {
        let player = new Omino(name, color(...joysticks[name].color), joysticks[name].baseX, joysticks[name].baseY, configuration.idleTime);
        playersArray.push(player);
    });

    // Object.keys(joysticks).forEach(function(name) {
    //     let player = new Player(name, color(...joysticks[name].color), joysticks[name].baseX, joysticks[name].baseY, color('hsba(160, 100%, 50%, 0.5)'));
    //     playersArray.push(player);
    // });

    jsonHotpoints.forEach(hotpoint => {
        hotPointsArray.push(new Hotpoint(hotpoint))
    });
	
	poly.push(createVector(471, 20));
	poly.push(createVector(87, 91));
    poly.push(createVector(92, 532));
	poly.push(createVector(24, 828));
	poly.push(createVector(123, 1207));
	poly.push(createVector(34, 1630));
	poly.push(createVector(214, 1839));
	poly.push(createVector(543, 1920));
	poly.push(createVector(1066, 1913));
	poly.push(createVector(1310, 1751));
	poly.push(createVector(1586, 1716));
	poly.push(createVector(1666, 1437));
	poly.push(createVector(1874, 1337));
	poly.push(createVector(1903, 849));
	poly.push(createVector(1857, 297));
	poly.push(createVector(1689, 50));
	poly.push(createVector(1321, 10));
	poly.push(createVector(830, 60));
}

function draw() { 
    clear();
    
    //image(videoNuvole, 0, 120, squareDim, squareDim);

    if(mouseX != oldposX && mouseY != oldposY) {
        oldposX = mouseX;
        oldposY = mouseY;
    }

    oldStations = newStations;
    newStations = [];

    if(isDebug == true) {
        if (playersOnCanvas.length == 0) {
            playersOnCanvas = playersArray;
        }
    }

    for(let player of playersOnCanvas) {
        for(hotpoint of hotPointsArray) {
            if(collidePointCircle(player.x, player.y, hotpoint.info.left, hotpoint.info.top, hotpoint.info.radius + 15)) {
                let oldStat = getEntry(hotpoint, player, oldStations);
                let newStat = {
                    'player': player, 
                    'hotpoint': hotpoint, 
                    'timestamp': oldStat ? oldStat.timestamp : Date.now(),
                };

                newStations.push(newStat);
            }
        }
    }

    for (let player of playersOnCanvas) {
        var joystick = joysticks[player.name]
		
		// polygon
        player.futureX = player.x + (joystick.x ? joystick.x : 0 * configuration.velocity);
        player.futureY = player.y + (joystick.y ? joystick.y : 0 * configuration.velocity);

        hit = collidePointPoly(player.futureX, player.futureY, poly);

        if (!hit && player.showMe == false) {
            joystick.y = 0;
            joystick.x = 0;
        }

        player.update(joystick);  
    }

    for (let hotpoint of hotPointsArray) {
        hotpoint.draw();
    }

    for(let player of playersOnCanvas) {
        player.draw();
    }
	
	// stroke('red');
    // strokeWeight(6);
    beginShape();
    for (const { x, y } of poly)  vertex(x, y);
    endShape(CLOSE);

    drawSprites();
}

// ENTRY METHODS

function getEntry(hotpoint, player, stations) {
    return stations.find(entry => { return entry.player == player && entry.hotpoint == hotpoint });
}

function justEntered(player) {
    let newEntry = newStations.find(entry => { return entry.player == player });
    let oldEntry = oldStations.find(entry => { return entry.player == player });

    if(newEntry && !oldEntry) {
        newEntry.hotpoint.players.push[player];
        return newEntry.hotpoint;
    } else {
        return false;
    }
}


function justExited(player) {
    let newEntry = newStations.find(entry => { return entry.player == player });
    let oldEntry = oldStations.find(entry => { return entry.player == player });

    if(!newEntry && oldEntry) {
        return true;
    } else {
        if (newEntry) arrayRemove(newEntry.hotpoint.players, player);
        return false;
    }
}

function arrayRemove(arr, value) {   
    return arr.filter(function(ele){ 
        return ele != value; 
    });
}

function isInside(player) {
    let entry = newStations.find(entry => { return entry.player == player });

    if(entry) {
        return true
    } else {
        return false
    }
}