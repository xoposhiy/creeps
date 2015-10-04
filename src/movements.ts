class Movements {

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
}

export = Movements;