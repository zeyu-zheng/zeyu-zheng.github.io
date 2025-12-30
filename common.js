// Common navigation menu functionality
(function() {
    'use strict';
    
    // Inject SVG filter for Liquid Glass effect (edge refraction)
    function injectLiquidGlassFilter() {
        // Avoid injecting multiple times
        if (document.getElementById('liquid-glass-svg')) {
            return;
        }

        const svgNS = 'http://www.w3.org/2000/svg';
        const svg = document.createElementNS(svgNS, 'svg');
        svg.setAttribute('id', 'liquid-glass-svg');
        svg.setAttribute('width', '0');
        svg.setAttribute('height', '0');
        svg.style.position = 'absolute';
        svg.style.pointerEvents = 'none';
        
        svg.innerHTML = `
            <defs>
                <!--
                  iOS-like Liquid Glass: edge-only refraction (no heavy lighting).
                  Smoother noise + lower scale to reduce jagged edges.
                -->
                <filter id="liquid-glass" x="-30%" y="-30%" width="160%" height="160%" color-interpolation-filters="sRGB">
                    <!-- Ultra-smooth organic noise: Lower frequency = larger, smoother waves -->
                    <feTurbulence type="fractalNoise" baseFrequency="0.006" numOctaves="2" seed="12" result="noiseRaw" />
                    <feGaussianBlur in="noiseRaw" stdDeviation="2.5" result="noise" />

                    <!-- Wider edge mask: radius="5" for a more visible transition -->
                    <feMorphology in="SourceAlpha" operator="erode" radius="5" result="inner" />
                    <feComposite in="SourceAlpha" in2="inner" operator="out" result="edge" />
                    <feGaussianBlur in="edge" stdDeviation="3" result="edgeSoft" />

                    <!-- Stronger displacement for visible refraction (scale="16") -->
                    <feDisplacementMap in="SourceGraphic" in2="noise" scale="16" xChannelSelector="R" yChannelSelector="G" result="displacedAll" />

                    <!-- Mask displacement to edges only -->
                    <feComposite in="displacedAll" in2="edgeSoft" operator="in" result="displacedEdge" />
                    <feComposite in="SourceGraphic" in2="edgeSoft" operator="out" result="center" />

                    <!-- Merge back -->
                    <feMerge>
                        <feMergeNode in="center" />
                        <feMergeNode in="displacedEdge" />
                    </feMerge>
                </filter>
            </defs>
        `;
        
        document.body.insertBefore(svg, document.body.firstChild);
    }
    
    // Generate navigation HTML based on current page path
    function generateNav() {
        const currentPath = window.location.pathname;
        const isIndex = currentPath.endsWith('/') || currentPath.endsWith('/index.html') || currentPath === '/index.html' || currentPath === 'index.html';
        const isBlog = currentPath.endsWith('/blog.html') || currentPath === '/blog.html' || currentPath === 'blog.html';
        const isInBlogDir = currentPath.includes('/blog/') && !isBlog;
        
        // Determine base path for links
        let basePath = '';
        if (isInBlogDir) {
            basePath = '../';
        }
        
        // Generate links based on current page
        const links = [
            { text: 'About', href: isIndex ? '#about' : basePath + 'index.html#about', onclick: isIndex ? 'closeMenu()' : '' },
            { text: 'Blog', href: isBlog ? 'blog.html' : basePath + 'blog.html', onclick: '' },
            { text: 'Research', href: isIndex ? '#research' : basePath + 'index.html#research', onclick: isIndex ? 'closeMenu()' : '' },
            { text: 'Teaching', href: isIndex ? '#teaching' : basePath + 'index.html#teaching', onclick: isIndex ? 'closeMenu()' : '' },
            { text: 'Misc', href: isIndex ? '#miscellaneous' : basePath + 'index.html#miscellaneous', onclick: isIndex ? 'closeMenu()' : '' }
        ];
        
        const menuToggle = `
        <button class="menu-toggle" id="menuToggle" aria-label="Toggle menu">
            <span></span>
            <span></span>
            <span></span>
        </button>`;
        
        const navItems = links.map(link => {
            const onclick = link.onclick ? `onclick="${link.onclick}"` : '';
            return `            <li><a href="${link.href}" ${onclick}>${link.text}</a></li>`;
        }).join('\n');

        const sidebar = `
    <nav class="sidebar" id="sidebar">
        <ul class="sidebar-nav">
${navItems}
        </ul>
    </nav>`;
        
        return menuToggle + sidebar;
    }
    
    // Insert navigation into body
    function insertNav() {
        const navHTML = generateNav();
        const body = document.body;
        if (body) {
            body.insertAdjacentHTML('afterbegin', navHTML);
        }
    }
    
    // Initialize menu when DOM is ready
    function initMenu() {
        const menuToggle = document.getElementById('menuToggle');
        const sidebar = document.getElementById('sidebar');
        
        if (!menuToggle || !sidebar) {
            return;
        }
        
        function toggleMenu() {
            sidebar.classList.toggle('active');
        }
        
        function closeMenu() {
            sidebar.classList.remove('active');
        }
        
        // Make closeMenu available globally for onclick handlers
        window.closeMenu = closeMenu;
        
        menuToggle.addEventListener('click', toggleMenu);

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInside = sidebar.contains(event.target) || menuToggle.contains(event.target);
            if (!isClickInside && sidebar.classList.contains('active')) {
                closeMenu();
            }
        });
    }
    
    // Run when DOM is ready
    function init() {
        injectLiquidGlassFilter();
        insertNav();
        initMenu();
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

