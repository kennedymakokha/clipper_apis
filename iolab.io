module.exports = (http) => {




     const io = require("socket.io")(http, {
        cors: {
            origin: [
                "http://marapesa.com",
                 "https://marapesa.com",
                   "http://localhost:3000",
                     "http://localhost:4000",

            ],
        },
    });


    let duration = 45;
    var time;

    ////////////////////////////////////////
    function runGame() {
        time = duration;

        var timerInterval = setInterval(function () {
       
            io.emit('status', time);


            if (--time < 0) {
                ///// implement game logic

                var bet = Math.floor(Math.random() * 2);
               
                io.emit('result', bet);   //mk
                

                clearInterval(timerInterval);
               
                setTimeout(function () {
                 
                    runGame();
                }, 7 * 1000);

            }
            //console.log(time);

        }, 1000);

    }

  runGame();

    /////////////////////////////////////////////////


   



    io.on("connection", (socket) => {
       // console.log("SOCKET CONNECTION MADE:", socket.id);
        // io.emit('status', time);

        socket.on("place-bet", (data) => {
            //set callback for plcing bet
            console.log(data)
            //runGame();      //mk
            //io.emit('status', time);  // mk

        });

        socket.on("disconnect", () => {
            console.log("Disconnected from server");
        });

    });

    return io;


};