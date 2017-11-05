var http = require('http');  
var fs = require('fs');
var url = require('url');
var mongo = require('mongodb').MongoClient;

//db vars
//var uri_db = "mongodb://cshub-db-resource:Firethedesire@cshub-db-cluster-shard-00-00-8n65g.mongodb.net:27017,cshub-db-cluster-shard-00-01-8n65g.mongodb.net:27017,cshub-db-cluster-shard-00-02-8n65g.mongodb.net:27017/cshub-db?ssl=true&replicaSet=cshub-db-cluster-shard-0&authSource=admin";

var uri_db = "mongodb://127.0.0.1:27017/cs-hub"

var themes = {
	'theme_violet' : {
		'box_shadow_color_rbga' : "142,36,170,",

		'colorcode_theme_color_dark_primary2' : "#311b92",
		'colorcode_theme_color_dark_primary' : "#512da8",
		'colorcode_theme_text_dark_primary' : "#5e35b1",
		'colorcode_theme_color_dark_secondary' : "#b39ddb",
		'colorcode_theme_color_light_primary' : "#ffffff",
		'colorcode_theme_color_ash' : "#616161",
		'colorcode_theme_text_light_primary' : "#ffffff",
		'colorcode_theme_text_black' : "#000000",
		'colorcode_theme_text_ash_dark' : "#424242",
		'colorcode_theme_text_ash' : "#616161",

		'theme_color_dark_primary2' : "purple darken-4",
		'theme_color_dark_primary' : "purple darken-2",
		'theme_text_dark_primary' : "purple-text text-darken-2",
		'theme_color_dark_secondary' : "purple lighten-3",
		'theme_color_light_primary' : "white",
		'theme_color_ash' : "grey darken-2",
		'theme_text_light_primary' : "white-text",
		'theme_text_black' : "black-text",
		'theme_text_ash_dark' : "grey-text text-darken-3",
		'theme_text_ash' : "grey-text text-darken-2",
	},
	'theme_indigo' : {
		'box_shadow_color_rbga' : "64,84,196,",

		'colorcode_theme_color_dark_primary2' : "#1a237e",
		'colorcode_theme_color_dark_primary' : "#303f9f",
		'colorcode_theme_text_dark_primary' : "#3949ab",
		'colorcode_theme_color_dark_secondary' : "#9fa8da",
		'colorcode_theme_color_light_primary' : "#ffffff",
		'colorcode_theme_color_ash' : "#616161",
		'colorcode_theme_text_light_primary' : "#ffffff",
		'colorcode_theme_text_black' : "#000000",
		'colorcode_theme_text_ash_dark' : "#424242",
		'colorcode_theme_text_ash' : "#616161",

		'theme_color_dark_primary2' : "indigo darken-4",
		'theme_color_dark_primary' : "indigo darken-2",
		'theme_text_dark_primary' : "indigo-text text-darken-1",
		'theme_color_dark_secondary' : "indigo lighten-3",
		'theme_color_light_primary' : "white",
		'theme_color_ash' : "grey darken-2",
		'theme_text_light_primary' : "white-text",
		'theme_text_black' : "black-text",
		'theme_text_ash_dark' : "grey-text text-darken-3",
		'theme_text_ash' : "grey-text text-darken-2",
	},
	'theme_blue' : {
		'box_shadow_color_rbga' : "0,116,186,",

		'colorcode_theme_color_dark_primary2' : "#0d47a1",
		'colorcode_theme_color_dark_primary' : "#1565c0",
		'colorcode_theme_text_dark_primary' : "#0d47a1",
		'colorcode_theme_color_dark_secondary' : "#90caf9",
		'colorcode_theme_color_light_primary' : "#ffffff",
		'colorcode_theme_color_ash' : "#616161",
		'colorcode_theme_text_light_primary' : "#ffffff",
		'colorcode_theme_text_black' : "#000000",
		'colorcode_theme_text_ash_dark' : "#424242",
		'colorcode_theme_text_ash' : "#616161",

		'theme_color_dark_primary2' : "blue darken-4",
		'theme_color_dark_primary' : "blue darken-3",
		'theme_text_dark_primary' : "blue-text text-darken-4",
		'theme_color_dark_secondary' : "blue lighten-3",
		'theme_color_light_primary' : "white",
		'theme_color_ash' : "grey darken-2",
		'theme_text_light_primary' : "white-text",
		'theme_text_black' : "black-text",
		'theme_text_ash_dark' : "grey-text text-darken-3",
		'theme_text_ash' : "grey-text text-darken-2",
	},
	'theme_green' : {
		'box_shadow_color_rbga' : "139,195,74,",

		'colorcode_theme_color_dark_primary2' : "#33691e",
		'colorcode_theme_color_dark_primary' : "#689f38",
		'colorcode_theme_text_dark_primary' : "#33691e",
		'colorcode_theme_color_dark_secondary' : "#c5e1a5",
		'colorcode_theme_color_light_primary' : "#ffffff",
		'colorcode_theme_color_ash' : "#616161",
		'colorcode_theme_text_light_primary' : "#ffffff",
		'colorcode_theme_text_black' : "#000000",
		'colorcode_theme_text_ash_dark' : "#424242",
		'colorcode_theme_text_ash' : "#616161",

		'theme_color_dark_primary2' : "light-green darken-4",
		'theme_color_dark_primary' : "light-green darken-2",
		'theme_text_dark_primary' : "green-text text-darken-4",
		'theme_color_dark_secondary' : "light-green lighten-3",
		'theme_color_light_primary' : "white",
		'theme_color_ash' : "grey darken-2",
		'theme_text_light_primary' : "white-text",
		'theme_text_black' : "black-text",
		'theme_text_ash_dark' : "grey-text text-darken-3",
		'theme_text_ash' : "grey-text text-darken-2",
	},
	'theme_grey' : {
		'box_shadow_color_rbga' : "124,123,123,",

		'colorcode_theme_color_dark_primary2' : "#424242",
		'colorcode_theme_color_dark_primary' : "#616161",
		'colorcode_theme_text_dark_primary' : "#424242",
		'colorcode_theme_color_dark_secondary' : "#eeeeee",
		'colorcode_theme_color_light_primary' : "#ffffff",
		'colorcode_theme_color_ash' : "#616161",
		'colorcode_theme_text_light_primary' : "#ffffff",
		'colorcode_theme_text_black' : "#000000",
		'colorcode_theme_text_ash_dark' : "#424242",
		'colorcode_theme_text_ash' : "#616161",

		'theme_color_dark_primary2' : "grey darken-3",
		'theme_color_dark_primary' : "grey darken-2",
		'theme_text_dark_primary' : "grey-text text-darken-3",
		'theme_color_dark_secondary' : "grey lighten-3",
		'theme_color_light_primary' : "white",
		'theme_color_ash' : "grey darken-2",
		'theme_text_light_primary' : "white-text",
		'theme_text_black' : "black-text",
		'theme_text_ash_dark' : "grey-text text-darken-3",
		'theme_text_ash' : "grey-text text-darken-2",
	},
	'theme_orange' : {
		'box_shadow_color_rbga' : "255,152,0,",

		'colorcode_theme_color_dark_primary2' : "#e65100",
		'colorcode_theme_color_dark_primary' : "#f57c00",
		'colorcode_theme_text_dark_primary' : "#e65100",
		'colorcode_theme_color_dark_secondary' : "#ffcc80",
		'colorcode_theme_color_light_primary' : "#ffffff",
		'colorcode_theme_color_ash' : "#616161",
		'colorcode_theme_text_light_primary' : "#ffffff",
		'colorcode_theme_text_black' : "#000000",
		'colorcode_theme_text_ash_dark' : "#424242",
		'colorcode_theme_text_ash' : "#616161",

		'theme_color_dark_primary2' : "orange darken-4",
		'theme_color_dark_primary' : "orange darken-2",
		'theme_text_dark_primary' : "orange-text text-darken-4",
		'theme_color_dark_secondary' : "orange lighten-3",
		'theme_color_light_primary' : "white",
		'theme_color_ash' : "grey darken-2",
		'theme_text_light_primary' : "white-text",
		'theme_text_black' : "black-text",
		'theme_text_ash_dark' : "grey-text text-darken-3",
		'theme_text_ash' : "grey-text text-darken-2",
	},
	'theme_red' : {
		'box_shadow_color_rbga' : "214,47,47,",

		'colorcode_theme_color_dark_primary2' : "#b71c1c",
		'colorcode_theme_color_dark_primary' : "#d32f2f",
		'colorcode_theme_text_dark_primary' : "#e53935",
		'colorcode_theme_color_dark_secondary' : "#ef9a9a",
		'colorcode_theme_color_light_primary' : "#ffffff",
		'colorcode_theme_color_ash' : "#616161",
		'colorcode_theme_text_light_primary' : "#ffffff",
		'colorcode_theme_text_black' : "#000000",
		'colorcode_theme_text_ash_dark' : "#424242",
		'colorcode_theme_text_ash' : "#616161",

		'theme_color_dark_primary2' : "red darken-4",
		'theme_color_dark_primary' : "red darken-2",
		'theme_text_dark_primary' : "red-text text-darken-1",
		'theme_color_dark_secondary' : "red lighten-3",
		'theme_color_light_primary' : "white",
		'theme_color_ash' : "grey darken-2",
		'theme_text_light_primary' : "white-text",
		'theme_text_black' : "black-text",
		'theme_text_ash_dark' : "grey-text text-darken-3",
		'theme_text_ash' : "grey-text text-darken-2",
	}
};

