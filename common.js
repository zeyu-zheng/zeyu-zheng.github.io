// Common navigation menu functionality
(function() {
    'use strict';
    
    // Inject SVG filter for Liquid Glass effect (edge refraction)
    function injectLiquidGlassFilter() {
        const svgNS = 'http://www.w3.org/2000/svg';
        const svg = document.createElementNS(svgNS, 'svg');
        svg.setAttribute('width', '0');
        svg.setAttribute('height', '0');
        svg.style.position = 'absolute';
        svg.style.pointerEvents = 'none';
        
        svg.innerHTML = `
            <defs>
                <filter id="liquid-glass" x="-50%" y="-50%" width="200%" height="200%" color-interpolation-filters="sRGB">
                    <!-- Turbulence for organic distortion -->
                    <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="3" seed="5" result="noise"/>
                    
                    <!-- Edge displacement map -->
                    <feDisplacementMap in="SourceGraphic" in2="noise" scale="8" xChannelSelector="R" yChannelSelector="G" result="displaced"/>
                    
                    <!-- Gaussian blur for frosted glass -->
                    <feGaussianBlur in="displaced" stdDeviation="0.5" result="blurred"/>
                    
                    <!-- Specular lighting for glass shine -->
                    <feSpecularLighting in="noise" surfaceScale="2" specularConstant="0.8" specularExponent="20" lighting-color="#fff" result="specular">
                        <fePointLight x="100" y="50" z="200"/>
                    </feSpecularLighting>
                    
                    <!-- Composite specular with blurred -->
                    <feComposite in="specular" in2="SourceGraphic" operator="in" result="specularMask"/>
                    
                    <!-- Blend everything -->
                    <feBlend in="blurred" in2="specularMask" mode="screen" result="final"/>
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

