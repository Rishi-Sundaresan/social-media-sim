$("#population-size").slider({
	tooltip: 'always'
});
$("#personalization").slider({
	tooltip: 'always'
});
$("#effectiveness").slider({
	tooltip: 'always'
});
$("#activity").slider({
	tooltip: 'always'
});
$("#sim-time").slider({
	tooltip: 'always'
});
$("#run-sim").click(function() {
	if (!interval) {
		RunSim()
	} else {
		clearInterval(interval)
		interval = false
		document.getElementById("run-sim").innerHTML="Run Sim";
	}
})
var interval = false;


function RunSim() {
	//Read Parameters
	console.log("Running Sim")
	var population_size = $("#population-size").val()
	var personalization = $("#personalization").val()
	var effectiveness = $("#effectiveness").val()
	var activity = $("#activity").val()
	var simulation_time = $("#sim-time").val()
	var stances = []
	document.getElementById("run-sim").innerHTML="Setting Up...";
	document.getElementById("sim-world").innerHTML += "";
	for (var i = 0; i < population_size; i++) {
		document.getElementById("sim-world").innerHTML += '<span class="dot" id="dot' + i.toString() + '"></span>';
		var person = document.getElementById("dot" + i.toString())
		person.style.setProperty('left', (Math.random() * 96 + 2).toString() + "%");
		person.style.setProperty('top', (Math.random() * 96 + 2).toString() + "%");
		var stance = Math.random()*255;
		person.style.setProperty('background-color', 'rgb(' + stance.toString() + ", 0, " + (255-stance).toString() + ")")
		stances.push(stance)
	}
	UpdateMetrics(stances)
	document.getElementById("run-sim").innerHTML="Running Sim...(Click to Stop)";
	var startTime = new Date().getTime();
	interval = setInterval(function() {
		var cur_time = new Date().getTime();
		if(cur_time - startTime > simulation_time*1000){
	        clearInterval(interval);
			interval = false
			document.getElementById("run-sim").innerHTML="Run Sim";
	        return;
	    }
	    document.getElementById("run-sim").innerHTML="Running Sim..." + Math.ceil(simulation_time - (cur_time - startTime)/1000.0).toString() + "s left (Click to Stop)";
		for (var i = 0; i < population_size; i++) {
			//activity determines whether content viewing occurs
			if (Math.random() > activity) {continue;}
			//Personalization determines what content you see. Sample random content from people until it is in 
			//personalization range
			var content_range = [stances[i] - 255*(1.1-personalization), stances[i] + 255*(1.1-personalization)]
			var k = RandomPerson(stances)
			while (!InRange(stances[k], content_range)) {
				k = RandomPerson(stances)
			}
			//effectiveness determines impact of content on stance
			//People at ends of spectrum much less likely to waver
			stubbornness = Math.abs(255/2 - stances[i])/(255/2)
			applied_effectiveness = effectiveness*stubbornness
			stances[i] = (1-applied_effectiveness/10.0)*stances[i] + applied_effectiveness/10.0*stances[k]
			document.getElementById("dot" + i.toString()).style.setProperty('background-color', 'rgb(' + 
				stances[i].toString() + ", 0, " 
				+ (255-stances[i]).toString() + ")")
		}
		UpdateMetrics(stances)
	}, 10);
}



function UpdateMetrics(stances) {
	var mean = stances.reduce((a, b) => a + b) / stances.length;
	var variance =  stances.map(function(num) {
		return Math.pow(num - mean, 2);
	}).reduce((a, b) => a + b) / stances.length;
	document.getElementById("stance-avg").innerHTML = mean.toString();
	document.getElementById("stance-var").innerHTML = variance.toString();
	document.getElementById("stance-mid").innerHTML = stances.filter(s => s > 85 && s < 170).length;
}

function RandomPerson(stances) {
	return Math.floor(Math.random()*stances.length)
}
function InRange(val, content_range){
	return val > content_range[0] && val < content_range[1]

}
