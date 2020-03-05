const saveButton = document.getElementById('saveButton');
const xhr = new XMLHttpRequest();

const sendBoardData = () => {
    let boardData = document.getElementById('parentDiv');
    let stringBoardData = new XMLSerializer().serializeToString(boardData);

    console.log("Sending board data...");

    xhr.open("POST", '/updateBoard');
    xhr.setRequestHeader('Content-Type', 'text/plain;charset=UTF-8');
    xhr.send(stringBoardData);
};

saveButton.onclick = sendBoardData;