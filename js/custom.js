var initial_document_size;
var register_type = 0;

var password_condition = 2;
var roll_no_condition = 0;
var a_l_type_val = 0;
var w_i_count = 0;
var area_of_interest_count = 0;
var projects_done_count = 0;
var site_for_yourself_count = 0;
var connections_count = 0;
var current_year = 2018;

var profile_pic_url = "images/default_account_pic.jpg";
var profile_pic_public_id = "images/default_account_pic.jpg";
var profile_pic_height = "";
var profile_pic_width = "";
var profile_pic_min_dimen = "";

var loaded_gallery_home = "";
var min_year = 99999;
var max_year = 0;
var cur_year = 99999;

var current_page_no = 1;
var colors_badge = ["purple", "red", "blue", "amber"];

var old_profile = "";

var autocomplete_extra_data = {
	autocomplete-extra-data-string
}


function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function gen_default_account_circle(){
	$('#account_dynamic_div').html(
		" <ul id=\"account_circle\" class=\"dropdown-content\"><li><a href=\"/sign_in\" class=\"theme-text-dark-primary\">Sign up</a></li><li><a href=\"/sign_in\" class=\"theme-text-dark-primary\">Login</a></li></ul><ul class=\"right\"><li><a href=\"#!\" class=\"dropdown-button\" data-activates=\"account_circle\"><i class=\"material-icons\">account_circle</i></a></li></ul> "
	);

	$('.dropdown-button').dropdown({
      inDuration: 300,
      outDuration: 225,
      constrainWidth: true, // Does not change width of dropdown to that of the activator
      hover: true, // Activate on hover
      gutter: -20, // Spacing from edge
      belowOrigin: true // Displays dropdown below the button
    });
}

function gen_user_account_circle(cshub_user_email_id, cshub_user_password){
	/* add profile pic from server */
	var in_data = {
  					'user_email_id' : getCookie("cshub_user_email_id")
  				};
	$.post("/get_profile_pic", JSON.stringify(in_data), function(img_src){
		$('#account_dynamic_div').html(
			" <ul id=\"user_circle\" class=\"dropdown-content\"><li><a href=\"/editprofile\" class=\"theme-text-dark-primary\">Edit profile</a></li><li><a href=\"/newpost\" class=\"theme-text-dark-primary\">New post</a></li><li><a href=\"/manage\" class=\"theme-text-dark-primary\">Manage</a></li><li><a class=\"theme-text-dark-primary\" onclick=\"show_notifications()\">Notifications</a></li><li><a href=\"#!\" class=\"theme-text-dark-primary\" onclick=\"logout_user()\">Log out</a></li></ul><ul class=\"right\"><li><a href=\"#!\" class=\"dropdown-button\" data-activates=\"user_circle\"><img class=\"responsive-img z-depth-6 circle\" src=\"" + img_src + "\" style=\"height: 30px; width: 30px;   margin-top: 17px\"></a></li></ul> "
		);

		$('.dropdown-button').dropdown({
      		inDuration: 300,
      		outDuration: 225,
	  		constrainWidth: false, // Does not change width of dropdown to that of the activator
    	  	hover: true, // Activate on hover
	      	gutter: -20, // Spacing from edge
    	  	belowOrigin: true // Displays dropdown below the button
	    });
	});
}

function logout_user(){
	var cshub_user_email_id = getCookie("cshub_user_email_id");
  	var cshub_user_password = getCookie("cshub_user_password");
	setCookie("cshub_user_email_id", cshub_user_email_id, -1);
	setCookie("cshub_user_password", cshub_user_password, -1);
	location.reload();
}

function intial_validate(){
  var cshub_user_email_id = getCookie("cshub_user_email_id");
    var cshub_user_password = getCookie("cshub_user_password");
    if(cshub_user_email_id == "" || cshub_user_password == ""){
      gen_default_account_circle();
      if($(location).attr('pathname') == "/editprofile" || $(location).attr('pathname') == "/editprofile#" || $(location).attr('pathname') == "/editprofile#!"){
        fill_editprofile_page_unlogged();
      }
    }else{
      $.post("/checkdb", "hi", function(dbstatus){
        if(dbstatus == "success"){
          var in_data = {
            'user_email_id' : cshub_user_email_id,
            'user_password' : cshub_user_password
          };
        $.post("/validate_login", JSON.stringify(in_data), function(out_data){
          if(out_data == "success"){
            /* if sign_in page load the home page */
            if($(location).attr('pathname') == "/sign_in" || $(location).attr('pathname') == "/sign_in#" || $(location).attr('pathname') == "/sign_in#!"){
              location.href = "/";
            }else{
              gen_user_account_circle(cshub_user_email_id, cshub_user_password);
            }
          }else{
            gen_default_account_circle();
            if($(location).attr('pathname') == "/editprofile" || $(location).attr('pathname') == "/editprofile#" || $(location).attr('pathname') == "/editprofile#!"){
              fill_editprofile_page_unlogged();
            }
          }
        });
          }else{
            var $toastContent = $('<span>Data base is not connected. Please refresh</span>');
            Materialize.toast($toastContent, 3000, 'rounded');
          }
      });
    }
}

function show_notifications(){
  $.post("/get_notifications", "hi", function(items){
    if(items == "failure"){
      var $toastContent = $('<span>Couldn\'t fetch notifications. Try again</span>');
      Materialize.toast($toastContent, 3000, 'rounded');    
      }else{
        items = JSON.parse(items);
        var notifications_div_body = "<table class=\"bordered\"><tbody>";
        var notifications_small_div_body = "<table class=\"bordered\"><tbody>";
        var updates_div_body = "<table class=\"bordered\"><tbody>";

        for(i=0;i<items.length;i++){
          notifications_small_div_body += "<tr><td><span>" + items[i]['text'] + "</span></td></tr>";
          if(items[i]['type'] == "notification")
            notifications_div_body += "<tr><td><span>" + items[i]['text'] + "</span></td></tr>";
          else if(items[i]['type'] == "update")
            updates_div_body += "<tr><td><span>" + items[i]['text'] + "</span></td></tr>";
        }

        notifications_div_body += "</tbody></table>";
        notifications_small_div_body += "</tbody></table>";
        updates_div_body += "</tbody></table>";
        $('#notifications_small_div').html(notifications_small_div_body);
        $('#notifications_div').html(notifications_div_body);
        $('#updates_div').html(updates_div_body);
        $('#notifications_modal').modal('open');
      }
  });

}

(function($){
  $(function(){

    /* validate the email ind password from server and redirect accordingly */
    intial_validate();

    //index page
    if($(location).attr('pathname') == "/" || $(location).attr('pathname') == "/#" || $(location).attr('pathname') == "/#!"
      || $(location).attr('pathname') == "/index.html" || $(location).attr('pathname') == "/index.html#" || $(location).attr('pathname') == "/index.html#!"){
      fill_events_tab();
      fill_index_page_bottom(current_page_no);
      fill_posts_section(current_page_no);
    }

    //edit profile page
    if($(location).attr('pathname') == "/editprofile" || $(location).attr('pathname') == "/editprofile#" || $(location).attr('pathname') == "/editprofile#!"){
      fill_editprofile_page();
    }

    //gallery page
    if($(location).attr('pathname') == "/gallery" || $(location).attr('pathname') == "/gallery#" || $(location).attr('pathname') == "/galley#!"){
      fill_gallery_page();
    }

    //opportunities page
    if($(location).attr('pathname') == "/opportunities" || $(location).attr('pathname') == "/opportunities#" || $(location).attr('pathname') == "/opportunities#!"){
      fill_opportunities_page();
    }                                                  

    //cntacts page specs
    if($(location).attr('pathname') == "/contacts" || $(location).attr('pathname') == "/contacts#" || $(location).attr('pathname') == "/contacts#!"){
      fill_contacts_page();
    }

    //profile page specs
  	if($(location).attr('pathname') == "/profile" || $(location).attr('pathname') == "/profile#" || $(location).attr('pathname') == "/profile#!"){
  		fill_profile_page();
  	}


  	$(".preloader").fadeOut("slow");;
  	$('#main-content').css('visibility', "visible");

  	$('input.autocomplete').autocomplete({
  		data: {
  		dynamic-fill-autocomplete-data
			},
			limit: 5, // The max amount of results that can be shown at once. Default: Infinity.
			onAutocomplete: function(val) {
  				//set global cokkie and redirest to profile page
  				setCookie("view-user-profile", autocomplete_extra_data[val], 365);
  				location.href = "/profile";
			},
    	minLength: 1, // The minimum length of the input for the autocomplete to start. Default: 1.
  	});

  	$('.button-collapse1').sideNav({
  		closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
        	draggable: true, // Choose whether you can drag to open on touch screens,
  	});
  	$('.button-collapse2').sideNav({
  		menuWidth: $(window).width()/1.7, // Default is 300
        	edge: 'left', // Choose the horizontal origin
        	closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
        	draggable: true, // Choose whether you can drag to open on touch screens,
        	onOpen: function(el) {}, // A function to be called when sideNav is opened
        	onClose: function(el) {}, // A function to be called when sideNav is closed
  	});

  	$('.dropdown-button').dropdown({
        inDuration: 300,
        outDuration: 225,
        constrainWidth: true, // Does not change width of dropdown to that of the activator
        hover: true, // Activate on hover
        gutter: -20, // Spacing from edge
        belowOrigin: true // Displays dropdown below the button
      });

  	$('select').material_select();

  	$('.modal').modal();

    //notification modal  
    $('#notifications_modal').modal({
        dismissible: true, // Modal can be dismissed by clicking outside of the modal
        opacity: .5, // Opacity of modal background
        inDuration: 300, // Transition in duration
        outDuration: 200, // Transition out duration
        endingTop: '10%', // Ending top style attribute
        startingTop: '10%', // Starting top style attribute
        ready: function(modal, trigger) { // Callback for Modal open. Modal and trigger parameters available.
        },
        complete: function() {} // Callback for Modal close
      }
    );
        
    //tabs
    $('ul.tabs').tabs();

    $('.scrollspy').scrollSpy();

    $('.collapsible').collapsible();

  $(document).on('click.card', '.card', function (e) {
      if ($(this).find('> .card-reveal').length) {
        if ($(e.target).is($('.card-reveal .card-title')) || $(e.target).is($('.card-reveal .card-title i')) || $(e.target).is($('.card-reveal i'))) {
          // Make Reveal animate down and display none
          $(this).find('.card-reveal').velocity(
            {translateY: 0}, {
              duration: 225,
              queue: false,
              easing: 'easeInOutQuad',
              complete: function() { $(this).css({ display: 'none'}); }
            }
          );
            $(this).velocity({height:$(this).data('height')},{duration:225});
        }
        else if ($(e.target).is($('.card .activator')) ||
                 $(e.target).is($('.card .activator i')) ) {
          $(e.target).closest('.card').css('overflow', 'hidden');
          $(this).data('height',$(this).css('height')).find('.card-reveal').css({ display: 'block',height:'auto'}).velocity("stop", false).velocity({translateY: '-100%'}, {duration: 300, queue: false, easing: 'easeInOutQuad'});
              $(this).velocity({height:$(this).find('.card-reveal').height()+40},{duration:300});
        }
      }
      $('.card-reveal').closest('.card').css('overflow', 'hidden');
    });

    //minus footer sizes when footer is done
    $('#main-nav-colbar').css('height', $(window).height() - $('nav').height());
    $('#main-nav-colbar').css('padding',"0px");

    $('#main-nav-icon').css('margin-top', ($(window).height() - $('nav').height()) / 2.2);

    initial_document_size = $(document).height();

    //cloudinary

	$.cloudinary.config({ cloud_name: 'cshub-resources'});

	$.cloudinary.config({ upload_preset: 'cshub-resource-unsigned'});	

    $("input.cloudinary-fileupload[type=file]").cloudinary_fileupload();

  	$('.cloudinary-fileupload').bind('cloudinarydone', function(e, data) {  
    	alert(data.result.url);    
    	return true;
    });

  });
})(jQuery);

$(window).resize(function(){
    $('#main-nav-colbar').css('height', $(window).height() - $('nav').height());
    $('#main-nav-colbar').css('padding',"0px");

    $('.button-collapse1').sideNav({
    	closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
      	draggable: true, // Choose whether you can drag to open on touch screens,
    });
	$('.button-collapse2').sideNav({
		menuWidth: $(window).width()/1.7, // Default is 300
      	edge: 'left', // Choose the horizontal origin
      	closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
      	draggable: true, // Choose whether you can drag to open on touch screens,
      	onOpen: function(el) {}, // A function to be called when sideNav is opened
      	onClose: function(el) {}, // A function to be called when sideNav is closed
	});

	$('select').material_select();
	$('.modal').modal();
  $('.scrollspy').scrollSpy();
  $('.collapsible').collapsible();

    $('#main-nav-icon').css('margin-top', ($(window).height() - $('nav').height()) / 2.2);

});

$(window).scroll(function() {
	if((initial_document_size - ($(window).height()/1.4))  > ((($(window).height() - $('nav').height()) / 2.5) + $(window).scrollTop())){
		$('#main-nav-colbar').css('height', $(window).height() - $('nav').height() + $(window).scrollTop());
    	$('#main-nav-colbar').css('padding',"0px");

    	$('#main-nav-icon').css('margin-top', (($(window).height() - $('nav').height()) / 2.5) + $(window).scrollTop());
	}
});

