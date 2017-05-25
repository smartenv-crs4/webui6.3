/**
 * Created by valentinamarotto on 16/05/17.
 *
 * Functions about creation and management of datasets
 *
 * URL API - https://smartapi.crs4.it/api/ckan/v1/datasets/
 * METHOD - POST
 * BODY OF THE REQUEST
 * {
    "title": "dataset title",
    "name": "dataset-title",  // dataset title words in lowercase characters separated by a -
    "notes": "text/escription",
    "author": "author name",
    "author_email": "author email",
    "license_id":"license",
    "url":"source",
    "version":"version",
    "type":"dataset",
    "resources":[
    	{
        	"name":"resource name",
        	"url":"url of remote resource",
        	"description":"text/description",
        	"format":"json (or other format)",
        	"mimetype":"application/json",
        	"resource_type":"json"
        },
        ...
    ],
    "tags":[
    	{"id":"tag1", "name":"tag1"},
    	{"id":"tag2", "name":"tag2"},
    	...
}

 *
 */

var addDataset_url = "https://smartapi.crs4.it/api/ckan/v1/datasets";  //baseurl per ckan api datasets

var dataset_resources = [];  //array da utilizzare nel caso di caricamento si più risorse



function addDataset() {

    var user_apikey = "";   // "cf142393-6986-408b-a9b4-dfb133f368c8";

    if(sessionStorage.ckan_apikey){
        user_apikey = sessionStorage.ckan_apikey;
    }

    var resources = [];
    if (dataset_resources.length < 1){
        addNewResource();
        resources = dataset_resources;
    } else {
        resources = dataset_resources;
        dataset_resources = [];
    }


    var tags = [];
    var t = jQuery("#tags").val().split(",");
    for(i in t){
        var tag = new Object();
        tag["id"] = "tag" + Math.floor(Math.random()*1000000);  //creare id tag
        tag["name"] = t[i];  //valutare "comma separated"
        tags.push(tag);
    }

    // inserire tutti i campi del form
    var title = jQuery("#title").val();
    if (title == ""){
        alert($.t('datasets.required_field'));   ///Required field
        $("#title").focus();
        return false;
    }


    var name = title.replace(/ /gi, "-");


    // BODY OF THE REQUEST
    var data = new Object();
    data["title"] = title;  //jQuery("#title").val();
    data["name"] = name.toLowerCase(); // dataset title words in lowercase characters separated by a -
    data["notes"] = jQuery("#description").val();
    data["author"] = jQuery("#author").val();
    data["author_email"] = jQuery("#author_email").val();
    data["license_id"] = jQuery("#license").val();
    data["url"] = jQuery("#source").val();
    data["version"] = jQuery("#version").val();
    data["type"] = "dataset";
    data["resources"] = resources;
    data["tags"] = tags;


    //alert(JSON.stringify(data));

    jQuery.ajax({
        url: addDataset_url,
        type: "POST",
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        crossDomain : true,
        success: function(data, textStatus, xhr)
        {
            // success
            if(xhr.status == 200)
            {
                alert($.t('datasets.loaded'));

                // se il dataset viene salvato senza errori il redirect è verso la pagina di dettaglio del dataset
                window.location.href="datasets.html?id="+name;
            }
            else
            {
                //alert(xhr.status);
                alert(xhr.responseJSON.error_message);
                //respBlock.html(xhr.responseJSON.error_message);
                //respBlock.removeClass("invisible");
                alert(xhr.responseJSON.error_message);
                return;
            }
        },
        error: function(xhr, status)
        {
            //alert("error1");
            alert("Error: "+xhr.status);
            //alert(xhr.responseJSON.error_message);
            switch(xhr.status)
            {
                case 400:
                    if(xhr.responseJSON.error == "invalid_token")
                        //respBlock.html(i18next.t("error.unauthorized"));
                        alert($.t("error.unauthorized"));
                    else if(xhr.responseJSON.error == "BadRequest")
                        //respBlock.html(i18next.t("error.missing_user_or_password"));
                        alert($.t("error.missing_user_or_password"));
                    else
                        //respBlock.html(xhr.responseJSON.error_message);
                        alert(xhr.responseJSON.error_message);
                    break;
                case 401:
                    //respBlock.html(i18next.t("error.bad_request"));
                    alert($.t("error.bad_request"));
                    break;
                case 403:
                    //respBlock.html(i18next.t("error.invalid_auth"));
                    alert($.t("error.invalid_auth"));
                    break;
                case 500:
                    //respBlock.html(i18next.t("error.internal_server_error"));
                    alert($.t("error.internal_server_error"));
                    break;
                default:
                    //respBlock.html(xhr.responseJSON.error_message);
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


function addNewResource(){
    var res = new Object();
    var res_name = jQuery("#res_name").val();
    var res_url = jQuery("#resource-link-or-api").val();
    var res_desc = jQuery("#res_description").val();

    if (res_name != "")
        res["name"] = res_name;
    else
        res["name"] = "res"+ Math.floor(Math.random()*10000);

    if (res_url != "")
        res["url"] =  res_url; //resource-link-or-api
    else{
        alert($.t('datasets.required_field'));   ///Required field
        $("#resource-link-or-api").focus();
        return false;
    }


    res["description"] = res_desc;

    var format = jQuery("#format").val();
    res["format"] = format;

    if(format == "json")
        res["mimetype"] = "application/json";   //in base al format json=application/json

    if(format == "xml")
        res["mimetype"] = "application/xml";   //in base al format xml=application/xml

    if(format == "csv")
        res["mimetype"] = "text/csv";   //in base al format xml=application/xml

    if(format == "api")
        res["mimetype"] = "application/json";   //in base al format api=application/json

    if(format == "notspecified")
        res["mimetype"] = "not specified";

    res["resource_type"] = format; //in base al format
    dataset_resources.push(res);


    $("#res_name").val('');
    $("#res_description").val('');
    $("#resource-link-or-api").val('');
    $("#format").val('0');

}
