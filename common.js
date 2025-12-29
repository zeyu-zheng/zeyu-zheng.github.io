// Common navigation menu functionality
(function() {
    'use strict';

    // iOS Safari (and some in-app browsers) have unstable 100vh.
    // Use visualViewport height when available to drive sidebar height.
    function setAppHeight() {
        const vv = window.visualViewport;
        const h = vv && typeof vv.height === 'number' ? vv.height : window.innerHeight;
        document.documentElement.style.setProperty('--app-height', `${Math.round(h)}px`);
    }

    function bindAppHeight() {
        setAppHeight();
        window.addEventListener('resize', setAppHeight);
        window.addEventListener('orientationchange', setAppHeight);
        if (window.visualViewport) {
            window.visualViewport.addEventListener('resize', setAppHeight);
            // Safari may change visual viewport height on scroll (address bar show/hide)
            window.visualViewport.addEventListener('scroll', setAppHeight);
        }
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
        bindAppHeight();
        insertNav();
        initMenu();
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