var theme_names = ["theme_violet", "theme_indigo", "theme_blue", "theme_green", "theme_red", "theme_orange", "theme_red"];

//order is important because of subset strings
//for testing purposes
//remove this after testing
var theme_color_dark_primary2 = "red darken-4";
var theme_color_dark_primary = "red darken-2";
var theme_text_dark_primary = "red-text darken-3";
var theme_color_dark_secondary = "red lighten-3";

var theme_color_light_primary = "white";
var theme_text_light_primary = "white-text";
var theme_text_black = "black-text";
var theme_text_ash = "grey-text darken-4";

//autocomplete data

var autocomplete_extra_data_string = "'Anand pitti' : 'anandpitti0784@gmail.com',\n";
var dynamic_fill_autocomplete_data = "'Anand pitti' : 'https://res.cloudinary.com/cshub-resources/image/upload/c_crop,g_face:center,w_640,h_640/v1508236067/cwotk1xnrtiecwyfdvjh',\n";


http.createServer(function(request, response) {  

	if(request.url === "/index.html"){
		sendFileContent(response, "index.html", "text/html");
	}
	else if(request.url === "/index2.html"){
		sendFileContent(response, "index2.html", "text/html");
	}
	else if(request.url === "/indexfinal.html"){
		sendFileContent(response, "indexfinal.html", "text/html");
	}
	else if(request.url === "/"){
		sendFileContent(response, "index.html", "text/html");	
	}
	else if(request.url === "/sign_in"){
		sendFileContent(response, "sign_in.html", "text/html");	
	}
	else if(request.url === "/profile"){
		sendFileContent(response, "profile.html", "text/html");	
	}
	else if(request.url === "/gallery"){
		sendFileContent(response, "gallery.html", "text/html");	
	}
	else if(request.url === "/clubs"){
		sendFileContent(response, "clubs.html", "text/html");	
	}
	else if(request.url === "/academics"){
		sendFileContent(response, "academics.html", "text/html");	
	}
	else if(request.url === "/opportunities"){
		sendFileContent(response, "opportunities.html", "text/html");	
	}
	else if(request.url === "/contacts"){
		sendFileContent(response, "contacts.html", "text/html");	
	}
	else if(request.url === "/editprofile"){
		sendFileContent(response, "editprofile.html", "text/html");	
	}
	else if(request.url === "/newpost"){
		sendFileContent(response, "newpost.html", "text/html");	
	}
	else if(request.url === "/manage"){
		sendFileContent(response, "manage.html", "text/html");	
	}
	else if(/^\/[a-zA-Z0-9\/_.-]*.js$/.test(request.url.toString())){
		sendFileContent(response, request.url.toString().substring(1), "text/javascript");
	}
	else if(/^\/[a-zA-Z0-9\/_.-]*.css$/.test(request.url.toString())){
		sendFileContent(response, request.url.toString().substring(1), "text/css");
	}
	else if(/^\/[a-zA-Z0-9\/_.-]*.png$/.test(request.url.toString())){
		var img = fs.readFileSync(request.url.toString().substring(1));
     	response.writeHead(200, {'Content-Type': 'image/png' });
     	response.end(img, 'binary');
	}
	else if(/^\/[a-zA-Z0-9\/_.-]*.jpg$/.test(request.url.toString())){
		var img = fs.readFileSync(request.url.toString().substring(1));
     	response.writeHead(200, {'Content-Type': 'image/jpg' });
     	response.end(img, 'binary');
	}
	else if(/^\/[a-zA-Z0-9\/_.-]*.jpeg$/.test(request.url.toString())){
		var img = fs.readFileSync(request.url.toString().substring(1));
     	response.writeHead(200, {'Content-Type': 'image/jpeg' });
     	response.end(img, 'binary');
	}
	else if(request.url === "/checkdb"){
		checkdb(request, response);	
	}
	else if(request.url === "/validate_login"){
		validate_login(request, response);	
	}
	else if(request.url === "/check_user_name_email_exists"){
		check_user_name_email_exists(request,response);
	}	
	else if(request.url === "/register_user"){
		register_user(request, response);
	}
	else if(request.url === "/get_profile_pic"){
		get_profile_pic(request, response);
	}
	else if(request.url === "/delete_user"){
		delete_user(request, response);
	}
	else if(request.url === "/get_user_profile_for_view"){
		get_user_profile_for_view(request, response);
	}
	else if(request.url === "/get_user_profile_for_edit"){
		get_user_profile_for_edit(request, response);
	}
	else if(request.url === "/get_contacts"){
		get_contacts(request, response);
	}
	else if(request.url === "/get_reseaarch_project_details"){
		get_reseaarch_project_details(request, response);
	}
	else if(request.url === "/get_dept_project_details"){
		get_dept_project_details(request, response);
	}
	else if(request.url === "/get_intern_offers_details"){
		get_intern_offers_details(request, response);
	}
	else if(request.url === "/get_job_related_details"){
		get_job_related_details(request, response);
	}
	else if(request.url === "/get_gallery_home_details"){
		get_gallery_home_details(request, response);
	}
	else if(request.url === "/get_single_event_images"){
		get_single_event_images(request, response);
	}
	else if(request.url === "/get_important_events"){
		get_important_events(request, response);
	}
	else if(request.url === "/get_events_tab_contents"){
		get_events_tab_contents(request, response);
	}
	else if(request.url === "/get_post_count"){
		get_post_count(request, response);
	}
	else if(request.url === "/get_all_post_details"){
		get_all_post_details(request, response);
	}
	else if(request.url === "/get_notifications"){
		get_notifications(request, response);
	}
	else{
		console.log("Requested URL is: " + request.url);
		response.end();
	}

}).listen(8888, '127.0.0.1');

