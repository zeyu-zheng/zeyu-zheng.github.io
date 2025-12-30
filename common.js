// Common navigation menu functionality
(function() {
    'use strict';
    
    function injectLiquidGlassFilter() {
        if (document.getElementById('liquid-glass-svg')) return;

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.id = 'liquid-glass-svg';
        svg.setAttribute('width', '0');
        svg.setAttribute('height', '0');
        svg.style.cssText = 'position:absolute;pointer-events:none';
        
        svg.innerHTML = `<defs>
            <filter id="liquid-glass" x="-30%" y="-30%" width="160%" height="160%" color-interpolation-filters="sRGB">
                <feTurbulence type="fractalNoise" baseFrequency="0.006" numOctaves="2" seed="12" result="noiseRaw"/>
                <feGaussianBlur in="noiseRaw" stdDeviation="2.5" result="noise"/>
                <feMorphology in="SourceAlpha" operator="erode" radius="5" result="inner"/>
                <feComposite in="SourceAlpha" in2="inner" operator="out" result="edge"/>
                <feGaussianBlur in="edge" stdDeviation="3" result="edgeSoft"/>
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="16" xChannelSelector="R" yChannelSelector="G" result="displacedAll"/>
                <feComposite in="displacedAll" in2="edgeSoft" operator="in" result="displacedEdge"/>
                <feComposite in="SourceGraphic" in2="edgeSoft" operator="out" result="center"/>
                <feMerge>
                    <feMergeNode in="center"/>
                    <feMergeNode in="displacedEdge"/>
                </feMerge>
            </filter>
        </defs>`;
        
        document.body.insertBefore(svg, document.body.firstChild);
    }
    
    function generateNav() {
        const path = window.location.pathname;
        const isIndex = path.endsWith('/') || path.endsWith('/index.html') || path === '/index.html' || path === 'index.html';
        const isBlog = path.endsWith('/blog.html') || path === '/blog.html' || path === 'blog.html';
        const basePath = path.includes('/blog/') && !isBlog ? '../' : '';
        
        const links = [
            { text: 'About', href: isIndex ? '#about' : basePath + 'index.html#about', onclick: isIndex ? 'closeMenu()' : '' },
            { text: 'Blog', href: isBlog ? 'blog.html' : basePath + 'blog.html', onclick: '' },
            { text: 'Research', href: isIndex ? '#research' : basePath + 'index.html#research', onclick: isIndex ? 'closeMenu()' : '' },
            { text: 'Teaching', href: isIndex ? '#teaching' : basePath + 'index.html#teaching', onclick: isIndex ? 'closeMenu()' : '' },
            { text: 'Misc', href: isIndex ? '#miscellaneous' : basePath + 'index.html#miscellaneous', onclick: isIndex ? 'closeMenu()' : '' }
        ];
        
        const navItems = links.map(link => {
            const onclick = link.onclick ? `onclick="${link.onclick}"` : '';
            return `<li><a href="${link.href}" ${onclick}>${link.text}</a></li>`;
        }).join('');

        return `<button class="menu-toggle" id="menuToggle" aria-label="Toggle menu">
            <span></span><span></span><span></span>
        </button>
        <nav class="sidebar" id="sidebar">
            <ul class="sidebar-nav">${navItems}</ul>
        </nav>`;
    }
    
    function initMenu() {
        const menuToggle = document.getElementById('menuToggle');
        const sidebar = document.getElementById('sidebar');
        if (!menuToggle || !sidebar) return;
        
        const toggleMenu = () => sidebar.classList.toggle('active');
        const closeMenu = () => sidebar.classList.remove('active');
        
        window.closeMenu = closeMenu;
        menuToggle.addEventListener('click', toggleMenu);
        document.addEventListener('click', (e) => {
            if (!sidebar.contains(e.target) && !menuToggle.contains(e.target) && sidebar.classList.contains('active')) {
                closeMenu();
            }
        });
    }
    
    const init = () => {
        injectLiquidGlassFilter();
        document.body.insertAdjacentHTML('afterbegin', generateNav());
        initMenu();
    };
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

