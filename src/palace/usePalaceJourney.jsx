import {STORY_ONE} from '../stories.mjs';
import {useState,useEffect,useCallback} from 'react';
import {emptyJourney,restoreJourney,STORAGE_KEY} from './state.mjs';
import {loadPhotos,putPhoto,preparePhoto,removePhoto,clearPhotos} from './storage.mjs';
export function usePalaceJourney(){
 const [state,setState]=useState(()=>{try{return restoreJourney(localStorage.getItem(STORAGE_KEY))}catch{return emptyJourney()}}),[photos,setPhotos]=useState([]),[storageError,setStorageError]=useState(''),[saving,setSaving]=useState(false);
 useEffect(()=>{try{localStorage.setItem(STORAGE_KEY,JSON.stringify(state));setStorageError('')}catch{setStorageError('当前浏览器未能保存剧情进度，请保持页面打开。')}},[state]);
 useEffect(()=>{let active=true;loadPhotos(STORY_ONE).then(items=>{if(active)setPhotos(items)}).catch(()=>{if(active)setStorageError('本机相册暂不可用；你仍可以体验剧情。')});return()=>{active=false}},[]);
 const savePhoto=useCallback(async(file,meta)=>{setSaving(true);try{const photo=await preparePhoto(file,{...meta,storyId:STORY_ONE});await putPhoto(photo);setPhotos(p=>[...p,photo]);return photo}finally{setSaving(false)}},[]);
 const deletePhoto=useCallback(async id=>{await removePhoto(id);setPhotos(p=>p.filter(x=>x.id!==id))},[]);
 const reset=useCallback(async()=>{await clearPhotos(STORY_ONE);setPhotos([]);setState(emptyJourney())},[]);
 return {state,setState,photos,savePhoto,deletePhoto,reset,storageError,saving};
}
