var userInput = document.querySelector('textarea');
var excludeSpacesCheckbox = document.getElementById("exclude-spaces");

function updateStats() {
  const input = userInput.value;

  // Update word count
  const wordCount = (input) => {
    const trimmed = input.trim();
    return trimmed === "" ? 0 : trimmed.split(/\s+/).length;
  };
  const words = wordCount(input)
  document.getElementById("word-count").textContent = wordCount(input);

  const avgReadingSpeed = 200; // words per minute
  const readingTimeMinutes = words > 0 ? (words / avgReadingSpeed).toFixed(2) : 0;
  document.getElementById("reading-time").textContent = readingTimeMinutes;

  // Count letters based on checkbox state
  const countLetters = (str) => {
    const excludeSpaces = excludeSpacesCheckbox.checked;
    // For the overall count, if excluding spaces, remove them.
    // Otherwise, allow spaces.
    const lettersForCount = excludeSpaces 
      ? str.replace(/[^a-zA-Z]/g, '')
      : str.replace(/[^a-zA-Z\s]/g, '');
    
    // For letter density, always remove spaces
    const lettersForDensity = lettersForCount.replace(/\s/g, '');
    
    const totalLetters = lettersForCount.length;
    
    const frequency = {};
    for (let char of lettersForDensity.toLowerCase()) {
      frequency[char] = (frequency[char] || 0) + 1;
    }
    
    return { totalLetters, frequency };
  };

  const result = countLetters(input);
  document.getElementById("letter-count").textContent = result.totalLetters;

  // Sentence count
  const numSentenceRegex = /[^.!?]*[.!?]/g;
  const numSentence = input.match(numSentenceRegex) || [];
  document.getElementById("sentence-count").textContent = numSentence.length;

  // Update letter density list
  const sortedLetters = Object.entries(result.frequency)
    .sort((a, b) => b[1] - a[1])
    .map(([letter, count]) => {
      const percentage = result.totalLetters > 0
        ? ((count / result.totalLetters) * 100).toFixed(2)
        : 0;
      return { letter, count, percentage: parseFloat(percentage) };
    });
    
  const container = document.getElementById('letterContainer');
  container.innerHTML = ''; // Clear previous items
  
  if (sortedLetters.length === 0) {
    // Display placeholder text when no letters are found
    const placeholder = document.createElement('p');
    placeholder.classList.add('placeholder-text');
    placeholder.textContent = "No characters found. Start typing to see letter density.";
    container.appendChild(placeholder);
  } else{
  const createLetterItem = ({ letter, count, percentage }) => {
    const letterItem = document.createElement("div");
    letterItem.classList.add("letterItem");

    const letterEl = document.createElement("strong");
    letterEl.textContent = letter.toUpperCase();
    letterEl.classList.add("label");
    letterItem.appendChild(letterEl);

    const barContainer = document.createElement("div");
    barContainer.classList.add("bar-container");

    const progressBar = document.createElement("div");
    progressBar.classList.add("progress-bar");
    progressBar.style.width = `${percentage}%`;

    barContainer.appendChild(progressBar);
    letterItem.appendChild(barContainer);

    const text = document.createElement("span");
    text.classList.add("info-span");
    text.textContent = `${count} (${percentage}%)`;
    letterItem.appendChild(text);

    container.appendChild(letterItem);
  };

  const initialCount = 5;

  const isExpanded = container.classList.contains("expanded");
  const displayList = isExpanded ? sortedLetters : sortedLetters.slice(0, initialCount);

  displayList.forEach(createLetterItem);

  // Remove previous toggle button if exists
  const existingBtn = document.getElementById('toggleBtn');
  if (existingBtn) {
    existingBtn.remove();
  }
  if (input.trim() !== "" && sortedLetters.length > initialCount) {
    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'toggleBtn';
    toggleBtn.innerHTML = isExpanded
    ? 'See Less <i class="fa fa-angle-up"></i>'
    : 'See More <i class="fa fa-angle-down"></i>';
  toggleBtn.classList.add("toggle-btn", "text-style-3");
  container.parentElement.appendChild(toggleBtn);
    toggleBtn.addEventListener('click', () => {
      // Toggle the expanded state on the container and update the list
      container.classList.toggle("expanded");
      updateStats();
    });
  };
}
}

// Update when user types...
userInput.addEventListener('input', updateStats);
// ...and update when the checkbox state changes.
excludeSpacesCheckbox.addEventListener('change', updateStats);
document.addEventListener('DOMContentLoaded', updateStats);

const logoImg = document.querySelector(".navbar__logo img");
//theme toggle
function calculateSettingAsThemeString({ localStorageTheme, systemSettingDark }) {
  if (localStorageTheme !== null) {
    return localStorageTheme;
  }
  if (systemSettingDark.matches) {
    return "dark";
  }
  return "light";
}

/**
 * Utility function to update the toggle control.
 */
function updateButton({ buttonEl, isDark }) {
  const newCta = isDark ? "Change to light theme" : "Change to dark theme";
  buttonEl.setAttribute("aria-label", newCta);
  
  // Update the nested image icon
  const themeIcon = buttonEl.querySelector("img");
  if (themeIcon) {
    // Change image source based on theme—adjust paths as needed
    themeIcon.src = isDark
    
      ? "./assets/images/icon-sun.svg"
      : "./assets/images/icon-moon.svg";
    // Optionally update the alt text
    themeIcon.alt = isDark ? "Moon icon" : "Sun icon";
  }
}

/**
 * Utility function to update the theme on the HTML element.
 */
function updateThemeOnHtmlEl({ theme }) {
  document.querySelector("html").setAttribute("data-theme", theme);
}

// On page load, grab what we need
const themeToggle = document.querySelector("[data-theme-toggle]");
const localStorageTheme = localStorage.getItem("theme");
const systemSettingDark = window.matchMedia("(prefers-color-scheme: dark)");

// Work out the current theme setting
let currentThemeSetting = calculateSettingAsThemeString({ localStorageTheme, systemSettingDark });

// Update the page based on current settings
updateButton({ buttonEl: themeToggle, isDark: currentThemeSetting === "dark" });
updateThemeOnHtmlEl({ theme: currentThemeSetting });

// Add an event listener to toggle the theme when the anchor is clicked
themeToggle.addEventListener("click", (event) => {
  event.preventDefault();
  const newTheme = currentThemeSetting === "dark" ? "light" : "dark";
  localStorage.setItem("theme", newTheme);
  updateButton({ buttonEl: themeToggle, isDark: newTheme === "dark" });
  updateThemeOnHtmlEl({ theme: newTheme });
  currentThemeSetting = newTheme;

  logoImg.src = newTheme === "dark"
  ? "./assets/images/logo-dark-theme.svg"
  : "./assets/images/logo-light-theme.svg";
});

