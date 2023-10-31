const COHORT = "2308-ACC-WEB-PT-B";
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events`;

const state = {
    events: [],
};

const eventsList = document.querySelector("#events");

const addEventForm = document.querySelector("#addEvent");
addEventForm.addEventListener("submit", addEvent);

async function render() {
    await getEvents();
    renderEvents();
}
render();

async function getEvents() {
    try {
        const response = await fetch(API_URL);
        const json = await response.json();
        state.events = json.data;
    } catch (error) {
        console.log(error);
    }
}

async function renderEvents() {
    if (!state.events.length) {
        eventsList.innerHTML = "<li>No events.</li>";
        return;
    }

    const eventsCards = state.events.map((event) => {
        const li = document.createElement("li");
        li.innerHTML = `
            <h2>Name: ${event.name}</h2>
            <p>Description: ${event.description}</p>
        `;
        return li;
    });
    eventsList.replaceChildren(...eventsCards);
}

async function addEvent(event) {
    event.preventDefault();

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({
                name: addEventForm.name.value,
                description: addEventForm.description.value
            }),
        });

        if (!response.ok) {
            throw new Error("Failed to create new event");
        }
        
        render();

    } catch (error) {
        console.log(error);
    }
}