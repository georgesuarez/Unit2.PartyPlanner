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
            <p>Location: ${event.location}</p>
            <p>Date: ${event.date}</p>
            <p>Description: ${event.description}</p>
        `;
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", async () => {
            await deleteEvent(event.id);
            getEvents();
        }); 
        li.append(deleteButton);
        return li;
    });
    eventsList.replaceChildren(...eventsCards);
}

async function addEvent(event) {
    event.preventDefault();

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: event.target.name.value,
                location: event.target.location.value,
                date: event.target.date.value + ":00.000Z",
                description: event.target.description.value,
            }),
        });
        const result = await response.json();
        console.log(result);

        if (!response.ok) {
            throw new Error("Failed to create new event");
        }

        render();
    } catch (error) {
        console.log(error);
    }
}

async function deleteEvent(id) {
    try {
        await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
        });
        render();
    } catch (error) {
        console.log(error);
    }
}
