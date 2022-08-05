import { Buffer } from "buffer";
const luabin = require("./luabin")
const lz4 = require("lz4js");

type SaveData={
    timestamp:bigint,
    location:string,
    runs:number,
    activeMetaPoints:number,
    activeShrinePoints:number,
    godModEnabled: boolean,
    hellModeEnabled: boolean,
    luaKeys: string[]
    currentMapName:string,
    startNextMap:string,
    luaState: any
}

export type FromSaveFileResult = {
    isSuccess:boolean,
    message:string,
    saveData ?:SaveData
}

class BufferReader{
    private readIndex:number = 0;
    constructor(
        private buffer:Buffer
    ){

    }
    readUInt32LE(){
        const result = this.buffer.readUInt32LE(this.readIndex);
        this.readIndex += 4;
        return result;
    }
    readUInt64LE(){
        const result = this.buffer.readBigUInt64LE(this.readIndex);
        this.readIndex += 8;
        return result;
    }
    readPascalString(){
        const length = this.readUInt32LE();
        const result = this.buffer.toString("utf8",this.readIndex,this.readIndex+length);
        this.readIndex += length;
        return result;
    }
    readPascalStringArray(){
        const result:string[] =[];
        const length = this.readUInt32LE();
        for(let i=0; i<length;i++){
            result.push(this.readPascalString())
        }
        return result;
    }
    readByte2Bool(){      
        const result = this.buffer.readUint8(this.readIndex)
        this.readIndex +=1;
        return result !== 0;
    }

    readBytes(){
        const length = this.readUInt32LE();
        console.log("readBytes:", length)
        const result = this.buffer.subarray(this.readIndex,this.readIndex+length);
        console.log("length:", result.length)
        this.readIndex += length;
        return result;
    }



    skip(count:number){
        this.readIndex += count;
    }
}

function parseLuaData(buffer:Buffer){
    console.log("parseLuaData 1",buffer.length)
    const buffer2 = Buffer.alloc(9388032);
   
    const length = lz4.decompressBlock(buffer,buffer2,0,buffer.length,0);
    console.log(length);
    const buffer3 = buffer2.subarray(0,length);
    return luabin.load(buffer3)[0];
}

export function fromFile(buffer:Buffer):FromSaveFileResult{
    try{
        const reader = new BufferReader(buffer);
        if(reader.readUInt32LE() !== 0x31424753){     
            return {isSuccess:false,message:"非法的文件头"}
        }
        reader.skip(4); //skip the checksum
        if(reader.readUInt32LE() !== 16){
            return {isSuccess:false,message:"非法的存档版本"}
        }
        const saveData:SaveData ={
            timestamp: reader.readUInt64LE(),
            location: reader.readPascalString(),
            runs: reader.readUInt32LE(),
            activeMetaPoints: reader.readUInt32LE(),
            activeShrinePoints: reader.readUInt32LE(),
            godModEnabled: reader.readByte2Bool(),
            hellModeEnabled: reader.readByte2Bool(),
            luaKeys:reader.readPascalStringArray(),
            currentMapName: reader.readPascalString(),
            startNextMap: reader.readPascalString(),
            luaState: parseLuaData(reader.readBytes())
        }
        return {isSuccess:true,message:"",saveData}
    }catch(e){
        let message = "未知"; 
        if (typeof e === "string") {
            message = e;
        } else if (e instanceof Error) {
            message =e.message;
        }
        return {isSuccess:false,message: message}
    }
 

}