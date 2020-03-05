const cardButton = document.getElementById('addCardButton');
const parentDiv = document.getElementById('parentDiv');
const modalInput = document.getElementById('modalInput');
const navBar = document.getElementById('navBar');
const image = document.getElementById('image');


var childs = parentDiv.children;

var maxElementID = 0;
[].forEach.call(childs, function (child) {
    let idNum = child.id.substring(8, child.id.length);
    
    if (idNum > maxElementID) maxElementID = idNum;
});

var counter = parseInt(maxElementID) + 1;

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
        // Tilts the card and tones the transparency down.
        elmnt.parentElement.style.transform = 'rotate(2.5deg)';
        elmnt.parentElement.style.opacity = '0.35';
        elmnt.style.opacity = '0.35';
        elmnt.parentElement.children[1].style.opacity = '0.35';

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
        var navBarRect = navBar.getBoundingClientRect();
        
        var minHeight = navBarRect.top + navBarRect.height + 5;
        var minLeftPos = cardButtonRect.left + cardButtonRect.width + 5;
        
        // Make sure it isnt too high up
        if (elmnt.parentElement.getBoundingClientRect().top < minHeight - 8) {
            elmnt.parentElement.style.top = minHeight + "px";
        }
        
        // Make sure it isnt too far left
        if (elmnt.parentElement.getBoundingClientRect().left < minLeftPos - 8) {
            elmnt.parentElement.style.left = minLeftPos + "px";
        }

        checkIfOverTrashIcon(elmnt, e);
    }
    
    const closeDragElement = (e) => {
        /* stop moving when mouse button is released:*/
        document.onmouseup = null;
        document.onmousemove = null;

        // unTilts the card and tones the transparency up.
        elmnt.parentElement.style.transform = 'rotate(0deg)';
        elmnt.parentElement.style.opacity = '1';
        elmnt.style.opacity = '1';
        elmnt.parentElement.children[1].style.opacity = '1';
    }
}

const checkIfOverTrashIcon = (element, e) => {
    let imgX = image.getBoundingClientRect().left;
    let imgW = image.getBoundingClientRect().width;
    let imgY = image.getBoundingClientRect().top;
    let imgH = image.getBoundingClientRect().height;

    let eX = e.clientX;
    let eY = e.clientY;

    if ((imgX + imgW >= eX && imgX <= eX) && (imgY + imgH >= eY && imgY <= eY)) {
        parentDiv.removeChild(element.parentElement);
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

const editField = (e) => {
    // Get the modal
    let modal = document.getElementById("myModal");

    let modalContent = document.getElementById("modalContent");
    let modalInputArea = document.getElementById("modalInput");

    let clickedDiv = e.target;

    // Move the modal to the correct area
    modalContent.style.left = clickedDiv.parentElement.getBoundingClientRect().left+'px';
    modalContent.style.top = clickedDiv.parentElement.getBoundingClientRect().top+'px';

    modalContent.style.width = clickedDiv.parentElement.getBoundingClientRect().width+'px';
    modalContent.style.height = clickedDiv.parentElement.getBoundingClientRect().height+'px';

    // Set the modal input area text to the text in the clicked box
    if (clickedDiv.innerHTML == "") {
        if (clickedDiv.id.includes("pHeader")) {
            modalInputArea.value = "Enter Card Title";
        } else if (clickedDiv.id.includes("pDesc")) {
            modalInputArea.value = "Enter Card Description";
        }
        clickedDiv.style.border = '2px solid grey';
    } else {
        modalInputArea.value = clickedDiv.innerHTML;
    }
    
    // Get the <span> element that closes the modal
    let span = document.getElementsByClassName("close")[0];

    // When the user clicks the button, open the modal 
    modal.style.display = "block";

    // Method to remove html tags from text
    function strip(html){
        var doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || "";
    }

    // When the user clicks on save, close the modal
    span.onclick = function() {
        clickedDiv.innerHTML = strip(modalInputArea.value);
        clickedDiv.style.border = "none";
        modal.style.display = "none";
    }
}

const checkIfList = (entry) => {
    const cr = entry.contentRect;
    // Resizes the divInfo element
    if (cr.height >= 325) {
        entry.target.children[1].style.height = `${entry.target.getBoundingClientRect().height - entry.target.children[0].getBoundingClientRect().height}px`;
    }

    // Checking the size of a card being resized
    if ((cr.height >= 600 && cr.width >= 1000)) {
        // If a card is a list but reaches a certain size, it will become a list element.
        if (!(/list/gmi.test(entry.target.id))) {
            entry.target.id = entry.target.id + 'List';
            entry.target.classList.remove('divChild');
            entry.target.classList.add('divChildList');
            
            // Changing the FIRST child's class and id name.
            entry.target.children[0].id = entry.target.children[0].id + "List";
            entry.target.children[0].classList.remove('divDrag');
            entry.target.children[0].children[0].style.height = '20px';
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
    childDiv.style.top = navBar.getBoundingClientRect().top + navBar.getBoundingClientRect().height + 5 + "px";
    
    let divInfo = document.createElement("DIV");
    divInfo.classList.add('divInfo');
    divInfo.id = `info${counter}`;

    divInfo.style.minHeight = '185px';
    divInfo.style.height = '70%';
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
    
    header.onclick = editField;
    desc.onclick = editField;
    
    // Adds the class tag and id to "dragDiv"
    dragDiv.classList.add('divDrag');
    dragDiv.id = `info${counter}Header`;
    
    dragDiv.style.minHeight = '15px';
    dragDiv.style.height = '30%';
    dragDiv.style.minWidth = '300px';
    dragDiv.style.width = childDiv.style.width;

    divInfo.style.height = `${childDiv.getBoundingClientRect().height - dragDiv.getBoundingClientRect().height}px`;
    
    // Adds a method that runs every time it detects the DIV being resized
    var ro = new ResizeObserver( entries => {
        for (let entry of entries) {
            checkIfList(entry);
        }
    });
    
    // Observe one or multiple elements
    ro.observe(childDiv);

    addDrags();

    counter += 1;
}

const addDrags = () => {
    // Adds the drag function to the cards
    var divInfos = document.getElementsByClassName("divInfo");

    [].forEach.call(divInfos, function (divInfo) {
        drag(document.getElementById(`${divInfo.id}`));
    });
}

const addClicks = () => {
    var headers = document.getElementsByClassName("cardHeader");
    var descs = document.getElementsByClassName("cardDesc");

    [].forEach.call(headers, function (header) {
        header.onclick = editField;
    });
    [].forEach.call(descs, function (desc) {
        desc.onclick = editField;
    });
}

addDrags();
addClicks();

cardButton.onclick = addNewCard;