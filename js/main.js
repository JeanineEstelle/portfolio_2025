// Set current year in footer
document.getElementById('current-year').textContent = new Date().getFullYear();

// Mobile menu functionality
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav');
    const navLinks = document.querySelectorAll('.nav a');

    // Mobile menu toggle
    if (menuToggle && nav) {
        menuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            nav.classList.toggle('active');
            
            // Change icon
            const icon = this.querySelector('i');
            if (nav.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Close menu when clicking on any navigation link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 780) {
                nav.classList.remove('active');
                if (menuToggle) {
                    const icon = menuToggle.querySelector('i');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    });

    // Close menu when clicking outside on mobile
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 780 && nav && nav.classList.contains('active')) {
            if (!e.target.closest('.nav') && !e.target.closest('.menu-toggle')) {
                nav.classList.remove('active');
                if (menuToggle) {
                    const icon = menuToggle.querySelector('i');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        }
    });
});

/* =========================================================
   PROJECTS: FILTER + SHOW MORE
   ========================================================= */

// keep track of the current active filter
let currentProjectFilter = 'all';

// Apply category filter, respecting "Show More" state
function applyProjectFilter(selectedCategory) {
    const projectCards = document.querySelectorAll('.project-card');
    currentProjectFilter = selectedCategory;

    projectCards.forEach(card => {
        const isExtra = card.classList.contains('project-more');
        const isExtraVisible = !isExtra || card.classList.contains('show'); // only visible if .show when extra

        // If it's an extra project and not yet expanded, always hide
        if (!isExtraVisible) {
            card.style.display = 'none';
            return;
        }

        const cardCategories = (card.getAttribute('data-category') || '').toLowerCase();

        if (selectedCategory === 'all') {
            card.style.display = '';
        } else {
            if (cardCategories.includes(selectedCategory)) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        }
    });
}

// Initialize filter buttons
function initProjectFilters() {
    const filterButtons = document.querySelectorAll('.project-filter-btn');
    if (!filterButtons.length) return;

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const selected = btn.getAttribute('data-category');

            // active state on buttons
            filterButtons.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-pressed', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-pressed', 'true');

            applyProjectFilter(selected);
        });
    });

    // initial state
    applyProjectFilter('all');
}

// Initialize Show More / Show Less for projects
function initShowMoreProjects() {
    const showMoreProjectsBtn = document.getElementById('showMoreProjects');
    let projectsExpanded = false;
    
    if (!showMoreProjectsBtn) return;

    showMoreProjectsBtn.addEventListener('click', function() {
        const extraProjects = document.querySelectorAll('.project-more');
        
        if (!projectsExpanded) {
            // Show hidden projects (by adding .show, CSS handles display)
            extraProjects.forEach(project => {
                project.classList.add('show');
            });
            this.innerHTML = 'Show Less Projects <i class="fas fa-chevron-up"></i>';
            projectsExpanded = true;
            this.setAttribute('aria-expanded', 'true');
        } else {
            // Hide additional projects
            extraProjects.forEach(project => {
                project.classList.remove('show');
            });
            this.innerHTML = 'Show More Projects <i class="fas fa-chevron-down"></i>';
            projectsExpanded = false;
            this.setAttribute('aria-expanded', 'false');
        }
        
        this.classList.toggle('expanded');

        // Re-apply the current filter so newly shown/hidden cards respect it
        applyProjectFilter(currentProjectFilter);
    });
}

// Initialize project filters + show more once DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initProjectFilters();
    initShowMoreProjects();
});

/* =========================================================
   SKILLS SECTION ROLE FILTERING
   ========================================================= */

