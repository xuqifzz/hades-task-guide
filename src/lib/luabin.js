var luabins = {}


const LUABINS_NIL = 0x2D
const LUABINS_FALSE = 0x30
const LUABINS_TRUE = 0x31
const LUABINS_NUMBER = 0x4E
const LUABINS_STRING = 0x53
const LUABINS_TABLE = 0x54

// const LUA_SHORT_SHORT_INT_LENGTH = 1
// const LUA_INT_LENGTH = 4
// const LUA_SIZE_T_LENGTH = 4
// const LUA_NUMBER_LENGTH = 8

// const LUA_BYTEORDER = "little"
// const LUA_STR_ENCODING = "utf-8"






function readUint8(buffer,ctx){   
    var result = buffer.readUInt8(ctx.nextIndex);
    ctx.nextIndex += 1;
    return result;
}

function readUInt32(buffer,ctx){   
    var result = buffer.readUInt32LE(ctx.nextIndex);
    ctx.nextIndex += 4;
    return result;
}

function readInt32(buffer,ctx){   
    var result = buffer.readInt32LE(ctx.nextIndex);
    ctx.nextIndex += 4;
    return result;
}



function read_number(buffer,ctx){
    var result = buffer.readDoubleLE(ctx.nextIndex);
    ctx.nextIndex += 8;
    return result;
}

function read_string(buffer,ctx){
    var length = readUInt32(buffer,ctx);
    if(length === 0) return "";
    var result = buffer.toString("utf8",ctx.nextIndex,ctx.nextIndex+length)
    ctx.nextIndex += length;
    return result;
}

function read_table(buffer,ctx){
    var result={}
    var resultList =[];
    var array_size = readInt32(buffer, ctx)
    var hash_size = readInt32(buffer, ctx)
    var total_size = array_size + hash_size
    if(array_size < 0 || hash_size < 0){
        throw new Error("Invalid table sizes")
    }

    var isArray = hash_size === 0;
   
    for(var i =0; i< total_size; i++){
        var rKey;
        var key = load_value(buffer,ctx);
        if(typeof(key) == "number") 
            rKey = parseInt(key);
        else if(typeof(key) == "string"){
            rKey = key
            isArray = false
        }
        else
            throw new Error("Invalid table key type");

        var ttt = load_value(buffer,ctx);
       
        if(typeof(rKey) == "number") {
            resultList[rKey-1] = ttt;
            
            result[rKey] = ttt;
        }else{
            result[rKey] = ttt;
        }

    }

    if(isArray)
        return resultList;

    // if(resultList.length > 0){
    //    result["luaList"] = resultList;
    // }

    return result


}

function load_value(buffer,ctx){
    var value_type = readUint8(buffer,ctx);

    if(value_type === LUABINS_NIL)
        return null;
    else if(value_type === LUABINS_FALSE)
        return false;
    else if(value_type === LUABINS_TRUE)
        return true;
    else if(value_type === LUABINS_NUMBER)
        return read_number(buffer,ctx);
    else if(value_type === LUABINS_STRING)
        return read_string(buffer,ctx);
    else if(value_type === LUABINS_TABLE)
        return read_table(buffer,ctx);
    else
        throw new Error("Unknown type: " + value_type);
    



}

luabins.load = function(buffer){
    var ctx ={
        nextIndex : 0
    } 
    var num_items  =readUint8(buffer,ctx);
    

    if (num_items > 250) {
        throw new Error("Max items in a serialized blob for luabin is 250");
    }

    var ret = [];
    for (var i=0;i<num_items;i++){
        ret.push(load_value(buffer,ctx))
    }

    if(buffer.length !== ctx.nextIndex) {
        throw new Error("Read " + num_items + " values, but we still have more data in the stream! Data corrupt?");
    }
    return ret;

}

exports.load = luabins.load;

