/* Write here your custom javascript codes */
var _authMsUrl  = "http://seidue.crs4.it:3007/";
var _userMsUrl  = "http://seidue.crs4.it:3008/";
var _brokerMsUrl  = "http://seidue.crs4.it:3009/api/v1/";
_access_token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJtb2RlIjoibXMiLCJpc3MiOiJub3QgdXNlZCBmbyBtcyIsImVtYWlsIjoibm90IHVzZWQgZm8gbXMiLCJ0eXBlIjoiYXV0aG1zIiwiZW5hYmxlZCI6dHJ1ZSwiZXhwIjoxNzg1NTc1MjQ3NTY4fQ.Du2bFjd0jB--geRhnNtbiHxcjQHr5AyzIFmTr3NFDcM";

var lng = localStorage.lng;

jQuery(document).ready(function(){
  jQuery('body').localize();
  jQuery('#header_p').html(header_template);
  if (lng != undefined)
  {
    var l = jQuery(".languages a[data-lng='" + lng +"']");
    if(l.length > 0)
    {
      if(lng != jQuery(".languages .active a").first().attr("data-lng"))
      {
        var lngSel = jQuery(".languages .active").first();
        lngSel.empty();
        lngSel.append(l[0].cloneNode(true));
        var c = document.createElement("i");
        c.className = "fa fa-check";
        lngSel.find("a").first().append(c);
        i18next.changeLanguage(lng, function(){});
        jQuery('body').localize();
      }
    }
  }

  jQuery(".languages a").click(function(){    
    if(jQuery(this).attr("data-lng"))
    {
      lng = jQuery(this).attr("data-lng");
      localStorage.lng = lng;
      var lngSel = jQuery(".languages .active").first();
      lngSel.empty();
      lngSel.append(this.cloneNode(true));
      var c = document.createElement("i");
      c.className = "fa fa-check";
      lngSel.find("a").first().append(c);
      i18next.changeLanguage(lng, function(){});
      jQuery('body').localize();
      jQuery(document).trigger('translate');
    }

  });
  
  if(jQuery(".footer-language").length > 0)
  {
    var fl = jQuery(".footer-language select").first();
    
    if (lng != undefined)
    {
      fl.val(lng);
    }
    
    fl.change(function(){
      var lng = jQuery(this).val();
      localStorage.lng = lng;
      i18next.changeLanguage(lng, function(){});
      jQuery('body').localize();
      jQuery(document).trigger('translate');
      
    });
  }


});


//i18next.use(i18nextXHRBackend);
i18next.init({
  lng: lng, // evtl. use language-detector https://github.com/i18next/i18next-browser-languageDetector
  fallbackLng: "en",
  resources:  translation
}, function (err, t) {
  jqueryI18next.init(i18next, jQuery,
  {
    tName: 't', // --> appends $.t = i18next.t
    i18nName: 'i18n', // --> appends $.i18n = i18next
    handleName: 'localize', // --> appends $(selector).localize(opts);
    selectorAttr: 'data-i18n', // selector for translating elements
    targetAttr: 'i18n-target', // data-() attribute to grab target element to translate (if diffrent then itself)
    optionsAttr: 'i18n-options', // data-() attribute that contains options, will load/set if useOptionsAttr = true
    useOptionsAttr: false, // see optionsAttr
    parseDefaultValueFromContent: true // parses default values from content ele.val or ele.text
  });

});

/*
jqueryI18next.init(i18next, jQuery,
{
  tName: 't', // --> appends $.t = i18next.t
  i18nName: 'i18n', // --> appends $.i18n = i18next
  handleName: 'localize', // --> appends $(selector).localize(opts);
  selectorAttr: 'data-i18n', // selector for translating elements
  targetAttr: 'i18n-target', // data-() attribute to grab target element to translate (if diffrent then itself)
  optionsAttr: 'i18n-options', // data-() attribute that contains options, will load/set if useOptionsAttr = true
  useOptionsAttr: false, // see optionsAttr
  parseDefaultValueFromContent: true // parses default values from content ele.val or ele.text
});
*/
/*
jQuery(document).ready(function(){
  console.log(jQuery.i18n.language)
  console.log(jQuery.i18n.t("error.invalid_email"))
});
*/



/*******************************************
 ****************** UTILS ******************
 *******************************************/
function isValidEmailAddress(emailAddress)
{
  var pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
  return pattern.test(emailAddress);
};


 /*******************************************
 *******************************************/

function logout()
{
  //sessionStorage.token = undefined;
  //sessionStorage.userId = undefined;
  sessionStorage.clear();
  window.location.replace("page_login_and_registration2.html");  
}


function redirectToLogin()
{
  sessionStorage.prevPage = window.location.href;
  window.location.href = "../../page_login_and_registration2.html";
}

function redirectToHome()
{
  window.location.href = "../../index.html";
}

function redirectToPrevPage()
{
  if(sessionStorage.prevPage != undefined)
  {
    var p = sessionStorage.prevPage;
    sessionStorage.prevPage = undefined;    
    window.location.href = p;
  }
  else
  {
    redirectToHome();
  }
}