$('#t_s_type').on('change', function() {

	password_condition = 2;
	roll_no_condition = 0;
	a_l_type_val = 0;
	w_i_count = 0;
	area_of_interest_count = 0;
	projects_done_count = 0;
	site_for_yourself_count = 0;
	connections_count = 0;

  	register_type = this.value;
  	if(register_type == 1){
  		$('#register_details').html(
  			" <nav class=\"z-depth-1 theme-color-dark-primary center\"><div class=\"nav-wrapper\"><div class=\"container\"><span class=\"theme-text-light-primary\">Student Section</span></div></div></nav><div class=\"col s12\"><nav class=\"theme-color-light-primary z-depth-0\"><span class=\"theme-text-dark-primary\">Login Details</span></nav></div><div class=\"input-field col s12\"><input id=\"student_email\" type=\"email\" class=\"validate\"><label for=\"student_email\">Email address</label></div><div class=\"input-field col s12\"><input id=\"student_password\" type=\"password\"><label for=\"student_password\">New Password</label></div><div class=\"input-field col s12\"><input id=\"student_re_password\" type=\"password\" onblur=\"validate_password()\"><label for=\"student_re_password\">Retype password</label></div><div id=\"password_error_message\" class=\"col s12\"></div><div class=\"col s12\"><nav class=\"theme-color-light-primary z-depth-0\"><span class=\"theme-text-dark-primary\">Personal details</span></nav></div><div class=\"input-field col s12\"><input id=\"student_name\"type=\"text\"><label for=\"student_name\">Name</label></div><div class=\"input-field col s12\"><input id=\"student_roll_no\" type=\"text\" onblur=\"validate_roll_no()\"><label for=\"student_roll_no\">Roll number (optional)</label></div><div id=\"roll_no_error_message\" class=\"col s12\"></div><div class=\"col s12\"><span class=\"theme-text-dark-primary\">Profile picture (square pics are better)</span><br><span style=\"color: #d1d1d1;\">Image preview</span><div class=\"row valign-center\"><div class=\"col s6\"><div class=\"card theme-color-light-primary z-depth-0\"><div class=\"card-content\"><img id=\"square_profile_pic_preview\" class=\"materialboxed responsive-img\" width=\"300px\" height=\"300px\" src=\"images/cshublogo.png\"></div></div></div><div class=\"col s4 offset-s1\"><div class=\"card theme-color-light-primary z-depth-0 valign-center\"><div class=\"card-content\"><img id=\"circle_profile_pic_preview\" class=\"materialboxed responsive-img circle\" width=\"100px\" height=\"100px\" src=\"images/cshublogo.png\"> </div></div></div></div><form action=\"#\"><div class=\"file-field input-field\"><div class=\"col s12 z-depth-0 waves-effect waves-theme-color-light-primary btn theme-color-dark-primary theme-text-light-primary\"><span>UPLOAD</span><input id=\"profile_pic\" name=\"file\" type=\"file\" class=\"cloudinary-fileupload\" data-cloudinary-field=\"image_id\" data-form-data=\"{ &quot;upload_preset&quot;:  &quot;cshub-resource-unsigned&quot;, &quot;callback&quot;: &quot;https://cs-hub-site-nvpcewwyjt.now.sh/cloudinary_cors.html&quot;}\"></input><br></div></div></form></div><div class=\"input-field col s12\"><select id=\"a_l_type\"><option value=\"99\" disabled selected>Choose</option><option value=\"1\">Alumnus</option><option value=\"2\">Current</option></select><label>Alumnus or Current</label></div><div id=\"inner_personal_details\"></div><div class=\"col s12\"><nav class=\"theme-color-light-primary z-depth-0\"><span class=\"theme-text-dark-primary\">Additional details</span></nav></div><div><span class=\"theme-text-dark-primary\">Work/Intern experience</span><a onclick=\"add_work_intern_field()\" class=\"right z-depth-0 waves-effect waves-theme-color-dark-primary btn theme-color-light-primary theme-text-dark-primary\"><i class=\"material-icons theme-text-dark-primary\">add</i></a><div id=\"work_intern_details\"><br></div></div><div><span class=\"theme-text-dark-primary\">Areas of Interest</span><a onclick=\"add_area_of_interest_field()\" class=\"right z-depth-0 waves-effect waves-theme-color-dark-primary btn theme-color-light-primary theme-text-dark-primary\"><i class=\"material-icons theme-text-dark-primary\">add</i></a><div id=\"area_of_interest_details\"><br></div></div><div><span class=\"theme-text-dark-primary\">Projects done</span><a onclick=\"add_projects_done_field()\" class=\"right z-depth-0 waves-effect waves-theme-color-dark-primary btn theme-color-light-primary theme-text-dark-primary\"><i class=\"material-icons theme-text-dark-primary\">add</i></a><div id=\"projects_done_details\"><br></div></div><div><span class=\"theme-text-dark-primary\">Site for yourself</span><a onclick=\"add_site_for_yourself_field()\" class=\"right z-depth-0 waves-effect waves-theme-color-dark-primary btn theme-color-light-primary theme-text-dark-primary\"><i class=\"material-icons theme-text-dark-primary\">add</i></a><div id=\"own_site_details\"><br> </div></div><div><span class=\"theme-text-dark-primary\">Connections</span><a onclick=\"add_connections_field()\" class=\"right z-depth-0 waves-effect waves-theme-color-dark-primary btn theme-color-light-primary theme-text-dark-primary\"><i class=\"material-icons theme-text-dark-primary\">add</i></a><div id=\"Connections_details\"><br></div></div><div class=\"input-field col s12\"><input id=\"about_yourself\" type=\"text\"><label for=\"about_yourself\">About youself</label><div id=\"register_errors\"></div></div><div class=\"col s10 offset-s1\"><div class=\"center\"><br><a href=\"#!\" class=\"z-depth-1 waves-effect waves-theme-color-light-primary btn theme-text-light-primary theme-color-dark-primary\" onclick=\"validate_register()\">Register</a><br><br></div></div> "
  			);
  	}
  	else if(register_type == 2){
  		var options_years = "";
		options_years = options_years + "<option value=\"99\" disabled selected>Choose</option>";
		for(i=1950;i<current_year;i++){
			options_years = options_years + "<option value=\"" + i + "\">" + i + "</option>";
		}

  		$('#register_details').html(
  			" <nav class=\"z-depth-1 theme-color-dark-primary center\"><div class=\"nav-wrapper\"><div class=\"container\"><span class=\"theme-text-light-primary\">Teacher Section</span></div></div></nav><div class=\"col s12\"><nav class=\"theme-color-light-primary z-depth-0\"><span class=\"theme-text-dark-primary\">Login Details</span></nav></div><div class=\"input-field col s12\"><input id=\"teacher_email\" type=\"email\" class=\"validate\"><label for=\"teacher_email\">Email address</label></div><div class=\"input-field col s12\"><input id=\"teacher_password\" type=\"password\"><label for=\"teacher_password\">New Password</label></div><div class=\"input-field col s12\"><input id=\"teacher_re_password\" type=\"password\" onblur=\"teacher_validate_password()\"><label for=\"teacher_re_password\">Retype password</label></div><div id=\"password_error_message\" class=\"col s12\"></div><div class=\"col s12\"><nav class=\"theme-color-light-primary z-depth-0\"><span class=\"theme-text-dark-primary\">Personal details</span></nav></div><div class=\"input-field col s12\"><input id=\"teacher_name\" type=\"text\"><label for=\"teacher_name\">Name</label></div><div class=\"col s12\"><span class=\"theme-text-dark-primary\">Profile picture (square pics are better)</span><br><span style=\"color: #d1d1d1;\">Image preview</span><div class=\"row valign-center\"><div class=\"col s6\"><div class=\"card theme-color-light-primary z-depth-0\"><div class=\"card-content\"><img id=\"square_profile_pic_preview\" class=\"materialboxed responsive-img\" width=\"300px\" height=\"300px\" src=\"images/cshublogo.png\"> </div></div></div><div class=\"col s4 offset-s1\"><div class=\"card theme-color-light-primary z-depth-0 valign-center\"><div class=\"card-content\"><img id=\"circle_profile_pic_preview\" class=\"materialboxed responsive-img circle\" width=\"100px\" height=\"100px\" src=\"images/cshublogo.png\"> </div></div></div></div><form action=\"#\"><div class=\"file-field input-field\"><div class=\"col s12 z-depth-0 waves-effect waves-theme-color-light-primary btn theme-color-dark-primary theme-text-light-primary\"><span>UPLOAD</span><input id=\"teacher_profile_pic\" name=\"file\" type=\"file\" class=\"cloudinary-fileupload\" data-cloudinary-field=\"image_id\" data-form-data=\"{ &quot;upload_preset&quot;:  &quot;cshub-resource-unsigned&quot;, &quot;callback&quot;: &quot;https://cs-hub-site-nvpcewwyjt.now.sh/cloudinary_cors.html&quot;}\"></input><br></div></div></form></div><div id=\"inner_personal_details\"><div class=\"input-field col s6\"><select id=\"teacher_starting_year\">" + options_years + "</select><label>Starting year</label></div><div class=\"input-field col s6\"><select id=\"teacher_ending_year\">" + options_years + "<option value=\"Current\" selected>Current</option></select><label>Ending year</label></div><div class=\"input-field col s12\"><input id=\"teacher_degrees\" type=\"text\"><label for=\"teacher_degrees\">Degrees</label></div><div class=\"input-field col s12\"><input id=\"teacher_designation\" type=\"text\"><label for=\"teacher_designation\">Designation</label></div></div><div class=\"col s12\"><nav class=\"theme-color-light-primary z-depth-0\"><span class=\"theme-text-dark-primary\">Additional details</span></nav></div><div><span class=\"theme-text-dark-primary\">Areas of Interest</span><a onclick=\"add_teacher_area_of_interest_field()\" class=\"right z-depth-0 waves-effect waves-theme-color-dark-primary btn theme-color-light-primary theme-text-dark-primary\"><i class=\"material-icons theme-text-dark-primary\">add</i></a><div id=\"area_of_interest_details\"><br></div></div><div><span class=\"theme-text-dark-primary\">Projects done</span><a onclick=\"add_teacher_projects_done_field()\" class=\"right z-depth-0 waves-effect waves-theme-color-dark-primary btn theme-color-light-primary theme-text-dark-primary\"><i class=\"material-icons theme-text-dark-primary\">add</i></a><div id=\"projects_done_details\"><br></div></div><div><span class=\"theme-text-dark-primary\">Site for yourself</span><a onclick=\"add_teacher_site_for_yourself_field()\" class=\"right z-depth-0 waves-effect waves-theme-color-dark-primary btn theme-color-light-primary theme-text-dark-primary\"><i class=\"material-icons theme-text-dark-primary\">add</i></a><div id=\"own_site_details\"><br></div></div><div><span class=\"theme-text-dark-primary\">Connections</span><a onclick=\"add_teacher_connections_field()\" class=\"right z-depth-0 waves-effect waves-theme-color-dark-primary btn theme-color-light-primary theme-text-dark-primary\"><i class=\"material-icons theme-text-dark-primary\">add</i></a><div id=\"Connections_details\"><br></div></div><div class=\"input-field col s12\"><input id=\"teacher_about_yourself\" type=\"text\"><label for=\"teacher_about_yourself\">About youself</label></div><div id=\"register_errors\"></div><div class=\"col s10 offset-s1\"><div class=\"center\"><br><a href=\"#!\" class=\"z-depth-1 waves-effect waves-theme-color-light-primary btn theme-text-light-primary theme-color-dark-primary\" onclick=\"validate_register()\">Register</a><br><br></div></div> "
  			);
  	}

  	$('#square_profile_pic_preview').attr('src', profile_pic_url);
 	$('#circle_profile_pic_preview').attr('src', profile_pic_url);

  	$('select').material_select();

	$("input.cloudinary-fileupload[type=file]").cloudinary_fileupload();

  	$('#a_l_type').on('change', function() {
		a_l_type_val = this.value;

		var options_years = "";
		options_years = options_years + "<option value=\"99\" disabled selected>Choose</option>";
		for(i=1950;i<current_year;i++){
			options_years = options_years + "<option value=\"" + i + "\">" + i + "</option>";
		}

		if(a_l_type_val == 1){
			$('#inner_personal_details').html(
				"<div id=\"course\" class=\"input-field col s12\"><select id=\"course_type\"><option value=\"99\" disabled selected>Choose</option><option value=\"1\">Bachelors</option><option value=\"2\">Masters</option><option value=\"3\">Others</option></select><label>Course</label></div><div class=\"input-field col s6\"><select id=\"starting_year\">" + options_years + "</select><label>Starting year</label></div><div class=\"input-field col s6\"><select id=\"ending_year\">" + options_years + "</select><label>Ending year</label></div><div class=\"input-field col s12\"><input id=\"current_location\" type=\"text\"><label for=\"current_location\">Current location</label></div><div class=\"input-field col s12\"><input id=\"current_company\" type=\"text\"><label for=\"current_company\">Currently doing(eg. work at x, highers at y)</label></div> "
				);

		}else if(a_l_type_val == 2){
			$('#inner_personal_details').html(
				" <div id=\"course\" class=\"input-field col s12\"><select id=\"course_type\"><option value=\"99\" disabled selected>Choose</option><option value=\"1\">Bachelors</option><option value=\"2\">Masters</option><option value=\"3\">Others</option></select><label>Course</label></div><div class=\"input-field col s6\"><select id=\"starting_year\">" + options_years + "</select><label>Starting year</label></div><div class=\"input-field col s6 disabled\"><select id=\"ending_year\"><option value=\"current\" disabled selected>Current</option></select><label>Currrent</label></div> "
				);
		}

		$('select').material_select();

 })

 $('#profile_pic').on('change', function(){
 	$('.cloudinary-fileupload').bind('cloudinarydone', function(e, data) {  
		//alert(data.result.url);
		profile_pic_height = data.result.height;
		profile_pic_width = data.result.width;
		if(profile_pic_width <= profile_pic_height)
			profile_pic_min_dimen = profile_pic_width;
		else	profile_pic_min_dimen = profile_pic_height;

		var modified_url = "https://res.cloudinary.com/cshub-resources/image/upload/c_crop,g_face:center,w_" + profile_pic_min_dimen + ",h_" + profile_pic_min_dimen + "/v" +data.result.version + "/" + data.result.public_id;

		$('#square_profile_pic_preview').attr('src', modified_url);
 		$('#circle_profile_pic_preview').attr('src', modified_url);

 		profile_pic_url = modified_url;
 		profile_pic_public_id = data.result.public_id;

		return true;
	});
 })

  $('#teacher_profile_pic').on('change', function(){
 	$('.cloudinary-fileupload').bind('cloudinarydone', function(e, data) {  
		//alert(data.result.url);    
		profile_pic_height = data.result.height;
		profile_pic_width = data.result.width;
		if(profile_pic_width <= profile_pic_height)
			profile_pic_min_dimen = profile_pic_width;
		else	profile_pic_min_dimen = profile_pic_height;

		var modified_url = "https://res.cloudinary.com/cshub-resources/image/upload/c_crop,g_face:center,w_" + profile_pic_min_dimen + ",h_" + profile_pic_min_dimen + "/v" +data.result.version + "/" + data.result.public_id;

		$('#square_profile_pic_preview').attr('src', modified_url);
 		$('#circle_profile_pic_preview').attr('src', modified_url);

 		profile_pic_url = modified_url;
 		profile_pic_public_id = data.result.public_id;

		return true;
	});
 })

})

function add_work_intern_field(){
  	w_i_count++;
	var inner_details = "<ul><li><div class=\"input-field col s2\"><select id=\"work_intern_drop[" + w_i_count + "]\"><option value=\"99\" disabled selected>Choose</option><option value=\"Intern\">Intern</option><option value=\"Work\">Work</option></select><label>Type</label></div></li><li><div class=\"input-field col s10\"><input id=\"work_intern_text[" + w_i_count + "]\" type=\"text\"><label for=\"work_intern_text[" + w_i_count + "]\">Where</label></div></li></ul>";

  	$('#work_intern_details').append(
  		inner_details
  		);

	$('select').material_select();  	
  }

function add_area_of_interest_field(){
  	area_of_interest_count++;
	var inner_details = " <div class=\"input-field col s12\"><input id=\"area_of_interest_text[" + area_of_interest_count + "]\" type=\"text\"><label for=\"area_of_interest_text[" + area_of_interest_count + "]\">Domain name</label></div> ";

  	$('#area_of_interest_details').append(
  		inner_details
  		);

	$('select').material_select();  	
  }

function add_teacher_area_of_interest_field(){
  	area_of_interest_count++;
	var inner_details = " <div class=\"input-field col s12\"><input id=\"area_of_interest_text[" + area_of_interest_count + "]\" type=\"text\"><label for=\"area_of_interest_text[" + area_of_interest_count + "]\">Domain name</label></div> ";

  	$('#area_of_interest_details').append(
  		inner_details
  		);

	$('select').material_select();  	
  }

function add_projects_done_field(){
	projects_done_count++;
	var inner_details = " <div class=\"input-field col s12\"><input id=\"projects_done_text[" + projects_done_count + "]\" type=\"text\"><label for=\"projects_done_text[" + projects_done_count + "]\">Name</label></div> ";

  	$('#projects_done_details').append(
  		inner_details
  		);

	$('select').material_select();  	
  }

function add_teacher_projects_done_field(){
	projects_done_count++;
	var inner_details = " <div class=\"input-field col s12\"><input id=\"projects_done_domain_text[" + projects_done_count + "]\" type=\"text\"><label for=\"projects_done_domain_text[" + projects_done_count + "]\">Domain</label></div><div class=\"input-field col s12\"><input id=\"projects_done_text[" + projects_done_count + "]\" type=\"text\"><label for=\"projects_done_text[" + projects_done_count + "]\">Name</label></div> ";

  	$('#projects_done_details').append(
  		inner_details
  		);

	$('select').material_select();  	
  }

function add_site_for_yourself_field(){
  	site_for_yourself_count++;
	var inner_details = "<div class=\"input-field col s12\"><input id=\"own_site_text[" + site_for_yourself_count + "]\" type=\"text\"><label for=\"own_site_text[" + site_for_yourself_count + "]\">Site url</label></div> ";
 
  	$('#own_site_details').append(
  		inner_details
  		);

	$('select').material_select();  	
  }

function add_teacher_site_for_yourself_field(){
  	site_for_yourself_count++;
	var inner_details = "<div class=\"input-field col s12\"><input id=\"own_site_text[" + site_for_yourself_count + "]\" type=\"text\"><label for=\"own_site_text[" + site_for_yourself_count + "]\">Site url</label></div> ";

  	$('#own_site_details').append(
  		inner_details
  		);

	$('select').material_select();  	
  }

function add_connections_field(){
  	connections_count++;
	var inner_details = " <ul><li><div class=\"input-field col s2\"><select id=\"Connections_drop[" + connections_count + "]\"><option value=\"99\" disabled selected>Choose</option><option value=\"Facebook\">Facebook</option><option value=\"Linkedin\">Linkedin</option><option value=\"Twitter\">Twitter</option><option value=\"Github\">Github</option><option value=\"Coding profile\">Coding profile</option></select><label>Type</label></div></li><li><div class=\"input-field col s10\"><input id=\"Connections_text[" + connections_count + "]\" type=\"text\"><label for=\"Connections_text[" + connections_count + "]\">url</label></div></li></ul> ";

  	$('#Connections_details').append(
  		inner_details
  		);

	$('select').material_select();  	
  }

function add_teacher_connections_field(){
  	connections_count++;
	var inner_details = " <ul><li><div class=\"input-field col s2\"><select id=\"Connections_drop[" + connections_count + "]\"><option value=\"99\" disabled selected>Choose</option><option value=\"Facebook\">Facebook</option><option value=\"Linkedin\">Linkedin</option><option value=\"Twitter\">Twitter</option><option value=\"Github\">Github</option><option value=\"Coding prfile\">Coding profile</option></select><label>Type</label></div></li><li><div class=\"input-field col s10\"><input id=\"Connections_text[" + connections_count + "]\" type=\"text\"><label for=\"Connections_text[" + connections_count + "]\">url</label></div></li></ul> ";

  	$('#Connections_details').append(
  		inner_details
  		);

	$('select').material_select();  	
  }


function validate_password(){
	if($('#student_password').val() === $('#student_re_password').val() && $('#student_re_password').val() != ""){
		password_condition = 0;
		$('#password_error_message').html("");
	}else{
		password_condition = 1;
		$('#password_error_message').html("<span>the passwords do not match</span>");
	}
}

function teacher_validate_password(){
	if($('#teacher_password').val() === $('#teacher_re_password').val() && $('#teacher_re_password').val() != ""){
		password_condition = 0;
		$('#password_error_message').html("");
	}else{
		password_condition = 1;
		$('#password_error_message').html("<span>the passwords do not match</span>");
	}
}

function validate_roll_no(){
	if($('#student_roll_no').val().length == 10){
		var flag = 0;
		var roll_no_check = $('#student_roll_no').val();
		for(i=0;i<10;i++){
			if(roll_no_check[i] >= 0 && roll_no_check[i] <= 9){
			}else{
				flag =1;
				break;
			}
		}
		if(flag == 0){
			roll_no_condition = 0;
			$('#roll_no_error_message').html("");
		}else{
			roll_no_condition = 1;
			$('#roll_no_error_message').html("<span>the roll number must contain numbers only</span>");
		}	
	}else if($('#student_roll_no').val().length == 0){
    roll_no_condition = 0;
    $('#roll_no_error_message').html("");
  }
  else{
		roll_no_condition = 1;
		$('#roll_no_error_message').html("<span>invalid roll number format</span>");	
	}
}

function validate_login(){
	var email_id = $('#login_email_id_input').val();
	var password = $('#login_password_input').val();

	if(email_id == "" || password == ""){
		$('#user_msg_text').html("<span>Some fields are left empty</span>");
		$('#user_msg').modal('open');
	}else{
		var data = {
			'user_email_id' : email_id,
			'user_password' : password
		};
		/* send to server */
		$.post("/validate_login", JSON.stringify(data), function(out_data){
			if(out_data == "success"){
				setCookie("cshub_user_email_id", email_id, 365);
  			setCookie("cshub_user_password", password, 365);
				window.location.href = "/";
			}else{
				var $toastContent = $('<span>Login unsuccessful, Check the details.</span>');
  				Materialize.toast($toastContent, 3000, 'rounded');
			}
		});
	}
}

