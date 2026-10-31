import React,{useEffect,useState} from 'react';
import {App as CinematicApp} from './LegacyApp.jsx';
import Expedition from './expedition/Expedition.jsx';
export function App(){const [hash,setHash]=useState(location.hash);useEffect(()=>{const change=()=>setHash(location.hash);window.addEventListener('hashchange',change);return()=>window.removeEventListener('hashchange',change)},[]);return ['#leshoutang','#expedition'].includes(hash)?<Expedition/>:<CinematicApp/>}
