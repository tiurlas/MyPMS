<?php>
<br>
  <br>
  //URL onde o arquivo PHP vai ficar<br>
  $url_galeria = "http://localhost/infra/fotos.php";</p>
<div style="float:none;margin:10px 0 10px 0;text-align:center;">
<ins class="adsbygoogle" style="display:inline-block;width:300px;height:250px" data-ad-client="ca-pub-3011754944670850" data-ad-slot="8044295656" data-adsbygoogle-status="done"><ins id="aswift_1_expand" style="display:inline-table;border:none;height:250px;margin:0;padding:0;position:relative;visibility:visible;width:300px;background-color:transparent"><ins id="aswift_1_anchor" style="display:block;border:none;height:250px;margin:0;padding:0;position:relative;visibility:visible;width:300px;background-color:transparent"><iframe width="300" height="250" frameborder="0" marginwidth="0" marginheight="0" vspace="0" hspace="0" allowtransparency="true" scrolling="no" allowfullscreen="true" onload="var i=this.id,s=window.google_iframe_oncopy,H=s&&s.handlers,h=H&&H[i],w=this.contentWindow,d;try{d=w.document}catch(e){}if(h&&d&&(!d.body||!d.body.firstChild)){if(h.call){setTimeout(h,0)}else if(h.match){try{h=s.upd(h,i)}catch(e){}w.location.replace(h)}}" id="aswift_1" name="aswift_1" style="left:0;position:absolute;top:0;"></iframe></ins></ins></ins>
</div>

<p> //URL onde o arquivo PHP vai ficar<br>
  $pasta_fotos = "/app/www/Infra/Fotos_Guido";<br>
  <br>
  //Início da função<br>
  <br>
  $fotos = array();<br>
  <br>
  //Loop que percorre a pasta das imagens e armazena o nome de todos os arquivos<br>
  foreach(glob($pasta_fotos . '/{*_p.jpg,*_p.gif}', GLOB_BRACE) as $image) { <br>
  <br>
  $fotos[] = $image;<br>
  <br>
  }<br>
  <br>
  //Verifica se deve exibir a lista ou uma foto<br>
  if ($_GET["image"] == "") {<br>
  <br>
  //Faz o loop pelo folder de imagens<br>
  for($i=0; $i < count($fotos); $i++) { <br>
  <br>
  //Cria cada uma das thumbs dentro de uma <div> com link para a imagem grande<br>
  echo "<div class='thumb'>";<br>
  echo "<a href='" . $url_galeria . "?image=" . $i . "'>";<br>
  echo "<img src='" . $fotos[$i] . "'>";<br>
  echo "</a>";<br>
  echo "</div>";<br>
  <br>
  }</p>
<p> } else {<br>
  <br>
  //Guarda o nome da imagem para montar o link da imagem grande<br>
  $foto_g = explode("_p", $fotos[$_GET["image"]]);<br>
  <br>
  //Configura os links de próxima e anterior<br>
  if ( $_GET["image"] == 0 ) { $anterior = ""; } else { $anterior = $_GET["image"] - 1; }<br>
  if ( $_GET["image"] == count($fotos)-1 ) { $proxima = ""; } else { $proxima = $_GET["image"] + 1; }<br>
  <br>
  //Quando solicitada uma imagem em particular, monta a <div> e insere a imagem grande de acordo com o link<br>
  echo "<div>";<br>
  echo "<a href='" . $url_galeria . "?image=" . $proxima . "'>";<br>
  echo "<img src='" . $foto_g[0] . "_g" . $foto_g[1] . "'>";<br>
  echo "</a>";<br>
  echo "<p><a href='" . $url_galeria . "?image=" . $anterior . "'>Foto anterior</a> | <a href='" . $url_galeria . "'>Voltar para a galeria</a> | <a href='" . $url_galeria . "?image=" . $proxima . "'>Próxima foto</a></p>";<br>
  echo "</div>";<br>
  <br>
  }</p>
<p>?></p>

