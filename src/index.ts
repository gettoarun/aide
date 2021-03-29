import './components/Logo';
import { WebComponentEditor } from './editors/WebComponentEditor';

const $ = (id: string) => document.querySelector(id);

window.addEventListener('monaco::loaded', (e : any) => {
    console.log("Monaco Loaded", e);
    const monaco = e.detail.monaco;
    const webCompEditor = new WebComponentEditor(monaco);
    $('#app')?.appendChild( webCompEditor );
    console.log("Editor Appended", e);
})