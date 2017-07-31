<?php

// Allow from any origin
    if (isset($_SERVER['HTTP_ORIGIN'])) {
        header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Max-Age: 86400');    // cache for 1 day
    }

    // Access-Control headers are received during OPTIONS requests
    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {

        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
            header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
            header("Access-Control-Allow-Headers:        {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");

        exit(0);
    }

    date_default_timezone_set('Europe/Rome');

    $uploaddir = '/repositories/seitre/webui6.3/files/';
    $uploadfile = $uploaddir.basename($_FILES['file-to-upload']['name']);
    $path = dirname($uploadfile);

    $errors= array();
    $file_size =$_FILES['file-to-upload']['size'];
    $file_tmp =$_FILES['file-to-upload']['tmp_name'];
    $file_type=$_FILES['file-to-upload']['type'];
    $file_ext=strtolower(end(explode('.',$_FILES['file-to-upload']['name'])));
    $extensions = array("json","csv","xml", "txt");

    $file_newname = $uploaddir.rand(0,5000000).".".$file_ext;

    // Check if exist a file with the same name
    if (file_exists($file_newname)) {
        $file_newname = $uploaddir.rand(0,5000000).rand(0,5000000).".".$file_ext;
    }

    if(in_array($file_ext,$extensions)=== false){
        $errors[]="extension not allowed, please choose a json, csv or xml file";
    }
    


    if(empty($errors)==true){
        move_uploaded_file($file_tmp, $file_newname);
        echo "".$file_newname;
    }else{
        $log_file = fopen("/repositories/seitre/webui6.3/log.txt", "a") or die("Unable to open file!");
        $date_log = date('d/m/Y H:i:s');
        $txt = "\n".$date_log."-".implode("\n", $errors);
        fwrite($log_file, $txt);
        fclose($log_file);
        echo "ERROR -- ".$txt;
    }

?>