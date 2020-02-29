const cardButton = document.getElementById('addCardButton');
const parentDiv = document.getElementById('parentDiv');
const modalInput = document.getElementById('modalInput');

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

        // Set the element's new position
        elmnt.parentElement.style.top = (elmnt.parentElement.offsetTop - pos2) + "px";
        elmnt.parentElement.style.left = (elmnt.parentElement.offsetLeft - pos1) + "px";

        var cardButtonRect = cardButton.getBoundingClientRect();
        
        var minHeight = cardButtonRect.top + 5;
        var minLeftPos = cardButtonRect.left + cardButtonRect.width + 5;
        
        // Make sure it isnt too high up
        if (elmnt.parentElement.getBoundingClientRect().top < minHeight) {
            elmnt.parentElement.style.top = minHeight + "px";
        }
        
        // Make sure it isnt too far left
        if (elmnt.parentElement.getBoundingClientRect().left < minLeftPos) {
            elmnt.parentElement.style.left = minLeftPos + "px";
        }
    }
    
    const closeDragElement = () => {
        /* stop moving when mouse button is released:*/
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

var counter = 0;

const editField = (e) => {
    // Get the modal
    var modal = document.getElementById("myModal");

    var modalContent = document.getElementById("modalContent");

    var clickedDiv = e.target;

    modalContent.style.left = clickedDiv.parentElement.getBoundingClientRect().left+'px';
    modalContent.style.top = clickedDiv.parentElement.getBoundingClientRect().top+'px';

    modalContent.style.width = clickedDiv.parentElement.getBoundingClientRect().width+'px';
    modalContent.style.height = clickedDiv.parentElement.getBoundingClientRect().height+'px';
    
    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    // When the user clicks the button, open the modal 
    modal.style.display = "block";

    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}

const checkIfList = (entry) => {
    const cr = entry.contentRect;
    // Resizes the divInfo element
    if (entry.target.getBoundingClientRect().height > 325) {
        entry.target.children[1].style.height = `${entry.target.getBoundingClientRect().height - entry.target.children[0].getBoundingClientRect().height}px`;
    }

    // Checking the size of a card being resized
    if (cr.height >= 600 && cr.width >= 1000) {
        // If a card is a list but reaches a certain size, it will become a list element.
        if (!(/list/gmi.test(entry.target.id))) {
            entry.target.id = entry.target.id + 'List';
            entry.target.classList.remove('divChild');
            entry.target.classList.add('divChildList');
            
            // Changing the FIRST child's class and id name.
            entry.target.children[0].id = entry.target.children[0].id + "List";
            entry.target.children[0].classList.remove('divDrag');
            entry.target.children[0].classList.add('divDragList');
            
            // Changing the SECOND child's class and id name.
            entry.target.children[1].id = entry.target.children[1].id + "List";
            entry.target.children[1].classList.remove('divInfo');
            entry.target.children[1].classList.add('divInfoList');
            // Removes the entry field for the info part of a card.
            entry.target.children[1].removeChild(entry.target.children[1].firstChild);
        }
    // If a card is already a list, and it shrinks with no children, it will not be a list element.
    } else if (cr.height <= 600 && cr.width <= 1000) {
        if (/list/gmi.test(entry.target.id)) {
            entry.target.id = (entry.target.id).replace(/list/gmi, '');
            entry.target.classList.remove('divChildList');
            entry.target.classList.add('divChild');
            
            // Changing the FIRST child's class and id name.
            entry.target.children[0].id = (entry.target.children[0].id).replace(/list/gmi, '');
            entry.target.children[0].classList.remove('divDragList');
            entry.target.children[0].classList.add('divDrag');
            
            // Changing the SECOND child's class and id name.
            entry.target.children[1].id = (entry.target.children[1].id).replace(/list/gmi, '');
            entry.target.children[1].classList.remove('divInfoList');
            entry.target.children[1].classList.add('divInfo');
            // Adds the entry field for the info part of a card.
            let desc = document.createElement("P");
            
            // Adds class and id name to "header" and "desc"
            desc.classList.add('cardDesc');
            desc.id = `pDesc${counter}`;
            
            desc.style.height = "15px";
            desc.onclick = editField;

            entry.target.children[1].appendChild(desc);
        }
    }
}

const addNewCard = (e) => {
    // Create the card div
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

    // Move the card pos to be further right
    childDiv.style.left = cardButton.getBoundingClientRect().left + cardButton.getBoundingClientRect().width + 5 + "px";

    // Move the card pos to be further up
    childDiv.style.top = cardButton.getBoundingClientRect().top + 5 + "px";
    
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
    desc.style.height = "15px";
    
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