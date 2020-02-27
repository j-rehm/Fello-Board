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
        elmnt.parentElement.style.top = (elmnt.parentElement.offsetTop - pos2) + "px";
        elmnt.parentElement.style.left = (elmnt.parentElement.offsetLeft - pos1) + "px";
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

const checkIfList = (entry) => {
    const cr = entry.contentRect;
    // Resizes the divInfo element
    if (entry.target.getBoundingClientRect().height > 325) {
        entry.target.children[1].style.height = `${entry.target.getBoundingClientRect().height - entry.target.children[0].getBoundingClientRect().height}px`;
    }
    if (cr.height >= 600 && cr.width >= 1000) {
        console.log(entry.target);
    }
}

const addNewCard = (e) => {
    // Creates the overall child DIV
    let childDiv = document.createElement("DIV");
    
    // Connect created DIV to parent div
    parentDiv.appendChild(childDiv);
    
    // Adds class tag and id to "childDiv"
    childDiv.classList.add('divChild');
    childDiv.id = `divChild${counter}`;
    // Setting min width and height
    childDiv.style.minHeight = '301px';
    childDiv.style.minWidth = '322px';
    childDiv.style.padding = '0px';
    
    let divInfo = document.createElement("DIV");
    divInfo.classList.add('divInfo');
    divInfo.id = `info${counter}`;

    divInfo.style.minHeight = '185px';
    divInfo.style.minWidth = '300px';
    divInfo.style.width = childDiv.style.width;
    
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
    childDiv.appendChild(divInfo);
    
    // Adds Title and Description tags to header and description DIVs
    dragDiv.appendChild(header);
    divInfo.appendChild(desc);
    
    header.style.height = "15px";
    header.style.margin = '5px';
    header.style.padding = '0px';
    header.style.border = '2px solid black';
    desc.style.height = "15px";
    desc.style.margin = '5px';
    desc.style.padding = '0px';
    desc.style.border = '2px solid black';
    
    header.onclick = editField;
    desc.onclick = editField;
    
    // Adds the class tag and id to "dragDiv"
    dragDiv.classList.add('divDrag');
    dragDiv.id = `info${counter}Header`;
    
    dragDiv.style.minHeight = '15px';
    dragDiv.style.minWidth = '300px';
    dragDiv.style.width = childDiv.style.width;
    dragDiv.style.height = '52px';

    divInfo.style.height = `${childDiv.getBoundingClientRect().height - dragDiv.getBoundingClientRect().height}px`;

    console.log(childDiv.getBoundingClientRect().height);
    console.log(childDiv.getBoundingClientRect().width );

    // Adds the drag function to the cards
    var divInfos = document.getElementsByClassName("divInfo");
    
    // Adds a method that runs every time it detects the DIV being resized
    var ro = new ResizeObserver( entries => {
        for (let entry of entries) {
            checkIfList(entry);
        }
    });
    
    // Observe one or multiple elements
    ro.observe(childDiv);
    
    [].forEach.call(divInfos, function (divInfo) {
        drag(document.getElementById(`${divInfo.id}`));
    });

    counter += 1;
}

cardButton.onclick = addNewCard;