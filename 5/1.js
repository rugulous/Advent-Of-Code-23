const { getPuzzleInput } = require("../utils");

let currMap = null;
let allMap = {};

const order = ['seed', 'soil', 'fertilizer', 'water', 'light', 'temperature', 'humidity'];

const sortedKeys = {};

function processNewMap(line) {
    if(currMap != null){
        sortedKeys[currMap] = Object.keys(allMap[currMap]).map(v => parseInt(v)).sort((a,b) => a - b);
        console.log(sortedKeys[currMap]);
    }

    currMap = line.split(" ")[0].split("-")[0].trim();
    allMap[currMap] = {};
}

function processLine(line) {
    if(line == ""){
        return;
    }

    if (line.indexOf("map") > 0) {
        processNewMap(line);
        return;
    }

    const parts = line.split(" ").map(num => parseInt(num));
    buildMap(parts);
}

function buildMap(parts){
    allMap[currMap][parts[1]] = [parts[0], parts[2]];
}

function tryGetMapValue(map, val){
    console.log(`Mapping ${map} ${val}...`);

    if(!allMap[map].hasOwnProperty(val)){
        console.log("Not in map!");
        let closestKey = null;
        for(const key of sortedKeys[map]){
            if(key > val){
                break;
            }

            closestKey = key;
        }

        if(closestKey === null){
            console.log("No closest key");
            return val;
        }

        const relevantEntry = allMap[map][closestKey];
        console.log(`Closest key: ${closestKey}`);
        console.log(`Distance from key: ${val} - ${closestKey} = ${val - closestKey}`);
        console.log(relevantEntry);

        if(relevantEntry && (val >= closestKey && val <= closestKey + relevantEntry[1])){
            console.log(`${val} in bounds`);
            return (val - closestKey) + relevantEntry[0];
        }

        console.log(`${val} out of bounds`);
        return val;
    }

    return allMap[map][val][0];
}

function getSeedLocation(seed){
    console.log(`Starting seed ${seed}`);
    let index = seed;

    for(const key of order){
        index = tryGetMapValue(key, index);
        console.log();
        console.log(`New index: ${index}`);
    }

    console.log(`Final value: ${index}`);
    return index;
}

const input = getPuzzleInput(__dirname); //, "example.txt");

input.slice(1).forEach(processLine);
processNewMap(""); //make sure we sort the final map too!

const seeds = input[0].split(":")[1].trim().split(" ").map(n => getSeedLocation(parseInt(n)));
//getSeedLocation(seeds[3]);

console.log(Math.min(...seeds));