let keyboardDiv = document.getElementById('simple-keyboard');
let notesRecorded = document.getElementById('notes-recorded');
let startRecordingButton = document.getElementById('start-recording');
let stopRecordingButton = document.getElementById('stop-recording');
let loadSelect = document.querySelector('#load-json select');
let loadButton = document.querySelector('#load-json button');

let synth;
let recording = false; // This is a "flag" that keeps track wether we are recording or note

let notes = []; // This will hold the notes that the user has clicked

function startRecording() {
  // Empty out notes array, clear recorded notes and start recording
  notes = [];
  clearList();
  startRecordingButton.classList.add('recording');
  recording = true;
}
function stopRecording() {
  // Turn recording off, and write the notes
  recording = false;
  startRecordingButton.classList.remove('recording');
  writeNotes(notes);
}

function playNote(evt) {
  // Find out the note that was played from the data attribute
  let note = evt.target.dataset.note;

  // This will create a new synth or if it exists already do nothing
  synth = synth || new Tone.Synth().toMaster()

  // Play the note in the browser
  synth.triggerAttackRelease(note, '8n');

  // If the note is defined, add it to an array of notes
  if(note !== undefined && recording) {
    notes.push(note)
  }
}

function clearList() {
  // Empty the notesRecorded list
  while(notesRecorded.firstChild) {
    notesRecorded.removeChild(notesRecorded.firstChild);
  }
}

function writeNotes(noteList) {
  // First clear out the (previously) recorded notes
  clearList();

  // This has been added to recorder.html
  let noteNamesInput = document.getElementById('note-names');
  noteNamesInput.value = noteList.join(' ');

  // Create list items for notes and add them to #notes-recorded
  for (var i = 0; i < noteList.length; i++) {
    let noteElement = document.createElement('li');
    noteElement.innerText = noteList[i];
    notesRecorded.appendChild(noteElement);
  }
}

function loadJSON() {
  writeNotes(JSON.parse(this.responseText));
}

// No need to understand this yet: a sneak peek into AJAX-loading
function queryJSON(event) {
  event.preventDefault();
  let request = new XMLHttpRequest();
  request.addEventListener('load', loadJSON);
  request.open('GET', '/json/' + loadSelect.value);
  request.send();
}

// Attach event listeners
keyboardDiv.addEventListener('click', playNote);
startRecordingButton.addEventListener('click', startRecording);
stopRecordingButton.addEventListener('click', stopRecording);
loadButton.addEventListener('click', queryJSON);

document.cookie.split(';').filter(part => part !== '').forEach(part => {
  let nameAndContent = part.split('=');
  let name = nameAndContent[0];
  let content = decodeURIComponent(nameAndContent[1]);
  // TODO: Write code here to recognize a notes cookie and then
  // split the content into notes in order to call writeNotes-function.
  console.log(content);
  let noteList = content.split(" ");
  writeNotes(noteList);
});
