# SSemblr - Cisco CLI Command Assembler

A web-based tool to help network engineers and students create Cisco CLI commands with ease. SSemblr provides a user-friendly interface for generating common Cisco commands, with a focus on Access Control Lists (ACLs).

## Features

- **Modular Command Generation**: Create Cisco CLI commands through an intuitive interface
- **ACL Configuration**: Generate both Standard and Extended ACLs
- **Smart Wildcard Calculation**: Automatically convert subnet masks to wildcard masks
- **Multiple Command Types**:
  - Interface Configuration
  - Routing (Static, RIP, OSPF)
  - Security (ACLs, NAT)
  - VLAN Configuration
- **Copy to Clipboard**: One-click copy of generated commands
- **Responsive Design**: Works on both desktop and mobile devices

## Usage

1. Select the type of command you want to generate from the dropdown menu
2. Fill in the required parameters
3. For ACL configurations:
   - Enter the subnet mask and click "Calculate" to get the wildcard mask
   - For Extended ACLs, specify protocol and optional port numbers
4. Copy the generated command using the "Copy Command" button
5. Paste the command into your Cisco device's CLI

## Command Types

### ACL Configuration
- Standard ACLs: Filter based on source IP
- Extended ACLs: Filter based on source/destination IP, protocol, and port

### Interface Configuration
- Configure IP addresses
- Enable/disable interfaces
- Set interface descriptions

### Routing
- Static routes
- RIP configuration
- OSPF configuration

### VLAN Configuration
- Create/delete VLANs
- Assign VLAN names

## Technologies Used

- HTML5
- CSS3
- JavaScript (Vanilla)
- Git for version control

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/jdotjpeg/ssemblr.git
   ```

2. Open `index.html` in your web browser

3. Start generating Cisco CLI commands!

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Author

- **jdotjpeg** - [GitHub Profile](https://github.com/jdotjpeg)

## Acknowledgments

- Inspired by the need for a simple, web-based Cisco CLI command generator
- Built to help network engineers and students learn Cisco CLI commands
