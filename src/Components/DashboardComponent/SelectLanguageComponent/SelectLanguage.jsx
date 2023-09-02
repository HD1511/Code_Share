import React, { useContext, useEffect } from 'react';

import { SocketInfoProvider } from '../Dashboard.jsx';

import './SelectLanguage.css';

import { Dropdown } from 'primereact/dropdown';

const languages = [
    { name: 'HTML' },
    { name: 'JavaScript' },
    { name: 'CSS' },
    { name: 'ReactJS' },
    { name: 'Python' },
    { name: 'C' },
    { name: 'C++' },
    { name: 'C#' },
    { name: 'Fortran' },
    { name: 'Go' },
    { name: 'Java' },
    { name: 'Kotlin' },
    { name: 'Objective-C' },
    { name: 'PHP' },
    { name: 'SQL' },
    { name: 'Swift' },
    { name: 'TypeScript' },
    { name: 'Ruby' },
    { name: 'Scala' },
    { name: 'Rust' }
];

const SelectLanguage = ({selectLanguage,giveLanguage}) => {
    const socketSetter = useContext(SocketInfoProvider);

    useEffect(() => {

        socketSetter?.on('Set updated language', (lang) => {
            selectLanguage(lang);
        });

        socketSetter?.on('Get language' , (lang) => {
            selectLanguage(lang);
        })
    
    }, [selectLanguage,giveLanguage,socketSetter]);

    const selectLanguageFunction = (lang) => {
        selectLanguage(lang);
        socketSetter?.emit('Updated language' , lang);
    }

    return (
    <>
        <div className="card flex justify-content-center">
            <Dropdown value={giveLanguage} onChange={(e) => selectLanguageFunction(e.value)} options={languages} optionLabel="name"
            className="w-full md:w-14rem" style={{ width: '93%', borderRadius: '10px', margin: '10px' }} />
        </div>
    </>
    )
}

export default SelectLanguage;