function validate_register(){

    if($('#student_name').val() != "" || $('#teacher_name').val() != ""){
      if(register_type == 0){
        $('#user_msg_text').html("<span>Choose whether teacher or student</span>");
        $('#user_msg').modal('open');
      }
      else if(register_type == 1){
        var in_data = {
            'user_name' : $('#student_name').val(),
            'user_email_id' : $('#student_email').val()
          };
      }else if(register_type == 2){
        var in_data = {
            'user_name' : $('#teacher_name').val(),
            'user_email_id' : $('#teacher_email').val()
          }; 
      }
      $.post("/check_user_name_email_exists",JSON.stringify(in_data),function(out_data){
        if(out_data == "absent"){
          if(register_type == 0){
            $('#user_msg_text').html("<span>Choose whether teacher or student</span>");
            $('#user_msg').modal('open');
          }else if(register_type == 1){   
            if($('#student_email').attr('class') == "validate"){
              $('#user_msg_text').html("<span>Email id not entered</span>");
              $('#user_msg').modal('open');
            }else if($('#student_email').attr('class') == "validate invalid"){
              $('#user_msg_text').html("<span>Email id not valid</span>");
              $('#user_msg').modal('open');
            }else if($('#student_email').attr('class') == "validate valid"){
              /* email valid */
              if(password_condition == 2){
                $('#user_msg_text').html("<span>Password not entered</span>");
                $('#user_msg').modal('open');
              }else if(password_condition == 1){
                $('#user_msg_text').html("<span>the passwords do not match</span>");
                $('#user_msg').modal('open');
              }else if(password_condition == 0){
                /* password checked */
                if(roll_no_condition == 1){
                  $('#user_msg_text').html("<span>roll number is not valid</span>");
                  $('#user_msg').modal('open');
                }else if(roll_no_condition == 0){
                  /* roll number checked */
                  if($('#student_name').val() == ""){
                    $('#user_msg_text').html("<span>name cannot be empty</span>");
                    $('#user_msg').modal('open');
                  }else{
                    if(a_l_type_val == 2){
                      /* current student */ 
                      if($('#course_type').val() == "99" || $('#starting_year').val() == "99"){
                        $('#user_msg_text').html("<span>Some fields in Personal details are empty</span>");
                        $('#user_msg').modal('open');
                      }else{
                        register_user();
                      }
                    }else if(a_l_type_val == 1){
                      /* alumnus */
                      if($('#course_type').val() == "99" || $('#starting_year').val() == "99" || $('#ending_year').val() == "99" || $('#current_location').val() == ""){
                        $('#user_msg_text').html("<span>Some fields in Personal details are empty</span>");
                        $('#user_msg').modal('open');
                      }else{
                        register_user();
                      }
                    }
                    else if (a_l_type_val == 0){
                      $('#user_msg_text').html("<span>Choose Alumnus or student</span>");
                      $('#user_msg').modal('open');
                    }
                  }
                } 
              }
            }
          }else if(register_type == 2){
            if($('#teacher_email').attr('class') == "validate"){
              $('#user_msg_text').html("<span>Email id not entered</span>");
              $('#user_msg').modal('open');
            }else if($('#teacher_email').attr('class') == "validate invalid"){
              $('#user_msg_text').html("<span>Email id not valid</span>");
              $('#user_msg').modal('open');
            }else if($('#teacher_email').attr('class') == "validate valid"){
              /* email valid */
              if(password_condition == 2){
                $('#user_msg_text').html("<span>Password not entered</span>");
                $('#user_msg').modal('open');
              }else if(password_condition == 1){
                $('#user_msg_text').html("<span>the passwords do not match</span>");
                $('#user_msg').modal('open');
              }else if(password_condition == 0){
                /* password checked */
                if($('#teacher_name').val() == ""){
                  $('#user_msg_text').html("<span>name cannot be empty</span>");
                  $('#user_msg').modal('open');
                }else{
                  /* name is checked */
                  if($('#teacher_starting_year').val() == "99" || $('#teacher_ending_year').val() == "99" || $('#teacher_degrees').val() == "" || $('#teacher_designation').val() == ""){
                    $('#user_msg_text').html("<span>Some details in personal details are left empty</span>");
                    $('#user_msg').modal('open');
                  }else{
                    register_user();
                  }
                }
              }
            }
          }
        }else if(out_data == "name_present"){
          $('#user_msg_text').html("<span>As many people can have same name, this name is already associated with another email id. Please enter your name in a different way. Common changes are capitalisation,decapitalisation of letters, entering the full expanded name or nickname.</span>");
          $('#user_msg').modal('open');
        }else if(out_data == "email_id_present"){
          $('#user_msg_text').html("<span>Email id is already registered</span>");
          $('#user_msg').modal('open');
        }
      });
    }else{
      $('#user_msg_text').html("<span>name cannot be empty</span>");
      $('#user_msg').modal('open');
    }

		
		
}

function register_user(){
  var data;
  if(register_type == 1){
    /* student */
    if(a_l_type_val == 1){
      /* alumnus */
      data = {
        'user_email_id' : $('#student_email').val(),
        'user_password' : $('#student_password').val(),
        'user_name' : $('#student_name').val(),
        'roll_number' : $('#student_roll_no').val(),
        'starting_year' : $('#starting_year').val(),
        'ending_year' : $('#ending_year').val(),
        'current_location' : $('#current_location').val(),
        'current_company' : $('#current_company').val(),
        'work_intern_count' : w_i_count,
        'area_of_interest_count' : area_of_interest_count,
        'projects_done_count' : projects_done_count,
        'site_for_yourself_count' : site_for_yourself_count,
        'connections_count' : connections_count,
        'about_yourself' : $('#about_yourself').val()        
      };

      data['register_type'] = "Student";
      data['a_l_type'] = "Alumnus";

      if($('#course_type').val() == 1){
      	data['course_type'] = "Bachelors";
      }else if($('#course_type').val() == 2){
      	data['course_type'] = "Masters";
      }else{
      	data['course_type'] = "Others";
      }

      var work_intern_details = [];
      for(i=0;i<w_i_count;i++){
        var type_var = 'work_intern_drop[' + (i+1) + ']';
        var where_var = 'work_intern_text[' + (i+1) + ']';
        work_intern_details.push({
        	'type' : document.getElementById(type_var).value,
        	'where' : document.getElementById(where_var).value
        });
      }
      data['work_intern_details'] = work_intern_details;

      var area_of_interest_details = [];
      for(i=0;i<area_of_interest_count;i++){
      	var name_var = 'area_of_interest_text['+ (i+1) +']';
      	area_of_interest_details.push({
        	'domain_name' : document.getElementById(name_var).value,
        });
      }
      data['area_of_interest_details'] = area_of_interest_details;

      var projects_done_details = [];
      for(i=0;i<projects_done_count;i++){
      	var name_var = 'projects_done_text['+ (i+1) +']';
      	projects_done_details.push({
        	'name' : document.getElementById(name_var).value,
        });
      }
      data['projects_done_details'] = projects_done_details;

      var own_site_details = [];
      for(i=0;i<site_for_yourself_count;i++){
      	var name_var = 'own_site_text['+ (i+1) +']';
      	own_site_details.push({
        	'url' : document.getElementById(name_var).value,
        });
      }
      data['own_site_details'] = own_site_details;

      var connections_details = [];
      for(i=0;i<connections_count;i++){
        var type_var = 'Connections_drop[' + (i+1) + ']';
        var where_var = 'Connections_text[' + (i+1) + ']';
        connections_details.push({
        	'type' : document.getElementById(type_var).value,
        	'url' : document.getElementById(where_var).value
        });
      }
      data['connections_details'] = connections_details;

      /* add profile pic */
      data['profile_pic_url'] = profile_pic_url;

    }else if(a_l_type_val == 2){
      /* current student */
      data = {
        'user_email_id' : $('#student_email').val(),
        'user_password' : $('#student_password').val(),
        'user_name' : $('#student_name').val(),
        'roll_number' : $('#student_roll_no').val(),
        'starting_year' : $('#starting_year').val(),
        'current_location' : "",
        'current_company' : "",
        'work_intern_count' : w_i_count,
        'area_of_interest_count' : area_of_interest_count,
        'projects_done_count' : projects_done_count,
        'site_for_yourself_count' : site_for_yourself_count,
        'connections_count' : connections_count,
        'about_yourself' : $('#about_yourself').val()        
      };

      data['register_type'] = "Student";
      data['a_l_type'] = "Current";

      if($('#course_type').val() == 1){
      	data['course_type'] = "Bachelors";
        data['ending_year'] = (parseInt(data['starting_year'])+4) + '';
      }else if($('#course_type').val() == 2){
      	data['course_type'] = "Masters";
        data['ending_year'] = (parseInt(data['starting_year'])+4) + '';
      }else{
      	data['course_type'] = "Others";
        data['ending_year'] = "starting batch";
      }

      var work_intern_details = [];
      for(i=0;i<w_i_count;i++){
        var type_var = 'work_intern_drop[' + (i+1) + ']';
        var where_var = 'work_intern_text[' + (i+1) + ']';
        work_intern_details.push({
        	'type' : document.getElementById(type_var).value,
        	'where' : document.getElementById(where_var).value
        });
      }
      data['work_intern_details'] = work_intern_details;

      var area_of_interest_details = [];
      for(i=0;i<area_of_interest_count;i++){
      	var name_var = 'area_of_interest_text['+ (i+1) +']';
      	area_of_interest_details.push({
        	'domain_name' : document.getElementById(name_var).value,
        });
      }
      data['area_of_interest_details'] = area_of_interest_details;

      var projects_done_details = [];
      for(i=0;i<projects_done_count;i++){
      	var name_var = 'projects_done_text['+ (i+1) +']';
      	projects_done_details.push({
        	'name' : document.getElementById(name_var).value,
        });
      }
      data['projects_done_details'] = projects_done_details;

      var own_site_details = [];
      for(i=0;i<site_for_yourself_count;i++){
      	var name_var = 'own_site_text['+ (i+1) +']';
      	own_site_details.push({
        	'url' : document.getElementById(name_var).value,
        });
      }
      data['own_site_details'] = own_site_details;

      var connections_details = [];
      for(i=0;i<connections_count;i++){
        var type_var = 'Connections_drop[' + (i+1) + ']';
        var where_var = 'Connections_text[' + (i+1) + ']';
        connections_details.push({
        	'type' : document.getElementById(type_var).value,
        	'url' : document.getElementById(where_var).value
        });
      }
      data['connections_details'] = connections_details;

      /* add profile pic */
      data['profile_pic_url'] = profile_pic_url;
    }
  }else if(register_type ==2){
    /* teacher */
      data = {
        'user_email_id' : $('#teacher_email').val(),
        'user_password' : $('#teacher_password').val(),
        'user_name' : $('#teacher_name').val(),
        'starting_year' : $('#teacher_starting_year').val(),
        'ending_year' : $('#teacher_ending_year').val(),
        'degrees' : $('#teacher_degrees').val(),
        'designation' : $('#teacher_designation').val(),
        'area_of_interest_count' : area_of_interest_count,
        'projects_done_count' : projects_done_count,
        'site_for_yourself_count' : site_for_yourself_count,
        'connections_count' : connections_count,
        'about_yourself' : $('#teacher_about_yourself').val()        
      };

      data['register_type'] = "Teacher";

      var area_of_interest_details = [];
      for(i=0;i<area_of_interest_count;i++){
      	var name_var = 'area_of_interest_text['+ (i+1) +']';
      	area_of_interest_details.push({
        	'domain_name' : document.getElementById(name_var).value,
        });
      }
      data['area_of_interest_details'] = area_of_interest_details;

      var projects_done_details = [];
      for(i=0;i<projects_done_count;i++){
      	var name_var = 'projects_done_text['+ (i+1) +']';
      	var domain_var = 'projects_done_domain_text['+ (i+1) +']';
      	projects_done_details.push({
      		'domain' : document.getElementById(domain_var).value,
        	'name' : document.getElementById(name_var).value
        });
      }
      data['projects_done_details'] = projects_done_details;

      var own_site_details = [];
      for(i=0;i<site_for_yourself_count;i++){
      	var name_var = 'own_site_text['+ (i+1) +']';
      	own_site_details.push({
        	'url' : document.getElementById(name_var).value,
        });
      }
      data['own_site_details'] = own_site_details;

      var connections_details = [];
      for(i=0;i<connections_count;i++){
        var type_var = 'Connections_drop[' + (i+1) + ']';
        var where_var = 'Connections_text[' + (i+1) + ']';
        connections_details.push({
        	'type' : document.getElementById(type_var).value,
        	'url' : document.getElementById(where_var).value
        });
      }
      data['connections_details'] = connections_details;
      
      /* add teacher_profile_pic */
      data['profile_pic_url'] = profile_pic_url;
  }
  	/* send to server */
  	$.post("/register_user", JSON.stringify(data), function(out_data){
  		if(out_data == "success"){
  			setCookie("cshub_user_email_id", data.user_email_id, 365);
  			setCookie("cshub_user_password", data.user_password, 365);
        if($(location).attr('pathname') == "/sign_in" || $(location).attr('pathname') == "/sign_in#" || $(location).attr('pathname') == "/sign_in#!"){
    			var $toastContent = $('<span>Registration successful</span>');
    			Materialize.toast($toastContent, 3000, 'rounded');
        }else if($(location).attr('pathname') == "/editprofile" || $(location).attr('pathname') == "/editprofile#" || $(location).attr('pathname') == "/editprofile#!"){
          var $toastContent = $('<span>Profile updated successfully</span>');
          Materialize.toast($toastContent, 3000, 'rounded');
        }
  			window.location.href = "/";
  		}else{
  			var $toastContent = $('<span>Something went wrong, try again</span>');
  			Materialize.toast($toastContent, 3000, 'rounded');
  		}
  	});
}

function show_profile(incoming_name) {
  setCookie("view-user-profile", autocomplete_extra_data[incoming_name], 365);
  location.href = "/profile";
}

