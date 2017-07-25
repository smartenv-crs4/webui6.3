
function getUserProfile()
{      
  if(sessionStorage.userId == undefined)
  {      
    redirectToLogin();
  }
  
  jQuery('#profileContent').localize();
  
  var templatePassword = Handlebars.compile(changePasswordTemplate); 
  jQuery('#passwordTab').html(templatePassword());
  jQuery('#passwordTab').localize();  
  
  
  //console.log(sessionStorage.token);
  jQuery.ajax({
    url: _userMsUrl + "users/" + sessionStorage.userId,
    type: "GET",
    contentType: "application/json; charset=utf-8",
    success: function(data, textStatus, xhr)
    {  
      var defaultImg = "assets/img/team/img32-md.jpg";
      
      // success
      if(data.type == "customer")
      {
        data.typeTranslate = i18next.t("profile.customer");
        var template = Handlebars.compile(customerProfileTemplate); 
        jQuery('#profile').html(template(data));                      
        jQuery('#profile').localize();
        
        
        var tFavTab = Handlebars.compile(favoriteTabTemplate); 
        jQuery("#tabContainer").append(tFavTab());
        jQuery("#tabContainer").localize();
        
        var tFav = Handlebars.compile(favoriteTemplate); 
        jQuery("#tabBodyContainer").append(tFav());
        jQuery("#tabBodyContainer").localize();                           
        
      }
      else if(data.type == "supplier")
      {
        data.typeTranslate = i18next.t("profile.supplier");
        var template = Handlebars.compile(supplierProfileTemplate); 
        jQuery('#profile').html(template(data));
        jQuery('#profile').localize();
      }
      
      getFavoriteSuppliers();
      
      if(data.logo)
      {
        jQuery("#imgBox").attr("src", data.logo);                
      }
      else
      {
        jQuery("#imgBox").attr("src", defaultImg);
      }
      
      jQuery(".editable").editable();
      jQuery(".editable").css("color", "black");
      
      
      jQuery(document).on("translate", function(){   
        var aType = jQuery("#pType").data("accounttype");        
        if(aType == "customer")
          jQuery("#pType").html(i18next.t("profile.customer"));
        else if(aType == "supplier")
          jQuery("#pType").html(i18next.t("profile.supplier"));
          
        jQuery(".editable").each(function(){          
          jQuery(this).editable("option", "emptytext", jQuery(this).data("emptytext"));          
        });               
        jQuery(".editable-empty").each(function(){
          jQuery(this).html(jQuery(this).data("emptytext"));
          
        });
      });
      
                      
    },     
    error: function(xhr, status)
    {      
      var respBlock = jQuery("#responseBlock");
      
      switch(xhr.status)
      {
        case 400: 
          if(xhr.responseJSON.error == "invalid_token")
            respBlock.html(i18next.t("error.unauthorized"))
          else if(xhr.responseJSON.error == "BadRequest")
            respBlock.html(i18next.t("error.missing_user_or_password"));
          else
            respBlock.html(xhr.responseJSON.error_message);
          break;
        case 401:
          respBlock.html(i18next.t("error.unauthorized"));
          break;
          break;
        case 500:
          respBlock.html(i18next.t("error.internal_server_error"));
          break;        
        default:
          respBlock.html(xhr.responseJSON.error_message);
      }
      respBlock.removeClass("hidden");            
      return;    
    },
    beforeSend: function(xhr, settings) 
    { 
      xhr.setRequestHeader('Authorization','Bearer ' + sessionStorage.token); 
    }                    
  });        
}



