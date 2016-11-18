var baseurl = "http://156.148.37.152/api/ckan/v1/";
var datasetsURL = baseurl + "datasets";
var tagsURL = baseurl + "tags";
var singleDatasetURL = baseurl + "datasets/";

var resourcesURL = baseurl + "resources/";
var content_resource = "";

var lng = localStorage.lng;

jQuery(document).ready(function () {
    jQuery('body').localize();
    jQuery('#header_p').html(header_template);
    if (lng != undefined) {
        var l = jQuery(".languages a[data-lng='" + lng + "']");
        if (l.length > 0) {
            if (lng != jQuery(".languages .active a").first().attr("data-lng")) {
                var lngSel = jQuery(".languages .active").first();
                lngSel.empty();
                lngSel.append(l[0].cloneNode(true));
                var c = document.createElement("i");
                c.className = "fa fa-check";
                lngSel.find("a").first().append(c);
                i18next.changeLanguage(lng, function () {
                });
                jQuery('body').localize();
            }
        }
    }

    jQuery(".languages a").click(function () {
        if (jQuery(this).attr("data-lng")) {
            lng = jQuery(this).attr("data-lng");
            localStorage.lng = lng;
            var lngSel = jQuery(".languages .active").first();
            lngSel.empty();
            lngSel.append(this.cloneNode(true));
            var c = document.createElement("i");
            c.className = "fa fa-check";
            lngSel.find("a").first().append(c);
            i18next.changeLanguage(lng, function () {
            });
            jQuery('body').localize();
            jQuery(document).trigger('translate');
        }

    });

    if (jQuery(".footer-language").length > 0) {
        var fl = jQuery(".footer-language select").first();

        if (lng != undefined) {
            fl.val(lng);
        }

        fl.change(function () {
            var lng = jQuery(this).val();
            localStorage.lng = lng;
            i18next.changeLanguage(lng, function () {
            });
            jQuery('body').localize();
            jQuery(document).trigger('translate');

        });
    }


});


//i18next.use(i18nextXHRBackend);
i18next.init({
    lng: lng, // evtl. use language-detector https://github.com/i18next/i18next-browser-languageDetector
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

/*******************************************
 ******************* getDatasets ***********
 *******************************************/
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
        var compiled = cacheCompile(templateid, {
                result: mydata
            }
        );
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


    $.get(url, function (data) {
        console.log(data);
        var url_res = data.result.url;


        $(target).load(url_res, function(response, status, xhr ) {

           

            if ( status == "error" ) {
                var msg = "Sorry but there was an error: ";
                $( "#error" ).html( msg + xhr.status + " " + xhr.statusText );
            }
        });



    });
}