function fill_opportunities_page(){

  var research_div_body = "";
  var dept_div_body = "";
  var intern_div_body = "";
  var job_div_body = "";

  $.post("/get_reseaarch_project_details", "hi", function(items){
        if(items == "failure"){
          var $toastContent = $('<span>There seems to be some difficulties to fetch from database. Try refreshing.</span>');
          Materialize.toast($toastContent, 3000, 'rounded');
        }else{
          items = JSON.parse(items);
          research_div_body += "<ul class=\"collapsible\" data-collapsible=\"accordion\">";
          for(i=0;i<items.length;i++){
            research_div_body += " <li class=\"col s12\"><div class=\"collapsible-header\"><ul class=\"col s12 m12 l12\"><li>" + items[i]['title_on_card'] + "</li><li><hr class=\"theme-text-dark-primary\">  </li><li><div class=\"chip\">" + items[i]['project_head'] + "</div> ";
            for(j=0;j<items[i]['main_tags'].length;j++){
              if(j==0)
                research_div_body += " <span class=\"new badge blue\" data-badge-caption=\"\">" + items[i]['main_tags'][j] + "</span> ";
              if(j==1)
                research_div_body += " <span class=\"new badge red hide-on-small-only\" data-badge-caption=\"\">" + items[i]['main_tags'][j] + "</span> ";
              if(j>1)
                break;
            }
            research_div_body += " </li></ul></div><div class=\"collapsible-body\"><span>Current State: ";
            if(items[i]['current_state'] == "Active"){
              research_div_body += " <span class=\"green-text darken-4\">Active</span> ";
            }else if(items[i]['current_state'] == "Open"){
              research_div_body += " <span class=\"blue-text darken-4\">Open</span> ";
            }else if(items[i]['current_state'] == "Completed"){
              research_div_body += " <span class=\"red-text darken-4\">Completed</span> ";
            }
            research_div_body += " </span><span class=\"right hide-on-small-only\">Created on " + items[i]['created_date_time'] + "</span><div class=\"card theme-color-dark-primary z-depth-0\"><div class=\"card-content\"><span class=\"card-title theme-text-light-primary\"><span>" + items[i]['title'] + "</span></span><span class=\"theme-text-light-primary\"><p>" + items[i]['description'] + "</p></span></div></div><span class=\"theme-text-black\">Project head </span><a href=\"javascript:show_profile(\'" + items[i]['project_head'] +"\')\"><span class=\"theme-text-dark-primary\">" + items[i]['project_head'] + "</span></a><br><br><span class=\"theme-text-black\">Others working in this project</span><br> ";
            for(j=0;j<items[i]['other_members'].length;j++){
              research_div_body += " <a href=\"javascript:show_profile(\'" + items[i]['other_members'][j] + "\')\"><span class=\"theme-text-black\">" + items[i]['other_members'][j] + "</span></a>&nbsp;&nbsp; ";
            }
            research_div_body += " <br><br><span class=\"theme-text-black\">Core language </span><span class=\"theme-text-dark-primary\">" + items[i]['language'] + "</span><br><br> ";
            if(items[i]['link'] != ""){
              research_div_body += "<span class=\"theme-text-black\">You can follow our work at </span><a href=\"" + items[i]['link'] + "\"><span>github link</span></a><span> or contact us at project head email id for more details.</span><br><br>";
            }
            for(j=0; j<items[i]['other_tags'].length; j++){
              research_div_body += "<div class=\"chip\">" + items[i]['other_tags'][j] + "</div>";
            }
            research_div_body += "</div></li>";
          }
          research_div_body += "</ul>";
          research_div_body += "";
          $('#research_div').html(research_div_body);
        }

        $('.collapsible').collapsible({
        onOpen: function(el) {initial_document_size = $(document).height();}, // Callback for Collapsible open
        onClose: function(el) {initial_document_size = $(document).height();} // Callback for Collapsible close
        });
        $('#main-nav-icon').css('margin-top', ($(window).height() - $('nav').height()) / 2.2);
        initial_document_size = $(document).height();
  });

  $.post("/get_dept_project_details", "hi", function(items){
        if(items == "failure"){
          var $toastContent = $('<span>There seems to be some difficulties to fetch from database. Try refreshing.</span>');
          Materialize.toast($toastContent, 3000, 'rounded');
        }else{
          items = JSON.parse(items);
          dept_div_body += "<ul class=\"collapsible\" data-collapsible=\"accordion\">";
          for(i=0;i<items.length;i++){
            dept_div_body += " <li class=\"col s12\"><div class=\"collapsible-header\"><ul class=\"col s12 m12 l12\"><li>" + items[i]['title_on_card'] + "</li><li><hr class=\"theme-text-dark-primary\">  </li><li><div class=\"chip\">" + items[i]['project_head'] + "</div> ";
            for(j=0;j<items[i]['main_tags'].length;j++){
              if(j==0)
                dept_div_body += " <span class=\"new badge blue\" data-badge-caption=\"\">" + items[i]['main_tags'][j] + "</span> ";
              if(j==1)
                dept_div_body += " <span class=\"new badge red hide-on-small-only\" data-badge-caption=\"\">" + items[i]['main_tags'][j] + "</span> ";
              if(j>1)
                break;
            }
            dept_div_body += " </li></ul></div><div class=\"collapsible-body\"><span>Current State: ";
            if(items[i]['current_state'] == "Active"){
              dept_div_body += " <span class=\"green-text darken-4\">Active</span> ";
            }else if(items[i]['current_state'] == "Open"){
              dept_div_body += " <span class=\"blue-text darken-4\">Open</span> ";
            }else if(items[i]['current_state'] == "Completed"){
              dept_div_body += " <span class=\"red-text darken-4\">Completed</span> ";
            }
            dept_div_body += " </span><span class=\"right hide-on-small-only\">Created on " + items[i]['created_date_time'] + "</span><div class=\"card theme-color-dark-primary z-depth-0\"><div class=\"card-content\"><span class=\"card-title theme-text-light-primary\"><span>" + items[i]['title'] + "</span></span><span class=\"theme-text-light-primary\"><p>" + items[i]['description'] + "</p></span></div></div><span class=\"theme-text-black\">Project head </span><a href=\"javascript:show_profile(\'" + items[i]['project_head'] +"\')\"><span class=\"theme-text-dark-primary\">" + items[i]['project_head'] + "</span></a><br><br><span class=\"theme-text-black\">Others working in this project</span><br> ";
            for(j=0;j<items[i]['other_members'].length;j++){
              dept_div_body += " <a href=\"javascript:show_profile(\'" + items[i]['other_members'][j] + "\')\"><span class=\"theme-text-black\">" + items[i]['other_members'][j] + "</span></a>&nbsp;&nbsp; ";
            }
            dept_div_body += " <br><br><span class=\"theme-text-black\">Core language </span><span class=\"theme-text-dark-primary\">" + items[i]['language'] + "</span><br><br> ";
            if(items[i]['link'] != ""){
              dept_div_body += "<span class=\"theme-text-black\">You can follow our work at </span><a href=\"" + items[i]['link'] + "\"><span>github link</span></a><span> or contact us at project head email id for more details.</span><br><br>";
            }
            for(j=0; j<items[i]['other_tags'].length; j++){
              dept_div_body += "<div class=\"chip\">" + items[i]['other_tags'][j] + "</div>";
            }
            dept_div_body += "</div></li>";
          }
          dept_div_body += "</ul>";
          dept_div_body += "";
          $('#department_div').html(dept_div_body);
        }

        $('.collapsible').collapsible({
        onOpen: function(el) {initial_document_size = $(document).height();}, // Callback for Collapsible open
        onClose: function(el) {initial_document_size = $(document).height();} // Callback for Collapsible close
        });
        $('#main-nav-icon').css('margin-top', ($(window).height() - $('nav').height()) / 2.2);
        initial_document_size = $(document).height();
  });

  $.post("/get_intern_offers_details", "hi", function(items){
        if(items == "failure"){
          var $toastContent = $('<span>There seems to be some difficulties to fetch from database. Try refreshing.</span>');
          Materialize.toast($toastContent, 3000, 'rounded');
        }else{
          items = JSON.parse(items);
          intern_div_body += "<ul class=\"collapsible\" data-collapsible=\"accordion\">";
          for(i=0;i<items.length;i++){
            intern_div_body += " <li class=\"col s12\"><div class=\"collapsible-header\"><ul class=\"col s12 m12 l12\"><li>" + items[i]['company_name'] + ", " + items[i]['location'] + "</li><li><hr class=\"theme-text-dark-primary\">  </li><li><div class=\"chip\">" + items[i]['poster_name'] + "</div><span class=\"new badge blue\" data-badge-caption=\"\">" + items[i]['time_period'] + "</span></li></ul></div><div class=\"collapsible-body\"><span>Current State: <span class=\"green-text darken-4\">Active</span></span><span class=\"right hide-on-small-only\">Created on " + items[i]['created_date_time'] + "</span><div class=\"card theme-color-dark-primary z-depth-0\"><div class=\"card-content\"><span class=\"card-title theme-text-light-primary\"><span>" + items[i]['type'] + "</span></span><span class=\"theme-text-light-primary\"><p>" + items[i]['description'] + "</p></span></div></div><span class=\"theme-text-black\">Contact mail id </span><span class=\"theme-text-dark-primary\">" + items[i]['contact_mail_id'] + "</span><br><br> ";
            if(items[i]['language'].length > 0){
              intern_div_body += " <span class=\"theme-text-black\">Languages preferred</span><br><span class=\"theme-text-dark-primary\"> ";
              for(j=0;j<items[i]['language'].length;j++){
                intern_div_body += items[i]['language'][j] + "<br>";
              }
              intern_div_body += "</span><br>";
            }
            if(items[i]['technical'].length > 0){
              intern_div_body += "<span class=\"theme-text-black\">Technicals preferred</span><br><span class=\"theme-text-dark-primary\">";
              for(j=0;j<items[i]['technical'].length;j++){
                intern_div_body += items[i]['technical'][j] + "<br>";
              }
              intern_div_body += "</span><br>";
            }
            for(j=0; j<items[i]['tags'].length; j++){
              intern_div_body += "<div class=\"chip\">" + items[i]['tags'][j] + "</div>";
            }
            intern_div_body += "</ul>";
          }
          $('#intern_div').html(intern_div_body);
        }

        $('.collapsible').collapsible({
        onOpen: function(el) {initial_document_size = $(document).height();}, // Callback for Collapsible open
        onClose: function(el) {initial_document_size = $(document).height();} // Callback for Collapsible close
        });
        $('#main-nav-icon').css('margin-top', ($(window).height() - $('nav').height()) / 2.2);
        initial_document_size = $(document).height();
  });

  $.post("/get_job_related_details", "hi", function(items){
        if(items == "failure"){
          var $toastContent = $('<span>There seems to be some difficulties to fetch from database. Try refreshing.</span>');
          Materialize.toast($toastContent, 3000, 'rounded');
        }else{
          items = JSON.parse(items);
          job_div_body += "<ul class=\"collapsible\" data-collapsible=\"accordion\">";
          for(i=0;i<items.length;i++){
            job_div_body += " <li class=\"col s12\"><div class=\"collapsible-header\"><ul class=\"col s12 m12 l12\"><li>" + items[i]['company_name'] + ", " + items[i]['location'] + "</li><li><hr class=\"theme-text-dark-primary\">  </li><li><div class=\"chip\">" + items[i]['poster_name'] + "</div><span class=\"new badge blue\" data-badge-caption=\"\">" + items[i]['time_period'] + "</span></li></ul></div><div class=\"collapsible-body\"><span>Current State: <span class=\"green-text darken-4\">Active</span></span><span class=\"right hide-on-small-only\">Created on " + items[i]['created_date_time'] + "</span><div class=\"card theme-color-dark-primary z-depth-0\"><div class=\"card-content\"><span class=\"card-title theme-text-light-primary\"><span>" + items[i]['type'] + "</span></span><span class=\"theme-text-light-primary\"><p>" + items[i]['description'] + "</p></span></div></div><span class=\"theme-text-black\">Contact mail id </span><span class=\"theme-text-dark-primary\">" + items[i]['contact_mail_id'] + "</span><br><br> ";
            if(items[i]['language'].length > 0){
              job_div_body += " <span class=\"theme-text-black\">Languages preferred</span><br><span class=\"theme-text-dark-primary\"> ";
              for(j=0;j<items[i]['language'].length;j++){
                job_div_body += items[i]['language'][j] + "<br>";
              }
              job_div_body += "</span><br>";
            }
            if(items[i]['technical'].length > 0){
              job_div_body += "<span class=\"theme-text-black\">Technicals preferred</span><br><span class=\"theme-text-dark-primary\">";
              for(j=0;j<items[i]['technical'].length;j++){
                job_div_body += items[i]['technical'][j] + "<br>";
              }
              job_div_body += "</span><br>";
            }
            for(j=0; j<items[i]['tags'].length; j++){
              job_div_body += "<div class=\"chip\">" + items[i]['tags'][j] + "</div>";
            }
            job_div_body += "</ul>";
          }
          $('#job_related_div').html(job_div_body);
        }                                                                                                                                                                                                          

        $('.collapsible').collapsible({
        onOpen: function(el) {initial_document_size = $(document).height();}, // Callback for Collapsible open
        onClose: function(el) {initial_document_size = $(document).height();} // Callback for Collapsible close
        });
        $('#main-nav-icon').css('margin-top', ($(window).height() - $('nav').height()) / 2.2);
        initial_document_size = $(document).height();
  });
    
}

function fill_gallery_page(){
  var image_thumbnails_body = "";
  var important_event_body = "";

  $.post("/get_important_events", "hi", function(items){
        if(items == "failure"){
          var $toastContent = $('<span>There seems to be some difficulties to fetch from database. Try refreshing.</span>');
          Materialize.toast($toastContent, 3000, 'rounded');
        }else{
          items = JSON.parse(items);
          important_event_body += " <div style=\"height: 1px;\" class=\"pinned\"><ul class=\"section table-of-contents\"><li><span class=\"theme-text-dark-primary\">Important events</span></li> ";
          for(i=0;i<items.length;i++){
            important_event_body += " <li><a href=\"javascript:show_event_images(\'" + items[i]['name'] + "\')\">" + items[i]['name'] + "</a></li> ";
          }
          important_event_body += "</ul></div>";
          $('#important_event_div').html(important_event_body);
        }                                                                                                                                                                                                          

        $('#main-nav-icon').css('margin-top', ($(window).height() - $('nav').height()) / 2.2);
        initial_document_size = $(document).height();
  });

  $.post("/get_gallery_home_details", "hi", function(items){
        if(items == "failure"){
          var $toastContent = $('<span>There seems to be some difficulties to fetch from database. Try refreshing.</span>');
          Materialize.toast($toastContent, 3000, 'rounded');
        }else{
          items = JSON.parse(items);
          for(i=0;i<items.length;i++){
            if(items[i]['year'] != cur_year){
              cur_year = items[i]['year'];
              if(cur_year >= max_year) max_year = cur_year;
              if(cur_year <= min_year) min_year = cur_year;
              if(i!=0)  image_thumbnails_body += "</div>";
              image_thumbnails_body += "<div id=\"year_" + items[i]['year'] + "_div\" class=\"col s12 m12\"><span class=\"col s12 m12 theme-text-ash\" style=\"font-size: 25px;\"><b>"+items[i]['year']+"</b></span>";              
            }
            image_thumbnails_body += " <div class=\"col s10 m3 offset-s1\"><a href=\"javascript:show_event_images(\'" + items[i]['name'] + "\')\"><div class=\"card transparent z-depth-2\"><div class=\"card-image\"><img src=\"" + items[i]['title_img_url'] + "\"></div><div class=\"card-action center theme-text-dark-primary\"><span>" + items[i]['name'] + "</span></div></div></a></div> ";
          }
          if(items.length > 0)
            image_thumbnails_body += "</div>";
          $('#image_thumbnails_div').html(image_thumbnails_body);
        }                                                                                                                                                                                                          

        $('#rangebar').attr('min', min_year-5);
        $('#rangebar').attr('max', max_year+5);
        $('#rangebar').on('change', function(){
          var go_to = "#year_" + $('#rangebar').val() + "_div";
          $('html, body').animate({
            scrollTop: $(go_to).offset().top + 'px'
            }, 500, 'swing');
        });
        $('#main-nav-icon').css('margin-top', ($(window).height() - $('nav').height()) / 2.2);
        initial_document_size = $(document).height();
  });

}

function show_event_images(event_name){
  loaded_gallery_home = $('#gallery_page_div').html();

  var gallery_page_body = "";
  var corousel_body = "";
  var individual_img_body = "";
  var in_data = {
    "event_name" : event_name
  }
  $.post("/get_single_event_images", JSON.stringify(in_data), function(items){
        if(items == "failure"){
          var $toastContent = $('<span>There seems to be some difficulties to fetch from database. Try refreshing.</span>');
          Materialize.toast($toastContent, 3000, 'rounded');
        }else{
          items = JSON.parse(items);
          gallery_page_body += "<nav class=\"transparent z-depth-0\"></nav><div class=\"col s12 m9 offset-m1 center\"><a href=\"javascript:show_gallery_home()\" class=\"waves-red left theme-text-ash\"><i class=\"material-icons\">arrow_back</i></a><span class=\"theme-text-ash\">Coursel</span></div><div class=\"col s1 m1 offset-m1 hide-on-small-only\" style=\"margin-top: 140px;\"><a href=\"#!\" id=\"show_prev_img\" class=\"waves-theme-color-dark-primary left theme-text-ash\"><i class=\"material-icons medium\">chevron_left</i></a></div><div class=\"col s12 m7\"><div id=\"img_corousel\" class=\"carousel\">";
          for(i=0;i<items.length;i=i+2){
            if(i+1 < items.length){
              corousel_body += "<a class=\"carousel-item\" href=\"" + items[i]['img_url'] + "\"><img src=\"" + items[i]['img_url'] + "\"></a>";
              corousel_body += "<a class=\"carousel-item\" href=\"" + items[i+1]['img_url'] + "\"><img src=\"" + items[i+1]['img_url'] + "\"></a>";
              individual_img_body += "<div class=\"col s12 m6\"><div class=\"col s6 m6\"><div class=\"card transparent z-depth-2\"><div class=\"card-image\"><img src=\"" + items[i]['img_url'] + "\"></div></div></div><div class=\"col s6 m6\"><div class=\"card transparent z-depth-2\"><div class=\"card-image\"><img src=\"" + items[i+1]['img_url'] + "\"></div></div></div></div>";
            }else{
              corousel_body += "<a class=\"carousel-item\" href=\"" + items[i]['img_url'] + "\"><img src=\"" + items[i]['img_url'] + "\"></a>";
              individual_img_body += " <div class=\"col s12 m6\"><div class=\"col s6 m6\"><div class=\"card transparent z-depth-2\"><div class=\"card-image\"><img src=\"" + items[i]['img_url'] + "\"></div></div></div></div> ";
            }
          }
          gallery_page_body += corousel_body;
          gallery_page_body += "</div></div><div class=\"col s1 m1 hide-on-small-only\" style=\"margin-top: 140px;\"><a href=\"#!\" id=\"show_next_img\" class=\"waves-red left theme-text-ash\"><i class=\"material-icons medium\">chevron_right</i></a></div><div class=\"col s12 m9 offset-m1 center\"><span class=\"theme-text-ash\">All images</span></div><br><div id=\"all_images_div\" class=\"col s12 m9 offset-m1\">";
          gallery_page_body += individual_img_body;
          gallery_page_body += "</div>";

          $('#gallery_page_div').html(gallery_page_body);
        }                                                                                                                                                                                                          

        $('.carousel').carousel();
        $('#show_prev_img').on('click', function(){
          $('#img_corousel').carousel('prev');
        })
        $('#show_next_img').on('click', function(){
         $('#img_corousel').carousel('next');
        })
        $('#main-nav-icon').css('margin-top', ($(window).height() - $('nav').height()) / 2.2);
        initial_document_size = $(document).height();
  });
  
}

function show_gallery_home(){
 if(loaded_gallery_home != ""){
  $('#gallery_page_div').html(loaded_gallery_home);
  $('#rangebar').attr('min', min_year-5);
  $('#rangebar').attr('max', max_year+5);
  $('#rangebar').on('change', function(){
    var go_to = "#year_" + $('#rangebar').val() + "_div";
    $('html, body').animate({
      scrollTop: $(go_to).offset().top + 'px'
      }, 500, 'swing');
  });
  $('#main-nav-icon').css('margin-top', ($(window).height() - $('nav').height()) / 2.2);
  initial_document_size = $(document).height();
 }else{
  location.href = "/gallery";
 } 
}

function fill_contacts_page(){
  var professor_contacts_body = "";
  var office_contacts_body = "";
  var other_contacts_body = "";

  $.post("/get_contacts", "hi", function(items){
    if(items == "failure"){
      $('#user_msg_text').html("<span>There seems to be some difficulties to fetch from database. Try refreshing.</span>");
      $('#user_msg').modal('open');
    }else{
      items = JSON.parse(items);
      for(i=0;i<items.length;i++){
        if(items[i]['type'] == "Professor"){
          professor_contacts_body += " <div class=\"col s12 m6\"><div class=\"card horizontal hide-on-med-and-down\"><div class=\"card-image\"><img class=\"responsive-img\" src=\"" + items[i]['v_pic_url'] + "\"></div><div class=\"card-stacked\"><div class=\"card-content\"><span class=\"card-title theme-text-dark-primary\">" + items[i]['name'] + "</span><p>" + items[i]['email_id'] + "</p><p>" + items[i]['phone_number'] + "</p></div><div class=\"card-action\"><span class=\"theme-text-dark-primary\">" + items[i]['designation'] + "</span></div></div></div><div class=\"card hide-on-large-only\"><div class=\"card-image\"><img class=\"responsive-img\" src=\"" + items[i]['h_pic_url'] + "\"></div><div class=\"card-stacked\"><div class=\"card-content\"><span class=\"card-title theme-text-dark-primary\">" + items[i]['name'] + "</span><p>" + items[i]['email_id'] + "</p><p>" + items[i]['phone_number'] + "</p></div><div class=\"card-action\"><span class=\"theme-text-dark-primary\">" + items[i]['designation'] + "</span></div></div></div></div> ";
        }else if(items[i]['type'] == "Office"){
          office_contacts_body += " <div class=\"col s12 m6\"><div class=\"card horizontal hide-on-med-and-down\"><div class=\"card-image\"><img class=\"responsive-img\" src=\"" + items[i]['v_pic_url'] + "\"></div><div class=\"card-stacked\"><div class=\"card-content\"><span class=\"card-title theme-text-dark-primary\">" + items[i]['name'] + "</span><p>" + items[i]['email_id'] + "</p><p>" + items[i]['phone_number'] + "</p></div><div class=\"card-action\"><span class=\"theme-text-dark-primary\">" + items[i]['designation'] + "</span></div></div></div><div class=\"card hide-on-large-only\"><div class=\"card-image\"><img class=\"responsive-img\" src=\"" + items[i]['h_pic_url'] + "\"></div><div class=\"card-stacked\"><div class=\"card-content\"><span class=\"card-title theme-text-dark-primary\">" + items[i]['name'] + "</span><p>" + items[i]['email_id'] + "</p><p>" + items[i]['phone_number'] + "</p></div><div class=\"card-action\"><span class=\"theme-text-dark-primary\">" + items[i]['designation'] + "</span></div></div></div></div> ";
        }else if(items[i]['type'] == "Others"){
          other_contacts_body += " <div class=\"col s12 m6\"><div class=\"card horizontal hide-on-med-and-down\"><div class=\"card-image\"><img class=\"responsive-img\" src=\"" + items[i]['v_pic_url'] + "\"></div><div class=\"card-stacked\"><div class=\"card-content\"><span class=\"card-title theme-text-dark-primary\">" + items[i]['name'] + "</span><p>" + items[i]['email_id'] + "</p><p>" + items[i]['phone_number'] + "</p></div><div class=\"card-action\"><span class=\"theme-text-dark-primary\">" + items[i]['designation'] + "</span></div></div></div><div class=\"card hide-on-large-only\"><div class=\"card-image\"><img class=\"responsive-img\" src=\"" + items[i]['h_pic_url'] + "\"></div><div class=\"card-stacked\"><div class=\"card-content\"><span class=\"card-title theme-text-dark-primary\">" + items[i]['name'] + "</span><p>" + items[i]['email_id'] + "</p><p>" + items[i]['phone_number'] + "</p></div><div class=\"card-action\"><span class=\"theme-text-dark-primary\">" + items[i]['designation'] + "</span></div></div></div></div> ";
        }
      }

      $('#professors_contact_div').html(professor_contacts_body);
      $('#office_contact_div').html(office_contacts_body);
      $('#other_contact_div').html(other_contacts_body);

      initial_document_size = $(document).height();
    }
  });
}

