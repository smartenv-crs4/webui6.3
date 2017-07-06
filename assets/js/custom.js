//var baseurl = "http://156.148.37.152/api/ckan/v1/";
var baseurl = "https://smartapi.crs4.it/api/ckan/v1/";  //baseurl per api ckan
//https://smartapi.crs4.it/api/ckan/v1/activities?id=test
var datasetsURL = baseurl + "datasets";
var tagsURL = baseurl + "tags";
var singleDatasetURL = baseurl + "datasets/";
var resourcesURL = baseurl + "resources/";
var _userMsUrl  = "https://smartapi.crs4.it/api/user/v1";  ///autenticazione tramite microservizio

var DateFormats = {
    short: "DD MMMM - YYYY",
    long: "dddd DD.MM.YYYY HH:mm"
};

//var content_resource = "";
//var lng = localStorage.lng;

jQuery(document).ready(function() {

    Handlebars.registerHelper('formatDate', function(datetime, format) {
        if (moment) {


            if(format == "short" || format == "long"){
                // can use other formats like 'lll' too
                format = DateFormats[format] || format;
                return moment(datetime).format(format);
            }
            else
                return moment(datetime).startOf('day').fromNow();
            //return moment(datetime).format(format);
        }
        else {
            return datetime;
        }
    });

    /*Handlebars.registerHelper('ifCond', function(v1, v2, options) {
        if(v1 === v2) {
            return options.fn(this);
        }
        return options.inverse(this);
    });*/

    //jQuery('#header_p').html(header_template);
    /*if(sessionStorage.token)
    {
        alert(sessionStorage.token);
    }*/

    var headerCompiled = Handlebars.compile(header_template);
    var headerHTML = headerCompiled({
        //isLogged: isLogged(),
        //isHome : window['isHome'] || false
    });

    jQuery('#header_p').html(headerHTML);

    if(jQuery('#footer_p').length > 0)
    {
        var footerCompiled = Handlebars.compile(footer_template);
        jQuery('#footer_p').html(footerCompiled);
    }

    jQuery('body').localize();

    /*********************
     INTERNATIONALIZATION
     *********************/
    if (localStorage.lng) {
        var l = jQuery(".languages a[data-lng='" + localStorage.lng + "']");
        if (l.length > 0) {
            if (localStorage.lng != jQuery(".languages .active a").first().attr("data-lng")) {
                var lngSel = jQuery(".languages .active").first();
                lngSel.empty();
                lngSel.append(l[0].cloneNode(true));
                var c = document.createElement("i");
                c.className = "fa fa-check";
                lngSel.find("a").first().append(c);

                //i18next.changeLanguage(localStorage.lng, function (){});
            }
            //i18next.changeLanguage(localStorage.lng, function (){});
            jQuery('body').localize();
        }
    }
    else
    {
        localStorage.lng = jQuery(".languages .active a").first().data("lng");

        //i18next.changeLanguage(localStorage.lng, function(){});
        jQuery('body').localize();
    }

    jQuery(".languages a").click(function () {
        if (jQuery(this).attr("data-lng")) {
            localStorage.lng = jQuery(this).attr("data-lng");
            //localStorage.lng = lng;
            var lngSel = jQuery(".languages .active").first();
            lngSel.empty();
            lngSel.append(this.cloneNode(true));
            var c = document.createElement("i");
            c.className = "fa fa-check";
            lngSel.find("a").first().append(c);

            //i18next.changeLanguage(localStorage.lng, function (){});
            jQuery('body').localize();
            jQuery(document).trigger('translate');
        }
    });

    if (jQuery(".footer-language").length > 0) {
        var fl = jQuery(".footer-language select").first();

        if (localStorage.lng != undefined) {
            fl.val(localStorage.lng);
        }

        fl.change(function () {
            var lng = jQuery(this).val();
            localStorage.lng = lng;

            //i18next.changeLanguage(localStorage.lng, function (){});
            jQuery('body').localize();
            jQuery(document).trigger('translate');
        });
    }

    /*************************************
     ** AGGIORNAMENTO MENU' DOPO LOGIN  **
     *************************************/

    if(sessionStorage.token)
    {
        jQuery("#h_login").hide();
        jQuery("#h_user strong").html(sessionStorage.username);
    }
    else
    {
        jQuery("#h_logout").hide();
        jQuery("#h_user").hide();
        jQuery("#h_addData").hide();
    }

    loadCookieLawBar();

});