function initSkillsFilter() {
    const roleButtons = document.querySelectorAll('.role-btn');
    const skillCategories = document.querySelectorAll('.skill-category');

    // Add click event to each role button
    roleButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            roleButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-pressed', 'false');
            });
            
            // Add active class to clicked button
            this.classList.add('active');
            this.setAttribute('aria-pressed', 'true');
            
            const selectedRole = this.getAttribute('data-role');
            
            // Show/hide categories based on selected role
            skillCategories.forEach(category => {
                const categoryRole = category.getAttribute('data-role');
                
                if (selectedRole === 'all' || categoryRole === selectedRole) {
                    category.style.display = 'block';
                    category.setAttribute('aria-hidden', 'false');
                } else {
                    category.style.display = 'none';
                    category.setAttribute('aria-hidden', 'true');
                }
            });
        });
    });

    // Initialize with all skills visible
    skillCategories.forEach(category => {
        category.style.display = 'block';
        category.setAttribute('aria-hidden', 'false');
    });
}

// Initialize skills filter when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initSkillsFilter();
});

/* =========================================================
   SECURITY & CONTACT FORM
   ========================================================= */

// SECURITY: Enhanced input sanitization function
function sanitizeInput(input) {
    if (typeof input !== 'string') return '';
    
    return input
        .replace(/</g, '&lt;')  // Prevent XSS
        .replace(/>/g, '&gt;')  // Prevent XSS
        .replace(/"/g, '&quot;') // Prevent injection
        .replace(/'/g, '&#x27;') // Prevent SQL injection
        .replace(/\//g, '&#x2F;') // Prevent XSS
        .replace(/\\/g, '&#92;') // Prevent escaping
        .replace(/`/g, '&#96;') // Prevent template literal injection
        .substring(0, 1000) // Length limit for security
        .trim();
}

// SECURITY: Validate name (letters and spaces only, no numbers)
function isValidName(name) {
    const nameRegex = /^[A-Za-z\s\-']+$/; // Only letters, spaces, hyphens, apostrophes
    return nameRegex.test(name) && name.length >= 2 && name.length <= 50;
}

// SECURITY: Validate email format
function isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email) && email.length <= 100;
}

// SECURITY: Validate subject (prevent XSS)
function isValidSubject(subject) {
    const subjectRegex = /^[A-Za-z0-9\s\-\.,!?']+$/; // Alphanumeric and basic punctuation
    return subjectRegex.test(subject) && subject.length >= 2 && subject.length <= 100;
}

// SECURITY: Validate message (prevent XSS)
function isValidMessage(message) {
    const messageRegex = /^[A-Za-z0-9\s\-\.,!?@#$%^&*()_+={}|[\]\\:;"'<>?\/\n\r]+$/;
    return messageRegex.test(message) && message.length >= 10 && message.length <= 1000;
}

// ACCESSIBILITY: Create screen reader announcements
function createAccessibilityAnnouncement() {
    let announcement = document.getElementById('a11y-announcement');
    if (!announcement) {
        announcement = document.createElement('div');
        announcement.id = 'a11y-announcement';
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.style.cssText = 'position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden;';
        document.body.appendChild(announcement);
    }
    return announcement;
}

// SECURITY: Rate limiting to prevent spam
let lastSubmissionTime = 0;
const MIN_SUBMISSION_INTERVAL = 5000; // 5 seconds

// Enhanced Contact Form with Security & Accessibility
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const formStatus = document.getElementById('formStatus');
    const charCount = document.getElementById('charCount');
    const messageTextarea = document.getElementById('message');
    const nameInput = document.getElementById('name');
    const a11yAnnouncement = createAccessibilityAnnouncement();

    if (!contactForm) {
        console.log('Contact form not found');
        return;
    }

    // ACCESSIBILITY: Enhanced name field validation with announcements
    if (nameInput) {
        nameInput.addEventListener('input', function(e) {
            const originalValue = this.value;
            const cleanValue = originalValue.replace(/[^A-Za-z\s\-']/g, '');
            
            if (originalValue !== cleanValue) {
                this.value = cleanValue;
                a11yAnnouncement.textContent = 'Numbers and special characters removed from name field';
            }
        });

        nameInput.addEventListener('blur', function() {
            if (this.value && !isValidName(this.value)) {
                a11yAnnouncement.textContent = 'Name can only contain letters, spaces, hyphens, or apostrophes';
            }
        });

        nameInput.addEventListener('keydown', function(e) {
            // Allow: backspace, delete, tab, escape, enter, arrows
            if ([8, 9, 13, 27, 46, 37, 38, 39, 40].includes(e.keyCode)) {
                return;
            }
            
            // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
            if ((e.keyCode === 65 || e.keyCode === 67 || e.keyCode === 86 || e.keyCode === 88) && e.ctrlKey === true) {
                return;
            }
            
            // Only allow letters, space, hyphen, apostrophe
            if (!/[A-Za-z\s\-']/.test(e.key)) {
                e.preventDefault();
                a11yAnnouncement.textContent = 'Only letters, spaces, hyphens, and apostrophes are allowed in the name field';
            }
        });

        // SECURITY: Enhanced paste prevention
        nameInput.addEventListener('paste', function(e) {
            e.preventDefault();
            const pastedText = (e.clipboardData || window.clipboardData).getData('text');
            const cleanText = pastedText.replace(/[^A-Za-z\s\-']/g, '');
            document.execCommand('insertText', false, cleanText);
            a11yAnnouncement.textContent = 'Pasted content cleaned - only letters and spaces kept';
        });
    }

    // ACCESSIBILITY: Character counter with announcements
    if (messageTextarea && charCount) {
        messageTextarea.addEventListener('input', function() {
            const length = this.value.length;
            charCount.textContent = length;
            
            if (length > 900) {
                charCount.style.color = '#ff6b6b';
                if (length === 901) {
                    a11yAnnouncement.textContent = 'Message approaching character limit';
                }
            } else {
                charCount.style.color = 'var(--text-muted)';
            }
        });
    }

    // SECURE & ACCESSIBLE Form submission
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // SECURITY: Rate limiting check
        const currentTime = Date.now();
        if (currentTime - lastSubmissionTime < MIN_SUBMISSION_INTERVAL) {
            const errorMsg = 'Please wait a moment before submitting another message';
            formStatus.textContent = '❌ ' + errorMsg;
            formStatus.className = 'form-status error';
            a11yAnnouncement.textContent = errorMsg;
            return;
        }
        lastSubmissionTime = currentTime;

        // Get and sanitize form values
        const name = sanitizeInput(document.getElementById('name').value);
        const email = sanitizeInput(document.getElementById('email').value);
        const subject = sanitizeInput(document.getElementById('subject').value);
        const message = sanitizeInput(document.getElementById('message').value);

        // ACCESSIBILITY: Enhanced validation with screen reader announcements
        if (!isValidName(name)) {
            const errorMsg = 'Please enter a valid name (letters and spaces only, 2-50 characters)';
            formStatus.textContent = '❌ ' + errorMsg;
            formStatus.className = 'form-status error';
            a11yAnnouncement.textContent = errorMsg;
            document.getElementById('name').focus();
            return;
        }

        if (!isValidEmail(email)) {
            const errorMsg = 'Please enter a valid email address';
            formStatus.textContent = '❌ ' + errorMsg;
            formStatus.className = 'form-status error';
            a11yAnnouncement.textContent = errorMsg;
            document.getElementById('email').focus();
            return;
        }

        if (!isValidSubject(subject)) {
            const errorMsg = 'Please enter a valid subject (2-100 characters)';
            formStatus.textContent = '❌ ' + errorMsg;
            formStatus.className = 'form-status error';
            a11yAnnouncement.textContent = errorMsg;
            document.getElementById('subject').focus();
            return;
        }

        if (!isValidMessage(message)) {
            const errorMsg = 'Please enter a valid message (10-1000 characters)';
            formStatus.textContent = '❌ ' + errorMsg;
            formStatus.className = 'form-status error';
            a11yAnnouncement.textContent = errorMsg;
            document.getElementById('message').focus();
            return;
        }

        // Show loading state with accessibility
        if (submitBtn) {
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
            submitBtn.setAttribute('aria-disabled', 'true');
        }
        
        a11yAnnouncement.textContent = 'Sending your message, please wait';

        try {
            const formData = new FormData();
            // SECURITY: Use sanitized values
            formData.append('name', name);
            formData.append('email', email);
            formData.append('subject', subject);
            formData.append('message', message);
            formData.append('_subject', 'New secure message from portfolio');
            
            // SECURITY: Add timeout to prevent hanging requests
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

            // Send to Formspree
            const response = await fetch(this.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                },
                signal: controller.signal
            });

            clearTimeout(timeoutId);
            
            if (response.ok) {
                // Success
                const successMsg = 'Thank you! Your secure message has been sent successfully.';
                formStatus.textContent = '✅ ' + successMsg;
                formStatus.className = 'form-status success';
                a11yAnnouncement.textContent = successMsg + ' Form has been reset.';
                contactForm.reset();
                if (charCount) charCount.textContent = '0';
                
                // ACCESSIBILITY: Focus on success message for screen readers
                formStatus.focus();
            } else {
                throw new Error(`Form submission failed with status: ${response.status}`);
            }
        } catch (error) {
            // Enhanced error handling
            let errorMsg = 'Sorry, there was an error sending your message. Please email me directly at estelletientcheu91@gmail.com';
            
            if (error.name === 'AbortError') {
                errorMsg = 'Request timed out. Please check your connection and try again.';
            }
            
            formStatus.textContent = '❌ ' + errorMsg;
            formStatus.className = 'form-status error';
            a11yAnnouncement.textContent = errorMsg;
        } finally {
            // Reset button state
            if (submitBtn) {
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
                submitBtn.setAttribute('aria-disabled', 'false');
            }
            
            // Hide message after 8 seconds
            setTimeout(() => {
                if (formStatus.style.display !== 'none') {
                    formStatus.style.display = 'none';
                    a11yAnnouncement.textContent = 'Form status message hidden';
                }
            }, 8000);
        }
    });
}

// Initialize contact form
document.addEventListener('DOMContentLoaded', function() {
    initContactForm();
});

/* =========================================================
   EXPERIENCE SECTION TOGGLE (ARROW + OPEN/CLOSE)
   ========================================================= */

document.addEventListener('DOMContentLoaded', function() {
    const experiencePositions = document.querySelectorAll('.experience-position');
    let currentlyOpenDetails = null;
    let currentlyOpenItem = null;
    
    experiencePositions.forEach(position => {
        position.addEventListener('click', function() {
            const detailsId = this.getAttribute('data-details');
            const detailsElement = document.getElementById(detailsId);
            const item = this.closest('.experience-item');
            
            if (!detailsElement || !item) return;
            
            // Close currently open details + remove open class
            if (currentlyOpenDetails && currentlyOpenDetails !== detailsElement) {
                currentlyOpenDetails.classList.remove('show');
                currentlyOpenDetails.setAttribute('aria-hidden', 'true');
            }
            if (currentlyOpenItem && currentlyOpenItem !== item) {
                currentlyOpenItem.classList.remove('open');
            }
            
            // Toggle current details + open class
            if (detailsElement.classList.contains('show')) {
                detailsElement.classList.remove('show');
                detailsElement.setAttribute('aria-hidden', 'true');
                item.classList.remove('open');
                currentlyOpenDetails = null;
                currentlyOpenItem = null;
            } else {
                detailsElement.classList.add('show');
                detailsElement.setAttribute('aria-hidden', 'false');
                item.classList.add('open');
                currentlyOpenDetails = detailsElement;
                currentlyOpenItem = item;
                
                // ACCESSIBILITY: Focus on the opened details for keyboard users
                setTimeout(() => {
                    detailsElement.focus();
                }, 100);
            }
        });
        
        // ACCESSIBILITY: Add keyboard support for experience items
        position.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
});

/* =========================================================
   EXTRA SECURITY HOOKS
   ========================================================= */

document.addEventListener('DOMContentLoaded', function() {
    // Prevent right-click context menu on sensitive elements (optional)
    const sensitiveElements = document.querySelectorAll('input[type="email"], input[type="text"][name="name"]');
    sensitiveElements.forEach(el => {
        el.addEventListener('contextmenu', function(e) {
            e.preventDefault();
        });
    });
    
    // Log security events (for monitoring)
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function() {
            console.log('Form submission attempted:', new Date().toISOString());
        });
    });
});
