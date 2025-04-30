document.addEventListener('DOMContentLoaded', () => {
    const commandType = document.getElementById('commandType');
    const commandOptions = document.getElementById('commandOptions');
    const generatedCommand = document.getElementById('generatedCommand');
    const copyButton = document.getElementById('copyCommand');

    // Function to convert subnet mask to wildcard mask
    function subnetToWildcard(subnetMask) {
        if (!subnetMask) return '';
        
        // Split the subnet mask into octets
        const octets = subnetMask.split('.');
        if (octets.length !== 4) return subnetMask;
        
        // Convert each octet to wildcard
        const wildcardOctets = octets.map(octet => {
            const num = parseInt(octet);
            if (isNaN(num) || num < 0 || num > 255) return octet;
            return (255 - num).toString();
        });
        
        return wildcardOctets.join('.');
    }

    // Command templates and options
    const commandTemplates = {
        interface: {
            options: [
                { type: 'select', id: 'interfaceType', label: 'Interface Type', options: ['GigabitEthernet', 'FastEthernet', 'Serial', 'Loopback'] },
                { type: 'text', id: 'interfaceNumber', label: 'Interface Number', placeholder: 'Enter interface number' },
                { type: 'select', id: 'operation', label: 'Operation', options: ['configure', 'shutdown', 'no shutdown'] },
                { type: 'text', id: 'ipAddress', label: 'IP Address (optional)' },
                { type: 'text', id: 'subnetMask', label: 'Subnet Mask (optional)' }
            ],
            generate: (values) => {
                let command = `interface ${values.interfaceType}${values.interfaceNumber}\n`;
                if (values.operation === 'configure') {
                    if (values.ipAddress && values.subnetMask) {
                        command += `ip address ${values.ipAddress} ${values.subnetMask}\n`;
                    }
                } else {
                    command += `${values.operation}\n`;
                }
                return command;
            }
        },
        routing: {
            options: [
                { type: 'select', id: 'protocol', label: 'Routing Protocol', options: ['static', 'rip', 'ospf'] },
                { type: 'text', id: 'network', label: 'Network Address' },
                { type: 'text', id: 'mask', label: 'Subnet Mask' },
                { type: 'text', id: 'nextHop', label: 'Next Hop IP' }
            ],
            generate: (values) => {
                if (values.protocol === 'static') {
                    return `ip route ${values.network} ${values.mask} ${values.nextHop}`;
                }
                return `router ${values.protocol}\nnetwork ${values.network} ${values.mask}`;
            }
        },
        security: {
            options: [
                { type: 'select', id: 'securityType', label: 'Security Type', options: ['access-list', 'nat'] },
                { type: 'text', id: 'aclNumber', label: 'ACL Number' },
                { type: 'select', id: 'action', label: 'Action', options: ['permit', 'deny'] },
                { type: 'text', id: 'source', label: 'Source IP' },
                { type: 'text', id: 'wildcard', label: 'Wildcard Mask' }
            ],
            generate: (values) => {
                if (values.securityType === 'access-list') {
                    return `access-list ${values.aclNumber} ${values.action} ${values.source} ${values.wildcard}`;
                }
                return `ip nat inside source static ${values.source} ${values.wildcard}`;
            }
        },
        vlan: {
            options: [
                { type: 'text', id: 'vlanNumbers', label: 'VLAN Numbers (comma-separated)' },
                { type: 'text', id: 'vlanNames', label: 'VLAN Names (comma-separated)' },
                { type: 'select', id: 'operation', label: 'Operation', options: ['create', 'delete'] }
            ],
            generate: (values) => {
                const vlanNumbers = values.vlanNumbers.split(',').map(num => num.trim());
                const vlanNames = values.vlanNames.split(',').map(name => name.trim());
                let command = '';
                vlanNumbers.forEach((vlanNumber, index) => {
                    if (values.operation === 'create') {
                        command += `vlan ${vlanNumber}\n`;
                        if (vlanNames[index]) {
                            command += `name ${vlanNames[index]}\n`;
                        }
                    } else {
                        command += `no vlan ${vlanNumber}\n`;
                    }
                });
                return command.trim();
            }
        },
        acl: {
            options: [
                { type: 'select', id: 'aclType', label: 'ACL Type', options: ['standard', 'extended'] },
                { type: 'text', id: 'aclNumber', label: 'ACL Number' },
                { type: 'select', id: 'action', label: 'Action', options: ['permit', 'deny'] },
                { type: 'text', id: 'source', label: 'Source IP' },
                { type: 'text', id: 'sourceWildcard', label: 'Source Subnet Mask' },
                { type: 'text', id: 'destination', label: 'Destination IP (Extended ACL only)' },
                { type: 'text', id: 'destinationWildcard', label: 'Destination Subnet Mask (Extended ACL only)' },
                { type: 'select', id: 'protocol', label: 'Protocol (Extended ACL only)', options: ['ip', 'tcp', 'udp', 'icmp'] },
                { type: 'text', id: 'port', label: 'Port/Service (Extended ACL only)' }
            ],
            generate: (values) => {
                let command = '';
                if (values.aclType === 'standard') {
                    // Standard ACL format: access-list <number> <permit|deny> <source> <wildcard>
                    command = `access-list ${values.aclNumber} ${values.action} ${values.source} ${values.sourceWildcard}`;
                } else {
                    // Extended ACL format: access-list <number> <permit|deny> <protocol> <source> <wildcard> [<destination> <wildcard>] [eq <port>]
                    command = `access-list ${values.aclNumber} ${values.action} ${values.protocol} ${values.source} ${values.sourceWildcard}`;
                    
                    // Add destination if provided
                    if (values.destination && values.destinationWildcard) {
                        command += ` ${values.destination} ${values.destinationWildcard}`;
                    }
                    
                    // Add port if provided and protocol is tcp/udp
                    if (values.port && (values.protocol === 'tcp' || values.protocol === 'udp')) {
                        command += ` eq ${values.port}`;
                    }
                }
                return command;
            }
        }
    };

    // Generate options based on selected command type
    commandType.addEventListener('change', () => {
        const selectedType = commandType.value;
        commandOptions.innerHTML = '';
        
        if (selectedType && commandTemplates[selectedType]) {
            const options = commandTemplates[selectedType].options;
            
            options.forEach(option => {
                const optionGroup = document.createElement('div');
                optionGroup.className = 'option-group';
                
                const label = document.createElement('label');
                label.htmlFor = option.id;
                label.textContent = option.label;
                
                let input;
                if (option.type === 'select') {
                    input = document.createElement('select');
                    input.id = option.id;
                    option.options.forEach(opt => {
                        const optionElement = document.createElement('option');
                        optionElement.value = opt;
                        optionElement.textContent = opt;
                        input.appendChild(optionElement);
                    });
                } else {
                    input = document.createElement('input');
                    input.type = option.type;
                    input.id = option.id;
                    
                    // Add placeholder for subnet mask fields
                    if (option.id.includes('Wildcard')) {
                        input.placeholder = 'Enter subnet mask (e.g., 255.255.255.0)';
                        
                        // Create calculate button
                        const calculateButton = document.createElement('button');
                        calculateButton.type = 'button';
                        calculateButton.className = 'calculate-button';
                        calculateButton.textContent = 'Calculate';
                        
                        // Add click event to calculate wildcard mask
                        calculateButton.addEventListener('click', () => {
                            const wildcardMask = subnetToWildcard(input.value);
                            if (wildcardMask !== input.value) {
                                input.value = wildcardMask;
                                updateCommand();
                            }
                        });
                        
                        // Create container for input and button
                        const inputContainer = document.createElement('div');
                        inputContainer.className = 'input-with-button';
                        inputContainer.appendChild(input);
                        inputContainer.appendChild(calculateButton);
                        
                        optionGroup.appendChild(label);
                        optionGroup.appendChild(inputContainer);
                        commandOptions.appendChild(optionGroup);
                        return;
                    }
                }
                
                optionGroup.appendChild(label);
                optionGroup.appendChild(input);
                commandOptions.appendChild(optionGroup);
                
                // Add event listener to update command when input changes
                input.addEventListener('input', updateCommand);
            });
            
            updateCommand();
        }
    });

    // Update the generated command
    function updateCommand() {
        const selectedType = commandType.value;
        if (selectedType && commandTemplates[selectedType]) {
            const values = {};
            commandTemplates[selectedType].options.forEach(option => {
                const input = document.getElementById(option.id);
                if (input) {
                    values[option.id] = input.value;
                    // Set placeholder for Loopback interface
                    if (option.id === 'interfaceNumber' && values['interfaceType'] === 'Loopback') {
                        input.placeholder = '1-65535';
                    } else if (option.id === 'interfaceNumber') {
                        input.placeholder = 'Enter interface number';
                    }
                }
            });
            generatedCommand.value = commandTemplates[selectedType].generate(values);
        } else {
            generatedCommand.value = '';
        }
    }

    // Copy command to clipboard
    copyButton.addEventListener('click', () => {
        generatedCommand.select();
        document.execCommand('copy');
        copyButton.textContent = 'Copied!';
        setTimeout(() => {
            copyButton.textContent = 'Copy Command';
        }, 2000);
    });
}); 