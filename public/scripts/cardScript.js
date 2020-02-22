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

const addNewCard = (e) => {
    // Creates the overall child DIV
    let childDiv = document.createElement("DIV");
    
    // Connect created DIV to parent div
    parentDiv.appendChild(childDiv);
    // Adds class tag and id to "childDiv"
    childDiv.classList.add('divInfo');
    childDiv.id = `info${counter}`;
    // Setting min width and height
    childDiv.style.height = '100px';
    childDiv.style.width = '100px';

    // Creates the drag header DIV
    let dragDiv = document.createElement("DIV");

    // Connects the dragDiv to the childDiv
    childDiv.appendChild(dragDiv);
    // Adds the class tag and id to "dragDiv"
    dragDiv.classList.add('divDrag');
    dragDiv.id = `info${counter}Header`;

    // Adds the drag function to the cards
    var divInfos = document.getElementsByClassName("divInfo");
    
    [].forEach.call(divInfos, function (divInfo) {
        drag(document.getElementById(`${divInfo.id}`));
    });

    counter += 1;
}

cardButton.onclick = addNewCard;