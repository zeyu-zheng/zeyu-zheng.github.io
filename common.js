// Common navigation menu functionality
(function() {
    'use strict';
    
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
        
        const overlay = `
    <div class="sidebar-overlay" id="sidebarOverlay"></div>`;
        
        const sidebar = `
    <nav class="sidebar" id="sidebar">
        <ul class="sidebar-nav">
${navItems}
        </ul>
    </nav>`;
        
        return menuToggle + overlay + sidebar;
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
        const overlay = document.getElementById('sidebarOverlay');
        
        if (!menuToggle || !sidebar || !overlay) {
            return;
        }
        
        function toggleMenu() {
            sidebar.classList.toggle('active');
            overlay.classList.toggle('active');
        }
        
        function closeMenu() {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
        }
        
        // Make closeMenu available globally for onclick handlers
        window.closeMenu = closeMenu;
        
        menuToggle.addEventListener('click', toggleMenu);
        
        // Close menu when clicking overlay
        overlay.addEventListener('click', closeMenu);
    }
    
    // Run when DOM is ready
    function init() {
        insertNav();
        initMenu();
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

