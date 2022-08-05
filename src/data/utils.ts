export type Dict<T> ={
    [index:string] : T
}


export type FilterByValueType<T,VType> ={
    [P in keyof T as T[P] extends VType ? P: never] : T[P]
}

export type KeysByValueType<T,VType> = keyof FilterByValueType<T,VType>

export  function Array2Dict<T,Key extends KeysByValueType<T,string>>(arr : T[],key:Key){
    const dict:Dict<T> = {};
    arr.forEach(a=>  dict[a[key] as unknown as string] = a)
    return dict;
}

export function Dict2Array<T>(dict:Dict<T>){
    const result:{key:string,value:T}[] = []; 
    for(let k in dict){
        result.push({key:k,value:dict[k]})
    }
    return result;
}

export function dictLength<T>(d:Dict<T>){
    let count = 0;
    for(let k in d){
        count++;
    }
    return count;
}

export function removeFormatSymbol(s:string){
    if(!s) return "";
    let s2 = s.replace(/\{[\S\s]*?\}/g,"")
    s2 = s2.replace(/\\\[/g,"[")
    s2 = s2.replace(/\\\]/g,"]")
    return s2;
}