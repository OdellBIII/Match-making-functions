const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

var games = {
  "Sn4ke" : {
    players_per_room : 4,
    match_rooms : null,
  },

  "Pong" : {
    players_per_room : 2,
    match_rooms : null,
  }
}

var match_rooms = {
  1 : {
    counter : 0,
    number_of_players : 0,
  },
  3 : {
    counter : 0,
    number_of_players : 0,
  },
  5 : {
    counter : 0,
    number_of_players : 0,
  },
};

exports.matchPlayers = functions.https.onRequest((request, response) => {

  const wager = request.query.wager;
  const game_id = request.query.game_id;

  if(games.hasOwnProperty(game_id))
  {
    console.log("Valid game_id. Checking if wager room already exists...");
    if(games[game_id].match_rooms && games[game_id].match_rooms.hasOwnProperty(wager))
    {
      console.log("Wager room exists for this particular wager and game_id");
      if(games[game_id].match_rooms[wager].number_of_players >= games[game_id].players_per_room)
      {
        games[game_id].match_rooms[wager].counter += 1;
        games[game_id].match_rooms[wager].number_of_players = 1;
      }
      else
      {
        games[game_id].match_rooms[wager].number_of_players += 1;
      }
    }
    else
    {
      console.log("Wager room did not exist for this game_id. Creating new one..");
      games[game_id].match_rooms = {};
      games[game_id].match_rooms[wager] = {
        number_of_players : 1,
        counter : 0
      };
    }

    const room = "room-" + wager + "-" + games[game_id].match_rooms[wager].counter;

    response.send(room);
    //response.sendCode(200);
  }
  else
  {
    console.log("Invalid game_id provided");
    response.send("Invalid game_id");
  }

});
