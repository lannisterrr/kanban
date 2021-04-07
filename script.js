const addBtns = document.querySelectorAll('.add-btn:not(.solid)');
const saveItemBtns = document.querySelectorAll('.solid');
const addItemContainers = document.querySelectorAll('.add-container');
const addItems = document.querySelectorAll('.add-item');
// Item Lists
const listColumns = document.querySelectorAll('.drag-item-list');
const backlogList = document.getElementById('backlog-list');
const progressList = document.getElementById('progress-list');
const completeList = document.getElementById('complete-list');
const onHoldList = document.getElementById('on-hold-list');

// Items
let updatedOnLoad = false;

// Initialize Arrays
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArrays =[]; // an array of all  the above arrays


// Drag Functionality
let draggedItem;
let currentColumn;
let dragging = false;

// Get Arrays from localStorage if available, set default values if not
function getSavedColumns() {
  if (localStorage.getItem('backlogItems')) {
    backlogListArray = JSON.parse(localStorage.backlogItems);
    progressListArray = JSON.parse(localStorage.progressItems);
    completeListArray = JSON.parse(localStorage.completeItems);
    onHoldListArray = JSON.parse(localStorage.onHoldItems);
  } else {
    backlogListArray = ['Release the course', 'Sit back and relax'];
    progressListArray = ['Work on projects', 'Listen to music'];
    completeListArray = ['Being cool', 'Getting stuff done'];
    onHoldListArray = ['Being uncool'];
  }
}


// Set localStorage Arrays, how to loop through 2 arrays
function updateSavedColumns() {
  listArrays = [backlogListArray , progressListArray, completeListArray , onHoldListArray];
  const arrayNames = ['backlog','progress', 'complete', 'onHold'];

  arrayNames.forEach((arrayName,index) =>{
    localStorage.setItem(`${arrayName}Items`,JSON.stringify(listArrays[index]));
  });

  // localStorage.setItem('backlogItems', JSON.stringify(backlogListArray)); the above code is dry version of this
  // localStorage.setItem('progressItems', JSON.stringify(progressListArray));
  // localStorage.setItem('completeItems', JSON.stringify(completeListArray));
  // localStorage.setItem('onHoldItems', JSON.stringify(onHoldListArray));
}

// filter arrays to remove empty items
function filterArray(array){
  const filteredArray = array.filter(item => item !== null);
  // console.log(filteredArray);
  return filteredArray;
}


// Create DOM Elements for each list item
function createItemEl(columnEl, column, item, index) {
  // console.log('columnEl:', columnEl);
  // console.log('column:', column);
  // console.log('item:', item);
  // console.log('index:', index);
  // List Item
  const listEl = document.createElement('li');
  listEl.classList.add('drag-item');
  listEl.textContent = item;
  listEl.draggable = true;
  listEl.setAttribute('ondragstart','drag(event)');
  listEl.contentEditable = true;
  listEl.id = index;
  listEl.setAttribute('onfocusout', `updateItem(${index} , ${column})`);
  // append
  columnEl.appendChild(listEl);
}

// update Item - Delete if necessary , or update Array value
function updateItem(id , column){
  const selectedArray = listArrays[column];
  const selectedColumnEl = listColumns[column].children;
  if(!dragging){
  // console.log(selectedColumnEl[id].textContent);
  if(!selectedColumnEl[id].textContent){
    delete selectedArray[id];
  }else{
    selectedArray[id] = selectedColumnEl[id].textContent;
  }
  // console.log('selected column text',selectedColumnEl[id].textContent);
  updateDOM();
  }
}



// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM() {
  // Check localStorage once
  if(!updatedOnLoad){
    getSavedColumns();
  }
  // Backlog Column
  backlogList.textContent ='';
  backlogListArray.forEach((backlogItem, index) => {
    createItemEl(backlogList,0,backlogItem,index);
  });
  backlogListArray = filterArray(backlogListArray);
  // Progress Column
  progressList.textContent ='';
  progressListArray.forEach((progressItem, index) => {
    createItemEl(progressList,1,progressItem,index);
  });
  progressListArray = filterArray(progressListArray);
  // Complete Column
  completeList.textContent ='';
  completeListArray.forEach((completeItem, index) => {
    createItemEl(completeList,2,completeItem,index);
  });
  completeListArray = filterArray(completeListArray);
  // On Hold Column
  onHoldList.textContent ='';
  onHoldListArray.forEach((onHoldItem, index) => {
    createItemEl(onHoldList,3,onHoldItem,index);
  });
  onHoldListArray = filterArray(onHoldListArray);
  // Run getSavedColumns only once, Update Local Storage
  updatedOnLoad = true;
  updateSavedColumns();
}

// Add to Column List, Reset Textbox
function addToColumnn(column){
  // console.log(addItems[column].textContent); the stuff we write
  const itemText = addItems[column].textContent;
  const selectedArray = listArrays[column];
  selectedArray.push(itemText);
  addItems[column].textContent = '';
  updateDOM();
}

// Show add Item input box
function showInputBox(column){
  addBtns[column].style.visibility = 'hidden';
  saveItemBtns[column].style.display = 'flex';
  addItemContainers[column].style.display ='flex';
}

// Hide Item input box
function hideInputBox(column){
  addBtns[column].style.visibility = 'visible';
  saveItemBtns[column].style.display = 'none';
  addItemContainers[column].style.display ='none';
  addToColumnn(column);
}


// allow arrays to reflect Drag and Drop items
function rebuildArrays(){
//  console.log(backlogList.children);
//  console.log(progressList.children);
 backlogListArray = Array.from(backlogListEl.children.map(i => i.textContent));
 progressListArray = Array.from(progressListEl.children.map(i => i.textContent));
 completeListArray = Array.from(completeListEl.children.map(i => i.textContent));
 onHoldListArray = Array.from(backlogListEl.children.map(i => i.textContent));
 updateDOM();
}

// when Item Starts Dragging
function drag(e){
   draggedItem = e.target;
   dragging = true;
  //  console.log('dragged item' , draggedItem);
}

// Column ALlows for item to drop
function allowDrop(e){
  e.preventDefault();

}

// when item enters column area

function dragEnter(column){
  // console.log(listColumns[column]);
  listColumns[column].classList.add('over');
  currentColumn = column;
}

function drop(e){
  e.preventDefault();
  // remove background color/panding
  listColumns.forEach((column) => {
    column.classList.remove('over');
  });

  // Add item to column
  const parent = listColumns[currentColumn];
  parent.appendChild(draggedItem);
  // draging complete
  dragging = false;
  rebuildArrays();
}

// on load
updateDOM();