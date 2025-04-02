
<?php
// Set CORS headers to allow your domain
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// Get parameters from request
$symbols = isset($_GET['symbols']) ? $_GET['symbols'] : 'BTC,ETH,BNB,SOL,XRP,ADA,DOGE,USDT,TRX,TON';
$currency = isset($_GET['currency']) ? $_GET['currency'] : 'USD';

// CryptoCompare API URL
$apiUrl = "https://min-api.cryptocompare.com/data/pricemultifull?fsyms={$symbols}&tsyms={$currency}";

// Initialize cURL session
$ch = curl_init();

// Set cURL options
curl_setopt($ch, CURLOPT_URL, $apiUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

// Execute the request
$response = curl_exec($ch);

// Check for errors
if (curl_errno($ch)) {
    echo json_encode([
        'success' => false,
        'error' => 'API request failed: ' . curl_error($ch)
    ]);
    exit;
}

// Close cURL session
curl_close($ch);

// Return the data
echo $response;
?>
