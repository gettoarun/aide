import EventBus from './services/EventBus';

import './components/SideBar';
import { WebComponentEditor } from './editors/WebComponentEditor';
import SideBar from './components/SideBar';

const $ = (id: string) => document.querySelector(id);
const TheEventBus = (window as any).TheEventBus = new EventBus<any>('Global Event Bus');

const modulesLoaded: string[] = [];

TheEventBus.on('app::loaded', (e: any) => {
    injectSideBar();
})

// Event Hooks Monaco is ready.
TheEventBus.on('monaco::loaded', (e : any) => {
    console.log("Monaco Loaded", e);
    const workArea = $('#workArea');
    if ( workArea ) {
        workArea.innerHTML = "";
        const monaco = e.detail.monaco;
        const webCompEditor = new WebComponentEditor(monaco);
        workArea.appendChild( webCompEditor );
        console.log("Editor Appended", e);
    }
})

TheEventBus.on('menu::webcomponent::click', () => {
    injectMonaco();
});

// System Hooks wired to The Event Bus
window.onload = (e: any) => setTimeout(
    () => TheEventBus.emit('app::loaded'), 
    1);


const injectMonaco = () => {
    console.log("Injecting Monaco");
    if (! modulesLoaded.includes("monaco") ) {
        console.log("Loading monaco module");
        WebComponentEditor.loadModules();
        modulesLoaded.push("monaco");
    }
}

const injectSideBar = () => {
    $('#sideBar')?.appendChild( new SideBar() );
}