import EventBus from "../services/EventBus";

const appWindow : any = window;

export class SupportApp extends HTMLElement {
    static get observedAttributes() { return ["appid"] }
    
    eb: EventBus;
    appid: string;

    constructor() {
        super();
        this.attachShadow({mode: 'closed'});

        this.boot = this.boot.bind(this);

        this.eb = new EventBus<any>('FADV Support EventBus');
        appWindow.SupportBus = this.eb;

        this.eb.on('fadv::support::boot', this.boot);
    }
    
    attributeChangedCallback(attrName: string, oldValue: any, newValue: any) {
        if (newValue !== oldValue) {
          (this as any)[attrName] = this.getAttribute(attrName);
        }
    }    

    boot(event: Event) {
        console.log("Intercom booting...");
        appWindow.intercomSettings = {
            alignment: 'left',
            horizontal_padding: 20,
            vertical_padding: 20
        };

         appWindow.Intercom('show');
    }

    connectedCallback() {
        console.log("Booting ", this.appid);
        const root = this.shadowRoot;
        if ( root ) {
            const intercomBootScript = document.createElement('script');
            const APP_ID = this.appid;
            intercomBootScript.textContent = `(function(){var w=window;var ic=w.Intercom;if(typeof ic==="function"){ic('reattach_activator');ic('update',w.intercomSettings);}else{var d=document;var i=function(){i.c(arguments);};i.q=[];i.c=function(args){i.q.push(args);};w.Intercom=i;var l=function(){var s=d.createElement('script');s.type='text/javascript';s.async=true;s.src='https://widget.intercom.io/widget/${APP_ID}';var x=d.getElementsByTagName('script')[0];x.parentNode.insertBefore(s, x);};if(document.readyState==='complete'){l();}else if(w.attachEvent){w.attachEvent('onload',l);}else{w.addEventListener('load',l,false);}}})();`
            intercomBootScript.onload = () => {
                appWindow.Intercom('boot', {
                    app_id: this.appid,
                 });
            }
            root.appendChild(intercomBootScript);
        }
    }
}

customElements.define('fadv-support-app', SupportApp);