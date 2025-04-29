document.addEventListener('DOMContentLoaded', function() {
    // Get menu buttons and forms
    const routerMenuButton = document.getElementById('routerMenuButton');
    const switchMenuButton = document.getElementById('switchMenuButton');
    const routerForm = document.getElementById('routerForm');
    const switchForm = document.getElementById('switchForm');
    const routerOutput = document.getElementById('routerOutput');
    const switchOutput = document.getElementById('switchOutput');

    // Toggle router form
    routerMenuButton.addEventListener('click', function() {
        routerMenuButton.classList.toggle('active');
        routerForm.style.display = routerForm.style.display === 'none' ? 'block' : 'none';
        if (routerForm.style.display === 'none') {
            routerOutput.style.display = 'none';
        }
    });

    // Toggle switch form
    switchMenuButton.addEventListener('click', function() {
        switchMenuButton.classList.toggle('active');
        switchForm.style.display = switchForm.style.display === 'none' ? 'block' : 'none';
        if (switchForm.style.display === 'none') {
            switchOutput.style.display = 'none';
        }
    });

    // Get input elements
    const routerHostname = document.getElementById('routerHostname');
    const routerConsolePassword = document.getElementById('routerConsolePassword');
    const routerEnablePassword = document.getElementById('routerEnablePassword');
    const routerBanner = document.getElementById('routerBanner');
    const switchHostname = document.getElementById('switchHostname');
    const switchConsolePassword = document.getElementById('switchConsolePassword');
    const switchEnablePassword = document.getElementById('switchEnablePassword');
    const switchDefaultGateway = document.getElementById('switchDefaultGateway');
    const switchBanner = document.getElementById('switchBanner');

    // Get output elements
    const routerConfigOutput = document.getElementById('routerConfigOutput');
    const switchConfigOutput = document.getElementById('switchConfigOutput');

    // Get copy buttons
    const copyRouterConfig = document.getElementById('copyRouterConfig');
    const copySwitchConfig = document.getElementById('copySwitchConfig');

    // Generate router configuration
    document.getElementById('generateRouterConfig').addEventListener('click', function() {
        const config = generateRouterConfig();
        routerConfigOutput.value = config;
        routerOutput.style.display = 'block';
    });

    // Generate switch configuration
    document.getElementById('generateSwitchConfig').addEventListener('click', function() {
        const config = generateSwitchConfig();
        switchConfigOutput.value = config;
        switchOutput.style.display = 'block';
    });

    // Copy router configuration
    copyRouterConfig.addEventListener('click', function() {
        routerConfigOutput.select();
        document.execCommand('copy');
        showCopyFeedback(copyRouterConfig);
    });

    // Copy switch configuration
    copySwitchConfig.addEventListener('click', function() {
        switchConfigOutput.select();
        document.execCommand('copy');
        showCopyFeedback(copySwitchConfig);
    });

    function generateRouterConfig() {
        return `enable
configure terminal
hostname ${routerHostname.value}
!
enable secret ${routerEnablePassword.value}
!
line con 0
password ${routerConsolePassword.value}
login
exit
!
banner motd #${routerBanner.value}#
!
service password-encryption
no ip domain-lookup
!
end
write memory`;
    }

    function generateSwitchConfig() {
        return `enable
configure terminal
hostname ${switchHostname.value}
!
enable secret ${switchEnablePassword.value}
!
line con 0
password ${switchConsolePassword.value}
login
exit
!
banner motd #${switchBanner.value}#
!
ip default-gateway ${switchDefaultGateway.value}
!
service password-encryption
no ip domain-lookup
!
end
write memory`;
    }

    function showCopyFeedback(button) {
        const originalText = button.textContent;
        button.textContent = 'Copied!';
        setTimeout(() => {
            button.textContent = originalText;
        }, 2000);
    }
}); 