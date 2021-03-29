
const SIDE_BAR_ITEM_TEMPLATE = (id: string, image: string, icon: string, title: string, event: string) => `
    <li id="${id}" class="nav-item mt-2 mb-2">
        <a href="#" data-event-name="${event}" style="height: 42px" class="aide-menu text-dark nav-link m-2 p-0" title="" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-original-title="${title}">
        ${ icon ?  `<i class="bi ${icon}" style="font-size: 1.8rem"></i>` 
                : `<img src="${image}" class="m-2" width="42" />`}
        </a>
    </li>`

const SIDE_BAR_TEMPLATE = (menuItems: string) => `
<div class="d-flex flex-column justify-content-between bd-highlight shadow h-100" style="width: 4.5rem;">
  <a href="/" class="d-block p-3 link-dark text-decoration-none" title="" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-original-title="Icon-only">
    <h2 style="font-weight: 300"><center class="border border-dark pb-1 rounded-circle">&#230;</center></h2>
    <span class="visually-hidden">Icon-only</span>
  </a>
  <div class="d-flex flex-column bd-hightlight">
    <ul id="aideMenu" class="bd-hightlight nav nav-pills nav-flush flex-column mb-auto text-center">
        ${menuItems}
    </ul>
  </div>
  <div class="dropdown border-top">
    <a href="#" class="d-flex align-items-center justify-content-center p-3 link-dark text-decoration-none dropdown-toggle" id="dropdownUser3" data-bs-toggle="dropdown" aria-expanded="false">
      <img src="https://avatars.githubusercontent.com/u/2242350?s=60&v=4" alt="mdo" width="24" height="24" class="rounded-circle">
    </a>
    <ul class="dropdown-menu text-small shadow" aria-labelledby="dropdownUser3">
      <li><a class="dropdown-item" href="#">New project...</a></li>
      <li><a class="dropdown-item" href="#">Settings</a></li>
      <li><a class="dropdown-item" href="#">Profile</a></li>
      <li><hr class="dropdown-divider"></li>
      <li><a class="dropdown-item" href="#">Sign out</a></li>
    </ul>
  </div>
</div>
`;

export default class SideBar extends HTMLElement {

    menuItems: any[] = [
        {
            id: 'aide-home',
            icon: 'bi-house', 
            title: 'Home',
            event: 'menu::home::click'
        }, {
            id: 'aide-web-component-editor',
            image: 'https://raw.githubusercontent.com/webcomponents/webcomponents-icons/master/logo/logo.svg',
            title: 'Web Component Editor',
            event: 'menu::webcomponent::click'
        }, {
            id: 'aide-terminal',
            icon: 'bi-terminal-fill',
            title: 'Terminal',
            event: 'menu::terminal::click'
        }
    ];

    currentActive: HTMLElement | null = null;

    constructor() {
        super();
        this.toggleActive = this.toggleActive.bind(this);
    }

    connectedCallback() {
        const menuItems: string[] = this.menuItems.map((i) => SIDE_BAR_ITEM_TEMPLATE(
            i.id, i.image, i.icon, i.title, i.event));
        this.innerHTML = SIDE_BAR_TEMPLATE(menuItems.join(''));
        const items = document.querySelectorAll('.aide-menu');

        const eb = (window as any).TheEventBus;

        if ( items ) {
            items.forEach(i => {
                i.addEventListener('click', (clickEvent: Event) => {
                    clickEvent.preventDefault();
                    var target = clickEvent.target as HTMLElement;
                    while(target) {
                        if ( target === i ) {
                            break;
                        } else {
                            target = target.parentElement as HTMLElement;
                        }
                    }
                    if ( target ) {
                        eb.emit(target.getAttribute('data-event-name'));
                    }
                    this.toggleActive(target.parentElement as HTMLElement);                
                })
            });
            this.currentActive = items.item(0).parentElement as HTMLElement;

            this.toggleActive(this.currentActive);
        }
    }

    toggleActive(target: HTMLElement) {
        this.currentActive?.classList.remove('active-bar');
        target.classList.add('active-bar');
        this.currentActive = target;
    }
}

customElements.define('aide-side-bar', SideBar);