<?php
include 'header.php';
?>

<div class="compress-container">
<?php
	if (isset($_POST['submit'])) {
		if (!is_file($_FILES['image-file']['tmp_name'])) {
			die('Файл не указан');
		}

		$img_src = 'user_img/'.$_FILES['image-file']['name'];
		copy($_FILES['image-file']['tmp_name'], $img_src);

		$pInfo = pathinfo($img_src);
		$img_rz = $pInfo['dirname'].'/'.$pInfo['filename'].'_rz.'.$pInfo['extension'];

		$image_new = resizeImage($img_src, $_POST['image-width'], $_POST['image-height']);

		if ($image_new) {
			imagepng($image_new, $img_rz);
?>
			<!-- <img src="<?php echo $img_src ?>"> -->
			<img src="<?php echo $img_rz ?>">
<?php
		}
		else {
			echo 'Ошибка!';
		}
	}
	else {
?>
	<form id="form1" action="compress_image.php" method="post" enctype="multipart/form-data">
		<label>Choose file:<br>
			<input type="file" name="image-file">
		</label>
		<br><br>
		<label>New width:<br>
			<input type="number" name="image-width" min="1" value="200">
		</label>
		<br><br>
		<label>New height:<br>
			<input type="number" name="image-height" min="1" value="200">
		</label>
		<br><br>
		<label><input type="submit" name="submit"></label>
	</form> 
<?php } ?>
</div>

<?php
include 'footer.php';
?>

<?php
function resizeImage($filename, $width_request, $height_request)
{
	if (!isset($width_request) || !isset($height_request) || !isset($filename)) return false;
	if ($width_request <= 0 || $height_request <= 0) return false;

	list($width, $height, $filetype) = getimagesize($filename);
	switch ($filetype) {
		case IMAGETYPE_PNG:
			$image = imagecreatefrompng($filename);
			break;
		case IMAGETYPE_JPEG:
			$image = imagecreatefromjpeg($filename);
			break;
		case IMAGETYPE_BMP:
			$image = imagecreatefrombmp($filename);
			break;
		default:
			return false;
	}

	$percent_x = $width_request / $width;
	$percent_y = $height_request / $height;
	$percent = $percent_x < $percent_y ? $percent_x : $percent_y;

	$width_new = $width * $percent;
	$height_new = $height * $percent;

	$image_new = imagecreatetruecolor($width_request, $height_request);
/*
	imagecopyresampled(
		$image_new, $image,
		($width_request - $width_new) / 2, ($height_request - $height_new) / 2,
		0, 0,
		$width_new, $height_new,
		$width, $height);
*/
		
	$image_new = imagecreatetruecolor($width_new, $height_new);
	imagecopyresampled(
		$image_new, $image,
		0, 0,
		0, 0,
		$width_new, $height_new,
		$width, $height);

	$text = 'Sokolov Dmitriy';
	$fontname = 'fnt/segoeuib.ttf';
	$tb = imagettfbbox(14, 0, $fontname, $text);
	imagettftext(
		$image_new,
		14,
		0,
		($width_new - $tb[2]) / 2, -$tb[5],
		imagecolorallocate($image_new, 0, 0, 0),
		$fontname,
		$text);

	return $image_new;
}


?>