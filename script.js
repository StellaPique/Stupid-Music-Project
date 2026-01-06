let library = [];

// References to form and display div
const form = document.getElementById("addForm");
const display = document.getElementById("libraryDisplay");

// Load existing vault.json
fetch('vault.json')
  .then(response => response.json())
  .then(data => {
    library = data.library;
    library.sort((a, b) => a.name.localeCompare(b.name));
    renderLibrary();
  })
  .catch(err => console.error('Could not load vault.json', err));

// Form submit handler
form.addEventListener("submit", function(e) {
  e.preventDefault();

  const name = document.getElementById("itemName").value;
  const type = document.getElementById("itemType").value;

  // Add new item
  library.push({ name, type });

  // Sort alphabetically
  library.sort((a, b) => a.name.localeCompare(b.name));

  // Clear input
  document.getElementById("itemName").value = "";

  // Refresh display
  renderLibrary();
});

// Render the library in the page with remove buttons
function renderLibrary() {
  display.innerHTML = "";
  library.forEach((item, index) => {
    const div = document.createElement("div");

    // Item text
    const text = document.createElement("span");
    text.textContent = `${item.type.toUpperCase()}: ${item.name}`;
    div.appendChild(text);

    // Remove button
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "X";
    removeBtn.style.marginLeft = "10px";
    removeBtn.style.cursor = "pointer";
    removeBtn.style.color = "white";
    removeBtn.style.background = "red";
    removeBtn.style.border = "none";
    removeBtn.style.padding = "2px 6px";
    removeBtn.style.borderRadius = "3px";

    removeBtn.addEventListener("click", () => {
      if (confirm(`Remove ${item.name} from the vault?`)) {
        library.splice(index, 1);  // Remove the item
        renderLibrary();            // Re-render the list
      }
    });

    div.appendChild(removeBtn);
    display.appendChild(div);
  });
}

// Download button
document.getElementById("downloadBtn").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify({ library }, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "vault.json";
  a.click();
  URL.revokeObjectURL(url);
});

// --- Import Vault JSON ---
const importInput = document.createElement("input");
importInput.type = "file";
importInput.accept = ".json";
importInput.id = "importVault";
importInput.style.margin = "5px 0";
form.after(importInput); // Insert below the form

importInput.addEventListener("change", function(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const data = JSON.parse(e.target.result);
      if (data.library) {
        library = data.library;
        library.sort((a, b) => a.name.localeCompare(b.name));
        renderLibrary();
        alert("Vault imported successfully!");
      } else {
        alert("Invalid JSON: missing 'library' key");
      }
    } catch (err) {
      alert("Error reading JSON: " + err.message);
    }
  };
  reader.readAsText(file);
});