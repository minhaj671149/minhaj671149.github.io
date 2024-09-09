let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentDate = new Date();

document.getElementById('prevWeekBtn').addEventListener('click', () => {
    changeWeek(-7);
});

document.getElementById('nextWeekBtn').addEventListener('click', () => {
    changeWeek(7);
});

function changeWeek(days) {
    currentDate.setDate(currentDate.getDate() + days);
    updateWeekDisplay();
}

function updateWeekDisplay() {
    const weekStart = new Date(currentDate);
    weekStart.setDate(currentDate.getDate() - currentDate.getDay() + 1); // Start on Monday

    document.getElementById('weekDate').innerText = weekStart.toDateString();

    // Reset each day in the weekly calendar
    document.querySelectorAll('.calendar-day').forEach(day => {
        day.classList.remove('selected');
        day.innerHTML = day.id.charAt(0).toUpperCase() + day.id.slice(1); // Reset day label
    });
}

// Add functionality to click on a day and see its tasks
document.querySelectorAll('.calendar-day').forEach(day => {
    day.addEventListener('click', () => {
        document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('selected'));
        day.classList.add('selected');
        displayTasksForDay(day.id);
    });
});

function displayTasksForDay(dayId) {
    const container = document.getElementById(dayId);
    container.innerHTML = `<strong>${dayId.charAt(0).toUpperCase() + dayId.slice(1)}'s Tasks</strong><br>`;

    const dayIndex = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].indexOf(dayId);
    const dayDate = new Date(currentDate);
    dayDate.setDate(currentDate.getDate() - currentDate.getDay() + dayIndex + 1); // Get the exact date for that day

    // Filter tasks for the specific day
    const dayTasks = tasks.filter(task => {
        const taskDate = new Date(task.date);
        
        if (task.schedule === 'specific' && taskDate.toDateString() === dayDate.toDateString()) {
            return true;
        }
        if (task.schedule === 'daily') {
            return true;
        }
        if (task.schedule === 'range') {
            const startDate = new Date(task.date.start);
            const endDate = new Date(task.date.end);
            return dayDate >= startDate && dayDate <= endDate; // Task should appear within the date range
        }
        return false;
    });

    if (dayTasks.length === 0) {
        container.innerHTML += 'No tasks for this day.';
    } else {
        dayTasks.forEach(task => {
            container.innerHTML += `<div style="background-color: ${task.color}; padding: 5px; margin-top: 5px;">
                <strong>${task.title}</strong>: ${task.info}
            </div>`;
        });
    }
}

// Initialize the week display
updateWeekDisplay();

document.addEventListener('DOMContentLoaded', () => {
    const content = document.querySelector('.transition-content');
    const links = document.querySelectorAll('.transition-link');

    setTimeout(() => {
        content.classList.add('visible');
        links.forEach(link => link.classList.add('visible'));
    }, 100);

    document.querySelectorAll('a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = this.href;

            content.classList.remove('visible');
            links.forEach(link => link.classList.remove('visible'));

            setTimeout(() => {
                window.location.href = target;
            }, 300);
        });
    });
});
