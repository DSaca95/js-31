# Day 20 – Voice Recorder App  
## Nap 20 – Hangrögzítő Alkalmazás

## 📄 Project Description / Projektleírás  
A browser-based voice recorder that captures audio using the Web Audio API. Includes start/stop controls, playback, and download functionality.  
Böngészőalapú hangrögzítő alkalmazás, amely a Web Audio API segítségével rögzíti a hangot. Tartalmaz indítás/leállítás vezérlést, visszajátszást és letöltési lehetőséget.

## 🧠 Goal / Cél  
Record audio from the user's microphone using MediaRecorder API, and allow playback and download.  
Hangrögzítés a felhasználó mikrofonjából a MediaRecorder API segítségével, visszajátszással és letöltéssel.

## 🛠️ Tech Stack / Technológiák  
- HTML5  
- CSS3 (Flexbox/Grid)  
- JavaScript (ES6+)  
- MediaRecorder API  
- Web Audio API

## 🎯 Features / Funkciók  
- [✓] Start/stop recording  
- [✓] Rögzítés indítása/leállítása  
- [✓] Playback recorded audio  
- [✓] Rögzített hang visszajátszása  
- [✓] Download audio file  
- [✓] Hangfájl letöltése  
- [✓] Error handling  
- [✓] Hibakezelés  
- [✓] Responsive layout  
- [✓] Mobilbarát elrendezés

## 📚 Learnings / Tanulságok  
- Practiced MediaRecorder API usage and blob handling  
- Gyakoroltam a MediaRecorder API használatát és blob-kezelést  
- Learned how to manage audio streams and playback  
- Megtanultam hangfolyamok és visszajátszás kezelését  
- Improved UI feedback for recording state  
- Fejlesztettem a UI visszajelzést a rögzítési állapothoz

## 🧩 Challenges / Kihívások  
- Handling browser permissions and device access  
- Böngészőengedélyek és eszközhozzáférés kezelése  
- Managing audio blob lifecycle and download links  
- Hang blob életciklus és letöltési hivatkozások kezelése  
- Designing intuitive controls for recording flow  
- Intuitív vezérlők tervezése a rögzítési folyamathoz

## 🚀 Live Demo / Élő demó  
🔗 [https://github.com/DSaca95/js-31/day-20](https://github.com/DSaca95/js-31/day-20)

## 📦 Installation / Telepítés  
```bash
git clone https://github.com/DSaca95/js-31.git
cd day-20
open index.html