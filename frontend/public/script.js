const apiUrl = 'http://localhost:5000/api/notes';

const notesContainer = document.getElementById('notes');
const noteForm = document.getElementById('note-form');
const titleInput = document.getElementById('title');
const contentInput = document.getElementById('content');
const submitButton = noteForm.querySelector('button[type="submit"]');
const cancelEditBtn = document.getElementById('cancel-edit');

let isEditing = false;
let currentNoteId = null;


// Fetch and display all notes
async function fetchNotes() {
  try {
    const res = await fetch(apiUrl);
    const notes = await res.json();
    renderNotes(notes);
  } catch (error) {
    console.error('Error fetching notes:', error);
  }
}

cancelEditBtn.addEventListener('click', () => {
  titleInput.value = '';
  contentInput.value = '';
  isEditing = false;
  currentNoteId = null;
  submitButton.textContent = 'Add Note';
  cancelEditBtn.classList.add('hidden');
  cancelEditBtn.classList.add('hidden')
});


// Render notes in the DOM
function renderNotes(notes) {
  notesContainer.innerHTML = ''; // clear existing notes
  notes.forEach(note => {
    const noteDiv = document.createElement('div');
    noteDiv.classList.add('note', 'border', 'p-3', 'mb-3', 'rounded', 'shadow');

    noteDiv.innerHTML = `
      <h3 class="font-bold">${note.title}</h3>
      <p>${note.content}</p>
      <div class="flex gap-2 mt-2">
      <button data-id="${note._id}" class="edit-btn bg-blue-500 text-white px-2 py-1 rounded">Edit</button>
      <button data-id="${note._id}" class="delete-btn bg-red-500 text-white px-2 py-1 rounded mt-2">Delete</button>
      </div>
      `;
   

    notesContainer.appendChild(noteDiv);
  });


  document.querySelectorAll('.edit-btn').forEach(button => {
    button.addEventListener('click', () => {
      const noteId = button.getAttribute('data-id');
      const note = notes.find(n => n._id === noteId);
      if (note) {
        // Populate form inputs for editing
        console.log('Editing note:', note);
        titleInput.value = note.title;
        contentInput.value = note.content;

        isEditing = true;
        currentNoteId = note._id;
        submitButton.textContent = 'Update Note';
        cancelEditBtn.classList.remove('hidden');
      }
    });
  });
  // Attach delete event listeners
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const id = e.target.dataset.id;
      await deleteNote(id);
      fetchNotes(); // refresh list
    });
  });
}

// Add a new note (form submit handler)
noteForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const title = titleInput.value.trim();
  const content = contentInput.value.trim();

  if (!title || !content) {
    alert('Please enter title and content');
    return;
  }

  try {
     if (isEditing && currentNoteId) {
      // Update existing note
      const res = await fetch(`${apiUrl}/${currentNoteId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      });


    if (!res.ok) throw new Error('Failed to update note');
     }else{
       // Add new note
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
     });
       
      if (!res.ok) throw new Error('Failed to add note');
    }
    // Clear form
    titleInput.value = '';
    contentInput.value = '';
    isEditing = false;
    currentNoteId = null;
    submitButton.textContent = 'Add Note';
    fetchNotes(); // refresh list
  } catch (error) {
    console.error('Error saving note:', error);
  }
});

// Delete a note by id
async function deleteNote(id) {
  try {
    const res = await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete note');
  } catch (error) {
    console.error('Error deleting note:', error);
  }
}

// Initial fetch on page load
fetchNotes();
