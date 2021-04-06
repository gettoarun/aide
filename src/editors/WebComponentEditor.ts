"use strict"; 
 
import type EventBus from "src/services/EventBus";


const ComponentNamer = (value: string) => value.replace(/[A-Z][a-z]*/g, (m: any) => m.toLowerCase() + '-' ).slice(0, -1)

const DefaultClassName = 'AWebComponent';
const THEME_DEFAULT = 'vs-dark'; 
 
const DEFAULT_HTML = `<div id="widgetHello">Hello Web Component</div>`; 
const DEFAULT_CSS = `
    #widgetHello { 
        border: 1px solid black; 
        margin: 15px; 
        padding: 15px; 
        cursor: pointer;
    }

    #widgetHello:hover {
        background-color: #e44d26;
        color: white;
    }
`; 
const DEFAULT_JS = `
    console.log("*** ====>>>> Loaded !...");

    setInterval(() => {
        console.log("Timer...");
        this.shadowRoot.getElementById('widgetHello').innerHTML = "Time " + new Date()
    }, 1000);
` 
 
 
const webComponentEditorTemplate = ` 
    <div class="d-flex flex-row justify-content-between m-2">
        <span class="flex-stretch">
            <div class="form-floating">
                <style>
                    .frameless-input
                    {
                        outline:0px !important;
                        -webkit-appearance:none;
                        box-shadow: none !important;
                    }
                </style>
                <input type="text" id="className" class="frameless-input form-control m-0 border-0"  value="${DefaultClassName}" placeholder="A Web Component Name...">
                <label for="floatingInput">Component Name</label>
            </div>
        </span>
        <span class="flex-stretch">Component Editor</span>
        <span class="flex-stretch">Component Editor</span>
    </div>
    <flex class="h" style="height: 100%"> 
        <flex-item style="flex: 1"> 
            <flex class="v"> 
                <flex-item style="flex: 1"> 
                    <div id="htmlEditor" class="editor htmlEditor"> 
                    </div> 
                </flex-item> 
                <flex-resizer></flex-resizer> 
                <flex-item style="flex: 1"> 
                    <div id="cssEditor" class="editor cssEditor"> 
                    </div> 
                </flex-item> 
                <flex-resizer></flex-resizer> 
                <flex-item style="flex: 1"> 
                    <div id="jsEditor" class="editor jsEditor"> 
                    </div> 
                </flex-item> 
            </flex> 
        </flex-item> 
        <flex-resizer></flex-resizer> 
        <flex-item style="flex: 1"> 
            <flex class="h"> 
                <flex-item style="flex: 1"> 
                    <div id="preview" class="editor htmlEditor"> 
                    </div> 
                </flex-item> 
                <flex-resizer></flex-resizer> 
                <flex-item style="flex: 1"> 
                    <iframe id="previewComponent" src="about:blank"  
                        allow="accelerometer; camera; encrypted-media; geolocation; gyroscope; microphone; midi"  
                        allowfullscreen="true"  
                        allowpaymentrequest="true"  
                        allowtransparency="true"  
                        class="viewer"  
                        sandbox="allow-downloads allow-forms allow-modals allow-pointer-lock allow-popups allow-presentation allow-same-origin allow-scripts allow-top-navigation-by-user-activation" spellcheck="false"> 
                    </iframe> 
                </flex-item> 
            </flex> 
        </flex-item> 
    </flex> 
`; 
 
export class WebComponentEditor extends HTMLElement {
    static loadModules() { 
        const scriptLoader = document.createElement('script'); 
            scriptLoader.crossOrigin="anonymous"; 
            scriptLoader.integrity="sha512-+8+MX2hyUZxaUfMJT0ew+rPsrTGiTmCg8oksa6uVE/ZlR/g3SJtyozqcqDGkw/W785xYAvcx1LxXPP+ywD0SNw==" 
            scriptLoader.src="https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.23.0/min/vs/loader.min.js"; 
 
        document.body.appendChild(scriptLoader); 
 
        scriptLoader.onload = () => { 
            console.log("Loader Loaded") 
            const monacoInitializer = document.createElement('script'); 
            const workerSnippet = ` 
                self.MonacoEnvironment = { 
                    baseUrl: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.23.0/min/' 
                }; 
                importScripts('https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.23.0/min/vs/base/worker/workerMain.js'); 
            ` 
     
            monacoInitializer.textContent = ` 
                require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.23.0/min/vs' }}); 
     
                window.MonacoEnvironment = { 
                    getWorkerUrl: function(workerId, label) { 
                        return "data:text/javascript;charset=utf-8,${encodeURIComponent(workerSnippet)}"; 
                    } 
                }; 
         
                require(["vs/editor/editor.main"], function () { 
                    console.log("Monaco Editor loaded"); 
                    window.TheEventBus.emit('monaco::loaded', { 
                                monaco: monaco, 
                                editor: monaco.editor 
                            } 
                    );     
                }); 
            ` 
            document.body.appendChild(monacoInitializer); 
        } 
    } 
 
    monaco: any; 
    editors: any = {}; 
    eb: EventBus; 
    renderer?: HTMLFrameElement; 
    componentName: string = ComponentNamer(DefaultClassName);
    className: string = DefaultClassName;

