

var _access_token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJtb2RlIjoibXMiLCJpc3MiOiJub3QgdXNlZCBmbyBtcyIsImVtYWlsIjoibm90IHVzZWQgZm8gbXMiLCJ0eXBlIjoiYXV0aG1zIiwiZW5hYmxlZCI6dHJ1ZSwiZXhwIjoxNzk2NDgxMjM3NDU3fQ.O8ITzSSUyq7FDB5sVRs06zjjjcegyRtWB2oHQsTgp6U";



jQuery(document).ready(function(){
  jQuery("#inupblock").keypress(function (e) {
    var key = e.which;
    if(key == 13)  // the enter key code
    {
      signIn();      
      return false;  
    }
  });  
});


jQuery(document).on("translate", function(){
  jQuery('.selectpicker').selectpicker('refresh');
});


/*******************************************
 ****************** SIGN-IN ****************
 ******************************************/

 function signIn()
 {

   var email = jQuery("#signInEmail").val();
   var password = jQuery("#signInPassword").val();

   var respBlock = jQuery("#signInResponse");

   if(respBlock.is(":visible"))
   {
     respBlock.addClass("invisible");
   }

   if(!isValidEmailAddress(email))
   {
     respBlock.html(i18next.t("error.invalid_email"));
     respBlock.removeClass("invisible");
     return;
   }


   var data = new Object();
   //data["user"] = new Object();
   data["username"] = email;
   data["password"] = password;

   jQuery.ajax({
     url: _userMsUrl + "users/signin",
     type: "POST",
     data: JSON.stringify(data),
     contentType: "application/json; charset=utf-8",
     dataType: "json",
     crossDomain : true,
     success: function(data, textStatus, xhr)
     {
       // success
       //alert("success: " + xhr.status);
       if(xhr.status == 200)
       {

         //alert("credenziali");
         //alert(JSON.stringify(data["access_credentials"]));

         /*
          //==== in sign-up ====//
          sessionStorage.token = data["access_credentials"]["apiKey"]["token"];
          sessionStorage.userId = data["created_resource"]["_id"];
          sessionStorage.ckan_apikey =data["created_resource"]["ckan_apikey"];
          sessionStorage.email = data["created_resource"]["email"];
          */

         // DA VERIFICARE //
         sessionStorage.token = data["access_credentials"]["apiKey"]["token"];
         sessionStorage.userId = data["access_credentials"]["userId"];
         sessionStorage.email = email;
         sessionStorage.ckan_apikey = data["access_credentials"]["ckan_apikey"];
         sessionStorage.username = data["access_credentials"]["ckan_username"];

         //alert("session-storage");
         //alert(JSON.stringify(sessionStorage));

         //redirectToPrevPage();
         redirectToDashboard();

         return;
       }
       // error
       else
       {
         respBlock.html(xhr.responseJSON.error_message);
         alert(JSON.stringify(xhr.responseJSON));
         respBlock.removeClass("invisible");
         return;
       }
     },
     error: function(xhr, status)
     {
       alert("error: " + xhr.status);
       switch(xhr.status)
       {
         case 400:
           if(xhr.responseJSON.error == "invalid_token")
             respBlock.html(i18next.t("error.unauthorized"));
           else if(xhr.responseJSON.error == "BadRequest")
             respBlock.html(i18next.t("error.missing_user_or_password"));
           else
             respBlock.html(xhr.responseJSON.error_message);
           break;
         case 500:
           respBlock.html(i18next.t("error.internal_server_error"));
           break;
         case 403:
           respBlock.html(i18next.t("error.invalid_auth"));
           break;
         default:
           respBlock.html(xhr.responseJSON.error_message);
       }
       respBlock.removeClass("invisible");
       return;
     },
     beforeSend: function(xhr, settings)
     {
       xhr.setRequestHeader('Authorization','Bearer ' + _access_token);
     }
   });
 }


/*******************************************
 ****************** SIGN-UP ****************
 ******************************************/

function signUp() {

  var email = jQuery("#signUpEmail").val();
  //var name = jQuery("#signUpName").val();
  var password = jQuery("#signUpPassword").val();
  var password2 = jQuery("#signUpPassword2").val();

  var userType = "ckan_user";

  var respBlock = jQuery("#signUpResponse");

  if(respBlock.is(":visible"))
  {
    respBlock.addClass("invisible");
  }

  if(!isValidEmailAddress(email))
  {
    respBlock.html(i18next.t("error.invalid_email"));
    respBlock.removeClass("invisible");
    return;
  }


  if(password !== password2 || password === "")
  {
    respBlock.html(i18next.t("error.password_differs"));
    respBlock.removeClass("invisible");
    return;
  }

  //////////////////// ckan username viene generato dal microservizio userms
  //data["user"]["username"] = username;
  /*
   {"user":
   {
   "email": "pippo.1@pippo.com",
   "password": "pippo123",
   "name": "Pippo",
   "type": "ckan_user"
   }
   }
   */

  var data = new Object();
  data["user"] = new Object();
  data["user"]["email"] = email;
  data["user"]["password"] = password;
  //data["user"]["name"] = name;
  data["user"]["type"] = userType;
  //alert(JSON.stringify(data));


  jQuery.ajax({
    url: _userMsUrl + "users/signup",
    type: "POST",
    data: JSON.stringify(data),
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    crossDomain : true,
    success: function(data, textStatus, xhr)
    {
      //alert(JSON.stringify(xhr));
      // success
      if(xhr.status == 201)
      {


        //alert("data");
        //alert(JSON.stringify(data));

        sessionStorage.token = data["access_credentials"]["apiKey"]["token"];
        sessionStorage.userId = data["created_resource"]["_id"];
        if(data["created_resource"]["ckan_apikey"]){
          sessionStorage.ckan_apikey =data["created_resource"]["ckan_apikey"];
        } else{
          alert(i18next.t("error.invalid_auth"));
          window.location.replace("login.html");
        }

        sessionStorage.email = email;
        sessionStorage.username = data["created_resource"]["ckan_username"];
        //alert("sessionStorage");
        //alert(JSON.stringify(sessionStorage));
        //redirectToPrevPage();
        redirectToDashboard();
      }
      else
      {
        alert(xhr.responseJSON.error_message);
        respBlock.html(xhr.responseJSON.error_message);
        respBlock.removeClass("invisible");
        return;
      }
    },
    error: function(xhr, status)
    {
      alert(xhr.responseJSON.error_message);
      switch(xhr.status)
      {
        case 400:
          if(xhr.responseJSON.error == "invalid_token")
            respBlock.html(i18next.t("error.unauthorized"));
          else if(xhr.responseJSON.error == "BadRequest")
            respBlock.html(i18next.t("error.missing_user_or_password"));
          else
            respBlock.html(xhr.responseJSON.error_message);
          break;
        case 401:
          respBlock.html(i18next.t("error.bad_request"));
          break;
        case 403:
          respBlock.html(i18next.t("error.invalid_auth"));
          break;
        case 500:
          respBlock.html(i18next.t("error.internal_server_error"));
          break;
        default:
          respBlock.html(xhr.responseJSON.error_message);
      }
      respBlock.removeClass("invisible");
      return;
    },
    beforeSend: function(xhr, settings)
    {
      xhr.setRequestHeader('Authorization','Bearer ' + _access_token);
    }
  });
}
