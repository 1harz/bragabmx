document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navbar = document.querySelector('.navbar');
    const header = document.querySelector('.header');
    
    menuToggle.addEventListener('click', () => {
        navbar.classList.toggle('active');
        menuToggle.innerHTML = navbar.classList.contains('active') ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            if(navbar.classList.contains('active')) {
                navbar.classList.remove('active');
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
            
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
    
    window.addEventListener('scroll', () => {
        header.classList.toggle('sticky', window.scrollY > 0);
    });
    
    const typingText = document.querySelector('.typing-text');
    const text = "Acredito firmemente na ideia de que meu corpo alcançará o que minha mente acredita.";
    
    function typeWriter(text, i, fnCallback) {
        if (i < text.length) {
            typingText.innerHTML = text.substring(0, i+1) + '<span aria-hidden="true"></span>';
            
            setTimeout(function() {
                typeWriter(text, i + 1, fnCallback)
            }, 50);
        }
        else if (typeof fnCallback == 'function') {
            setTimeout(fnCallback, 1000);
        }
    }
    
    function startTyping() {
        if (typingText) {
            typeWriter(text, 0, function() {
                setTimeout(startTyping, 5000);
            });
        }
    }
    
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            startTyping();
            observer.unobserve(typingText);
        }
    }, {threshold: 0.5});
    
    if (typingText) {
        observer.observe(typingText);
    }
    
    function handleResponsive() {
        if (window.innerWidth <= 768) {
            const events = document.querySelectorAll('.event');
            events.forEach(event => {
                if (event.classList.contains('left') || event.classList.contains('right')) {
                    event.classList.remove('left', 'right');
                    event.classList.add('left');
                }
            });
        }
    }

    handleResponsive();
    
    window.addEventListener('resize', handleResponsive);
});

document.addEventListener('DOMContentLoaded', function() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    function calculateAge(birthYear, birthMonth = 1) {
        const today = new Date();
        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth() + 1;
        
        let age = currentYear - birthYear;
        
        if (currentMonth < birthMonth) {
            age--;
        }
        
        return age;
    }

    const ageElement = document.getElementById('current-age');
    if (ageElement) {
        const birthYear = 2006;
        const birthMonth = 1;
        ageElement.textContent = calculateAge(birthYear, birthMonth);
    }
});