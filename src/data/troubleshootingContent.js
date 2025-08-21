/**
 * Comprehensive USB Troubleshooting Content Data
 * Based on Google search insights and common USB recognition issues
 */

// Quick solutions that work for most common issues
export const quickSolutions = [
  {
    id: 'basic-checks',
    title: 'Basic Connection Checks',
    description: 'Simple steps that resolve 70% of USB recognition issues',
    steps: [
      'Try a different USB port (preferably USB 3.0)',
      'Test with another USB cable if available',
      'Restart your computer and reconnect the device',
      'Check if the device works on another computer',
      'Clean the USB port and connector with compressed air'
    ],
    successRate: 70,
    timeRequired: '2-5 minutes',
    difficulty: 'beginner',
    platforms: ['windows', 'mac', 'linux'],
    keywords: ['usb not recognized', 'usb device not working', 'basic usb troubleshooting']
  },
  {
    id: 'power-cycle',
    title: 'Power Cycle and Reset',
    description: 'Reset USB controllers and power management',
    steps: [
      'Shut down your computer completely',
      'Unplug the power cable for 30 seconds',
      'For laptops, remove the battery if possible',
      'Hold the power button for 15 seconds',
      'Reconnect power and start the computer',
      'Try connecting your USB device again'
    ],
    successRate: 45,
    timeRequired: '3-7 minutes',
    difficulty: 'beginner',
    platforms: ['windows', 'mac', 'linux'],
    keywords: ['usb power issues', 'usb controller reset', 'hardware reset']
  },
  {
    id: 'driver-update',
    title: 'Update USB Drivers',
    description: 'Ensure you have the latest USB drivers installed',
    steps: [
      'Open Device Manager (Windows) or System Information (Mac)',
      'Look for devices with yellow warning signs',
      'Right-click and select "Update driver"',
      'Choose "Search automatically for drivers"',
      'Restart your computer after updates complete'
    ],
    successRate: 60,
    timeRequired: '5-15 minutes',
    difficulty: 'intermediate',
    platforms: ['windows', 'mac'],
    keywords: ['usb driver issues', 'device manager', 'driver update']
  }
];