/*****************************
 * INIT INTERNATIONALIZATION *
 *****************************/
i18next.init({
    lng: localStorage.lng, // evtl. use language-detector https://github.com/i18next/i18next-browser-languageDetector
    fallbackLng: "en",
    resources: translation
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


/*******************************************
 ****************** UTILS ******************
 *******************************************/


function isValidEmailAddress(emailAddress) {
    var pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
    return pattern.test(emailAddress);
}


function cacheCompile(templateid, data) {
    if (!window[templateid + "_template"]) {
        window[templateid + "_template"] = Handlebars.compile($('#' + templateid).html());
    }
    return window[templateid + "_template"](data);
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}


/*************************************
 *** FUNCTIONS AFTER SIGNIN/SIGNUP ***
 *************************************/


function redirectToPrevPage() {
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
/*******************************************/
function redirectToHome() {
    window.location.href = "index.html";
}
/*******************************************/
function redirectToDashboard() {
    sessionStorage.prevPage = window.location.href;
    window.location.href = "dashboard.html";
}

/*******************************************/
function logout() {
    //sessionStorage.token = undefined;
    //sessionStorage.userId = undefined;
    sessionStorage.clear();
    window.location.replace("login.html");
}

function redirectToPage(page) {
    window.location.href = page;
}



/**************************************************
**** GET ACTIVITY USER LIST - DASHBOARD UTENTE ****
***************************************************/

function getActivities(targetid, templateid) {

    var user_apikey = "";   // "cf142393-6986-408b-a9b4-dfb133f368c8";

    if(sessionStorage.ckan_apikey){
        user_apikey = sessionStorage.ckan_apikey;
    }

    jQuery.ajax({
        url: baseurl + "dashboard",
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        crossDomain : true,
        success: function(data, textStatus, xhr)
        {
            // success
            if(xhr.status == 200)
            {
                //alert("success: " + xhr.status);
                var target = "#" + targetid;
                var r;
                var mydata = data.result;

                var compiled = cacheCompile(templateid, {
                        result: mydata
                    }
                );

                $(target).empty();
                $(target).html(compiled);
                return;
            }
            // error
            else
            {
                //respBlock.html(xhr.responseJSON.error_message);
                alert(JSON.stringify(xhr.responseJSON));
                //respBlock.removeClass("invisible");
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
                        alert($.t("error.unauthorized"));
                    else if(xhr.responseJSON.error == "BadRequest")
                        alert($.t("error.missing_user_or_password"));
                    else
                        alert(xhr.responseJSON.error_message);
                    break;
                case 500:
                    alert($.t("error.internal_server_error"));
                    break;
                case 403:
                    alert($.t("error.invalid_auth"));
                    break;
                default:
                    alert(xhr.responseJSON.error_message);
            }
            //respBlock.removeClass("invisible");
            return;
        },
        beforeSend: function(xhr, settings)
        {
            xhr.setRequestHeader('Authorization', user_apikey);
        }
    });
}

/**************************************
 ************ GET DATASETS ************
 **************************************/
function getDatasets(url,targetid, templateid, page, limit) {

    if (!limit)
        limit = 5;
    if (!page)
        page = 1;

    var target = "#" + targetid;


    $.get(url, function (data) {
        console.log(data);

        var mydata = data.result;

        var total = 0;
        if (data.result.count>0 && data.result.results){
            mydata =  data.result.results.slice((page - 1) * limit, page * limit);
            total = data.result.count / limit;
        }

        if (data.result.length>0 &&  (!data.result.results)) {
            mydata = data.result.slice((page - 1) * limit, page * limit);
            total = data.result.length / limit;
        }

        if (data.result.count==0 || data.result.length==0){
            var compiled = "<b>Non sono presenti dataset per la ricerca effettuata! <br><br><br> <a href='datasets.html'>>> Vedi tutti i dataset presenti <<</a> </b>";
        }
        else{
            var compiled = cacheCompile(templateid, {
                    result: mydata
                }
            );
        }

        $(target).empty();
        $(target).html(compiled);

        var pagination = cacheCompile("pagination_template", {
            pagination: {
                page: page,
                pageCount: Math.ceil(total)
            }
        });


        $("#pagination_container").empty();
        if (total > 1)
            $("#pagination_container").html(pagination);
        $(target).localize();
        $("ul.pagination").localize();
        $(target).trigger('onload');

    });
}


function getSimple(url, targetid, templateid, cb) {

    var target = "#" + targetid;

    $.get(url, function (data) {
        console.log(data);
        var compiled = cacheCompile(templateid, data);

        $(target).empty();
        $(target).html(compiled);

        if (cb) cb();
    });
};

function getContentResource(url, targetid, templateid) {

    var target = "#" + targetid;
    var div_text = "";

    $.get(url, function (data) {
        console.log(data);
        var url_res = data.result.url;
        //alert(JSON.stringify(data.result));


        $(document).ready(function () { // load json file using jquery ajax
            if(data.result.mimetype == "application/json"){
                readJSONResponse(url_res, div_text, target);
            } else if (data.result.mimetype == "text/csv"){
                readCSVResponse(url_res, target);
            } else if (data.result.mimetype == "application/xml"){
                readXMLResponse(url_res, target);
            }
            else{
                div_text += "<br><b>Preview not availaible at the moment.<br><br><a href='"+url_res+"' target='blank'>Download the original file.</a></b>";
                $(target).html(div_text);
            }

            /*if(sessionStorage.username){
                allowEditDataset(sessionStorage.username, data.result.package_id);
            }*/

        });


    });
}

function readJSONResponse(url, div_text, target){

    $.getJSON(url, { get_param: 'value' }, function(data) {

        $.each(data, function(index, element) {

            div_text = "<pre style='max-height: 300px'>{"
            var json_to_parse = JSON.stringify(element);
            var json = $.parseJSON(json_to_parse);

            $(json).each(function(i,val){
                $.each(val,function(k,v){
                    div_text += "<br>&emsp;<b>" + k+ "</b> : "+ v ;

                });
            });

            div_text += "<br>}</pre><br><br><a href='"+url+"' target='blank'>Download the original file.</a>";
            $(target).html(div_text);
        });
    });
}

function readCSVResponse(url, target){

    //var div_text = "<br><b>Preview not availaible at the moment.<br><br><a href='"+url+"' target='blank'>Download the original file.</a></b>";
    //$(target).html(div_text);

    $.get(url,function(data, target){
        processDataCsv(data, target, url);
    }).fail(function() {
        var div_text = "<br><b>Preview not availaible at the moment.<br><br><a href='"
                            +url
                            +"' target='blank'>Try to download the original file.</a></b>";
        $(target).html(div_text);
    });
}


function processDataCsv(allText, target, url) {
    var allTextLines = allText.split(/\r\n|\n/);
    //alert(allTextLines);//OK
    var headers = allTextLines[0].split(',');
    //alert(headers);//OK
    var lines = [];

    for (var i = 1; i < allTextLines.length; i++) {
        var data = allTextLines[i].split(',');

        //if(i==1) alert(data);  //OK
        //alert(data.length + " =/= " + headers.length);
        var tarr = [];
        for (var j = 0; j < headers.length; j++) {
            tarr.push(data[j]);
        }
        lines.push(tarr);
    }
    //alert(lines);
    drawOutputCsv(headers, lines, target);
    var div_text = document.createElement("div");
    div_text.innerHTML= "<br><br><a href='"+url+"' target='blank'>Download the original file.</a>";
    document.getElementById("contentResource").appendChild(div_text);
}

function drawOutputCsv(headers, lines, target) {
    //Clear previous data
    //document.getElementById("output").innerHTML = "";
    var table = document.createElement("table");

    var row = table.insertRow(-1);
    for (var j = 0; j < headers.length; j++) {
        var cell = row.insertCell(-1);
        cell.innerHTML = "<b>" + headers[j] + "</b>";
    }

// visualizzo solo le prime 3 linee
    for (var i = 0; i < 3; i++) {
        var row = table.insertRow(-1);
        for (var j = 0; j < lines[i].length; j++) {
            var firstNameCell = row.insertCell(-1);
            firstNameCell.appendChild(document.createTextNode(lines[i][j]));
        }
    }
    document.getElementById("contentResource").appendChild(table);

}

function readXMLResponse(url, target){

    /*
    from http://kincrew.github.io/xReader/
     <script src="http://kincrew.github.com/xReader/xReader.full.js"></script>
     */
    xReader(url, function(data) {

        if (data.content != undefined){
            var text_to_load = jQuery('<div />').text(data.content).html();

            //alert(text_to_load);


            // var div_text = '<textarea rows="12" cols="500" style="border:none;">' + text_to_load + '</textarea>';
            var div_text = '<pre style="max-height: 250px">' + data.content + '</pre>';

            div_text += "<br><br><a href='"+url+"' target='blank'>Download the original file.</a>";

        } else {
            var div_text = "<br><b>Preview not availaible at the moment.<br>" +
                "<br><a href='"+url+"' target='blank'>Download the original file.</a>";
        }


        $(target).html(div_text);
    });
}

/*** DASHBOARD - button getMyDatasets ***/
function getMyDatasets(){

    //alert(sessionStorage.username);

    window.location.href="datasets.html?q=author:" + sessionStorage.username;

}

/*** FORM ADD RESOURCE ***/
function display_div_url(){

    jQuery("#link-or-api").show();
    jQuery("#upload_resource").hide();

}
function hide_div_url(){

    jQuery("#link-or-api").hide();
    jQuery("#upload_resource").show();

}


/****************
 *** COOKIES ****
 ****************/


function loadCookieLawBar()
{
    var links = document.getElementsByTagName('link');
    var needCSS = true;

    for ( var i = 0; i < links.length; i++ )
    {
        if ( links[i].href == "assets/css/jquery.cookiebar.css" )
            needCSS = false;
    }

    if ( needCSS )
    {
        var ls = document.createElement('link');
        ls.rel="stylesheet";
        ls.href="assets/css/jquery.cookiebar.css";
        document.getElementsByTagName('head')[0].appendChild(ls);
    }

    if(jQuery.cookieBar != "function")
    {
        var j = document.createElement('script');
        j.type = 'text/javascript';
        document.getElementsByTagName('head')[0].appendChild(j);
        j.src = 'assets/js/plugins/jquery.cookiebar.js';

        j.onload = function()
        {
            initCookieBar();
        }
    }
    else
    {
        initCookieBar();
    }


    jQuery(document).on("translate", function(){
        if(jQuery("#cookie-bar .cb-enable").length > 0)
        {
            var button = jQuery("#cookie-bar .cb-enable").first()[0].cloneNode(true);
            jQuery("#cookie-bar p").html(jQuery.i18n.t("cookieLaw.message"));
            button.innerHTML = jQuery.i18n.t("cookieLaw.accept");
            jQuery("#cookie-bar p").append(button);
        }
    })
}
function initCookieBar()
{
    jQuery.cookieBar({
        message: jQuery.i18n.t("cookieLaw.message"),
        //declineButton: true,
        acceptText: jQuery.i18n.t("cookieLaw.accept"),
        declineText: jQuery.i18n.t("cookieLaw.decline"),
        declineFunction: function() {
            window.location.href = "http://www.crs4.it";
        },
        //renewOnVisit: true,
        expireDays: 90,
        //autoEnable: false,
    });

    jQuery("#cookie-bar p").css("color", "#FFFFFF");
}