function fill_profile_page(){
  var view_user = getCookie("view-user-profile");
  setCookie("view-user-profile", "", -1);
  if(view_user == ""){
    //load default page and alert search for someone 
    $('#user_profile').html(
      " <div class=\"col s12 m9 offset-m2 center\"><span class=\"theme-text-dark-primary\" style=\"font-size: 30px;\">You dont seem to have searched for anyone!</span></div> "
      );
  }else{
    //get details and put
    var in_data = {
      'user_email_id' : view_user
    };
    $.post("/get_user_profile_for_view", JSON.stringify(in_data), function(view_profile){

      view_profile = JSON.parse(view_profile);
      var display_html = "";

      display_html += "<div class=\"col s12 m5\"><div class=\"card transparent z-depth-4\"><div class=\"card-image\"><img id=\"profile_pic\" class=\"responsive-img\" src=\"" + view_profile['profile_pic_url'] + "\"></div></div></div>";
      display_html += "<div class=\"col s12 m7\"><div class=\"card transparent z-depth-0\"><div class=\"card-content\"><br class=\"hide-on-med-and-down\"><br class=\"hide-on-med-and-down\"><span class=\"card-title theme-text-dark-primary\" style=\"font-size: 40px;\">" + view_profile['user_name'] + "</span><br ><ul id=\"school\" class=\"col s12\" style=\"color: #505050;\"><li class=\"left\" ><i class=\"material-icons Tiny\">school</i></li><li class=\"left\"><span style=\"color: #505050;\">&nbsp;&nbsp;" + view_profile['starting_year'] + " - " + view_profile['ending_year'] + "</span></li></ul>";
      for(i=0;i<view_profile['site_for_yourself_count'];i++){
        display_html += "<a href=\"http://" + view_profile['own_site_details'][i]['url'] + "\"><ul id=\"ownsite\" class=\"col s12\" style=\"color: #505050;\"><li class=\"left\"><i class=\"material-icons Tiny\">public</i></li><li class=\"left\" style=\"color: #505050;\">&nbsp;&nbsp;" + view_profile['own_site_details'][i]['url'] + "</li></ul></a>";
      }
      if(view_profile['a_l_type'] == "Alumnus" && view_profile['current_company'] != ""){
        display_html += " <ul id=\"work\" class=\"col s12\" style=\"color: #505050;\"><li class=\"left\"><i class=\"material-icons Tiny\">work</i></li><li class=\"left\" style=\"color: #505050;\"><span>&nbsp;&nbsp;" + view_profile['current_company'] + "</span></li></ul> ";
      }
      if(view_profile['register_type'] == "Teacher" && view_profile['designation'] != ""){
        display_html += " <ul id=\"work\" class=\"col s12\" style=\"color: #505050;\"><li class=\"left\"><i class=\"material-icons Tiny\">work</i></li><li class=\"left\" style=\"color: #505050;\"><span>&nbsp;&nbsp;" + view_profile['designation'] + "</span></li></ul> "; 
      }
      if(view_profile['connections_count'] > 0){
        display_html += "<ul id=\"connect\" class=\"col s12\"><li class=\"left\"><span style=\"color: #505050;\">Connect through</span></li>";
        for(i=0;i<view_profile['connections_count'];i++){
          if(view_profile['connections_details'][i]['type'] == "facebook"){
            display_html += "<li class=\"left\"><a href=\"http://" + view_profile['connections_details'][i]['url'] + "\">&nbsp;&nbsp;<img class=\"responsive-img\" src=\"images/facebookmini.png\" style=\"height: 25px; width: 25px;\"></i></a></li>";
          }else if(view_profile['connections_details'][i]['type'] == "Linkedin"){
            display_html += "<li class=\"left\"><a href=\"http://" + view_profile['connections_details'][i]['url'] + "\">&nbsp;&nbsp;<img class=\"responsive-img\" src=\"images/linkedinmini.png\" style=\"height: 25px; width: 25px;\"></i></a></li>";
          }else if(view_profile['connections_details'][i]['type'] == "Github"){
            display_html += "<li class=\"left\"><a href=\"http://" + view_profile['connections_details'][i]['url'] + "\">&nbsp;&nbsp;<img class=\"responsive-img\" src=\"images/githubmini.png\" style=\"height: 25px; width: 25px;\"></i></a></li>";
          }else if(view_profile['connections_details'][i]['type'] == "twitter"){
            display_html += "<li class=\"left\"><a href=\"http://" + view_profile['connections_details'][i]['url'] + "\">&nbsp;&nbsp;<img class=\"responsive-img\" src=\"images/twittermini.png\" style=\"height: 25px; width: 25px;\"></i></a></li>";
          }else if(view_profile['connections_details'][i]['type'] == "Coding profile"){
            display_html += "<li class=\"left\"><a href=\"http://" + view_profile['connections_details'][i]['url'] + "\">&nbsp;&nbsp;<img class=\"responsive-img\" src=\"images/codingmini.png\" style=\"height: 25px; width: 25px;\"></i></a></li>";
          }
        }
        display_html +="</ul>";
      }
      display_html += "</div></div></div>";

      display_html += "<div class=\"col s12 m12\"><div class=\"card transparent z-depth-0\"><div class=\"card-content\"><span class=\"card-title theme-text-dark-primary\"><b><span>About myself</span></b></span><p style=\"color: #505050;\">" + view_profile['about_yourself'] + "</p></div></div>";
    if(view_profile['work_intern_count'] > 0){
      display_html += "<div class=\"card transparent z-depth-0\"><div class=\"card-content\"><span class=\"card-title theme-text-dark-primary\"><b><span>Work/Intern experience</span></b></span>";
      for(i=0;i<view_profile['work_intern_count'];i++){
        display_html += "<p style=\"color: #505050;\"><b>" + view_profile['work_intern_details'][i]['type'] + "</b> at " + view_profile['work_intern_details'][i]['where'] + "</p>";
      }
      display_html += "</div>";
    }
    if(view_profile['area_of_interest_count'] > 0){
      display_html += "<div class=\"card transparent z-depth-0\"><div class=\"card-content\"><span class=\"card-title theme-text-dark-primary\"><b><span>Areas of Interest</span></b></span>";
      for(i=0;i<view_profile['area_of_interest_count'];i++){
        display_html += "<p style=\"color: #505050;\">" + view_profile['area_of_interest_details'][i]['domain_name'] + "</p>";
      }
      display_html += "</div>";
    }
    if(view_profile['projects_done_count'] > 0){
      if(view_profile['register_type'] == "Teacher"){
        display_html += "<div class=\"card transparent z-depth-0\"><div class=\"card-content\"><span class=\"card-title theme-text-dark-primary\"><b><span>Projects Done</span></b></span>";
        for(i=0;i<view_profile['projects_done_count'];i++){
          display_html += "<p style=\"color: #505050;\">" + view_profile['projects_done_details'][i]['domain'] + "</p><p style=\"color: #505050;\">" + view_profile['projects_done_details'][i]['name'] + "</p>";
        }
        display_html += "</div>";
      }else{
        display_html += "<div class=\"card transparent z-depth-0\"><div class=\"card-content\"><span class=\"card-title theme-text-dark-primary\"><b><span>Projects Done</span></b></span>";
        for(i=0;i<view_profile['projects_done_count'];i++){
          display_html += "<p style=\"color: #505050;\">" + view_profile['projects_done_details'][i]['name'] + "</p>";
        }
        display_html += "</div>";
      }
    }

      $('#user_profile_details').html(display_html);

      initial_document_size = $(document).height();

    });

  }
}

function fill_events_tab(){
  var events_tab_body = "";
  $.post("/get_events_tab_contents", "hi", function(items){
    if(items == "failure"){
      var $toastContent = $('<span>There seems to be some difficulties to fetch events details from database. Try refreshing.</span>');
      Materialize.toast($toastContent, 3000, 'rounded');
    }else{
      items = JSON.parse(items);
      for(i=0;i<items.length;i++){
          events_tab_body += " <div class=\"card white z-depth-0\"><div class=\"card-content\"><div class=\"center\"><span class=\"card-title theme-color-dark-primary theme-text-light-primary z-depth-2\" style=\"border-top-right-radius: 5px; border-top-left-radius: 5px; margin-bottom: 0px;\">" + items[i]['event_name'] + "</span></div><div class=\"z-depth-2\"><ul style=\"margin: 0px;\"><li><br></li> ";
        if(items[i]['date_of_event'] != "" && items[i]['date_of_event'] != "undefined")
          events_tab_body += "<li><i class=\"btn-floating transparent z-depth-0 material-icons small theme-text-ash\">event</i><span>" + items[i]['date_of_event'] + "</span></li>";
        if(items[i]['venue'] != "" != items[i]['venue'] != "undefined")
          events_tab_body += "<li><i class=\"btn-floating transparent z-depth-0 material-icons small theme-text-ash\">place</i><span>" + items[i]['venue'] + "</span></li>";
        if(items[i]['time_of_event'] != "" && items[i]['time_of_event'] != "undefined")
          events_tab_body += "<li><i class=\"btn-floating transparent z-depth-0 material-icons small theme-text-ash\">alarm</i><span>" + items[i]['time_of_event'] + "</span></li>";
        if(items[i]['contact'] != "" && items[i]['contact'] != "undefined")
          events_tab_body += "<li><i class=\"btn-floating transparent z-depth-0 material-icons small theme-text-ash\">contacts</i><span>" + items[i]['contact'] + "</span></li>";
        if(items[i]['link'] != "" && items[i]['link'] != "undefined")
          events_tab_body += "<li><i class=\"btn-floating transparent z-depth-0 material-icons small theme-text-ash\">launch</i><span>" + items[i]['link'] + "</span></li>";
        events_tab_body += " </ul></div><div class=\"center\"><a href=\"javascript:show_single_event(\'" + items[i]['event_name'] + "\')\"><span class=\"card-title theme-color-ash theme-text-light-primary z-depth-2\" style=\"border-bottom-right-radius: 5px; border-bottom-left-radius: 5px; font-size: 15px; margin-top: 0px;\">for more details</span></a></div></div></div> ";
      }
    }
    $('#events_tab_div').html(events_tab_body);
  });
}

function show_post_in_page(show_page_no){
  if(show_page_no == "next"){
    current_page_no++;
  }else if(show_page_no == "prev"){
    current_page_no--;
  }else{
    current_page_no = show_page_no;
  }
  fill_posts_section(current_page_no);
  fill_index_page_bottom(current_page_no);
  $('html, body').animate({scrollTop: '0px'}, 500);
}

function fill_index_page_bottom(page_no){
  var page_number_body = "";
  var pagination_body = "";
  var temp_page_no;
  var temp_count;

  page_number_body = " <div class=\"card transparent z-depth-0\"><div class=\"card-content theme-text-dark-primary\" style=\"padding: 0px;\"><span> Page " + page_no + " </span></div></div> ";
  $('#page_number_div').html(page_number_body);

  $.post("/get_post_count", "hi", function(count){
    if(count < 0){
      var $toastContent = $('<span>There seems to be some difficulties to fetch page details from database. Try refreshing.</span>');
      Materialize.toast($toastContent, 3000, 'rounded');
    }else{
      //fill start
      pagination_body += " <ul class=\"pagination center\"><li class=\"waves-effect\"><a href=\"javascript:show_post_in_page('prev')\"><i class=\"material-icons theme-text-dark-primary\">chevron_left</i></a></li> ";
      temp_page_no = current_page_no;
      temp_count = temp_page_no*6;
      var left_limit = temp_page_no;
      var right_limit = temp_page_no;
      var count_icons = 3;
      while(left_limit > 1 && temp_count > 6 && count_icons > 0){
        left_limit--;
        temp_count= temp_count-6;
        count_icons--;
      }
      count_icons = 3-count_icons;
      temp_count = temp_page_no*6;
      while((count-(temp_count-6))>=0 && count_icons < 6){
        right_limit++;
        temp_count = temp_count+6;
        count_icons++;
      }
      for(i=left_limit;i<=right_limit;i++){
        pagination_body += " <li class=\"waves-effect\"><a href=\"javascript:show_post_in_page(" + i + ")\"><span class=\"theme-text-dark-primary\">" + i + "</span></a></li> ";
      }
      //fill end
      pagination_body += "<li class=\"waves-effect\"><a href=\"javascript:show_post_in_page('next')\"><i class=\"material-icons theme-text-dark-primary\">chevron_right</i></a></li></ul>";
    }
    $('#pagination_div').html(pagination_body);
  });
  
}

