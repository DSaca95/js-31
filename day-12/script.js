const quoteText = document.querySelector(".quote-text");
const quoteAuthor = document.querySelector(".quote-author");
const searchBtn = document.getElementById("search");
const randomBtn = document.getElementById("random");
const authorInput = document.getElementById("author");
const getQuoteBtn = document.getElementById("get-quote");
const categorySpans = document.querySelectorAll(".category-list span");

const fetchQuote = async (url, source = "quotable") => {
    quoteText.textContent = "Loading...";
    quoteAuthor.textContent = "—";
  
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      console.log(data);
  
      let quote;
  
      if (source === "quotable") {
        if (Array.isArray(data.results)) {
          if (data.results.length === 0) throw new Error("No quote found");
          quote = data.results[0];
        } else {
          quote = data;
        }
        quoteText.textContent = quote.content;
        quoteAuthor.textContent = `— ${quote.author}`;
      }
    } catch (err) {
      quoteText.textContent = "Quote unavailable.";
      quoteAuthor.textContent = "";
      console.error("Fetch error:", err.message);
    }
  };

  searchBtn.addEventListener("click", () => {
    const author = authorInput.value.trim();
    if (!author) return;
    fetchQuote(`https://api.quotable.io/quotes?author=${encodeURIComponent(author)}`, "quotable");
  });

  randomBtn.addEventListener("click", () => {
    fetchQuote("https://api.quotable.io/random", "quotable");
  });

  categorySpans.forEach(span => {
    span.addEventListener("click", () => {
      categorySpans.forEach(s => s.classList.remove("active"));
      span.classList.add("active");
    });
  });

  getQuoteBtn.addEventListener("click", () => {
    const active = document.querySelector(".category-list .active");
    const category = active?.dataset.tag || "inspirational";
    fetchQuote(`https://api.quotable.io/random?tags=${category}`, "quotable");
  });

  window.addEventListener("DOMContentLoaded", () => {
    fetchQuote("https://api.quotable.io/random?tags=inspirational", "quotable");
  });