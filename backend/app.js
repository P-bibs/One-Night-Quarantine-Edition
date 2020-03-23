const http = require('http');
const WebSocket = require('ws');
var static =  require('node-static');

var fileServer = new static.Server("./build");

const server = http.createServer((request, response) => {
  request.addListener('end', function () {
    fileServer.serve(request, response, function (e, res) {
        if (e && (e.status === 404)) { // If the file wasn't found
            fileServer.serveFile('/index.html', 404, {}, request, response);
        }
    });
  }).resume();
});

wsServers = {}

server.on('upgrade', function upgrade(request, socket, head) {
  const parsed = new URL(request.url, `http://${request.headers.host}`);
  if (parsed.pathname !== "/data") {
    return
  }
  let code = parsed.searchParams.get("code")

  console.log(`Attempting to connect user with code ${code}`)
  console.log(request.url)
  if (code in wsServers) {
    wsServers[code].handleUpgrade(request, socket, head, function done(ws) {
      wsServers[code].emit('connection', ws, request);
    });
  } else {
    wsServers[code] = createGame(code)
    wsServers[code].handleUpgrade(request, socket, head, function done(ws) {
      wsServers[code].emit('connection', ws, request);
    });
  }

  // clean up old servers
  // for (const key in wsServers) {
  //   if (wsServers.hasOwnProperty(key)) {
  //     console.log(`Deleting server ${key}`)
  //     const server = wsServers[key];
  //     if (server.clients.length == 0) {
  //       server.close()
  //     }
  //     delete wsServers[key];
  //   }
  // }
});

function createGame(code) {
  game = {
    code: code,
    state: "setup",
    players: [],
    characters_enabled: []
  }
  
  socket_server = new WebSocket.Server({ noServer: true })

  socket_server.on('connection', (ws) => {
    ws.send(JSON.stringify({
      message_type: "game_state_update",
      data: game
    }))
    
    ws.on('message', (data) => {

      message = JSON.parse(data)
      if (message.message_type == "control")  {
        if (message.message_subtype == "introduction" && game.state == "setup") {
          console.log(`Received introduction message from ${message.data}`)
          new_player = {
            name: message.data,
            isThumbOut: false
          }
          game.players.push(new_player)
        } else if (message.message_subtype == "begin_game") {
          begin_game(game)
          socket_server.clients.forEach(client => {
            client.send(JSON.stringify({
              message_type: "game_state_update",
              data: game
            }));
          });
          return
        } else if (message.message_subtype == "restart_game") {
          restartGame(game)
          socket_server.clients.forEach(client => {
            client.send(JSON.stringify({
              message_type: "game_state_update",
              data: game
            }));
          });
          return
        } 
      } else if (message.message_type == "character_select") {
        character_select(game, message.action_type, message.data)
      } else if (message.message_type == "card_action") {
        card_action(game, message.message_subtype, message.action_type, message.data)
      } else if (message.message_type == "player_action") {
        player_action(game, message.message_subtype, message.action_type, message.data)
      }

      // Broadcast game to players after update
      socket_server.clients.forEach(client => {
        client.send(JSON.stringify({
          message_type: "game_state_update",
          data: game
        }));
      });
    })
  });

  return socket_server
}

function shuffle(arr) {
  nums = [...Array(arr.length).keys()];
  out = []
  for (let i = 0; i < arr.length; i++) {
    ind = Math.floor(Math.random() * nums.length);
    out.push(arr[nums[ind]]);
    nums.splice(ind, 1);
  }
  return out;
}

function begin_game(game) {
  console.log(`Beginning game ${game.code}`)

  // add the center cards as players with no name
  for (let i = 0; i < 3; i++) {
    game.players.push({name: `Center ${i+1}`, isThumbOut: false})
  }

  // assign characters
  let characters_enabled = shuffle(game.characters_enabled)
  game.players.forEach((player, i) => {
    player.card = {
      character: characters_enabled[i],
      isExposed: false,
      isHighlighted: false,
      tokens: []
    }
  })

  game.state = "game"
}

function restartGame(game) {
  console.log(`Restarting Game ${game.code}`)
  game.state = "setup"
  game.players = []
  game.characters_enabled = []
}

function character_select(game, action, character_name) {
  if (action == "add" && !(character_name in game.characters_enabled)) {
    game.characters_enabled.push(character_name)
    console.log(`Added ${character_name}`)
  } else if (action == "remove") {
    game.characters_enabled = game.characters_enabled.filter(x => x != character_name)
    console.log(`Removed ${character_name}`)
  }
}

function card_action(game, sub_action, action_type, data) {
  if (sub_action == "peek") {
    if (action_type == "reveal") {
      game.players[data].card.isExposed = true;
      console.log(`Exposed ${game.players[data].name}`)
    } else if (action_type == "hide") {
      game.players[data].card.isExposed = false;
      console.log(`Unexposed ${game.players[data].name}`)
    }
  } else if (sub_action == "highlight") {
    if (action_type == "select") {
      game.players[data].card.isHighlighted = true;
      console.log(`Highlighted ${game.players[data].name}`)
    } else if (action_type == "unselect") {
      game.players[data].card.isHighlighted = false;
      console.log(`Unhighlighted ${game.players[data].name}`)
    }
  } else if (sub_action == "swap") {
    card_number_1 = data[0]
    card_number_2 = data[1]
    temp_card = game.players[card_number_1].card
    game.players[card_number_1].card = game.players[card_number_2].card
    game.players[card_number_2].card = temp_card
    console.log(`Swapped ${game.players[card_number_1].name} and ${game.players[card_number_2].name}`)
  }
}

function player_action(game, sub_action, action_type, data) {
  if (sub_action == "thumb") {
    if (action_type == "stick_out") {
      game.players[data].isThumbOut = true;
      console.log(`Stuck out thumb ${game.players[data].name}`)
    } else if (action_type == "hide") {
      game.players[data].isThumbOut = false;
      console.log(`Hid thumb ${game.players[data].name}`)
    }
  } else if (sub_action == "token") {
    if (action_type == "shield") {
      game.players[data].card.tokens.push("shield")
      console.log(`Gave shield to ${game.players[data].name}`)

    } else if (action_type == "random") {
      tokens = ["villager", "tanner", "werewold", "mute", "shame", "nothing"]
      token = tokens[Math.floor(Math.random() * tokens.length)]
      game.players[data].card.tokens.push(token)
      console.log(`Gave token ${token} to ${game.players[data].name}`)
    }
  }
}

server.listen(8080);

console.log("server listening on port 8080")