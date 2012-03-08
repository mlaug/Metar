<?php

/**
 * @author Matthias Laug <matthias.laug@gmail.com>
 * @param DOMDocument $doc
 * @param string $name
 * @param mixed $value
 * @param string $attributeName
 * @param mixed $attributeValue
 * @return DOMElement
 */
function create_node($doc, $name, $value, $attributeName = null, $attributeValue = null) {
    $elem = $doc->createElement($name);

    if (!is_null($attributeName) && !is_null($attributeValue)) {
        $elem->setAttribute($attributeName, $attributeValue);
    }

    $elem->appendChild($doc->createTextNode($value));
    return $elem;
}

//get action
$action = htmlentities($_POST['action']);
$element = htmlentities($_POST['element']);

//create xmlreport
$doc = new DOMDocument('1.0', 'UTF-8');
$doc->formatOutput = true;
$report = $doc->createElement("report");
$report->appendChild(create_node($doc, 'element', $element));
$report->appendChild(create_node($doc, 'action', $action));
$report->appendChild(create_node($doc, 'time', time()));

if ( $action == 'comment' ){
    $comment = htmlentities($_POST['comment']);
    $report->appendChild(create_node($doc, 'comment', $comment));
}

$doc->appendChild($report);

//create dir of the day if not yet available
$dir = sprintf('./reports/%s', date('d-m-Y'));
if ( !is_dir($dir) ){
    $ret = @mkdir($dir, true);
    if ( !$ret || !is_writable($dir)){
        echo json_encode(array(
            'return' => false,
            'file' => null,
            'message' => 'no permission to create dir ' . $dir
        ));
        die();
    }
}
$file = sprintf('%s/report_%s.xml', $dir, time());

echo json_encode(array(
    'return' => $doc->save($file),
    'file' => $file,
    'message' => 'report successfully created'
));
