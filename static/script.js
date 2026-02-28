let editId = null;
const api = "/students";

// ================= FORM SUBMIT =================
document.getElementById("studentForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const student = {
        regno: document.getElementById("regno").value.trim(),
        name: document.getElementById("name").value.trim(),
        department: document.getElementById("department").value.trim(),
        year: document.getElementById("year").value.trim(),
        email: document.getElementById("email").value.trim(),
        phone: document.getElementById("phone").value.trim()
    };

    try {
        if (editId) {
            await fetch(`${api}/${editId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(student)
            });
            editId = null;
        } else {
            const res = await fetch(api, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(student)
            });

            const data = await res.json();
            if (!res.ok) {
                alert(data.error || "Error adding student");
                return;
            }
        }

        document.getElementById("studentForm").reset();
        loadStudents();

    } catch (error) {
        console.error("Error:", error);
    }
});


// ================= LOAD ALL =================
async function loadStudents() {
    try {
        const res = await fetch(api);
        const students = await res.json();

        const table = document.getElementById("studentTable");
        table.innerHTML = "";

        if (students.length === 0) {
            table.innerHTML = `<tr><td colspan="8">No Records Found</td></tr>`;
            return;
        }

        students.forEach(s => {
            table.innerHTML += `
            <tr>
                <td>${s.id}</td>
                <td>${s.regno}</td>
                <td>${s.name}</td>
                <td>${s.department}</td>
                <td>${s.year}</td>
                <td>${s.email}</td>
                <td>${s.phone}</td>
                <td>
                    <button onclick="editStudent(${s.id})">Edit</button>
                    <button onclick="deleteStudent(${s.id})">Delete</button>
                </td>
            </tr>`;
        });

    } catch (error) {
        console.error("Load error:", error);
    }
}


// ================= EDIT =================
async function editStudent(id) {
    try {
        const res = await fetch(api);
        const students = await res.json();
        const student = students.find(s => s.id === id);

        if (!student) return;

        document.getElementById("regno").value = student.regno;
        document.getElementById("name").value = student.name;
        document.getElementById("department").value = student.department;
        document.getElementById("year").value = student.year;
        document.getElementById("email").value = student.email;
        document.getElementById("phone").value = student.phone;

        editId = id;

    } catch (error) {
        console.error("Edit error:", error);
    }
}


// ================= DELETE =================
async function deleteStudent(id) {
    if (!confirm("Are you sure you want to delete this student?")) return;

    try {
        await fetch(`${api}/${id}`, { method: "DELETE" });
        loadStudents();
    } catch (error) {
        console.error("Delete error:", error);
    }
}


// ================= SEARCH =================
async function searchStudent() {
    const reg = document.getElementById("searchRegno").value.trim();

    if (!reg) {
        alert("Please enter Register Number");
        return;
    }

    try {
        const res = await fetch(`/search/${reg}`);
        const data = await res.json();

        const table = document.getElementById("studentTable");
        table.innerHTML = "";

        if (data.message) {
            table.innerHTML = `<tr><td colspan="8">Student Not Found</td></tr>`;
            return;
        }

        table.innerHTML = `
        <tr>
            <td>${data.id}</td>
            <td>${data.regno}</td>
            <td>${data.name}</td>
            <td>${data.department}</td>
            <td>${data.year}</td>
            <td>${data.email}</td>
            <td>${data.phone}</td>
            <td>
                <button onclick="editStudent(${data.id})">Edit</button>
                <button onclick="deleteStudent(${data.id})">Delete</button>
            </td>
        </tr>`;

    } catch (error) {
        console.error("Search error:", error);
    }
}


// ================= AUTO LOAD =================
loadStudents();