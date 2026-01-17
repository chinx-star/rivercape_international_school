// Default admin credentials
const defaultAdmin = { user: "admin", pass: "1234", role: "super" };

document.addEventListener("DOMContentLoaded", () => {
  // Initialize admin accounts
  if (!localStorage.getItem("admins")) {
    localStorage.setItem("admins", JSON.stringify([defaultAdmin]));
  }

  const form = document.getElementById("loginForm");
  const panel = document.getElementById("adminPanel");
  const logout = document.getElementById("logoutBtn");

  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");

  // Handle login
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const admins = JSON.parse(localStorage.getItem("admins")) || [];
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    const found = admins.find(a => a.user === username && a.pass === password);

    if (found) {
      form.style.display = "none";
      panel.style.display = "block";
      renderEnrollments();
    } else {
      alert("Invalid credentials.\nTry Username: admin | Password: 1234");
    }
  });

  // Handle logout
  logout.addEventListener("click", () => {
    panel.style.display = "none";
    form.style.display = "block";
    form.reset();
  });

  // Handle CSV Download
  document.getElementById("downloadBtn").addEventListener("click", () => {
    const enrollments = JSON.parse(localStorage.getItem("enrollments") || "[]");
    if (enrollments.length === 0) return alert("⚠️ No data available to export.");

    const headers = Object.keys(enrollments[0]);
    const csvRows = [
      headers.join(","),
      ...enrollments.map(e => headers.map(h => `"${e[h] || ''}"`).join(","))
    ];
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "enrollments_export.csv";
    link.click();
  });
});

// ==================== MAIN TABLE RENDER ====================
function renderEnrollments() {
  const table = document.getElementById("enrollTable");
  const enrollments = JSON.parse(localStorage.getItem("enrollments") || "[]");

  if (enrollments.length === 0) {
    table.innerHTML = `
      <tr>
        <th>Parent</th><th>Child</th><th>Grade</th><th>Email</th><th>Phone</th><th>Date Applied</th><th>Actions</th>
      </tr>
      <tr><td colspan="7" style="text-align:center;">No enrollment data found</td></tr>
    `;
    return;
  }

  table.innerHTML = `
    <tr>
      <th>Parent</th>
      <th>Child</th>
      <th>Grade</th>
      <th>Email</th>
      <th>Phone</th>
      <th>Date Applied</th>
      <th>Actions</th>
    </tr>
    ${enrollments.map((e, i) => `
      <tr>
        <td contenteditable="true" class="editable" data-field="parent" data-index="${i}">${e.parent || "—"}</td>
        <td contenteditable="true" class="editable" data-field="child" data-index="${i}">${e.child || "—"}</td>
        <td contenteditable="true" class="editable" data-field="grade" data-index="${i}">${e.grade || "—"}</td>
        <td contenteditable="true" class="editable" data-field="email" data-index="${i}">${e.email || "—"}</td>
        <td contenteditable="true" class="editable" data-field="phone" data-index="${i}">${e.phone || "—"}</td>
        <td>${e.date || "—"}</td>
        <td>
          <button class="save-btn" data-index="${i}">💾 Save</button>
          <button class="delete-btn" data-index="${i}">🗑️ Delete</button>
        </td>
      </tr>
    `).join("")}
  `;

  // 🔴 Handle delete
  document.querySelectorAll(".delete-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const index = e.target.dataset.index;
      if (confirm("Are you sure you want to delete this record?")) {
        enrollments.splice(index, 1);
        localStorage.setItem("enrollments", JSON.stringify(enrollments));
        renderEnrollments();
      }
    });
  });

  // 🟢 Handle save after editing
  document.querySelectorAll(".save-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const index = e.target.dataset.index;
      const editedFields = document.querySelectorAll(`[data-index='${index}']`);
      editedFields.forEach(cell => {
        enrollments[index][cell.dataset.field] = cell.textContent.trim();
      });
      localStorage.setItem("enrollments", JSON.stringify(enrollments));
      alert("✅ Changes saved successfully!");
    });
  });
}
