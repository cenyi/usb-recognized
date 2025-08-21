import React from 'react';
import PropTypes from 'prop-types';
import StepByStepGuide from './StepByStepGuide';
import { Terminal, FileCode, AlertTriangle, Settings } from 'lucide-react';

/**
 * Linux-specific USB troubleshooting guide component
 */
const LinuxTroubleshootingGuide = ({ className }) => {
  // Command line diagnosis steps
  const commandLineDiagnosisSteps = [
    {
      step: 1,
      title: 'Check USB Device Detection',
      instruction: 'Open terminal and run the lsusb command',
      command: 'lsusb',
      expectedOutput: 'Bus 001 Device 002: ID 8087:0024 Intel Corp. Integrated Rate Matching Hub\nBus 001 Device 001: ID 1d6b:0002 Linux Foundation 2.0 root hub',
      tips: [
        'This lists all USB devices connected to your system',
        'Look for your device in the list - note the ID in format "vendor:product"',
        'If your device is not listed, it\'s not being detected at the hardware level'
      ]
    },
    {
      step: 2,
      title: 'Get Detailed USB Information',
      instruction: 'Run lsusb with verbose output for more details',
      command: 'lsusb -v | less',
      tips: [
        'Press space to scroll down, q to exit',
        'Look for "Device Descriptor" sections for each device',
        'Check for error messages or "can\'t get device descriptor" errors'
      ]
    },
    {
      step: 3,
      title: 'Monitor USB Events',
      instruction: 'Watch USB events in real-time as you connect/disconnect devices',
      command: 'sudo dmesg -w | grep -i usb',
      tips: [
        'You\'ll need to enter your password for sudo',
        'Connect or disconnect your USB device and watch for messages',
        'Look for errors like "device descriptor read/64, error -110"'
      ]
    },
    {
      step: 4,
      title: 'Check USB Storage Devices',
      instruction: 'If your device is a storage device, check if it\'s recognized as a disk',
      command: 'sudo fdisk -l',
      tips: [
        'Look for devices like /dev/sdb, /dev/sdc, etc.',
        'If your device appears here but isn\'t mounted, it\'s detected but not accessible'
      ]
    },
    {
      step: 5,
      title: 'Check USB Power Status',
      instruction: 'Check if your USB ports are providing enough power',
      command: 'for i in /sys/bus/usb/devices/*/power/control; do echo "$i: $(cat $i)"; done',
      tips: [
        'Look for "on" vs "auto" - "on" means the port is always powered',
        'If most ports are set to "auto", they might be turning off to save power'
      ]
    }
  ];
  
  // udev rules steps
  const udevRulesSteps = [
    {
      step: 1,
      title: 'Identify Your Device',
      instruction: 'First, find your device\'s vendor and product ID',
      command: 'lsusb',
      tips: [
        'Look for your device in the list and note the ID (e.g., ID 1234:5678)',
        'The first four digits are the vendor ID, the last four are the product ID'
      ]
    },
    {
      step: 2,
      title: 'Create a udev Rule File',
      instruction: 'Create a new rule file in the udev rules directory',
      command: 'sudo nano /etc/udev/rules.d/99-usb-device.rules',
      tips: [
        'The "99" prefix determines the order in which rules are applied (higher numbers run later)',
        'You can use any text editor instead of nano (e.g., vim, gedit)'
      ]
    },
    {
      step: 3,
      title: 'Add Device Rule',
      instruction: 'Add a rule for your specific device (replace vendor/product IDs with yours)',
      command: 'SUBSYSTEM=="usb", ATTR{idVendor}=="1234", ATTR{idProduct}=="5678", MODE="0666", GROUP="plugdev"',
      tips: [
        'MODE="0666" gives read/write permissions to all users',
        'GROUP="plugdev" assigns the device to the plugdev group',
        'You can add TAG+="uaccess" to allow access for the currently logged-in user'
      ]
    },
    {
      step: 4,
      title: 'Save and Exit',
      instruction: 'In nano, press Ctrl+O to save, then Ctrl+X to exit',
      tips: [
        'Make sure to save the file with the correct name and path'
      ]
    },
    {
      step: 5,
      title: 'Reload udev Rules',
      instruction: 'Apply the new rules without rebooting',
      command: 'sudo udevadm control --reload-rules && sudo udevadm trigger',
      tips: [
        'This reloads all rules and applies them to existing devices',
        'Disconnect and reconnect your USB device to ensure the new rules are applied'
      ]
    }
  ];
  
  // Kernel module steps
  const kernelModuleSteps = [
    {
      step: 1,
      title: 'Check Loaded USB Modules',
      instruction: 'List all currently loaded USB-related kernel modules',
      command: 'lsmod | grep -i usb',
      tips: [
        'This shows which USB drivers are currently active',
        'Common modules include usbcore, usb_storage, xhci_hcd, etc.'
      ]
    },
    {
      step: 2,
      title: 'Unload and Reload USB Storage Module',
      instruction: 'If your device is a storage device, try reloading the usb_storage module',
      command: 'sudo modprobe -r usb_storage && sudo modprobe usb_storage',
      tips: [
        'This unloads and reloads the USB storage driver',
        'Only do this if no USB storage devices are in use'
      ]
    },
    {
      step: 3,
      title: 'Reset USB Controller',
      instruction: 'For more persistent issues, try resetting the USB controller',
      command: 'sudo sh -c "echo 0 > /sys/bus/pci/drivers/xhci_hcd/unbind" && sudo sh -c "echo 0 > /sys/bus/pci/drivers/xhci_hcd/bind"',
      tips: [
        'This completely resets the USB controller',
        'All USB devices will disconnect and reconnect',
        'The exact path may vary depending on your system - use lspci to find your USB controller'
      ]
    },
    {
      step: 4,
      title: 'Check for Missing Firmware',
      instruction: 'Some USB devices require additional firmware',
      command: 'dmesg | grep -i firmware',
      tips: [
        'Look for messages like "firmware: failed to load"',
        'If found, you may need to install firmware packages for your distribution'
      ]
    }
  ];
  
  // Distribution-specific steps
  const distroSpecificSteps = [
    {
      step: 1,
      title: 'Ubuntu/Debian',
      instruction: 'Install USB utilities and firmware',
      command: 'sudo apt update && sudo apt install usbutils linux-firmware',
      tips: [
        'usbutils provides commands like lsusb',
        'linux-firmware includes firmware for many devices'
      ]
    },
    {
      step: 2,
      title: 'Fedora/RHEL/CentOS',
      instruction: 'Install USB utilities and firmware',
      command: 'sudo dnf install usbutils linux-firmware',
      tips: [
        'For older versions, use "yum" instead of "dnf"'
      ]
    },
    {
      step: 3,
      title: 'Arch Linux',
      instruction: 'Install USB utilities and firmware',
      command: 'sudo pacman -S usbutils linux-firmware',
      tips: [
        'You may also want to install "udiskie" for automatic mounting of USB drives'
      ]
    },
    {
      step: 4,
      title: 'Add User to Required Groups',
      instruction: 'Add your user to groups needed for USB access',
      command: 'sudo usermod -aG plugdev,dialout $USER',
      tips: [
        'You\'ll need to log out and back in for group changes to take effect',
        '"plugdev" is for general USB devices',
        '"dialout" is for serial devices like Arduino'
      ]
    }
  ];
  
  return (
    <div className={`space-y-8 ${className || ''}`} id="linux-guide">
      <h2 className="text-2xl font-bold mb-4">Linux USB Troubleshooting</h2>
      
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg mb-6">
        <h3 className="text-lg font-semibold text-yellow-800 mb-2 flex items-center">
          <AlertTriangle className="mr-2" size={20} />
          Distribution Differences
        </h3>
        <p className="text-yellow-800">
          Linux distributions may have different tools and package names. Commands below are general and may need adjustment for your specific distribution.
        </p>
      </div>
      
      <div className="grid gap-8 md:grid-cols-2">
        {/* Command Line Diagnosis Section */}
        <div>
          <div className="flex items-center mb-3">
            <Terminal className="mr-2 text-green-600" size={20} />
            <h3 className="text-xl font-semibold" id="linux-command-line">Command Line Diagnosis</h3>
          </div>
          
          <StepByStepGuide
            steps={commandLineDiagnosisSteps}
            description="Diagnose USB issues using Linux command line tools"
            difficulty="intermediate"
            successRate={85}
            timeRequired="5-10 minutes"
          />
        </div>
        
        {/* udev Rules Section */}
        <div>
          <div className="flex items-center mb-3">
            <FileCode className="mr-2 text-blue-600" size={20} />
            <h3 className="text-xl font-semibold" id="linux-udev-rules">udev Rules</h3>
          </div>
          
          <StepByStepGuide
            steps={udevRulesSteps}
            description="Create custom rules for USB device permissions"
            difficulty="advanced"
            successRate={75}
            timeRequired="10-15 minutes"
          />
        </div>
      </div>
      
      <div className="grid gap-8 md:grid-cols-2 mt-8">
        {/* Kernel Module Section */}
        <div>
          <div className="flex items-center mb-3">
            <Settings className="mr-2 text-red-600" size={20} />
            <h3 className="text-xl font-semibold" id="linux-kernel-modules">Kernel Module Management</h3>
          </div>
          
          <StepByStepGuide
            steps={kernelModuleSteps}
            description="Manage USB-related kernel modules"
            difficulty="advanced"
            successRate={65}
            timeRequired="5-10 minutes"
          />
        </div>
        
        {/* Distribution-Specific Section */}
        <div>
          <div className="flex items-center mb-3">
            <Terminal className="mr-2 text-purple-600" size={20} />
            <h3 className="text-xl font-semibold" id="linux-distro-specific">Distribution-Specific Solutions</h3>
          </div>
          
          <StepByStepGuide
            steps={distroSpecificSteps}
            description="Solutions for specific Linux distributions"
            difficulty="intermediate"
            successRate={80}
            timeRequired="5-10 minutes"
          />
        </div>
      </div>
    </div>
  );
};

LinuxTroubleshootingGuide.propTypes = {
  className: PropTypes.string
};

export default LinuxTroubleshootingGuide;