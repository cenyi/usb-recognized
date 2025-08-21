import React from 'react';
import PropTypes from 'prop-types';
import StepByStepGuide from './StepByStepGuide';
import { AlertTriangle, Info, RefreshCw, Search } from 'lucide-react';

/**
 * macOS-specific USB troubleshooting guide component
 */
const MacOSTroubleshootingGuide = ({ className }) => {
  // System Information troubleshooting steps
  const systemInfoSteps = [
    {
      step: 1,
      title: 'Open System Information',
      instruction: 'Click Apple menu → About This Mac → System Report',
      tips: [
        'You can also hold Option key and click Apple menu → System Information',
        'In newer macOS versions, click Apple menu → About This Mac → More Info → System Report'
      ]
    },
    {
      step: 2,
      title: 'Check USB Section',
      instruction: 'Click "USB" in the Hardware section of the sidebar',
      tips: [
        'This shows all USB devices currently connected to your Mac',
        'If your device doesn\'t appear here, it\'s not being detected at the hardware level'
      ]
    },
    {
      step: 3,
      title: 'Verify Device Detection',
      instruction: 'Look for your device in the USB device tree',
      tips: [
        'Check the vendor name, product name, and serial number',
        'Note any error messages or "Unknown Device" entries'
      ]
    },
    {
      step: 4,
      title: 'Check Power Information',
      instruction: 'Select your USB device and look at "Current Available" and "Current Required"',
      tips: [
        'If Current Required is higher than Current Available, your device isn\'t getting enough power',
        'Try connecting to a powered USB hub or directly to your Mac instead of through a hub'
      ]
    }
  ];
  
  // SMC Reset troubleshooting steps
  const smcResetSteps = [
    {
      step: 1,
      title: 'Shut Down Your Mac',
      instruction: 'Click Apple menu → Shut Down',
      tips: [
        'Make sure your Mac is completely powered off, not just sleeping',
        'If you have any unsaved work, save it before shutting down'
      ]
    },
    {
      step: 2,
      title: 'Determine Your Mac Type',
      instruction: 'The SMC reset procedure differs based on your Mac model',
      tips: [
        'Apple Silicon Macs (M1/M2): Simple restart is sufficient as SMC is handled differently',
        'Intel Mac notebooks with T2 chip (2018 or later): Different key combination',
        'Intel Mac notebooks with removable battery: Battery needs to be removed',
        'Intel Mac desktops: Power cord needs to be disconnected'
      ]
    },
    {
      step: 3,
      title: 'Reset SMC (Apple Silicon Mac)',
      instruction: 'Simply shut down, wait 30 seconds, then restart your Mac',
      tips: [
        'Apple Silicon Macs don\'t require a traditional SMC reset',
        'The system automatically resets power management when needed'
      ]
    },
    {
      step: 4,
      title: 'Reset SMC (Intel Mac with T2 chip)',
      instruction: 'Shut down → Hold Control + Option + Shift (right side) for 7 seconds → Add Power button and hold for 7 more seconds',
      tips: [
        'Release all keys, wait a few seconds, then press power button to turn on Mac',
        'This applies to MacBook Pro (2018 or later) and MacBook Air (2018 or later)'
      ]
    },
    {
      step: 5,
      title: 'Reset SMC (Older Intel Mac notebook)',
      instruction: 'Shut down → Unplug power → Hold Shift + Control + Option + Power for 10 seconds → Release all keys → Reconnect power → Turn on Mac',
      tips: [
        'The keys must be on the left side of the keyboard',
        'This applies to pre-2018 MacBook, MacBook Air, and MacBook Pro models'
      ]
    },
    {
      step: 6,
      title: 'Reset SMC (Intel Mac desktop)',
      instruction: 'Shut down → Unplug power cord for 15 seconds → Plug back in → Wait 5 seconds → Turn on Mac',
      tips: [
        'This applies to iMac, Mac mini, Mac Pro, and Mac Studio models with Intel processors'
      ]
    }
  ];
  
  // NVRAM/PRAM Reset steps
  const nvramResetSteps = [
    {
      step: 1,
      title: 'Shut Down Your Mac',
      instruction: 'Click Apple menu → Shut Down',
      tips: [
        'Make sure your Mac is completely powered off, not just sleeping'
      ]
    },
    {
      step: 2,
      title: 'Locate Required Keys',
      instruction: 'Find the Option, Command, P, and R keys on your keyboard',
      tips: [
        'You\'ll need to press and hold these keys simultaneously in the next step',
        'It can be tricky, so position your fingers before starting'
      ]
    },
    {
      step: 3,
      title: 'Start Mac and Hold Keys',
      instruction: 'Press power button, then immediately hold Option + Command + P + R',
      tips: [
        'You need to press the keys immediately after pressing the power button',
        'Keep holding the keys until the next step'
      ]
    },
    {
      step: 4,
      title: 'Wait for Restart Signal',
      instruction: 'Keep holding the keys until you hear the startup sound twice or see the Apple logo appear and disappear twice',
      tips: [
        'On newer Macs without startup sound, look for the Apple logo',
        'This usually takes about 20 seconds'
      ]
    },
    {
      step: 5,
      title: 'Release Keys and Test USB',
      instruction: 'Release all keys and let your Mac start normally, then test your USB device',
      tips: [
        'After reset, some system settings like volume, display resolution, and startup disk selection may be reset to defaults'
      ]
    }
  ];
  
  // Terminal Commands
  const terminalCommandSteps = [
    {
      step: 1,
      title: 'Open Terminal',
      instruction: 'Go to Applications → Utilities → Terminal',
      tips: [
        'You can also press Command + Space and search for "Terminal"'
      ]
    },
    {
      step: 2,
      title: 'List USB Devices',
      instruction: 'Run the following command to list all USB devices',
      command: 'system_profiler SPUSBDataType',
      expectedOutput: 'USB:\n\n    USB 3.1 Bus:\n\n      Host Controller Driver: AppleUSBXHCIPCI\n      PCI Device ID: 0x15d4\n      PCI Revision ID: 0x0002\n      PCI Vendor ID: 0x8086\n\n        USB Device:',
      tips: [
        'This shows detailed information about all connected USB devices',
        'Look for your device in the list'
      ]
    },
    {
      step: 3,
      title: 'Reset USB Ports',
      instruction: 'Run the following command to reset the USB subsystem (requires admin password)',
      command: 'sudo killall -STOP -c usbd',
      tips: [
        'You\'ll need to enter your admin password when prompted',
        'This command temporarily stops the USB daemon, which will automatically restart'
      ]
    },
    {
      step: 4,
      title: 'Check System Log for USB Errors',
      instruction: 'Run the following command to check for USB-related errors',
      command: 'log show --predicate \'subsystem == "com.apple.iokit.IOUSBFamily"\' --last 1h',
      tips: [
        'This shows USB-related log entries from the last hour',
        'Look for error messages related to your device'
      ]
    },
    {
      step: 5,
      title: 'Check Disk Utility for Storage Devices',
      instruction: 'If your USB device is a storage device, run Disk Utility',
      command: 'open /Applications/Utilities/Disk\\ Utility.app',
      tips: [
        'Look for your device in the sidebar',
        'If it appears but isn\'t mounted, select it and click "Mount"',
        'If it appears with errors, try "First Aid"'
      ]
    }
  ];
  
  return (
    <div className={`space-y-8 ${className || ''}`} id="mac-guide">
      <h2 className="text-2xl font-bold mb-4">macOS USB Troubleshooting</h2>
      
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg mb-6">
        <h3 className="text-lg font-semibold text-blue-800 mb-2 flex items-center">
          <Info className="mr-2" size={20} />
          Mac USB Compatibility
        </h3>
        <p className="text-blue-800">
          Modern Macs with USB-C ports may require adapters for older USB devices. Make sure you're using the correct adapter for your device type.
        </p>
      </div>
      
      <div className="grid gap-8 md:grid-cols-2">
        {/* System Information Section */}
        <div>
          <div className="flex items-center mb-3">
            <Search className="mr-2 text-blue-600" size={20} />
            <h3 className="text-xl font-semibold" id="mac-system-info">System Information</h3>
          </div>
          
          <StepByStepGuide
            steps={systemInfoSteps}
            description="Check if macOS detects your USB device"
            difficulty="beginner"
            successRate={80}
            timeRequired="2-5 minutes"
          />
        </div>
        
        {/* SMC Reset Section */}
        <div>
          <div className="flex items-center mb-3">
            <RefreshCw className="mr-2 text-blue-600" size={20} />
            <h3 className="text-xl font-semibold" id="mac-smc-reset">SMC Reset</h3>
          </div>
          
          <StepByStepGuide
            steps={smcResetSteps}
            description="Reset the System Management Controller to fix hardware issues"
            difficulty="intermediate"
            successRate={65}
            timeRequired="5-10 minutes"
          />
        </div>
      </div>
      
      <div className="grid gap-8 md:grid-cols-2 mt-8">
        {/* NVRAM/PRAM Reset Section */}
        <div>
          <div className="flex items-center mb-3">
            <RefreshCw className="mr-2 text-orange-600" size={20} />
            <h3 className="text-xl font-semibold" id="mac-nvram-reset">NVRAM/PRAM Reset</h3>
          </div>
          
          <StepByStepGuide
            steps={nvramResetSteps}
            description="Reset Non-Volatile RAM to fix system-level issues"
            difficulty="intermediate"
            successRate={55}
            timeRequired="3-5 minutes"
          />
        </div>
        
        {/* Terminal Commands Section */}
        <div>
          <div className="flex items-center mb-3">
            <AlertTriangle className="mr-2 text-gray-800" size={20} />
            <h3 className="text-xl font-semibold" id="mac-terminal">Terminal Commands</h3>
          </div>
          
          <StepByStepGuide
            steps={terminalCommandSteps}
            description="Advanced command-line troubleshooting for USB issues"
            difficulty="advanced"
            successRate={70}
            timeRequired="10-15 minutes"
          />
        </div>
      </div>
    </div>
  );
};

MacOSTroubleshootingGuide.propTypes = {
  className: PropTypes.string
};

export default MacOSTroubleshootingGuide;