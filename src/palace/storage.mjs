const DB='jizhongju-memories',STORE='photos';
function open(){return new Promise((resolve,reject)=>{const req=indexedDB.open(DB,1);req.onupgradeneeded=()=>req.result.createObjectStore(STORE,{keyPath:'id'});req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error)})}
async function transact(mode,action){const db=await open();try{return await new Promise((resolve,reject)=>{const tx=db.transaction(STORE,mode),req=action(tx.objectStore(STORE));let result;req.onsuccess=()=>{result=req.result};tx.oncomplete=()=>resolve(result);tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error)})}finally{db.close()}}
export const loadPhotos=()=>transact('readonly',s=>s.getAll());
export const putPhoto=photo=>transact('readwrite',s=>s.put(photo));
export const removePhoto=id=>transact('readwrite',s=>s.delete(id));
export const clearPhotos=()=>transact('readwrite',s=>s.clear());
export async function preparePhoto(file,meta){
 if(!file.type.startsWith('image/'))throw new Error('请选择 JPG、PNG 或其他浏览器支持的图片。');
 if(file.size>12*1024*1024)throw new Error('请选择 12MB 以内的照片。');
 const src=URL.createObjectURL(file);
 try{const image=new Image();image.src=src;await image.decode();const scale=Math.min(1,1600/Math.max(image.width,image.height));const canvas=document.createElement('canvas');canvas.width=Math.round(image.width*scale);canvas.height=Math.round(image.height*scale);const ctx=canvas.getContext('2d');if(!ctx)throw new Error('此浏览器暂时无法处理图片。');ctx.drawImage(image,0,0,canvas.width,canvas.height);return {...meta,id:`photo-${Date.now()}-${Math.random().toString(36).slice(2,7)}`,createdAt:new Date().toISOString(),src:canvas.toDataURL('image/jpeg',.84),width:canvas.width,height:canvas.height,verifiedVisit:false};}catch(e){throw new Error(e.message||'照片读取失败，请换一张 JPG 或 PNG 图片。')}finally{URL.revokeObjectURL(src)}
}
