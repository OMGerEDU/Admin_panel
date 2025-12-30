@echo off
echo Creating directory...
mkdir src\assets\clients 2>nul

echo Downloading images...
curl -L "https://e-club.biz/wp-content/uploads/2025/03/WhatsApp-Image-2025-03-27-at-15.48.25.jpeg" -o "src/assets/clients/omri.jpg" --create-dirs
curl -L "https://pic1.calcalist.co.il/picserver3/crop_images/2025/03/03/rJMSUlQsyg/rJMSUlQsyg_9_0_262_147_0_xx-large.jpg" -o "src/assets/clients/bsr.jpg"
curl -L "https://yt3.googleusercontent.com/Ti137VSspBSwMddYf-Pcpr_LM1bALCF3R4oQJWCh-QSqHFXMDq8fAEwoEmx4zaRZjf9R4mLOLQ=s900-c-k-c0x00ffffff-no-rj" -o "src/assets/clients/daniel.jpg"
curl -L "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDS5dvIWsTVh2IbLc-dRf0LSQdA1e6JFwJoQ&s" -o "src/assets/clients/ilan.jpg"
curl -L "https://cdn.funder.co.il/fimgni/i/a/Guy-Nathan.jpg" -o "src/assets/clients/guy.jpg"
curl -L "https://bmeniv.co.il/wp-content/uploads/2025/02/WhatsApp-Image-2025-02-24-at-16.44.26.jpeg" -o "src/assets/clients/bi_meniv.jpg"
curl -L "https://i.scdn.co/image/ab67656300005f1fa64ab8cbdeaace2b6759d1ad" -o "src/assets/clients/matan.jpg"
curl -L "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZQzCBys6dauWt-mw63jFZHArRt7S5BThz5A&s" -o "src/assets/clients/tal.jpg"

echo Done! Images saved to src/assets/clients
pause
