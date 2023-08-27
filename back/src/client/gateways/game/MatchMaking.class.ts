import Game from "./Game.class";
import {MatchService} from "../../../match/match.service";

export default class MatchMaking {

    games : Game[] = [];
    newGameId = 0;
    nbOfGames = 0;

    constructor(
        private server,
        private matchService: MatchService
    ) {}

    handleLeave(user) {
        if (user)
            this.games.forEach((game) => {
                game.handleLeave(user);
            })
        let index = 0;
        while (index < this.nbOfGames) {
            if (this.games[index].canDelete()) {
                this.games[index].playersLeave();
                console.log("Game", this.games[index].matchId, "deleted");
                this.games.splice(index, 1);
                this.nbOfGames--;
            }
            else
                index++;
        }
    }

    newGame(user, player) {
        const newGame = new Game(this.server, ++this.newGameId, player == null, this.matchService);
        this.games.push(newGame);
        this.nbOfGames++;
        newGame.handleJoin(user, false);
        if (player)
            newGame.handleJoin(player, true);
    }

    handleJoin(user, player) {
        if (player/* && data.user[0].id == user.id*/) {
            for (let game of this.games)
                if (game.canJoinInvite(user)) {
                    game.handleJoin(user, false);
                    return;
                }
            this.newGame(user, player);
        }
        else {
            for (let game of this.games)
                if (game.onGame(user) && game.started) {
                    game.handleJoin(user, false);
                    return;
                }
            for (let game of this.games)
                if (game.canJoinRandom()) {
                    game.handleJoin(user, false);
                    return;
                }
            this.newGame(user, null);
        }
    }

    canInvite(user, player) {
        for (let game of this.games)
            if (game.canJoinInvite(user)
                || game.canJoinInvite(player)
                || (game.onGame(player)
                    && game.random))
                return false;
        return true;
    }

    handleInvite(user, player) {
        if (this.canInvite(user, player)) {
            this.server.sockets.sockets.get(player.session)?.emit('invite-game', [user, player]);
            this.handleJoin(user, player);
        }
        else {
            // TODO Go back to previous page
            console.log("Forbidden");
        }
    }

    updateInput(user, data) {
        const game = this.games.find(g => g.matchId == data.matchId);
        if (game)
            game.updateInput(user, data);
    }
}