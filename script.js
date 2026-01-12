document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("enrollForm");
  const messageBox = document.getElementById("formMessage");

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      // ✅ Safely grab values
      const entry = {
        parent: document.getElementById("parentName").value.trim(),
        child: document.getElementById("childName").value.trim(),
        email: document.getElementById("email").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        grade: document.getElementById("grade").value,
        message: document.getElementById("message").value.trim(),
        date: new Date().toLocaleString()
      };

      // ✅ Save to localStorage
      const enrollments = JSON.parse(localStorage.getItem("enrollments") || "[]");
      enrollments.push(entry);
      localStorage.setItem("enrollments", JSON.stringify(enrollments));

      // ✅ Show confirmation
      messageBox.textContent = "✅ Enrollment submitted successfully!";
      messageBox.style.color = "green";

      // ✅ Reset form
      form.reset();

      // Optional: clear message after 4 seconds
      setTimeout(() => (messageBox.textContent = ""), 4000);
    });
  }
});
