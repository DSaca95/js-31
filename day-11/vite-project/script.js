const phrases = {
    Clear: "Crystal Skies",
    Cloud: "Cloud Nine",
    Rain: "Let it Pour",
    Snow: "Powder Day",
    Thunderstorm: "Electric Mood",
    Mist: "Soft Focus",
    Drizzle: "Gentle Drops",
    Fog: "Blurred Horizons",
  };
  
  let weight = 400;
  let width = 100;
  let time = 0;
  let slnt = 0;
  let directionW = 1;
  let directionWd = 1;
  let isSlanted = false;

  let cityInput;
  let phraseEl;
  
  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
  
  const normalize = (str) => str.toLowerCase().replace(/s$/, "");

  const charParams = new Map();
  
  const getPhrase = (condition) => {
    const key = Object.keys(phrases).find(k => normalize(k) === normalize(condition));
    return phrases[key] || "Unknown Skies";
  };
  
  const fetchWeather = async (city) => {
    const iconEl = document.getElementById("weather-icon");

    if (!city || city.trim() === "") {
        setPhrase("Weather Unavailable");
        document.querySelector(".temp-card .label").textContent = "--°C";

        iconEl.src = "";
        iconEl.alt = "";
        iconEl.style.display = "none";

        document.querySelector(".desc").textContent = "no description";
        document.querySelector(".wind").textContent = "💨 -- m/s";
        document.querySelector(".humidity").textContent = "💧 --%";
        return;
    }

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      if (!response.ok) throw new Error("Fetch error");
  
      const data = await response.json();
      const condition = data.weather[0].main;
      const phrase = getPhrase(condition);
      const iconCode = data.weather[0].icon;
      const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  
      setPhrase(phrase);
  
      document.querySelector(".temp-card .label").textContent = `${Math.round(data.main.temp)}°C`;
      document.getElementById("weather-icon").src = iconUrl;
      document.getElementById("weather-icon").alt = data.weather[0].description;

      document.querySelector(".desc .card-value").textContent = data.weather[0].description;
      document.querySelector(".wind .card-value").textContent = `💨 ${data.wind.speed} m/s`;
      document.querySelector(".humidity .card-value").textContent = `💧 ${data.main.humidity}%`;
      document.querySelector(".pressure .card-value").textContent = `🔽 ${data.main.pressure} hPa`;
    } catch (error) {
      console.error("Failed GET Weather Datas:", error);
      setPhrase("Weather Unavailable");
    }
  };
  
  const animateFontLoop = () => {
    time += 0.02;
  
    charParams.forEach((params, char) => {
        const t = time * params.speed + params.phase;
    
        const weight = 400 + Math.sin(t * 1.2) * params.ampWght;
        const width = 100 + Math.cos(t * 1.1) * params.ampWdth;
        const slnt = -params.ampSlnt + Math.sin(t) * params.ampSlnt;
    
        char.style.fontVariationSettings = `"wght" ${weight.toFixed(1)}, "wdth" ${width.toFixed(1)}, "slnt" ${slnt.toFixed(1)}`;
      });
    
      requestAnimationFrame(animateFontLoop);
  };
  
  const toggleSlant = () => {
    isSlanted = !isSlanted;
    setTimeout(toggleSlant, 4000);
  };

  const setPhrase = (text) => {
    phraseEl.innerHTML = "";
    charParams.clear();
    [...text].forEach((char, i) => {
      const span = document.createElement("span");
      span.textContent = char;
      span.classList.add("char");
      span.style.setProperty("--i", i);
      phraseEl.appendChild(span);

      charParams.set(span, {
        phase: Math.random() * Math.PI * 2,
        ampWght: 80 + Math.random() * 40,
        ampWdth: 15 + Math.random() * 10,
        ampSlnt: 5 + Math.random() * 10,
        speed: 0.5 + Math.random() * 1.5
      });
    });
  };
  
  document.addEventListener("DOMContentLoaded", () => {
    cityInput = document.getElementById("city");
    phraseEl = document.querySelector(".weather-phrase");

    setPhrase("Weather Type");

    const defaultCity = "Lisbon";
    cityInput.value = defaultCity;
    fetchWeather(defaultCity);
  
    document.getElementById("get-weather").addEventListener("click", () => {
      fetchWeather(cityInput.value);
    });
  
    toggleSlant();
    animateFontLoop();
  });
  