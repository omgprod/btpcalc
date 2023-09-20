import './App.css';
import React, { useState } from 'react';
import { faPlus, faMinus, faCube, faEuroSign } from "@fortawesome/free-solid-svg-icons";
import { faSquare } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


let room = {
    longeur: 0,
    largeur: 0,
    hauteur: 0,
    volume: 0
}

let wall = {
    longeur: 0,
    largeur: 0,
    surface: 0
}

const options = [
    { value: 'pot', label: 'Pot' },
    { value: 'carrelage', label: 'Carrelage' },
    { value: 'parpaing', label: 'Parpaing' },
    { value: 'sac', label: 'Sac' },
    { value: 'seau', label: 'Seau' }
]

let surfaceLabel = 0

function BtpCalc({handleChange, handlePrice}) {
    const [rooms, setRooms] = useState([]); // array des pièces pour volumes
    const [walls, setWalls] = useState([]); // array des murs pour surfaces
    const [materiau, setMat] = useState([]); // array de matériaux

    const addWall = (wall) => {
        wall
            ? setWalls((wall) => [...wall, { longeur: 0, largeur: 0, surface: 0 } ])
            : setRooms((rooms) => [...rooms, { longeur: 0, largeur: 0, hauteur: 0, volume: 0 } ])
    }
    const removeWall = (index, wall) => {
        wall ? setWalls(() => walls.filter((_, i) => i !== index))
            : setRooms(() => rooms.filter((_, i) => i !== index))// Retire une pièce
    }
    const addMat = () => setMat([...materiau, { type: "", quantite: 0, longeur: 0, largeur: 0, consume: 0, price: 0, total: 0 } ])
    const removeMat = (index) => materiau.filter((_, i) => i !== index)

    // TODO: Try to optimize
    const calculeVolume = (volume = true) => {
        let clone = volume ? [...rooms] : [...walls]
        volume ? room.volume = 0 : wall.surface = 0
        clone.forEach((item) => {
            if(volume) {
                item.volume = item.longeur * item.largeur * item.hauteur
                room.volume += item.volume
                wall.surface += 2 * (item.longeur * item.largeur) + 2 * (item.longeur * item.largeur) + 2 * (item.largeur * item.hauteur)
                handleChange(volume, room.volume)
                handleChange(!volume, wall.surface)

            }
            if(!volume){
                item.surface = item.longeur * item.largeur
                wall.surface += item.surface
                handleChange(volume, wall.surface)
                surfaceLabel = wall.surface
            }
        })
        volume ? setRooms([...clone]) : setWalls([...clone])
    }

    /*
    *  TODO: Do generic function to handle state change
    * FUNCTION TO Try
    * prev = current State
    * data = data to change
    * changeFunc = function to handle state change
    * key = key to change
    * id = id of item to change
    * extraCallBack = function to call after state change
    * */
    const genericChange = (prev, data, changeFunc, key, id, extraCallBack = null) => {
        let clone = [...prev]
        clone.forEach((item, i) => {
            if(i === id){
                item[key] = data
            }
        })
        changeFunc(clone)
        if(extraCallBack) extraCallBack(clone);
    }

    // TODO: Try to optimize
    const calculePrice = (type) => {
        let clone = [...materiau]
        clone.forEach((item) => {
            if(type) {
                item.quantite = surfaceLabel / item.consume
                item.total =  (isFinite(item.quantite) || !isNaN(item.quantite) || item.quantite > 0) && item.price > 0
                    ? item.quantite * item.price
                    : 0
                handlePrice(item.total)
                setMat([...clone])
            }
        })
        setMat([...clone])
    }

    // TODO: Try to optimize
    const onHandleChange = (id, val, name, volume = true) => {
        let clone = volume ? [...rooms] : [...walls]
        clone.forEach((item, i) => {
            if(i === id){
                item[name] = Number(val)
            }
        })
        if(volume) setRooms([...clone])
        else setWalls([...clone])
        calculeVolume(volume)
    }

    // TODO: Try to optimize
    const onHandleChangeSelect = (id, val, name, type) => {
        let clone = [...materiau]
        clone.forEach((item, i) => {
            if(i === id){
                item[name] = name === 'type' ? val : Number(val)
            }
        })
        if(type) setMat([...clone])
        calculePrice(type)
    }

    return (
        <div style={{height: 600}} className={"flex flex-col xs:flex-col md:flex-col lg:flex-row xl:flex-row "}>
            <div className={"flex flex-col  md:flex-col lg:flex-row xl:flex-row"}>
                <div className={"sm:flex-row md:flex-row lg:flex-col xl:flex-col"}>
                    <div className={"flex flex-row m-5"}>
                        <button className='neumorphisme button' onClick={() => rooms.length <= 50 ? addWall(false) : null}>
                            <FontAwesomeIcon style={{marginRight: 10}} icon={faPlus} />
                            <span style={{fontSize: 16, fontWeight: 600}}>Volume</span>
                        </button>
                        {rooms.length > 0 ?
                            <button className='neumorphisme button' onClick={() => rooms.length > 0 ? removeWall(rooms.length -1, false) : null}>
                                <FontAwesomeIcon style={{marginRight: 10}} icon={faMinus} />
                                <span style={{fontSize: 16, fontWeight: 600}}>Volume</span>
                            </button>
                            : null}
                    </div>

                    <div className={"flex flex-row m-5"}>
                        <button className='neumorphisme button' onClick={() => walls.length <= 50 ? addWall(true) : null}>
                            <FontAwesomeIcon style={{marginRight: 10}} icon={faPlus} />
                            <span style={{fontSize: 16, fontWeight: 600}}>Surface</span>
                        </button>
                        {walls.length > 0 ?
                            <button className='neumorphisme button' onClick={() => walls.length > 0 ? removeWall(walls.length -1, true) : null}>
                                <FontAwesomeIcon style={{marginRight: 10}} icon={faMinus} />
                                <span style={{fontSize: 16, fontWeight: 600}}>Surface</span>
                            </button>
                            : null}
                    </div>

                        <div className={"flex flex-row m-5"}>
                            <button className='neumorphisme button' onClick={() => materiau.length <= 50 ? addMat() : null}>
                            <FontAwesomeIcon style={{marginRight: 10}} icon={faPlus} />
                            <span style={{fontSize: 16, fontWeight: 600}}>Matériau</span>
                        </button>
                            {materiau.length > 0 ?
                                <button className='neumorphisme button' onClick={() => materiau.length > 0 ? removeMat(materiau.length -1) : null}>
                                    <FontAwesomeIcon style={{marginRight: 10}} icon={faMinus} />
                                    <span style={{fontSize: 16, fontWeight: 600}}>Matériau</span>
                                </button>
                                : null}
                    </div>
                </div>
            </div>
            <div className={"flex grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 flex-col sm:flex-col md:flex-col lg:flex-row justify-around mt-100"}
                 style={{height: 800, width:"100%"}}>
                <div className={"flex flex-col sm:flex-col md:flex-col lg:flex-row justify-around gap-6"}>
                    {rooms.length > 0 ?
                        <div className='neumorphisme cardBox' style={{display:'flex', minWidth: 400, flexDirection:'column', height: 'auto',maxHeight: 600, overflow: 'auto'}}>
                            <div className={'card'} style={{height: 600}}>
                                <h4>Mètre cube  <FontAwesomeIcon style={{marginRight: 10}} icon={faCube} /></h4>
                                {rooms.map((item, i) => {
                                    return (
                                        <div key={i} style={{display:'flex', flexDirection:'column', margin: 20}}>
                                            <div style={{display:"flex"}}>
                                                <div style={{display:"flex", flexDirection: "column"}}>
                                                    <span style={{fontSize: 16, marginTop: 30, marginRight: 10}}>{i+1}</span>
                                                </div>
                                                <div style={{display:"flex", flexDirection: "column"}}>
                                                    <span style={{fontSize: 16, paddingBottom: 10}}>Longueur</span>
                                                    <input placeholder='longueur'
                                                           className={'neumorphisme'}
                                                           style={{width:100, height: 35, fontSize: 18, textAlign: 'center', color:'white', marginLeft:5}}
                                                           value={item.longeur} type='number'
                                                           onChange={(evt) => onHandleChange(i, evt.target.value, 'longeur')}/>
                                                </div>
                                                <div style={{display:"flex", flexDirection: "column"}}>
                                                    <span style={{fontSize: 16, paddingBottom: 10}}>Largeur</span>
                                                    <input placeholder='largeur'
                                                           className={'neumorphisme'}
                                                           style={{width:100, height: 35, fontSize: 18, textAlign: 'center', color:'white', marginLeft:5}}
                                                           value={item.largeur} type='number'
                                                           onChange={(evt) => onHandleChange(i, evt.target.value, 'largeur')}/>
                                                </div>
                                                <div style={{display:"flex", flexDirection: "column"}}>
                                                    <span style={{fontSize: 16, paddingBottom: 10}}>Hauteur</span>
                                                    <input placeholder='hauteur'
                                                           className={'neumorphisme'}
                                                           style={{width:100, height: 35, fontSize: 18, textAlign: 'center', color:'white', marginLeft:5}}
                                                           value={item.hauteur} type='number'
                                                           onChange={(evt) => onHandleChange(i, evt.target.value, 'hauteur')}/>
                                                </div>
                                                <span style={{fontSize: 16, marginTop: 30, marginLeft: 10}}>{item.volume} M3</span>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>: null}
                    {walls.length > 0 ?
                        <div className='neumorphisme cardBox' style={{display:'flex', width: 400, flexDirection:'column', height: 'auto',maxHeight: 600, overflow: 'auto'}}>
                            <div className={'card'} style={{height: '100%'}}>
                                <h4>mètre carré  <FontAwesomeIcon style={{marginRight: 10}} icon={faSquare} /></h4>
                                {walls.map((item, i) => {
                                    return (
                                        <div key={i} style={{display:'flex', flexDirection:'column', margin: 20}}>
                                            <div style={{display:"flex"}}>
                                                <div style={{display:"flex", flexDirection: "column"}}>
                                                    <span style={{fontSize: 16, marginTop: 30, marginRight: 10}}>{i+1}</span>
                                                </div>
                                                <div style={{display:"flex", flexDirection: "column"}}>
                                                    <span style={{fontSize: 16, paddingBottom: 10}}>Longueur</span>
                                                    <input placeholder='longueur'
                                                           className={'neumorphisme'}
                                                           style={{width:100, height: 35, fontSize: 18, textAlign: 'center', color:'white'}}
                                                           value={item.longeur}
                                                           type='number'
                                                           onChange={(evt) => onHandleChange(i, evt.target.value, 'longeur', false)}/>
                                                </div>
                                                <div style={{display:"flex", flexDirection: "column", marginLeft:5}}>
                                                    <span style={{fontSize: 16, paddingBottom: 10}}>Largeur</span>
                                                    <input placeholder='longueur'
                                                           className={'neumorphisme'}
                                                           style={{width:100, height: 35, fontSize: 18, textAlign: 'center', color:'white'}}
                                                           value={item.largeur} type='number'
                                                           onChange={(evt) => onHandleChange(i, evt.target.value, 'largeur', false)}/>
                                                </div>
                                                <span style={{fontSize: 16, marginTop: 30, marginLeft: 10}}>{item.surface} M2</span>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>: null}

                    {materiau.length > 0 ?
                        <div className='neumorphisme cardBox' style={{display:'flex', flexDirection:'column', maxHeight: 600, overflow: 'auto'}}>
                            <div className={'card'} style={{height: '100%'}}>
                                <h4 style={{margin:15}}>Estimation prix  <FontAwesomeIcon style={{marginRight: 10}} icon={faEuroSign} /></h4>
                                {materiau.map((item, i) => {
                                    return (
                                        <div key={i} style={{display:'flex', flexDirection:'column', margin: 15}}>
                                            <div style={{display:"flex"}}>
                                                <div style={{display:"flex", flexDirection: "column"}}>
                                                    <span style={{fontSize: 16, marginTop: 30, marginRight: 10}}>{i+1}</span>
                                                </div>
                                                <div style={{display:"flex", flexDirection: "column"}}>
                                                    <span style={{fontSize: 16, marginBottom: 5}}>Type</span>
                                                    <select name="pets" id="pet-select"  className={'selector'}
                                                            onChange={(evt) => onHandleChangeSelect(i, evt.target.value, 'type', true)}>
                                                        <option value="">Option</option>
                                                        {options.map((item, i) => {
                                                            return (<option key={i} value={item.value}>{item.label}</option>)
                                                        })}
                                                    </select>
                                                </div>
                                                {item.type !== "" && item.type === ("carrelage" || item.type === "parpaing") ?<div style={{display:"flex", flexDirection: "column", marginLeft:5}}>
                                                    <span style={{fontSize: 16, marginBottom: 5}}>Longueur</span>
                                                    <input placeholder='longueur'
                                                           className={'neumorphisme'}
                                                           style={{width:100, height: 35, fontSize: 18, textAlign: 'center', color: 'white'}}
                                                           value={item.longeur} type='number'
                                                           onChange={(evt) => onHandleChangeSelect(i, evt.target.value, 'longueur', true)}/>
                                                </div>:null}
                                                {item.type !== "" && item.type === ("carrelage" || item.type === "parpaing") ?<div style={{display:"flex", flexDirection: "column", marginLeft:5}}>
                                                    <span style={{fontSize: 16, marginBottom: 5}}>Largeur</span>
                                                    <input placeholder='longueur'
                                                           className={'neumorphisme'}
                                                           style={{width:100, height: 35, fontSize: 18, textAlign: 'center', color: 'white'}}
                                                           value={item.largeur}
                                                           type='number'
                                                           onChange={(evt) => onHandleChangeSelect(i, evt.target.value, 'largeur', true)}/>
                                                </div>:null}
                                                <div style={{display:"flex", flexDirection: "column", marginLeft:5}}>
                                                    <span style={{fontSize: 16, marginBottom: 5}}>Prix</span>
                                                    <input placeholder='longueur'
                                                           className={'neumorphisme'}
                                                           style={{width:100, height: 35, fontSize: 18, textAlign: 'center', color: 'white'}}
                                                           value={item.price}
                                                           type='number'
                                                           onChange={(evt) => onHandleChangeSelect(i, evt.target.value, 'price', true)}/>
                                                </div>
                                                <div style={{display:"flex", flexDirection: "column", marginLeft:5}}>
                                                    <span style={{fontSize: 16, marginBottom: 5}}>Unité / m2</span>
                                                    <input placeholder='longueur'
                                                           className={'neumorphisme'}
                                                           style={{width:100, height: 35, fontSize: 18, textAlign: 'center', color: 'white'}}
                                                           value={item.consume} type='number'
                                                           onChange={(evt) => onHandleChangeSelect(i, evt.target.value, 'consume', true)}/>
                                                </div>
                                                <div style={{display:"flex", flexDirection: "column"}}>
                                                <span style={{fontSize: 16, marginTop: 15, marginLeft: 10}}>
                                                    x {isFinite(item.quantite) || !isNaN(item.quantite) || item.quantite > 0 ? Math.round(item.quantite, 2) : 0}
                                                </span>
                                                    <span style={{fontSize: 16, marginTop: 5, marginLeft: 10}}>
                                                    {isFinite(item.total) || !isNaN(item.total) || item.total > 0 ? Math.round(item.total, 2) : 0} €
                                                </span>
                                                </div>

                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div> : null}
                </div>
            </div>
        </div>
    );
}

export default BtpCalc;
