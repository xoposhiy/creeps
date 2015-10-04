/**
 * Created by pe on 03.10.2015.
 */
export function forbidden(room:Room){
    return room.find(FIND_FLAGS, {filter: f => _.startsWith(f.name, "forbidden")}).length > 0;
}