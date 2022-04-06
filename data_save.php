<?php
include 'config.php';

if(isset($_POST) == true){
    //generate unique file name
$today = date("Y-m-d");
$GEOM= $_POST['geom'];
$TYPE =$_POST['type'];
			
/////////////////////////////
   $response= array();
   $QUERY_STR = "INSERT INTO polygons(poly_area,geometry,type) VALUES((ST_Area(ST_Transform(ST_GeomFromText('$GEOM',4326),3857))/1000000),ST_GeomFromText('$GEOM',4326),'$TYPE')";
}
	$result_arr = [];
	$obj_PgDb = new PgDb();
	$obj_PgDb->query($QUERY_STR);
	$total_r = $obj_PgDb->resultset();

$rows= count($total_r);

    if($rows > 0)
	{
		$result_arr =array('DATA' => "SUCCESS");
	} else 
	{
		$result_arr =array('DATA' => "FAIL");
	}
	echo json_encode($result_arr);

?>