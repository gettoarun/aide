"use strict";

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
    }

    mountEditor(id: string, language: string, initial: string | string[] = [], theme: string = 'vs-dark') {
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