// Platform-specific troubleshooting guides
export const platformGuides = {
  windows: {
    name: 'Windows USB Troubleshooting',
    versions: ['Windows 11', 'Windows 10', 'Windows 8.1', 'Windows 7'],
    solutions: [
      {
        id: 'device-manager-fix',
        category: 'Device Manager Solutions',
        title: 'Fix USB Issues in Device Manager',
        description: 'Resolve USB recognition problems using Windows Device Manager',
        steps: [
          'Press Windows + X and select "Device Manager"',
          'Expand "Universal Serial Bus controllers"',
          'Look for devices with yellow warning triangles',
          'Right-click problematic devices and select "Uninstall device"',
          'Restart your computer to reinstall drivers automatically',
          'If issues persist, right-click and "Update driver"'
        ],
        screenshots: [
          '/images/windows-device-manager.png',
          '/images/usb-controllers-expanded.png'
        ],
        registryEdits: [
          {
            warning: 'Editing registry can be dangerous. Create a backup first.',
            path: 'HKEY_LOCAL_MACHINE\\SYSTEM\\CurrentControlSet\\Enum\\USB',
            action: 'Delete problematic device entries'
          }
        ],
        successRate: 75,
        difficulty: 'intermediate',
        keywords: ['windows device manager', 'usb controller', 'driver reinstall']
      },
      {
        id: 'power-management',
        category: 'Power Management',
        title: 'Disable USB Selective Suspend',
        description: 'Prevent Windows from turning off USB devices to save power',
        steps: [
          'Open Control Panel > Power Options',
          'Click "Change plan settings" for your active plan',
          'Click "Change advanced power settings"',
          'Expand "USB settings" > "USB selective suspend setting"',
          'Set both "On battery" and "Plugged in" to "Disabled"',
          'Click OK and restart your computer'
        ],
        alternativeSteps: [
          'Press Windows + R, type "powercfg.cpl"',
          'Follow steps 2-6 above'
        ],
        successRate: 55,
        difficulty: 'intermediate',
        keywords: ['usb selective suspend', 'power management', 'usb power issues']
      },
      {
        id: 'registry-fixes',
        category: 'Advanced Registry Solutions',
        title: 'Registry Fixes for USB Issues',
        description: 'Advanced registry modifications for persistent USB problems',
        warning: 'These solutions require administrator privileges and registry editing. Create a system restore point first.',
        solutions: [
          {
            issue: 'USB ports not working after Windows update',
            registryPath: 'HKEY_LOCAL_MACHINE\\SYSTEM\\CurrentControlSet\\Services\\usbhub',
            modification: 'Change Start value from 4 to 3',
            steps: [
              'Press Windows + R, type "regedit"',
              'Navigate to the registry path above',
              'Double-click "Start" and change value to 3',
              'Restart computer'
            ]
          }
        ],
        successRate: 40,
        difficulty: 'advanced',
        keywords: ['windows registry', 'usb registry fix', 'advanced troubleshooting']
      }
    ]
  },
  
  mac: {
    name: 'macOS USB Troubleshooting',
    versions: ['macOS Ventura', 'macOS Monterey', 'macOS Big Sur', 'macOS Catalina'],
    solutions: [
      {
        id: 'smc-reset',
        category: 'System Management Controller',
        title: 'Reset SMC (System Management Controller)',
        description: 'Reset the SMC to fix USB power and recognition issues',
        steps: [
          'Shut down your Mac completely',
          'For MacBooks: Press Shift-Control-Option on left side + power button for 10 seconds',
          'For iMacs: Unplug power cord for 15 seconds, then plug back in',
          'Wait 5 seconds, then press power button to start',
          'Test your USB device'
        ],
        deviceSpecific: {
          'MacBook Pro (2016+)': 'Use Touch ID button instead of power button',
          'MacBook Air (2018+)': 'Same as MacBook Pro 2016+',
          'Mac Studio/Mac Pro': 'Hold power button for 10 seconds while unplugged'
        },
        successRate: 65,
        difficulty: 'beginner',
        keywords: ['mac smc reset', 'macbook usb issues', 'system management controller']
      },
      {
        id: 'nvram-reset',
        category: 'NVRAM/PRAM Reset',
        title: 'Reset NVRAM/PRAM',
        description: 'Clear system settings that might interfere with USB recognition',
        steps: [
          'Shut down your Mac',
          'Press power button, immediately hold Option-Command-P-R',
          'Keep holding until you hear startup sound twice (or see Apple logo twice)',
          'Release keys and let Mac start normally',
          'Test USB device connection'
        ],
        successRate: 45,
        difficulty: 'beginner',
        keywords: ['mac nvram reset', 'pram reset', 'mac startup issues']
      },
      {
        id: 'system-preferences',
        category: 'System Preferences',
        title: 'Check Security & Privacy Settings',
        description: 'Ensure USB devices are allowed in system security settings',
        steps: [
          'Open System Preferences > Security & Privacy',
          'Click the "Privacy" tab',
          'Select "Full Disk Access" from the left sidebar',
          'Check if your USB device or related software is listed',
          'If not, click the "+" button to add it',
          'Restart and test the connection'
        ],
        macOSVersions: {
          'macOS Ventura+': 'Privacy & Security in System Settings',
          'macOS Monterey and earlier': 'Security & Privacy in System Preferences'
        },
        successRate: 50,
        difficulty: 'intermediate',
        keywords: ['mac security settings', 'privacy settings', 'full disk access']
      }
    ]
  },
  
  linux: {
    name: 'Linux USB Troubleshooting',
    distributions: ['Ubuntu', 'Fedora', 'Debian', 'Arch Linux', 'CentOS'],
    solutions: [
      {
        id: 'lsusb-diagnosis',
        category: 'Command Line Diagnosis',
        title: 'Diagnose USB Issues with lsusb',
        description: 'Use command line tools to identify USB recognition problems',
        steps: [
          'Open terminal (Ctrl+Alt+T)',
          'Run "lsusb" to list all USB devices',
          'Connect your USB device',
          'Run "lsusb" again to see if device appears',
          'If device appears, run "dmesg | tail" to check for errors',
          'Note the device ID (format: xxxx:xxxx) for further troubleshooting'
        ],
        commands: [
          { command: 'lsusb', description: 'List all USB devices' },
          { command: 'lsusb -v', description: 'Verbose USB device information' },
          { command: 'dmesg | grep -i usb', description: 'Check USB-related kernel messages' },
          { command: 'sudo fdisk -l', description: 'List all storage devices' }
        ],
        successRate: 80,
        difficulty: 'intermediate',
        keywords: ['linux lsusb', 'linux usb troubleshooting', 'command line usb']
      },
      {
        id: 'udev-rules',
        category: 'udev Rules',
        title: 'Create Custom udev Rules',
        description: 'Set up custom rules for USB device recognition',
        steps: [
          'Find device vendor and product ID using lsusb',
          'Create new udev rule file: sudo nano /etc/udev/rules.d/99-usb-device.rules',
          'Add rule: SUBSYSTEM=="usb", ATTR{idVendor}=="xxxx", ATTR{idProduct}=="xxxx", MODE="0666"',
          'Reload udev rules: sudo udevadm control --reload-rules',
          'Trigger udev: sudo udevadm trigger',
          'Reconnect your USB device'
        ],
        example: 'SUBSYSTEM=="usb", ATTR{idVendor}=="0781", ATTR{idProduct}=="5567", MODE="0666", GROUP="plugdev"',
        successRate: 70,
        difficulty: 'advanced',
        keywords: ['linux udev rules', 'usb permissions', 'device rules']
      }
    ]
  }
};

