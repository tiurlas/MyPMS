<?php
    $action = $_GET['do'];
    $file = $_GET['fname'];
    $dir = "../bin";
    $bkpDir = "{$dir}/Backup";
    switch ($action) {
        case "readFiles":
            $dh  = opendir($dir);
            $i = 0;
            while (false !== ($filename = readdir($dh))) {
                if (preg_match('/.sh/', $filename)) {
                    $files[$i]["file"] = $filename;
                    $i++;
                }
            }
            sort($files);
            echo '{"Files":'.json_encode($files).'}';
            break;
        case "read":
            $content = file_get_contents("{$dir}/{$file}", true);
            print($content);
            break;
        case "write":
            $content = $_POST['scriptCode'];
            echo 
            date_default_timezone_set('America/Sao_Paulo');
            $newFile = $file . date('_Ymd_His');
            if (copy("{$dir}/{$file}", "{$bkpDir}/{$newFile}")) {
                file_put_contents("{$dir}/{$file}", $content, LOCK_EX);
            } else {
                echo "Failed";
            }
            break;
    }
?>
