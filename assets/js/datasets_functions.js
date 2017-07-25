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
var updateDataset_url = "https://smartapi.crs4.it/api/ckan/v1/dataset_update";  //baseurl per ckan api dataset update
var dataset_delete_url = "https://smartapi.crs4.it/api/ckan/v1/dataset_delete";
var resource_delete_url = "https://smartapi.crs4.it/api/ckan/v1/resource_delete";
//var tag_delete_url = "https://smartapi.crs4.it/api/ckan/v1/tag_delete";

var dataset_resources = [];  //array da utilizzare nel caso di caricamento di più risorse
var update_dataset_resources = [];  //array da utilizzare nel caso di caricamento di più risorse
var temp_res = [];
var recoveredDatasetInformations = "";



// license's nomenclatures //ex. licenses["cc-by"])
var licenses = {"cc-by": "Creative Commons Attribution",
                "cc-by-sa":"Creative Commons Attribution Share-Alike",
                "cc-zero":"Creative Commons CCZero",
                "cc-nc":"Creative Commons Non-Commercial (Any)",
                "gfdl":"GNU Free Documentation License",
                "odc-by":"Open Data Commons Attribution License",
                "odc-odbl":"Open Data Commons Open Database License (ODbL)",
                "odc-pddl":"Open Data Commons Public Domain Dedication and License (PDDL)",
                "other-at":"Other (Attribution)",
                "other-nc":"Other (Non-Commercial)",
                "other-closed":"Other (Not Open)",
                "other-open":"Other (Open)",
                "other-pd":"Other (Public Domain)",
                "uk-ogl":"UK Open Government Licence (OGL)",
                "notspecified":"notspecified"};

/**
 *
 * @param username
 * @param id
 */
