/**
 * Web-to-Lead Form Validation
 * Lightweight validation for RealFast.ai lead capture form
 */

(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {
        const form = document.getElementById('web-to-lead-form');
        if (!form) return;

        // Attach form submission handler
        form.addEventListener('submit', function(e) {
            if (!validateForm(form)) {
                e.preventDefault();
                scrollToFirstError();
                return false;
            }
            return true;
        });

        // Real-time validation
        attachFieldValidation(form);
    });

    /**
     * Validate entire form
     */
    function validateForm(form) {
        let isValid = true;

        // Required fields validation
        const requiredFields = [
            { name: 'first_name', label: 'First Name' },
            { name: 'last_name', label: 'Last Name' },
            { name: 'email', label: 'Email' },
            { name: 'company', label: 'Company' }
        ];

        requiredFields.forEach(function(field) {
            const input = form.querySelector('[name="' + field.name + '"]');
            if (input && !input.value.trim()) {
                markInvalid(input, field.label + ' is required');
                isValid = false;
            } else if (input) {
                markValid(input);
            }
        });

        // Email validation
        const emailInput = form.querySelector('[name="email"]');
        if (emailInput && emailInput.value.trim()) {
            if (!isValidEmail(emailInput.value)) {
                markInvalid(emailInput, 'Please enter a valid email address');
                isValid = false;
            }
        }

        // Phone validation (optional but format check if provided)
        const phoneInput = form.querySelector('[name="phone"]');
        if (phoneInput && phoneInput.value.trim() && !isValidPhone(phoneInput.value)) {
            markInvalid(phoneInput, 'Please enter a valid phone number');
            isValid = false;
        }

        // Mobile validation (optional but format check if provided)
        const mobileInput = form.querySelector('[name="mobile"]');
        if (mobileInput && mobileInput.value.trim() && !isValidPhone(mobileInput.value)) {
            markInvalid(mobileInput, 'Please enter a valid mobile number');
            isValid = false;
        }

        // Website URL validation (optional but format check if provided)
        const urlInput = form.querySelector('[name="url"]');
        if (urlInput && urlInput.value.trim() && !isValidURL(urlInput.value)) {
            markInvalid(urlInput, 'Please enter a valid website URL');
            isValid = false;
        }

        return isValid;
    }

    /**
     * Attach real-time validation to fields
     */
    function attachFieldValidation(form) {
        // Validate required fields on blur
        const requiredInputs = form.querySelectorAll('input[required]');
        requiredInputs.forEach(function(input) {
            input.addEventListener('blur', function() {
                if (!input.value.trim()) {
                    const label = getFieldLabel(input);
                    markInvalid(input, label + ' is required');
                } else {
                    markValid(input);
                }
            });
        });

        // Email validation on blur
        const emailInput = form.querySelector('[name="email"]');
        if (emailInput) {
            emailInput.addEventListener('blur', function() {
                if (emailInput.value.trim() && !isValidEmail(emailInput.value)) {
                    markInvalid(emailInput, 'Please enter a valid email address');
                } else if (emailInput.value.trim()) {
                    markValid(emailInput);
                }
            });
        }

        // Phone validation on blur
        const phoneInput = form.querySelector('[name="phone"]');
        if (phoneInput) {
            phoneInput.addEventListener('blur', function() {
                if (phoneInput.value.trim() && !isValidPhone(phoneInput.value)) {
                    markInvalid(phoneInput, 'Please enter a valid phone number');
                } else if (phoneInput.value.trim()) {
                    markValid(phoneInput);
                }
            });
        }

        // Mobile validation on blur
        const mobileInput = form.querySelector('[name="mobile"]');
        if (mobileInput) {
            mobileInput.addEventListener('blur', function() {
                if (mobileInput.value.trim() && !isValidPhone(mobileInput.value)) {
                    markInvalid(mobileInput, 'Please enter a valid mobile number');
                } else if (mobileInput.value.trim()) {
                    markValid(mobileInput);
                }
            });
        }

        // URL validation on blur
        const urlInput = form.querySelector('[name="url"]');
        if (urlInput) {
            urlInput.addEventListener('blur', function() {
                if (urlInput.value.trim() && !isValidURL(urlInput.value)) {
                    markInvalid(urlInput, 'Please enter a valid website URL');
                } else if (urlInput.value.trim()) {
                    markValid(urlInput);
                }
            });
        }
    }

    /**
     * Email validation
     */
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Phone validation (supports international formats)
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
            // Try adding https:// if missing
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
     * Get field label text
     */
    function getFieldLabel(input) {
        const formGroup = input.closest('.form-group');
        if (formGroup) {
            const label = formGroup.querySelector('label');
            if (label) {
                return label.textContent.replace('*', '').trim();
            }
        }
        return 'This field';
    }

    /**
     * Mark field as invalid
     */
    function markInvalid(input, message) {
        input.style.borderColor = '#dc3545';
        input.style.backgroundColor = '#fff5f5';

        // Show error message (create if doesn't exist)
        let errorMsg = input.parentElement.querySelector('.error-message');
        if (!errorMsg) {
            errorMsg = document.createElement('span');
            errorMsg.className = 'error-message';
            errorMsg.style.color = '#dc3545';
            errorMsg.style.fontSize = '0.85rem';
            errorMsg.style.marginTop = '5px';
            errorMsg.style.display = 'block';
            input.parentElement.appendChild(errorMsg);
        }
        errorMsg.textContent = message;
    }

    /**
     * Mark field as valid
     */
    function markValid(input) {
        input.style.borderColor = '#28a745';
        input.style.backgroundColor = '#ffffff';

        // Remove error message
        const errorMsg = input.parentElement.querySelector('.error-message');
        if (errorMsg) {
            errorMsg.textContent = '';
        }
    }

    /**
     * Scroll to first error
     */
    function scrollToFirstError() {
        const firstInvalid = document.querySelector('input[style*="border-color: rgb(220, 53, 69)"]');
        if (firstInvalid) {
            firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstInvalid.focus();
        }
    }

})();
