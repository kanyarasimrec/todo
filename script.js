// =============================
// 📅 DAYS ARRAY (Monday First)
// =============================
const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// =============================
// 📆 GET TODAY NAME CORRECTLY
// =============================
function getTodayName() {
    const todayIndex = new Date().getDay(); 
    return days[todayIndex === 0 ? 6 : todayIndex - 1];
}

// =============================
// 📦 LOCAL STORAGE
// =============================
let timetable = JSON.parse(localStorage.getItem("timetable")) || {};

// Always show today's timetable when opening
let selectedDay = getTodayName();
localStorage.setItem("selectedDay", selectedDay);

// =============================
// 📝 NOTES SECTION
// =============================
const noteBox = document.getElementById("noteBox");
noteBox.value = localStorage.getItem("note") || "";

function autoResize() {
    noteBox.style.height = "auto";
    noteBox.style.height = noteBox.scrollHeight + "px";
}

noteBox.addEventListener("input", () => {
    localStorage.setItem("note", noteBox.value);
    autoResize();
});

autoResize();

// =============================
// 📅 DAY BUTTONS
// =============================
const dayContainer = document.getElementById("dayContainer");

days.forEach(day => {
    const btn = document.createElement("button");
    btn.innerText = day;
    btn.className = "day-btn";

    if (day === selectedDay) btn.classList.add("active");

    btn.onclick = () => {
        selectedDay = day;
        localStorage.setItem("selectedDay", selectedDay);

        document.querySelectorAll(".day-btn")
            .forEach(b => b.classList.remove("active"));

        btn.classList.add("active");
        renderSlots();
    };

    dayContainer.appendChild(btn);
});

// =============================
// 🎨 COLOR CLASSES
// =============================
const colors = ["color1", "color2", "color3", "color4", "color5"];

function getRandomColor() {
    return colors[Math.floor(Math.random() * colors.length)];
}

// =============================
// ⏰ FORMAT 24H → 12H
// =============================
function formatTo12Hour(time24) {
    if (!time24) return "";

    let [hour, minute] = time24.split(":");
    hour = parseInt(hour);

    let ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12;
    hour = hour ? hour : 12;

    return `${hour}:${minute} ${ampm}`;
}

// =============================
// 🧱 RENDER SLOTS
// =============================
function renderSlots() {
    slotContainer.innerHTML = "";

    if (!timetable[selectedDay]) {
        timetable[selectedDay] = [];
    }

    timetable[selectedDay].forEach((slot, index) => {

        const card = document.createElement("div");
        card.className = `slot-card ${slot.color}`;

        card.innerHTML = `
            <div class="slot-content">
                ${
                    slot.time 
                    ? `<div class="display-time">${formatTo12Hour(slot.time)}</div>` 
                    : `<input type="time" class="time-input">`
                }
                <input type="text" value="${slot.subject}" placeholder="Subject">
            </div>
            <button class="delete-btn">✖</button>
        `;

        const timeInput = card.querySelector(".time-input");
        const subjectInput = card.querySelector("input[type='text']");
        const deleteBtn = card.querySelector(".delete-btn");

        // If time input exists (not selected yet)
        if (timeInput) {
            timeInput.addEventListener("change", (e) => {
                timetable[selectedDay][index].time = e.target.value;
                saveData();
                renderSlots(); // Re-render to replace input with display
            });
        }

        // Update subject
        subjectInput.addEventListener("input", (e) => {
            timetable[selectedDay][index].subject = e.target.value;
            saveData();
        });

        // Delete slot
        deleteBtn.onclick = () => {
            timetable[selectedDay].splice(index, 1);
            saveData();
            renderSlots();
        };

        slotContainer.appendChild(card);
    });
}

// =============================
// ➕ ADD SLOT
// =============================
function addSlot() {
    if (!timetable[selectedDay]) {
        timetable[selectedDay] = [];
    }

    timetable[selectedDay].push({
        time: "",
        subject: "",
        color: getRandomColor()
    });

    saveData();
    renderSlots();
}

// =============================
// 💾 SAVE DATA
// =============================
function saveData() {
    localStorage.setItem("timetable", JSON.stringify(timetable));
}

// =============================
// 🚀 INITIAL LOAD
// =============================
renderSlots();
