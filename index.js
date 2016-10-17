#!/usr/bin/env node

var request = require('request');
var colors = require('colors');

const url = 'https://api.twitch.tv/kraken/streams/';
const args = process.argv[2] || 'twitch';
const profile = 'https://api.twitch.tv/kraken/users/'+ args + '/follows/channels?limit=100&sortby=last_broadcast';
const clientid = '1ntwh8zod2d82dtyw88r9i6ff5pw2zv';
const options = {url: url,headers: {'Client-ID': clientid}};
getFollowers(profile);
//console.log(args);
console.log('     Twitch streamers status     '.inverse + '\r');

/*const profile = 'https://api.twitch.tv/kraken/users/cloudy/follows/channels?limit=100&sortby=last_broadcast';
getFollowers(profile);*/


function getFollowers(val){

	request({url: val,headers:{'Client-ID': clientid}}, (err, res, body) => {
	    var streamers = [];

		if(!err && res.statusCode === 200){
			data = JSON.parse(body);

			data.follows.forEach(function(val){
				streamers.push(val.channel.name);
			})

			//console.log(streamers);
			//streamers.sort();
			//showText();
			streamers.forEach( (val) => display(val));
		}
	})
}

//console.log(' Twitch streamers status '.bgWhite.black + '\r\n');
function showText() {
	figlet('Twitch', function(err, data) {
	    if (err) {
	        console.log('Something went wrong...');
	        console.dir(err);
	        return;
	    }
	    console.log(data);
	    console.log('     Twitch streamers status     '.inverse + '\r\n');
	    //console.log('loading...');
	});
}

function display(val){

	request({url: url + val,headers:{'Client-ID': clientid}}, (err, res, body) => {
		if(!err && res.statusCode === 200) {
			data = JSON.parse(body);

			if (data.stream === null) {
	          request(data._links.channel, (err,res, body) => {
	          	//data = JSON.parse(body);
	          	//console.log((data.display_name).red.bold + ' is offline')
	          });
	        } else {
	        	var time = parseTwitterDate(data.stream.created_at);
	        	console.log((data.stream.channel.display_name).bgBlue.white + ' is playing: ' + data.stream.channel.game + ' (' + time + ')' + '\r\n' + data.stream.channel.status + '\r');
	        }
		} else {
			console.log('Oups, something went wrong... :(');
		}
	});

}

function parseTwitterDate(tdate) {
    var system_date = new Date(Date.parse(tdate));
    var user_date = new Date();
    var diff = Math.floor((user_date - system_date) / 1000);
    if (diff <= 1) {return "just now";}
    if (diff < 20) {return diff + " seconds ago";}
    if (diff < 40) {return "half a minute ago";}
    if (diff < 60) {return "less than a minute ago";}
    if (diff <= 90) {return "one minute ago";}
    if (diff <= 3540) {return Math.round(diff / 60) + " minutes ago";}
    if (diff <= 5400) {return "1 hour ago";}
    if (diff <= 86400) {return Math.round(diff / 3600) + " hours ago";}
    if (diff <= 129600) {return "1 day ago";}
    if (diff < 604800) {return Math.round(diff / 86400) + " days ago";}
    if (diff <= 777600) {return "1 week ago";}
    return "on " + system_date;
}