function fill_posts_section(page_no){
  var posts_body = "";
  $('#posts_div').html(posts_body);
  $.post("/get_all_post_details","hi",function(items){
    if(items == "failure"){
      var $toastContent = $('<span>There seems to be some difficulties to fetch events details from database. Try refreshing.</span>');
      Materialize.toast($toastContent, 3000, 'rounded');
    }else{
      items = JSON.parse(items);
      for(i=(page_no-1)*6;i<(page_no*6) && i<items.length;i++){
        if(items[i]['type'] == "simple text"){
          posts_body += " <div class=\"\"><div class=\"card\" style=\"box-shadow: 0 2px 2px 0 rgba(box-shadow-color-rbga0.14),0 1px 5px 0 rgba(box-shadow-color-rbga0.12),0 3px 1px -1px rgba(box-shadow-color-rbga0.85); webkit-box-shadow: 0 2px 2px 0 rgba(box-shadow-color-rbga0.14),0 1px 5px 0 rgba(box-shadow-color-rbga0.12),0 3px 1px -1px rgba(box-shadow-color-rbga0.85)\"><div class=\"card-content\"><div><img id=\"post_" + i + "_user_img\" src=\"\" class=\"responsive-img circle left\" style=\"height: 30px;\"><span style=\"font-size: 20px;\">&nbsp;" + items[i]['posted_by'] + "</span><span class=\"theme-text-ash\"> has written a post</span><span class=\"right theme-text-ash hide-on-small-only\" style=\"font-size: 10px;\"><i class=\"material-icons tiny right\">query_builder</i>" + items[i]['time_of_post'] + "</span></div><div style=\"margin-top: 10px;\"><ul><li>" + items[i]['post_text'] + "</li><li> ";
          for(j=0;j<items[i]['tags'].length;j++){
            posts_body += " <div class=\"chip\">" + items[i]['tags'][j] + "</div> ";
          }
          posts_body += " </li></ul></div></div></div></div> ";
          $('#posts_div').append(posts_body);
          posts_body = "";
        }else if(items[i]['type'] == "poster"){
          posts_body += " <div class=\"#\"><div class=\"card\" style=\"box-shadow: 0 2px 2px 0 rgba(box-shadow-color-rbga0.14),0 1px 5px 0 rgba(box-shadow-color-rbga0.12),0 3px 1px -1px rgba(box-shadow-color-rbga0.85); webkit-box-shadow: 0 2px 2px 0 rgba(box-shadow-color-rbga0.14),0 1px 5px 0 rgba(box-shadow-color-rbga0.12),0 3px 1px -1px rgba(box-shadow-color-rbga0.85)\"><div class=\"card-content\"><div class=\"card transparent z-depth-0\"><div class=\"card-content center\"><span class=\"card-title theme-text-dark-primary\">" + items[i]['title'] + "</span><p class=\"theme-text-ash\">\"" + items[i]['quote_text'] + "\"</p></div></div><div class=\"card transparent z-depth-0\"><div class=\"card-image z-depth-2 center\"><img src=\"" + items[i]['img_url'] + "\"></div><div class=\"card-content\"><p class=\"theme-text-ash\">" + items[i]['additional_text'] + "</p></div></div></div></div></div> ";
          $('#posts_div').append(posts_body);
          posts_body = "";
        }else if(items[i]['type'] == "video post"){
          posts_body += " <div class=\"#\"><div class=\"card\" style=\"box-shadow: 0 2px 2px 0 rgba(box-shadow-color-rbga0.14),0 1px 5px 0 rgba(box-shadow-color-rbga0.12),0 3px 1px -1px rgba(box-shadow-color-rbga0.85); webkit-box-shadow: 0 2px 2px 0 rgba(box-shadow-color-rbga0.14),0 1px 5px 0 rgba(box-shadow-color-rbga0.12),0 3px 1px -1px rgba(box-shadow-color-rbga0.85)\"><div class=\"card-content\"><div><img id=\"post_" + i + "_user_img\" src=\"#\" class=\"responsive-img circle left\" style=\"height: 30px;\"><span style=\"font-size: 20px;\">" + items[i]['posted_by'] + "</span><span class=\"theme-text-ash\"> has shared a video</span><span class=\"right theme-text-ash hide-on-small-only\" style=\"font-size: 10px;\"><i class=\"material-icons tiny right\">query_builder</i>" + items[i]['time_of_post'] + "</span></div><div style=\"margin-top: 10px;\"><ul><li>" + items[i]['post_text'];
          for(j=0;j<items[i]['tags'].length;j++){
            posts_body += " <span class=\"new badge " + colors_badge[j] + " hide-on-small-only\" data-badge-caption=\"\">" + items[i]['tags'][j] + "</span> ";
          }
          posts_body +=" </li><li><div class=\"card transparent z-depth-0 center\"><div class=\"card-content\"><div class=\"video-container\"><iframe width=\"100\" height=\"100\" src=\"" + items[i]['vid_url'] + "\" frameborder=\"0\" allowfullscreen></iframe></div></div></div></li></ul></div></div></div></div> ";
          $('#posts_div').append(posts_body);
          posts_body = "";
        }else if(items[i]['type'] == "congratulate post"){
          posts_body += " <div class=\"#\"><div class=\"card horizontal theme-color-dark-primary2\" style=\"box-shadow: 0 2px 2px 0 rgba(box-shadow-color-rbga0),0 1px 5px 0 rgba(box-shadow-color-rbga0),0 3px 1px -1px rgba(box-shadow-color-rbga0); webkit-box-shadow: 0 2px 2px 0 rgba(box-shadow-color-rbga0),0 1px 5px 0 rgba(box-shadow-color-rbga0),0 3px 1px -1px rgba(box-shadow-color-rbga0)\"><div class=\"card-image z-depth-0\"><img id=\"post_" + i + "_user_img\" class=\"responsive-img\" src=\"\" style=\"height: 250px; width: auto;\"><span class=\"card-title\">" + items[i]['user_name'] + "</span></div><div class=\"card-stacked\"><div class=\"card-content center\"><span class=\"card-title theme-text-light-primary\">" + items[i]['post_title'] + "</span><span class=\"theme-text-light-primary\">" + items[i]['post_text'] + "</span></div></div></div></div> ";

          $('#posts_div').append(posts_body);
          posts_body = "";
        }else if(items[i]['type'] == "reminder post"){
          posts_body += " <div class=\"#\"><div class=\"card theme-color-dark-primary2\" style=\"box-shadow: 0 2px 2px 0 rgba(box-shadow-color-rbga0.14),0 1px 5px 0 rgba(box-shadow-color-rbga0.12),0 3px 1px -1px rgba(box-shadow-color-rbga0.85); webkit-box-shadow: 0 2px 2px 0 rgba(box-shadow-color-rbga0.14),0 1px 5px 0 rgba(box-shadow-color-rbga0.12),0 3px 1px -1px rgba(box-shadow-color-rbga0.85)\"><div class=\"card-content center theme-text-light-primary\"><span class=\"card-title\"><i class=\"material-icons medium\">notifications_active</i></span>" + items[i]['post_text'] + "</div></div></div> ";
          $('#posts_div').append(posts_body);
          posts_body = "";
        }else if(items[i]['type'] == "event add"){
          posts_body += " <div class=\"#\"><div class=\"card\" style=\"box-shadow: 0 2px 2px 0 rgba(box-shadow-color-rbga0.14),0 1px 5px 0 rgba(box-shadow-color-rbga0.12),0 3px 1px -1px rgba(box-shadow-color-rbga0.85); webkit-box-shadow: 0 2px 2px 0 rgba(box-shadow-color-rbga0.14),0 1px 5px 0 rgba(box-shadow-color-rbga0.12),0 3px 1px -1px rgba(box-shadow-color-rbga0.85)\"><div class=\"card-content\"><div><img id=\"post_" + i + "_user_img\" src=\"\" class=\"responsive-img circle left\" style=\"height: 30px;\"><span style=\"font-size: 20px;\">" + items[i]['posted_by'] + "</span><span class=\"theme-text-ash\"> has added a new event</span><span class=\"right theme-text-ash hide-on-small-only\" style=\"font-size: 10px;\"><i class=\"material-icons tiny right\">query_builder</i>" + items[i]['time_of_post'] + "</span></div><div style=\"margin-top: 10px;\"><ul><li> ";
          for(j=0;j<items[i]['tags'].length;j++){
            posts_body += " <span class=\"new badge " + colors_badge[j] + " hide-on-small-only\" data-badge-caption=\"\">" + items[i]['tags'][j] + "</span> ";
          }
          posts_body += " <li><span class=\"card-title\">" + items[i]['event_name'] + "</span><span>" + items[i]['event_description'] + "</span></li></ul></div></div><div class=\"card-action center\"><a href=\"#!\" class=\"theme-text-ash activator\">for more details</a></div><div class=\"card-reveal\"><span class=\"card-title theme-text-dark-primary\">" + items[i]['event_name'] + "<i class=\"material-icons right theme-text-ash\">close</i></span><ul><li> ";
          for(j=0;j<items[i]['tags'].length;j++){
            posts_body += " <span class=\"new badge " + colors_badge[j] + " hide-on-small-only\" data-badge-caption=\"\">" + items[i]['tags'][j] + "</span> ";
          }
          posts_body += "</li><li><span>" + items[i]['event_description'] + "</span></li><li><br></li>";
          if(items[i]['date_of_event'] != "" && items[i]['date_of_event'] != "undefined")
            posts_body += " <li><i class=\"btn-floating transparent z-depth-0 material-icons small theme-text-ash\">event</i><span>" + items[i]['date_of_event'] + "</span></li> ";
          if(items[i]['venue'] != "" && items[i]['venue'] != "undefined")
            posts_body += " <li><i class=\"btn-floating transparent z-depth-0 material-icons small theme-text-ash\">place</i><span>" + items[i]['venue'] + "</span></li> ";
          if(items[i]['time_of_event'] != "" && items[i]['time_of_event'] != "undefined")
            posts_body += " <li><i class=\"btn-floating transparent z-depth-0 material-icons small theme-text-ash\">alarm</i><span>" + items[i]['time_of_event'] + "</span></li> ";
          if(items[i]['contact'] != "" && items[i]['contact'] != "undefined")
            posts_body += " <li><i class=\"btn-floating transparent z-depth-0 material-icons small theme-text-ash\">contacts</i><span>" + items[i]['contact'] + "</span></li> ";
          if(items[i]['link'] != "" && items[i]['link'] != "undefined")
            posts_body += " <li><i class=\"btn-floating transparent z-depth-0 material-icons small theme-text-ash\">launch</i><span>" + items[i]['link'] + "</span></li> ";
          posts_body += "</ul></div></div></div>";
          $('#posts_div').append(posts_body);
          posts_body = "";
        }else if(items[i]['type'] == "opportunity add"){
          posts_body += " <div class=\"#\"><div class=\"card\" style=\"box-shadow: 0 2px 2px 0 rgba(box-shadow-color-rbga0.14),0 1px 5px 0 rgba(box-shadow-color-rbga0.12),0 3px 1px -1px rgba(box-shadow-color-rbga0.85); webkit-box-shadow: 0 2px 2px 0 rgba(box-shadow-color-rbga0.14),0 1px 5px 0 rgba(box-shadow-color-rbga0.12),0 3px 1px -1px rgba(box-shadow-color-rbga0.85)\"><div class=\"card-content\"><div><img id=\"post_" + i + "_user_img\" src=\"\" class=\"responsive-img circle left\" style=\"height: 30px;\"><span style=\"font-size: 20px;\">" + items[i]['posted_by'] + "</span><span class=\"theme-text-ash\"> has posted an opportunity</span><span class=\"right theme-text-ash hide-on-small-only\" style=\"font-size: 10px;\"><i class=\"material-icons tiny right\">query_builder</i>" + items[i]['time_of_post'] + "</span></div><div style=\"margin-top: 10px;\"><ul><li>";
          for(j=0;j<items[i]['tags'].length;j++){
            posts_body += " <span class=\"new badge " + colors_badge[j] + " hide-on-small-only\" data-badge-caption=\"\">" + items[i]['tags'][j] + "</span> ";
          }
          posts_body += " </li><li>Intern/Job opportunity at " + items[i]['company_name'] + "," + items[i]['location'] + ". </li></ul></div></div><div class=\"card-action center\"><a href=\"#!\" class=\"theme-text-ash activator\">for more details</a></div><div class=\"card-reveal\"><a href=\"#!\"><i class=\"material-icons right theme-text-ash\">close</i></a><div class=\"#\"><span>Current State: <span class=\"green-text darken-4\">" + items[i]['current_state'] + "</span></span><span class=\"right hide-on-small-only\">Created on " + items[i]['created_date_time'] + "</span><div class=\"card theme-color-dark-primary z-depth-0\"><div class=\"card-content\"><span class=\"card-title theme-text-light-primary\"><span>" + items[i]['job_type'] + "</span></span><span class=\"theme-text-light-primary\"><p>" + items[i]['description'] + "</p></span></div></div><span class=\"theme-text-black\">Contact mail id </span><span class=\"theme-text-dark-primary\">"+ items[i]['contact_mail_id'] +"</span><br><br> ";
          if(items[i]['language'].length > 0){
            posts_body += " <span class=\"theme-text-black\">Languages preferred</span><br><span class=\"theme-text-dark-primary\"> ";
            for(j=0;j<items[i]['language'].length;j++){
              posts_body += items[i]['language'][j] + "<br>";
            }
            posts_body += "</span><br>";
          }
          if(items[i]['technical'].length > 0){
            posts_body += "<span class=\"theme-text-black\">Technicals preferred</span><br><span class=\"theme-text-dark-primary\">";
            for(j=0;j<items[i]['technical'].length;j++){
              posts_body += items[i]['technical'][j] + "<br>";
            }
            posts_body += "</span><br>";
          }
          for(j=0; j<items[i]['tags'].length; j++){
            posts_body += "<div class=\"chip\">" + items[i]['tags'][j] + "</div>";
          }
          posts_body += " </div><span class=\"theme-text-ash\">Posted by " + items[i]['posted_by'] + " at " + items[i]['time_of_post'] + "," + items[i]['date_of_post'] + ".</span></div></div></div> ";
          $('#posts_div').append(posts_body);
          posts_body = "";
        }else if(items[i]['type'] == "project add"){
          posts_body += " <div class=\"#\"><div class=\"card\" style=\"box-shadow: 0 2px 2px 0 rgba(box-shadow-color-rbga0.14),0 1px 5px 0 rgba(box-shadow-color-rbga0.12),0 3px 1px -1px rgba(box-shadow-color-rbga0.85); webkit-box-shadow: 0 2px 2px 0 rgba(box-shadow-color-rbga0.14),0 1px 5px 0 rgba(box-shadow-color-rbga0.12),0 3px 1px -1px rgba(box-shadow-color-rbga0.85)\"><div class=\"card-content\"><div><img id=\"post_" + i + "_user_img\" src=\"\" class=\"responsive-img circle left\" style=\"height: 30px;\"><span style=\"font-size: 20px;\">" + items[i]['posted_by'] + "</span><span class=\"theme-text-ash\"> has added a project</span><span class=\"right theme-text-ash hide-on-small-only\" style=\"font-size: 10px;\"><i class=\"material-icons tiny right\">query_builder</i>" + items[i]['time_of_post'] + "</span></div><div style=\"margin-top: 10px;\"><ul><li><div class=\"chip\">headed by " + items[i]['project_head'] + "</div><span class=\"new badge blue\" data-badge-caption=\"\">" + items[i]['main_tags'][0] + "</span><span class=\"new badge red hide-on-small-only\" data-badge-caption=\"\">" + items[i]['main_tags'][1] + "</span></li><li>" + items[i]['title_on_card'] + "</li></ul></div></div><div class=\"card-action center\"><a href=\"#!\" class=\"theme-text-ash activator\">for more details</a></div><div class=\"card-reveal\"><a href=\"#!\"><i class=\"material-icons right theme-text-ash\">close</i></a><div class=\"\"><span>Current State: <span class=\"red-text darken-4\">" + items[i]['current_state'] + "</span></span><span class=\"right hide-on-small-only\">Created on " + items[i]['created_date_time'] + "</span><div class=\"card theme-color-dark-primary z-depth-0\"><div class=\"card-content\"><span class=\"card-title theme-text-light-primary\"><span>" + items[i]['title'] + "</span></span><span class=\"theme-text-light-primary\"><p>" + items[i]['description'] + "</p></span></div></div> ";
          posts_body += "<span class=\"theme-text-black\">Project head </span><a href=\"javascript:show_profile(\'" + items[i]['project_head'] +"\')\"><span class=\"theme-text-dark-primary\">" + items[i]['project_head'] + "</span></a><br><br><span class=\"theme-text-black\">Others working in this project</span><br> ";
          for(j=0;j<items[i]['other_members'].length;j++){
            posts_body += " <a href=\"javascript:show_profile(\'" + items[i]['other_members'][j] + "\')\"><span class=\"theme-text-black\">" + items[i]['other_members'][j] + "</span></a>&nbsp;&nbsp; ";
          }
          posts_body += " <br><br><span class=\"theme-text-black\">Core language </span><span class=\"theme-text-dark-primary\">" + items[i]['language'] + "</span><br><br> ";
          if(items[i]['link'] != ""){
            posts_body += "<span class=\"theme-text-black\">You can follow our work at </span><a href=\"" + items[i]['link'] + "\"><span>github link</span></a><span> or contact us at project head email id for more details.</span><br><br>";
          }
          for(j=0; j<items[i]['other_tags'].length; j++){
            posts_body += "<div class=\"chip\">" + items[i]['other_tags'][j] + "</div>";
          }
          posts_body += " </div><span class=\"theme-text-ash\">Posted by " + items[i]['posted_by'] + " at " + items[i]['time_of_post'] + "," + items[i]['date_of_post'] + ".</span></div></div></div> ";
          $('#posts_div').append(posts_body);
          posts_body = "";
        }else if(items[i]['type'] == "pictures"){
          posts_body += "<div class=\"#\"><div class=\"card\" style=\"box-shadow: 0 2px 2px 0 rgba(box-shadow-color-rbga0.14),0 1px 5px 0 rgba(box-shadow-color-rbga0.12),0 3px 1px -1px rgba(box-shadow-color-rbga0.85); webkit-box-shadow: 0 2px 2px 0 rgba(box-shadow-color-rbga0.14),0 1px 5px 0 rgba(box-shadow-color-rbga0.12),0 3px 1px -1px rgba(box-shadow-color-rbga0.85)\"><div class=\"card-content\"><div><img id=\"post_" + i + "_user_img\" src=\"\" class=\"responsive-img circle left\" style=\"height: 30px;\"><span style=\"font-size: 20px;\">" + items[i]['posted_by'] + "</span><span class=\"theme-text-ash\"> has written a post</span><span class=\"right theme-text-ash hide-on-small-only\" style=\"font-size: 10px;\"><i class=\"material-icons tiny right\">query_builder</i>" + items[i]['time_of_post'] + "</span></div><div style=\"margin-top: 10px;\"><ul><li>" + items[i]['post_text'] + "</li><li><hr><div>";
          if(items[i]['img_urls'].length > 0)
            posts_body += " <a href=\""+ items[i]['img_urls'][0] +"\"><img src=\"" + items[i]['img_urls'][0] + "\" style=\"height:100px; width: auto; margin: 10px;\"></a> ";
          if(items[i]['img_urls'].length > 1)
            posts_body += " <a href=\""+ items[i]['img_urls'][1] +"\"><img class=\"hide-on-small-only\" src=\"" + items[i]['img_urls'][1] + "\" style=\"height:100px; width: auto; margin: 10px;\"></a> ";
          if(items[i]['img_urls'].length > 2)
            posts_body += " <a href=\""+ items[i]['img_urls'][2] +"\"><img class=\"hide-on-small-only\" src=\"" + items[i]['img_urls'][2] + "\" style=\"height:100px; width: auto; margin: 10px;\"></a> ";
          if(items[i]['img_urls'].length > 3){
            posts_body += " <i class=\"material-icons large\" style=\"opacity: 0.6\">add</i> ";
          }
          posts_body += " </div><hr></li></ul></div></div><div class=\"card-action center\"><a href=\"#!\" class=\"theme-text-ash activator\">for more details</a></div><div class=\"card-reveal\"><ul><li><a href=\"#!\"><i class=\"material-icons right theme-text-ash\">close</i></a>" + items[i]['post_text'] + "</li><li><div id=\"all_images_div\" class=\"#\"> ";
          for(j=0;j<items[i]['img_urls'].length;j=j+2){
            if(j+1 < items[i]['img_urls'].length){
              posts_body += "<div class=\"col s12 m6\"><div class=\"col s6 m6\"><div class=\"card transparent z-depth-2\"><div class=\"card-image\"><a href=\"" + items[i]['img_urls'][j] + "\"><img src=\"" + items[i]['img_urls'][j] + "\"></a></div></div></div><div class=\"col s6 m6\"><div class=\"card transparent z-depth-2\"><div class=\"card-image\"><a href=\"" + items[i]['img_urls'][j+1] + "\"><img src=\"" + items[i]['img_urls'][j+1] + "\"></a></div></div></div></div>";
            }else{
              posts_body += " <div class=\"col s12 m6\"><div class=\"col s6 m6\"><div class=\"card transparent z-depth-2\"><div class=\"card-image\"><a href=\"" + items[i]['img_urls'][j] + "\"><img src=\"" + items[i]['img_urls'][j] + "\"></a></div></div></div></div> ";
            }
          }
          posts_body += " </div></li><li><span class=\"theme-text-ash\">Posted by " + items[i]['posted_by'] + " at "+ items[i]['time_of_post'] +", " + items[i]['date_of_post'] + ".</span></li></ul></div></div></div> ";
          $('#posts_div').append(posts_body);
          posts_body="";
        }
      }
      for(i=(page_no-1)*6;i<(page_no*6) && i<items.length;i++){
        if(items[i]['type'] == "simple text" || items[i]['type'] == "video post" || items[i]['type'] == "opportunity add" || items[i]['type'] == "project add" || items[i]['type'] == "pictures" || items[i]['type'] == "event add")
          gen_post_account_circle('post_'+i+'_user_img',items[i]['posted_by']);
        if(items[i]['type'] == "congratulate post")
          gen_post_account_circle('post_'+i+'_user_img',items[i]['user_name']);
      }
    }
    
  });
}

function gen_post_account_circle(img_div_id, user_name){
  var in_data = {
  'user_email_id' : autocomplete_extra_data[user_name],
  };
  $.post("/get_profile_pic",JSON.stringify(in_data),function(img_url){
    $('#' + img_div_id).attr('src',img_url);
  });
  
}

function add_filled_work_intern_field(in_num, type, where){
  if(type == "Intern"){
    var inner_details = "<ul><li><div class=\"input-field col s2\"><select id=\"work_intern_drop[" + in_num + "]\"><option value=\"Intern\" selected>Intern</option><option value=\"Work\">Work</option></select><label>Type</label></div></li><li><div class=\"input-field col s10\"><input placeholder=\"place\" id=\"work_intern_text[" + in_num + "]\" type=\"text\" value=\"" + where + "\" ></div></li></ul>";
  }
  else{
    var inner_details = "<ul><li><div class=\"input-field col s2\"><select id=\"work_intern_drop[" + in_num + "]\"><option value=\"Intern\">Intern</option><option value=\"Work\" selected>Work</option></select><label>Type</label></div></li><li><div class=\"input-field col s10\"><input placeholder=\"place\" id=\"work_intern_text[" + in_num + "]\" type=\"text\" value=\"" + where + "\"></div></li></ul>";
  }
  $('#work_intern_details').append(
    inner_details
    );
  $('select').material_select();    
  }

