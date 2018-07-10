///<reference path="screeps-extended.d.ts"/>
///<reference path="screeps.d.ts"/>


class Movements {

    static getSameRoomDestinationPos(from:RoomPosition, toTarget:RoomPosition|{pos:RoomPosition}): RoomPosition{
        var to:RoomPosition = toTarget['pos'] || toTarget;
        if (from.roomName != to.roomName) {
            var exit = Game.rooms[from.roomName].findExitTo(to.roomName);
            if (exit < 0) return null;
            to = <RoomPosition>from.findClosestByPath(exit);
            if (to && !to['lookFor']) {
                var message = 'WTF, ' + from + '.findClosestByPath(exit = ' + exit + ') -> ' + to;
                console.log(message);
                return null;
                //Game.notify(message, 1);
            }
        }
        return to;
    }

    static kite(me:RoomPosition, enemy:RoomPosition):RoomPosition {
        if (me.roomName != enemy.roomName) return me;
        var room = Game.rooms[me.roomName];
        if (!room) return me;
        var maxRange = enemy.getRangeTo(me);
        var bestPos = me;
        for (var dx = -1; dx <= 1; dx++)
            for (var dy = -1; dy <= 1; dy++) {
                if (dx == 0 && dy == 0) continue;
                var pos = room.getPositionAt(me.x + dx, me.y + dy);
                if (!pos) continue;
                if (!room.isPassable(pos) || pos.lookFor<any>("creep").length > 0) continue;
                var r = enemy.getRangeTo(pos);
                if (r >= maxRange || r == maxRange &&
                    pos.lookFor<any>("terrain")[0].terrain != "swamp") {
                    maxRange = r;
                    bestPos = pos;
                }
            }
        return bestPos;
    }
    static getKitePosition(me:RoomPosition, enemies:Creep[]): RoomPosition {
        var room = Game.rooms[me.roomName];
        if (!room) return null;

        var kiteCost = (me:RoomPosition) => {
            var r = _.chain(enemies).map(e => e.pos.getRangeTo(me)).min().value();
            var closestEnemiesCount = _.filter(enemies, e => e.pos.getRangeTo(me) == r).length;
            var terrain = me.lookFor<any>("terrain")[0];
            var isSwamp = terrain == "swamp";
            console.log("enemies : " + closestEnemiesCount + ' terrain ' + terrain);
            return r - closestEnemiesCount/3 - (isSwamp ? 500 : 0);
        };

        var bestCost = kiteCost(me);
        var bestPos = me;
        for (var dx = -1; dx <= 1; dx++)
            for (var dy = -1; dy <= 1; dy++) {
                if (dx == 0 && dy == 0) continue;
                var pos = room.getPositionAt(me.x + dx, me.y + dy);
                if (!pos) continue;
                if (!room.isPassable(pos) || pos.lookFor<any>("creep").length > 0) continue;
                var cost = kiteCost(pos);
                if (cost >= bestCost) {
                    bestCost = cost;
                    bestPos = pos;
                    console.log("new best " + bestPos + " " + bestCost);
                }
            }
        return bestPos;
    }
}

export = Movements;