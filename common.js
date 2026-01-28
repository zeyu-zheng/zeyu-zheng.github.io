// Common navigation menu functionality
(function() {
    'use strict';
    
    // Initialize Google Analytics centrally for all pages
    function initGoogleAnalytics() {
        // Avoid double-injecting if script already exists
        if (document.querySelector('script[src^="https://www.googletagmanager.com/gtag/js"]')) {
            return;
        }

        // Load gtag.js script
        const script1 = document.createElement('script');
        script1.async = true;
        script1.src = 'https://www.googletagmanager.com/gtag/js?id=G-BHQMZXP12D';
        document.head.appendChild(script1);
        
        // Initialize dataLayer and gtag
        window.dataLayer = window.dataLayer || [];
        function gtag(){window.dataLayer.push(arguments);}
        window.gtag = gtag;
        gtag('js', new Date());
        gtag('config', 'G-BHQMZXP12D');
    }
    
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

    // Initialize MathJax for LaTeX rendering on all pages
    function initMathJax() {
        // Avoid double-injecting if script already exists
        if (document.getElementById('MathJax-script')) return;

        // Global configuration
        window.MathJax = window.MathJax || {
            tex: {
                inlineMath: [['$', '$'], ['\\(', '\\)']],
                displayMath: [['$$', '$$'], ['\\[', '\\]']]
            },
            svg: { fontCache: 'global' }
        };

        const script = document.createElement('script');
        script.id = 'MathJax-script';
        script.async = true;
        script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js';
        document.head.appendChild(script);
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
        initGoogleAnalytics();
        injectLiquidGlassFilter();
        initMathJax();
        document.body.insertAdjacentHTML('afterbegin', generateNav());
        initMenu();
    };
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
