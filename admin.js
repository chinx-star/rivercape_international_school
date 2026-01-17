// Default admin credentials
const defaultAdmin = { user: "admin", pass: "1234", role: "super" };

document.addEventListener("DOMContentLoaded", () => {
  // Initialize localStorage for admin accounts
  if (!localStorage.getItem("admins")) {
    localStorage.setItem("admins", JSON.stringify([defaultAdmin]));
  }

  // Get key elements
  const form = document.getElementById("loginForm");
  const panel = document.getElementById("adminPanel");
  const logout = document.getElementById("logoutBtn");

  // ✅ Get username and password fields safely
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");

  // Handle login
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const admins = JSON.parse(localStorage.getItem("admins")) || [];
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    const found = admins.find(
      a => a.user === username && a.pass === password
    );

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
});

// Renders enrollment data (if any)
function renderEnrollments() {
  const table = document.getElementById("enrollTable");
  const enrollments = JSON.parse(localStorage.getItem("enrollments") || "[]");

  if (enrollments.length === 0) {
    table.innerHTML = `
      <tr>
        <th>Parent</th><th>Child</th><th>Grade</th><th>Email</th><th>Phone</th>
      </tr>
      <tr><td colspan="5" style="text-align:center;">No enrollment data found</td></tr>
    `;
    return;
  }

  table.innerHTML = `
    <tr>
      <th>Parent</th><th>Child</th><th>Grade</th><th>Email</th><th>Phone</th>
    </tr>
    ${enrollments.map(e => `
      <tr>
        <td>${e.parent}</td>
        <td>${e.child}</td>
        <td>${e.grade}</td>
        <td>${e.email}</td>
        <td>${e.phone}</td>
      </tr>
    `).join("")}
  `;
}
document.addEventListener("DOMContentLoaded", () => {
  const csvBtn = document.getElementById("downloadBtn");

  csvBtn.addEventListener("click", () => {
    const enrollments = JSON.parse(localStorage.getItem("enrollments") || "[]");
    if (enrollments.length === 0) {
      alert("⚠️ No data available to export.");
      return;
    }

    // ✅ Convert JSON to CSV
    const headers = Object.keys(enrollments[0]);
    const csvRows = [
      headers.join(","), // header row
      ...enrollments.map(e => headers.map(h => `"${e[h] || ''}"`).join(","))
    ];
    const csvData = csvRows.join("\n");

    // ✅ Create and trigger download
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "enrollments_export.csv";
    link.click();
  });
});
