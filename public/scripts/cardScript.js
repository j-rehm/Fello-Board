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
    
    elmnt.children[0].onmousedown = dragMouseDown;
    
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

const addNewCard = (e) => {
    // Create the card div
    let cardDiv = document.createElement("DIV");

    // Connect created DIV to parent div
    parentDiv.appendChild(cardDiv);

    // Adds the class tag and id to cardDiv
    cardDiv.classList.add("divCard");
    cardDiv.id = `card${counter}`;
    // Setting min width and height
    cardDiv.style.minHeight = '220px';
    cardDiv.style.minWidth = '320px';
    cardDiv.style.width = '320px';
    cardDiv.style.height = '220px';

    // Creates the drag header DIV
    let headerDiv = document.createElement("DIV");

    // Connects the headerDiv to the cardDiv
    cardDiv.appendChild(headerDiv);

    // Adds the class tag and id to "headerDiv"
    headerDiv.classList.add('divHeader');
    headerDiv.id = `header${counter}`;
    // Setting min width and height
    headerDiv.style.minHeight = '20px';
    headerDiv.style.minWidth = '300px';
    headerDiv.style.width = '300px';
    headerDiv.style.height = '20px';

    // Creates the description DIV
    let descDiv = document.createElement("DIV");

    // Connects the descDiv to the cardDiv
    cardDiv.appendChild(descDiv);

    // Adds class tag and id to "descDiv"
    descDiv.classList.add('divInfo');
    descDiv.id = `info${counter}`;
    // Setting min width and height
    descDiv.style.minHeight = '200px';
    descDiv.style.minWidth = '300px';
    descDiv.style.width = '300px';
    descDiv.style.height = '200px';

    // Add click events to header and description DIVs
    let header = document.createElement("P");
    let desc = document.createElement("P");

    // Adds Title and Description tags to header and description DIVs
    headerDiv.appendChild(header);
    descDiv.appendChild(desc);

    // Adds class and id name to "header" and "desc"
    header.classList.add('cardHeader');
    header.id = `pHeader${counter}`;
    desc.classList.add('cardDesc');
    desc.id = `pDesc${counter}`;

    header.style.height = "15px";
    header.style.margin = '0px 10px 0px 10px';
    header.style.border = '2px solid black';
    desc.style.height = "15px";
    desc.style.margin = '0px 10px 0px 10px';
    desc.style.border = '2px solid black';

    header.onclick = editField;
    desc.onclick = editField;

    // Adds the drag function to the cards
    var cardDivs = document.getElementsByClassName("divCard");
    
    [].forEach.call(cardDivs, function (divInfo) {
        drag(document.getElementById(`${divInfo.id}`));
    });

    counter += 1;
}

cardButton.onclick = addNewCard;