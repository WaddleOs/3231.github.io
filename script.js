// Supabase bağlantısı
const supabaseUrl = 'https://mxhqubnrzvmohaxzfgou.supabase.co'; // Supabase URL'niz
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14aHF1Ym5yenZtb2hheHpmZ291Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQwMjExNjIsImV4cCI6MjA0OTU5NzE2Mn0.m0G7S_GooOpxaAINZPh1GBHPbd0bLJlO42JsrSg7Sv0'; // Anonim Anahtarınızı buraya ekleyin
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Formu gönderme işlemi
document.getElementById('ageForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const ageInput = document.getElementById('age');
  const age = parseInt(ageInput.value);

  if (age && age > 0) {
    // Yaş bilgisini Supabase'e kaydet
    await supabase
      .from('ages')
      .insert([{ age: age }]);

    // Formu sıfla
    ageInput.value = '';

    // Yaş dağılımı sonuçlarını al
    await getAgeStats();
  }
});

// Yaş gruplarını hesaplamak ve ekrana yazdırmak
async function getAgeStats() {
  // Yaş verilerini Supabase'ten al
  const { data, error } = await supabase
    .from('ages')
    .select('age');

  if (error) {
    console.error('Veri alınırken hata oluştu:', error);
    return;
  }

  let age8to12 = 0;
  let age12to14 = 0;
  let age14to16 = 0;
  let age16to18 = 0;
  let age20plus = 0;

  // Yaşları kontrol et
  data.forEach(person => {
    if (person.age >= 8 && person.age <= 12) age8to12++;
    else if (person.age >= 12 && person.age < 14) age12to14++;
    else if (person.age >= 14 && person.age < 16) age14to16++;
    else if (person.age >= 16 && person.age < 18) age16to18++;
    else if (person.age >= 20) age20plus++;
  });

  // Sonuçları ekrana yazdır
  document.getElementById('age8to12').textContent = age8to12;
  document.getElementById('age12to14').textContent = age12to14;
  document.getElementById('age14to16').textContent = age14to16;
  document.getElementById('age16to18').textContent = age16to18;
  document.getElementById('age20plus').textContent = age20plus;

  // Yaşların toplam sayısını göster
  const totalAge = data.length;
  document.getElementById('totalCount').textContent = `Toplam Kişi Sayısı: ${totalAge}`;

  // Sonuçları göster
  document.getElementById('result').style.display = 'block';
  document.getElementById('resetBtn').style.display = 'inline-block';
}

// Formu sıfırlama işlemi
function resetForm() {
  document.getElementById('result').style.display = 'none';
  document.getElementById('resetBtn').style.display = 'none';
}
