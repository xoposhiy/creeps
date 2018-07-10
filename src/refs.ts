///<reference path="screeps.d.ts"/>

interface IHaveId {
    id: string;
}

export class Ref<T extends IHaveId> {
    private id:string;

    constructor(id:string) {
        this.id = id;
    }

    public val():T {
        return <T>(<IHaveId>Game.getObjectById(this.id));
    }
}

export class RefSet<T extends IHaveId> {

    private idList:string[];
    private lastCheckTime:number;

    constructor(ids:string[]) {
        this.lastCheckTime = -1;
        this.idList = ids;
    }

    public add(obj:T) {
        this.idList.push(obj.id);
    }

    public ids():string[] {
        if (Game.time > this.lastCheckTime) {
            this.idList = _.filter(this.idList, id => !!Game.getObjectById(id));
            this.lastCheckTime = Game.time;
        }
        return this.idList;
    }

    public values():T[] {
        return _.map(this.ids(), id => <T><IHaveId>Game.getObjectById(id));
    }
}
