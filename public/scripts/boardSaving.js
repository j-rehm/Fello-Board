const saveButton = document.getElementById('saveButton');
const xhr = new XMLHttpRequest();

const sendBoardData = () => {
    let boardData = document.getElementById('parentDiv');
    let stringBoardData = new XMLSerializer().serializeToString(boardData);

    console.log("Sending board data...");

    // console.log(JSON.stringify({
    //     boardData: stringBoardData
    // }));

    xhr.open("POST", '/board', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
        boardData: stringBoardData
    }));

    // fetch("/board", {
    //   method: "POST", 
    //   body: JSON.stringify({
    //       boardData: stringBoardData
    //   })
    // }).then(res => {
    //   console.log("Request complete! Response: ", res);
    // });
};

saveButton.onclick = sendBoardData;