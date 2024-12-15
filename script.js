document.addEventListener("DOMContentLoaded", () => {
    const { jsPDF } = window.jspdf;
    
    const taskInput = document.getElementById("taskInput");
    const addTaskBtn = document.getElementById("addTaskBtn");
    const taskList = document.getElementById("taskList");
    const historyList = document.getElementById("historyList");
    const imageInput = document.getElementById("imageInput");
    const generatePdfBtn = document.getElementById("generatePdfBtn");
  
    let taskHistory = [];
    let taskNotes = [];
  
     addTaskBtn.addEventListener("click", () => {
      const taskText = taskInput.value.trim();
      if (taskText === "") return;
  
      const taskItem = document.createElement("li");
      taskItem.innerHTML = `
        <span>${taskText}</span>
        <div class="task-actions">
          <button class="progress-btn">In Progress</button>
          <button class="complete-btn">Complete</button>
        </div>
        <div class="notes-input">
          <textarea class="notes-text" placeholder="Enter notes..."></textarea>
          <button class="save-notes-btn">Save Notes</button>
        </div>
        <div class="task-notes" style="display:none;">
          <strong>Notes:</strong> <span class="note-content"></span>
        </div>
      `;
      taskList.appendChild(taskItem);
      taskInput.value = "";
  
      const progressBtn = taskItem.querySelector(".progress-btn");
      const completeBtn = taskItem.querySelector(".complete-btn");
      const saveNotesBtn = taskItem.querySelector(".save-notes-btn");
      const notesTextArea = taskItem.querySelector(".notes-text");
      const taskNotesDiv = taskItem.querySelector(".task-notes");
      const noteContentSpan = taskItem.querySelector(".note-content");
  
      progressBtn.addEventListener("click", () => updateTask(taskText, "In Progress"));
      completeBtn.addEventListener("click", () => {
        updateTask(taskText, "Completed");
        taskList.removeChild(taskItem);
      });
  
      saveNotesBtn.addEventListener("click", () => {
        const notes = notesTextArea.value.trim();
        if (notes) {
          taskNotesDiv.style.display = "block";
          noteContentSpan.textContent = notes;
          taskNotes.push({ task: taskText, notes });
          notesTextArea.value = "";
        }
      });
    });
  
     function updateTask(task, status) {
      const historyItem = document.createElement("li");
      historyItem.textContent = `Task: "${task}" marked as "${status}"`;
      historyList.appendChild(historyItem);
      taskHistory.push(`Task: "${task}" marked as "${status}"`);
    }
  
     generatePdfBtn.addEventListener("click", () => {
      const doc = new jsPDF();
  
       doc.setFontSize(18);
      doc.text("ST SOFTWARE SOLUTION Task and Work Update", 20, 20);
  
       doc.setFontSize(12);
      doc.text("ST SOFTWARE SOLUTION Task Update History:", 20, 40);
      taskHistory.forEach((task, index) => {
        doc.text(`${index + 1}. ${task}`, 20, 50 + (index * 10));
      });
  
       doc.text("Notes:", 20, 90);
      taskNotes.forEach((task, index) => {
        doc.text(`Task: "${task.task}" - Notes: ${task.notes}`, 20, 100 + (index * 10));
      });
  
       if (imageInput.files.length > 0) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imgData = e.target.result;
          doc.addImage(imgData, "JPEG", 20, 120, 180, 120);
          doc.save("ST SOFTWARE SOLUTION.pdf");
        };
        reader.readAsDataURL(imageInput.files[0]);
      } else {
        doc.save("ST SOFTWARE SOLUTION.pdf");
      }
    });
  });
  