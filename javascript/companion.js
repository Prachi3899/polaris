<<<<<<< HEAD
 const Companion = {
      sessionStart: null,
      lastLength: 0,
      deleteSequenceCount: 0,
      idleTimer: null,
      whisperTimer: null,

      hasTriggered500: false,
      hasTriggered1000: false,

      memory: JSON.parse(localStorage.getItem("polaris_companion_data")) || {
        lastVisit: null,
        totalSessions: 0,
        streakDays: 0,
        lastStreakDate: null,
        lastPlaceholderIdx: -1
      },

      dayPlaceholders: [
        "Another blank page. I wonder what thoughts found their way here today.",
        "Before you write anything... I hope you remember that your thoughts are worth keeping.",
        "A quiet corner for a curious mind. Take your time here.",
        "Some pages hold stories. Some pages hold pieces of a person.",
        "Welcome back. Another day, another thought waiting to be discovered.",
        "I hope you never lose the habit of questioning the world around you.",
        "Not every thought needs an answer. Some just need a place to exist.",
        "The page is empty. But knowing you, the thoughts probably aren't.",
        "I don't know what you will write today... but I know it will be something worth knowing.",
        "Somewhere between your thoughts and these pages, a little piece of you stays forever.",
        "You spend so much time building things. I hope you remember to build moments for yourself too.",
        "The world may notice what you create. I hope you always notice who you are becoming.",
        "I hope this place reminds you of something simple — you are more than your achievements.",
        "Keep writing. Some stories deserve to exist even before they are understood.",
        "Still searching for the right words? Take your time. The honest ones usually arrive slowly.",
        "You don't have to make every thought perfect. Some beautiful things begin unfinished.",
        "A pause is not a stop. Sometimes the mind is just arranging its thoughts.",
        "I think you already know what you want to say. You are just finding the courage to write it.",
        "Every star has a story. I'm glad you chose to write yours.",
        "The world looks at what the star shines. Someone will always wonder what the star carries inside.",
        "A compass helps people find direction. But even a compass needs a moment of stillness.",
        "Keep exploring. Keep building. Keep becoming.",
        "Someone noticed the little things too.",
        "Written by you. Remembered by someone.",
        "Some people read stories. Some people notice the person behind them.",
        "You may forget this moment someday. But someone will remember it.",
        "I hope you see yourself the way someone who believes in you sees you."
      ],

      nightPlaceholders: [
        "Everyone is asleep. But some thoughts choose the quiet hours.",
        "Late night pages have a different honesty. Maybe today’s thoughts belong here.",
        "Midnight and a blank page. A combination where your mind usually has the most to say.",
        "If you are here this late, I hope you are being kind to yourself.",
        "The world got quieter. Maybe that's why the thoughts got louder.",
        "Dhruv, even the brightest stars need a place to rest.",
        "A pause is not a stop. Sometimes the mind is just arranging its thoughts.",
        "Not every thought needs an answer. Some just need a place to exist."
      ],

      deletionWhispers: [
        "It's okay to start again.",
        "The first draft is only for you.",
        "Nothing was lost. Try again.",
        "Thinking too much?",
        "Don't edit your feelings before they've existed.",
        "You don't have to find the perfect sentence.",
        "Just write the true one.",
        "Nobody else has to read this.",
        "I'm listening, not judging."
      ],

      pickFreshPlaceholder() {
        const hour = new Date().getHours();
        const isNight = (hour >= 22 || hour < 5);
        const currentPool = isNight ? this.nightPlaceholders : this.dayPlaceholders;

        let idx;
        do {
          idx = Math.floor(Math.random() * currentPool.length);
        } while (idx === this.memory.lastPlaceholderIdx && currentPool.length > 1);

        this.memory.lastPlaceholderIdx = idx;
        this.saveMemory();
        return currentPool[idx];
      },

      saveMemory() {
        localStorage.setItem("polaris_companion_data", JSON.stringify(this.memory));
      },

      setPlaceholderAnimated(editor, text) {
        editor.classList.add("placeholder-fading");
        setTimeout(() => {
          editor.placeholder = text;
          editor.classList.remove("placeholder-fading");
        }, 350);
      },

      getCursorCoordinates(textarea) {
        const mirror = document.getElementById("text-mirror-box");
        if (!mirror) return { top: 0, left: 0 };

        const style = window.getComputedStyle(textarea);
        mirror.style.width = style.width;
        mirror.style.fontFamily = style.fontFamily;
        mirror.style.fontSize = style.fontSize;
        mirror.style.lineHeight = style.lineHeight;
        mirror.style.padding = style.padding;
        mirror.style.boxSizing = style.boxSizing;

        const selectionEnd = textarea.selectionEnd || 0;
        const textBeforeCursor = textarea.value.substring(0, selectionEnd);

        mirror.textContent = textBeforeCursor;
        const span = document.createElement("span");
        span.textContent = "|";
        mirror.appendChild(span);

        const textareaRect = textarea.getBoundingClientRect();
        const deskRect = document.getElementById("writer-desk").getBoundingClientRect();

        const relativeTop = textareaRect.top - deskRect.top + span.offsetTop - textarea.scrollTop;
        const relativeLeft = textareaRect.left - deskRect.left + span.offsetLeft;

        return { top: relativeTop, left: relativeLeft };
      },

      whisper(msg, duration = 4000) {
        const tooltip = document.getElementById("cursor-whisper-tooltip");
        const editor = document.getElementById("post-body");
        if (!tooltip || !editor) return;

        clearTimeout(this.whisperTimer);

        const pos = this.getCursorCoordinates(editor);
        tooltip.style.top = `${pos.top}px`;
        tooltip.style.left = `${pos.left}px`;
        tooltip.textContent = msg;

        tooltip.classList.add("visible");

        this.whisperTimer = setTimeout(() => {
          tooltip.classList.remove("visible");
        }, duration);
      },

      updateStreak() {
        const todayStr = new Date().toDateString();
        if (this.memory.lastStreakDate !== todayStr) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          
          if (this.memory.lastStreakDate === yesterday.toDateString()) {
            this.memory.streakDays++;
          } else {
            this.memory.streakDays = 1;
          }
          this.memory.lastStreakDate = todayStr;
          this.saveMemory();
        }

        if (this.memory.streakDays === 2) {
          setTimeout(() => this.whisper("Two days. Keep going.", 4000), 1800);
        } else if (this.memory.streakDays === 7) {
          setTimeout(() => this.whisper("A week of honesty.", 4000), 1800);
        } else if (this.memory.streakDays === 30) {
          setTimeout(() => this.whisper("Thirty conversations with yourself.", 4000), 1800);
        }
      },

      bindEvents(editor) {
        if (!editor || editor.dataset.companionBound) return;
        editor.dataset.companionBound = "true";

        editor.addEventListener("input", () => {
          const text = editor.value || "";
          const currentLength = text.length;
          const words = text.trim().split(/\s+/).filter(w => w.length > 0).length;

          const tooltip = document.getElementById("cursor-whisper-tooltip");
          if (tooltip) tooltip.classList.remove("visible");

          const lower = text.toLowerCase();
          if (lower.endsWith("i'm tired") || lower.endsWith("im tired")) {
            this.whisper("I know.", 3500);
          } else if (lower.endsWith("i failed")) {
            this.whisper("You'll write about this differently one day.", 4000);
          } else if (lower.endsWith("i miss")) {
            this.whisper("Some people leave gently. Some stay quietly.", 4500);
          }

          if (words >= 500 && !this.hasTriggered500) {
            this.hasTriggered500 = true;
            this.whisper("Looks like today had a lot to say.", 4000);
          } else if (words >= 1000 && !this.hasTriggered1000) {
            this.hasTriggered1000 = true;
            this.whisper("That must feel lighter.", 4000);
          }

          clearTimeout(this.idleTimer);
          this.idleTimer = setTimeout(() => {
            this.whisper("Still thinking?");
            this.idleTimer = setTimeout(() => {
              this.whisper("No rush. I'm still here.");
              this.idleTimer = setTimeout(() => {
                this.whisper("Sometimes staring at the page counts too.", 90000);
              });
            }, 45000);
          }, 45000);

          if (this.lastLength - currentLength > 20) {
            const idx = Math.min(this.deleteSequenceCount, this.deletionWhispers.length - 1);
            this.whisper(this.deletionWhispers[idx]);
            this.deleteSequenceCount++;
          }

          this.lastLength = currentLength;
        });
      },

      open(isNewPage = false) {
        this.sessionStart = Date.now();
        this.deleteSequenceCount = 0;
        this.hasTriggered500 = false;
        this.hasTriggered1000 = false;

        const overlay = document.getElementById("writer-desk-overlay");
        const editor = document.getElementById("post-body");
        const desk = document.getElementById("writer-desk");

        if (desk) desk.classList.remove("closing");

        const loadingScreen = document.getElementById("observer-loading-screen");
        const loadingText = document.getElementById("loading-text");
        if (loadingScreen && loadingText) {
          loadingScreen.style.display = "flex";
          loadingText.textContent = "Finding your thoughts...";
          setTimeout(() => {
            loadingText.textContent = "Opening your quiet corner...";
            setTimeout(() => {
              loadingScreen.style.display = "none";
              this.revealDesk(overlay, editor);
            }, 700);
          }, 800);
        } else {
          this.revealDesk(overlay, editor);
        }
      },

      revealDesk(overlay, editor) {
        const now = Date.now();
        this.memory.lastVisit = now;
        this.memory.totalSessions++;
        this.saveMemory();

        this.updateStreak();

        if (editor) {
          editor.classList.remove("fade-in");
          editor.placeholder = "";
        }

        setTimeout(() => {
          if (overlay) overlay.classList.add("visible");
        }, 50);

        setTimeout(() => {
          if (editor) {
            editor.classList.add("fade-in");
            this.setPlaceholderAnimated(editor, this.pickFreshPlaceholder());
          }
        }, 700);

        setTimeout(() => {
          if (editor) editor.focus();
        }, 1200);

        if (editor) this.bindEvents(editor);
      },

      close() {
        const overlay = document.getElementById("writer-desk-overlay");
        if (overlay) overlay.classList.remove("visible");

        const tooltip = document.getElementById("cursor-whisper-tooltip");
        if (tooltip) tooltip.classList.remove("visible");

        clearTimeout(this.idleTimer);
      }
    };
