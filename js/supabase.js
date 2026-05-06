/**
 * SUPABASE.JS
 * Supabase client initialization and helper functions
 * Tracks visits with IP, device info, browser, and OS
 */

// Supabase configuration
const SUPABASE_URL = 'https://bcowedrviohimkljgzhf.supabase.co';
const SUPABASE_KEY = 'sb_publishable_uFGr4FAlf0q71qAmgWOrAQ_-Y10snId';

// Initialize Supabase client
const supabase = (() => {
  const headers = {
    'apikey': SUPABASE_KEY,
    'Content-Type': 'application/json'
  };

  return {
    // Track visit
    async trackVisit(data) {
      try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/visite`, {
          method: 'POST',
          headers,
          body: JSON.stringify(data)
        });
        return response.ok;
      } catch (error) {
        console.error('Error tracking visit:', error);
        return false;
      }
    },

    // Insert lead
    async insertLead(data) {
      try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/leads`, {
          method: 'POST',
          headers,
          body: JSON.stringify(data)
        });
        return response.ok;
      } catch (error) {
        console.error('Error inserting lead:', error);
        return false;
      }
    },

    // Get all visits
    async getVisits() {
      try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/visite?order=created_at.desc`, {
          method: 'GET',
          headers
        });
        if (response.ok) {
          return await response.json();
        }
        return [];
      } catch (error) {
        console.error('Error fetching visits:', error);
        return [];
      }
    },

    // Get all leads
    async getLeads() {
      try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/leads?order=created_at.desc`, {
          method: 'GET',
          headers
        });
        if (response.ok) {
          return await response.json();
        }
        return [];
      } catch (error) {
        console.error('Error fetching leads:', error);
        return [];
      }
    },

    // Get visits count
    async getVisitsCount() {
      try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/visite?select=count()`, {
          method: 'GET',
          headers
        });
        if (response.ok) {
          const data = await response.json();
          return data[0]?.count || 0;
        }
        return 0;
      } catch (error) {
        console.error('Error fetching visits count:', error);
        return 0;
      }
    },

    // Get leads count
    async getLeadsCount() {
      try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/leads?select=count()`, {
          method: 'GET',
          headers
        });
        if (response.ok) {
          const data = await response.json();
          return data[0]?.count || 0;
        }
        return 0;
      } catch (error) {
        console.error('Error fetching leads count:', error);
        return 0;
      }
    }
  };
})();

/**
 * Device Detection
 * Extracts device brand, model, browser, and OS from user agent
 */
const deviceDetector = {
  // Get OS
  getOS() {
    const ua = navigator.userAgent;
    if (ua.indexOf('Win') > -1) return 'Windows';
    if (ua.indexOf('Mac') > -1) return 'macOS';
    if (ua.indexOf('Linux') > -1) return 'Linux';
    if (ua.indexOf('Android') > -1) return 'Android';
    if (ua.indexOf('iPhone') > -1 || ua.indexOf('iPad') > -1) return 'iOS';
    return 'Unknown';
  },

  // Get Browser
  getBrowser() {
    const ua = navigator.userAgent;
    if (ua.indexOf('Chrome') > -1 && ua.indexOf('Chromium') === -1) return 'Chrome';
    if (ua.indexOf('Safari') > -1 && ua.indexOf('Chrome') === -1) return 'Safari';
    if (ua.indexOf('Firefox') > -1) return 'Firefox';
    if (ua.indexOf('Edge') > -1) return 'Edge';
    if (ua.indexOf('Opera') > -1 || ua.indexOf('OPR') > -1) return 'Opera';
    return 'Unknown';
  },

  // Get Device Brand and Model
  getDeviceInfo() {
    const ua = navigator.userAgent;
    let brand = 'Unknown';
    let model = 'Unknown';

    // Detect brand
    if (ua.indexOf('iPhone') > -1) {
      brand = 'Apple';
      model = 'iPhone';
    } else if (ua.indexOf('iPad') > -1) {
      brand = 'Apple';
      model = 'iPad';
    } else if (ua.indexOf('Macintosh') > -1) {
      brand = 'Apple';
      model = 'Mac';
    } else if (ua.indexOf('Samsung') > -1) {
      brand = 'Samsung';
      model = 'Samsung Device';
    } else if (ua.indexOf('Huawei') > -1) {
      brand = 'Huawei';
      model = 'Huawei Device';
    } else if (ua.indexOf('Xiaomi') > -1) {
      brand = 'Xiaomi';
      model = 'Xiaomi Device';
    } else if (ua.indexOf('OnePlus') > -1) {
      brand = 'OnePlus';
      model = 'OnePlus Device';
    } else if (ua.indexOf('Google Pixel') > -1) {
      brand = 'Google';
      model = 'Pixel';
    } else if (ua.indexOf('Windows') > -1) {
      brand = 'Windows';
      model = 'PC';
    } else if (ua.indexOf('Linux') > -1) {
      brand = 'Linux';
      model = 'Linux Device';
    }

    return { brand, model };
  },

  // Get device type
  getDeviceType() {
    const ua = navigator.userAgent;
    if (/mobile|android|iphone|ipad|phone/i.test(ua)) {
      if (/ipad/i.test(ua)) return 'Tablet';
      return 'Mobile';
    }
    return 'Desktop';
  }
};

/**
 * IP Detection
 * Gets visitor IP address from public API
 */
async function getVisitorIP() {
  try {
    const response = await fetch('https://api.ipify.org?format=json', {
      method: 'GET'
    });
    if (response.ok) {
      const data = await response.json();
      return data.ip || 'Unknown';
    }
    return 'Unknown';
  } catch (error) {
    console.error('Error fetching IP:', error);
    return 'Unknown';
  }
}

// Helper function to get visitor source
function getVisitorSource() {
  const referrer = document.referrer;
  if (!referrer) return 'Direct';
  if (referrer.includes('google')) return 'Google';
  if (referrer.includes('facebook')) return 'Facebook';
  if (referrer.includes('instagram')) return 'Instagram';
  if (referrer.includes('linkedin')) return 'LinkedIn';
  return 'Other';
}

/**
 * Track page visit with full device info
 */
async function trackPageVisit() {
  try {
    const ipAddress = await getVisitorIP();
    const deviceInfo = deviceDetector.getDeviceInfo();

    const visitData = {
      ip_address: ipAddress,
      device_brand: deviceInfo.brand,
      device_model: deviceInfo.model,
      browser: deviceDetector.getBrowser(),
      os: deviceDetector.getOS(),
      device: deviceDetector.getDeviceType(),
      source: getVisitorSource()
    };

    await supabase.trackVisit(visitData);
    console.log('Visit tracked:', visitData);
  } catch (error) {
    console.error('Error tracking page visit:', error);
  }
}

// Initialize tracking when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', trackPageVisit);
} else {
  trackPageVisit();
}