function add_filled_area_of_interest_field(in_num, name){
  var inner_details = " <div class=\"input-field col s12\"><input placeholder=\"Domain name\" id=\"area_of_interest_text[" + in_num + "]\" type=\"text\" value=\"" + name + "\"></div> ";

  $('#area_of_interest_details').append(
    inner_details
    );

  $('select').material_select();    
  }

function add_filled_teacher_area_of_interest_field(in_num, name){
  var inner_details = " <div class=\"input-field col s12\"><input placeholder=\"Domain name\" id=\"area_of_interest_text[" + in_num + "]\" type=\"text\" value=\"" + name + "\"></div> ";

    $('#area_of_interest_details').append(
      inner_details
      );

  $('select').material_select();    
  }

function add_filled_projects_done_field(in_num, name){
  var inner_details = " <div class=\"input-field col s12\"><input placeholder=\"Project name\" id=\"projects_done_text[" + in_num + "]\" type=\"text\" value=\"" + name + "\"></div> ";

    $('#projects_done_details').append(
      inner_details
      );

  $('select').material_select();    
  }

function add_filled_teacher_projects_done_field(in_num, domain_name, name){
  var inner_details = " <div class=\"input-field col s12\"><input placeholder=\"Domain name\" id=\"projects_done_domain_text[" + in_num + "]\" type=\"text\" value=\"" + domain_name + "\"></div><div class=\"input-field col s12\"><input placeholder=\"Project name\" id=\"projects_done_text[" + in_num + "]\" type=\"text\" value=\"" + name + "\"></div> ";

    $('#projects_done_details').append(
      inner_details
      );

  $('select').material_select();    
  }

function add_filled_site_for_yourself_field(in_num, site_url){
  var inner_details = "<div class=\"input-field col s12\"><input placeholder=\"site url\" id=\"own_site_text[" + in_num + "]\" type=\"text\" value=\"" + site_url + "\"></div> ";
 
    $('#own_site_details').append(
      inner_details
      );

  $('select').material_select();    
  }

function add_filled_teacher_site_for_yourself_field(in_num, site_url){
  var inner_details = "<div class=\"input-field col s12\"><input placeholder=\"site url\" id=\"own_site_text[" + in_num + "]\" type=\"text\" value=\"" + site_url + "\"></div> ";

    $('#own_site_details').append(
      inner_details
      );

  $('select').material_select();    
  }

function add_filled_connections_field(in_num, type, link){
  if(type == "Facebook"){
    var inner_details = " <ul><li><div class=\"input-field col s2\"><select id=\"Connections_drop[" + in_num + "]\"><option value=\"99\" disabled>Choose</option><option value=\"Facebook\" selected>Facebook</option><option value=\"Linkedin\">Linkedin</option><option value=\"Twitter\">Twitter</option><option value=\"Github\">Github</option><option value=\"Coding profile\">Coding profile</option></select><label>Type</label></div></li><li><div class=\"input-field col s10\"><input placeholder=\"link\" id=\"Connections_text[" + in_num + "]\" type=\"text\" value=\"" + link + "\"></div></li></ul> ";
  }else if(type == "Linkedin"){
    var inner_details = " <ul><li><div class=\"input-field col s2\"><select id=\"Connections_drop[" + in_num + "]\"><option value=\"99\" disabled>Choose</option><option value=\"Facebook\">Facebook</option><option value=\"Linkedin\" selected>Linkedin</option><option value=\"Twitter\">Twitter</option><option value=\"Github\">Github</option><option value=\"Coding profile\">Coding profile</option></select><label>Type</label></div></li><li><div class=\"input-field col s10\"><input placeholder=\"link\" id=\"Connections_text[" + in_num + "]\" type=\"text\" value=\"" + link + "\"></div></li></ul> ";
  }else if(type == "Github"){
    var inner_details = " <ul><li><div class=\"input-field col s2\"><select id=\"Connections_drop[" + in_num + "]\"><option value=\"99\" disabled>Choose</option><option value=\"Facebook\">Facebook</option><option value=\"Linkedin\">Linkedin</option><option value=\"Twitter\">Twitter</option><option value=\"Github\" selected>Github</option><option value=\"Coding profile\">Coding profile</option></select><label>Type</label></div></li><li><div class=\"input-field col s10\"><input placeholder=\"link\" id=\"Connections_text[" + in_num + "]\" type=\"text\" value=\"" + link + "\"></div></li></ul> ";
  }else if(type == "Coding profile"){
    var inner_details = " <ul><li><div class=\"input-field col s2\"><select id=\"Connections_drop[" + in_num + "]\"><option value=\"99\" disabled>Choose</option><option value=\"Facebook\">Facebook</option><option value=\"Linkedin\">Linkedin</option><option value=\"Twitter\">Twitter</option><option value=\"Github\">Github</option><option value=\"Coding profile\" selected>Coding profile</option></select><label>Type</label></div></li><li><div class=\"input-field col s10\"><input placeholder=\"link\" id=\"Connections_text[" + in_num + "]\" type=\"text\" value=\"" + link + "\"></div></li></ul> ";
  }else if(type == "Twitter"){
    var inner_details = " <ul><li><div class=\"input-field col s2\"><select id=\"Connections_drop[" + in_num + "]\"><option value=\"99\" disabled>Choose</option><option value=\"Facebook\">Facebook</option><option value=\"Linkedin\">Linkedin</option><option value=\"Twitter\" selected>Twitter</option><option value=\"Github\">Github</option><option value=\"Coding profile\">Coding profile</option></select><label>Type</label></div></li><li><div class=\"input-field col s10\"><input placeholder=\"link\" id=\"Connections_text[" + in_num + "]\" type=\"text\" value=\"" + link + "\"></div></li></ul> ";
  }

    $('#Connections_details').append(
      inner_details
      );

  $('select').material_select();    
  }

function add_filled_teacher_connections_field(in_num, type, link){
  if(type == "Facebook"){
    var inner_details = " <ul><li><div class=\"input-field col s2\"><select id=\"Connections_drop[" + in_num + "]\"><option value=\"99\" disabled>Choose</option><option value=\"Facebook\" selected>Facebook</option><option value=\"Linkedin\">Linkedin</option><option value=\"Twitter\">Twitter</option><option value=\"Github\">Github</option><option value=\"Coding prfile\">Coding profile</option></select><label>Type</label></div></li><li><div class=\"input-field col s10\"><input placeholder=\"link\" id=\"Connections_text[" + in_num + "]\" type=\"text\" value=\"" + link + "\"></div></li></ul> ";
  }else if(type == "Linkedin"){
    var inner_details = " <ul><li><div class=\"input-field col s2\"><select id=\"Connections_drop[" + in_num + "]\"><option value=\"99\" disabled>Choose</option><option value=\"Facebook\">Facebook</option><option value=\"Linkedin\" selected>Linkedin</option><option value=\"Twitter\">Twitter</option><option value=\"Github\">Github</option><option value=\"Coding prfile\">Coding profile</option></select><label>Type</label></div></li><li><div class=\"input-field col s10\"><input placeholder=\"link\" id=\"Connections_text[" + in_num + "]\" type=\"text\" value=\"" + link + "\"></div></li></ul> ";
  }else if(type == "Github"){
    var inner_details = " <ul><li><div class=\"input-field col s2\"><select id=\"Connections_drop[" + in_num + "]\"><option value=\"99\" disabled>Choose</option><option value=\"Facebook\">Facebook</option><option value=\"Linkedin\">Linkedin</option><option value=\"Twitter\">Twitter</option><option value=\"Github\" selected>Github</option><option value=\"Coding prfile\">Coding profile</option></select><label>Type</label></div></li><li><div class=\"input-field col s10\"><input placeholder=\"link\" id=\"Connections_text[" + in_num + "]\" type=\"text\" value=\"" + link + "\"></div></li></ul> ";
  }else if(type == "Coding profile"){
    var inner_details = " <ul><li><div class=\"input-field col s2\"><select id=\"Connections_drop[" + in_num + "]\"><option value=\"99\" disabled>Choose</option><option value=\"Facebook\">Facebook</option><option value=\"Linkedin\">Linkedin</option><option value=\"Twitter\">Twitter</option><option value=\"Github\">Github</option><option value=\"Coding prfile\" selected>Coding profile</option></select><label>Type</label></div></li><li><div class=\"input-field col s10\"><input placeholder=\"link\" id=\"Connections_text[" + in_num + "]\" type=\"text\" value=\"" + link + "\"></div></li></ul> ";
  }else if(type == "Twitter"){
    var inner_details = " <ul><li><div class=\"input-field col s2\"><select id=\"Connections_drop[" + in_num + "]\"><option value=\"99\" disabled>Choose</option><option value=\"Facebook\">Facebook</option><option value=\"Linkedin\">Linkedin</option><option value=\"Twitter\" selected>Twitter</option><option value=\"Github\">Github</option><option value=\"Coding prfile\">Coding profile</option></select><label>Type</label></div></li><li><div class=\"input-field col s10\"><input placeholder=\"link\" id=\"Connections_text[" + in_num + "]\" type=\"text\" value=\"" + link + "\"></div></li></ul> ";
  }

    $('#Connections_details').append(
      inner_details
      );

  $('select').material_select();    
  }



