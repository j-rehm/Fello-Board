const saveButton = document.getElementById('saveButton');

const saveBoard = () => {
    let boardData = document.getElementById('parentDiv');
    let boardDataString = new XMLSerializer().serializeToString(boardData);
    console.log(boardDataString);
    // console.log(boardData);
};

saveButton.onclick = saveBoard;