// src/scripts/score-tabs.ts
type ScopeName = "soccer" | "volley";

function initScoreTabs(scope: ScopeName) {
    const tablist = document.querySelector<HTMLDivElement>(
        `.subtabs[data-tab-scope="${scope}"]`
    );
    const wrapper = document.querySelector<HTMLDivElement>(
        `.iframe-wrapper[data-tab-scope="${scope}"]`
    );

    if (!tablist || !wrapper) return;

    const buttons = Array.from(
        tablist.querySelectorAll<HTMLButtonElement>(".subtab")
    );
    const panels = Array.from(
        wrapper.querySelectorAll<HTMLIFrameElement>('iframe[data-panel]')
    );

    const activate = (key: string) => {
        // activar botón
        buttons.forEach((btn) => {
            const isActive = btn.dataset.target === key;
            btn.classList.toggle("active", isActive);
            btn.setAttribute("aria-selected", isActive ? "true" : "false");
        });

        // mostrar iframe
        panels.forEach((p) => {
            const show = p.dataset.panel === key;
            p.classList.toggle("shown", show);
            if (show) {
                p.removeAttribute("hidden");
            } else {
                p.setAttribute("hidden", "true");
            }
        });

        // persistir hash como `${scope}:${key}`
        const url = new URL(location.href);
        url.hash = `${scope}:${key}`;
        history.replaceState(null, "", url);
    };

    // Click
    buttons.forEach((btn) =>
        btn.addEventListener("click", () => {
            const key = btn.dataset.target;
            if (key) activate(key);
        })
    );

    // Teclado (← →)
    tablist.addEventListener("keydown", (e: KeyboardEvent) => {
        const i = buttons.findIndex((b) => b.classList.contains("active"));
        if (e.key === "ArrowRight") {
            e.preventDefault();
            const next = buttons[(i + 1) % buttons.length];
            next.focus();
            next.click();
        } else if (e.key === "ArrowLeft") {
            e.preventDefault();
            const prev = buttons[(i - 1 + buttons.length) % buttons.length];
            prev.focus();
            prev.click();
        }
    });

    // Estado inicial por hash (si coincide el scope)
    const hash = location.hash?.slice(1); // e.g. "volley:standings"
    if (hash?.startsWith(`${scope}:`)) {
        const [, key] = hash.split(":");
        if (buttons.some((b) => b.dataset.target === key)) {
            activate(key);
            return;
        }
    }

    // Estado inicial: primer tab
    const firstKey = buttons[0]?.dataset.target;
    if (firstKey) activate(firstKey);

    // Botón de recarga dentro del mismo scope
    const refreshBtn = document.querySelector<HTMLButtonElement>(
        `.scope[data-scope="${scope}"] [data-refresh]`
    );

    if (refreshBtn) {
        console.log("sadas")
        refreshBtn.addEventListener("click", () => {
            const activePanel = wrapper.querySelector<HTMLIFrameElement>("iframe.panel.shown");
            if (activePanel) {
                const currentSrc = activePanel.src;
                // Forzar recarga del iframe
                activePanel.src = "";
                setTimeout(() => (activePanel.src = currentSrc), 100);
            }
        });
    }
}

function initSportSwitch() {

    const refreshBtn = document.querySelector<HTMLButtonElement>('[data-refresh]');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            // 1) scope activo (el que NO está hidden)
            const activeScope = document.querySelector<HTMLElement>('.scope:not([hidden])');
            if (!activeScope) return;

            // 2) panel visible dentro de ese scope
            const activePanel = activeScope.querySelector<HTMLIFrameElement>('iframe.panel.shown')
                ?? activeScope.querySelector<HTMLIFrameElement>('iframe[data-panel]');

            if (activePanel) {
                const currentSrc = activePanel.src;
                activePanel.src = '';              // limpiar fuerza recarga
                setTimeout(() => { activePanel.src = currentSrc; }, 50);
            }
        });
    }

    const sportTabs = Array.from(
        document.querySelectorAll<HTMLButtonElement>('.sport-tabs [data-sport]')
    );
    const scopes = Array.from(
        document.querySelectorAll<HTMLElement>('.scope[data-scope]')
    );

    const setSport = (sport: ScopeName) => {
        // activar botón de deporte
        sportTabs.forEach((b) => {
            const active = b.dataset.sport === sport;
            b.classList.toggle("active", active);
            b.setAttribute("aria-selected", active ? "true" : "false");
        });

        // mostrar/ocultar scopes
        scopes.forEach((s) => {
            const show = s.dataset.scope === sport;
            if (show) s.removeAttribute("hidden");
            else s.setAttribute("hidden", "true");
        });

        // Si hay hash con otra vista, lo mantenemos. Si no hay hash, ponemos el primer tab del scope.
        const hash = location.hash?.slice(1); // "sport:key"
        const currentKey = hash?.split(":")[1];
        const tablist = document.querySelector<HTMLDivElement>(
            `.subtabs[data-tab-scope="${sport}"]`
        );
        const targetBtn = currentKey
            ? tablist?.querySelector<HTMLButtonElement>(`.subtab[data-target="${currentKey}"]`)
            : tablist?.querySelector<HTMLButtonElement>(".subtab");

        targetBtn?.click();
    };

    // Click en tabs de deporte
    sportTabs.forEach((btn) =>
        btn.addEventListener("click", () => {
            const sport = btn.dataset.sport as ScopeName | undefined;
            if (sport) setSport(sport);
        })
    );

    // Estado inicial desde hash (si existe)
    const hash = location.hash?.slice(1);
    const fromHashScope = (hash?.split(":")[0] ?? "soccer") as ScopeName;
    setSport(fromHashScope);
}

function boot() {
    (["soccer", "volley"] as ScopeName[]).forEach(initScoreTabs);
    initSportSwitch();
}

// Si el DOM ya está listo, arranca ya; si no, espera al evento.
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
} else {
    boot();
}