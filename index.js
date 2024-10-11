const Kata_kata = {
 kata_1: {
  image: "kawaii-love.gif",
  text: "Hahahahaha",
  spawnTimer: 100,
  longTime: 1289
 },
 kata_2: {
  image: "cute-cat-love.gif",
  text: "Kalo di balaraja banyak pramugari",
  spawnTimer: 1215,
  longTime: 2195
 },
 kata_3: {
  image: "cutie-cat-chan.gif",
  text: "Kalo kamuu spek bidadarii",
  spawnTimer: 3435,
  longTime: 1677
 },
 kata_4: {
  image: "kiss.gif",
  text: "iiuuuuhh meledakk 🔥🔥",
  spawnTimer: 5264,
  longTime: 2000
 }
}

const pantun_minta_pap = {
 kata_1: "Ada cewek... main bola pingpong",
 kata_2: "Boleehh mintaa... pap imut nya dongg?? 😖😖"
}

const mentahan_audio = "Audio Koding.mp3";
const audio = new Audio();
audio.src = mentahan_audio;


const swalCostum = Swal.mixin({allowOutsideClick: false});

window.addEventListener("load", ()=>{
 setTimeout(()=>{
  swalCostum.fire({
   text: "Tunggu bentar ya",
   timer: 1000,
   timerProgressBar: true,
   showConfirmButton: false,
   backdrop: "#000000 left top no-repeat"
  }).then(r => {
   if (r.dismiss === swalCostum.DismissReason.timer) {
    $(".surat-dariku").click(startMulai);
   }
  })
 }, 300);
});


function startMulai(){
 this.parentElement.style = "opacity: 0; transition: opacity 0.2s ease";
 setTimeout(()=>{
  this.parentElement.remove();
  $(".bg-hitam").addClass("active");
  setTimeout(()=>{
   audio.play();
   startMunculkanPopup();
  }, 700);
 }, 200);
}

function startMunculkanPopup(){
 let idx = 0;
  for (const KK in Kata_kata) {
   setTimeout(()=>{
    idx++;
    swalCostum.fire({
     imageUrl: Kata_kata[KK].image,
     imageWidth: 120,
     imageHeight: 120,
     text: Kata_kata[KK].text,
     timer: Kata_kata[KK].longTime,
     timerProgressBar: true,
     backdrop: "#000000 left top no-repeat",
     showConfirmButton: false
    }).then(r => {
     if (idx == 4) nextSession(r);
    })
   }, Kata_kata[KK].spawnTimer);
  }
}

function nextSession(r){
 if (r.dismiss === swalCostum.DismissReason.timer) {
  setTimeout(()=>{
   $(".bg-hitam").removeClass("active");
   setTimeout(mulaiPantun, 500);
  }, 500);
 }
}

function mulaiPantun(){
 swalCostum.fire({
  title: pantun_minta_pap.kata_1,
  confirmButtonText: "Cakep"
 }).then(r =>{
  if (r.isConfirmed) confirmasiMintaPap();
 });
}

function confirmasiMintaPap(){
 swalCostum.fire({
  imageUrl: "mochi-peach.gif",
  imageWidth: 200,
  imageHeight: 200,
  title: pantun_minta_pap.kata_2,
  confirmButtonText: "Boleh dong",
  showDenyButton: true,
  denyButtonText: "Enggak",
  reverseButtons: true
 }).then(r => {
  if (r.isConfirmed) {
   fPilihOpsiFoto();
  } else if (r.isDenied) {
   swalCostum.fire({
    title: "Kok nggak boleh, kenapa?",
    input: 'textarea',
    inputPlaceholder: 'Silakan ketik disini dan kirim ke whatsApp Aku!',
    confirmButtonText: "Selesai dan kirim",
    showLoaderOnConfirm: true,
    preConfirm: login => {
     if (!login || login.length > 200) {
      swalCostum.showValidationMessage("Inputan diatas harap diisi dan nggak boleh lebih dari 200 karakter!");
     } else {
      window.location = `https://api.whatsapp.com/send?phone=&text=${login}`;
     }
    }
   });
  }
 })
}


async function fPilihOpsiFoto(){
await swalCostum.fire({
  imageUrl: "kiss.gif",
  imageWidth: 120,
  imageHeight: 120,
  text: "Aku pengennya foto kamu yg cantik dan imut-imut 😆",
  confirmButtonText: "Ambil foto kamu",
  preConfirm: bukaGaleriAmbilFoto
});
}

function bukaGaleriAmbilFoto(){
 const input = document.createElement("input");
 input.type = "file";
 input.hidden = true;
 input.click();
 input.addEventListener("change", function(e){
  if (this.files[0].type == "image/jpeg" || this.files[0].type == "image/png") {
    const bacaGambar = new FileReader()
    bacaGambar.addEventListener("load", (e)=>pratinjauGambar(this.files, e));
    bacaGambar.readAsDataURL(this.files[0]);
  } else {
   swalCostum.fire({
    icon: "warning",
    title: "Peringatan untuk kamu",
    text: "Kamu nggak boleh ambil selain foto atau gambar dari galeri kamu (berformat jpg dan png)",
    confirmButtonText: "Mengerti & Ambil foto",
    preConfirm: bukaGaleriAmbilFoto
   });
  }
 });
}

function pratinjauGambar(files, {target: {result: foto}}){
 let teksFoto;
 swalCostum.fire({
  imageUrl: foto,
  imageWidth: 300,
  title: "Pratinjau Gambar",
  text: "Tambahkan teks sebelum mengirim foto ke whatsApp aku ya!",
  input: "text",
  inputPlaceholder: "Ketik jawaban kamu disini",
  confirmButtonText: "Kirim foto kamu",
  showDenyButton: true,
  denyButtonText: "Ganti foto lain",
  reverseButtons: true,
  preConfirm: r => {
   if (!r || r.length >= 200) {
    swalCostum.showValidationMessage("Input ini nggak boleh dibiarkan kosong atau lebih dari 200 karakter");
   } else {
    teksFoto = r;
   }
  }
 }).then(r => {
  if (r.isConfirmed) {
   fShareInBrowser(files, teksFoto);
  } else if(r.isDenied) {
   bukaGaleriAmbilFoto();
  }
 })
}

async function fShareInBrowser(files, teksFoto){
 if (!navigator.canShare) {
  swalCostum.fire({
   icon: "error",
   title: "Yah, nggak bisa kirim!",
   text: "Mungkin browser kamu tidak mendukung fitur berbagi. Aku saranin buka ulang script ini di Google Chrome aja. Aku kurang yakin Safari menjamin tersedia fitur ini!"
  });
  return;
 }
 
 
 try {
  await navigator.share({
   files,
   title: "Foto kamu",
   text: teksFoto
  });
 } catch (err) {
  const Toast = Swal.mixin({
  toast: true,
  position: 'top',
  confirmButtonText: "Ambil Foto lagi",
  preConfirm: r => bukaGaleriAmbilFoto()
});

Toast.fire({
  icon: 'warning',
  title: 'Terjadi kesalahan!',
  text: err
});
 }
}