    constructor(monaco: any) { 
        super(); 
        this.monaco = monaco; 
        this.eb = (window as any).TheEventBus; 
 
        this.onHtmlChange = this.onHtmlChange.bind(this); 
        this.onCssChange = this.onCssChange.bind(this); 
        this.onJsChange = this.onJsChange.bind(this); 
        this.previewComponent = this.previewComponent.bind(this); 
        this.attachComponentNameReactive = this.attachComponentNameReactive.bind(this);
        this.getPreviewCode = this.getPreviewCode.bind(this);
        this.reloadCode = this.reloadCode.bind(this);
    } 
 
    connectedCallback() { 
        this.innerHTML = webComponentEditorTemplate; 
         
        this.eb.on('htmlEditor::code-change', this.onHtmlChange); 
        this.eb.on('cssEditor::code-change', this.onCssChange); 
        this.eb.on('jsEditor::code-change', this.onJsChange); 
         
        this.mountEditor('htmlEditor', 'html', DEFAULT_HTML); 
        this.mountEditor('cssEditor', 'scss', DEFAULT_CSS); 
        this.mountEditor('jsEditor', 'javascript', DEFAULT_JS); 
        this.mountEditor('preview', 'javascript', '', THEME_DEFAULT, true); 
 
        this.previewComponent(DEFAULT_HTML, DEFAULT_CSS, DEFAULT_JS); 

        this.attachComponentNameReactive();
    } 

    attachComponentNameReactive() {
        const classNameEl = document.getElementById("className");
        if ( classNameEl ) {
            classNameEl.onkeyup = (e: any) => {
                const value = e.target.value;
                this.componentName = ComponentNamer(value);
                this.className = value;
                this.reloadCode();
            }
        }
        
    }

    reloadCode() {
        const htmlChange = this.editors.htmlEditor.getModel().getValue(); 
        const cssChange = this.editors.cssEditor.getModel().getValue(); 
        const jsChange = this.editors.jsEditor.getModel().getValue(); 
        this.previewComponent(htmlChange, cssChange, jsChange); 
    }
 
    onHtmlChange(env : CustomEvent<any>) { 
        const cssChange = this.editors.cssEditor.getModel().getValue(); 
        const jsChange = this.editors.jsEditor.getModel().getValue(); 
        const htmlChange = env.detail.code; 
        this.previewComponent(htmlChange, cssChange, jsChange); 
    } 
 
    onCssChange(env : CustomEvent<any>) { 
        const htmlChange = this.editors.htmlEditor.getModel().getValue(); 
        const jsChange = this.editors.jsEditor.getModel().getValue(); 
        const cssChange = env.detail.code; 
        this.previewComponent(htmlChange, cssChange, jsChange); 
    } 
 
    onJsChange(env : CustomEvent<any>) { 
        const htmlChange = this.editors.htmlEditor.getModel().getValue(); 
        const cssChange = this.editors.cssEditor.getModel().getValue(); 
        const jsChange = env.detail.code; 
        this.previewComponent(htmlChange, cssChange, jsChange); 
    }
 
    previewComponent(htmlChange: string, cssChange: string, jsChange: string) { 
        const previewCode = this.getPreviewCode(htmlChange, cssChange, jsChange); 
 
        this.editors.preview.getModel().setValue( previewCode ); 
 
        const renderer = document.getElementById('previewComponent') as HTMLFrameElement; 
        if ( renderer ) { 
            renderer.src = "/preview.html"; 
             
            renderer.onload = (e: any) => { 
                const cw : any = renderer && renderer?.contentWindow; 
                cw.postMessage(JSON.stringify({
                    className: this.className,
                    componentName: this.componentName,
                    code: previewCode
                }), "*"); 
            } 
 
             
        } 
         
    } 
     
 
    getPreviewCode(htmlChange: string, cssChange: string, jsChange: string) { 
        return `// Generated Code 

const template = document.createElement('template');
template.id = '${this.componentName}-template';
template.innerHTML = \`
    <style>
        ${cssChange}
    </style>

    ${htmlChange}
\`;

class ${this.className} extends HTMLElement { 
    template;

    constructor(){ 
        super(); 
        this.attachShadow({mode: 'open'}); 
        this.render = this.render.bind(this);
        document.body.appendChild(template);
    } 
 
    connectedCallback() { 
        this.render();
        ${jsChange}
    } 

    render() {
        this.template = document.getElementById('${this.componentName}-template');
        this.shadowRoot.appendChild(this.template.content.cloneNode(true)); 
    }
} 
 
customElements.define('${this.componentName}', ${this.className}); 
        `; 
    } 
 
    mountEditor(id: string, language: string, initial: string | string[] = [], theme: string = THEME_DEFAULT, readOnly: boolean = false) { 
        const editor = document.getElementById(id); 
        if ( editor ) { 
            const ed = this.monaco.editor.create(editor, { 
                value: (initial instanceof Array) ? initial.join('\n') : initial, 
                language, 
                lineNumbers: 'on', 
                automaticLayout: true, 
                readOnly, 
                theme 
            }); 
            ed.onDidChangeModelContent((event: any) => 
                this.eb.emit(id + "::code-change", { code: ed.getValue()} ) 
            ); 
            this.editors[id] = ed; 
        } 
        this.eb.emit('aide-web-component-editor::loaded::' + id, { 
            id, 
            at: new Date() 
        }); 
    } 
 
} 
customElements.define('aide-web-component-editor', WebComponentEditor); 
 
window.addEventListener('aide-web-component-editor::loaded::*', (e) => { 
    console.log("I received event: ", e); 
})