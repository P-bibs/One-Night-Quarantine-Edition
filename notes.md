# Message Types


* message_type
  * message_subtype
    * action_type
      * parameters
* "control"
  * "introduction"
    * [player_name]
  * "begin_game"

* "character_select"
  * "add"
    * arg: character_name
  * "remove"

* "card_action"
  * "peek"
    * "reveal"
      * arg: card_number
    * "hide"
  * "highlight"
    * "select"
    * "unselect"
  * "swap" 
    * args: [card_number_1, card_number_2]

* "player_action"
  * "thumb"
    * "stick_out"
      * arg: player_number
    * "hide"
  * "token"
    * "protect"
      * arg: player_number
    * "random"

# Object Types

* game
  * code: string
  * state: string
  * players: player[]
  * characters: string[]

* player
  * name: string
  * isThumbOut: bool
  * card: card

* Card
  * character: string
  * isExposed: bool
  * isHighlighted: bool
  * tokens: string[]


# Fake Enums
* characters
  * TODO

* tokens
  * villager
  * tanner
  * werewolf
  * mute
  * shame
  * nothing
  * shield

# Client Progression
* WelcomePage
  * Enter name/code
* Setup
  * Send character select messages
  * if recieve a game object with state="game", move to next page
* Game