//process.env.PORT
//8888, '127.0.0.1'

//console.log('Server running at http://127.0.0.1:8888');

function sendFileContent(response, fileName, contentType){

	var active_theme = themes[theme_names[new Date().getDay()]];

	fs.readFile(fileName, "utf8", function(err, data){
		if(err){
			response.writeHead(404);
			response.write("Not Found!");
		}
		else{
				response.writeHead(200, {'Content-Type': contentType});

				if(contentType == "text/javascript"){
					data = data.replace(/autocomplete-extra-data-string/g, autocomplete_extra_data_string);
					data = data.replace(/dynamic-fill-autocomplete-data/g, dynamic_fill_autocomplete_data);
				}

				//order is important because of subset strings
				data = data.replace(/box-shadow-color-rbga/g, active_theme['box_shadow_color_rbga']);				

				data = data.replace(/colorcode-theme-color-dark-primary2/g, active_theme['colorcode_theme_color_dark_primary2']);
				data = data.replace(/colorcode-theme-color-dark-primary/g, active_theme['colorcode_theme_color_dark_primary']);
				data = data.replace(/colorcode-theme-text-dark-primary/g, active_theme['colorcode_theme_text_dark_primary']);
				data = data.replace(/colorcode-theme-color-dark-secondary/g, active_theme['colorcode_theme_color_dark_secondary']);

				data = data.replace(/colorcode-theme-color-light-primary/g, active_theme['colorcode_theme_color_light_primary']);
				data = data.replace(/colorcode-theme-color-ash/g, active_theme['colorcode_theme_color_ash']);
				data = data.replace(/colorcode-theme-text-light-primary/g, active_theme['colorcode_theme_text_light_primary']);
				data = data.replace(/colorcode-theme-text-black/g, active_theme['colorcode_theme_text_black']);
				data = data.replace(/colorcode-theme-text-ash-dark/g, active_theme['colorcode_theme_text_ash_dark']);
				data = data.replace(/colorcode-theme-text-ash/g, active_theme['colorcode_theme_text_ash']);	

				data = data.replace(/theme-color-dark-primary2/g, active_theme['theme_color_dark_primary2']);
				data = data.replace(/theme-color-dark-primary/g, active_theme['theme_color_dark_primary']);
				data = data.replace(/theme-text-dark-primary/g, active_theme['theme_text_dark_primary']);
				data = data.replace(/theme-color-dark-secondary/g, active_theme['theme_color_dark_secondary']);

				data = data.replace(/theme-color-light-primary/g, active_theme['theme_color_light_primary']);
				data = data.replace(/theme-color-ash/g, active_theme['theme_color_ash']);
				data = data.replace(/theme-text-light-primary/g, active_theme['theme_text_light_primary']);
				data = data.replace(/theme-text-black/g, active_theme['theme_text_black']);
				data = data.replace(/theme-text-ash-dark/g, active_theme['theme_text_ash_dark']);
				data = data.replace(/theme-text-ash/g, active_theme['theme_text_ash']);				

				response.write(data);
		}
		response.end();
	});
}