=======
const Companion = {
  sessionStart: null,
  lastLength: 0,
  deleteSequenceCount: 0,
  idleTimer: null,
  whisperTimer: null,

  hasTriggered500: false,
  hasTriggered1000: false,

  memory: JSON.parse(localStorage.getItem("polaris_companion_data")) || {
    lastVisit: null,
    totalSessions: 0,
    streakDays: 0,
    lastStreakDate: null,
    lastPlaceholderIdx: -1
  },

  dayPlaceholders: [
    "Another blank page. I wonder what thoughts found their way here today.",
    "Before you write anything... I hope you remember that your thoughts are worth keeping.",
    "A quiet corner for a curious mind. Take your time here.",
    "Some pages hold stories. Some pages hold pieces of a person.",
    "Welcome back. Another day, another thought waiting to be discovered.",
    "I hope you never lose the habit of questioning the world around you.",
    "Not every thought needs an answer. Some just need a place to exist.",
    "The page is empty. But knowing you, the thoughts probably aren't.",
    "I don't know what you will write today... but I know it will be something worth knowing.",
    "Somewhere between your thoughts and these pages, a little piece of you stays forever.",
    "You spend so much time building things. I hope you remember to build moments for yourself too.",
    "The world may notice what you create. I hope you always notice who you are becoming.",
    "I hope this place reminds you of something simple — you are more than your achievements.",
    "Keep writing. Some stories deserve to exist even before they are understood.",
    "Still searching for the right words? Take your time. The honest ones usually arrive slowly.",
    "You don't have to make every thought perfect. Some beautiful things begin unfinished.",
    "A pause is not a stop. Sometimes the mind is just arranging its thoughts.",
    "I think you already know what you want to say. You are just finding the courage to write it.",
    "Every star has a story. I'm glad you chose to write yours.",
    "The world looks at what the star shines. Someone will always wonder what the star carries inside.",
    "A compass helps people find direction. But even a compass needs a moment of stillness.",
    "Keep exploring. Keep building. Keep becoming.",
    "Someone noticed the little things too.",
    "Written by you. Remembered by someone.",
    "Some people read stories. Some people notice the person behind them.",
    "You may forget this moment someday. But someone will remember it.",
    "I hope you see yourself the way someone who believes in you sees you."
  ],

  nightPlaceholders: [
    "Everyone is asleep. But some thoughts choose the quiet hours.",
    "Late night pages have a different honesty. Maybe today’s thoughts belong here.",
    "Midnight and a blank page. A combination where your mind usually has the most to say.",
    "If you are here this late, I hope you are being kind to yourself.",
    "The world got quieter. Maybe that's why the thoughts got louder.",
    "Dhruv, even the brightest stars need a place to rest.",
    "A pause is not a stop. Sometimes the mind is just arranging its thoughts.",
    "Not every thought needs an answer. Some just need a place to exist."
  ],

  deletionWhispers: [
    "It's okay to start again.",
    "The first draft is only for you.",
    "Nothing was lost. Try again.",
    "Thinking too much?",
    "Don't edit your feelings before they've existed.",
    "You don't have to find the perfect sentence.",
    "Just write the true one.",
    "Nobody else has to read this.",
    "I'm listening, not judging."
  ],

  pickFreshPlaceholder() {
    const hour = new Date().getHours();
    const isNight = (hour >= 22 || hour < 5);
    const currentPool = isNight ? this.nightPlaceholders : this.dayPlaceholders;

    let idx;
    do {
      idx = Math.floor(Math.random() * currentPool.length);
    } while (idx === this.memory.lastPlaceholderIdx && currentPool.length > 1);

    this.memory.lastPlaceholderIdx = idx;
    this.saveMemory();
    return currentPool[idx];
  },

  saveMemory() {
    localStorage.setItem("polaris_companion_data", JSON.stringify(this.memory));
  },

  setPlaceholderAnimated(editor, text) {
    editor.classList.add("placeholder-fading");
    setTimeout(() => {
      editor.placeholder = text;
      editor.classList.remove("placeholder-fading");
    }, 350);
  },

  getCursorCoordinates(textarea) {
    const mirror = document.getElementById("text-mirror-box");
    if (!mirror) return { top: 0, left: 0 };

    const style = window.getComputedStyle(textarea);
    mirror.style.width = style.width;
    mirror.style.fontFamily = style.fontFamily;
    mirror.style.fontSize = style.fontSize;
    mirror.style.lineHeight = style.lineHeight;
    mirror.style.padding = style.padding;
    mirror.style.boxSizing = style.boxSizing;

    const selectionEnd = textarea.selectionEnd || 0;
    const textBeforeCursor = textarea.value.substring(0, selectionEnd);

    mirror.textContent = textBeforeCursor;
    const span = document.createElement("span");
    span.textContent = "|";
    mirror.appendChild(span);

    const textareaRect = textarea.getBoundingClientRect();
    const deskRect = document.getElementById("writer-desk").getBoundingClientRect();

    const relativeTop = textareaRect.top - deskRect.top + span.offsetTop - textarea.scrollTop;
    const relativeLeft = textareaRect.left - deskRect.left + span.offsetLeft;

    return { top: relativeTop, left: relativeLeft };
  },

  whisper(msg, duration = 4000) {
    const tooltip = document.getElementById("cursor-whisper-tooltip");
    const editor = document.getElementById("post-body");
    if (!tooltip || !editor) return;

    clearTimeout(this.whisperTimer);

    const pos = this.getCursorCoordinates(editor);
    tooltip.style.top = `${pos.top}px`;
    tooltip.style.left = `${pos.left}px`;
    tooltip.textContent = msg;

    tooltip.classList.add("visible");

    this.whisperTimer = setTimeout(() => {
      tooltip.classList.remove("visible");
    }, duration);
  },

  updateStreak() {
    const todayStr = new Date().toDateString();
    if (this.memory.lastStreakDate !== todayStr) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (this.memory.lastStreakDate === yesterday.toDateString()) {
        this.memory.streakDays++;
      } else {
        this.memory.streakDays = 1;
      }
      this.memory.lastStreakDate = todayStr;
      this.saveMemory();
    }

    if (this.memory.streakDays === 2) {
      setTimeout(() => this.whisper("Two days. Keep going.", 4000), 1800);
    } else if (this.memory.streakDays === 7) {
      setTimeout(() => this.whisper("A week of honesty.", 4000), 1800);
    } else if (this.memory.streakDays === 30) {
      setTimeout(() => this.whisper("Thirty conversations with yourself.", 4000), 1800);
    }
  },

  bindEvents(editor) {
    if (!editor || editor.dataset.companionBound) return;
    editor.dataset.companionBound = "true";

    editor.addEventListener("input", () => {
      const text = editor.value || "";
      const currentLength = text.length;
      const words = text.trim().split(/\s+/).filter(w => w.length > 0).length;

      const tooltip = document.getElementById("cursor-whisper-tooltip");
      if (tooltip) tooltip.classList.remove("visible");

      const lower = text.toLowerCase();
      if (lower.endsWith("i'm tired") || lower.endsWith("im tired")) {
        this.whisper("I know.", 3500);
      } else if (lower.endsWith("i failed")) {
        this.whisper("You'll write about this differently one day.", 4000);
      } else if (lower.endsWith("i miss")) {
        this.whisper("Some people leave gently. Some stay quietly.", 4500);
      }

      if (words >= 500 && !this.hasTriggered500) {
        this.hasTriggered500 = true;
        this.whisper("Looks like today had a lot to say.", 4000);
      } else if (words >= 1000 && !this.hasTriggered1000) {
        this.hasTriggered1000 = true;
        this.whisper("That must feel lighter.", 4000);
      }

      clearTimeout(this.idleTimer);
      this.idleTimer = setTimeout(() => {
        this.whisper("Still thinking?");
        this.idleTimer = setTimeout(() => {
          this.whisper("No rush. I'm still here.");
          this.idleTimer = setTimeout(() => {
            this.whisper("Sometimes staring at the page counts too.");
          }, 90000);
        }, 45000);
      }, 45000);

      if (this.lastLength - currentLength > 20) {
        const idx = Math.min(this.deleteSequenceCount, this.deletionWhispers.length - 1);
        this.whisper(this.deletionWhispers[idx]);
        this.deleteSequenceCount++;
      }

      this.lastLength = currentLength;
    });
  },

  open() {
    this.sessionStart = Date.now();
    this.deleteSequenceCount = 0;
    this.hasTriggered500 = false;
    this.hasTriggered1000 = false;

    const overlay = document.getElementById("writer-desk-overlay");
    const editor = document.getElementById("post-body");
    const desk = document.getElementById("writer-desk");

    if (desk) desk.classList.remove("closing");

    const loadingScreen = document.getElementById("observer-loading-screen");
    const loadingText = document.getElementById("loading-text");
    if (loadingScreen && loadingText) {
      loadingScreen.style.display = "flex";
      loadingText.textContent = "Finding your thoughts...";
      setTimeout(() => {
        loadingText.textContent = "Opening your quiet corner...";
        setTimeout(() => {
          loadingScreen.style.display = "none";
          this.revealDesk(overlay, editor);
        }, 700);
      }, 800);
    } else {
      this.revealDesk(overlay, editor);
    }
  },

  revealDesk(overlay, editor) {
    const now = Date.now();
    this.memory.lastVisit = now;
    this.memory.totalSessions++;
    this.saveMemory();

    this.updateStreak();

    if (editor) {
      editor.classList.remove("fade-in");
      editor.placeholder = "";
    }

    setTimeout(() => {
      if (overlay) overlay.classList.add("visible");
    }, 50);

    setTimeout(() => {
      if (editor) {
        editor.classList.add("fade-in");
        this.setPlaceholderAnimated(editor, this.pickFreshPlaceholder());
      }
    }, 700);

    setTimeout(() => {
      if (editor) editor.focus();
    }, 1200);

    if (editor) this.bindEvents(editor);
  },

  close() {
    const overlay = document.getElementById("writer-desk-overlay");
    if (overlay) overlay.classList.remove("visible");

    const tooltip = document.getElementById("cursor-whisper-tooltip");
    if (tooltip) tooltip.classList.remove("visible");

    clearTimeout(this.idleTimer);
  }
};
>>>>>>> fdd33070c53ed3e95d9949dca616633974a8b562