// Device-specific troubleshooting solutions
export const deviceSpecificSolutions = {
  storage: {
    name: 'USB Storage Devices',
    types: ['Flash Drives', 'External Hard Drives', 'SSDs', 'Memory Cards'],
    commonIssues: [
      {
        id: 'not-showing-explorer',
        issue: 'USB Drive Not Showing in File Explorer',
        description: 'Drive is detected but not accessible in file manager',
        solutions: [
          {
            platform: 'windows',
            steps: [
              'Open Disk Management (diskmgmt.msc)',
              'Look for your USB drive in the list',
              'If it shows as "Unallocated", right-click and select "New Simple Volume"',
              'If it has no drive letter, right-click and "Change Drive Letter and Paths"',
              'Assign an available drive letter (like E: or F:)'
            ]
          },
          {
            platform: 'mac',
            steps: [
              'Open Disk Utility (Applications > Utilities)',
              'Look for your USB drive in the sidebar',
              'If it appears grayed out, click "Mount"',
              'If it shows as unformatted, click "Erase" to format it'
            ]
          }
        ],
        successRate: 85,
        keywords: ['usb drive not showing', 'disk management', 'drive letter assignment']
      },
      {
        id: 'corrupted-filesystem',
        issue: 'Corrupted File System',
        description: 'USB drive shows errors or asks to be formatted',
        solutions: [
          {
            platform: 'windows',
            steps: [
              'Open Command Prompt as Administrator',
              'Type: chkdsk /f X: (replace X with your drive letter)',
              'Wait for scan to complete',
              'If errors found, run: chkdsk /f /r X:',
              'Try accessing the drive again'
            ]
          },
          {
            platform: 'linux',
            steps: [
              'Identify device: sudo fdisk -l',
              'Unmount if mounted: sudo umount /dev/sdX1',
              'Check filesystem: sudo fsck /dev/sdX1',
              'For FAT32: sudo fsck.fat -v /dev/sdX1',
              'For NTFS: sudo ntfsfix /dev/sdX1'
            ]
          }
        ],
        successRate: 60,
        keywords: ['corrupted usb drive', 'chkdsk', 'filesystem repair']
      }
    ]
  },
  
  input: {
    name: 'Input Devices',
    types: ['Keyboards', 'Mice', 'Gaming Controllers', 'Drawing Tablets'],
    commonIssues: [
      {
        id: 'keyboard-not-responding',
        issue: 'USB Keyboard Not Responding',
        description: 'Keyboard is detected but keys don\'t work',
        solutions: [
          {
            platform: 'windows',
            steps: [
              'Check if Num Lock/Caps Lock LEDs work',
              'Try keyboard in BIOS/UEFI setup (restart and press F2/Del)',
              'Update keyboard drivers in Device Manager',
              'Disable "Filter Keys" in Ease of Access settings',
              'Try different USB port, preferably USB 2.0'
            ]
          }
        ],
        successRate: 75,
        keywords: ['usb keyboard not working', 'keyboard not responding', 'filter keys']
      },
      {
        id: 'mouse-cursor-issues',
        issue: 'USB Mouse Cursor Problems',
        description: 'Mouse is detected but cursor doesn\'t move properly',
        solutions: [
          {
            platform: 'windows',
            steps: [
              'Clean mouse sensor with soft cloth',
              'Try mouse on different surface (use mouse pad)',
              'Update mouse drivers in Device Manager',
              'Adjust mouse sensitivity in Settings > Devices > Mouse',
              'Disable "Enhance pointer precision" if enabled'
            ]
          }
        ],
        successRate: 80,
        keywords: ['usb mouse not working', 'mouse cursor problems', 'pointer precision']
      }
    ]
  },
  
  mobile: {
    name: 'Mobile Devices',
    types: ['iPhones', 'Android Phones', 'Tablets', 'iPads'],
    commonIssues: [
      {
        id: 'iphone-not-recognized',
        issue: 'iPhone Not Recognized by Computer',
        description: 'iPhone connects for charging but not detected for data transfer',
        solutions: [
          {
            platform: 'windows',
            steps: [
              'Install latest iTunes from Apple website',
              'Use original Apple Lightning cable',
              'Unlock iPhone and tap "Trust This Computer"',
              'Restart both iPhone and computer',
              'Try different USB port (preferably USB 2.0)',
              'Reset Location & Privacy settings on iPhone'
            ]
          },
          {
            platform: 'mac',
            steps: [
              'Update macOS to latest version',
              'Use original Apple cable',
              'Unlock iPhone and trust the computer',
              'Open Finder and look for iPhone in sidebar',
              'If not appearing, restart both devices'
            ]
          }
        ],
        successRate: 70,
        keywords: ['iphone not recognized', 'itunes device detection', 'trust this computer']
      },
      {
        id: 'android-file-transfer',
        issue: 'Android File Transfer Issues',
        description: 'Android device charges but file transfer doesn\'t work',
        solutions: [
          {
            platform: 'windows',
            steps: [
              'Enable "Developer Options" on Android',
              'Turn on "USB Debugging"',
              'Change USB connection mode to "File Transfer" or "MTP"',
              'Install device-specific USB drivers',
              'Try different USB cable (data-capable, not charge-only)'
            ]
          },
          {
            platform: 'mac',
            steps: [
              'Download Android File Transfer app from Google',
              'Enable "File Transfer" mode on Android device',
              'Connect with data-capable USB cable',
              'Open Android File Transfer app',
              'If issues persist, try "PTP" mode instead of "MTP"'
            ]
          }
        ],
        successRate: 65,
        keywords: ['android file transfer', 'mtp mode', 'usb debugging']
      }
    ]
  }
};

