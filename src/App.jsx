import React,{useEffect,useState} from 'react';
import {App as CinematicApp} from './LegacyApp.jsx';
import Leshoutang from './leshoutang/Leshoutang.jsx';
export function App(){const [hash,setHash]=useState(location.hash);useEffect(()=>{const change=()=>setHash(location.hash);window.addEventListener('hashchange',change);return()=>window.removeEventListener('hashchange',change)},[]);return hash==='#leshoutang'?<Leshoutang/>:<CinematicApp/>}