function checkdb(req, res){
	res.writeHead(200, {"Content-Type": "text", 'Access-Control-Allow-Origin' : '*'});
	mongo.connect(uri_db, function(err, db){
		if(!err){
			res.write("success");
			console.log("db status... OK");
		}
		else{
			res.write("failure");
			console.log("db status... NOT OK");
		}
		res.end();
		db.close();
	});
}

function validate_login(req, res){
	res.writeHead(200, {"Content-Type": "text", 'Access-Control-Allow-Origin': '*'});
	if(req.method == "POST"){
		req.on('data', function(data){
			data = JSON.parse(data);
			mongo.connect(uri_db, function(err, db){
			if(!err){
				db.collection('profile').findOne({'user_email_id': data['user_email_id']}, function(err, item) {
					if(item != null && item['user_password'] == data['user_password']){
						console.log("Login Success");
						res.write("success");
						res.end();
					}else{
						console.log("Login Failure");
						res.write("failure");
						res.end();
					}
				});
			}
			else{
				res.write("failure");
				res.end();
			}
			db.close();
			});
		});
	}else{
        res.end("failure");
	}
}

function check_user_name_email_exists(req, res){
	res.writeHead(200, {"Content-Type": "text", 'Access-Control-Allow-Origin': '*'});
	if(req.method == "POST"){
		req.on('data', function(data){
			data = JSON.parse(data);
			mongo.connect(uri_db, function(err, db){
			if(!err){
				db.collection('profile').findOne({'user_email_id': data['user_email_id']}, function(err, item) {
					if(item != null){
						res.write("name_present");
						res.end();
					}else{
						check_email_exists(req,res,data);
					}
				});
			}
			else{
				res.write("failure");
				res.end();
			}
			db.close();
			});
		});
	}else{
        res.end("failure");
	}
}