// Comprehensive FAQ based on popular Google searches
export const faqData = [
  {
    id: 'why-usb-not-recognized',
    question: 'Why is my USB device not recognized?',
    answer: 'USB devices may not be recognized due to several reasons: faulty USB ports, damaged cables, outdated drivers, power management settings, or hardware conflicts. Start with basic troubleshooting like trying different ports and cables.',
    category: 'general',
    searchVolume: 15000,
    relatedSolutions: ['basic-checks', 'driver-update', 'power-management'],
    keywords: ['usb not recognized', 'usb device not detected']
  },
  {
    id: 'usb-shows-unknown-device',
    question: 'Why does my USB show as "Unknown Device" in Device Manager?',
    answer: 'An "Unknown Device" error typically indicates missing or corrupted drivers. Try updating the device driver, uninstalling and reinstalling it, or downloading drivers from the manufacturer\'s website.',
    category: 'windows',
    searchVolume: 8500,
    relatedSolutions: ['device-manager-fix', 'driver-update'],
    keywords: ['unknown device', 'device manager error', 'usb driver issues']
  },
  {
    id: 'usb-not-working-after-update',
    question: 'USB ports stopped working after Windows update - how to fix?',
    answer: 'Windows updates can sometimes cause USB driver conflicts. Try rolling back USB controller drivers in Device Manager, running Windows Update troubleshooter, or performing a system restore to before the update.',
    category: 'windows',
    searchVolume: 6200,
    relatedSolutions: ['device-manager-fix', 'registry-fixes'],
    keywords: ['usb not working after update', 'windows update usb issues']
  },
  {
    id: 'usb-3-vs-usb-2',
    question: 'Should I use USB 2.0 or USB 3.0 ports for problematic devices?',
    answer: 'For troubleshooting, try USB 2.0 ports first. Some older devices have compatibility issues with USB 3.0 ports. USB 2.0 ports are often more stable for basic device recognition.',
    category: 'general',
    searchVolume: 4100,
    relatedSolutions: ['basic-checks'],
    keywords: ['usb 2.0 vs 3.0', 'usb compatibility issues']
  },
  {
    id: 'mac-usb-not-mounting',
    question: 'Why won\'t my USB drive mount on Mac?',
    answer: 'USB drives may not mount on Mac due to file system incompatibility, disk errors, or system issues. Try using Disk Utility to repair the drive, reset SMC, or reformat the drive if data isn\'t critical.',
    category: 'mac',
    searchVolume: 3800,
    relatedSolutions: ['smc-reset', 'system-preferences'],
    keywords: ['mac usb not mounting', 'disk utility repair']
  },
  {
    id: 'linux-usb-permissions',
    question: 'How to fix USB device permissions on Linux?',
    answer: 'USB permission issues on Linux can be resolved by adding your user to the appropriate groups (plugdev, dialout), creating custom udev rules, or temporarily using sudo to access the device.',
    category: 'linux',
    searchVolume: 2900,
    relatedSolutions: ['udev-rules', 'lsusb-diagnosis'],
    keywords: ['linux usb permissions', 'udev rules', 'plugdev group']
  }
];

