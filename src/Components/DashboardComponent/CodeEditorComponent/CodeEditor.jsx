import React, { useContext, useEffect,useState } from 'react';

import CodeMirror from "@uiw/react-codemirror";
import { langs } from '@uiw/codemirror-extensions-langs';

import { SocketInfoProvider } from '../Dashboard.jsx';

import './CodeEditor.css';

const objConvert = {
    "HTML" : langs.html(),
    "JavaScript" : langs.javascript(),
    "CSS" : langs.css(),
    "ReactJS" : langs.jsx(),
    "Python" : langs.python(),
    "C" : langs.c(),
    "C++" : langs.cpp(),
    "C#" : langs.csharp(),
    "Fortran" : langs.fortran(),
    "Go" : langs.go(),
    "Java" : langs.java(),
    "Kotlin" : langs.kotlin(),
    "Objective-C'" : langs.objectiveC(),
    "PHP" : langs.php(),
    "SQL" : langs.sql(),
    "Swift" : langs.swift(),
    "TypeScript" : langs.typescript(),
    "Ruby" : langs.ruby(),
    "Scala" : langs.scala(),
    "Rust" : langs.rust(),
 }

const CodeEditor = ({lang,id}) => {
    const [code, setCode] = useState();
    const socketSetter = useContext(SocketInfoProvider);
   
    useEffect(() => {

        socketSetter?.on('Set updated code', (code) => {
            setCode(code);
        });

        socketSetter?.on('Get code' , (code) => {
            setCode(code);
        })
    
    }, [setCode,id,socketSetter]);

    const onChange = React.useCallback(async (value, viewUpdate) => {
        setCode(value);
        socketSetter?.emit('Updated code', value);
    }, [socketSetter]);
    
    return (
        <>
            <CodeMirror
                value={code}
                height="100vh"
                theme="dark"
                extensions={[objConvert[lang.name]]}
                onChange={onChange}
                style={{ fontSize: '1.1rem' }}
            />  
        </>
  )
}

export default CodeEditor;