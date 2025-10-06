# Day 23 – Accessibility Checker  
## Nap 23 – Hozzáférhetőségi Ellenőrző

## 📄 Project Description / Projektleírás  
A developer tool that scans a webpage and highlights common accessibility issues. Checks for missing alt attributes, low contrast ratios, and improper heading structure.  
Fejlesztői eszköz, amely átvizsgálja a weboldalt és kiemeli a gyakori hozzáférhetőségi problémákat. Ellenőrzi a hiányzó alt attribútumokat, alacsony kontrasztarányokat és hibás címsorstruktúrát.

## 🧠 Goal / Cél  
Analyze pasted HTML code and highlight common accessibility issues with developer-friendly feedback.  
Beillesztett HTML kód elemzése és tipikus hozzáférhetőségi hibák kiemelése fejlesztőbarát visszajelzéssel.

## 🛠️ Tech Stack / Technológiák  
- HTML5  
- CSS3 (Flexbox/Grid, typography)  
- JavaScript (ES6+)  
- DOMParser, regex, ARIA best practices

## 🎯 Features / Funkciók  
- [✓] Paste HTML into textarea  
- [✓] HTML kód beillesztése  
- [✓] Analyze for accessibility issues  
- [✓] Hozzáférhetőségi hibák elemzése  
- [✓] Display issue list with suggestions  
- [✓] Hibák listázása és javaslatok megjelenítése  
- [✓] Responsive layout  
- [✓] Mobilbarát elrendezés

## 📚 Learnings / Tanulságok  
- Practiced DOM parsing and regex-based validation  
- Gyakoroltam DOM feldolgozást és regex-alapú ellenőrzést  
- Learned how to detect semantic and structural issues  
- Megtanultam szemantikai és szerkezeti hibák felismerését  
- Improved developer feedback UX for code analysis  
- Fejlesztettem a fejlesztői visszajelzést kódelemzéshez

## 🧩 Challenges / Kihívások  
- Handling malformed or incomplete HTML input  
- Hibás vagy hiányos HTML bemenet kezelése  
- Designing readable issue reports with suggestions  
- Olvasható hibajelentések és javaslatok tervezése  
- Balancing strictness with helpfulness in feedback  
- A szigorúság és segítőkészség egyensúlya a visszajelzésekben

## 🚀 Live Demo / Élő demó  
🔗 [https://github.com/DSaca95/js-31/day-23](https://github.com/DSaca95/js-31/day-23)

## 📦 Installation / Telepítés  
```bash
git clone https://github.com/DSaca95/js-31.git
cd day-23
open index.html