// Error messages and their solutions
export const errorMessages = [
  {
    id: 'device-not-recognized',
    message: 'USB device not recognized',
    platforms: ['windows'],
    description: 'Windows cannot identify the USB device',
    solutions: ['basic-checks', 'driver-update', 'device-manager-fix'],
    commonCauses: ['Driver issues', 'Hardware failure', 'Power problems']
  },
  {
    id: 'device-malfunction',
    message: 'A USB device has malfunctioned',
    platforms: ['windows'],
    description: 'Device was working but suddenly stopped',
    solutions: ['power-cycle', 'device-manager-fix', 'registry-fixes'],
    commonCauses: ['Driver corruption', 'Power surge', 'Hardware conflict']
  },
  {
    id: 'disk-not-ejected',
    message: 'Disk Not Ejected Properly',
    platforms: ['mac'],
    description: 'USB device was disconnected without proper ejection',
    solutions: ['smc-reset', 'system-preferences'],
    commonCauses: ['Improper disconnection', 'System sleep', 'Background processes']
  }
];

// Visual troubleshooting data
export const visualGuides = {
  usbConnectors: [
    {
      type: 'USB-A',
      description: 'Standard rectangular USB connector',
      image: '/images/usb-a-connector.png',
      commonUses: ['Flash drives', 'Keyboards', 'Mice', 'External drives']
    },
    {
      type: 'USB-C',
      description: 'Reversible oval connector',
      image: '/images/usb-c-connector.png',
      commonUses: ['Modern laptops', 'Smartphones', 'Tablets', 'External displays']
    },
    {
      type: 'Micro-USB',
      description: 'Small connector for mobile devices',
      image: '/images/micro-usb-connector.png',
      commonUses: ['Older Android phones', 'Bluetooth speakers', 'Power banks']
    },
    {
      type: 'Lightning',
      description: 'Apple proprietary connector',
      image: '/images/lightning-connector.png',
      commonUses: ['iPhones', 'iPads', 'AirPods cases']
    }
  ],
  
  commonErrors: [
    {
      error: 'Yellow triangle in Device Manager',
      image: '/images/device-manager-warning.png',
      meaning: 'Driver issue or hardware problem',
      solution: 'Update or reinstall device driver'
    },
    {
      error: 'Red X in Device Manager',
      image: '/images/device-manager-disabled.png',
      meaning: 'Device is disabled',
      solution: 'Right-click and enable the device'
    }
  ]
};