function updateProfile()
{
  if(sessionStorage.userId == undefined)
  {      
    redirectToLogin();
  }
  
  var data = new Object();
  data.user = new Object();
  
  jQuery("#profile .editable").each(function(){
    var name = jQuery(this).data("name");
    var value = jQuery(this).editable('getValue')[name];
    if(value || jQuery(this).hasClass("editable-unsaved"))
    {
      data.user[name] = value;    
    }
  });
  
  //console.log(sessionStorage.token);
  jQuery.ajax({
    url: _brokerMsUrl + "users/",
    type: "PUT",
    contentType: "application/json; charset=utf-8",
    data: JSON.stringify(data),
    dataType: "json",
    success: function(dataResp, textStatus, xhr)
    {  
      jQuery('.editable-unsaved').removeClass('editable-unsaved');
      jQuery.jGrowl(i18next.t("profile.saved"), {theme:'bg-color-green1', life: 5000});
      
      var defaultImg = "assets/img/team/img32-md.jpg";      
      
      if(data.user.logo)
      {
        console.log("si");
        jQuery("#imgBox").attr("src", data.user.logo);     
      }
      else
      {
        console.log("no");
        jQuery("#imgBox").attr("src", defaultImg);
      }      
    },     
    error: function(xhr, status)
    {
      var msg;
      try
      {
        msg = xhr.responseJSON.message;
      }
      catch(err)
      {
        msg = i18next.t("error.internal_server_error");
      }
      
      jQuery.jGrowl(msg, {theme:'bg-color-red', life: 5000});
            
      return;    
    },
    beforeSend: function(xhr, settings) 
    { 
      xhr.setRequestHeader('Authorization','Bearer ' + sessionStorage.token); 
    }                    
  });  
}

function changePassword()
{
  if(sessionStorage.userId == undefined)
  {      
    redirectToLogin();
  }
  
  var oldPassword = jQuery("#oldPassword").val();
  var newPassword = jQuery("#newPassword1").val();
  var newPassword2 = jQuery("#newPassword2").val();
  

  if(newPassword !== newPassword2 || newPassword === "")
  {
    jQuery.jGrowl(i18next.t("error.password_differs"), {theme:'bg-color-red', life: 5000});    
    return;
  }
  
  var data = new Object();
  data.oldpassword = oldPassword;
  data.newpassword = newPassword;
  
  
  //console.log(sessionStorage.token);
  jQuery.ajax({
    url: _userMsUrl + "users/" + sessionStorage.userId + "/actions/setpassword",
    type: "POST",
    contentType: "application/json; charset=utf-8",
    data: JSON.stringify(data),
    dataType: "json",
    success: function(dataResp, textStatus, xhr)
    {        
      if(!dataResp.access_credentials.error)
      {
        jQuery.jGrowl(i18next.t("profile.passwordSaved"), {theme:'bg-color-green1', life: 5000});    
      }
      else
      {
        jQuery.jGrowl(dataResp.access_credentials.error_message, {theme:'bg-color-red', life: 5000});    
      }
    },     
    error: function(xhr, status)
    {
      var msg;
      try
      {        
        msg = xhr.responseJSON.message;
      }
      catch(err)
      {
        msg = i18next.t("error.internal_server_error");
      }
      
      jQuery.jGrowl(msg, {theme:'bg-color-red', life: 5000});
            
      return;    
    },
    beforeSend: function(xhr, settings) 
    { 
      xhr.setRequestHeader('Authorization','Bearer ' + sessionStorage.token); 
    }                    
  });  
}








function getFavoriteSuppliers()
{
  if(sessionStorage.userId == undefined)
  {      
    redirectToLogin(); 
  }
  
  var ret;
  
  jQuery.ajax({
    url: _brokerMsUrl + "users/favorites",
    type: "GET",    
    contentType: "application/json; charset=utf-8",
    success: function(dataResp, textStatus, xhr)
    {        
      var tFavTab = Handlebars.compile(favoriteTableTemplate); 
      jQuery("#favoriteSuppliersList").append(tFavTab(dataResp.favoriteSupplier));        
      console.log(dataResp);
      console.log(dataResp.favoriteSupplier);
        
    },     
    error: function(xhr, status)
    {
      var msg;
      try
      {        
        msg = xhr.responseJSON.message;
      }
      catch(err)
      {
        msg = i18next.t("error.internal_server_error");
      }
      
      jQuery.jGrowl(msg, {theme:'bg-color-red', life: 5000});
            
      return;    
    },
    beforeSend: function(xhr, settings) 
    { 
      xhr.setRequestHeader('Authorization','Bearer ' + sessionStorage.token); 
    }                    
  });  
  
}
