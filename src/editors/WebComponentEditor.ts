"use strict";

const THEME_DEFAULT = 'vs-dark';

const webComponentEditorTemplate = `
    <flex class="v" style="height: 100%">
        <flex-item style="flex: 1">
            <flex class="h">
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
                    <div id="previewComponent" class="editor htmlEditor">
                    </div>
                </flex-item>
                <flex-resizer></flex-resizer>
                <flex-item style="flex: 1">
                    <div class="viewer"></div>
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

    constructor(monaco: any) {
        super();
        this.monaco = monaco;
    }

    connectedCallback() {
        this.innerHTML = webComponentEditorTemplate;
        
        this.mountEditor('htmlEditor', 'html', '<!-- HTML -->\n');
        this.mountEditor('cssEditor', 'css', '/* Any CSS */\n');
        this.mountEditor('jsEditor', 'javascript', '// Your javascript\n');
        this.mountEditor('previewComponent', 'html', '<!-- Preview Final Web Component -->\n');
    }

    mountEditor(id: string, language: string, initial: string | string[] = [], theme: string = THEME_DEFAULT) {
        const editor = document.getElementById(id);
        if ( editor ) {
            this.monaco.editor.create(editor, {
                value: (initial instanceof Array) ? initial.join('\n') : initial,
                language,
                lineNumbers: 'on',
                automaticLayout: true,
                theme
            });
        }
        window.dispatchEvent(
            new CustomEvent('aide-web-component-editor::loaded::' + id, {
                detail: {
                    id,
                    at: new Date()
                }
            })
        );
    }

}
customElements.define('aide-web-component-editor', WebComponentEditor);

window.addEventListener('aide-web-component-editor::loaded::*', (e) => {
    console.log("I received event: ", e);
})