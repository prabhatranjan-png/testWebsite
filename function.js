/**
 * RealFast.ai Web-to-Lead Form Validation
 * Lightweight client-side validation for lead capture
 */

(function() {
    'use strict';

    // Wait for DOM to be ready
    document.addEventListener('DOMContentLoaded', function() {
        initializeForm();
    });

    /**
     * Initialize form and attach event listeners
     */
    function initializeForm() {
        const form = document.getElementById('web-to-lead-form');

        if (!form) {
            console.error('Form element not found');
            return;
        }

        // Attach form submission handler
        form.addEventListener('submit', handleFormSubmit);

        // Real-time validation on blur
        attachBlurValidation(form);

        // Real-time email validation
        const emailInput = form.querySelector('[name="email"]');
        if (emailInput) {
            emailInput.addEventListener('input', debounce(function() {
                if (emailInput.value.length > 0) {
                    validateField(emailInput);
                }
            }, 500));
        }
    }

    /**
     * Handle form submission
     */
    function handleFormSubmit(e) {
        const form = e.target;
        const submitButton = form.querySelector('.btn-submit');
        const formMessages = document.getElementById('form-messages');

        // Clear previous messages
        if (formMessages) {
            hideMessage(formMessages);
        }

        // Validate all fields
        const isValid = validateForm(form);

        if (!isValid) {
            e.preventDefault();

            if (formMessages) {
                showMessage(formMessages, 'error', 'Please correct the errors below and try again.');
            }

            // Scroll to first error
            const firstError = form.querySelector('.invalid');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstError.focus();
            }
            return false;
        }

        // Show loading state
        if (submitButton) {
            setLoadingState(submitButton, true);
        }

        // Form will submit normally to Salesforce
        return true;
    }

    /**
     * Validate entire form
     */
    function validateForm(form) {
        let isValid = true;

        // Required text fields
        const requiredFields = [
            { name: 'first_name', label: 'First Name', type: 'text' },
            { name: 'last_name', label: 'Last Name', type: 'text' },
            { name: 'email', label: 'Email', type: 'email' },
            { name: 'company', label: 'Company', type: 'text' }
        ];

        requiredFields.forEach(function(field) {
            const input = form.querySelector('[name="' + field.name + '"]');
            if (!input) return;

            const value = input.value.trim();

            if (!value) {
                setFieldError(input, field.label + ' is required');
                isValid = false;
            } else if (field.type === 'email' && !isValidEmail(value)) {
                setFieldError(input, 'Please enter a valid email address');
                isValid = false;
            } else {
                clearFieldError(input);
            }
        });

        // Phone validation (optional but validate format if provided)
        const phoneFields = ['phone', 'mobile'];
        phoneFields.forEach(function(fieldName) {
            const input = form.querySelector('[name="' + fieldName + '"]');
            if (!input) return;

            const value = input.value.trim();
            if (value && !isValidPhone(value)) {
                setFieldError(input, 'Please enter a valid phone number');
                isValid = false;
            } else if (value || input.classList.contains('invalid')) {
                clearFieldError(input);
            }
        });

        // URL validation (optional but validate format if provided)
        const urlInput = form.querySelector('[name="url"]');
        if (urlInput) {
            const value = urlInput.value.trim();
            if (value && !isValidURL(value)) {
                setFieldError(urlInput, 'Please enter a valid website URL');
                isValid = false;
            } else if (value || urlInput.classList.contains('invalid')) {
                clearFieldError(urlInput);
            }
        }

        return isValid;
    }

    /**
     * Attach blur validation to form fields
     */
    function attachBlurValidation(form) {
        const fields = form.querySelectorAll('input[required], input[type="email"], input[type="tel"]');

        fields.forEach(function(field) {
            field.addEventListener('blur', function() {
                if (field.value.trim().length > 0 || field.hasAttribute('required')) {
                    validateField(field);
                }
            });
        });
    }

    /**
     * Validate individual field
     */
    function validateField(field) {
        const value = field.value.trim();
        const isRequired = field.hasAttribute('required');

        // Check if required and empty
        if (isRequired && !value) {
            const label = getLabelText(field);
            setFieldError(field, label + ' is required');
            return false;
        }

        // Type-specific validation
        if (value) {
            if (field.type === 'email' && !isValidEmail(value)) {
                setFieldError(field, 'Please enter a valid email address');
                return false;
            }

            if (field.type === 'tel' && !isValidPhone(value)) {
                setFieldError(field, 'Please enter a valid phone number');
                return false;
            }

            if (field.name === 'url' && !isValidURL(value)) {
                setFieldError(field, 'Please enter a valid website URL');
                return false;
            }
        }

        // If all checks pass
        clearFieldError(field);
        return true;
    }

    /**
     * Get label text for a field
     */
    function getLabelText(field) {
        const label = field.closest('.form-group')?.querySelector('label');
        if (label) {
            return label.textContent.replace('*', '').trim();
        }
        return 'This field';
    }

    /**
     * Email validation
     */
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Phone validation (flexible to support international formats)
     */
    function isValidPhone(phone) {
        // Allow digits, spaces, dashes, parentheses, and + sign
        const phoneRegex = /^[\d\s\-\(\)\+]+$/;
        const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
        return phoneRegex.test(phone) && cleanPhone.length >= 10;
    }

    /**
     * URL validation
     */
    function isValidURL(url) {
        try {
            const urlObj = new URL(url);
            return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
        } catch (e) {
            // If URL doesn't have protocol, try adding it
            if (!url.startsWith('http')) {
                try {
                    new URL('https://' + url);
                    return true;
                } catch (e2) {
                    return false;
                }
            }
            return false;
        }
    }

    /**
     * Set field error state
     */
    function setFieldError(field, message) {
        field.classList.add('invalid');
        field.classList.remove('valid');

        const errorSpan = field.parentElement.querySelector('.error-message');
        if (errorSpan) {
            errorSpan.textContent = message;
        }
    }

    /**
     * Clear field error state
     */
    function clearFieldError(field) {
        field.classList.remove('invalid');
        if (field.value.trim()) {
            field.classList.add('valid');
        } else {
            field.classList.remove('valid');
        }

        const errorSpan = field.parentElement.querySelector('.error-message');
        if (errorSpan) {
            errorSpan.textContent = '';
        }
    }

    /**
     * Show form message (success or error)
     */
    function showMessage(messageElement, type, message) {
        messageElement.textContent = message;
        messageElement.className = 'form-messages ' + type;
        messageElement.style.display = 'block';
        messageElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    /**
     * Hide form message
     */
    function hideMessage(messageElement) {
        messageElement.style.display = 'none';
        messageElement.textContent = '';
        messageElement.className = 'form-messages';
    }

    /**
     * Set loading state on submit button
     */
    function setLoadingState(button, isLoading) {
        const btnText = button.querySelector('.btn-text');
        const btnLoader = button.querySelector('.btn-loader');

        if (isLoading) {
            button.classList.add('loading');
            button.disabled = true;
            if (btnText) btnText.style.display = 'none';
            if (btnLoader) btnLoader.style.display = 'inline-flex';
        } else {
            button.classList.remove('loading');
            button.disabled = false;
            if (btnText) btnText.style.display = 'inline-block';
            if (btnLoader) btnLoader.style.display = 'none';
        }
    }

    /**
     * Debounce function for performance
     */
    function debounce(func, wait) {
        let timeout;
        return function executedFunction() {
            const context = this;
            const args = arguments;
            const later = function() {
                timeout = null;
                func.apply(context, args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

})();
