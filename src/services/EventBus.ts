export default class EventBus<EventType = any> {
    private eventTarget: EventTarget;

     constructor(description = '') { 
        console.log(`eb::(${description})`)
        this.eventTarget = document.appendChild(
            document.createComment(description)); 
    }

    on(eventName: string, listener: (event: CustomEvent<EventType>) => void) { 
        console.log(`eb::on(${eventName})`)
        this.eventTarget.addEventListener(eventName, 
            (ce: Event) => listener((ce as CustomEvent))); 
    }

    once(eventName: string, listener: (event: CustomEvent<EventType>) => void) { 
        console.log(`eb::once(${eventName})`)
        this.eventTarget.addEventListener(eventName, 
            (ce: Event) => listener((ce as CustomEvent)), { once: true });
    }

    off(eventName: string, listener: (event: CustomEvent<EventType>) => void) { 
        console.log(`eb::off(${eventName})`)
        this.eventTarget.removeEventListener(eventName, 
            (ce: Event) => listener((ce as CustomEvent))); 
    }

    emit(eventName: string, detail?: EventType) { 
        console.log(`eb::emit(${eventName})`)
        return this.eventTarget.dispatchEvent(
            new CustomEvent(eventName, { detail })); 
    }
}