function fill_editprofile_page(){

  var in_data = {
  'user_email_id' : getCookie("cshub_user_email_id")
  };
  $.post("/get_user_profile_for_edit", JSON.stringify(in_data), function(user_profile){
    //alert(user_profile);
    user_profile = JSON.parse(user_profile);
    old_profile = user_profile;

    var t_s_type_div_body = "<input disabled id=\"t_s_type_input\" type=\"email\" value=\"registered as " + user_profile['register_type'] + "\" class=\"validate\"><label for=\"t_s_type_input\"></label>";
    $('#t_s_type_div').html(t_s_type_div_body);

    password_condition = 0;
    roll_no_condition = 0;
    w_i_count = user_profile['work_intern_count'];
    area_of_interest_count = user_profile['area_of_interest_count'];
    projects_done_count = user_profile['projects_done_count'];
    site_for_yourself_count = user_profile['site_for_yourself_count'];
    connections_count = user_profile['connections_count'];

    if(user_profile['register_type'] == "Student"){
      $('#register_details').html(
        " <nav class=\"z-depth-1 theme-color-dark-primary center\"><div class=\"nav-wrapper\"><div class=\"container\"><span class=\"theme-text-light-primary\">Student Section</span></div></div></nav><div class=\"col s12\"><nav class=\"theme-color-light-primary z-depth-0\"><span class=\"theme-text-dark-primary\">Login Details</span></nav></div><div class=\"input-field col s12\"><input placeholder=\"ge\" id=\"student_email\" type=\"email\" class=\"validate\"><label for=\"student_email\">Email address</label></div><div class=\"input-field col s12\"><input id=\"student_password\" placeholder=\"(unchanged)\" type=\"password\"><label for=\"student_password\">New Password</label></div><div class=\"input-field col s12\"><input id=\"student_re_password\" placeholder=\"(unchanged)\" type=\"password\" onblur=\"validate_password()\"><label for=\"student_re_password\">Retype password</label></div><div id=\"password_error_message\" class=\"col s12\"></div><div class=\"col s12\"><nav class=\"theme-color-light-primary z-depth-0\"><span class=\"theme-text-dark-primary\">Personal details</span></nav></div><div class=\"input-field col s12\"><input id=\"student_name\"type=\"text\"><label for=\"student_name\">Name</label></div><div class=\"input-field col s12\"><input id=\"student_roll_no\" type=\"text\" onblur=\"validate_roll_no()\"><label for=\"student_roll_no\">Roll number (optional)</label></div><div id=\"roll_no_error_message\" class=\"col s12\"></div><div class=\"col s12\"><span class=\"theme-text-dark-primary\">Profile picture (square pics are better)</span><br><span style=\"color: #d1d1d1;\">Image preview</span><div class=\"row valign-center\"><div class=\"col s6\"><div class=\"card theme-color-light-primary z-depth-0\"><div class=\"card-content\"><img id=\"square_profile_pic_preview\" class=\"materialboxed responsive-img\" width=\"300px\" height=\"300px\" src=\"images/cshublogo.png\"></div></div></div><div class=\"col s4 offset-s1\"><div class=\"card theme-color-light-primary z-depth-0 valign-center\"><div class=\"card-content\"><img id=\"circle_profile_pic_preview\" class=\"materialboxed responsive-img circle\" width=\"100px\" height=\"100px\" src=\"images/cshublogo.png\"> </div></div></div></div><form action=\"#\"><div class=\"file-field input-field\"><div class=\"col s12 z-depth-0 waves-effect waves-theme-color-light-primary btn theme-color-dark-primary theme-text-light-primary\"><span>UPLOAD</span><input id=\"profile_pic\" name=\"file\" type=\"file\" class=\"cloudinary-fileupload\" data-cloudinary-field=\"image_id\" data-form-data=\"{ &quot;upload_preset&quot;:  &quot;cshub-resource-unsigned&quot;, &quot;callback&quot;: &quot;https://cs-hub-site-nvpcewwyjt.now.sh/cloudinary_cors.html&quot;}\"></input><br></div></div></form></div><div class=\"input-field col s12\"><select id=\"a_l_type\"><option value=\"99\" disabled selected>Choose</option><option value=\"1\">Alumnus</option><option value=\"2\">Current</option></select><label>Alumnus or Current</label></div><div id=\"inner_personal_details\"></div><div class=\"col s12\"><nav class=\"theme-color-light-primary z-depth-0\"><span class=\"theme-text-dark-primary\">Additional details</span></nav></div><div><span class=\"theme-text-dark-primary\">Work/Intern experience</span><a onclick=\"add_work_intern_field()\" class=\"right z-depth-0 waves-effect waves-theme-color-dark-primary btn theme-color-light-primary theme-text-dark-primary\"><i class=\"material-icons theme-text-dark-primary\">add</i></a><div id=\"work_intern_details\"><br></div></div><div><span class=\"theme-text-dark-primary\">Areas of Interest</span><a onclick=\"add_area_of_interest_field()\" class=\"right z-depth-0 waves-effect waves-theme-color-dark-primary btn theme-color-light-primary theme-text-dark-primary\"><i class=\"material-icons theme-text-dark-primary\">add</i></a><div id=\"area_of_interest_details\"><br></div></div><div><span class=\"theme-text-dark-primary\">Projects done</span><a onclick=\"add_projects_done_field()\" class=\"right z-depth-0 waves-effect waves-theme-color-dark-primary btn theme-color-light-primary theme-text-dark-primary\"><i class=\"material-icons theme-text-dark-primary\">add</i></a><div id=\"projects_done_details\"><br></div></div><div><span class=\"theme-text-dark-primary\">Site for yourself</span><a onclick=\"add_site_for_yourself_field()\" class=\"right z-depth-0 waves-effect waves-theme-color-dark-primary btn theme-color-light-primary theme-text-dark-primary\"><i class=\"material-icons theme-text-dark-primary\">add</i></a><div id=\"own_site_details\"><br> </div></div><div><span class=\"theme-text-dark-primary\">Connections</span><a onclick=\"add_connections_field()\" class=\"right z-depth-0 waves-effect waves-theme-color-dark-primary btn theme-color-light-primary theme-text-dark-primary\"><i class=\"material-icons theme-text-dark-primary\">add</i></a><div id=\"Connections_details\"><br></div></div><div class=\"input-field col s12\"><input id=\"about_yourself\" type=\"text\"><label for=\"about_yourself\">About youself</label><div id=\"register_errors\"></div></div><div class=\"col s10 offset-s1\"><div class=\"center\"><br><a href=\"#!\" class=\"z-depth-1 waves-effect waves-theme-color-light-primary btn theme-text-light-primary theme-color-dark-primary\" onclick=\"validate_edit_profile(" + user_profile + ")\">SAVE CHANGES</a><br><br></div></div> "
        );

      //fill data
      $('#student_email').val(user_profile['user_email_id']);
      $('#student_email').focus();
      $('#student_password').val(user_profile['user_password']);
      $('#student_password').focus();
      $('#student_re_password').val(user_profile['user_password']);
      $('#student_re_password').focus();
      $('#student_name').val(user_profile['user_name']);
      $('#student_name').focus();
      $('#student_roll_no').val(user_profile['roll_number']);
      $('#student_roll_no').focus();
      $('#about_yourself').val(user_profile['about_yourself']);
      $('#about_yourself').focus();

      for(i=0;i<w_i_count;i++){
        add_filled_work_intern_field(i+1,user_profile['work_intern_details'][i]['type'],user_profile['work_intern_details'][i]['where']);
      }
      for(i=0;i<area_of_interest_count;i++){
        add_filled_area_of_interest_field(i+1,user_profile['area_of_interest_details'][i]['domain_name']);
      }
      for(i=0;i<projects_done_count;i++){
        add_filled_projects_done_field(i+1,user_profile['projects_done_details'][i]['name']);
      }
      for(i=0;i<site_for_yourself_count;i++){
        add_filled_site_for_yourself_field(i+1,user_profile['own_site_details'][i]['url']); 
      }
      for(i=0;i<connections_count;i++){
        add_filled_connections_field(i+1,user_profile['connections_details'][i]['type'],user_profile['connections_details'][i]['url']);
      }

      var temp_body = "";
      if(user_profile['course_type'] == "Bachelors"){
        temp_body += " <div id=\"course\" class=\"input-field col s12\"><select id=\"course_type\"><option value=\"99\" disabled>Choose</option><option value=\"1\" selected>Bachelors</option><option value=\"2\">Masters</option><option value=\"3\">Others</option></select><label>Course</label></div> ";
      }else if(user_profile['course_type'] == "Masters"){
        temp_body += " <div id=\"course\" class=\"input-field col s12\"><select id=\"course_type\"><option value=\"99\" disabled>Choose</option><option value=\"1\">Bachelors</option><option value=\"2\" selected>Masters</option><option value=\"3\">Others</option></select><label>Course</label></div> ";
      }else if(user_profile['course_type'] == "Others"){
        temp_body += " <div id=\"course\" class=\"input-field col s12\"><select id=\"course_type\"><option value=\"99\" disabled>Choose</option><option value=\"1\">Bachelors</option><option value=\"2\">Masters</option><option value=\"3\" selected>Others</option></select><label>Course</label></div> ";
      }

      var options_years = "";
      options_years = options_years + "<option value=\"99\" disabled>Choose</option>";
      for(i=1950;i<current_year;i++){
        if(i==user_profile['starting_year'])
          options_years = options_years + "<option value=\"" + i + "\" selected>" + i + "</option>";
        else  
          options_years = options_years + "<option value=\"" + i + "\">" + i + "</option>";
      }
      temp_body += " <div class=\"input-field col s6\"><select id=\"starting_year\">" + options_years + "</select><label>Starting year</label></div> ";

      options_years = options_years + "<option value=\"99\" disabled>Choose</option>";
      for(i=1950;i<current_year+20;i++){
        if(i==user_profile['ending_year'])
          options_years = options_years + "<option value=\"" + i + "\" selected>" + i + "</option>";
        else  
          options_years = options_years + "<option value=\"" + i + "\">" + i + "</option>";
      }
      temp_body += " <div class=\"input-field col s6\"><select id=\"ending_year\">" + options_years + "</select><label>Ending year</label></div> ";
      temp_body += " <div class=\"input-field col s12\"><input id=\"current_location\" type=\"text\"><label for=\"current_location\">Current location</label></div><div class=\"input-field col s12\"><input id=\"current_company\" type=\"text\"><label for=\"current_company\">Currently doing(eg. work at x, highers at y)</label></div> ";
      $('#inner_personal_details').html(temp_body);

      $('#current_location').val(user_profile['current_location']);
      $('#current_location').focus();
      $('#current_company').val(user_profile['current_company']);
      $('#current_company').focus();

    }
    else if(user_profile['register_type'] == "Teacher"){
      var options_years = "";
      options_years = options_years + "<option value=\"99\" disabled>Choose</option>";
      for(i=1950;i<current_year;i++){
        if(i==user_profile['starting_year'])
          options_years = options_years + "<option value=\"" + i + "\" selected>" + i + "</option>";
        else  
          options_years = options_years + "<option value=\"" + i + "\">" + i + "</option>";
      }
      $('#register_details').html(
        " <nav class=\"z-depth-1 theme-color-dark-primary center\"><div class=\"nav-wrapper\"><div class=\"container\"><span class=\"theme-text-light-primary\">Teacher Section</span></div></div></nav><div class=\"col s12\"><nav class=\"theme-color-light-primary z-depth-0\"><span class=\"theme-text-dark-primary\">Login Details</span></nav></div><div class=\"input-field col s12\"><input id=\"teacher_email\" type=\"email\" class=\"validate\"><label for=\"teacher_email\">Email address</label></div><div class=\"input-field col s12\"><input id=\"teacher_password\" type=\"password\"><label for=\"teacher_password\">New Password</label></div><div class=\"input-field col s12\"><input id=\"teacher_re_password\" type=\"password\" onblur=\"teacher_validate_password()\"><label for=\"teacher_re_password\">Retype password</label></div><div id=\"password_error_message\" class=\"col s12\"></div><div class=\"col s12\"><nav class=\"theme-color-light-primary z-depth-0\"><span class=\"theme-text-dark-primary\">Personal details</span></nav></div><div class=\"input-field col s12\"><input id=\"teacher_name\" type=\"text\"><label for=\"teacher_name\">Name</label></div><div class=\"col s12\"><span class=\"theme-text-dark-primary\">Profile picture (square pics are better)</span><br><span style=\"color: #d1d1d1;\">Image preview</span><div class=\"row valign-center\"><div class=\"col s6\"><div class=\"card theme-color-light-primary z-depth-0\"><div class=\"card-content\"><img id=\"square_profile_pic_preview\" class=\"materialboxed responsive-img\" width=\"300px\" height=\"300px\" src=\"images/cshublogo.png\"> </div></div></div><div class=\"col s4 offset-s1\"><div class=\"card theme-color-light-primary z-depth-0 valign-center\"><div class=\"card-content\"><img id=\"circle_profile_pic_preview\" class=\"materialboxed responsive-img circle\" width=\"100px\" height=\"100px\" src=\"images/cshublogo.png\"> </div></div></div></div><form action=\"#\"><div class=\"file-field input-field\"><div class=\"col s12 z-depth-0 waves-effect waves-theme-color-light-primary btn theme-color-dark-primary theme-text-light-primary\"><span>UPLOAD</span><input id=\"teacher_profile_pic\" name=\"file\" type=\"file\" class=\"cloudinary-fileupload\" data-cloudinary-field=\"image_id\" data-form-data=\"{ &quot;upload_preset&quot;:  &quot;cshub-resource-unsigned&quot;, &quot;callback&quot;: &quot;https://cs-hub-site-nvpcewwyjt.now.sh/cloudinary_cors.html&quot;}\"></input><br></div></div></form></div><div id=\"inner_personal_details\"><div class=\"input-field col s6\"><select id=\"teacher_starting_year\">" + options_years + "</select><label>Starting year</label></div><div class=\"input-field col s6\"><select id=\"teacher_ending_year\">" + options_years + "<option value=\"Current\" selected>Current</option></select><label>Ending year</label></div><div class=\"input-field col s12\"><input id=\"teacher_degrees\" type=\"text\"><label for=\"teacher_degrees\">Degrees</label></div><div class=\"input-field col s12\"><input id=\"teacher_designation\" type=\"text\"><label for=\"teacher_designation\">Designation</label></div></div><div class=\"col s12\"><nav class=\"theme-color-light-primary z-depth-0\"><span class=\"theme-text-dark-primary\">Additional details</span></nav></div><div><span class=\"theme-text-dark-primary\">Areas of Interest</span><a onclick=\"add_teacher_area_of_interest_field()\" class=\"right z-depth-0 waves-effect waves-theme-color-dark-primary btn theme-color-light-primary theme-text-dark-primary\"><i class=\"material-icons theme-text-dark-primary\">add</i></a><div id=\"area_of_interest_details\"><br></div></div><div><span class=\"theme-text-dark-primary\">Projects done</span><a onclick=\"add_teacher_projects_done_field()\" class=\"right z-depth-0 waves-effect waves-theme-color-dark-primary btn theme-color-light-primary theme-text-dark-primary\"><i class=\"material-icons theme-text-dark-primary\">add</i></a><div id=\"projects_done_details\"><br></div></div><div><span class=\"theme-text-dark-primary\">Site for yourself</span><a onclick=\"add_teacher_site_for_yourself_field()\" class=\"right z-depth-0 waves-effect waves-theme-color-dark-primary btn theme-color-light-primary theme-text-dark-primary\"><i class=\"material-icons theme-text-dark-primary\">add</i></a><div id=\"own_site_details\"><br></div></div><div><span class=\"theme-text-dark-primary\">Connections</span><a onclick=\"add_teacher_connections_field()\" class=\"right z-depth-0 waves-effect waves-theme-color-dark-primary btn theme-color-light-primary theme-text-dark-primary\"><i class=\"material-icons theme-text-dark-primary\">add</i></a><div id=\"Connections_details\"><br></div></div><div class=\"input-field col s12\"><input id=\"teacher_about_yourself\" type=\"text\"><label for=\"teacher_about_yourself\">About youself</label></div><div id=\"register_errors\"></div><div class=\"col s10 offset-s1\"><div class=\"center\"><br><a href=\"#!\" class=\"z-depth-1 waves-effect waves-theme-color-light-primary btn theme-text-light-primary theme-color-dark-primary\" onclick=\"validate_edit_profile()\">SAVE CHANGES</a><br><br></div></div> "
        );

      $('#teacher_email').val(user_profile['user_email_id']);
      $('#teacher_email').focus();
      $('#teacher_password').val(user_profile['user_password']);
      $('#teacher_password').focus();
      $('#teacher_re_password').val(user_profile['user_password']);
      $('#teacher_re_password').focus();
      $('#teacher_name').val(user_profile['user_name']);
      $('#teacher_name').focus();
      $('#teacher_degrees').val(user_profile['degrees']);
      $('#teacher_degrees').focus();
      $('#teacher_designation').val(user_profile['designation']);
      $('#teacher_designation').focus();
      $('#teacher_about_yourself').val(user_profile['about_yourself']);
      $('#teacher_about_yourself').focus();   

      for(i=0;i<area_of_interest_count;i++){
        add_filled_teacher_area_of_interest_field(i+1,user_profile['area_of_interest_details'][i]['domain_name']);
      }
      for(i=0;i<projects_done_count;i++){
        add_filled_teacher_projects_done_field(i+1,user_profile['projects_done_details'][i]['domain'],user_profile['projects_done_details'][i]['name']);
      }
      for(i=0;i<site_for_yourself_count;i++){
        add_filled_teacher_site_for_yourself_field(i+1,user_profile['own_site_details'][i]['url']); 
      }
      for(i=0;i<connections_count;i++){
        add_filled_teacher_connections_field(i+1,user_profile['connections_details'][i]['type'],user_profile['connections_details'][i]['url']);
      }

    }

    $('#square_profile_pic_preview').attr('src', user_profile['profile_pic_url']);
    $('#circle_profile_pic_preview').attr('src', user_profile['profile_pic_url']);
    profile_pic_url = user_profile['profile_pic_url'];

    $('select').material_select();

    $("input.cloudinary-fileupload[type=file]").cloudinary_fileupload();

    $('#a_l_type').on('change', function() {
      a_l_type_val = this.value;

      var options_years = "";
      options_years = options_years + "<option value=\"99\" disabled selected>Choose</option>";
      for(i=1950;i<current_year;i++){
        options_years = options_years + "<option value=\"" + i + "\">" + i + "</option>";
      }

      if(a_l_type_val == 1){
        $('#inner_personal_details').html(
          "<div id=\"course\" class=\"input-field col s12\"><select id=\"course_type\"><option value=\"99\" disabled selected>Choose</option><option value=\"1\">Bachelors</option><option value=\"2\">Masters</option><option value=\"3\">Others</option></select><label>Course</label></div><div class=\"input-field col s6\"><select id=\"starting_year\">" + options_years + "</select><label>Starting year</label></div><div class=\"input-field col s6\"><select id=\"ending_year\">" + options_years + "</select><label>Ending year</label></div><div class=\"input-field col s12\"><input id=\"current_location\" type=\"text\"><label for=\"current_location\">Current location</label></div><div class=\"input-field col s12\"><input id=\"current_company\" type=\"text\"><label for=\"current_company\">Currently doing(eg. work at x, highers at y)</label></div> "
          );

      }else if(a_l_type_val == 2){
        $('#inner_personal_details').html(
          " <div id=\"course\" class=\"input-field col s12\"><select id=\"course_type\"><option value=\"99\" disabled selected>Choose</option><option value=\"1\">Bachelors</option><option value=\"2\">Masters</option><option value=\"3\">Others</option></select><label>Course</label></div><div class=\"input-field col s6\"><select id=\"starting_year\">" + options_years + "</select><label>Starting year</label></div><div class=\"input-field col s6 disabled\"><select id=\"ending_year\"><option value=\"current\" disabled selected>Current</option></select><label>Currrent</label></div> "
          );
      }

      $('select').material_select();

    })
      
    $('#profile_pic').on('change', function(){
    $('.cloudinary-fileupload').bind('cloudinarydone', function(e, data) {  
      //alert(data.result.url);
      profile_pic_height = data.result.height;
      profile_pic_width = data.result.width;
      if(profile_pic_width <= profile_pic_height)
        profile_pic_min_dimen = profile_pic_width;
      else  profile_pic_min_dimen = profile_pic_height;

      var modified_url = "https://res.cloudinary.com/cshub-resources/image/upload/c_crop,g_face:center,w_" + profile_pic_min_dimen + ",h_" + profile_pic_min_dimen + "/v" +data.result.version + "/" + data.result.public_id;

      $('#square_profile_pic_preview').attr('src', modified_url);
      $('#circle_profile_pic_preview').attr('src', modified_url);

      profile_pic_url = modified_url;
      profile_pic_public_id = data.result.public_id;

      return true;
    });
   })

    $('#teacher_profile_pic').on('change', function(){
    $('.cloudinary-fileupload').bind('cloudinarydone', function(e, data) {  
      //alert(data.result.url);    
      profile_pic_height = data.result.height;
      profile_pic_width = data.result.width;
      if(profile_pic_width <= profile_pic_height)
        profile_pic_min_dimen = profile_pic_width;
      else  profile_pic_min_dimen = profile_pic_height;

      var modified_url = "https://res.cloudinary.com/cshub-resources/image/upload/c_crop,g_face:center,w_" + profile_pic_min_dimen + ",h_" + profile_pic_min_dimen + "/v" +data.result.version + "/" + data.result.public_id;

      $('#square_profile_pic_preview').attr('src', modified_url);
      $('#circle_profile_pic_preview').attr('src', modified_url);

      profile_pic_url = modified_url;
      profile_pic_public_id = data.result.public_id;

      return true;
    });
   })

  });

}


function validate_edit_profile(){
  $.post("/delete_user",JSON.stringify(old_profile),function(result){
    if(result == "success"){
      validate_edit_register();
      old_profile = "";
    }
    else{
      var $toastContent = $('<span>There seems to be some difficulties to overwrite details in database. Try again.</span>');
      Materialize.toast($toastContent, 3000, 'rounded');
    }
  });

}

function fill_editprofile_page_unlogged(){
  $('#register_details').html("<span class=\"col s12 center\">You are not signed in. Please try again after signing in.</span>");
}

function validate_edit_register(){

    if(old_profile['register_type'] == "Student"){
      register_type = 1;
      a_l_type = 1;
    }
    if(old_profile['register_type'] == "Teacher")
      register_type = 2;

    if($('#student_name').val() != "" || $('#teacher_name').val() != ""){
      if(register_type == 0){
        $('#user_msg_text').html("<span>Choose whether teacher or student</span>");
        $('#user_msg').modal('open');
      }
      else if(register_type == 1){
        var in_data = {
            'user_name' : $('#student_name').val(),
            'user_email_id' : $('#student_email').val()
          };
      }else if(register_type == 2){
        var in_data = {
            'user_name' : $('#teacher_name').val(),
            'user_email_id' : $('#teacher_email').val()
          }; 
      }
      $.post("/check_user_name_email_exists",JSON.stringify(in_data),function(out_data){
        if(out_data == "absent"){
          if(register_type == 0){
            $('#user_msg_text').html("<span>Choose whether teacher or student</span>");
            $('#user_msg').modal('open');
          }else if(register_type == 1){   
            if($('#student_email').attr('class') == "validate"){
              $('#user_msg_text').html("<span>Email id not entered</span>");
              $('#user_msg').modal('open');
            }else if($('#student_email').attr('class') == "validate invalid"){
              $('#user_msg_text').html("<span>Email id not valid</span>");
              $('#user_msg').modal('open');
            }else if($('#student_email').attr('class') == "validate valid"){
              /* email valid */
              if(password_condition == 2){
                $('#user_msg_text').html("<span>Password not entered</span>");
                $('#user_msg').modal('open');
              }else if(password_condition == 1){
                $('#user_msg_text').html("<span>the passwords do not match</span>");
                $('#user_msg').modal('open');
              }else if(password_condition == 0){
                /* password checked */
                if(roll_no_condition == 1){
                  $('#user_msg_text').html("<span>roll number is not valid</span>");
                  $('#user_msg').modal('open');
                }else if(roll_no_condition == 0){
                  /* roll number checked */
                  if($('#student_name').val() == ""){
                    $('#user_msg_text').html("<span>name cannot be empty</span>");
                    $('#user_msg').modal('open');
                  }else{
                    if(a_l_type_val == 2){
                      /* current student */ 
                      if($('#course_type').val() == "99" || $('#starting_year').val() == "99"){
                        $('#user_msg_text').html("<span>Some fields in Personal details are empty</span>");
                        $('#user_msg').modal('open');
                      }else{
                        register_user();
                      }
                    }else if(a_l_type_val == 1){
                      /* alumnus */
                      if($('#course_type').val() == "99" || $('#starting_year').val() == "99" || $('#ending_year').val() == "99" || $('#current_location').val() == ""){
                        $('#user_msg_text').html("<span>Some fields in Personal details are empty</span>");
                        $('#user_msg').modal('open');
                      }else{
                        register_user();
                      }
                    }
                    else if (a_l_type_val == 0){
                      $('#user_msg_text').html("<span>Choose Alumnus or student</span>");
                      $('#user_msg').modal('open');
                    }
                  }
                } 
              }
            }
          }else if(register_type == 2){
            if($('#teacher_email').attr('class') == "validate"){
              $('#user_msg_text').html("<span>Email id not entered</span>");
              $('#user_msg').modal('open');
            }else if($('#teacher_email').attr('class') == "validate invalid"){
              $('#user_msg_text').html("<span>Email id not valid</span>");
              $('#user_msg').modal('open');
            }else if($('#teacher_email').attr('class') == "validate valid"){
              /* email valid */
              if(password_condition == 2){
                $('#user_msg_text').html("<span>Password not entered</span>");
                $('#user_msg').modal('open');
              }else if(password_condition == 1){
                $('#user_msg_text').html("<span>the passwords do not match</span>");
                $('#user_msg').modal('open');
              }else if(password_condition == 0){
                /* password checked */
                if($('#teacher_name').val() == ""){
                  $('#user_msg_text').html("<span>name cannot be empty</span>");
                  $('#user_msg').modal('open');
                }else{
                  /* name is checked */
                  if($('#teacher_starting_year').val() == "99" || $('#teacher_ending_year').val() == "99" || $('#teacher_degrees').val() == "" || $('#teacher_designation').val() == ""){
                    $('#user_msg_text').html("<span>Some details in personal details are left empty</span>");
                    $('#user_msg').modal('open');
                  }else{
                    register_user();
                  }
                }
              }
            }
          }
        }else if(out_data == "name_present"){
          $('#user_msg_text').html("<span>As many people can have same name, this name is already associated with another email id. Please enter your name in a different way. Common changes are capitalisation,decapitalisation of letters, entering the full expanded name or nickname.</span>");
          $('#user_msg').modal('open');
        }else if(out_data == "email_id_present"){
          $('#user_msg_text').html("<span>Email id is already registered</span>");
          $('#user_msg').modal('open');
        }
      });
    }else{
      $('#user_msg_text').html("<span>name cannot be empty</span>");
      $('#user_msg').modal('open');
    }

    
    
}
