import './App.css';
import BtpCalc from './BtpCalc';
import React, { useState } from 'react';

function App() {
    const [total, setTotal] = useState({
        surface: 0,
        volume: 0,
        prix: 0,
        pieces: 0,
    });

    const handleChange = (volume, num) => {
        volume ? total.volume = 0 : total.surface = 0
        if(!!volume){
            total.volume = num
        } else {
            total.surface = num
        }
        setTotal({surface: total.surface, volume: total.volume, prix: total.prix, pieces: total.pieces})
    }

    const handlePrice = (num, reset = false) => {
        reset ? total.prix = 0 : total.prix = num
        setTotal({surface: total.surface, volume: total.volume, prix: total.prix, pieces: total.pieces})
    }

    return (
        <div className="App flex flex-col">
            <div className='navbar'>
                <div className='nav-content'>
                    <div className="title text-3xl font-bold">BTP CALCULATOR</div>
                    <div className="title">version: 0.0.1</div>
                </div>
            </div>
            <div style={{display:'flex', justifyContent:'center', height:'100%',width:'100%'}}>
                <div style={{position: 'absolute', top:'10%'}}>
                    <span className="title">Volume  : {Math.round(total.volume, 2)} M3 - </span>
                    <span className="title">Surface : {Math.round(total.surface, 2)} M2 - </span>
                    <span className="title">Prix    : {Math.round(total.prix, 2)} € </span>
                </div>
                <BtpCalc total={total} handleChange={handleChange} handlePrice={handlePrice}/>
                <div>
                </div>

            </div>
            <header className="App-header">
                <a
                    className="App-link"
                    href="https://github.com/omgprod"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{textDecoration:'none', position:'absolute', bottom: 20, fontWeight: 600}}
                >
                    Developped by Babahagg with ♥️
                </a>
            </header>
        </div>
    );
}

export default App;
