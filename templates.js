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
    const routerDomainName = document.getElementById('routerDomainName');
    const routerVtyPassword = document.getElementById('routerVtyPassword');
    const routerInterface = document.getElementById('routerInterface');
    const routerIPAddress = document.getElementById('routerIPAddress');
    const routerSubnetMask = document.getElementById('routerSubnetMask');
    const routerDescription = document.getElementById('routerDescription');
    const routerDefaultGateway = document.getElementById('routerDefaultGateway');
    const routerStaticRoute = document.getElementById('routerStaticRoute');
    const routerNTP = document.getElementById('routerNTP');
    const routerSNMP = document.getElementById('routerSNMP');
    const routerSyslog = document.getElementById('routerSyslog');

    // Get output elements
    const routerConfigOutput = document.getElementById('routerConfigOutput');
    const switchConfigOutput = document.getElementById('switchConfigOutput');

    // Get copy buttons
    const copyRouterConfig = document.getElementById('copyRouterConfig');
    const copySwitchConfig = document.getElementById('copySwitchConfig');

    // Interface Management
    const interfaceContainer = document.getElementById('interfaceContainer');
    const addInterfaceButton = document.getElementById('addInterface');

    // Handle interface type changes
    function handleInterfaceTypeChange(select) {
        const interfaceGroup = select.closest('.interface-group');
        const standardInterface = interfaceGroup.querySelector('.standard-interface');
        const loopbackInterface = interfaceGroup.querySelector('.loopback-interface');
        
        if (select.value === 'Loopback') {
            standardInterface.style.display = 'none';
            loopbackInterface.style.display = 'flex';
        } else {
            standardInterface.style.display = 'flex';
            loopbackInterface.style.display = 'none';
        }
    }

    // Add event listener for interface type changes
    document.querySelectorAll('.routerInterfaceType').forEach(select => {
        select.addEventListener('change', function() {
            handleInterfaceTypeChange(this);
        });
    });

    addInterfaceButton.addEventListener('click', function() {
        const newInterfaceGroup = document.querySelector('.interface-group').cloneNode(true);
        newInterfaceGroup.querySelectorAll('input, select').forEach(input => {
            input.value = '';
        });
        newInterfaceGroup.querySelector('.remove-interface').style.display = 'block';
        
        // Add event listener for the new interface type select
        const newSelect = newInterfaceGroup.querySelector('.routerInterfaceType');
        newSelect.addEventListener('change', function() {
            handleInterfaceTypeChange(this);
        });
        
        interfaceContainer.appendChild(newInterfaceGroup);
    });

    interfaceContainer.addEventListener('click', function(e) {
        if (e.target.classList.contains('remove-interface')) {
            const interfaceGroup = e.target.closest('.interface-group');
            if (document.querySelectorAll('.interface-group').length > 1) {
                interfaceGroup.remove();
            }
        }
    });

    // Generate router configuration
    document.getElementById('generateRouterConfig').addEventListener('click', function() {
        const config = generateRouterConfig();
        if (config) {
            console.log(config);
            routerConfigOutput.value = config;
            routerOutput.style.display = 'block';
        } else {
            console.error('Failed to generate router configuration.');
            routerOutput.style.display = 'none';
        }
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
        let config = `enable
configure terminal
!
! Basic Configuration
hostname ${routerHostname.value}
${routerDomainName.value ? `ip domain-name ${routerDomainName.value}` : ''}
!
! Security Configuration
enable secret ${routerEnablePassword.value}
!
line con 0
password ${routerConsolePassword.value}
login
exit
!
line vty 0 4
password ${routerVtyPassword.value}
login
exit
!
banner motd #${routerBanner.value}#
!
service password-encryption
no ip domain-lookup
!
! Interface Configuration`;

        // Generate interface configurations
        document.querySelectorAll('.interface-group').forEach(group => {
            const interfaceType = group.querySelector('.routerInterfaceType').value;
            const interfaceSlot = group.querySelector('.routerInterfaceSlot').value;
            const interfaceSubSlot = group.querySelector('.routerInterfaceSubSlot').value;
            const interfacePort = group.querySelector('.routerInterfacePort').value;
            const loopbackNumber = group.querySelector('.routerLoopbackNumber')?.value;
            const ipAddress = group.querySelector('.routerIPAddress').value;
            const subnetMask = group.querySelector('.routerSubnetMask').value;
            const description = group.querySelector('.routerDescription').value;

            if (interfaceType) {
                // Handle different interface formats based on type
                let interfaceName;
                if (interfaceType === 'Loopback') {
                    interfaceName = `${interfaceType}${loopbackNumber}`;
                } else if (interfaceType === 'Serial') {
                    interfaceName = `${interfaceType}${interfaceSlot}/${interfaceSubSlot}${interfacePort ? `/${interfacePort}` : ''}`;
                } else {
                    // For GigabitEthernet and FastEthernet, use the three-part format
                    interfaceName = `${interfaceType}${interfaceSlot}/${interfaceSubSlot}${interfacePort ? `/${interfacePort}` : ''}`;
                }

                config += `\ninterface ${interfaceName}`;
                if (ipAddress && subnetMask) {
                    config += `\nip address ${ipAddress} ${subnetMask}`;
                }
                if (description) {
                    config += `\ndescription ${description}`;
                }
                config += `\nno shutdown\nexit\n!`;
            }
        });

        config += `\n! Routing Configuration
${routerDefaultGateway.value ? `ip default-gateway ${routerDefaultGateway.value}` : ''}
${routerStaticRoute.value ? `ip route ${routerStaticRoute.value}` : ''}
!
! Services Configuration
${routerNTP.value ? `ntp server ${routerNTP.value}` : ''}
${routerSNMP.value ? `snmp-server community ${routerSNMP.value} RO` : ''}
${routerSyslog.value ? `logging ${routerSyslog.value}` : ''}
!
end
write memory`;

        return config;
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