function delete_user(req, res){
	res.writeHead(200, {"Content-Type": "text", 'Access-Control-Allow-Origin': '*'});
	if(req.method == "POST"){
		req.on('data', function(data){
			data = JSON.parse(data);
			mongo.connect(uri_db, function(err, db){
			if(!err){
				db.collection('profile').remove({'user_name': data['user_name']}, function(err, item) {
					if(!err){
						res.write("success");
						res.end();
					}else{
						res.write("failure");
						res.end();
					}
				});
			}
			else{
				res.write("failure");
				res.end();
			}
			db.close();
			});
		});
	}else{
        res.end("failure");
	}
}

function check_email_exists(req, res, data){
	mongo.connect(uri_db, function(err, db){
	if(!err){
		db.collection('profile').findOne({'user_email_id': data['user_email_id']}, function(err, item) {
			if(item != null){
				res.write("email_id_present");
				res.end();
			}else{
				res.write("absent");
				res.end();
			}
		});
	}
	else{
		res.write("failure");
		res.end();
	}
	db.close();
	});
}

function register_user(req, res){
	res.writeHead(200, {"Content-Type": "text", 'Access-Control-Allow-Origin': '*'});
	if(req.method == "POST"){
		req.on('data', function(data){
			data = JSON.parse(data);			
			mongo.connect(uri_db, function(err, db){
			if(!err){
				db.collection('profile').insert(data, {w:1}, function(err, result){
					if(!err){
						res.write("success");
						res.end();
						update_autocomplete_extra_data_string(data['user_name'], data['user_email_id']);
						update_dynamic_fill_autocomplete_data(data['user_name'], data['profile_pic_url']);
					}
				});
			}
			else{
				res.write("failure");
				res.end();
			}
			db.close();
			});
		});
	}else{
        res.end("failure");
	}
}


