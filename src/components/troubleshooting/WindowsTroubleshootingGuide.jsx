import React from 'react';
import PropTypes from 'prop-types';
import StepByStepGuide from './StepByStepGuide';
import { AlertTriangle, Terminal, Settings, Database } from 'lucide-react';

/**
 * Windows-specific USB troubleshooting guide component
 */
const WindowsTroubleshootingGuide = ({ className }) => {
  // Device Manager troubleshooting steps
  const deviceManagerSteps = [
    {
      step: 1,
      title: 'Open Device Manager',
      instruction: 'Press Windows + X and select "Device Manager"',
      tips: [
        'You can also search for "Device Manager" in the Start menu',
        'Or right-click on "This PC" and select "Manage", then "Device Manager"'
      ],
      links: [
        {
          title: 'Microsoft Support: Device Manager',
          url: 'https://support.microsoft.com/en-us/windows/device-manager-open-properties-c776bec3-8e63-7078-0f50-0c1da4c5ca84'
        }
      ]
    },
    {
      step: 2,
      title: 'Locate USB Controllers',
      instruction: 'Expand "Universal Serial Bus controllers" section',
      tips: [
        'Look for devices with yellow warning triangles',
        'If you don\'t see "Universal Serial Bus controllers", your USB controllers might not be detected at all'
      ]
    },
    {
      step: 3,
      title: 'Check for Problem Devices',
      instruction: 'Look for devices with yellow warning icons or "Unknown Device" entries',
      tips: [
        'Yellow icons indicate driver problems',
        'Unknown devices may need drivers installed'
      ]
    },
    {
      step: 4,
      title: 'Update USB Drivers',
      instruction: 'Right-click each USB controller and select "Update driver"',
      tips: [
        'Try "Search automatically for drivers" first',
        'If that doesn\'t work, visit your computer manufacturer\'s website for specific drivers'
      ]
    },
    {
      step: 5,
      title: 'Uninstall and Reinstall USB Controllers',
      instruction: 'If updating doesn\'t work, right-click and select "Uninstall device"',
      tips: [
        'Check "Delete the driver software for this device" if available',
        'After uninstalling, restart your computer - Windows will reinstall drivers automatically'
      ]
    }
  ];
  
  // Power management troubleshooting steps
  const powerManagementSteps = [
    {
      step: 1,
      title: 'Open Power Options',
      instruction: 'Go to Control Panel → Hardware and Sound → Power Options',
      tips: [
        'You can also press Windows + R, type "powercfg.cpl" and press Enter',
        'In Windows 11, you can go to Settings → System → Power & battery'
      ]
    },
    {
      step: 2,
      title: 'Change Plan Settings',
      instruction: 'Click "Change plan settings" for your active power plan'
    },
    {
      step: 3,
      title: 'Access Advanced Power Settings',
      instruction: 'Click "Change advanced power settings"'
    },
    {
      step: 4,
      title: 'Disable USB Selective Suspend',
      instruction: 'Find "USB settings" → "USB selective suspend setting" → Set to "Disabled"',
      tips: [
        'Do this for both "On battery" and "Plugged in" if you\'re on a laptop',
        'This prevents Windows from turning off USB ports to save power'
      ]
    },
    {
      step: 5,
      title: 'Apply Changes and Restart',
      instruction: 'Click "Apply" and "OK", then restart your computer',
      tips: [
        'After restart, try connecting your USB device again'
      ]
    }
  ];
  
  // Registry fixes
  const registryFixSteps = [
    {
      step: 1,
      title: 'Create Registry Backup',
      instruction: 'Before making registry changes, create a backup',
      command: 'regedit',
      tips: [
        'In Registry Editor, go to File → Export',
        'Save the backup file in a safe location',
        'WARNING: Incorrect registry changes can cause system problems'
      ]
    },
    {
      step: 2,
      title: 'Open Registry Editor',
      instruction: 'Press Windows + R, type "regedit" and press Enter',
      tips: [
        'You need administrator privileges to edit the registry'
      ]
    },
    {
      step: 3,
      title: 'Navigate to USB Parameters',
      instruction: 'Go to HKEY_LOCAL_MACHINE\\SYSTEM\\CurrentControlSet\\Control\\UsbFlags',
      tips: [
        'You can copy and paste this path into the address bar in Registry Editor',
        'If the UsbFlags key doesn\'t exist, you may need to create it'
      ]
    },
    {
      step: 4,
      title: 'Reset USB Port Power Values',
      instruction: 'Look for entries with "IgnoreHWSerNum" in their names',
      tips: [
        'Delete these entries if they exist',
        'This can help with USB devices that aren\'t being recognized properly'
      ]
    },
    {
      step: 5,
      title: 'Restart Computer',
      instruction: 'Close Registry Editor and restart your computer',
      tips: [
        'After restart, try connecting your USB device again'
      ]
    }
  ];
  
  // Command line tools
  const commandLineSteps = [
    {
      step: 1,
      title: 'Open Command Prompt as Administrator',
      instruction: 'Right-click Start menu and select "Command Prompt (Admin)" or "Windows PowerShell (Admin)"',
      tips: [
        'You need administrator privileges to run these commands'
      ]
    },
    {
      step: 2,
      title: 'Reset USB Controllers',
      instruction: 'Run the following command to restart the USB controller service',
      command: 'sc stop usbstor && sc start usbstor',
      expectedOutput: 'SERVICE_NAME: usbstor\r\n        TYPE               : 1  KERNEL_DRIVER\r\n        STATE              : 3  STARTED',
      tips: [
        'This stops and restarts the USB storage driver'
      ]
    },
    {
      step: 3,
      title: 'Run USB Troubleshooter',
      instruction: 'Run the built-in hardware troubleshooter',
      command: 'msdt.exe -id DeviceDiagnostic',
      tips: [
        'Follow the on-screen instructions in the troubleshooter',
        'Select "Hardware and Devices" when prompted'
      ]
    },
    {
      step: 4,
      title: 'Check USB Device Status',
      instruction: 'List all USB devices and their status',
      command: 'powershell "Get-PnpDevice -Class USB | Format-Table -AutoSize"',
      expectedOutput: 'Status Class Description DeviceID\r\n------ ----- ----------- --------\r\nOK USB USB Root Hub (USB 3.0) USB\\ROOT_HUB30...',
      tips: [
        'Look for devices with status other than "OK"',
        'Note the DeviceID of problematic devices for further troubleshooting'
      ]
    }
  ];
  
  return (
    <div className={`space-y-8 ${className || ''}`} id="windows-guide">
      <h2 className="text-2xl font-bold mb-4">Windows USB Troubleshooting</h2>
      
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg mb-6">
        <h3 className="text-lg font-semibold text-blue-800 mb-2 flex items-center">
          <AlertTriangle className="mr-2" size={20} />
          Before You Start
        </h3>
        <p className="text-blue-800">
          Try these quick fixes first: restart your computer, try a different USB port, and test with another USB cable if available.
        </p>
      </div>
      
      <div className="grid gap-8 md:grid-cols-2">
        {/* Device Manager Section */}
        <div>
          <div className="flex items-center mb-3">
            <Settings className="mr-2 text-blue-600" size={20} />
            <h3 className="text-xl font-semibold" id="windows-device-manager">Device Manager Solutions</h3>
          </div>
          
          <StepByStepGuide
            steps={deviceManagerSteps}
            description="Fix USB issues using Windows Device Manager"
            difficulty="beginner"
            successRate={75}
            timeRequired="5-10 minutes"
          />
        </div>
        
        {/* Power Management Section */}
        <div>
          <div className="flex items-center mb-3">
            <Settings className="mr-2 text-blue-600" size={20} />
            <h3 className="text-xl font-semibold" id="windows-power-management">Power Management Fixes</h3>
          </div>
          
          <StepByStepGuide
            steps={powerManagementSteps}
            description="Adjust power settings to prevent USB disconnection issues"
            difficulty="beginner"
            successRate={65}
            timeRequired="3-5 minutes"
          />
        </div>
      </div>
      
      <div className="grid gap-8 md:grid-cols-2 mt-8">
        {/* Registry Fixes Section */}
        <div>
          <div className="flex items-center mb-3">
            <Database className="mr-2 text-red-600" size={20} />
            <h3 className="text-xl font-semibold" id="windows-registry">Registry Fixes</h3>
          </div>
          
          <StepByStepGuide
            steps={registryFixSteps}
            description="Advanced registry modifications to fix persistent USB issues"
            difficulty="advanced"
            successRate={55}
            timeRequired="10-15 minutes"
          />
        </div>
        
        {/* Command Line Tools Section */}
        <div>
          <div className="flex items-center mb-3">
            <Terminal className="mr-2 text-gray-800" size={20} />
            <h3 className="text-xl font-semibold" id="windows-command-line">Command Line Tools</h3>
          </div>
          
          <StepByStepGuide
            steps={commandLineSteps}
            description="Use command line tools to diagnose and fix USB problems"
            difficulty="intermediate"
            successRate={70}
            timeRequired="5-10 minutes"
          />
        </div>
      </div>
    </div>
  );
};

WindowsTroubleshootingGuide.propTypes = {
  className: PropTypes.string
};

export default WindowsTroubleshootingGuide;