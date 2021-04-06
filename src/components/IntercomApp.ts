import EventBus from "../services/EventBus";

const appWindow : any = window;

export default class IntercomApp extends HTMLElement {
    eb: EventBus;
    intercomAppId: any;

    constructor() {
        super();
        this.eb = new EventBus<any>('FADV Support EventBus');
        appWindow.SupportBus = this.eb;

        this.boot = this.boot.bind(this);
        this.login = this.login.bind(this);
        this.shutdown = this.shutdown.bind(this);
        this.trackEvent = this.trackEvent.bind(this);

        this.eb.on('fadv::support::boot', this.boot);
        this.eb.on('fadv::support::shutdown', this.shutdown);
        this.eb.on('fadv::support::login', this.login);
        this.eb.on('fadv::support::trackEvent', this.trackEvent);
    }

    boot(event: Event) {
        const payload = (event as CustomEvent).detail;
        console.log('Boot', payload);
        this.intercomAppId = payload.appId;

        const script = document.createElement('script');
        script.textContent = `(function(){var w=window;var ic=w.Intercom;if(typeof ic==="function"){ic('reattach_activator');ic('update',w.intercomSettings);}else{var d=document;var i=function(){i.c(arguments);};i.q=[];i.c=function(args){i.q.push(args);};w.Intercom=i;var l=function(){var s=d.createElement('script');s.type='text/javascript';s.async=true;s.src='https://widget.intercom.io/widget/${this.intercomAppId}';var x=d.getElementsByTagName('script')[0];x.parentNode.insertBefore(s, x);};if(document.readyState==='complete'){l();}else if(w.attachEvent){w.attachEvent('onload',l);}else{w.addEventListener('load',l,false);}}})();`
        this.appendChild(script);

        appWindow.intercomSettings = {
            alignment: 'left',
            horizontal_padding: 20,
            vertical_padding: 20
        };

        appWindow.Intercom('boot', {
            app_id: this.intercomAppId,
        });
    }

    shutdown(event: Event) {
        appWindow.Intercom('shutdown', {
            app_id: this.intercomAppId,
        });
    }

    login(event: Event) {
        const payload = (event as CustomEvent).detail;
        appWindow.Intercom('update', payload);
    }

    trackEvent(event: Event) {
        const payload = (event as CustomEvent).detail;
        appWindow.Intercom('trackEvent', payload.eventName, payload.data);
    }

    connectedCallback() {

    }

}

customElements.define('fadv-intercom-app', IntercomApp);