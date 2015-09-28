///<reference path="screeps.d.ts"/>

declare module "jsRoleLoader" {}

interface Creep {
    approachAndDo(target:GameObject|RoomPosition, interact:any, actRange:number, moveCloser:boolean):boolean;
    log(message:string):void;
    getRole():any;
    control():void;
    bodyScore(body:Array<string>): number;
    assignNewRole(finished:boolean): any;
    getCreepsByRole(): Object;
    takeEnergyFrom(target:GameObject):number;
}
interface Room {
    isSpawningTime(): boolean;
}
interface RoomPosition {
    canAssign(creep:Creep): boolean;
    countEmptyTilesAround(): number;
    getAssignedCreeps(): string[];
    assign(creep:Creep): boolean;
}
interface Spawn {
    controlSpawn(): void;
    getStoredEnergy(): number;
}
interface Structure {
    getStoredEnergy(): number;
    getEnergyCapacity(): number;
}
interface Memory {
    assignedCreeps: {[pos: string]: Array<string>};
    usedCpu: Object;
    stats: any;
    statsAct: number;
    statsHang: number;
    statsNo: number;
}
interface CreepMemory {
    role?: string;
    targetPos?: string;
    targetId?: string;
    rawTarget?: GameObject|RoomPosition;
    targetPosition?: {roomName:string; x:number; y:number};
    done?: boolean;
    startWaitTime?: number;
    scoutStartRoom?:string;
}

interface SpawnMemory {
    wantToSpawn: boolean;
    nextSpawnTime: number;
    wantWarrior: boolean;
}