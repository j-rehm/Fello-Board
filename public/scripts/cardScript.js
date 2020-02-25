const cardButton = document.getElementById('addCardButton');
const parentDiv = document.getElementById('parentDiv');

const drag = (elmnt) => {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    
    const dragMouseDown = (e) => {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }
    
    document.getElementById(`${elmnt.id}Header`).onmousedown = dragMouseDown;
    
    const elementDrag = (e) => {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }
    
    const closeDragElement = () => {
        /* stop moving when mouse button is released:*/
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

var counter = 0;

const editField = (e) => {
    // GAIGE CODE HERE
}

const checkIfList = (e) => {
    console.log(e);
    console.log('poop');
    e.target.onmousemove = null;
}

const addNewCard = (e) => {
    // Creates the overall child DIV
    let childDiv = document.createElement("DIV");
    
    // Connect created DIV to parent div
    parentDiv.appendChild(childDiv);
    
    // Adds class tag and id to "childDiv"
    childDiv.classList.add('divInfo');
    childDiv.id = `info${counter}`;
    // Setting min width and height
    childDiv.style.minHeight = '200px';
    childDiv.style.minWidth = '300px';
    
    // Creates the drag header DIV
    let dragDiv = document.createElement("DIV");
    
    // Add click events to header and description DIVs
    let header = document.createElement("P");
    let desc = document.createElement("P");
    
    // Adds class and id name to "header" and "desc"
    header.classList.add('cardHeader');
    header.id = `pHeader${counter}`;
    desc.classList.add('cardDesc');
    desc.id = `pDesc${counter}`;
    
    // Connects the dragDiv to the childDiv
    childDiv.appendChild(dragDiv);
    
    // Adds Title and Description tags to header and description DIVs
    dragDiv.appendChild(header);
    childDiv.appendChild(desc);

    header.style.height = "15px";
    header.style.margin = '0px 10px 0px 10px';
    header.style.border = '2px solid black';
    desc.style.height = "15px";
    desc.style.margin = '10px 10px 0px 10px';
    desc.style.border = '2px solid black';
    
    header.onclick = editField;
    desc.onclick = editField;
    
    // Adds the class tag and id to "dragDiv"
    dragDiv.classList.add('divDrag');
    dragDiv.id = `info${counter}Header`;
    
    // Adds the drag function to the cards
    var divInfos = document.getElementsByClassName("divInfo");
    
    // Adds a method that runs every time it detects the DIV being resized
    console.log(childDiv);
    childDiv.onmousedown = (e) => {
        if (childDiv.onmousedown != null && childDiv.onmousemove == null) {
            childDiv.onmousemove = checkIfList;
        }
    }
    
    [].forEach.call(divInfos, function (divInfo) {
        drag(document.getElementById(`${divInfo.id}`));
    });

    counter += 1;
}

cardButton.onclick = addNewCard;