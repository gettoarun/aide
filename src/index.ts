import EventBus from './services/EventBus';
import './components/Logo';
import { WebComponentEditor } from './editors/WebComponentEditor';

const $ = (id: string) => document.querySelector(id);
const TheEventBus = (window as any).TheEventBus = new EventBus<any>('Global Event Bus');

TheEventBus.on('app::loaded', (e: any) => {
    injectMonaco();
})

// Event Hooks Monaco is ready.
TheEventBus.on('monaco::loaded', (e : any) => {
    console.log("Monaco Loaded", e);
    const monaco = e.detail.monaco;
    const webCompEditor = new WebComponentEditor(monaco);
    $('#app')?.appendChild( webCompEditor );
    console.log("Editor Appended", e);
})


// System Hooks wired to The Event Bus
window.onload = (e: any) => setTimeout(
    () => TheEventBus.emit('app::loaded'), 
    10000);


const injectMonaco = () => {
    console.log("Injecting Monaco");
}