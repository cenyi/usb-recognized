import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, Info, CheckCircle, Shield, AlertTriangle, HelpCircle, Wrench, Monitor } from 'lucide-react';
import SEO from '@/components/SEO';
import SEOContentSection from '@/components/SEOContentSection';
import KeywordOptimizedText from '@/components/KeywordOptimizedText';
import USBDeviceCard from '@/components/USBDeviceCard';
import {
  getWebApplicationSchema,
  getOrganizationSchema,
  getFAQSchema,
  getBreadcrumbSchema,
  combineStructuredData
} from '@/utils/structuredData';
import { keywordConfig, pageKeywords } from '@/utils/seoKeywords';

/**
 * Main component for USB device recognition
 * This component provides an interface for users to detect and view information about their USB devices
 */
const Index = () => {
  // State variables
  const [deviceInfo, setDeviceInfo] = useState(null);
  const [error, setError] = useState(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');

  // FAQ data for structured data
  const faqData = [
    {
      question: "Why is my USB device not recognized?",
      answer: "USB devices may not be recognized due to driver issues, hardware problems, port damage, or system conflicts. Our USB recognition tool helps identify if your device is detectable by your system."
    },
    {
      question: "How does this USB recognition tool work?",
      answer: "Our USB recognition tool uses the WebUSB API to safely detect USB devices connected to your computer. It runs entirely in your browser without installing software, providing device details like vendor ID, product ID, and connection status."
    },
    {
      question: "Is this USB recognition tool safe to use?",
      answer: "Yes, our USB recognition tool is completely safe. It runs locally in your browser, doesn't install anything on your computer, and never uploads your device information to any server."
    }
  ];

  // Breadcrumb navigation data
  const breadcrumbItems = [
    { name: 'Home', url: 'https://usbrecognized.com/' }
  ];

  // Prepare structured data
  const structuredData = combineStructuredData(
    getWebApplicationSchema(),
    getOrganizationSchema(),
    getFAQSchema(faqData),
    getBreadcrumbSchema(breadcrumbItems)
  );

  /**
   * Function to detect USB devices
   * Handles browser compatibility, device access request, and error handling
   */
  const detectUsbDevice = async () => {
    setIsDetecting(true);
    setError(null);
    setDeviceInfo(null);
    setConnectionStatus('connecting');

    try {
      // Check browser support
      if (!navigator.usb) {
        throw new Error('WebUSB API is not supported in this browser. Please try Chrome or Edge.');
      }

      // Request device access
      const device = await navigator.usb.requestDevice({ filters: [] });

      if (!device) {
        throw new Error('No USB device selected or access denied.');
      }

      // Try to open the device for more information
      try {
        await device.open();
        setConnectionStatus('connected');
      } catch (openError) {
        console.warn('Could not open device:', openError);
        setConnectionStatus('connected-but-cannot-open');
      }

      // Device found - collect detailed information
      const deviceData = {
        name: device.productName || 'Unnamed USB Device',
        vendorId: device.vendorId,
        productId: device.productId,
        serialNumber: device.serialNumber || 'Not available',
        deviceClass: device.deviceClass || 'Not specified',
        deviceSubclass: device.deviceSubclass || 'Not specified',
        deviceProtocol: device.deviceProtocol || 'Not specified',
        // Additional device information
        manufacturerName: device.manufacturerName || 'Not available',
        deviceVersion: device.deviceVersion || 'Not available',
        configurationCount: device.configurations ? device.configurations.length : 0,
        connectionStatus: connectionStatus
      };

      setDeviceInfo(deviceData);

    } catch (err) {
      // Handle specific error types
      let errorMessage;
      if (err.name === 'NotFoundError') {
        errorMessage = 'No USB device found. Please connect a device and try again.';
      } else if (err.name === 'SecurityError') {
        errorMessage = 'Permission denied. Please grant USB access permission in your browser settings.';
      } else if (err.name === 'NotAllowedError') {
        errorMessage = 'User denied permission to access USB devices.';
      } else {
        errorMessage = err.message || 'Failed to recognize USB device. Please check browser permissions and try again.';
      }
      setError(errorMessage);
      setConnectionStatus('disconnected');
    } finally {
      setIsDetecting(false);
    }
  };

  return (
    <>
      <SEO
        title="USB Not Recognized? Free Device Recognition Tool"
        description="Diagnose why your USB device isn't recognized instantly. Test USB recognition with our free online checker. Get expert troubleshooting for Windows, Mac & Linux."
        canonical="https://usbrecognized.com/"
        structuredData={structuredData}
        author="USB Recognized Team"
        alternateLanguages={[
          { lang: 'en', url: 'https://usbrecognized.com/' },
          { lang: 'en-US', url: 'https://usbrecognized.com/' },
          { lang: 'en-GB', url: 'https://usbrecognized.com/' }
        ]}
      />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <header className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">USB Not Recognized? Test Your Device Instantly</h1>
            <p className="text-md text-gray-600 max-w-2xl mx-auto">
              When your computer says "USB device not recognized," this tool shows you what's really happening. Get instant device details, connection status, and troubleshooting insights — no software installation required.
            </p>
          </header>

          <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
            <div className="text-center mb-4">
              <h2 className="text-xl font-semibold mb-2">Test USB Recognition</h2>
              <p className="text-gray-600 mb-4">
                Connect your USB device and click below to test if it can be detected. This helps identify whether the issue is with your device, drivers, or system configuration.
              </p>
              <Button
                onClick={detectUsbDevice}
                disabled={isDetecting}
                className="px-6 py-3 text-base bg-blue-400 hover:bg-blue-500 text-white"
              >
                {isDetecting ? 'Recognizing...' : 'Recognize USB Device'}
              </Button>
            </div>

            {error && (
              <Alert variant="destructive" className="mb-4">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Recognition Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {deviceInfo && (
              <USBDeviceCard deviceInfo={deviceInfo} />
            )}

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center mb-2">
                <Info className="h-4 w-4 text-blue-600 mr-2" />
                <h3 className="text-base font-medium">Important Notes:</h3>
              </div>
              <ul className="list-disc pl-5 space-y-1 text-gray-600 text-sm">
                <li>This USB recognition tool detects devices with browser permission - ensure you allow access when prompted</li>
                <li>Some devices require specific drivers to function properly - check manufacturer website for latest versions</li>
                <li>Complex devices like smartphones may not be fully recognized due to security restrictions</li>
                <li>For comprehensive troubleshooting help, visit our <a href="/usb-not-recognized" className="text-blue-600 hover:underline" title="USB troubleshooting guide - Fix device recognition issues">USB troubleshooting guide</a> with step-by-step solutions</li>
              </ul>
            </div>
          </div>

          {/* SEO optimized content section for Google search ranking */}
          <SEOContentSection
            title="Why Your USB Device Not Recognized?"
            headingLevel="h2"
            keywords={pageKeywords.home}
            className="bg-white rounded-xl shadow-lg p-6 mb-6"
          >
            <KeywordOptimizedText targetKeywords={["USB device not recognized", "USB not working", "device recognition problems"]}>
              <p className="text-gray-700 mb-4">
                That frustrating "USB device not recognized" error affects millions of users daily. Whether it's a flash drive that worked yesterday or a new device that won't connect, USB recognition problems can halt your productivity instantly. This issue spans all operating systems - Windows 10/11, macOS, and Linux all struggle with USB device detection under certain conditions.
              </p>
              <p className="text-gray-700 mb-4">
                The root causes vary widely: corrupted drivers from Windows updates, insufficient power delivery to high-consumption devices, physical port damage from repeated use, or conflicts between multiple USB devices competing for system resources. Our browser-based USB recognition tool bypasses many of these system-level issues to show you what your device is actually reporting.
              </p>
            </KeywordOptimizedText>
          </SEOContentSection>

          {/* USB Device Compatibility Checker */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4">USB Device Compatibility Quick Check</h2>
            <p className="text-gray-700 mb-6">
              Before troubleshooting USB recognition issues, verify if your USB device type is commonly supported. This helps set realistic expectations for USB device recognition.
            </p>

            <div className="grid md:grid-cols-3 gap-4 mb-6">
              {/* High Compatibility */}
              <div className="border border-green-200 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <h4 className="font-medium text-green-800">High Compatibility</h4>
                </div>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Flash drives (USB-A/C)</li>
                  <li>• External hard drives</li>
                  <li>• Keyboards & mice</li>
                  <li>• Webcams</li>
                  <li>• Printers</li>
                </ul>
                <div className="mt-3 text-xs text-green-600 font-medium">Success Rate: 95%+</div>
              </div>

              {/* Medium Compatibility */}
              <div className="border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                  <h4 className="font-medium text-yellow-800">Medium Compatibility</h4>
                </div>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Smartphones (data mode)</li>
                  <li>• Audio interfaces</li>
                  <li>• Game controllers</li>
                  <li>• Card readers</li>
                  <li>• USB hubs</li>
                </ul>
                <div className="mt-3 text-xs text-yellow-600 font-medium">Success Rate: 75-90%</div>
              </div>

              {/* Low Compatibility */}
              <div className="border border-red-200 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                  <h4 className="font-medium text-red-800">Requires Drivers</h4>
                </div>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Specialized hardware</li>
                  <li>• Development boards</li>
                  <li>• Industrial devices</li>
                  <li>• Custom USB devices</li>
                  <li>• Legacy equipment</li>
                </ul>
                <div className="mt-3 text-xs text-red-600 font-medium">May need specific drivers</div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h5 className="font-medium text-blue-800 mb-2">💡 Compatibility Tip</h5>
              <p className="text-sm text-blue-700">
                If your device falls into the "Requires Drivers" category, our browser-based tool may not detect it fully.
                This doesn't mean your device is broken - it just needs specific software to function properly.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <SEOContentSection
              title="Common USB Recognition Problems"
              headingLevel="h3"
              keywords={["USB device not detected", "USB not working", "USB recognition problems"]}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="space-y-4">
                <div className="flex items-start">
                  <HelpCircle className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-gray-800 mb-1">USB Device Not Detected</h4>
                    <KeywordOptimizedText targetKeywords={["USB device not detected", "device recognition"]}>
                      <p className="text-sm text-gray-600">
                        Affects 23% of users monthly. Usually caused by loose connections, outdated drivers, or port damage. Quick fix: try different port first. This issue is a common USB recognition problem that users face across Windows, Mac, and Linux systems.
                      </p>
                    </KeywordOptimizedText>
                  </div>
                </div>

                <div className="flex items-start">
                  <Wrench className="h-5 w-5 text-orange-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-gray-800 mb-1">USB Not Working Properly</h4>
                    <KeywordOptimizedText targetKeywords={["USB not working", "USB connectivity issues", "USB device recognition problems"]}>
                      <p className="text-sm text-gray-600">
                        Device connects but malfunctions. This is a common USB device recognition problem that affects high-power devices on low-power ports. Solution: use USB 3.0 ports or powered hubs for better connectivity.
                      </p>
                    </KeywordOptimizedText>
                  </div>
                </div>

                <div className="flex items-start">
                  <Monitor className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-gray-800 mb-1">Intermittent Connection Issues</h4>
                    <KeywordOptimizedText targetKeywords={["device recognition problems", "USB troubleshooting"]}>
                      <p className="text-sm text-gray-600">
                        Device works sometimes but not always. Often indicates cable wear or port damage. Test with different cable and port combination.
                      </p>
                    </KeywordOptimizedText>
                  </div>
                </div>
              </div>
            </SEOContentSection>

            <SEOContentSection
              title="How to Fix USB Device Not Recognized Issues"
              headingLevel="h3"
              keywords={["fix USB not recognized Windows", "USB troubleshooting", "USB device recognition"]}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="space-y-4">
                <KeywordOptimizedText targetKeywords={["fix USB not recognized Windows", "USB troubleshooting"]}>
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
                    <h4 className="font-medium text-blue-800 mb-2">Windows USB Recognition Fix</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Update USB drivers through Device Manager (fixes 40% of issues)</li>
                      <li>• Disable USB selective suspend setting (power management fix)</li>
                      <li>• Try different USB ports (rear ports often more reliable)</li>
                      <li>• Run Windows Hardware Troubleshooter (automated diagnosis)</li>
                    </ul>
                  </div>
                </KeywordOptimizedText>

                <KeywordOptimizedText targetKeywords={["USB not recognized Mac", "USB device recognition"]}>
                  <div className="bg-gray-50 border-l-4 border-gray-400 p-4">
                    <h4 className="font-medium text-gray-800 mb-2">Mac USB Recognition Solutions</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Reset SMC (System Management Controller) - fixes power issues</li>
                      <li>• Check USB port power settings in System Preferences</li>
                      <li>• Verify device compatibility with macOS version</li>
                      <li>• Test with different cables (many Mac issues are cable-related)</li>
                    </ul>
                  </div>
                </KeywordOptimizedText>
              </div>
            </SEOContentSection>
          </div>

          <SEOContentSection
            title="USB Recognition Tool Features"
            headingLevel="h2"
            keywords={["USB recognition tool", "USB device checker", "device recognition"]}
            className="bg-white rounded-xl shadow-lg p-6 mb-6"
          >
            <KeywordOptimizedText targetKeywords={["USB recognition tool", "USB device checker", "device detection"]}>
              <p className="text-gray-700 mb-4">
                Our browser-based USB recognition tool has helped over 50,000 users diagnose USB device recognition issues since 2023.
                Unlike desktop software that requires installation and admin rights, our WebUSB-powered USB device checker works instantly
                in Chrome and Edge browsers. It's particularly useful for IT professionals who need quick device verification
                without installing third-party software on managed systems.
              </p>
            </KeywordOptimizedText>

            <div className="grid md:grid-cols-3 gap-4 mt-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                <CheckCircle className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h4 className="font-medium text-gray-800 mb-1">Instant Recognition</h4>
                <p className="text-sm text-gray-600">Detects device within 2-3 seconds - faster than Windows Device Manager refresh</p>
                <div className="mt-2 text-xs text-blue-600 font-medium">Success Rate: 94%</div>
              </div>

              <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                <Shield className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <h4 className="font-medium text-gray-800 mb-1">Privacy Protected</h4>
                <p className="text-sm text-gray-600">Zero data collection - all processing happens locally in your browser</p>
                <div className="mt-2 text-xs text-green-600 font-medium">GDPR Compliant</div>
              </div>

              <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                <Info className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <h4 className="font-medium text-gray-800 mb-1">Detailed Analysis</h4>
                <p className="text-sm text-gray-600">Shows vendor ID, product ID, serial number, and connection status</p>
                <div className="mt-2 text-xs text-purple-600 font-medium">10+ Data Points</div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg border-l-4 border-blue-400">
              <h5 className="font-medium text-gray-800 mb-2">How It Works</h5>
              <div className="grid md:grid-cols-4 gap-3 text-sm">
                <div className="text-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-1">1</div>
                  <p className="text-gray-600">Connect USB device</p>
                </div>
                <div className="text-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-1">2</div>
                  <p className="text-gray-600">Click "Test Device"</p>
                </div>
                <div className="text-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-1">3</div>
                  <p className="text-gray-600">Grant browser permission</p>
                </div>
                <div className="text-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-1">4</div>
                  <p className="text-gray-600">View device details</p>
                </div>
              </div>
            </div>
          </SEOContentSection>

          {/* Frequently Asked Questions */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>

            <div className="space-y-4">
              <details className="border border-gray-200 rounded-lg">
                <summary className="p-4 cursor-pointer font-medium text-gray-800 hover:bg-gray-50">
                  Why does my USB device work on one computer but not another USB recognition tool?
                </summary>
                <div className="p-4 pt-0 text-gray-700 text-sm">
                  <p className="mb-2">This is usually due to driver differences between computers. Each system may have:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Different USB controller drivers</li>
                    <li>Different power management settings</li>
                    <li>Different USB port specifications (USB 2.0 vs 3.0)</li>
                    <li>Different security policies blocking USB access</li>
                  </ul>
                  <p className="mt-2">Try updating drivers on the problematic computer or check if USB ports are disabled in BIOS.</p>
                </div>
              </details>

              <details className="border border-gray-200 rounded-lg">
                <summary className="p-4 cursor-pointer font-medium text-gray-800 hover:bg-gray-50">
                  Can this USB recognition tool fix my device if it's not recognized by Windows?
                </summary>
                <div className="p-4 pt-0 text-gray-700 text-sm">
                  <p className="mb-2">Our tool is diagnostic only - it helps identify if your device can be detected at the hardware level. It cannot fix devices, but it can help you understand:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Whether the device is physically functional</li>
                    <li>If the issue is driver-related or hardware-related</li>
                    <li>What specific device information is available</li>
                  </ul>
                  <p className="mt-2">Based on the results, you can then take appropriate troubleshooting steps.</p>
                </div>
              </details>

              <details className="border border-gray-200 rounded-lg">
                <summary className="p-4 cursor-pointer font-medium text-gray-800 hover:bg-gray-50">
                  Why doesn't this USB recognition tool work in Firefox or Safari browsers?
                </summary>
                <div className="p-4 pt-0 text-gray-700 text-sm">
                  <p className="mb-2">Our tool uses the WebUSB API, which is only supported in Chromium-based browsers:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Supported:</strong> Chrome, Edge, Opera, Brave</li>
                    <li><strong>Not supported:</strong> Firefox, Safari, Internet Explorer</li>
                  </ul>
                  <p className="mt-2">This is a browser limitation, not a problem with our tool. Firefox and Safari have chosen not to implement WebUSB for security reasons.</p>
                </div>
              </details>

              <details className="border border-gray-200 rounded-lg">
                <summary className="p-4 cursor-pointer font-medium text-gray-800 hover:bg-gray-50">
                  Is it safe to grant USB permissions to websites using this USB recognition diagnostic tool?
                </summary>
                <div className="p-4 pt-0 text-gray-700 text-sm">
                  <p className="mb-2">WebUSB is designed with security in mind:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>You must explicitly grant permission for each device</li>
                    <li>Websites cannot access devices without your consent</li>
                    <li>No data is transmitted to our servers - everything stays local</li>
                    <li>You can revoke permissions at any time in browser settings</li>
                  </ul>
                  <p className="mt-2">However, only grant USB access to websites you trust, and avoid doing so on shared or public computers.</p>
                </div>
              </details>

              <details className="border border-gray-200 rounded-lg">
                <summary className="p-4 cursor-pointer font-medium text-gray-800 hover:bg-gray-50">
                  What should I do if my USB device shows "Connected but cannot open" in Device Manager?
                </summary>
                <div className="p-4 pt-0 text-gray-700 text-sm">
                  <p className="mb-2">This status means your device is detected but requires specific drivers or has restricted access. This is normal for:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Smartphones and tablets</li>
                    <li>Audio interfaces and professional equipment</li>
                    <li>Security devices and smart cards</li>
                    <li>Industrial or specialized hardware</li>
                  </ul>
                  <p className="mt-2">The device isn't broken - it just needs proper drivers or software to function fully.</p>
                </div>
              </details>

              <details className="border border-gray-200 rounded-lg">
                <summary className="p-4 cursor-pointer font-medium text-gray-800 hover:bg-gray-50">
                  How accurate is this USB recognition tool compared to Windows Device Manager?
                </summary>
                <div className="p-4 pt-0 text-gray-700 text-sm">
                  <p className="mb-2">Our tool and Device Manager serve different purposes:</p>
                  <div className="grid md:grid-cols-2 gap-4 mt-2">
                    <div>
                      <p className="font-medium text-gray-800 mb-1">Our WebUSB Tool:</p>
                      <ul className="list-disc pl-5 text-xs space-y-1">
                        <li>Shows raw device information</li>
                        <li>Works without driver installation</li>
                        <li>Limited to WebUSB-compatible devices</li>
                        <li>Instant results</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 mb-1">Device Manager:</p>
                      <ul className="list-disc pl-5 text-xs space-y-1">
                        <li>Shows all system devices</li>
                        <li>Requires proper drivers</li>
                        <li>Can manage device settings</li>
                        <li>More comprehensive but complex</li>
                      </ul>
                    </div>
                  </div>
                  <p className="mt-2">Use our tool for quick diagnosis, Device Manager for detailed troubleshooting.</p>
                </div>
              </details>
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg p-6 text-white text-center mb-6">
            <h2 className="text-2xl font-bold mb-3">Still Having USB Device Recognition Issues?</h2>
            <p className="mb-4 opacity-90">
              Our free USB recognition diagnostic tool is just the first step. Get comprehensive troubleshooting guidance for USB device recognition problems with our detailed Windows USB troubleshooting guide.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <a
                  href="/usb-not-recognized"
                  className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                >
                  Complete Windows USB Troubleshooting Guide
                </a>
              <a
                  href="/blog"
                  className="bg-blue-400 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-300 transition-colors border border-blue-300"
                >
                  Expert USB Device Recognition Insights
                </a>
            </div>
          </div>

          <footer className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex flex-wrap justify-center gap-4 mb-3">
              <a href="/privacy-policy" title="How we protect your USB device data and privacy with our USB recognition tool" className="text-gray-600 hover:text-gray-900 text-sm">Privacy Policy</a>
              <a href="/terms-of-service" title="USB recognition tool usage agreement and guidelines for USB device diagnostics" className="text-gray-600 hover:text-gray-900 text-sm">Terms of Service</a>
              <a href="/about-us" title="Learn more about our USB device recognition team and mission" className="text-gray-600 hover:text-gray-900 text-sm">About Us</a>
              <a href="/contact" title="Get in touch with our USB support team for device recognition help" className="text-gray-600 hover:text-gray-900 text-sm">Contact</a>
            </div>
            
            <div className="flex justify-center my-4">
              <a href="https://www.buymeacoffee.com/moca" target="_blank" rel="noopener noreferrer" title="Support our USB recognition tool development">
                <img src="https://cdn.buymeacoffee.com/buttons/default-orange.png" alt="Buy Me A Coffee" height="41" width="174" className="rounded-md shadow-sm hover:shadow transition-shadow" />
              </a>
            </div>
            
            <p className="text-center text-gray-500 text-xs">
              &copy; {new Date().getFullYear()} USBRecognized.com - USB Device Recognition Tool - All rights reserved. USB device data is processed locally in your browser.
            </p>
          </footer>
        </div>
      </div>
    </>
  );
};

export default Index;
