let map = L.map("map").setView([53.430127, 14.564802], 18);
L.tileLayer.provider('Esri.WorldImagery').addTo(map);

document.getElementById("getLocation").addEventListener("click", function() {
    if (!navigator.geolocation) {
        alert("NO GEOLOCATION");
    } else {
        navigator.geolocation.getCurrentPosition(function (position) {
            let lat = position.coords.latitude;
            let lon = position.coords.longitude;
            map.setView([lat, lon]);
        }, function (error) {
            console.error("LOCATION ERROR", error.message);
        });
    }
});

let rows = 4;
let cols = 4;
let puzzleData = [];
let occupiedCells = new Set();

document.getElementById("saveMap").addEventListener("click", function () {
    leafletImage(map, function (err, canvas) {
        if (err) {
            alert("ERROR");
        } else {
            const puzzleContainer = document.getElementById("puzzle-container");

            puzzleContainer.innerHTML = "";
            const puzzlePieces = document.querySelectorAll(".puzzlePiece");
            puzzlePieces.forEach(piece => piece.remove());

            const pieceWidth = canvas.width / cols;
            const pieceHeight = canvas.height / rows;

            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {
                    const pieceId = row * cols + col + 1;
                    const puzzlePiece = document.createElement("canvas");
                    puzzlePiece.className = "puzzlePiece";
                    puzzlePiece.width = pieceWidth;
                    puzzlePiece.height = pieceHeight;
                    puzzlePiece.setAttribute("id", `piece${pieceId}`);

                    puzzlePiece.draggable = true;
                    puzzlePiece.addEventListener("dragstart", function (event) {
                        event.dataTransfer.setData("text", event.target.id);
                    });

                    const context = puzzlePiece.getContext("2d");
                    context.drawImage(canvas, col * pieceWidth, row * pieceHeight, pieceWidth, pieceHeight, 0, 0, pieceWidth, pieceHeight);

                    puzzleData.push({id: pieceId});
                    puzzleContainer.appendChild(puzzlePiece);
                }
            }
        }
    });
});

document.getElementById("drop-area").addEventListener("dragover", function (e) {
    e.preventDefault();
});

document.getElementById("drop-area").addEventListener("drop", function (e) {
    e.preventDefault();
    const data = e.dataTransfer.getData("text/plain");
    const draggedPiece = document.getElementById(data);

    const prevIndex = parseInt(data.replace("piece", ""));
    occupiedCells.delete(prevIndex);

    const rect = document.getElementById("drop-area").getBoundingClientRect();
    const dropX = e.clientX - rect.left;
    const dropY = e.clientY - rect.top;

    const col = Math.floor(dropX / (rect.width / cols));
    const row = Math.floor(dropY / (rect.height / rows));

    const dropIndex = row * cols + col + 1;

    if (!occupiedCells.has(dropIndex)) {
        draggedPiece.style.position = "absolute";
        draggedPiece.style.left = col * (rect.width / cols) + "px";
        draggedPiece.style.top = row * (rect.height / rows) + "px";

        document.getElementById("drop-area").appendChild(draggedPiece);
        occupiedCells.add(dropIndex);
    }

    console.log("puzzleData:", puzzleData);
    console.log("occupiedCells:", occupiedCells);

    let isWin = 0;
    let occup = Array.from(occupiedCells);
    if (puzzleData.length === occupiedCells.size) {
        for (let i = 0; i < rows * cols; i++) {
            if (puzzleData[i].id !== occup[i]) {
                isWin = 0;
            }
            else {
                isWin = 1;
            }
        }
    }

    if (isWin) {
        alert("win");
    }
});