// Advanced solutions for technical users
export const advancedSolutions = [
  // Registry solutions
  {
    id: 'registry-usbhub-fix',
    title: 'USB Hub Registry Fix',
    description: 'Fix USB ports not working after Windows update by modifying usbhub registry entry',
    steps: [
      'Press Windows + R, type "regedit"',
      'Navigate to HKEY_LOCAL_MACHINE\\SYSTEM\\CurrentControlSet\\Services\\usbhub',
      'Double-click "Start" and change value to 3',
      'Restart computer'
    ],
    warning: 'These solutions require administrator privileges and registry editing. Create a system restore point first.',
    successRate: 40,
    difficulty: 'advanced',
    riskLevel: 'high',
    platforms: ['windows'],
    category: 'registry'
  },
  {
    id: 'registry-selective-suspend-fix',
    title: 'Disable USB Selective Suspend',
    description: 'Prevent Windows from turning off USB devices to save power through registry modification',
    steps: [
      'Press Windows + R, type "regedit"',
      'Navigate to HKEY_LOCAL_MACHINE\\SYSTEM\\CurrentControlSet\\Control\\Power\\CsSettings',
      'Find USB selective suspend setting',
      'Set both "On battery" and "Plugged in" to "Disabled"',
      'Restart computer'
    ],
    warning: 'These solutions require administrator privileges and registry editing. Create a system restore point first.',
    successRate: 55,
    difficulty: 'advanced',
    riskLevel: 'medium',
    platforms: ['windows'],
    category: 'registry'
  },
  // Command line solutions
  {
    id: 'command-lsusb-diagnosis',
    title: 'Diagnose USB Issues with lsusb',
    description: 'Use command line tools to identify USB recognition problems',
    steps: [
      'Open terminal (Ctrl+Alt+T)',
      'Run "lsusb" to list all USB devices',
      'Connect your USB device',
      'Run "lsusb" again to see if device appears',
      'If device appears, run "dmesg | tail" to check for errors',
      'Note the device ID (format: xxxx:xxxx) for further troubleshooting'
    ],
    successRate: 80,
    difficulty: 'intermediate',
    riskLevel: 'low',
    platforms: ['linux'],
    category: 'commandLine',
    commands: [
      { command: 'lsusb', description: 'List all USB devices' },
      { command: 'lsusb -v', description: 'Verbose USB device information' },
      { command: 'dmesg | grep -i usb', description: 'Check USB-related kernel messages' },
      { command: 'sudo fdisk -l', description: 'List all storage devices' }
    ]
  },
  {
    id: 'command-udev-rules',
    title: 'Create Custom udev Rules',
    description: 'Set up custom rules for USB device recognition',
    steps: [
      'Find device vendor and product ID using lsusb',
      'Create new udev rule file: sudo nano /etc/udev/rules.d/99-usb-device.rules',
      'Add rule: SUBSYSTEM=="usb", ATTR{idVendor}=="xxxx", ATTR{idProduct}=="xxxx", MODE="0666"',
      'Reload udev rules: sudo udevadm control --reload-rules',
      'Trigger udev: sudo udevadm trigger',
      'Reconnect your USB device'
    ],
    successRate: 70,
    difficulty: 'advanced',
    riskLevel: 'medium',
    platforms: ['linux'],
    category: 'commandLine'
  },
  // Hardware diagnostic solutions
  {
    id: 'hardware-power-test',
    title: 'USB Power Supply Test',
    description: 'Test if USB port is providing adequate power to connected devices',
    steps: [
      'Purchase a USB power meter online or visit a computer repair shop',
      'Connect the power meter between your device and USB port',
      'Check if the port provides the required voltage (5V) and current',
      'Compare readings with device specifications',
      'If inadequate, try a different port or use a powered USB hub'
    ],
    warning: 'This solution requires purchasing additional hardware or visiting a repair shop.',
    successRate: 90,
    difficulty: 'intermediate',
    riskLevel: 'low',
    platforms: ['windows', 'mac', 'linux'],
    category: 'hardware'
  },
  {
    id: 'hardware-port-inspection',
    title: 'Physical USB Port Inspection',
    description: 'Inspect USB ports for physical damage or debris',
    steps: [
      'Shut down computer and disconnect from power',
      'Use a flashlight to inspect USB ports for debris, bent pins, or corrosion',
      'Use compressed air to clean out any debris',
      'For laptops, check if pins are bent and carefully bend them back',
      'For desktops, check if the USB header connections are secure'
    ],
    warning: 'Only perform this solution if you are comfortable opening your computer. Improper handling can cause damage.',
    successRate: 30,
    difficulty: 'advanced',
    riskLevel: 'high',
    platforms: ['windows', 'mac', 'linux'],
    category: 'hardware'
  }
];

export default {
  quickSolutions,
  platformGuides,
  deviceSpecificSolutions,
  faqData,
  errorMessages,
  visualGuides,
  advancedSolutions
};