function update_autocomplete_extra_data_string(user_name, user_email_id){
	autocomplete_extra_data_string += "'" + user_name + "' : '" + user_email_id + "',\n";
}

function update_dynamic_fill_autocomplete_data(user_name, profile_pic_url){
	dynamic_fill_autocomplete_data += "'" + user_name + "' : '" + profile_pic_url + "',\n";
}

function initial_update_autocomplete() {
	mongo.connect(uri_db, function(err, db){
		if(!err){
			db.collection('profile').find().toArray(function(err, items){
				var temp_1 = "";
				var temp_2 = "";
				for(x in items){
					temp_1 += "\'"+ items[x]['user_name'] + "\' : \'"+ items[x]['profile_pic_url'] +"\',\n";
					temp_2 += "\'"+ items[x]['user_name'] + "\' : \'"+ items[x]['user_email_id'] +"\',\n";
				}
				autocomplete_extra_data_string = temp_2;
				dynamic_fill_autocomplete_data = temp_1;
			});
		}
	});
}

initial_update_autocomplete();

function get_profile_pic(req, res){
	res.writeHead(200, {"Content-Type": "text", 'Access-Control-Allow-Origin': '*'});
	if(req.method == "POST"){
		req.on('data', function(data){
			data = JSON.parse(data);
			mongo.connect(uri_db, function(err, db){
			if(!err){
				db.collection('profile').findOne({'user_email_id': data['user_email_id']}, function(err, item) {
					if(item != null){
						res.write(item['profile_pic_url']);
						res.end();
					}else{
						res.write("images/default_account_pic.jpg");
						res.end();
					}
				});
			}
			else{
				res.write("images/default_account_pic.jpg");
				res.end();
			}
			db.close();
			});
		});
	}else{
        res.end("images/default_account_pic.jpg");
	}
}

