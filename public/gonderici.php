<?php
/* ============================================================
   MTS HİJYEN — Form Göndericisi
   POST: ad, soyad, email, telefon, konu, mesaj
   ============================================================ */

header('Content-Type: application/json; charset=utf-8');

/* Sadece POST */
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'msg' => 'Method Not Allowed']);
    exit;
}

/* ---- Temizleme ---- */
function clean(string $val): string {
    return htmlspecialchars(strip_tags(trim($val)), ENT_QUOTES, 'UTF-8');
}

$ad     = clean($_POST['name']    ?? '');
$firma  = clean($_POST['company'] ?? '');
$email  = filter_var(trim($_POST['email'] ?? ''), FILTER_VALIDATE_EMAIL);
$tel    = clean($_POST['phone']   ?? '');
$konu   = clean($_POST['subject'] ?? '');
$sektor = clean($_POST['sector']  ?? '');
$mesaj  = clean($_POST['message'] ?? '');

/* ---- Zorunlu alan kontrolü ---- */
if (!$ad || !$email || !$mesaj) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'msg' => 'Eksik alan']);
    exit;
}

/* ---- Header enjeksiyon koruması ---- */
foreach ([$ad, $firma] as $field) {
    if (preg_match('/[\r\n]/', $field)) {
        http_response_code(400);
        echo json_encode(['ok' => false, 'msg' => 'Geçersiz giriş']);
        exit;
    }
}

/* ---- E-posta gönder ---- */
$to      = 'can.catma@mtshijyen.com';
$subject = '=?UTF-8?B?' . base64_encode('[MTS Web] Yeni Teklif / İletişim Talebi') . '?=';

$body  = "Ad Soyad : $ad\n";
$body .= "Firma    : $firma\n";
$body .= "E-posta  : $email\n";
$body .= "Telefon  : $tel\n";
if ($konu)   $body .= "Konu     : $konu\n";
if ($sektor) $body .= "Sektör   : $sektor\n";
$body .= str_repeat('-', 40) . "\n";
$body .= $mesaj . "\n";

$headers  = "From: MTS Web Formu <noreply@mtshijyen.com>\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= "Content-Transfer-Encoding: 8bit\r\n";
$headers .= "X-Mailer: PHP/" . PHP_VERSION . "\r\n";

$sent = mail($to, $subject, $body, $headers);

if ($sent) {
    echo json_encode(['ok' => true, 'msg' => 'Mesaj iletildi']);
} else {
    http_response_code(500);
    echo json_encode(['ok' => false, 'msg' => 'Gönderilemedi']);
}