function allowEditDataset(username, id){

    var user_apikey = "";
    if(sessionStorage.ckan_apikey){
        user_apikey = sessionStorage.ckan_apikey;
    }
    var author = "";

    jQuery.ajax({
        url: addDataset_url+"/"+id,
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        crossDomain : true,
        success: function(data, textStatus, xhr)
        {
            // success
            if(xhr.status == 200)
            {
                author = data.result.author;

                if (author==username){
                    $("#buttonEditDataset").show();
                    $("#buttonDeleteRes").show();
                }
            }
            else
            {
                //alert(xhr.status);
                alert(xhr.responseJSON.error.message);
                //respBlock.html(xhr.responseJSON.error.message);
                //respBlock.removeClass("invisible");
                alert(xhr.responseJSON.error.message);
                return;
            }
        },
        error: function(xhr, status)
        {
            //alert("error1");
            alert("Error: "+xhr.status);
            //alert(xhr.responseJSON.error.message);
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
                    //respBlock.html(xhr.responseJSON.error.message);
                        alert(xhr.responseJSON.error.message);
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
                    //respBlock.html(xhr.responseJSON.error.message);
                    alert(xhr.responseJSON.error.message);
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

/**
 *
 * @returns {boolean}
 */
function addDataset() {

    var user_apikey = "";   // "cf142393-6986-408b-a9b4-dfb133f368c8";

    if(sessionStorage.ckan_apikey){
        user_apikey = sessionStorage.ckan_apikey;
    }

    var resources = [];
    if (dataset_resources.length < 1){
        alert("impossibile creare il dataset vuoto, inserire almeno una risorsa!");
        $("#formNewRes").show();
        $("#buttonUpdateRes").hide();
        display_div_url();
        $("#resource-link-or-api").focus();
        return;
        //addNewResource(dataset_resources);
        resources = dataset_resources;
    } else {
        resources = dataset_resources;
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

    var license_id = jQuery("#license").val();
    data["license_id"] = license_id;  ///////codificare la licenza con la nomenclatutra completa
    data["license_title"] = licenses.license_id;   ///verificare che stia funzionando

    data["url"] = jQuery("#source").val();

    data["version"] = jQuery("#version").val();

    data["type"] = "dataset";

    data["resources"] = dataset_resources;
    dataset_resources = []  //azzero l'array globale delle risorse

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
            alert("status-"+xhr.status);

            // success
            if(xhr.status == 200)
            {
                alert($.t('datasets.loaded'));

                // se il dataset viene salvato senza errori il redirect è verso la pagina di dettaglio del dataset
                window.location.href="datasets.html?id="+name;
            }
            else
            {
                alert(xhr.responseJSON.error.name);
                return;
            }
        },
        error: function(xhr, status)
        {
            //alert(JSON.stringify(xhr));
            alert("Error "+ xhr.status + ": " + xhr.statusText + ": " + xhr.responseJSON.error.name);  //error name
            switch(xhr.status)
            {
                case 400:
                    if(xhr.responseJSON.error.message == "invalid_token")
                        //respBlock.html(i18next.t("error.unauthorized"));
                        alert($.t("error.unauthorized"));
                    else if(xhr.responseJSON.error.message == "BadRequest")
                        //respBlock.html(i18next.t("error.missing_user_or_password"));
                        alert($.t("error.missing_user_or_password"));
                    else
                        //respBlock.html(xhr.responseJSON.error.message);
                        alert(xhr.responseJSON.error.message);
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
                    //respBlock.html(xhr.responseJSON.error.message);
                    alert(xhr.responseJSON.error.message);
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

/**
 *
 * @param array_dataset
 * @returns {boolean}
 */
function addNewResource(array_dataset){
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
        alert($.t('datasets.url_resource_required_field'));   ///Required field
        display_div_url();
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
    array_dataset.push(res);

    // visualizzare la lista delle risorse inserite
    var html_content = htmlListResources(array_dataset);
    $("#listRes").html(html_content);

    $("#res_name").val('');
    $("#res_description").val('');
    $("#resource-link-or-api").val('');
    $("#format").val('0');
    hide_div_url();


}


function htmlListResources(temp_res){


    var html_content = "";


    for (var i= 0;i < temp_res.length; i++){

        var id = JSON.stringify(temp_res[i].id);
        //alert(id);
        var element_id = "element_"+i;
        var button_id = "button_"+i;
        var deleteRes = JSON.stringify("resource");

        html_content += "<PRE style='align-self: center;'><div><small><i id='"+element_id+"'>"+temp_res[i].name + "&nbsp; &nbsp; " +
            "[format " + temp_res[i].format + "] &nbsp; &nbsp; " +
            "<a target='_blank' href='" + temp_res[i].url + "'>[" +
            $.t('datasets.linkToRes')+"]</i></a> &nbsp; &nbsp; &nbsp; <b class='pull-right'>" +
            "<button id='"+button_id+"' onclick='javascript:deleteConfirm("+id+"," +deleteRes+ ","+JSON.stringify(i)+ ");' class='btn-u confirm pull-right' style='font-family: Arial; position: relative; right: 20px;'>" +
            $.t('datasets.deleteRes') + "</button></b>" +
            "</small></div></PRE>";
    }


    return html_content;
}

/**
 *
 * @param id
 */
function recoveryDatasetInformations(id) {

    var user_apikey = "";
    if(sessionStorage.ckan_apikey){
        user_apikey = sessionStorage.ckan_apikey;
    }
    //alert(user_apikey);
    jQuery.ajax({
        url: addDataset_url+"/"+id,
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        crossDomain : true,
        success: function(data, textStatus, xhr)
        {
            // success
            if(xhr.status == 200)
            {
                recoveredDatasetInformations = data.result; //serve come base per l'update
                $("#title").val(data.result.title);
                $("#description").val(data.result.notes);

                //tags
                var tags = "";
                for (i in data.result.tags){
                    if (i == data.result.tags.length-1)
                        tags += data.result.tags[i].name;
                    else
                        tags += data.result.tags[i].name + ",";
                }
                $("#tags").val(tags);

                ///license
                var license_id = data.result.license_id;
                $("#license").val(data.result.license_id);

                for(var i = 0;i < document.getElementById("license").length;i++){
                    if(document.getElementById("license").options[i].value == data.result.license_id ){
                        document.getElementById("license").selectedIndex = i;
                    }
                    if (license_id == ""){
                        document.getElementById("license").selectedIndex = document.getElementById("license").length-1;
                    }

                }

                //source
                if (data.result.url == "")
                    $("#source").val(" - ");
                else
                    $("#source").val(data.result.url);

                $("#version").val(data.result.version);
                $("#author").val(data.result.author);
                $("#author_email").val(data.result.author_email);

                //resources list
                //var resources = [];
                temp_res = [];
                for (i= 0;i < data.result.resources.length; i++){
                    temp_res.push(data.result.resources[i]);
                }

                var html_content = "";

                html_content += htmlListResources(temp_res);
                /*for (var i= 0;i < temp_res.length; i++){

                    var id = JSON.stringify(temp_res[i].id);
                    //alert(id);
                    var element_id = "element_"+i;
                    var button_id = "button_"+i;
                    var deleteRes = JSON.stringify("resource");
                    html_content += "<PRE><div><small><i id='"+element_id+"'>"+temp_res[i].name + "&nbsp; &nbsp; " +
                                    "[format " + temp_res[i].format + "] &nbsp; &nbsp; " +
                                    "<a target='_blank' href='" + temp_res[i].url + "'>" +
                                    $.t('datasets.linkToRes')+"</i></a> &nbsp; &nbsp; &nbsp; <b align='right'>" +
                                    "<button id='"+button_id+"' onclick='javascript:deleteConfirm("+id+"," +deleteRes+ ","+JSON.stringify(i)+ ");' class='btn-u confirm' style='font-family: Arial; position: relative; right: 20px;'>" +
                                    $.t('datasets.deleteRes') + "</button></b>" +
                                    "</small></div></PRE>";
                }*/
                html_content += "";

                $("#listRes").html(html_content);
                update_dataset_resources = temp_res;  //copio le risorse esistenti nell'array globale per l'update

               // alert(JSON.stringify(data.result));
            }
            else
            {
                //alert(xhr.status);
                alert(xhr.responseJSON.error.message);
                //respBlock.html(xhr.responseJSON.error.message);
                //respBlock.removeClass("invisible");
                alert(xhr.responseJSON.error.message);
                return;
            }
        },
        error: function(xhr, status)
        {
            //alert("error1");
            alert("Error: "+xhr.status);
            //alert(xhr.responseJSON.error.message);
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
                    //respBlock.html(xhr.responseJSON.error.message);
                        alert(xhr.responseJSON.error.message);
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
                    //respBlock.html(xhr.responseJSON.error.message);
                    alert(xhr.responseJSON.error.message);
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

/**
 *
 */
function updateDataset_addNewRes(){
    $("#formNewRes").show();
    $("#buttonUpdateRes").hide();
}

/**
 *
 * @param id
 * @param type
 */
function deleteConfirm(id, type, element_id){

    /**
     * confirm con jquery.ui dialog
     * using --> https://api.jqueryui.com/dialog/
     **/

    var default_message_for_dialog = "";
    if(type == "resource"){
        default_message_for_dialog = $.t("datasets.confirmDeleteResource");
    }else if(type == "deleteResource"){
        default_message_for_dialog = $.t("datasets.confirmDeleteResource");
    }
    else if(type == "dataset"){
        default_message_for_dialog = $.t("datasets.confirmDeleteDataset");
    }


    //var default_message_for_dialog = $.t("datasets.confirmDeleteResource");
    var textConfirm = $.t("datasets.buttonConfirm");
    var textCancel = $.t("datasets.buttonCancel");
    var icon = '<span class="ui-icon ui-icon-alert" style="float:left; margin:0 7px 0 0;"></span>';

    $('#dialog').html('<P>' + icon + default_message_for_dialog + '</P>');

    $( "#dialog" ).dialog({
        dialogClass: "no-close",
        modal: true,
        bgiframe: true,
        width: 300,
        height: 200,
        autoOpen: false,
        title: $.t("datasets.confirmDialog"),
        buttons: [
            {
                text: textCancel,
                click: function() {
                    $( this ).dialog( "close" );
                }
            },
            {
                text: textConfirm,
                click: function() {
                    if(type == "resource"){
                        deleteResourceFromArray(id, element_id);
                    }else if(type == "deleteResource"){
                        deleteResource(id);
                    }
                    else if(type == "dataset"){
                        deleteDataset(id.id);
                    }


                    $( this ).dialog( "close" );
                }
            }
        ]
    });
    $("#dialog").dialog("open");
}


/**
 *
 * @param id
 * @param element_id
 */
function deleteResourceFromArray(id, element_id){
    //alert(element_id);
    document.getElementById("element_"+element_id).style.color="red";
    document.getElementById("element_"+element_id).style.textDecoration="line-through";
    document.getElementById("button_"+element_id).disabled=true;
    document.getElementById("button_"+element_id).style.opacity="0.5";
    //alert(JSON.stringify(update_dataset_resources[element_id]));
    update_dataset_resources.splice(element_id,1);

}
/**
 *
 * @param id
 * @returns {boolean}
 */
function deleteResource(id){
    //alert(id);
    var user_apikey = "";

    if(sessionStorage.ckan_apikey){
        user_apikey = sessionStorage.ckan_apikey;
    }
    // BODY OF THE REQUEST
    var data = new Object();
    data["id"] = id;  //jQuery("#title").val();

    jQuery.ajax({
        url: resource_delete_url,
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
                var dataset_id="";
                for (var i= 0;i < update_dataset_resources.length; i++){
                    if(update_dataset_resources[i].id == id){
                        update_dataset_resources.splice(i,1);
                    }

                }
                window.location.href="dataset_detail.html?id="+sessionStorage.currentDatasetId;
                //window.location.reload();
                //alert(JSON.stringify(update_dataset_resources));
                alert($.t('datasets.resourceDeleted'));

            }
            else
            {
                //alert(xhr.status);
                alert(xhr.responseJSON.error.message);
                //respBlock.html(xhr.responseJSON.error.message);
                //respBlock.removeClass("invisible");
                alert(xhr.responseJSON.error.message);
                return;
            }
        },
        error: function(xhr, status)
        {
            alert("Error: "+xhr.status);
            switch(xhr.status)
            {
                case 400:
                    if(xhr.responseJSON.error == "invalid_token")
                        alert($.t("error.unauthorized"));
                    else if(xhr.responseJSON.error == "BadRequest")
                        alert($.t("error.missing_user_or_password"));
                    else
                        alert(xhr.responseJSON.error.message);
                    break;
                case 401:
                    alert($.t("error.bad_request"));
                    break;
                case 403:
                    alert($.t("error.invalid_auth"));
                    break;
                case 500:
                    alert($.t("error.internal_server_error"));
                    break;
                default:
                    alert(xhr.responseJSON.error.message);
            }
            return;
        },
        beforeSend: function(xhr, settings)
        {
            xhr.setRequestHeader('Authorization', user_apikey);
        }
    });

}

/**
*
* @returns {boolean}
*/
function updateDataset() {

    var user_apikey = "";   // "cf142393-6986-408b-a9b4-dfb133f368c8";

    if(sessionStorage.ckan_apikey){
        user_apikey = sessionStorage.ckan_apikey;
    }

    //title
    var title = jQuery("#title").val();
    if (title == ""){
        alert($.t('datasets.required_field'));   ///Required field
        $("#title").focus();
        return false;
    }

    // BODY OF THE REQUEST
    //var data = new Object();

    /*
    confronto recoveredDatasetInformations con i dati modificati
     */

    //data["title"] = title;  //jQuery("#title").val();
    if (recoveredDatasetInformations.title != title){
        recoveredDatasetInformations.title = title;
    }

    //name
    /*var name = title.replace(/ /gi, "-"); // dataset title words in lowercase characters separated by a -
    name = name.toLowerCase();
    if (recoveredDatasetInformations.name != name){
        recoveredDatasetInformations.name = name;
    }*/

    var notes = jQuery("#description").val();
    if (recoveredDatasetInformations.notes != notes){
        recoveredDatasetInformations.notes = notes;
    }

    var author = jQuery("#author").val();
    if (recoveredDatasetInformations.author != author){
        recoveredDatasetInformations.author = author;
    }

    var author_email = jQuery("#author_email").val();
    if (recoveredDatasetInformations.author_email != author_email){
        recoveredDatasetInformations.author_email = author_email;
    }

    var license_id = jQuery("#license").val();
    //data["license_id"] = license_id;  ///////codificare la licenza con la nomenclatutra completa
    var license_title = licenses.license_id;   ///verificare che stia funzionando
    if (recoveredDatasetInformations.license_id != license_id){
        recoveredDatasetInformations.license_id = license_id;
    }
    if (recoveredDatasetInformations.license_title != license_title){
        recoveredDatasetInformations.license_title = license_title;
    }

    var url = jQuery("#source").val();
    if (recoveredDatasetInformations.url != url){
        recoveredDatasetInformations.url = url;
    }

    var version = jQuery("#version").val();
    if (recoveredDatasetInformations.version != version){
        recoveredDatasetInformations.version = version;
    }

    var resources = [];
    resources = update_dataset_resources;

    recoveredDatasetInformations.resources = resources;
    update_dataset_resources = []; //azzero

    //tags
    var tags = [];
    var t = jQuery("#tags").val().split(",");
    for(var i in t) {
        var tag = new Object();
        tag["id"] = "tag" + Math.floor(Math.random() * 1000000);  //creare id tag
        tag["name"] = t[i];  //valutare "comma separated"
        tags.push(tag);
    }
    recoveredDatasetInformations.tags = tags;

    jQuery.ajax({
        url: updateDataset_url,
        type: "POST",
        data: JSON.stringify(recoveredDatasetInformations),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        crossDomain : true,
        success: function(data, textStatus, xhr)
        {
            // success
            if(xhr.status == 200)
            {
                alert($.t('datasets.updateLoaded'));

                // se il dataset viene salvato senza errori il redirect è verso la pagina di dettaglio del dataset
                //window.location.href="datasets.html?id="+name;
                window.location.href=sessionStorage.prevPage;
            }
            else
            {
                //alert(xhr.status);
                alert(xhr.responseJSON.error.message);
                //respBlock.html(xhr.responseJSON.error.message);
                //respBlock.removeClass("invisible");
                alert(xhr.responseJSON.error.message);
                return;
            }
        },
        error: function(xhr, status)
        {
            alert("Error: "+xhr.status);
            switch(xhr.status)
            {
                case 400:
                    if(xhr.responseJSON.error == "invalid_token")
                        alert($.t("error.unauthorized"));
                    else if(xhr.responseJSON.error == "BadRequest")
                        alert($.t("error.missing_user_or_password"));
                    else
                        alert(xhr.responseJSON.error.message);
                    break;
                case 401:
                    alert($.t("error.bad_request"));
                    break;
                case 403:
                    alert($.t("error.invalid_auth"));
                    break;
                case 500:
                    alert($.t("error.internal_server_error"));
                    break;
                default:
                    alert(xhr.responseJSON.error.message);
            }
            return;
        },
        beforeSend: function(xhr, settings)
        {
            xhr.setRequestHeader('Authorization', user_apikey);
        }
    });

}


/**
 *
 * @param id
 */
function deleteDataset(id) {
    //alert("delete dataset");

    var user_apikey = "";

    if(sessionStorage.ckan_apikey){
        user_apikey = sessionStorage.ckan_apikey;
    }

    // BODY OF THE REQUEST
    var data = new Object();
    data["id"] = id;


    jQuery.ajax({
        url: dataset_delete_url,
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
                //cancello anche i tags assocciati al dataset appena eliminato

                alert($.t('datasets.datasetDeleted'));
                window.location.href="datasets.html";
            }
            else
            {
                alert(xhr.responseJSON.error.message);
                return;
            }
        },
        error: function(xhr, status)
        {
            alert("Error: "+xhr.status);
            switch(xhr.status)
            {
                case 400:
                    if(xhr.responseJSON.error == "invalid_token")
                        alert($.t("error.unauthorized"));
                    else if(xhr.responseJSON.error == "BadRequest")
                        alert($.t("error.missing_user_or_password"));
                    else
                        alert(xhr.responseJSON.error.message);
                    break;
                case 401:
                    alert($.t("error.bad_request"));
                    break;
                case 403:
                    alert($.t("error.invalid_auth"));
                    break;
                case 500:
                    alert($.t("error.internal_server_error"));
                    break;
                default:
                    alert(xhr.responseJSON.error.message);
            }
            return;
        },
        beforeSend: function(xhr)
        {
            xhr.setRequestHeader('Authorization', user_apikey);
        }
    });


}









////////// i tag possono essere eliminati solo da utente sysadmin
/**
 *
 * @param id_tag
 * @param user_apikey
 */
/*
function tag_delete(id_tag, user_apikey){
    //https://smartapi.crs4.it/api/ckan/v1/tag_delete
    //alert("delete tag");

    // BODY OF THE REQUEST
    var data = new Object();
    data["id"] = id_tag;

    jQuery.ajax({
        url: tag_delete_url,
        type: "POST",
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        crossDomain : true,
        success: function(data, textStatus, xhr)
        {
            // success
            alert(xhr.status);
            if(xhr.status == 200)
            {
                //non fare nulla
                alert("eliminato tag "+JSON.stringify(data));
            }
            else
            {
                alert(xhr.responseJSON.error.message);
                return;
            }
        },
        error: function(xhr, status)
        {
            alert("Error: "+xhr.status);
            switch(xhr.status)
            {
                case 400:
                    if(xhr.responseJSON.error == "invalid_token")
                        alert($.t("error.unauthorized"));
                    else if(xhr.responseJSON.error == "BadRequest")
                        alert($.t("error.missing_user_or_password"));
                    else
                        alert(xhr.responseJSON.error.message);
                    break;
                case 401:
                    alert($.t("error.bad_request"));
                    break;
                case 403:
                    alert($.t("error.invalid_auth"));
                    break;
                case 500:
                    alert($.t("error.internal_server_error"));
                    break;
                default:
                    alert(xhr.responseJSON.error.message);
            }
            return;
        },
        beforeSend: function(xhr)
        {
            xhr.setRequestHeader('Authorization', user_apikey);
        }
    });

}*/