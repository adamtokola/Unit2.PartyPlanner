const apiUrl =
  "https://fsa-crud-2aa9294fe819.herokuapp.com/api/2407-FTB-ET-WEB-PT/events";

const partyListElement = document.getElementById("party-list");

const addPartyFormElement = document.getElementById("add-party-form");

async function renderPartyList() {
  try {
    const response = await fetch(apiUrl);
    const partiesData = await response.json();

    if (partiesData.success && Array.isArray(partiesData.data)) {
      const parties = partiesData.data;

      const partyListHtml = parties
        .map(
          (party) => `
                <li>
                    <h2>${party.name}</h2>
                    <p>${party.description}</p>
                    <p>Date: ${party.date}</p>
                    <p>Location: ${party.location}</p>
                    <button id="delete-party-${party.id}">Delete</button>
                </li>
            `
        )
        .join("");

      partyListElement.innerHTML = partyListHtml;
    } else {
      console.error("Error fetching parties:", partiesData.error.message);
      partyListElement.innerHTML =
        "<li>Error: Unable to render party list.</li>";
    }
  } catch (error) {
    console.error("Error fetching party list:", error);
    partyListElement.innerHTML = "<li>Error: Unable to render party list.</li>";
  }
}

async function addParty(event) {
  event.preventDefault();

  const dateValue = addPartyFormElement.date.value;
  const timeValue = addPartyFormElement.time.value;

  const isoDateTime = new Date(`${dateValue}T${timeValue}:00`).toISOString();

  const partyData = {
    name: addPartyFormElement.name.value,
    date: isoDateTime,
    location: addPartyFormElement.location.value,
    description: addPartyFormElement.description.value,
  };

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(partyData),
    });

    const result = await response.json();

    if (response.ok && result.success) {
      renderPartyList();
    } else {
      console.error("Error adding party:", result.error.message);
      alert("Error adding party: " + result.error.message);
    }
  } catch (error) {
    console.error("Error adding party:", error.message);
    alert("Error adding party: " + error.message);
  }
}

async function deleteParty(event) {
  if (event.target.tagName === "BUTTON") {
    const partyId = event.target.id.split("-")[2];
    try {
      const response = await fetch(`${apiUrl}/${partyId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        renderPartyList();
      } else {
        const result = await response.json();
        console.error("Error deleting party:", result.error.message);
        alert("Error deleting party: " + result.error.message);
      }
    } catch (error) {
      console.error("Error deleting party:", error.message);
      alert("Error deleting party: " + error.message);
    }
  }
}

renderPartyList();

addPartyFormElement.addEventListener("submit", addParty);
partyListElement.addEventListener("click", deleteParty);