function get_user_profile_for_view(req, res){
	res.writeHead(200, {"Content-Type": "text", 'Access-Control-Allow-Origin': '*'});
	if(req.method == "POST"){
		req.on('data', function(data){
			data = JSON.parse(data);
			mongo.connect(uri_db, function(err, db){
			if(!err){
				db.collection('profile').findOne({'user_email_id': data['user_email_id']}, function(err, item) {
					if(item != null){
						item['user_password'] = "";
						item['_id'] = "";
						res.write(JSON.stringify(item));
						res.end();
					}else{
						res.write("user_not_exist");
						res.end();
					}
				});
			}
			else{
				res.write("user_not_exist");
				res.end();
			}
			db.close();
			});
		});
	}else{
        res.end("user_not_exist");
	}
}

function get_user_profile_for_edit(req, res){
	res.writeHead(200, {"Content-Type": "text", 'Access-Control-Allow-Origin': '*'});
	if(req.method == "POST"){
		req.on('data', function(data){
			data = JSON.parse(data);
			mongo.connect(uri_db, function(err, db){
			if(!err){
				db.collection('profile').findOne({'user_email_id': data['user_email_id']}, function(err, item) {
					if(item != null){
						item['_id'] = "";
						res.write(JSON.stringify(item));
						res.end();
					}else{
						res.write("user_not_exist");
						res.end();
					}
				});
			}
			else{
				res.write("user_not_exist");
				res.end();
			}
			db.close();
			});
		});
	}else{
        res.end("user_not_exist");
	}
}

function get_contacts(req, res) {
	res.writeHead(200, {"Content-Type": "text", 'Access-Control-Allow-Origin': '*'});
	if(req.method == "POST"){
		req.on('data', function(data){
			mongo.connect(uri_db, function(err, db){
			if(!err){
				db.collection('contact_office').find().toArray(function(err, items) {
					res.end(JSON.stringify(items));
				});
			}
			else{
				res.write("failure");
				res.end();
			}
			db.close();
			});
		});
	}else{
        res.end("failure");
	}
}

function get_reseaarch_project_details(req, res) {
	res.writeHead(200, {"Content-Type": "text", 'Access-Control-Allow-Origin': '*'});
	if(req.method == "POST"){
		req.on('data', function(data){
			mongo.connect(uri_db, function(err, db){
			if(!err){
				db.collection('research_projects').find().toArray(function(err, items) {
					res.end(JSON.stringify(items));
				});
			}
			else{
				res.write("failure");
				res.end();
			}
			db.close();
			});
		});
	}else{
        res.end("failure");
	}
}

function get_dept_project_details(req, res) {
	res.writeHead(200, {"Content-Type": "text", 'Access-Control-Allow-Origin': '*'});
	if(req.method == "POST"){
		req.on('data', function(data){
			mongo.connect(uri_db, function(err, db){
			if(!err){
				db.collection('dept_projects').find().toArray(function(err, items) {
					res.end(JSON.stringify(items));
				});
			}
			else{
				res.write("failure");
				res.end();
			}
			db.close();
			});
		});
	}else{
        res.end("failure");
	}
}

function get_intern_offers_details(req, res) {
	res.writeHead(200, {"Content-Type": "text", 'Access-Control-Allow-Origin': '*'});
	if(req.method == "POST"){
		req.on('data', function(data){
			mongo.connect(uri_db, function(err, db){
			if(!err){
				db.collection('intern_offers').find({"current_state" : "Active"}).toArray(function(err, items) {
					res.end(JSON.stringify(items));
				});
			}
			else{
				res.write("failure");
				res.end();
			}
			db.close();
			});
		});
	}else{
        res.end("failure");
	}
}

function get_job_related_details(req, res) {
	res.writeHead(200, {"Content-Type": "text", 'Access-Control-Allow-Origin': '*'});
	if(req.method == "POST"){
		req.on('data', function(data){
			mongo.connect(uri_db, function(err, db){
			if(!err){
				db.collection('job_offers').find({"current_state" : "Active"}).toArray(function(err, items) {
					res.end(JSON.stringify(items));
				});
			}
			else{
				res.write("failure");
				res.end();
			}
			db.close();
			});
		});
	}else{
        res.end("failure");
	}
}

