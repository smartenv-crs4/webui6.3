/**
 * Created by valentinamarotto on 25/07/17.
 */

//var repo_files_uploaded = "http://seitre.crs4.it:3000/";
var repo_files_uploaded = "http://localhost/webui6.3";


$(document).ready(function(){
    $("#myform").submit(function(e){
        //intercetto il submit del form
        e.preventDefault();	//previene l'invio del form tradizionalmente
        //raggruppo tutti i campi del form in un oggetto
        var formData = new FormData($(this)[0]); //per i form "multipart/form-data"

        saveFile(formData);


        return false;
    }); //end submit
});

function saveFile(formData) {
    $.ajax({
        url: 'save.php',
        type: 'POST',
        data: formData,
        timeout:30000,
        async: true,
        cache: false,
        contentType: false, //per i form "multipart/form-data"
        processData: false, //per i form "multipart/form-data"


        beforeSend: function () {
            //$('#outputServer').html('Upload in corso...');
            $('#mysubmit').attr("disabled", "disabled");
        },
        success: function (data) {

            if(data.indexOf("ERROR")>-1){
                alert(data);
            }else{
                //alert("no error "+ data);
                var path_file_to_upload = repo_files_uploaded + data.split(".")[1] +"."+ data.split(".")[2];
                alert(path_file_to_upload);
                //compila il campo url con il path del file caricato
                jQuery("#link-or-api").show();
                jQuery("#resource-link-or-api").val(path_file_to_upload);
                jQuery("#form-upload").hide();
                //generare/integrare lista resource nella pagina di creazionemodifica del dataset
            }



            //$('#outputServer').html(data);

        },
        error: function(){
            //$('#outputServer').html('Errore nell\' invio...');
            alert("errore nel caricamento");
        },
        complete: function(){
            $('#mysubmit').removeAttr("disabled");
        },
        xhr: function(){
            // gestione percentuale di caricamento
            // prende il riferimento all'oggetto nativo 'XmlHttpRequest' (xhr)
            var xhr = $.ajaxSettings.xhr() ;
            // callback per l'evento onprogress
            xhr.upload.onprogress = function(evt){
                //sostituisco con
                // $('#progress').html(Math.round(evt.loaded/evt.total*100)+'%')};
                //alert("file in caricamento");
            };
            // callback per l'evento 'onload' , ovvero caricamento finito
            xhr.upload.onload = function(){
                //sostituisco con alert
                // $('#progress').html('100% - caricamento completato.') };
                //alert("100% - caricamento completato");
            };
            // ritorna l'oggetto xhr
            return xhr;
        }
    });

}