function get_gallery_home_details(req, res){
	res.writeHead(200, {"Content-Type": "text", 'Access-Control-Allow-Origin': '*'});
	if(req.method == "POST"){
		req.on('data', function(data){
			mongo.connect(uri_db, function(err, db){
			if(!err){
				db.collection('event_gallery_home').find().sort({"year":-1}).toArray(function(err, items) {
					res.end(JSON.stringify(items));
				});
			}
			else{
				res.write("failure");
				res.end();
			}
			db.close();
			});
		});
	}else{
        res.end("failure");
	}
}

function get_single_event_images(req, res){
	res.writeHead(200, {"Content-Type": "text", 'Access-Control-Allow-Origin': '*'});
	if(req.method == "POST"){
		req.on('data', function(data){
			data = JSON.parse(data);
			mongo.connect(uri_db, function(err, db){
			if(!err){
				var cond = {
					"event_name" : "" + data['event_name']
				};
				db.collection('event_images').find(cond).toArray(function(err, items) {
					res.end(JSON.stringify(items));
				});
			}
			else{
				res.write("failure");
				res.end();
			}
			db.close();
			});
		});
	}else{
        res.end("failure");
	}
}

function get_important_events(req, res){
	res.writeHead(200, {"Content-Type": "text", 'Access-Control-Allow-Origin': '*'});
	if(req.method == "POST"){
		req.on('data', function(data){
			mongo.connect(uri_db, function(err, db){
			if(!err){
				db.collection('important_events').find().toArray(function(err, items) {
					res.end(JSON.stringify(items));
				});
			}
			else{
				res.write("failure");
				res.end();
			}
			db.close();
			});
		});
	}else{
        res.end("failure");
	}
}

function get_events_tab_contents(req, res){
	res.writeHead(200, {"Content-Type": "text", 'Access-Control-Allow-Origin': '*'});
	if(req.method == "POST"){
		req.on('data', function(data){
			mongo.connect(uri_db, function(err, db){
			if(!err){
				db.collection('events').find().sort({"date_of_event":-1, "time_of_event":-1}).limit(3).toArray(function(err, items) {
					res.end(JSON.stringify(items));
				});
			}
			else{
				res.write("failure");
				res.end();
			}
			db.close();
			});
		});
	}else{
        res.end("failure");
	}
}

function get_post_count(req, res){
	res.writeHead(200, {"Content-Type": "text", 'Access-Control-Allow-Origin': '*'});
	if(req.method == "POST"){
		req.on('data', function(data){
			mongo.connect(uri_db, function(err, db){
			if(!err){
				db.collection('posts').count(function(err, count) {
					res.end(JSON.stringify(count));
				});
			}
			else{
				res.write("failure");
				res.end();
			}
			db.close();
			});
		});
	}else{
        res.end("failure");
	}
}
 function get_all_post_details(req, res){
 	res.writeHead(200, {"Content-Type": "text", 'Access-Control-Allow-Origin': '*'});
	if(req.method == "POST"){
		req.on('data', function(data){
			mongo.connect(uri_db, function(err, db){
			if(!err){
				db.collection('approved_posts').find().sort({"date_of_post":-1, "time_of_post":-1}).toArray(function(err, items) {
					res.end(JSON.stringify(items));
				});
			}
			else{
				res.write("failure");
				res.end();
			}
			db.close();
			});
		});
	}else{
        res.end("failure");
	}
 }

 function get_notifications(req,res){
 	res.writeHead(200, {"Content-Type": "text", 'Access-Control-Allow-Origin': '*'});
	if(req.method == "POST"){
		req.on('data', function(data){
			console.log("hi");
			mongo.connect(uri_db, function(err, db){
			if(!err){
				db.collection('notifications').find().sort({"date_of_post":-1, "time_of_post":-1}).toArray(function(err, items) {
					console.log("%j",items);
					res.end(JSON.stringify(items));
				});
			}
			else{
				res.write("failure");
				res.end();
			}
			db.close();
			});
		});
	}else{
        res.end("failure");
	}
 }