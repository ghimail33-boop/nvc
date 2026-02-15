// ==================== GOOGLE SHEETS CONFIGURATION ====================
const GOOGLE_SHEETS_CONFIG = {
  WEB_APP_URL: 'https://script.google.com/macros/s/AKfycbzJs0ndfEUxjE0fCslLjrFfjTcIqvRFUmgyidtEkRbo-AgOhim0tIfX7JOdXSEc3cvuQg/exec',
  API_KEY: 'nvc2026secretkey',
  ENABLED: true,
  USE_CORS_PROXY: false,

  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
  TIMEOUT: 30000
};

// ==================== CONFIGURATION ====================
const CONFIG = {
  APP_NAME: 'राष्ट्रिय सतर्कता केन्द्र',
  APP_VERSION: '2.0.0',
  DEFAULT_PAGE: 'mainPage',
  DATE_FORMAT: 'YYYY-MM-DD',
  NEPALI_MONTHS: {
    1: "बैशाख", 2: "जेठ", 3: "असार", 4: "साउन", 
    5: "भदौ", 6: "असोज", 7: "कार्तिक", 8: "मंसिर", 
    9: "पुष", 10: "माघ", 11: "फागुन", 12: "चैत"
  }
};

// ==================== DATA MODELS ====================
const MAHASHAKHA = {
  ADMIN_MONITORING: 'प्रशासन तथा अनुगमन महाशाखा',
  POLICY_LEGAL: 'नीति निर्माण तथा कानूनी राय परामर्श महाशाखा',
  POLICE: 'प्रहरी महाशाखा',
  TECHNICAL: 'प्राविधिक परीक्षण तथा अनुगमन महाशाखा'
};

const SHAKHA = {
  ADMIN_PLANNING: 'प्रशासन तथा योजना शाखा',
  INFO_COLLECTION: 'सूचना संकलन तथा अनुगमन शाखा',
  COMPLAINT_MANAGEMENT: 'उजुरी व्यवस्थापन तथा अनुगमन शाखा',
  FINANCE: 'आर्थिक प्रशासन शाखा',
  
  POLICY_MONITORING: 'नीति निर्माण तथा अनुगमन शाखा',
  INVESTIGATION: 'छानबिन, अन्वेषण तथा अनुगमन शाखा',
  LEGAL_ADVICE: 'कानूनी राय तथा परामर्श शाखा',
  ASSET_DECLARATION: 'सम्पत्ति विवरण तथा अनुगमन शाखा',
  
  POLICE_INFO_COLLECTION: 'सूचना संकलन तथा अन्वेषण शाखा',
  POLICE_MONITORING: 'निगरानी तथा अनुगमन शाखा',
  POLICE_MANAGEMENT: 'प्रहरी व्यवस्थापन शाखा',
  POLICE_INVESTIGATION: 'अन्वेषण तथा अनुगमन शाखा',
  
  TECHNICAL_1: 'प्राविधिक परीक्षण तथा अनुगमन शाखा १',
  TECHNICAL_2: 'प्राविधिक परीक्षण तथा अनुगमन शाखा २',
  TECHNICAL_3: 'प्राविधिक परीक्षण तथा अनुगमन शाखा ३',
  TECHNICAL_4: 'प्राविधिक परीक्षण तथा अनुगमन शाखा ४'
};

const DECISION_TYPES = {
  1: 'उजुरीका सम्बन्धमा केही गर्न नपर्ने',
  2: 'राय प्रतिक्रिया सहित कागजात माग गर्ने',
  3: 'छानबिन गरी राय सहितको प्रतिवेदन पेश गर्न लगाउने',
  4: 'छानविन तथा कारबाही गरी जानकारी दिन लेखी पठाउने',
  5: 'अख्तियार दुरुपयोग अनुसन्धान आयोगमा लेखि पठाउने',
  6: 'उजुरी अन्य निकायमा पठाउने',
  7: 'अन्य कार्य गर्ने'
};

const FINAL_DECISION_TYPES = {
  1: 'तामेली',
  2: 'सुझाव/निर्देशन दिने',
  3: 'सतर्क गर्ने',
  4: 'अन्य निर्णय'
};

const STATUS_TYPES = {
  PENDING: 'काम बाँकी',
  IN_PROGRESS: 'चालु',
  RESOLVED: 'फछ्रयौट',
};

// ==================== GLOBAL STATE ====================
const state = {
  currentUser: null,
  currentPage: CONFIG.DEFAULT_PAGE,
  currentShakha: null,
  notifications: [],
  complaints: [],
  projects: [],
  employeeMonitoring: [],
  citizenCharters: [],
  users: [],
  filters: {},
  currentView: 'dashboard',
  pagination: {
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0
  },
  useLocalData: false
};

// ==================== GLOBAL CHART STORAGE ====================
window.nvcCharts = {};

// ==================== HELPER FUNCTIONS (Date, Toast, Loading) ====================
function getCurrentNepaliDate() {
  const now = new Date();
  const year = 2026;
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function updateNepaliDate() {
  const now = new Date();
  const nepaliDateElement = document.getElementById('currentNepaliDate');
  if (!nepaliDateElement) return;
  
  const nepaliYear = 2082;
  const nepaliMonth = 10;
  const nepaliDay = 15 + Math.floor((now.getDate() % 30) / 2);
  const nepaliMonths = ["बैशाख", "जेठ", "असार", "साउन", "भदौ", "असोज", 
                        "कार्तिक", "मंसिर", "पुष", "माघ", "फागुन", "चैत"];
  const weekdays = ["आइतबार", "सोमबार", "मंगलबार", "बुधबार", 
                    "बिहीबार", "शुक्रबार", "शनिबार"];
  
  const monthName = nepaliMonths[nepaliMonth - 1] || "माघ";
  const dayName = weekdays[now.getDay()];
  nepaliDateElement.textContent = `${nepaliYear} ${monthName} ${nepaliDay}, ${dayName}`;
}

function updateDateTime() {
  const now = new Date();
  const dateTimeElement = document.getElementById('currentDateTime');
  if (dateTimeElement) {
    dateTimeElement.textContent = now.toLocaleString('ne-NP', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }
}

function showToast(message, type = 'info') {
  if (typeof Toastify !== 'undefined') {
    Toastify({
      text: message,
      duration: 3000,
      gravity: "top",
      position: "right",
      style: {
        background: type === 'error' ? '#d32f2f' : 
                  type === 'success' ? '#2e7d32' : 
                  type === 'warning' ? '#ff8f00' : '#0288d1'
      },
      stopOnFocus: true
    }).showToast();
  } else {
    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed; top: 20px; right: 20px; padding: 12px 20px;
      background-color: ${type === 'error' ? '#d32f2f' : type === 'success' ? '#2e7d32' : 
                         type === 'warning' ? '#ff8f00' : '#0288d1'};
      color: white; border-radius: 4px; z-index: 9999;
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }
}

function showLoadingIndicator(show) {
  let loadingDiv = document.getElementById('loadingIndicator');
  if (show) {
    if (!loadingDiv) {
      loadingDiv = document.createElement('div');
      loadingDiv.id = 'loadingIndicator';
      loadingDiv.style.cssText = `
        position: fixed; top: 0; left: 0; right: 0; bottom: 0;
        background-color: rgba(0,0,0,0.5); display: flex;
        align-items: center; justify-content: center; z-index: 9999;
        flex-direction: column;
      `;
      
      const spinner = document.createElement('div');
      spinner.style.cssText = `
        width: 50px; height: 50px; border: 5px solid #f3f3f3;
        border-top: 5px solid #3498db; border-radius: 50%;
        animation: spin 1s linear infinite;
      `;
      
      const text = document.createElement('div');
      text.style.cssText = `color: white; margin-top: 1rem; font-size: 1.2rem;`;
      text.textContent = 'डाटा लोड हुँदैछ...';
      
      loadingDiv.appendChild(spinner);
      loadingDiv.appendChild(text);
      document.body.appendChild(loadingDiv);
      
      if (!document.querySelector('style[data-spin]')) {
        const style = document.createElement('style');
        style.setAttribute('data-spin', 'true');
        style.textContent = `@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`;
        document.head.appendChild(style);
      }
    }
  } else if (loadingDiv) {
    loadingDiv.remove();
  }
}

function generateComplaintId() {
  const now = new Date();
  const year = now.getFullYear();
  const random = Math.floor(Math.random() * 9000 + 1000);
  return `NVC-${year}-${random}`;
}

// ==================== STYLESHEET & CHART LOADERS ====================
function ensureStylesheetsLoaded() {
  console.log('🎨 Checking stylesheets...');
  
  if (!document.querySelector('link[href*="bootstrap.min.css"]')) {
    const bootstrapCSS = document.createElement('link');
    bootstrapCSS.rel = 'stylesheet';
    bootstrapCSS.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css';
    document.head.appendChild(bootstrapCSS);
  }
  
  if (!document.querySelector('link[href*="font-awesome"]') && !document.querySelector('link[href*="fontawesome"]')) {
    const fontAwesome = document.createElement('link');
    fontAwesome.rel = 'stylesheet';
    fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css';
    document.head.appendChild(fontAwesome);
  }
}

function ensureChartJsLoaded() {
  return new Promise((resolve) => {
    if (typeof Chart !== 'undefined') {
      console.log('✅ Chart.js already loaded');
      resolve();
      return;
    }
    
    console.log('📥 Loading Chart.js...');
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js';
    script.onload = () => { console.log('✅ Chart.js loaded'); resolve(); };
    script.onerror = () => { console.error('❌ Failed to load Chart.js'); resolve(); };
    document.head.appendChild(script);
  });
}

function destroyAllCharts() {
  if (window.nvcCharts) {
    Object.keys(window.nvcCharts).forEach(key => {
      if (window.nvcCharts[key] && typeof window.nvcCharts[key].destroy === 'function') {
        try {
          window.nvcCharts[key].destroy();
        } catch (e) {}
        window.nvcCharts[key] = null;
      }
    });
  }
}

// ==================== NEPALI DATE API ====================
const NEPALI_DATE_API = {
  // API endpoints
  PRIMARY_API: 'https://api.nepalidate.com/v1/today',
  BACKUP_API: 'https://nepalidateapi.vercel.app/api/date',
  
  // हालको मिति स्टोर गर्ने
  currentNepaliDate: null,
  lastFetched: null,
  
  // API बाट मिति ल्याउने
  fetchFromAPI: async function() {
    // १ घण्टा भित्र फेच गरिसकेको भए क्यास प्रयोग गर्ने
    if (this.currentNepaliDate && this.lastFetched && 
        (Date.now() - this.lastFetched) < 3600000) {
      return this.currentNepaliDate;
    }
    
    // प्राइमरी API बाट प्रयास
    try {
      const response = await fetch(this.PRIMARY_API);
      if (response.ok) {
        const data = await response.json();
        this.currentNepaliDate = {
          bsYear: parseInt(data.year),
          bsMonth: parseInt(data.month),
          bsMonthName: data.month_name_np || CONFIG.NEPALI_MONTHS[parseInt(data.month)],
          bsDay: parseInt(data.day),
          bsDate: `${data.year} ${data.month_name_np || CONFIG.NEPALI_MONTHS[parseInt(data.month)]} ${data.day}`,
          dayOfWeek: data.weekday_np || this.getNepaliWeekday(new Date().getDay())
        };
        this.lastFetched = Date.now();
        return this.currentNepaliDate;
      }
    } catch (error) {
      console.warn('Primary Nepali Date API failed:', error);
    }
    
    // ब्याकअप API बाट प्रयास
    try {
      const response = await fetch(this.BACKUP_API);
      if (response.ok) {
        const data = await response.json();
        this.currentNepaliDate = {
          bsYear: parseInt(data.year),
          bsMonth: parseInt(data.month),
          bsMonthName: data.month_name_np || CONFIG.NEPALI_MONTHS[parseInt(data.month)],
          bsDay: parseInt(data.day),
          bsDate: `${data.year} ${data.month_name_np || CONFIG.NEPALI_MONTHS[parseInt(data.month)]} ${data.day}`,
          dayOfWeek: data.weekday_np || this.getNepaliWeekday(new Date().getDay())
        };
        this.lastFetched = Date.now();
        return this.currentNepaliDate;
      }
    } catch (error) {
      console.warn('Backup Nepali Date API failed:', error);
    }
    
    // दुबै API असफल भए गणना गर्ने
    return this.calculateNepaliDate(new Date());
  },
  
  // नेपाली वार दिने
  getNepaliWeekday: function(dayIndex) {
    const weekdays = ['आइतबार', 'सोमबार', 'मंगलबार', 'बुधबार', 'बिहीबार', 'शुक्रबार', 'शनिबार'];
    return weekdays[dayIndex];
  },
  
  // ग्रेगोरियन मितिलाई नेपाली मितिमा गणना गर्ने
  calculateNepaliDate: function(gregorianDate) {
    // २०८२ फागुन ३ गते = २०२६ फेब्रुअरी १४
    const baseDate = new Date(2026, 1, 14); // फेब्रुअरी १४, २०२६
    const targetDate = new Date(gregorianDate);
    
    const diffTime = targetDate - baseDate;
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    
    // बेस मिति: २०८२ फागुन ३
    let bsYear = 2082;
    let bsMonth = 11;
    let bsDay = 3 + diffDays;
    
    // महिना दिनहरू (नेपाली महिनामा ३०-३२ दिन)
    const monthDays = {
      1: 31,  // बैशाख
      2: 31,  // जेठ
      3: 32,  // असार
      4: 32,  // साउन
      5: 31,  // भदौ
      6: 31,  // असोज
      7: 30,  // कार्तिक
      8: 30,  // मंसिर
      9: 29,  // पुष
      10: 30, // माघ
      11: 30, // फागुन
      12: 30  // चैत
    };
    
    // महिना र दिन समायोजन
    while (bsDay > monthDays[bsMonth]) {
      bsDay -= monthDays[bsMonth];
      bsMonth++;
      if (bsMonth > 12) {
        bsMonth = 1;
        bsYear++;
      }
    }
    
    // दिन १ भन्दा कम भए समायोजन
    while (bsDay < 1) {
      bsMonth--;
      if (bsMonth < 1) {
        bsMonth = 12;
        bsYear--;
      }
      bsDay += monthDays[bsMonth];
    }
    
    return {
      bsYear: bsYear,
      bsMonth: bsMonth,
      bsMonthName: CONFIG.NEPALI_MONTHS[bsMonth],
      bsDay: bsDay,
      bsDate: `${bsYear} ${CONFIG.NEPALI_MONTHS[bsMonth]} ${bsDay}`,
      dayOfWeek: this.getNepaliWeekday(targetDate.getDay())
    };
  }
};

// ==================== NEPALI DATEPICKER ====================
// नेपाली पात्रो लोड गर्ने
async function loadNepaliDatepicker() {
  return new Promise((resolve, reject) => {
    if (window.NepaliDatepicker) {
      console.log('✅ Nepali Datepicker already loaded');
      resolve();
      return;
    }
    
    let loadedCount = 0;
    const totalToLoad = 2;
    
    const checkComplete = () => {
      loadedCount++;
      if (loadedCount === totalToLoad) {
        console.log('✅ Nepali Datepicker loaded successfully');
        resolve();
      }
    };
    
    // CSS लोड गर्ने
    if (!document.querySelector('link[href*="nepali-datepicker.min.css"]')) {
      const cssLink = document.createElement('link');
      cssLink.rel = 'stylesheet';
      cssLink.href = 'https://cdn.jsdelivr.net/npm/nepali-datepicker@2.0.0/dist/css/nepali-datepicker.min.css';
      cssLink.onload = checkComplete;
      cssLink.onerror = () => {
        console.warn('⚠️ Nepali Datepicker CSS failed to load');
        checkComplete(); // अघि बढ्ने
      };
      document.head.appendChild(cssLink);
    } else {
      checkComplete();
    }
    
    // JS लोड गर्ने
    if (!document.querySelector('script[src*="nepali-datepicker.min.js"]')) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/nepali-datepicker@2.0.0/dist/js/nepali-datepicker.min.js';
      script.onload = checkComplete;
      script.onerror = () => {
        console.warn('⚠️ Nepali Datepicker JS failed to load');
        checkComplete(); // अघि बढ्ने
      };
      document.head.appendChild(script);
    } else {
      checkComplete();
    }
    
    // ५ सेकेन्ड पछि टाइमआउट
    setTimeout(() => {
      if (loadedCount < totalToLoad) {
        console.warn('⚠️ Nepali Datepicker load timeout');
        resolve(); // अघि बढ्ने
      }
    }, 5000);
  });
}

// नेपाली डेटपिकर इनिसियलाइज गर्ने
async function initializeNepaliDatepicker() {
  await loadNepaliDatepicker();
  
  if (window.NepaliDatepicker) {
    try {
      document.querySelectorAll('.nepali-datepicker-input').forEach(input => {
        if (!input.dataset.ndpInitialized) {
          window.NepaliDatepicker.init(input, {
            language: 'nepali',
            dateFormat: 'YYYY MMMM DD',
            npdMonth: true,
            npdYear: true,
            npdYearCount: 10,
            onChange: function(value) {
              console.log('Date selected:', value);
              // मिति परिवर्तन भएपछि हिन्ट अपडेट गर्ने
              const hint = input.nextElementSibling;
              if (hint?.classList?.contains('nepali-hint')) {
                hint.innerHTML = `📅 चयन गरिएको मिति: ${value}`;
              }
            }
          });
          input.dataset.ndpInitialized = 'true';
          
          // हिन्ट थप्ने
          if (!input.nextElementSibling?.classList?.contains('nepali-hint')) {
            const hint = document.createElement('small');
            hint.className = 'nepali-hint text-muted d-block mt-1';
            hint.innerHTML = `📅 चयन गरिएको मिति: ${input.value}`;
            input.parentNode.insertBefore(hint, input.nextSibling);
          }
        }
      });
    } catch (e) {
      console.warn('⚠️ Nepali Datepicker init error:', e);
      useFallbackDatepicker();
    }
  } else {
    useFallbackDatepicker();
  }
}

// फलब्याक डेटपिकर
function useFallbackDatepicker() {
  document.querySelectorAll('.nepali-datepicker-input').forEach(async input => {
    if (!input.value) {
      const nepaliDate = await getCurrentNepaliDate();
      input.value = nepaliDate;
    }
    
    // इनपुट क्लिक गर्दा साधारण प्रम्प्ट देखाउने
    input.addEventListener('click', function(e) {
      const currentDate = this.value || '';
      const newDate = prompt('नेपाली मिति प्रविष्ट गर्नुहोस् (जस्तै: २०८२ फागुन ३)', currentDate);
      if (newDate) {
        this.value = newDate;
        // हिन्ट अपडेट गर्ने
        const hint = this.nextElementSibling;
        if (hint?.classList?.contains('nepali-hint')) {
          hint.innerHTML = `📅 चयन गरिएको मिति: ${newDate}`;
        }
      }
    });
    
    // हिन्ट थप्ने
    if (!input.nextElementSibling?.classList?.contains('nepali-hint')) {
      const hint = document.createElement('small');
      hint.className = 'nepali-hint text-muted d-block mt-1';
      hint.innerHTML = `📅 चयन गरिएको मिति: ${input.value}`;
      input.parentNode.insertBefore(hint, input.nextSibling);
    }
  });
}

// ==================== NEPALI DATE FUNCTIONS ====================
async function getCurrentNepaliDate() {
  try {
    const nepaliDate = await NEPALI_DATE_API.fetchFromAPI();
    return nepaliDate.bsDate;
  } catch (error) {
    console.error('Error getting Nepali date:', error);
    const calculatedDate = NEPALI_DATE_API.calculateNepaliDate(new Date());
    return calculatedDate.bsDate;
  }
}

async function getCurrentNepaliDateObject() {
  try {
    return await NEPALI_DATE_API.fetchFromAPI();
  } catch (error) {
    console.error('Error getting Nepali date object:', error);
    return NEPALI_DATE_API.calculateNepaliDate(new Date());
  }
}

async function updateNepaliDate() {
  const nepaliDateElement = document.getElementById('currentNepaliDate');
  if (!nepaliDateElement) return;
  
  try {
    const nepaliDate = await getCurrentNepaliDateObject();
    nepaliDateElement.textContent = `${nepaliDate.bsDate}, ${nepaliDate.dayOfWeek}`;
    
    // सबै डेटपिकर इनपुटहरू अपडेट गर्ने (यदि खाली छन् भने)
    document.querySelectorAll('.nepali-datepicker-input').forEach(input => {
      if (!input.value) {
        input.value = nepaliDate.bsDate;
        const hint = input.nextElementSibling;
        if (hint?.classList?.contains('nepali-hint')) {
          hint.innerHTML = `📅 चयन गरिएको मिति: ${nepaliDate.bsDate}`;
        }
      }
    });
  } catch (error) {
    console.error('Error updating Nepali date:', error);
  }
}

// ==================== HELPER FUNCTIONS (Date, Toast, Loading) ====================
function updateDateTime() {
  const now = new Date();
  const dateTimeElement = document.getElementById('currentDateTime');
  if (dateTimeElement) {
    dateTimeElement.textContent = now.toLocaleString('ne-NP', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }
}

// ==================== GOOGLE SHEETS API FUNCTIONS ====================
// ==================== GET FROM GOOGLE SHEETS - ULTIMATE FIXED ====================
async function getFromGoogleSheets(action, params = {}) {
  // Sheets disabled छ भने
  if (!GOOGLE_SHEETS_CONFIG.ENABLED) {
    console.log('ℹ️ Google Sheets disabled');
    return { success: false, data: [], message: 'Integration disabled' };
  }
  
  // API Key check
  if (!GOOGLE_SHEETS_CONFIG.API_KEY) {
    console.error('❌ API Key is missing');
    return { success: false, data: [], message: 'API Key is missing' };
  }
  
  // Web App URL check
  if (!GOOGLE_SHEETS_CONFIG.WEB_APP_URL || 
      GOOGLE_SHEETS_CONFIG.WEB_APP_URL.includes('script.google.com/macros/s/') === false) {
    console.error('❌ Invalid Web App URL');
    return { success: false, data: [], message: 'Invalid Web App URL' };
  }
  
  return new Promise((resolve) => {
    try {
      // ========== 1. URL बनाउने ==========
      let url = GOOGLE_SHEETS_CONFIG.WEB_APP_URL;
      
      // Add action
      url += `?action=${encodeURIComponent(action)}`;
      
      // 🔥 CRITICAL: API Key हरेक request मा पठाउनै पर्छ
      url += `&apiKey=${encodeURIComponent(GOOGLE_SHEETS_CONFIG.API_KEY)}`;
      
      // Add all parameters
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
          url += `&${encodeURIComponent(key)}=${encodeURIComponent(String(params[key]))}`;
        }
      });
      
      // ========== 2. JSONP Callback ==========
      const callbackName = `jsonp_${action}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      url += `&callback=${callbackName}`;
      
      console.log(`📡 JSONP Request [${action}]`, url.substring(0, 200) + '...');
      
      let isResolved = false;
      let retryCount = 0;
      
      // ========== 3. Timeout ==========
      const timeout = setTimeout(() => {
        if (!isResolved) {
          console.error(`❌ JSONP Timeout [${action}] after ${GOOGLE_SHEETS_CONFIG.TIMEOUT}ms`);
          cleanup();
          
          // Retry logic
          if (retryCount < (GOOGLE_SHEETS_CONFIG.MAX_RETRIES || 3)) {
            retryCount++;
            console.log(`🔄 Retry ${retryCount}/${GOOGLE_SHEETS_CONFIG.MAX_RETRIES} for ${action}`);
            setTimeout(() => {
              // नयाँ callback name बनाउने
              const newCallback = `${callbackName}_retry${retryCount}`;
              url = url.replace(/&callback=[^&]+/, `&callback=${newCallback}`);
              
              window[newCallback] = window[callbackName];
              script.src = url;
              document.head.appendChild(script);
            }, GOOGLE_SHEETS_CONFIG.RETRY_DELAY * retryCount);
          } else {
            resolve({ 
              success: false, 
              data: [], 
              message: 'Timeout after retries',
              action: action 
            });
          }
        }
      }, GOOGLE_SHEETS_CONFIG.TIMEOUT || 30000);
      
      // ========== 4. Cleanup function ==========
      const cleanup = () => {
        clearTimeout(timeout);
        try {
          if (window[callbackName]) {
            delete window[callbackName];
          }
          if (script && script.parentNode) {
            script.parentNode.removeChild(script);
          }
        } catch (e) {}
      };
      
      // ========== 5. JSONP Callback Function ==========
      window[callbackName] = function(response) {
        if (isResolved) return;
        isResolved = true;
        cleanup();
        
        console.log(`📨 JSONP Response [${action}] received`, response ? '✅' : '❌');
        
        // 🔥 CRITICAL: Apps Script बाट आउने विभिन्न response formats ह्यान्डल गर्ने
        let formattedResponse = response || { success: false, data: [] };
        
        // Case 1: सीधै array आयो भने
        if (Array.isArray(formattedResponse)) {
          formattedResponse = {
            success: true,
            data: formattedResponse,
            count: formattedResponse.length
          };
        }
        
        // Case 2: { data: [...] } आयो भने
        else if (formattedResponse.data && Array.isArray(formattedResponse.data) && 
                 formattedResponse.success === undefined) {
          formattedResponse.success = true;
        }
        
        // Case 3: success flag नै छैन भने
        else if (formattedResponse.success === undefined) {
          formattedResponse.success = !!formattedResponse.data || !!formattedResponse.id;
        }
        
        resolve(formattedResponse);
      };
      
      // ========== 6. Create Script Tag ==========
      const script = document.createElement('script');
      script.src = url;
      script.async = true;
      
      script.onerror = function(error) {
        if (isResolved) return;
        console.error(`❌ JSONP Network Error [${action}]:`, error);
        
        // Retry on network error
        if (retryCount < (GOOGLE_SHEETS_CONFIG.MAX_RETRIES || 3)) {
          retryCount++;
          console.log(`🔄 Retry ${retryCount}/${GOOGLE_SHEETS_CONFIG.MAX_RETRIES} for ${action} (network error)`);
          setTimeout(() => {
            const newScript = document.createElement('script');
            newScript.src = url;
            newScript.async = true;
            newScript.onerror = script.onerror;
            document.head.appendChild(newScript);
          }, GOOGLE_SHEETS_CONFIG.RETRY_DELAY * retryCount);
        } else {
          isResolved = true;
          cleanup();
          resolve({ 
            success: false, 
            data: [], 
            message: 'Network error after retries',
            action: action 
          });
        }
      };
      
      document.head.appendChild(script);
      
    } catch (error) {
      console.error(`❌ JSONP Exception [${action}]:`, error);
      resolve({ 
        success: false, 
        data: [], 
        message: error.toString(),
        action: action 
      });
    }
  });
}

// ==================== POST TO GOOGLE SHEETS - FIXED ====================
async function postToGoogleSheets(action, data = {}) {
  // Sheets disabled छ भने local storage मा save गर्ने
  if (!GOOGLE_SHEETS_CONFIG.ENABLED) {
    console.log('ℹ️ Google Sheets disabled - saving locally');
    return { 
      success: true, 
      message: 'Data saved locally (Google Sheets disabled)',
      id: data.id || generateComplaintId(),
      local: true 
    };
  }
  
  return new Promise((resolve) => {
    try {
      // ========== 1. URL बनाउने ==========
      let url = GOOGLE_SHEETS_CONFIG.WEB_APP_URL;
      url += `?action=${encodeURIComponent(action)}`;
      url += `&apiKey=${encodeURIComponent(GOOGLE_SHEETS_CONFIG.API_KEY)}`;
      
      // 🔥 CRITICAL: सबै data fields URL मा append गर्ने
      const fieldsToSend = {};
      
      // ID हरू
      if (data.id) fieldsToSend.id = data.id;
      if (data.complaintId) fieldsToSend.complaintId = data.complaintId;
      
      // Complaint related fields
      if (data.date) fieldsToSend.date = data.date;
      if (data.complainant) fieldsToSend.complainant = data.complainant;
      if (data.complainantName) fieldsToSend.complainantName = data.complainantName;
      if (data.accused) fieldsToSend.accused = data.accused;
      if (data.accusedName) fieldsToSend.accusedName = data.accusedName;
      if (data.description) fieldsToSend.description = data.description;
      if (data.complaintDescription) fieldsToSend.complaintDescription = data.complaintDescription;
      
      // शाखा र महाशाखा
      if (data.shakha) fieldsToSend.shakha = data.shakha;
      if (data.shakhaName) fieldsToSend.shakhaName = data.shakhaName;
      if (data.shakhaCode) fieldsToSend.shakhaCode = data.shakhaCode;
      if (data.mahashakha) fieldsToSend.mahashakha = data.mahashakha;
      if (data.mahashakhaName) fieldsToSend.mahashakhaName = data.mahashakhaName;
      if (data.mahashakhaCode) fieldsToSend.mahashakhaCode = data.mahashakhaCode;
      
      // Status र निर्णयहरू
      if (data.status) fieldsToSend.status = data.status;
      if (data.proposedDecision) fieldsToSend.proposedDecision = data.proposedDecision;
      if (data.decision) fieldsToSend.decision = data.decision;
      if (data.finalDecision) fieldsToSend.finalDecision = data.finalDecision;
      if (data.remarks) fieldsToSend.remarks = data.remarks;
      if (data.source) fieldsToSend.source = data.source;
      if (data.committeeDecision) fieldsToSend.committeeDecision = data.committeeDecision;
      
      // मितिहरू
      if (data.correspondenceDate) fieldsToSend.correspondenceDate = data.correspondenceDate;
      if (data.assignedDate) fieldsToSend.assignedDate = data.assignedDate;
      if (data.investigationDate) fieldsToSend.investigationDate = data.investigationDate;
      
      // अन्य
      if (data.assignedShakha) fieldsToSend.assignedShakha = data.assignedShakha;
      if (data.investigationDetails) fieldsToSend.investigationDetails = data.investigationDetails;
      if (data.createdBy) fieldsToSend.createdBy = data.createdBy;
      if (data.updatedBy) fieldsToSend.updatedBy = data.updatedBy;
      
      // Project fields
      if (data.name) fieldsToSend.name = data.name;
      if (data.organization) fieldsToSend.organization = data.organization;
      if (data.inspectionDate) fieldsToSend.inspectionDate = data.inspectionDate;
      if (data.nonCompliances) fieldsToSend.nonCompliances = data.nonCompliances;
      if (data.improvementLetterDate) fieldsToSend.improvementLetterDate = data.improvementLetterDate;
      if (data.improvementInfo) fieldsToSend.improvementInfo = data.improvementInfo;
      
      // Employee Monitoring fields
      if (data.uniformViolation) fieldsToSend.uniformViolation = data.uniformViolation;
      if (data.timeViolation) fieldsToSend.timeViolation = data.timeViolation;
      if (data.instructionDate) fieldsToSend.instructionDate = data.instructionDate;
      
      // Citizen Charter fields
      if (data.findings) fieldsToSend.findings = data.findings;
      if (data.instructions) fieldsToSend.instructions = data.instructions;
      
      // URL मा fields append गर्ने
      Object.keys(fieldsToSend).forEach(key => {
        const value = fieldsToSend[key];
        if (value !== undefined && value !== null && value !== '') {
          url += `&${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`;
        }
      });
      
      // ========== 2. JSONP Callback ==========
      const callbackName = `post_${action}_${Date.now()}`;
      url += `&callback=${callbackName}`;
      
      console.log(`📤 JSONP POST [${action}]`, Object.keys(fieldsToSend).join(', '));
      
      let isResolved = false;
      
      // ========== 3. Timeout ==========
      const timeout = setTimeout(() => {
        if (!isResolved) {
          console.warn(`⚠️ JSONP POST timeout [${action}] - assuming success`);
          isResolved = true;
          delete window[callbackName];
          if (script.parentNode) script.parentNode.removeChild(script);
          
          // Timeout भए पनि success मान्ने (किनकि data पुगेको हुन सक्छ)
          resolve({ 
            success: true, 
            message: 'Request sent (timeout - likely successful)',
            id: data.id,
            timeout: true 
          });
        }
      }, 15000);
      
      // ========== 4. JSONP Callback ==========
      window[callbackName] = function(response) {
        if (isResolved) return;
        isResolved = true;
        clearTimeout(timeout);
        
        delete window[callbackName];
        if (script.parentNode) script.parentNode.removeChild(script);
        
        console.log(`📨 JSONP POST Response [${action}]`, response ? '✅' : '⚠️');
        
        // Response format normalize गर्ने
        let formattedResponse = response || { success: true, id: data.id };
        
        if (formattedResponse.success === undefined) {
          formattedResponse.success = true;
        }
        
        resolve(formattedResponse);
      };
      
      // ========== 5. Create Script Tag ==========
      const script = document.createElement('script');
      script.src = url;
      script.async = true;
      
      script.onerror = function(error) {
        if (isResolved) return;
        console.error(`❌ JSONP POST Network Error [${action}]:`, error);
        
        isResolved = true;
        clearTimeout(timeout);
        delete window[callbackName];
        if (script.parentNode) script.parentNode.removeChild(script);
        
        // Network error भए पनि local मा save गर्ने
        resolve({ 
          success: false, 
          message: 'Network error - saved locally',
          id: data.id,
          local: true,
          error: error.toString()
        });
      };
      
      document.head.appendChild(script);
      
    } catch (error) {
      console.error(`❌ JSONP POST Exception [${action}]:`, error);
      resolve({ 
        success: false, 
        message: error.message,
        id: data.id,
        local: true 
      });
    }
  });
}

// ==================== LOAD DATA FROM GOOGLE SHEETS - ULTIMATE FIXED ====================
// ==================== LOAD DATA FROM GOOGLE SHEETS - COMPLETE REWRITE ====================
// ==================== LOAD DATA FROM GOOGLE SHEETS - ULTIMATE FIXED ====================
// ==================== LOAD DATA FROM GOOGLE SHEETS - ULTIMATE FIXED ====================
async function loadDataFromGoogleSheets(forceReload = false) {
  console.log('🚀 ===== LOAD DATA FROM GOOGLE SHEETS STARTED =====');
  
  // Prevent multiple simultaneous loads
  if (window._isLoadingData && !forceReload) {
    console.log('⚠️ Already loading data, skipping...');
    return window._lastLoadResult || false;
  }
  
  if (!GOOGLE_SHEETS_CONFIG.ENABLED) {
    console.log('ℹ️ Google Sheets disabled');
    return false;
  }
  
  // Check Web App URL
  if (!GOOGLE_SHEETS_CONFIG.WEB_APP_URL || 
      !GOOGLE_SHEETS_CONFIG.WEB_APP_URL.includes('script.google.com/macros/s/')) {
    console.error('❌ Invalid Web App URL');
    showToast('❌ Google Sheets URL सही छैन', 'error');
    return false;
  }
  
  window._isLoadingData = true;
  showLoadingIndicator(true);
  
  try {
    // ===== STEP 1: TEST CONNECTION =====
    console.log('📡 Testing connection...');
    const testResponse = await getFromGoogleSheets('test');
    
    console.log('📨 Test response:', testResponse);
    
    if (!testResponse || !testResponse.success) {
      console.error('❌ Connection test failed');
      showToast('❌ Google Sheets connection failed', 'error');
      window._isLoadingData = false;
      showLoadingIndicator(false);
      return false;
    }
    
    console.log('✅ Connection test successful');
    
    // ===== STEP 2: LOAD COMPLAINTS =====
    console.log('📡 Loading complaints...');
    const response = await getFromGoogleSheets('getComplaints');
    
    console.log('📨 Complaints response received');
    
    // ===== STEP 3: EXTRACT DATA FROM RESPONSE =====
    let complaintsData = [];
    
    // 🔥 CRITICAL FIX: Apps Script बाट आउने response format हेर्ने
    if (response) {
      // Case 1: { success: true, data: [...] } (Standard format)
      if (response.success === true && Array.isArray(response.data)) {
        complaintsData = response.data;
        console.log(`✅ Case 1: ${complaintsData.length} complaints from response.data`);
      }
      // Case 2: Array directly
      else if (Array.isArray(response)) {
        complaintsData = response;
        console.log(`✅ Case 2: ${complaintsData.length} complaints from array`);
      }
      // Case 3: { data: [...] } without success flag
      else if (response.data && Array.isArray(response.data)) {
        complaintsData = response.data;
        console.log(`✅ Case 3: ${complaintsData.length} complaints from response.data`);
      }
      // Case 4: Unknown format - try to find any array
      else {
        console.warn('⚠️ Unknown response format, trying to find array...');
        for (let key in response) {
          if (Array.isArray(response[key])) {
            complaintsData = response[key];
            console.log(`✅ Found array in key "${key}": ${complaintsData.length} items`);
            break;
          }
        }
      }
    }
    
    console.log(`📊 Raw complaints data count: ${complaintsData.length}`);
    
    // ===== STEP 4: FORMAT COMPLAINTS =====
    const formattedComplaints = [];
    
    for (const item of complaintsData) {
      try {
        const formatted = formatComplaintFromSheet(item);
        if (formatted && formatted.id) {
          formatted.syncedToSheets = true;
          formattedComplaints.push(formatted);
        } else if (formatted) {
          console.warn('⚠️ Formatted complaint missing ID:', formatted);
        }
      } catch (e) {
        console.warn('⚠️ Error formatting complaint:', e);
      }
    }
    
    console.log(`✅ Formatted ${formattedComplaints.length} complaints`);
    
    // ===== STEP 5: UPDATE STATE =====
    if (formattedComplaints.length > 0) {
      // 🔥 CRITICAL: पुरानो data replace गर्ने, not merge
      state.complaints = formattedComplaints;
      
      console.log(`✅ State updated: ${state.complaints.length} complaints`);
      console.log('📋 First complaint sample:', state.complaints[0]);
      
      // Save to localStorage as backup
      try {
        localStorage.setItem('nvc_complaints_backup', JSON.stringify(state.complaints));
        localStorage.setItem('nvc_complaints_backup_time', new Date().toISOString());
        console.log('✅ Backed up to localStorage');
      } catch (e) {
        console.warn('⚠️ Could not save to localStorage:', e);
      }
      
      showToast(`✅ ${state.complaints.length} उजुरीहरू लोड भयो`, 'success');
      
      // ===== STEP 6: UPDATE UI =====
      if (state.currentPage === 'dashboardPage' || state.currentPage === 'dashboard') {
        if (typeof updateStats === 'function') {
          updateStats();
        }
        
        // Reinitialize charts
        setTimeout(() => {
          if (typeof destroyAllCharts === 'function') {
            destroyAllCharts();
          }
          if (typeof initializeDashboardCharts === 'function') {
            initializeDashboardCharts();
          }
        }, 300);
      }
      
      // Update current view if it's complaints view
      if (state.currentView === 'complaints' || state.currentView === 'all_complaints') {
        showComplaintsView();
      }
      
      // Update sync button
      if (typeof updateSyncButton === 'function') {
        updateSyncButton();
      }
      
      window._isLoadingData = false;
      showLoadingIndicator(false);
      window._lastLoadResult = true;
      return true;
      
    } else {
      console.warn('⚠️ No complaints data found in response');
      
      // Try localStorage as fallback
      const localStorageLoaded = loadFromLocalStorage();
      
      if (localStorageLoaded) {
        showToast(`📦 LocalStorage बाट ${state.complaints.length} उजुरीहरू लोड भयो`, 'info');
        
        // Update current view if it's complaints view
        if (state.currentView === 'complaints' || state.currentView === 'all_complaints') {
          showComplaintsView();
        }
        
        window._isLoadingData = false;
        showLoadingIndicator(false);
        window._lastLoadResult = true;
        return true;
      }
      
      window._isLoadingData = false;
      showLoadingIndicator(false);
      window._lastLoadResult = false;
      return false;
    }
    
  } catch (error) {
    console.error('❌ Fatal error loading from Google Sheets:', error);
    showToast('❌ डाटा लोड गर्दा त्रुटि', 'error');
    
    // Try localStorage as fallback
    const localStorageLoaded = loadFromLocalStorage();
    
    if (localStorageLoaded && (state.currentView === 'complaints' || state.currentView === 'all_complaints')) {
      showComplaintsView();
    }
    
    window._isLoadingData = false;
    showLoadingIndicator(false);
    window._lastLoadResult = localStorageLoaded;
    return localStorageLoaded;
  }
}

// ==================== GET DATA FROM GOOGLE SHEETS ====================
async function getData(dataType = 'complaints', params = {}) {
  console.log(`📡 getData() called for: ${dataType}`);
  
  switch(dataType) {
    case 'complaints':
      return await getFromGoogleSheets('getComplaints', params);
    case 'projects':
      return await getFromGoogleSheets('getProjects', params);
    case 'employee_monitoring':
      return await getFromGoogleSheets('getEmployeeMonitoring', params);
    case 'citizen_charter':
      return await getFromGoogleSheets('getCitizenCharter', params);
    default:
      return { success: false, data: [], message: 'Invalid data type' };
  }
}

// ==================== SAVE DATA TO GOOGLE SHEETS ====================
async function saveData(dataType, data) {
  console.log(`📝 saveData() called for: ${dataType}`);
  
  let action = '';
  
  switch(dataType) {
    case 'complaint':
      action = 'saveComplaint';
      break;
    case 'project':
      action = 'saveProject';
      break;
    case 'employee_monitoring':
      action = 'saveEmployeeMonitoring';
      break;
    case 'citizen_charter':
      action = 'saveCitizenCharter';
      break;
    default:
      return { success: false, message: 'Invalid data type' };
  }
  
  return await postToGoogleSheets(action, data);
}

// ==================== SUBMIT FORM ====================
async function submitForm(formType, formData) {
  console.log(`📋 submitForm() called for: ${formType}`);
  
  showLoadingIndicator(true);
  
  let result;
  
  switch(formType) {
    case 'complaint':
      result = await saveNewComplaint(formData);
      break;
    case 'project':
      result = await saveTechnicalProject(formData);
      break;
    case 'employee_monitoring':
      result = await saveEmployeeMonitoring(formData);
      break;
    case 'citizen_charter':
      result = await saveCitizenCharter(formData);
      break;
    default:
      showToast('Invalid form type', 'error');
      showLoadingIndicator(false);
      return false;
  }
  
  showLoadingIndicator(false);
  return result;
}

// ==================== REFRESH DATA ====================
// ==================== REFRESH DATA - ULTIMATE FIXED ====================
async function refreshData() {
  console.log('🔄 refreshData() called');
  
  if (!state.currentUser) {
    showToast('कृपया पहिला लगइन गर्नुहोस्', 'warning');
    return false;
  }
  
  showLoadingIndicator(true);
  showToast('🔄 डाटा रिफ्रेस हुँदैछ...', 'info');
  
  try {
    // Clear loading flag
    window._isLoadingData = false;
    
    // Force reload from Google Sheets
    const loaded = await loadDataFromGoogleSheets(true);
    
    if (loaded) {
      showToast(`✅ ${state.complaints.length} उजुरीहरू लोड भयो`, 'success');
      
      // Update current view based on state.currentView
      if (state.currentView === 'complaints' || state.currentView === 'all_complaints') {
        showComplaintsView();
      } else if (state.currentView === 'dashboard' || state.currentPage === 'dashboardPage') {
        if (typeof updateStats === 'function') updateStats();
        if (typeof initializeDashboardCharts === 'function') {
          setTimeout(() => {
            destroyAllCharts();
            initializeDashboardCharts();
          }, 300);
        }
      } else if (state.currentView === 'technical_projects') {
        showTechnicalProjectsView();
      } else if (state.currentView === 'employee_monitoring') {
        showEmployeeMonitoringView();
      } else if (state.currentView === 'citizen_charter') {
        showCitizenCharterView();
      }
      
      return true;
    } else {
      showToast('⚠️ डाटा लोड हुन सकेन', 'warning');
      return false;
    }
  } catch (error) {
    console.error('❌ Refresh error:', error);
    showToast('❌ रिफ्रेस गर्दा त्रुटि', 'error');
    return false;
  } finally {
    showLoadingIndicator(false);
  }
}

// ==================== WINDOW ONLOAD - ENSURE EVERYTHING LOADS ====================
window.onload = function() {
  console.log('🚀 window.onload triggered');
  
  // Hide loading indicator if visible
  if (typeof showLoadingIndicator === 'function') {
    showLoadingIndicator(false);
  }
  
  // Initialize app if not already initialized
  if (!window._appInitialized) {
    initializeApp();
    window._appInitialized = true;
  }
  
  // Add refresh button to topbar
  addRefreshButton();
};

// Also keep DOMContentLoaded as backup
document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 DOMContentLoaded triggered');
  
  // Only initialize if not already done by window.onload
  if (!window._appInitialized) {
    setTimeout(() => {
      if (!window._appInitialized) {
        initializeApp();
        window._appInitialized = true;
      }
    }, 100);
  }
});

// ==================== ADD REFRESH BUTTON ====================
function addRefreshButton() {
  const topbar = document.querySelector('.d-flex.align-center.gap-2, .user-info, .topbar-right');
  if (!topbar) return;
  
  if (!document.getElementById('refreshDataBtn')) {
    const refreshBtn = document.createElement('button');
    refreshBtn.id = 'refreshDataBtn';
    refreshBtn.className = 'btn btn-sm btn-outline-primary ms-2';
    refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Refresh';
    refreshBtn.addEventListener('click', refreshData);
    refreshBtn.title = 'Google Sheets बाट डाटा रिफ्रेस गर्नुहोस्';
    topbar.appendChild(refreshBtn);
  }
}

// ==================== TEST GOOGLE SHEETS CONNECTION - FIXED ====================
async function testGoogleSheetsConnection() {
  console.log('🧪 Testing Google Sheets connection...');
  showToast('🔄 Google Sheets connection testing...', 'info');
  
  // Web App URL check
  if (!GOOGLE_SHEETS_CONFIG.WEB_APP_URL || 
      GOOGLE_SHEETS_CONFIG.WEB_APP_URL.includes('script.google.com/macros/s/') === false) {
    const errorMsg = '❌ Web App URL सही छैन। कृपया Apps Script बाट नयाँ Deployment गर्नुहोस्।';
    console.error(errorMsg);
    showToast(errorMsg, 'error');
    return false;
  }
  
  try {
    const response = await getFromGoogleSheets('test');
    
    if (response && response.success === true) {
      console.log('✅ Google Sheets connection successful!', response);
      showToast('✅ Google Sheets connection successful!', 'success');
      
      // Spreadsheet access status देखाउने
      if (response.spreadsheetAccess) {
        console.log('📊 Spreadsheet access:', response.spreadsheetAccess);
        if (response.spreadsheetAccess.includes('inaccessible')) {
          showToast('⚠️ Spreadsheet access issue: ' + response.spreadsheetAccess, 'warning');
        }
      }
      
      return true;
    } else {
      console.error('❌ Google Sheets connection failed:', response);
      showToast('❌ Connection failed: ' + (response?.message || 'Unknown error'), 'error');
      return false;
    }
  } catch (error) {
    console.error('❌ Connection test error:', error);
    showToast('❌ Connection error: ' + error.message, 'error');
    return false;
  }
}

// ==================== DATA FORMATTING ====================
// ==================== FORMAT COMPLAINT FROM SHEET - ENHANCED ====================
// ==================== FORMAT COMPLAINT FROM SHEET - COMPLETE FIX ====================
function formatComplaintFromSheet(sheetData) {
  if (!sheetData) return null;
  
  try {
    // सबै सम्भावित नामहरूबाट डाटा लिने
    const complaint = {
      // ID
      id: sheetData['उजुरी दर्ता नं'] || 
          sheetData['शिकायत नं'] || 
          sheetData['Complaint ID'] || 
          sheetData.id || 
          sheetData.complaintId || 
          '',
      
      // Date
      date: sheetData['दर्ता मिति'] || 
            sheetData['मिति'] || 
            sheetData.date || 
            '',
      
      // Complainant
      complainant: sheetData['उजुरीकर्ताको नाम'] || 
                   sheetData['उजुरकर्ता'] || 
                   sheetData.complainant || 
                   sheetData.complainantName || 
                   '',
      
      // Accused
      accused: sheetData['विपक्षी'] || 
               sheetData.accused || 
               sheetData.accusedName || 
               '',
      
      // Description
      description: sheetData['उजुरीको संक्षिप्त विवरण'] || 
                   sheetData['विवरण'] || 
                   sheetData.description || 
                   sheetData.complaintDescription || 
                   '',
      
      // Shakha
      shakha: sheetData['सम्बन्धित शाखा'] || 
              sheetData['शाखा'] || 
              sheetData.shakha || 
              sheetData.shakhaName || 
              '',
      
      // Mahashakha
      mahashakha: sheetData['महाशाखा'] || 
                  sheetData.mahashakha || 
                  sheetData.mahashakhaName || 
                  '',
      
      // Status
      status: sheetData['स्थिति'] || 
              sheetData.status || 
              'pending',
      
      // Proposed Decision
      proposedDecision: sheetData['प्रस्तावित निर्णय'] || 
                        sheetData.proposedDecision || 
                        '',
      
      // Decision
      decision: sheetData['अन्तिम निर्णय'] || 
                sheetData.decision || 
                sheetData.finalDecision || 
                '',
      
      // Remarks
      remarks: sheetData['कैफियत'] || 
               sheetData.remarks || 
               '',
      
      // Source
      source: sheetData['उजुरीको माध्यम'] || 
              sheetData.source || 
              'internal',
      
      // Committee Decision
      committeeDecision: sheetData['समितिको निर्णय'] || 
                         sheetData.committeeDecision || 
                         '',
      
      // Correspondence Date
      correspondenceDate: sheetData['पत्राचार मिति'] || 
                          sheetData.correspondenceDate || 
                          '',
      
      // Investigation Details
      investigationDetails: sheetData['छानबिनको विवरण'] || 
                            sheetData.investigationDetails || 
                            '',
      
      // Assigned Shakha
      assignedShakha: sheetData['सम्बन्धित शाखा'] || 
                      sheetData.assignedShakha || 
                      '',
      
      // Assigned Date
      assignedDate: sheetData['शाखामा पठाएको मिति'] || 
                    sheetData.assignedDate || 
                    '',
      
      // Created By
      createdBy: sheetData['सिर्जना गर्ने'] || 
                 sheetData.createdBy || 
                 '',
      
      // Created At
      createdAt: sheetData['सिर्जना मिति'] || 
                 sheetData.createdAt || 
                 '',
      
      // Updated By
      updatedBy: sheetData['अपडेट गर्ने'] || 
                 sheetData.updatedBy || 
                 '',
      
      // Updated At
      updatedAt: sheetData['अपडेट मिति'] || 
                 sheetData.updatedAt || 
                 '',
      
      syncedToSheets: true
    };
    
    // खाली fields लाई '' बनाउने
    Object.keys(complaint).forEach(key => {
      if (complaint[key] === undefined || complaint[key] === null) {
        complaint[key] = '';
      }
    });
    
    return complaint;
    
  } catch (error) {
    console.error('❌ Error formatting complaint:', error);
    return null;
  }
}

// ==================== CHECK ALL REQUIRED DOM ELEMENTS ====================
function checkRequiredElements() {
  console.log('🔍 Checking required DOM elements...');
  
  const requiredElements = [
    'contentArea',
    'pageTitle',
    'complaintModal',
    'shakhaModal',
    'loginPage',
    'mainPage',
    'dashboardPage'
  ];
  
  const missing = [];
  
  requiredElements.forEach(id => {
    if (!document.getElementById(id)) {
      missing.push(id);
      console.warn(`⚠️ Missing element: #${id}`);
    }
  });
  
  if (missing.length === 0) {
    console.log('✅ All required DOM elements found');
  } else {
    console.warn(`⚠️ Missing ${missing.length} elements:`, missing);
  }
  
  return missing.length === 0;
}

// ==================== LOCAL STORAGE ====================
function loadFromLocalStorage() {
  try {
    const savedComplaints = localStorage.getItem('nvc_complaints_backup');
    if (savedComplaints) {
      const complaints = JSON.parse(savedComplaints);
      if (Array.isArray(complaints) && complaints.length > 0) {
        state.complaints = complaints;
        console.log(`✅ Loaded ${state.complaints.length} complaints from localStorage`);
        showToast(`📦 LocalStorage बाट ${state.complaints.length} उजुरीहरू लोड भयो`, 'info');
        return true;
      }
    }
  } catch (e) {
    console.error('❌ Error loading from localStorage:', e);
  }
  if (!state.complaints) state.complaints = [];
  return false;
}

function backupToLocalStorage() {
  try {
    localStorage.setItem('nvc_complaints_backup', JSON.stringify(state.complaints));
  } catch (e) {
    console.warn('⚠️ Could not save to localStorage:', e);
  }
}

// ==================== GOOGLE SHEETS DATA LOADING ====================
// ==================== LOAD DATA FROM GOOGLE SHEETS - ULTIMATE FIXED VERSION ====================
async function loadDataFromGoogleSheets() {
  console.log('🚀 ===== LOAD DATA FROM GOOGLE SHEETS STARTED =====');
  
  if (!GOOGLE_SHEETS_CONFIG.ENABLED) {
    console.log('ℹ️ Google Sheets disabled');
    return false;
  }
  
  try {
    // ========== STEP 1: TEST CONNECTION ==========
    console.log('📡 Step 1: Testing connection...');
    const testResponse = await getFromGoogleSheets('test');
    
    if (!testResponse || !testResponse.success) {
      console.error('❌ Connection test failed:', testResponse);
      showToast('❌ Google Sheets connection failed', 'error');
      return false;
    }
    
    console.log('✅ Connection test successful');
    
    // ========== STEP 2: LOAD COMPLAINTS ==========
    console.log('📡 Step 2: Loading complaints...');
    const complaintsResponse = await getFromGoogleSheets('getComplaints');
    
    console.log('📨 Complaints response received');
    
    // ========== STEP 3: PROCESS COMPLAINTS DATA ==========
    let complaintsLoaded = false;
    
    if (complaintsResponse) {
      let complaintsData = [];
      
      // 🔥 CRITICAL FIX: विभिन्न प्रकारका responses ह्यान्डल गर्ने
      if (complaintsResponse.success === true && Array.isArray(complaintsResponse.data)) {
        // Case 1: { success: true, data: [...] }
        complaintsData = complaintsResponse.data;
        console.log(`✅ Case 1: ${complaintsData.length} complaints from response.data`);
      } else if (Array.isArray(complaintsResponse)) {
        // Case 2: सीधै array
        complaintsData = complaintsResponse;
        console.log(`✅ Case 2: ${complaintsData.length} complaints from array response`);
      } else if (complaintsResponse.data && Array.isArray(complaintsResponse.data)) {
        // Case 3: { data: [...] }
        complaintsData = complaintsResponse.data;
        console.log(`✅ Case 3: ${complaintsData.length} complaints from response.data`);
      } else {
        console.warn('⚠️ Unknown response format:', complaintsResponse);
      }
      
      // Format each complaint
      const formattedComplaints = [];
      for (const item of complaintsData) {
        try {
          const formatted = formatComplaintFromSheet(item);
          if (formatted) {
            formattedComplaints.push(formatted);
          }
        } catch (e) {
          console.warn('⚠️ Error formatting complaint:', e);
        }
      }
      
      console.log(`✅ Formatted ${formattedComplaints.length} complaints`);
      
      // 🔥 CRITICAL FIX: STATE UPDATE - पुरानो data replace गर्ने
      if (formattedComplaints.length > 0) {
        state.complaints = formattedComplaints;
        
        // सबै complaint लाई syncedToSheets = true set गर्ने
        state.complaints.forEach(c => { 
          c.syncedToSheets = true; 
        });
        
        console.log(`✅ State updated with ${state.complaints.length} complaints`);
        
        // LocalStorage मा backup राख्ने
        try {
          localStorage.setItem('nvc_complaints_backup', JSON.stringify(state.complaints));
          console.log('✅ Backed up to localStorage');
        } catch (e) {
          console.warn('⚠️ Could not save to localStorage:', e);
        }
        
        complaintsLoaded = true;
      } else {
        console.warn('⚠️ No complaints data found');
      }
    }
    
    // ========== STEP 4: LOAD PROJECTS ==========
    try {
      console.log('📡 Loading projects...');
      const projectsResponse = await getFromGoogleSheets('getProjects');
      
      if (projectsResponse) {
        let projectsData = [];
        
        if (projectsResponse.success === true && Array.isArray(projectsResponse.data)) {
          projectsData = projectsResponse.data;
        } else if (Array.isArray(projectsResponse)) {
          projectsData = projectsResponse;
        }
        
        if (projectsData.length > 0) {
          state.projects = projectsData;
          console.log(`✅ Loaded ${state.projects.length} projects`);
        }
      }
    } catch (e) {
      console.warn('⚠️ Could not load projects:', e);
    }
    
    // ========== STEP 5: LOAD EMPLOYEE MONITORING ==========
    try {
      console.log('📡 Loading employee monitoring...');
      const empResponse = await getFromGoogleSheets('getEmployeeMonitoring');
      
      if (empResponse) {
        let empData = [];
        
        if (empResponse.success === true && Array.isArray(empResponse.data)) {
          empData = empResponse.data;
        } else if (Array.isArray(empResponse)) {
          empData = empResponse;
        }
        
        if (empData.length > 0) {
          state.employeeMonitoring = empData;
          console.log(`✅ Loaded ${state.employeeMonitoring.length} employee monitoring records`);
        }
      }
    } catch (e) {
      console.warn('⚠️ Could not load employee monitoring:', e);
    }
    
    // ========== STEP 6: LOAD CITIZEN CHARTER ==========
    try {
      console.log('📡 Loading citizen charter...');
      const ccResponse = await getFromGoogleSheets('getCitizenCharter');
      
      if (ccResponse) {
        let ccData = [];
        
        if (ccResponse.success === true && Array.isArray(ccResponse.data)) {
          ccData = ccResponse.data;
        } else if (Array.isArray(ccResponse)) {
          ccData = ccResponse;
        }
        
        if (ccData.length > 0) {
          state.citizenCharters = ccData;
          console.log(`✅ Loaded ${state.citizenCharters.length} citizen charter records`);
        }
      }
    } catch (e) {
      console.warn('⚠️ Could not load citizen charter:', e);
    }
    
    // ========== STEP 7: UPDATE UI ==========
    if (state.currentPage === 'dashboardPage') {
      if (typeof updateStats === 'function') {
        updateStats();
      }
      
      if (typeof destroyAllCharts === 'function' && typeof initializeDashboardCharts === 'function') {
        setTimeout(() => {
          destroyAllCharts();
          initializeDashboardCharts();
        }, 300);
      }
    }
    
    if (complaintsLoaded) {
      showToast(`✅ ${state.complaints.length} उजुरीहरू लोड भयो`, 'success');
    } else {
      // Fallback: localStorage बाट load गर्ने
      const localStorageLoaded = loadFromLocalStorage();
      if (localStorageLoaded) {
        showToast(`📦 LocalStorage बाट ${state.complaints.length} उजुरीहरू लोड भयो`, 'info');
        return true;
      }
    }
    
    console.log('🏁 ===== LOAD DATA FROM GOOGLE SHEETS COMPLETED =====');
    return complaintsLoaded;
    
  } catch (error) {
    console.error('❌ Error loading from Google Sheets:', error);
    showToast('❌ Google Sheets बाट डाटा लोड हुन सकेन', 'error');
    
    // Fallback: localStorage बाट load गर्ने
    return loadFromLocalStorage();
  }
}

// ==================== DATA SYNCING ====================
// ==================== SYNC ALL DATA TO GOOGLE SHEETS - FIXED ====================
async function syncAllDataToGoogleSheets() {
  // Unsynced complaints फेला पार्ने
  const unsyncedComplaints = state.complaints.filter(c => !c.syncedToSheets);
  
  if (unsyncedComplaints.length === 0) {
    showToast('✅ सबै डाटा पहिले नै sync भइसकेको छ', 'success');
    return { success: true, synced: 0, failed: 0 };
  }
  
  showLoadingIndicator(true);
  showToast(`🔄 ${unsyncedComplaints.length} वटा उजुरी sync गर्दै...`, 'info');
  
  let success = 0;
  let failed = 0;
  
  for (const complaint of unsyncedComplaints) {
    try {
      console.log(`🔄 Syncing complaint: ${complaint.id}`);
      
      // Save data तयार पार्ने
      const saveData = {
        id: complaint.id,
        complaintId: complaint.id,
        date: complaint.date,
        complainant: complaint.complainant,
        complainantName: complaint.complainant,
        accused: complaint.accused || '',
        accusedName: complaint.accused || '',
        description: complaint.description,
        complaintDescription: complaint.description,
        proposedDecision: complaint.proposedDecision || '',
        remarks: complaint.remarks || '',
        status: complaint.status || 'pending',
        shakha: complaint.shakha || '',
        shakhaName: complaint.shakha || '',
        mahashakha: complaint.mahashakha || '',
        mahashakhaName: complaint.mahashakha || '',
        source: complaint.source || 'internal',
        createdBy: complaint.createdBy || '',
        decision: complaint.decision || '',
        finalDecision: complaint.finalDecision || ''
      };
      
      const result = await postToGoogleSheets('saveComplaint', saveData);
      
      if (result && (result.success === true || result.id)) {
        complaint.syncedToSheets = true;
        success++;
        console.log(`✅ Synced: ${complaint.id}`);
      } else {
        failed++;
        console.warn(`⚠️ Failed: ${complaint.id}`, result);
      }
    } catch (e) {
      failed++;
      console.error(`❌ Error syncing ${complaint.id}:`, e);
    }
    
    // Rate limiting को लागि delay
    await new Promise(resolve => setTimeout(resolve, 300));
  }
  
  // Backup to localStorage
  try {
    backupToLocalStorage();
  } catch (e) {}
  
  showLoadingIndicator(false);
  
  if (success > 0) {
    showToast(`✅ ${success} सफल, ❌ ${failed} असफल`, success > 0 ? 'success' : 'warning');
  } else {
    showToast(`❌ कुनै पनि sync हुन सकेन`, 'error');
  }
  
  updateSyncButton();
  
  return { success, failed };
}

// ==================== UPDATE SYNC BUTTON - FIXED ====================
function updateSyncButton() {
  const syncBtn = document.getElementById('syncSheetsBtn');
  if (!syncBtn) return;
  
  // Unsynced complaints count
  const unsyncedCount = state.complaints ? 
    state.complaints.filter(c => !c.syncedToSheets).length : 0;
  
  syncBtn.innerHTML = `<i class="fas fa-sync"></i> Sync (${unsyncedCount})`;
  syncBtn.classList.remove('btn-warning', 'btn-success', 'btn-secondary');
  
  if (unsyncedCount === 0) {
    syncBtn.classList.add('btn-success');
    syncBtn.title = 'सबै डाटा sync भइसकेको छ';
  } else {
    syncBtn.classList.add('btn-warning');
    syncBtn.title = `${unsyncedCount} वटा उजुरी sync गर्न बाँकी`;
  }
  
  // Disable/enable button
  syncBtn.disabled = false;
}

// ==================== COMPLAINT SAVE/UPDATE FUNCTIONS ====================
// ==================== SAVE NEW COMPLAINT - FIXED ====================
async function saveNewComplaint() {
  console.log('📝 saveNewComplaint() called');
  
  // ========== 1. FORM DATA COLLECT ==========
  const complaintId = document.getElementById('complaintId')?.value || '';
  const complaintDate = document.getElementById('complaintDate')?.value;
  const complainantName = document.getElementById('complainantName')?.value;
  const accusedName = document.getElementById('accusedName')?.value;
  const complaintDescription = document.getElementById('complaintDescription')?.value;
  const proposedDecision = document.getElementById('proposedDecision')?.value;
  const complaintRemarks = document.getElementById('complaintRemarks')?.value;
  const complaintStatus = document.getElementById('complaintStatus')?.value || 'pending';
  
  // ========== 2. VALIDATION ==========
  if (!complaintDate) { 
    showToast('कृपया दर्ता मिति भर्नुहोस्', 'warning'); 
    return; 
  }
  if (!complainantName) { 
    showToast('कृपया उजुरकर्ताको नाम भर्नुहोस्', 'warning'); 
    return; 
  }
  if (!complaintDescription) { 
    showToast('कृपया उजुरीको विवरण भर्नुहोस्', 'warning'); 
    return; 
  }
  if (!state.currentUser) { 
    showToast('कृपया पहिला लगइन गर्नुहोस्', 'error'); 
    return; 
  }
  
  showLoadingIndicator(true);
  showToast('🔄 उजुरी सेभ गर्दै...', 'info');
  
  // ========== 3. PREPARE DATA ==========
  const finalId = complaintId || generateComplaintId();
  
  // शाखा र महाशाखाको नाम (user बाट)
  let shakhaName = '';
  let mahashakhaName = '';
  
  if (state.currentUser) {
    if (state.currentUser.shakha) {
      shakhaName = SHAKHA[state.currentUser.shakha] || state.currentUser.shakha;
    }
    if (state.currentUser.mahashakha) {
      mahashakhaName = MAHASHAKHA[state.currentUser.mahashakha] || state.currentUser.mahashakha;
    }
  }
  
  // 🔥 CRITICAL: Apps Script ले बुझ्ने field names प्रयोग गर्ने
  const complaintData = {
    // ID
    id: finalId,
    complaintId: finalId,
    
    // Date
    date: complaintDate,
    
    // Person details
    complainant: complainantName,
    complainantName: complainantName,
    accused: accusedName || '',
    accusedName: accusedName || '',
    
    // Description
    description: complaintDescription,
    complaintDescription: complaintDescription,
    
    // Decision & Status
    proposedDecision: proposedDecision || '',
    remarks: complaintRemarks || '',
    status: complaintStatus,
    
    // Shakha & Mahashakha (Names, not codes)
    shakha: shakhaName,
    shakhaName: shakhaName,
    mahashakha: mahashakhaName,
    mahashakhaName: mahashakhaName,
    
    // Metadata
    source: 'internal',
    createdBy: state.currentUser.name || state.currentUser.id || 'Unknown',
    
    // Codes for reference
    shakhaCode: state.currentUser.shakha || '',
    mahashakhaCode: state.currentUser.mahashakha || ''
  };
  
  console.log('📦 Complaint data prepared:', Object.keys(complaintData).join(', '));
  
  // ========== 4. SAVE TO GOOGLE SHEETS ==========
  const result = await postToGoogleSheets('saveComplaint', complaintData);
  
  console.log('📨 Save result:', result);
  
  // ========== 5. CREATE LOCAL COMPLAINT OBJECT ==========
  const newComplaint = {
    id: finalId,
    date: complaintDate,
    complainant: complainantName,
    accused: accusedName || '',
    description: complaintDescription,
    proposedDecision: proposedDecision || '',
    remarks: complaintRemarks || '',
    status: complaintStatus,
    shakha: shakhaName,
    mahashakha: mahashakhaName,
    createdBy: state.currentUser?.name || '',
    createdAt: new Date().toISOString(),
    syncedToSheets: result?.success === true,
    source: 'internal'
  };
  
  // ========== 6. UPDATE STATE ==========
  state.complaints.unshift(newComplaint);
  
  // ========== 7. BACKUP TO LOCALSTORAGE ==========
  try {
    backupToLocalStorage();
  } catch (e) {}
  
  showLoadingIndicator(false);
  
  // ========== 8. SHOW MESSAGE ==========
  if (result?.success === true) {
    showToast('✅ उजुरी Google Sheet मा सेभ भयो', 'success');
  } else if (result?.local === true) {
    showToast('⚠️ उजुरी Local मा मात्र सेभ भयो', 'warning');
  } else {
    showToast('⚠️ उजुरी Local मा सेभ भयो (Sync पछि हुनेछ)', 'info');
  }
  
  // ========== 9. RESET FORM ==========
  const form = document.querySelector('form');
  if (form) form.reset();
  
  const dateField = document.getElementById('complaintDate');
  if (dateField) dateField.value = getCurrentNepaliDate();
  
  // ========== 10. UPDATE UI ==========
  updateSyncButton();
  
  // Show complaints view after 1.5 seconds
  setTimeout(() => { 
    showComplaintsView(); 
  }, 1500);
}

// ==================== SAVE EDITED COMPLAINT - FIXED ====================
async function saveEditedComplaint(complaintId) {
  console.log('✏️ saveEditedComplaint() called for ID:', complaintId);
  
  // ========== 1. FORM DATA COLLECT ==========
  const status = document.getElementById('editComplaintStatus')?.value;
  const decision = document.getElementById('editComplaintDecision')?.value;
  const remarks = document.getElementById('editComplaintRemarks')?.value;
  const proposedDecision = document.getElementById('editProposedDecision')?.value;
  const finalDecision = document.getElementById('editFinalDecision')?.value;
  
  // ========== 2. VALIDATION ==========
  if (!status) { 
    showToast('कृपया स्थिति चयन गर्नुहोस्', 'warning'); 
    return; 
  }
  
  showLoadingIndicator(true);
  
  // ========== 3. PREPARE UPDATE DATA ==========
  const updateData = {
    id: complaintId,
    complaintId: complaintId,
    status: status,
    remarks: remarks || '',
    updatedBy: state.currentUser?.name || ''
  };
  
  // Optional fields
  if (decision) updateData.decision = decision;
  if (proposedDecision) updateData.proposedDecision = proposedDecision;
  if (finalDecision) updateData.finalDecision = finalDecision;
  
  console.log('📦 Update data:', Object.keys(updateData).join(', '));
  
  // ========== 4. UPDATE IN GOOGLE SHEETS ==========
  const result = await postToGoogleSheets('updateComplaint', updateData);
  
  console.log('📨 Update result:', result);
  
  // ========== 5. UPDATE STATE ==========
  const index = state.complaints.findIndex(c => c.id === complaintId);
  if (index !== -1) {
    state.complaints[index] = {
      ...state.complaints[index],
      status: status,
      decision: decision || state.complaints[index].decision,
      proposedDecision: proposedDecision || state.complaints[index].proposedDecision,
      finalDecision: finalDecision || state.complaints[index].finalDecision,
      remarks: remarks || state.complaints[index].remarks,
      updatedAt: new Date().toISOString(),
      updatedBy: state.currentUser?.name,
      syncedToSheets: result?.success === true
    };
  }
  
  // ========== 6. BACKUP TO LOCALSTORAGE ==========
  try {
    backupToLocalStorage();
  } catch (e) {}
  
  showLoadingIndicator(false);
  
  // ========== 7. SHOW MESSAGE ==========
  if (result?.success === true) {
    showToast('✅ उजुरी अपडेट गरियो', 'success');
  } else {
    showToast('⚠️ Local मा मात्र अपडेट भयो', 'warning');
  }
  
  // ========== 8. UPDATE UI ==========
  closeModal();
  updateSyncButton();
  
  // Current view update गर्ने
  if (state.currentView === 'complaints' || state.currentView === 'all_complaints') {
    showComplaintsView();
  } else {
    showComplaintsView();
  }
}

async function saveComplaintToGoogleSheets(complaintData) {
  if (!GOOGLE_SHEETS_CONFIG.ENABLED || state.useLocalData) {
    const newComplaint = {
      id: complaintData.id || generateComplaintId(),
      date: complaintData.date || getCurrentNepaliDate(),
      complainant: complaintData.complainant || '',
      accused: complaintData.accused || '',
      description: complaintData.description || '',
      shakha: complaintData.shakha || state.currentUser?.shakha || '',
      mahashakha: complaintData.mahashakha || '',
      status: complaintData.status || 'pending',
      proposedDecision: complaintData.proposedDecision || '',
      decision: complaintData.decision || '',
      remarks: complaintData.remarks || '',
      source: complaintData.source || 'internal',
      createdBy: state.currentUser?.name || '',
      createdAt: new Date().toISOString()
    };
    state.complaints.unshift(newComplaint);
    return { success: true, message: 'Complaint saved locally', id: newComplaint.id };
  }
  
  try {
    const result = await postToGoogleSheets('saveComplaint', {
      id: complaintData.id, date: complaintData.date,
      complainant: complaintData.complainant, accused: complaintData.accused,
      description: complaintData.description,
      shakha: complaintData.shakha || state.currentUser?.shakha,
      mahashakha: complaintData.mahashakha,
      status: complaintData.status || 'pending',
      proposedDecision: complaintData.proposedDecision,
      finalDecision: complaintData.decision,
      remarks: complaintData.remarks,
      source: complaintData.source || 'internal',
      createdBy: state.currentUser?.name
    });
    
    if (result.success) {
      const newComplaint = {
        id: result.id || complaintData.id, date: complaintData.date,
        complainant: complaintData.complainant, accused: complaintData.accused,
        description: complaintData.description,
        shakha: complaintData.shakha || state.currentUser?.shakha,
        mahashakha: complaintData.mahashakha,
        status: complaintData.status || 'pending',
        proposedDecision: complaintData.proposedDecision,
        decision: complaintData.decision,
        remarks: complaintData.remarks,
        source: complaintData.source || 'internal'
      };
      state.complaints.unshift(newComplaint);
    }
    return result;
  } catch (error) {
    console.error('Error saving complaint:', error);
    return saveComplaintToGoogleSheets({ ...complaintData, useLocal: true });
  }
}

async function updateComplaintInGoogleSheets(complaintId, updateData) {
  if (!GOOGLE_SHEETS_CONFIG.ENABLED || state.useLocalData) {
    const index = state.complaints.findIndex(c => c.id === complaintId);
    if (index !== -1) {
      state.complaints[index] = { ...state.complaints[index], ...updateData };
      return { success: true, message: 'Complaint updated locally' };
    }
    return { success: false, message: 'Complaint not found' };
  }
  
  try {
    const result = await postToGoogleSheets('updateComplaint', {
      id: complaintId, status: updateData.status,
      finalDecision: updateData.decision,
      remarks: updateData.remarks,
      updatedBy: state.currentUser?.name
    });
    
    if (result.success) {
      const index = state.complaints.findIndex(c => c.id === complaintId);
      if (index !== -1) {
        state.complaints[index] = { ...state.complaints[index], ...updateData };
      }
    }
    return result;
  } catch (error) {
    console.error('Error updating complaint:', error);
    return updateComplaintInGoogleSheets(complaintId, { ...updateData, useLocal: true });
  }
}

// ==================== PROJECT FUNCTIONS ====================
async function saveProjectToGoogleSheets(projectData) {
  if (!GOOGLE_SHEETS_CONFIG.ENABLED || state.useLocalData) {
    const newProject = {
      id: projectData.id || `P-${new Date().getFullYear()}-${state.projects.length + 1}`,
      name: projectData.name, organization: projectData.organization,
      inspectionDate: projectData.inspectionDate,
      nonCompliances: projectData.nonCompliances,
      improvementLetterDate: projectData.improvementLetterDate,
      improvementInfo: projectData.improvementInfo,
      status: projectData.status || 'pending',
      remarks: projectData.remarks,
      shakha: projectData.shakha || state.currentUser?.shakha,
      createdBy: state.currentUser?.name,
      createdAt: new Date().toISOString()
    };
    state.projects.unshift(newProject);
    return { success: true, message: 'Project saved locally' };
  }
  
  try {
    const result = await postToGoogleSheets('saveProject', {
      name: projectData.name, organization: projectData.organization,
      inspectionDate: projectData.inspectionDate,
      nonCompliances: projectData.nonCompliances,
      improvementLetterDate: projectData.improvementLetterDate,
      improvementInfo: projectData.improvementInfo,
      status: projectData.status || 'pending',
      remarks: projectData.remarks,
      shakha: projectData.shakha || state.currentUser?.shakha,
      createdBy: state.currentUser?.name
    });
    
    if (result.success) {
      const newProject = {
        id: result.id || projectData.id, name: projectData.name,
        organization: projectData.organization,
        inspectionDate: projectData.inspectionDate,
        nonCompliances: projectData.nonCompliances,
        improvementLetterDate: projectData.improvementLetterDate,
        improvementInfo: projectData.improvementInfo,
        status: projectData.status || 'pending',
        remarks: projectData.remarks,
        shakha: projectData.shakha || state.currentUser?.shakha
      };
      state.projects.unshift(newProject);
    }
    return result;
  } catch (error) {
    console.error('Error saving project:', error);
    return saveProjectToGoogleSheets({ ...projectData, useLocal: true });
  }
}

async function saveTechnicalProject() {
  const name = document.getElementById('projectName')?.value;
  const organization = document.getElementById('projectOrganization')?.value;
  const inspectionDate = document.getElementById('projectInspectionDate')?.value;
  const nonCompliances = document.getElementById('projectNonCompliances')?.value;
  const improvementLetterDate = document.getElementById('projectImprovementLetterDate')?.value;
  const status = document.getElementById('projectStatus')?.value;
  const improvementInfo = document.getElementById('projectImprovementInfo')?.value;
  const remarks = document.getElementById('projectRemarks')?.value;
  
  if (!name || !organization || !inspectionDate || !nonCompliances) {
    showToast('कृपया आवश्यक फिल्डहरू भर्नुहोस्', 'warning');
    return;
  }
  
  showLoadingIndicator(true);
  
  const projectData = {
    name, organization, inspectionDate, nonCompliances,
    improvementLetterDate, status, improvementInfo, remarks,
    shakha: state.currentUser?.shakha
  };
  
  const result = await saveProjectToGoogleSheets(projectData);
  
  showLoadingIndicator(false);
  
  if (result.success) {
    showToast('आयोजना सफलतापूर्वक सेभ गरियो', 'success');
    closeModal();
    showTechnicalProjectsView();
  } else {
    showToast(`आयोजना सेभ गर्दा त्रुटि: ${result.message}`, 'error');
  }
}

// ==================== UI BUTTONS ====================
function addGoogleSheetsButtons() {
  const topbar = document.querySelector('.d-flex.align-center.gap-2, .user-info, .topbar-right');
  if (!topbar) return;
  
  if (!document.getElementById('testSheetsBtn')) {
    const testBtn = document.createElement('button');
    testBtn.id = 'testSheetsBtn';
    testBtn.className = 'btn btn-sm btn-outline-primary ms-2';
    testBtn.innerHTML = '<i class="fas fa-plug"></i> Test Sheets';
    testBtn.addEventListener('click', testGoogleSheetsConnection);
    topbar.appendChild(testBtn);
  }
  
  if (!document.getElementById('syncSheetsBtn')) {
    const unsyncedCount = state.complaints?.filter(c => !c.syncedToSheets).length || 0;
    const syncBtn = document.createElement('button');
    syncBtn.id = 'syncSheetsBtn';
    syncBtn.className = `btn btn-sm ${unsyncedCount === 0 ? 'btn-success' : 'btn-warning'} ms-2`;
    syncBtn.innerHTML = `<i class="fas fa-sync"></i> Sync (${unsyncedCount})`;
    syncBtn.addEventListener('click', syncAllDataToGoogleSheets);
    topbar.appendChild(syncBtn);
  }
}

// ==================== PRINT COMPLAINT ====================
function printComplaint(complaintId) {
  const complaint = state.complaints.find(c => c.id === complaintId);
  if (!complaint) return;
  
  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>उजुरी दर्ता - ${complaint.id}</title>
      <style>
        body { font-family: 'Arial', sans-serif; padding: 40px; }
        .header { text-align: center; margin-bottom: 30px; }
        .title { font-size: 24px; font-weight: bold; }
        .subtitle { font-size: 16px; color: #666; }
        .content { margin-top: 30px; }
        .row { display: flex; margin-bottom: 15px; }
        .label { width: 200px; font-weight: bold; }
        .value { flex: 1; }
        .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #999; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="title">राष्ट्रिय सतर्कता केन्द्र</div>
        <div class="subtitle">उजुरी दर्ता प्रमाणपत्र</div>
      </div>
      <div class="content">
        <div class="row"><div class="label">दर्ता नं:</div><div class="value">${complaint.id}</div></div>
        <div class="row"><div class="label">दर्ता मिति:</div><div class="value">${complaint.date}</div></div>
        <div class="row"><div class="label">उजुरकर्ताको नाम:</div><div class="value">${complaint.complainant}</div></div>
        <div class="row"><div class="label">विपक्षी:</div><div class="value">${complaint.accused || '-'}</div></div>
        <div class="row"><div class="label">उजुरीको विवरण:</div><div class="value">${complaint.description}</div></div>
        <div class="row"><div class="label">सम्बन्धित शाखा:</div><div class="value">${complaint.shakha || '-'}</div></div>
        <div class="row"><div class="label">स्थिति:</div><div class="value">${complaint.status === 'pending' ? 'काम बाँकी' : complaint.status === 'progress' ? 'चालु' : 'फछ्रयौट'}</div></div>
      </div>
      <div class="footer">
        <p>यो प्रमाणपत्र राष्ट्रिय सतर्कता केन्द्रको प्रणालीबाट स्वचालित रूपमा जारी गरिएको हो।</p>
        <p>मिति: ${new Date().toLocaleString('ne-NP')}</p>
      </div>
    </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.print();
}

// ==================== REPORT GENERATION ====================
async function generateReportFromGoogleSheets(reportType, params = {}) {
  if (!GOOGLE_SHEETS_CONFIG.ENABLED || state.useLocalData) {
    return generateReportFromLocalData(reportType, params);
  }
  
  try {
    const result = await postToGoogleSheets('generateReport', params);
    if (result.success) {
      return { success: true, data: result.data, statistics: result.statistics, generatedAt: result.generatedAt };
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('Error generating report from Google Sheets:', error);
    return generateReportFromLocalData(reportType, params);
  }
}

function generateReportFromLocalData(reportType, params) {
  let data = [];
  let statistics = {};
  
  switch(reportType) {
    case 'monthly':
      const currentDate = new Date();
      data = state.complaints.filter(c => {
        const complaintDate = new Date(c.date);
        return complaintDate.getMonth() === currentDate.getMonth() && 
               complaintDate.getFullYear() === currentDate.getFullYear();
      });
      break;
    case 'shakha':
      data = params.shakha ? state.complaints.filter(c => c.shakha === params.shakha) : state.complaints;
      break;
    case 'custom':
      data = state.complaints.filter(c => {
        let include = true;
        if (params.startDate && params.endDate) include = include && (c.date >= params.startDate && c.date <= params.endDate);
        if (params.status) include = include && (c.status === params.status);
        if (params.shakha) include = include && (c.shakha === params.shakha);
        return include;
      });
      break;
    case 'summary':
      statistics = {
        total: state.complaints.length,
        pending: state.complaints.filter(c => c.status === 'pending').length,
        progress: state.complaints.filter(c => c.status === 'progress').length,
        resolved: state.complaints.filter(c => c.status === 'resolved').length,
        closed: state.complaints.filter(c => c.status === 'closed').length
      };
      statistics.resolutionRate = statistics.total > 0 ? Math.round((statistics.resolved / statistics.total) * 100) : 0;
      break;
  }
  
  if (reportType !== 'summary') {
    statistics = {
      total: data.length,
      pending: data.filter(c => c.status === 'pending').length,
      progress: data.filter(c => c.status === 'progress').length,
      resolved: data.filter(c => c.status === 'resolved').length,
      closed: data.filter(c => c.status === 'closed').length
    };
    statistics.resolutionRate = statistics.total > 0 ? Math.round((statistics.resolved / statistics.total) * 100) : 0;
  }
  
  return { success: true, data, statistics, generatedAt: new Date().toISOString() };
}

async function generateCustomReport() {
  const startDate = document.getElementById('reportStartDate')?.value;
  const endDate = document.getElementById('reportEndDate')?.value;
  const status = document.getElementById('reportStatus')?.value;
  const shakha = document.getElementById('reportShakha')?.value || '';
  
  if (!startDate || !endDate) {
    showToast('कृपया मिति उल्लेख गर्नुहोस्', 'warning');
    return;
  }
  
  showLoadingIndicator(true);
  
  const params = { startDate, endDate, status: status || '', shakha };
  const result = await generateReportFromGoogleSheets('custom', params);
  
  showLoadingIndicator(false);
  
  if (result.success && result.data.length > 0) {
    exportReportToExcel(result.data, `कस्टम रिपोर्ट ${startDate} देखि ${endDate} सम्म`);
  } else {
    showToast('उल्लेखित अवधिमा कुनै उजुरी भेटिएन', 'info');
  }
}

// ==================== EXPORT FUNCTIONS ====================
function exportReportToExcel(data, reportName) {
  if (data.length === 0) {
    showToast('एक्स्पोर्ट गर्न डाटा उपलब्ध छैन', 'warning');
    return;
  }
  
  const headers = Object.keys(data[0]);
  let csvContent = headers.join(',') + '\n';
  
  data.forEach(row => {
    const values = headers.map(header => {
      const value = row[header];
      return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
    });
    csvContent += values.join(',') + '\n';
  });
  
  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  const filename = `${reportName.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0,10)}.csv`;
  
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  showToast(`रिपोर्ट ${filename} मा डाउनलोड भयो`, 'success');
}

function exportToExcel(type) {
  let data = [];
  let filename = '';
  
  switch(type) {
    case 'complaints':
      data = state.currentUser.role === 'admin' ? state.complaints : 
             state.complaints.filter(c => c.shakha === state.currentUser.shakha);
      filename = `उजुरीहरू_${new Date().toISOString().slice(0,10)}.csv`;
      break;
    case 'all_complaints':
      data = state.complaints;
      filename = `सबै_उजुरीहरू_${new Date().toISOString().slice(0,10)}.csv`;
      break;
    case 'hello_sarkar':
      data = state.complaints.filter(c => c.source === 'hello_sarkar');
      filename = `हेलो_सरकारबाट_प्राप्त_उजुरीहरू_${new Date().toISOString().slice(0,10)}.csv`;
      break;
    case 'technical_projects':
      data = state.projects.filter(p => p.shakha === state.currentUser.shakha);
      filename = `विकास_योजनाहरू_${new Date().toISOString().slice(0,10)}.csv`;
      break;
    case 'employee_monitoring':
      data = state.employeeMonitoring;
      filename = `कार्यालय_अनुगमन_${new Date().toISOString().slice(0,10)}.csv`;
      break;
    case 'recent':
      data = state.complaints.slice(0, 10);
      filename = `हालैका_उजुरीहरू_${new Date().toISOString().slice(0,10)}.csv`;
      break;
    case 'shakha_reports':
    case 'shakha_stats':
      const shakhaStats = {};
      state.complaints.forEach(complaint => {
        const shakha = complaint.shakha || 'अन्य';
        if (!shakhaStats[shakha]) shakhaStats[shakha] = { total: 0, pending: 0, progress: 0, resolved: 0, closed: 0 };
        shakhaStats[shakha].total++;
        if (complaint.status === 'pending') shakhaStats[shakha].pending++;
        if (complaint.status === 'progress') shakhaStats[shakha].progress++;
        if (complaint.status === 'resolved') shakhaStats[shakha].resolved++;
        if (complaint.status === 'closed') shakhaStats[shakha].closed++;
      });
      
      data = Object.keys(shakhaStats).map(shakha => {
        const stats = shakhaStats[shakha];
        const resolutionRate = stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0;
        return {
          शाखा: shakha, 'कूल उजुरी': stats.total, 'काम बाँकी': stats.pending,
          'चालु': stats.progress, 'फछ्रयौट': stats.resolved,
          'फछ्रयौट दर': resolutionRate + '%'
        };
      });
      filename = `शाखा_रिपोर्ट_${new Date().toISOString().slice(0,10)}.csv`;
      break;
    default:
      data = state.complaints;
      filename = `डाटा_${new Date().toISOString().slice(0,10)}.csv`;
  }
  
  if (data.length === 0) {
    showToast('डाटा छैन', 'warning');
    return;
  }
  
  const headers = Object.keys(data[0]);
  let csvContent = headers.join(',') + '\n';
  
  data.forEach(row => {
    const values = headers.map(header => {
      const value = row[header];
      return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
    });
    csvContent += values.join(',') + '\n';
  });
  
  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  showToast(`CSV फाइल डाउनलोड हुँदैछ: ${filename}`, 'success');
}

function exportShakhaDetails(shakha) {
  const shakhaComplaints = state.complaints.filter(c => c.shakha === shakha);
  
  if (shakhaComplaints.length === 0) {
    showToast('यो शाखाका लागि कुनै उजुरी छैन', 'info');
    return;
  }
  
  const data = shakhaComplaints.map(complaint => ({
    'दर्ता नं': complaint.id, 'मिति': complaint.date,
    'उजुरकर्ता': complaint.complainant, 'विपक्षी': complaint.accused || '',
    'उजुरीको विवरण': complaint.description,
    'स्थिति': complaint.status === 'resolved' ? 'फछ्रयौट' : complaint.status === 'pending' ? 'काम बाँकी' : 'चालु',
    'निर्णय': complaint.decision || '', 'कैफियत': complaint.remarks || ''
  }));
  
  exportReportToExcel(data, `${shakha}_उजुरीहरू`);
}

// ==================== MODAL FUNCTIONS ====================
function openModal(title, content) {
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalBody').innerHTML = content;
  document.getElementById('complaintModal').classList.remove('hidden');
}

function closeModal() {
  document.getElementById('complaintModal').classList.add('hidden');
}

function openShakhaSelection() {
  document.getElementById('shakhaModal').classList.remove('hidden');
  
  const modalBody = document.querySelector('#shakhaModal .modal-body');
  modalBody.innerHTML = Object.entries(SHAKHA).map(([key, value]) => `
    <div class="module-card text-center" onclick="selectShakha('${key}')">
      <div class="module-icon"><i class="fas fa-building"></i></div>
      <h4 class="module-title">${value}</h4>
    </div>
  `).join('');
}

function closeShakhaModal() {
  document.getElementById('shakhaModal').classList.add('hidden');
}

function selectShakha(shakhaCode) {
  const shakhaName = SHAKHA[shakhaCode] || shakhaCode;
  document.getElementById('loginPageTitle').textContent = `${shakhaName} लग-इन`;
  document.getElementById('loginPageSubtitle').textContent = 'कृपया युजरनेम र पासवर्ड प्रविष्ट गर्नुहोस्';
  closeShakhaModal();
  showPage('loginPage');
}

// ==================== NOTIFICATION FUNCTIONS ====================
function loadNotifications() {
  state.notifications = [
    { id: 1, title: 'नयाँ उजुरी दर्ता', time: '१० मिनेट अघि', read: false },
    { id: 2, title: 'समिति बैठक', time: '२ घण्टा अघि', read: true },
    { id: 3, title: 'मासिक रिपोर्ट तयार', time: '१ दिन अघि', read: true }
  ];
  
  const unreadCount = state.notifications.filter(n => !n.read).length;
  const notificationCount = document.getElementById('notificationCount');
  if (notificationCount) notificationCount.textContent = unreadCount;
  
  const dropdown = document.getElementById('notificationDropdown');
  if (dropdown) {
    dropdown.innerHTML = state.notifications.map(n => `
      <div class="notification-item ${n.read ? '' : 'unread'}" onclick="markNotificationRead(${n.id})">
        <div class="notification-title">${n.title}</div>
        <div class="notification-time">${n.time}</div>
      </div>
    `).join('');
  }
}

function markNotificationRead(id) {
  const notification = state.notifications.find(n => n.id === id);
  if (notification) {
    notification.read = true;
    loadNotifications();
  }
}

function toggleNotifications() {
  const dropdown = document.getElementById('notificationDropdown');
  if (dropdown) dropdown.classList.toggle('show');
}

function toggleUserMenu() {
  console.log('User menu clicked');
}

// ==================== PAGE MANAGEMENT ====================
function showPage(pageId) {
  console.log(`📄 Showing page: ${pageId}`);
  
  ['mainPage', 'loginPage', 'dashboardPage'].forEach(id => {
    document.getElementById(id)?.classList.add('hidden');
  });
  
  const page = document.getElementById(pageId);
  if (page) {
    page.classList.remove('hidden');
    state.currentPage = pageId;
  } else {
    console.error(`❌ Page not found: ${pageId}`);
    return;
  }
  
  if (pageId === 'dashboardPage') {
    initializeDashboard();
    if (state.currentUser && GOOGLE_SHEETS_CONFIG.ENABLED) {
      setTimeout(() => { loadDataFromGoogleSheets().then(loaded => { if (loaded && typeof updateStats === 'function') updateStats(); }); }, 1000);
    }
  }
  
  setTimeout(initializeDatepickers, 200);
}

function showDashboardPage() {
  if (!state.currentUser) {
    showPage('loginPage');
    return;
  }
  updateUserInfo();
  loadDashboardData();
  showPage('dashboardPage');
}

// ==================== AUTHENTICATION ====================
function handleLogin() {
  const username = document.getElementById('loginUsername').value;
  const password = document.getElementById('loginPassword').value;
  
  if (!username || !password) {
    showToast('कृपया युजरनेम र पासवर्ड प्रविष्ट गर्नुहोस्', 'warning');
    return;
  }
  
  const loginBtn = document.getElementById('loginButton');
  const originalText = loginBtn.innerHTML;
  loginBtn.innerHTML = '<div class="spinner"></div>';
  loginBtn.disabled = true;
  
  setTimeout(() => {
    if (username === 'admin' && password === 'nvc123') {
      state.currentUser = {
        id: 'admin', name: 'एडमिन', role: 'admin', avatar: 'A',
        shakha: null, mahashakha: null, permissions: ['all']
      };
      
      const session = { user: state.currentUser, expires: Date.now() + (24 * 60 * 60 * 1000) };
      localStorage.setItem('nvc_session', JSON.stringify(session));
      
      showDashboardPage();
    } else {
      const shakha = findShakhaByCredentials(username, password);
      if (shakha) {
        state.currentUser = {
          id: shakha.code, name: shakha.name, role: 'shakha',
          avatar: shakha.name.charAt(0), shakha: shakha.code,
          mahashakha: shakha.mahashakha, permissions: shakha.permissions || []
        };
        
        const session = { user: state.currentUser, expires: Date.now() + (24 * 60 * 60 * 1000) };
        localStorage.setItem('nvc_session', JSON.stringify(session));
        
        showDashboardPage();
      } else {
        showToast('युजरनेम वा पासवर्ड मिलेन', 'error');
      }
    }
    
    loginBtn.innerHTML = originalText;
    loginBtn.disabled = false;
  }, 1000);
}

function findShakhaByCredentials(username, password) {
  const shakhas = [
    { code: 'admin_planning', name: SHAKHA.ADMIN_PLANNING, username: 'admin_plan', password: 'nvc@2026', mahashakha: MAHASHAKHA.ADMIN_MONITORING, permissions: ['admin_tasks'] },
    { code: 'info_collection', name: SHAKHA.INFO_COLLECTION, username: 'info_collect', password: 'nvc@2026', mahashakha: MAHASHAKHA.ADMIN_MONITORING, permissions: ['complaint_management'] },
    { code: 'complaint_management', name: SHAKHA.COMPLAINT_MANAGEMENT, username: 'complaint_mgmt', password: 'nvc@2026', mahashakha: MAHASHAKHA.ADMIN_MONITORING, permissions: ['complaint_management'] },
    { code: 'finance', name: SHAKHA.FINANCE, username: 'finance', password: 'nvc@2026', mahashakha: MAHASHAKHA.ADMIN_MONITORING, permissions: ['complaint_management'] },
    { code: 'policy_monitoring', name: SHAKHA.POLICY_MONITORING, username: 'policy_mon', password: 'nvc@2026', mahashakha: MAHASHAKHA.POLICY_LEGAL, permissions: ['complaint_management'] },
    { code: 'investigation', name: SHAKHA.INVESTIGATION, username: 'investigation', password: 'nvc@2026', mahashakha: MAHASHAKHA.POLICY_LEGAL, permissions: ['complaint_management'] },
    { code: 'legal_advice', name: SHAKHA.LEGAL_ADVICE, username: 'legal_advice', password: 'nvc@2026', mahashakha: MAHASHAKHA.POLICY_LEGAL, permissions: ['complaint_management'] },
    { code: 'asset_declaration', name: SHAKHA.ASSET_DECLARATION, username: 'asset_decl', password: 'nvc@2026', mahashakha: MAHASHAKHA.POLICY_LEGAL, permissions: ['complaint_management'] },
    { code: 'police_info_collection', name: SHAKHA.POLICE_INFO_COLLECTION, username: 'police_info', password: 'nvc@2026', mahashakha: MAHASHAKHA.POLICE, permissions: ['complaint_management'] },
    { code: 'police_monitoring', name: SHAKHA.POLICE_MONITORING, username: 'police_mon', password: 'nvc@2026', mahashakha: MAHASHAKHA.POLICE, permissions: ['complaint_management'] },
    { code: 'police_management', name: SHAKHA.POLICE_MANAGEMENT, username: 'police_mgmt', password: 'nvc@2026', mahashakha: MAHASHAKHA.POLICE, permissions: ['complaint_management'] },
    { code: 'police_investigation', name: SHAKHA.POLICE_INVESTIGATION, username: 'police_invest', password: 'nvc@2026', mahashakha: MAHASHAKHA.POLICE, permissions: ['complaint_management'] },
    { code: 'technical_1', name: SHAKHA.TECHNICAL_1, username: 'technical1', password: 'nvc@2026', mahashakha: MAHASHAKHA.TECHNICAL, permissions: ['complaint_management', 'technical_inspection'] },
    { code: 'technical_2', name: SHAKHA.TECHNICAL_2, username: 'technical2', password: 'nvc@2026', mahashakha: MAHASHAKHA.TECHNICAL, permissions: ['complaint_management', 'technical_inspection'] },
    { code: 'technical_3', name: SHAKHA.TECHNICAL_3, username: 'technical3', password: 'nvc@2026', mahashakha: MAHASHAKHA.TECHNICAL, permissions: ['complaint_management', 'technical_inspection'] },
    { code: 'technical_4', name: SHAKHA.TECHNICAL_4, username: 'technical4', password: 'nvc@2026', mahashakha: MAHASHAKHA.TECHNICAL, permissions: ['complaint_management', 'technical_inspection'] }
  ];
  return shakhas.find(s => s.username === username && s.password === password);
}

function logout() {
  state.currentUser = null;
  localStorage.removeItem('nvc_session');
  showPage('mainPage');
}

// ==================== DASHBOARD INITIALIZATION ====================
function initializeDashboard() {
  updateUserInfo();
  loadDashboardData();
  setupEventListeners();
  loadSidebarNavigation();
  showDashboardView();
}

function updateUserInfo() {
  if (!state.currentUser) return;
  
  const userName = document.getElementById('userName');
  const userRole = document.getElementById('userRole');
  const userAvatar = document.getElementById('userAvatar');
  const topbarUserName = document.getElementById('topbarUserName');
  const topbarUserRole = document.getElementById('topbarUserRole');
  const topbarAvatar = document.getElementById('topbarAvatar');
  
  if (userName) userName.textContent = state.currentUser.name;
  if (userRole) userRole.textContent = state.currentUser.role === 'admin' ? 'एडमिन' : state.currentUser.shakha;
  if (userAvatar) userAvatar.textContent = state.currentUser.avatar;
  if (topbarUserName) topbarUserName.textContent = state.currentUser.name;
  if (topbarUserRole) topbarUserRole.textContent = state.currentUser.role === 'admin' ? 'एडमिन' : state.currentUser.shakha;
  if (topbarAvatar) topbarAvatar.textContent = state.currentUser.avatar;
}

function loadDashboardData() {
  loadNotifications();
  updateStats();
}

function updateStats() {
  const total = state.complaints.length;
  const pending = state.complaints.filter(c => c.status === 'pending').length;
  const resolved = state.complaints.filter(c => c.status === 'resolved').length;
  const thisMonth = state.complaints.filter(c => {
    const today = new Date();
    const complaintDate = new Date(c.date);
    return complaintDate.getMonth() === today.getMonth() && 
           complaintDate.getFullYear() === today.getFullYear();
  }).length;
  
  const totalEl = document.getElementById('totalComplaintsMain');
  const pendingEl = document.getElementById('pendingComplaintsMain');
  const resolvedEl = document.getElementById('resolvedComplaintsMain');
  
  if (totalEl) totalEl.textContent = total;
  if (pendingEl) pendingEl.textContent = pending;
  if (resolvedEl) resolvedEl.textContent = resolved;
}

function setupEventListeners() {
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.notification-bell')) {
      const dropdown = document.getElementById('notificationDropdown');
      if (dropdown) dropdown.classList.remove('show');
    }
    
    const modal = document.getElementById('complaintModal');
    if (e.target === modal) closeModal();
    
    const shakhaModal = document.getElementById('shakhaModal');
    if (e.target === shakhaModal) closeShakhaModal();
  });
}

function loadSidebarNavigation() {
  const nav = document.getElementById('sidebarNav');
  if (!nav || !state.currentUser) return;
  
  const pendingCount = state.complaints.filter(c => 
    state.currentUser.role === 'admin' ? true : c.shakha === state.currentUser.shakha
  ).filter(c => c.status === 'pending').length;
  
  let navItems = '';
  
  if (state.currentUser.role === 'admin') {
    navItems = `
      <a href="#" class="nav-item active" onclick="showDashboardView()"><i class="fas fa-tachometer-alt"></i><span class="nav-text">ड्यासबोर्ड</span></a>
      <a href="#" class="nav-item" onclick="showAllComplaintsView()"><i class="fas fa-file-alt"></i><span class="nav-text">सबै उजुरीहरू</span><span class="badge badge-danger ms-auto" id="pendingCount">${pendingCount}</span></a>
      <a href="#" class="nav-item" onclick="showShakhaReportsView()"><i class="fas fa-chart-bar"></i><span class="nav-text">शाखा रिपोर्टहरू</span></a>
      <a href="#" class="nav-item" onclick="showUserManagementView()"><i class="fas fa-users"></i><span class="nav-text">प्रयोगकर्ता व्यवस्थापन</span></a>
      <a href="#" class="nav-item" onclick="showSystemReportsView()"><i class="fas fa-chart-line"></i><span class="nav-text">रिपोर्टहरू</span></a>
      <a href="#" class="nav-item" onclick="showSettingsView()"><i class="fas fa-cog"></i><span class="nav-text">सेटिङहरू</span></a>
    `;
  } else if (state.currentUser.shakha === 'admin_planning') {
    const helloSarkarPending = state.complaints.filter(c => c.source === 'hello_sarkar' && c.status === 'pending').length;
    navItems = `
      <a href="#" class="nav-item active" onclick="showDashboardView()"><i class="fas fa-tachometer-alt"></i><span class="nav-text">ड्यासबोर्ड</span></a>
      <a href="#" class="nav-item" onclick="showAdminComplaintsView()"><i class="fas fa-file-alt"></i><span class="nav-text">हेलो सरकारबाट प्राप्त उजुरीहरू</span><span class="badge badge-danger ms-auto">${helloSarkarPending}</span></a>
      <a href="#" class="nav-item" onclick="showEmployeeMonitoringView()"><i class="fas fa-user-clock"></i><span class="nav-text">कार्यालय अनुगमन</span></a>
      <a href="#" class="nav-item" onclick="showCitizenCharterView()"><i class="fas fa-file-contract"></i><span class="nav-text">नागरिक बडापत्र अनुगमन</span></a>
      <a href="#" class="nav-item" onclick="showReportsView()"><i class="fas fa-chart-bar"></i><span class="nav-text">रिपोर्टहरू</span></a>
    `;
  } else if (state.currentUser.permissions?.includes('technical_inspection')) {
    navItems = `
      <a href="#" class="nav-item active" onclick="showDashboardView()"><i class="fas fa-tachometer-alt"></i><span class="nav-text">ड्यासबोर्ड</span></a>
      <a href="#" class="nav-item" onclick="showComplaintsView()"><i class="fas fa-file-alt"></i><span class="nav-text">उजुरीहरू</span><span class="badge badge-danger ms-auto">${pendingCount}</span></a>
      <a href="#" class="nav-item" onclick="showNewComplaintView()"><i class="fas fa-plus-circle"></i><span class="nav-text">नयाँ उजुरी</span></a>
      <a href="#" class="nav-item" onclick="showTechnicalProjectsView()"><i class="fas fa-hard-hat"></i><span class="nav-text">प्राविधिक परीक्षण/आयोजना अनुगमन</span></a>
      <a href="#" class="nav-item" onclick="showReportsView()"><i class="fas fa-chart-bar"></i><span class="nav-text">रिपोर्टहरू</span></a>
      <a href="#" class="nav-item" onclick="showCalendarView()"><i class="fas fa-calendar-alt"></i><span class="nav-text">क्यालेन्डर</span></a>
    `;
  } else {
    navItems = `
      <a href="#" class="nav-item active" onclick="showDashboardView()"><i class="fas fa-tachometer-alt"></i><span class="nav-text">ड्यासबोर्ड</span></a>
      <a href="#" class="nav-item" onclick="showComplaintsView()"><i class="fas fa-file-alt"></i><span class="nav-text">उजुरीहरू</span><span class="badge badge-danger ms-auto">${pendingCount}</span></a>
      <a href="#" class="nav-item" onclick="showNewComplaintView()"><i class="fas fa-plus-circle"></i><span class="nav-text">नयाँ उजुरी</span></a>
      <a href="#" class="nav-item" onclick="showReportsView()"><i class="fas fa-chart-bar"></i><span class="nav-text">रिपोर्टहरू</span></a>
      <a href="#" class="nav-item" onclick="showCalendarView()"><i class="fas fa-calendar-alt"></i><span class="nav-text">क्यालेन्डर</span></a>
    `;
  }
  
  nav.innerHTML = navItems;
}

// ==================== CHART FUNCTIONS ====================
function initializeDashboardCharts() {
  if (typeof Chart === 'undefined') {
    console.warn('⚠️ Chart.js is not loaded');
    return;
  }
  
  console.log('📊 Initializing dashboard charts...');
  
  setTimeout(() => {
    const statusCanvas = document.getElementById('complaintStatusChart');
    if (statusCanvas) {
      if (window.nvcCharts.complaintStatus) window.nvcCharts.complaintStatus.destroy();
      
      let complaints = state.currentUser?.role === 'admin' ? (state.complaints || []) : 
                      (state.complaints || []).filter(c => c.shakha === state.currentUser?.shakha);
      
      const pending = complaints.filter(c => c.status === 'pending').length;
      const progress = complaints.filter(c => c.status === 'progress').length;
      const resolved = complaints.filter(c => c.status === 'resolved').length;
      
      try {
        window.nvcCharts.complaintStatus = new Chart(statusCanvas.getContext('2d'), {
          type: 'doughnut',
          data: {
            labels: ['काम बाँकी', 'चालु', 'फछ्रयौट'],
            datasets: [{
              data: [pending, progress, resolved],
              backgroundColor: ['rgba(255, 143, 0, 0.8)', 'rgba(30, 136, 229, 0.8)', 'rgba(46, 125, 50, 0.8)'],
              borderColor: ['rgba(255, 143, 0, 1)', 'rgba(30, 136, 229, 1)', 'rgba(46, 125, 50, 1)'],
              borderWidth: 1
            }]
          },
          options: {
            responsive: true, maintainAspectRatio: false,
            plugins: {
              legend: { position: 'bottom', labels: { padding: 10, font: { size: 11 } } },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    const label = context.label || '';
                    const value = context.raw || 0;
                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                    const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
                    return `${label}: ${value} (${percentage}%)`;
                  }
                }
              }
            }
          }
        });
      } catch (e) { console.error('❌ Error creating chart:', e); }
    }
    
    const shakhaCtx = document.getElementById('shakhaChart');
    if (shakhaCtx) {
      if (window.nvcCharts.shakhaChart) window.nvcCharts.shakhaChart.destroy();
      
      const shakhaStats = {};
      (state.complaints || []).forEach(complaint => {
        const shakha = complaint.shakha || 'अन्य';
        shakhaStats[shakha] = (shakhaStats[shakha] || 0) + 1;
      });
      
      try {
        window.nvcCharts.shakhaChart = new Chart(shakhaCtx.getContext('2d'), {
          type: 'bar',
          data: {
            labels: Object.keys(shakhaStats),
            datasets: [{
              label: 'उजुरीहरू',
              data: Object.values(shakhaStats),
              backgroundColor: 'rgba(13, 71, 161, 0.8)',
              borderColor: 'rgba(13, 71, 161, 1)',
              borderWidth: 1
            }]
          },
          options: {
            responsive: true, maintainAspectRatio: false,
            scales: {
              y: { beginAtZero: true, ticks: { stepSize: 1, font: { size: 11 } } },
              x: { ticks: { maxRotation: 45, minRotation: 45, font: { size: 10 } } }
            }
          }
        });
      } catch (e) { console.error('❌ Error creating shakha chart:', e); }
    }
    
    const trendCtx = document.getElementById('trendChart');
    if (trendCtx) {
      if (window.nvcCharts.trendChart) window.nvcCharts.trendChart.destroy();
      
      const nepaliMonths = ['बैशाख', 'जेठ', 'असार', 'साउन', 'भदौ', 'असोज', 'कार्तिक', 'मंसिर', 'पुष', 'माघ', 'फागुन', 'चैत'];
      const currentMonth = new Date().getMonth();
      const last6Months = [];
      for (let i = 5; i >= 0; i--) last6Months.push(nepaliMonths[(currentMonth - i + 12) % 12]);
      
      try {
        window.nvcCharts.trendChart = new Chart(trendCtx.getContext('2d'), {
          type: 'line',
          data: {
            labels: last6Months,
            datasets: [{
              label: 'उजुरीहरू',
              data: [12, 19, 15, 17, 14, 13],
              backgroundColor: 'rgba(13, 71, 161, 0.1)',
              borderColor: 'rgba(13, 71, 161, 1)',
              borderWidth: 2, tension: 0.3, fill: true,
              pointBackgroundColor: 'rgba(13, 71, 161, 1)',
              pointBorderColor: 'white', pointBorderWidth: 2,
              pointRadius: 4, pointHoverRadius: 6
            }]
          },
          options: {
            responsive: true, maintainAspectRatio: false,
            scales: { y: { beginAtZero: true, ticks: { stepSize: 5, font: { size: 11 } } } }
          }
        });
      } catch (e) { console.error('❌ Error creating trend chart:', e); }
    }
    
    const projectCtx = document.getElementById('projectStatusChart');
    if (projectCtx) {
      if (window.nvcCharts.projectChart) window.nvcCharts.projectChart.destroy();
      
      const technicalProjects = (state.projects || []).filter(p => p.shakha === state.currentUser?.shakha);
      const active = technicalProjects.filter(p => p.status === 'active').length;
      const completed = technicalProjects.filter(p => p.status === 'completed').length;
      const pending = technicalProjects.filter(p => p.status === 'pending').length;
      
      try {
        window.nvcCharts.projectChart = new Chart(projectCtx.getContext('2d'), {
          type: 'pie',
          data: {
            labels: ['चालु', 'सम्पन्न', 'काम बाँकी'],
            datasets: [{
              data: [active, completed, pending],
              backgroundColor: ['rgba(30, 136, 229, 0.8)', 'rgba(46, 125, 50, 0.8)', 'rgba(255, 143, 0, 0.8)'],
              borderColor: ['rgba(30, 136, 229, 1)', 'rgba(46, 125, 50, 1)', 'rgba(255, 143, 0, 1)'],
              borderWidth: 1
            }]
          },
          options: {
            responsive: true, maintainAspectRatio: false,
            plugins: {
              legend: { position: 'bottom', labels: { font: { size: 11 } } },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    const label = context.label || '';
                    const value = context.raw || 0;
                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                    const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
                    return `${label}: ${value} (${percentage}%)`;
                  }
                }
              }
            }
          }
        });
      } catch (e) { console.error('❌ Error creating project chart:', e); }
    }
    
    const comparisonCtx = document.getElementById('shakhaComparisonChart');
    if (comparisonCtx) {
      if (window.nvcCharts.comparisonChart) window.nvcCharts.comparisonChart.destroy();
      
      const shakhaStats = {};
      (state.complaints || []).forEach(complaint => {
        const shakha = complaint.shakha || 'अन्य';
        if (!shakhaStats[shakha]) shakhaStats[shakha] = { pending: 0, resolved: 0 };
        if (complaint.status === 'pending') shakhaStats[shakha].pending++;
        if (complaint.status === 'resolved') shakhaStats[shakha].resolved++;
      });
      
      const shakhas = Object.keys(shakhaStats);
      const pendingData = shakhas.map(shakha => shakhaStats[shakha].pending);
      const resolvedData = shakhas.map(shakha => shakhaStats[shakha].resolved);
      
      try {
        window.nvcCharts.comparisonChart = new Chart(comparisonCtx.getContext('2d'), {
          type: 'bar',
          data: {
            labels: shakhas,
            datasets: [
              { label: 'काम बाँकी', data: pendingData, backgroundColor: 'rgba(255, 143, 0, 0.8)', borderColor: 'rgba(255, 143, 0, 1)', borderWidth: 1 },
              { label: 'फछ्रयौट', data: resolvedData, backgroundColor: 'rgba(46, 125, 50, 0.8)', borderColor: 'rgba(46, 125, 50, 1)', borderWidth: 1 }
            ]
          },
          options: {
            responsive: true, maintainAspectRatio: false,
            scales: {
              y: { beginAtZero: true, ticks: { stepSize: 1, font: { size: 11 } } },
              x: { ticks: { maxRotation: 45, minRotation: 45, font: { size: 10 } } }
            }
          }
        });
      } catch (e) { console.error('❌ Error creating comparison chart:', e); }
    }
  }, 300);
}

// ==================== VIEW FUNCTIONS ====================
function showDashboardView() {
  state.currentView = 'dashboard';
  const pageTitle = document.getElementById('pageTitle');
  if (pageTitle) pageTitle.textContent = 'ड्यासबोर्ड';
  
  destroyAllCharts();
  
  let content = '';
  if (state.currentUser.role === 'admin') content = showAdminDashboard();
  else if (state.currentUser.shakha === 'admin_planning') content = showAdminPlanningDashboard();
  else if (state.currentUser.permissions?.includes('technical_inspection')) content = showTechnicalDashboard();
  else content = showShakhaDashboard();
  
  const contentArea = document.getElementById('contentArea');
  if (contentArea) contentArea.innerHTML = content;
  
  updateActiveNavItem();
  setTimeout(initializeDashboardCharts, 500);
}

function showAdminDashboard() {
  const totalComplaints = state.complaints.length;
  const pendingComplaints = state.complaints.filter(c => c.status === 'pending').length;
  const resolvedComplaints = state.complaints.filter(c => c.status === 'resolved').length;
  const monthlyComplaints = state.complaints.filter(c => {
    const today = new Date();
    const complaintDate = new Date(c.date);
    return complaintDate.getMonth() === today.getMonth() && 
           complaintDate.getFullYear() === today.getFullYear();
  }).length;
  
  const shakhaStats = {};
  state.complaints.forEach(complaint => {
    const shakha = complaint.shakha || 'अन्य';
    if (!shakhaStats[shakha]) shakhaStats[shakha] = { total: 0, pending: 0, resolved: 0 };
    shakhaStats[shakha].total++;
    if (complaint.status === 'pending') shakhaStats[shakha].pending++;
    if (complaint.status === 'resolved') shakhaStats[shakha].resolved++;
  });
  
  return `
    <div class="stats-grid mb-3">
      <div class="stat-widget"><div class="stat-icon bg-primary"><i class="fas fa-file-alt"></i></div><div class="stat-info"><div class="stat-value">${totalComplaints}</div><div class="stat-label">कूल उजुरीहरू</div><span class="stat-trend trend-up"></span></div></div>
      <div class="stat-widget"><div class="stat-icon bg-warning"><i class="fas fa-clock"></i></div><div class="stat-info"><div class="stat-value">${pendingComplaints}</div><div class="stat-label">काम बाँकी</div><span class="stat-trend trend-down"></span></div></div>
      <div class="stat-widget"><div class="stat-icon bg-success"><i class="fas fa-check-circle"></i></div><div class="stat-info"><div class="stat-value">${resolvedComplaints}</div><div class="stat-label">फछ्रयौट भएका</div><span class="stat-trend trend-up"></span></div></div>
      <div class="stat-widget"><div class="stat-icon bg-secondary"><i class="fas fa-calendar-alt"></i></div><div class="stat-info"><div class="stat-value">${monthlyComplaints}</div><div class="stat-label">यस महिनाका</div><span class="stat-trend trend-up"></span></div></div>
    </div>
    
    <div class="d-grid gap-3 mb-3" style="grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));">
      <div class="chart-container"><div class="chart-header"><h6 class="chart-title">शाखा अनुसार उजुरीहरू</h6></div><div class="chart-wrapper"><canvas id="shakhaChart"></canvas></div></div>
      <div class="chart-container"><div class="chart-header"><h6 class="chart-title">महिनाको प्रवृत्ति</h6></div><div class="chart-wrapper"><canvas id="trendChart"></canvas></div></div>
    </div>
    
    <div class="card mb-3">
      <div class="card-header d-flex justify-between align-center">
        <h5 class="mb-0">शाखा अनुसार उजुरी स्थिति</h5>
        <button class="btn btn-sm btn-success" onclick="exportToExcel('shakha_stats')"><i class="fas fa-file-excel"></i> Excel</button>
      </div>
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table">
            <thead><tr><th>शाखा</th><th>कूल उजुरी</th><th>काम बाँकी</th><th>फछ्रयौट</th><th>फछ्रयौट दर</th></tr></thead>
            <tbody>
              ${Object.keys(shakhaStats).map(shakha => {
                const stats = shakhaStats[shakha];
                const resolutionRate = stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0;
                return `<tr><td>${shakha}</td><td>${stats.total}</td><td>${stats.pending}</td><td>${stats.resolved}</td><td>${resolutionRate}%</td></tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    
    <div class="card">
      <div class="card-header d-flex justify-between align-center">
        <h5 class="mb-0">हालैका उजुरीहरू</h5>
        <div class="d-flex align-center gap-2">
          <button class="btn btn-sm btn-success" onclick="exportToExcel('recent')"><i class="fas fa-file-excel"></i> Excel</button>
          <a href="#" class="text-primary text-small" onclick="showAllComplaintsView()">सबै हेर्नुहोस्</a>
        </div>
      </div>
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table">
            <thead><tr><th>दर्ता नं</th><th>दर्ता मिति</th><th>उजुरकर्ता</th><th>सम्बन्धित शाखा</th><th>उजुरीको संक्षिप्त विवरण</th><th>उजुरीको स्थिति</th><th>कार्य</th></tr></thead>
            <tbody>
              ${state.complaints.slice(0, 5).map(complaint => `
                <tr>
                  <td>${complaint.id}</td><td>${complaint.date}</td><td>${complaint.complainant}</td><td>${complaint.shakha || '-'}</td>
                  <td class="text-limit">${complaint.description.substring(0, 50)}...</td>
                  <td><span class="status-badge ${complaint.status === 'resolved' ? 'status-resolved' : complaint.status === 'pending' ? 'status-pending' : 'status-progress'}">${complaint.status === 'resolved' ? 'फछ्रयौट' : complaint.status === 'pending' ? 'काम बाँकी' : 'चालु'}</span></td>
                  <td><button class="action-btn" onclick="viewComplaint('${complaint.id}')" title="हेर्नुहोस्"><i class="fas fa-eye"></i></button></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function showAdminPlanningDashboard() {
  const helloSarkarComplaints = state.complaints.filter(c => c.source === 'hello_sarkar');
  const pendingHelloSarkar = helloSarkarComplaints.filter(c => c.status === 'pending').length;
  
  return `
    <div class="stats-grid mb-3">
      <div class="stat-widget"><div class="stat-icon bg-primary"><i class="fas fa-file-alt"></i></div><div class="stat-info"><div class="stat-value">${helloSarkarComplaints.length}</div><div class="stat-label">हेलो सरकारबाट प्राप्त उजुरी</div><span class="stat-trend trend-up"></span></div></div>
      <div class="stat-widget"><div class="stat-icon bg-warning"><i class="fas fa-clock"></i></div><div class="stat-info"><div class="stat-value">${pendingHelloSarkar}</div><div class="stat-label">काम बाँकी</div><span class="stat-trend trend-down"></span></div></div>
      <div class="stat-widget"><div class="stat-icon bg-success"><i class="fas fa-user-check"></i></div><div class="stat-info"><div class="stat-value"></div><div class="stat-label">अनुगमन गरिएका</div><span class="stat-trend trend-up"></span></div></div>
      <div class="stat-widget"><div class="stat-icon bg-secondary"><i class="fas fa-chart-line"></i></div><div class="stat-info"><div class="stat-value"></div><div class="stat-label">समयमा प्रतिक्रिया</div><span class="stat-trend trend-up"></span></div></div>
    </div>
    
    <div class="d-grid gap-3 mb-3" style="grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));">
      <div class="card"><div class="card-header"><h6 class="mb-0">हेलो सरकारबाट प्राप्त उजुरी</h6></div><div class="card-body"><div class="d-flex justify-between align-center mb-2"><span class="text-small">कूल उजुरी</span><span class="font-weight-bold">${helloSarkarComplaints.length}</span></div><div class="d-flex justify-between align-center mb-2"><span class="text-small">काम बाँकी</span><span class="font-weight-bold text-warning">${pendingHelloSarkar}</span></div><div class="d-flex justify-between align-center"><span class="text-small">फछ्रयौट</span><span class="font-weight-bold text-success">${helloSarkarComplaints.length - pendingHelloSarkar}</span></div></div></div>
      <div class="card"><div class="card-header"><h6 class="mb-0">कार्यालय अनुगमन</h6></div><div class="card-body"><div class="d-flex justify-between align-center mb-2"><span class="text-small">आजको अनुगमन</span><span class="font-weight-bold"></span></div><div class="d-flex justify-between align-center mb-2"><span class="text-small">पोशाक अपरिपालना</span><span class="font-weight-bold text-warning">३</span></div><div class="d-flex justify-between align-center"><span class="text-small">समय अपरिपालना</span><span class="font-weight-bold text-danger">२</span></div></div></div>
    </div>
    
    <div class="card">
      <div class="card-header d-flex justify-between align-center">
        <h5 class="mb-0">हालैका हेलो सरकारबाट प्राप्त उजुरीहरू</h5>
        <button class="btn btn-sm btn-primary" onclick="showAdminComplaintsView()">सबै हेर्नुहोस्</button>
      </div>
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table">
            <thead><tr><th>क्र.सं.</th><th>प्राप्त मिति</th><th>उजुरकर्ता</th><th>विपक्षी</th><th>उजुरीको संक्षिप्त विवरण</th><th>सम्बन्धित शाखा</th><th>उजुरीको स्थिति</th></tr></thead>
            <tbody>
              ${helloSarkarComplaints.slice(0, 5).map((complaint, index) => `
                <tr>
                  <td>${index + 1}</td><td>${complaint.date}</td><td>${complaint.complainant}</td><td>${complaint.accused || '-'}</td>
                  <td class="text-limit">${complaint.description.substring(0, 50)}...</td><td>${complaint.assignedShakha || '-'}</td>
                  <td><span class="status-badge ${complaint.status === 'resolved' ? 'status-resolved' : complaint.status === 'pending' ? 'status-pending' : 'status-progress'}">${complaint.status === 'resolved' ? 'फछ्रयौट' : complaint.status === 'pending' ? 'काम बाँकी' : 'चालु'}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function showTechnicalDashboard() {
  const shakhaComplaints = state.complaints.filter(c => c.shakha === state.currentUser.shakha);
  const pendingComplaints = shakhaComplaints.filter(c => c.status === 'pending').length;
  const technicalProjects = state.projects.filter(p => p.shakha === state.currentUser.shakha);
  const activeProjects = technicalProjects.filter(p => p.status === 'active').length;
  
  return `
    <div class="stats-grid mb-3">
      <div class="stat-widget"><div class="stat-icon bg-primary"><i class="fas fa-file-alt"></i></div><div class="stat-info"><div class="stat-value">${shakhaComplaints.length}</div><div class="stat-label">कूल उजुरी</div><span class="stat-trend trend-up"></span></div></div>
      <div class="stat-widget"><div class="stat-icon bg-warning"><i class="fas fa-clock"></i></div><div class="stat-info"><div class="stat-value">${pendingComplaints}</div><div class="stat-label">काम बाँकी</div><span class="stat-trend trend-down"></span></div></div>
      <div class="stat-widget"><div class="stat-icon bg-success"><i class="fas fa-hard-hat"></i></div><div class="stat-info"><div class="stat-value">${technicalProjects.length}</div><div class="stat-label">प्राविधिक परीक्षण/आयोजना अनुगमन</div><span class="stat-trend trend-up"></span></div></div>
      <div class="stat-widget"><div class="stat-icon bg-secondary"><i class="fas fa-tasks"></i></div><div class="stat-info"><div class="stat-value">${activeProjects}</div><div class="stat-label">चालु आयोजना</div><span class="stat-trend trend-up"></span></div></div>
    </div>
    
    <div class="d-grid gap-3 mb-3" style="grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));">
      <div class="card"><div class="card-header"><h6 class="mb-0">उजुरी स्थिति</h6></div><div class="card-body"><canvas id="complaintStatusChart"></canvas></div></div>
      <div class="card"><div class="card-header"><h6 class="mb-0">प्राविधिक परीक्षण/आयोजना अनुगमन</h6></div><div class="card-body"><canvas id="projectStatusChart"></canvas></div></div>
    </div>
    
    <div class="d-grid gap-3 mb-3" style="grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));">
      <div class="card">
        <div class="card-header d-flex justify-between align-center">
          <h6 class="mb-0">हालैका उजुरीहरू</h6>
          <a href="#" class="text-primary text-small" onclick="showComplaintsView()">सबै हेर्नुहोस्</a>
        </div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-compact">
              <thead><tr><th>दर्ता नं</th><th>दर्ता मिति</th><th>उजुरकर्ता</th><th>उजुरीको स्थिति</th></tr></thead>
              <tbody>
                ${shakhaComplaints.slice(0, 5).map(complaint => `
                  <tr><td>${complaint.id}</td><td>${complaint.date}</td><td>${complaint.complainant}</td><td><span class="status-badge ${complaint.status === 'resolved' ? 'status-resolved' : complaint.status === 'pending' ? 'status-pending' : 'status-progress'}">${complaint.status === 'resolved' ? 'फछ्रयौट' : complaint.status === 'pending' ? 'काम बाँकी' : 'चालु'}</span></td></tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <div class="card">
        <div class="card-header d-flex justify-between align-center">
          <h6 class="mb-0">चालु आयोजनाहरू</h6>
          <a href="#" class="text-primary text-small" onclick="showTechnicalProjectsView()">सबै हेर्नुहोस्</a>
        </div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-compact">
              <thead><tr><th>आयोजनाको नाम</th><th>सम्बन्धित निकाय</th><th>अवस्था</th></tr></thead>
              <tbody>
                ${technicalProjects.slice(0, 5).map(project => `
                  <tr><td>${project.name}</td><td>${project.organization}</td><td><span class="status-badge ${project.status === 'active' ? 'status-progress' : 'status-resolved'}">${project.status === 'active' ? 'चालु' : 'सम्पन्न'}</span></td></tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `;
}

function showShakhaDashboard() {
  const shakhaComplaints = state.complaints.filter(c => c.shakha === state.currentUser.shakha);
  const pendingComplaints = shakhaComplaints.filter(c => c.status === 'pending').length;
  const resolvedComplaints = shakhaComplaints.filter(c => c.status === 'resolved').length;
  const monthlyComplaints = shakhaComplaints.filter(c => {
    const today = new Date();
    const complaintDate = new Date(c.date);
    return complaintDate.getMonth() === today.getMonth() && 
           complaintDate.getFullYear() === today.getFullYear();
  }).length;
  
  return `
    <div class="stats-grid mb-3">
      <div class="stat-widget"><div class="stat-icon bg-primary"><i class="fas fa-file-alt"></i></div><div class="stat-info"><div class="stat-value">${shakhaComplaints.length}</div><div class="stat-label">कूल उजुरीहरू</div><span class="stat-trend trend-up"></span></div></div>
      <div class="stat-widget"><div class="stat-icon bg-warning"><i class="fas fa-clock"></i></div><div class="stat-info"><div class="stat-value">${pendingComplaints}</div><div class="stat-label">काम बाँकी</div><span class="stat-trend trend-down"></span></div></div>
      <div class="stat-widget"><div class="stat-icon bg-success"><i class="fas fa-check-circle"></i></div><div class="stat-info"><div class="stat-value">${resolvedComplaints}</div><div class="stat-label">फछ्रयौट भएका</div><span class="stat-trend trend-up"></span></div></div>
      <div class="stat-widget"><div class="stat-icon bg-secondary"><i class="fas fa-calendar-alt"></i></div><div class="stat-info"><div class="stat-value">${monthlyComplaints}</div><div class="stat-label">यस महिनाका</div><span class="stat-trend trend-up"></span></div></div>
    </div>
    
    <div class="d-grid gap-3 mb-3" style="grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));">
      <div class="chart-container"><div class="chart-header"><h6 class="chart-title">उजुरी स्थिति</h6></div><div class="chart-wrapper"><canvas id="complaintStatusChart"></canvas></div></div>
      <div class="chart-container"><div class="chart-header"><h6 class="chart-title">महिनाको प्रवृत्ति</h6></div><div class="chart-wrapper"><canvas id="trendChart"></canvas></div></div>
    </div>
    
    <div class="card">
      <div class="card-header d-flex justify-between align-center">
        <h5 class="mb-0">हालैका उजुरीहरू</h5>
        <div class="d-flex align-center gap-2">
          <button class="btn btn-sm btn-success" onclick="exportToExcel('recent')"><i class="fas fa-file-excel"></i> Excel</button>
          <a href="#" class="text-primary text-small" onclick="showComplaintsView()">सबै हेर्नुहोस्</a>
        </div>
      </div>
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table">
            <thead><tr><th>दर्ता नं</th><th>दर्ता मिति</th><th>उजुरकर्ता</th><th>विपक्षी</th><th>उजुरीको संक्षिप्त विवरण</th><th>उजुरीको स्थिति</th><th>कार्य</th></tr></thead>
            <tbody>
              ${shakhaComplaints.slice(0, 5).map(complaint => `
                <tr>
                  <td>${complaint.id}</td><td>${complaint.date}</td><td>${complaint.complainant}</td><td>${complaint.accused || '-'}</td>
                  <td class="text-limit">${complaint.description.substring(0, 50)}...</td>
                  <td><span class="status-badge ${complaint.status === 'resolved' ? 'status-resolved' : complaint.status === 'pending' ? 'status-pending' : 'status-progress'}">${complaint.status === 'resolved' ? 'फछ्रयौट' : complaint.status === 'pending' ? 'काम बाँकी' : 'चालु'}</span></td>
                  <td><button class="action-btn" onclick="viewComplaint('${complaint.id}')" title="हेर्नुहोस्"><i class="fas fa-eye"></i></button></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

// ==================== COMPLAINT MANAGEMENT VIEWS ====================
// ==================== SHOW COMPLAINTS VIEW - COMPLETE FIXED VERSION ====================
function showComplaintsView() {
  console.log('📋 showComplaintsView() called');
  
  state.currentView = 'complaints';
  
  const pageTitle = document.getElementById('pageTitle');
  if (pageTitle) {
    pageTitle.textContent = 'उजुरीहरू';
  }
  
  // Safety check
  if (!state.complaints) {
    state.complaints = [];
  }
  
  // सबै complaints देखाउने (filter नगर्ने)
  let complaintsToShow = state.complaints;
  
  console.log(`📊 Total complaints: ${complaintsToShow.length}`);
  
  // पेजिनेसन
  const itemsPerPage = state.pagination?.itemsPerPage || 10;
  const currentPage = state.pagination?.currentPage || 1;
  const totalItems = complaintsToShow.length;
  
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedComplaints = complaintsToShow.slice(startIndex, endIndex);
  
  console.log(`📄 Showing ${startIndex + 1} to ${endIndex} of ${totalItems}`);
  
  // Table rows बनाउने
  let tableRows = '';
  
  if (paginatedComplaints.length === 0) {
    tableRows = `<tr><td colspan="10" class="text-center p-4">कुनै उजुरी फेला परेन</td></tr>`;
  } else {
    paginatedComplaints.forEach(complaint => {
      // सबै fields लिने - विभिन्न सम्भावित नामहरू
      const id = complaint.id || 
                 complaint['उजुरी दर्ता नं'] || 
                 '-';
      
      const date = complaint.date || 
                   complaint['दर्ता मिति'] || 
                   '-';
      
      const complainant = complaint.complainant || 
                          complaint['उजुरीकर्ताको नाम'] || 
                          '-';
      
      const accused = complaint.accused || 
                      complaint['विपक्षी'] || 
                      '-';
      
      const description = complaint.description || 
                          complaint['उजुरीको संक्षिप्त विवरण'] || 
                          '';
      
      const proposedDecision = complaint.proposedDecision || 
                               complaint['प्रस्तावित निर्णय'] || 
                               '';
      
      const decision = complaint.decision || 
                       complaint['अन्तिम निर्णय'] || 
                       '';
      
      const remarks = complaint.remarks || 
                      complaint['कैफियत'] || 
                      '-';
      
      const shakha = complaint.shakha || 
                     complaint['सम्बन्धित शाखा'] || 
                     '-';
      
      // Status
      const status = complaint.status || 
                     complaint['स्थिति'] || 
                     'pending';
      
      let statusText = 'काम बाँकी';
      let statusClass = 'status-pending';
      
      if (status === 'resolved' || status === 'फछ्रयौट') {
        statusText = 'फछ्रयौट';
        statusClass = 'status-resolved';
      } else if (status === 'progress' || status === 'चालु') {
        statusText = 'चालु';
        statusClass = 'status-progress';
      }
      
      tableRows += `
        <tr>
          <td><strong>${id}</strong></td>
          <td>${date}</td>
          <td>${complainant}</td>
          <td>${accused}</td>
          <td class="text-limit" title="${description}">${description.substring(0, 50)}${description.length > 50 ? '...' : ''}</td>
          <td class="text-limit" title="${decision}">${decision ? decision.substring(0, 30) + (decision.length > 30 ? '...' : '') : '-'}</td>
          <td>${remarks}</td>
          <td>${shakha}</td>
          <td><span class="status-badge ${statusClass}">${statusText}</span></td>
          <td>
            <div class="table-actions">
              <button class="action-btn" onclick="viewComplaint('${id}')" title="हेर्नुहोस्"><i class="fas fa-eye"></i></button>
              <button class="action-btn" onclick="editComplaint('${id}')" title="सम्पादन गर्नुहोस्"><i class="fas fa-edit"></i></button>
              <button class="action-btn" onclick="deleteComplaint('${id}')" title="हटाउनुहोस्"><i class="fas fa-trash"></i></button>
            </div>
          </td>
        </tr>
      `;
    });
  }
  
  // पेजिनेसन HTML
  const paginationHTML = renderPagination(totalItems, itemsPerPage, currentPage);
  
  const content = `
    <div class="card">
      <div class="card-header d-flex justify-between align-center">
        <h5 class="mb-0">उजुरी सूची (${totalItems})</h5>
        <div class="d-flex gap-2">
          <select class="form-select form-select-sm" style="width: auto;" onchange="changeItemsPerPage(this.value)">
            <option value="10" ${itemsPerPage === 10 ? 'selected' : ''}>१० प्रति पेज</option>
            <option value="20" ${itemsPerPage === 20 ? 'selected' : ''}>२० प्रति पेज</option>
            <option value="50" ${itemsPerPage === 50 ? 'selected' : ''}>५० प्रति पेज</option>
            <option value="100" ${itemsPerPage === 100 ? 'selected' : ''}>१०० प्रति पेज</option>
          </select>
          <button class="btn btn-sm btn-success" onclick="exportToExcel('complaints')">
            <i class="fas fa-file-excel"></i> Excel
          </button>
          <button class="btn btn-sm btn-primary" onclick="refreshData()">
            <i class="fas fa-sync-alt"></i> Refresh
          </button>
        </div>
      </div>
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th>दर्ता नं</th>
                <th>मिति</th>
                <th>उजुरकर्ता</th>
                <th>विपक्षी</th>
                <th>उजुरीको विवरण</th>
                <th>निर्णय</th>
                <th>कैफियत</th>
                <th>शाखा</th>
                <th>स्थिति</th>
                <th>कार्य</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
        </div>
      </div>
      <div class="card-footer d-flex justify-between align-center">
        <div class="text-small text-muted">
          देखाउँदै ${totalItems > 0 ? startIndex + 1 : 0} - ${endIndex} of ${totalItems}
        </div>
        ${paginationHTML}
      </div>
    </div>
  `;
  
  const contentArea = document.getElementById('contentArea');
  if (contentArea) {
    contentArea.innerHTML = content;
    console.log('✅ Content area updated');
  }
}

// ==================== RENDER PAGINATION - NEW FUNCTION ====================
// ==================== RENDER PAGINATION - FIXED ====================
function renderPagination(totalItems, itemsPerPage, currentPage) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  if (totalPages <= 1) {
    return '';
  }
  
  let paginationHTML = '<nav><ul class="pagination mb-0">';
  
  // Previous button
  paginationHTML += `
    <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
      <a class="page-link" href="#" onclick="changePage(${currentPage - 1}); return false;">पछिल्लो</a>
    </li>
  `;
  
  // Page numbers
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
      paginationHTML += `
        <li class="page-item ${i === currentPage ? 'active' : ''}">
          <a class="page-link" href="#" onclick="changePage(${i}); return false;">${i}</a>
        </li>
      `;
    } else if (i === currentPage - 3 || i === currentPage + 3) {
      paginationHTML += '<li class="page-item disabled"><span class="page-link">...</span></li>';
    }
  }
  
  // Next button
  paginationHTML += `
    <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
      <a class="page-link" href="#" onclick="changePage(${currentPage + 1}); return false;">अर्को</a>
    </li>
  `;
  
  paginationHTML += '</ul></nav>';
  
  return paginationHTML;
}

// ==================== CHANGE PAGE - FIXED ====================
// ==================== CHANGE PAGE - FIXED ====================
function changePage(page) {
  console.log('📄 changePage() called with page:', page);
  
  if (!state.pagination) {
    state.pagination = { currentPage: 1, itemsPerPage: 10 };
  }
  
  const totalItems = state.complaints?.length || 0;
  const itemsPerPage = state.pagination.itemsPerPage || 10;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  if (page < 1 || page > totalPages) {
    return;
  }
  
  state.pagination.currentPage = page;
  
  // Current view update गर्ने
  if (state.currentView === 'complaints' || state.currentView === 'all_complaints') {
    showComplaintsView();
  }
}

// ==================== CHANGE ITEMS PER PAGE - FIXED ====================
function changeItemsPerPage(perPage) {
  console.log('📄 changeItemsPerPage() called with:', perPage);
  
  if (!state.pagination) {
    state.pagination = { currentPage: 1 };
  }
  
  state.pagination.itemsPerPage = parseInt(perPage);
  state.pagination.currentPage = 1;
  
  // Current view update गर्ने
  if (state.currentView === 'complaints' || state.currentView === 'all_complaints') {
    showComplaintsView();
  }
}

// ==================== CONSOLE TEST FUNCTIONS ====================
async function testDataLoad() {
  console.log('🧪 Testing data load...');
  console.log('Current state before load:', state.complaints.length);
  
  const result = await loadDataFromGoogleSheets(true);
  
  console.log('Load result:', result);
  console.log('State after load:', state.complaints.length);
  
  if (state.complaints.length > 0) {
    console.log('First complaint:', state.complaints[0]);
  }
  
  return result;
}

async function testDirectAPI() {
  console.log('🧪 Testing direct API call...');
  
  const response = await getFromGoogleSheets('getComplaints');
  
  console.log('API Response:', response);
  
  return response;
}

function checkState() {
  console.log('📊 Current State:');
  console.log('- User:', state.currentUser?.name || 'Not logged in');
  console.log('- Page:', state.currentPage);
  console.log('- View:', state.currentView);
  console.log('- Complaints:', state.complaints?.length || 0);
  console.log('- Projects:', state.projects?.length || 0);
  console.log('- Employee Monitoring:', state.employeeMonitoring?.length || 0);
  console.log('- Citizen Charters:', state.citizenCharters?.length || 0);
  
  return state;
}

function showAllComplaintsView() {
  state.currentView = 'all_complaints';
  document.getElementById('pageTitle').textContent = 'सबै उजुरीहरू';
  showComplaintsView();
}

function showAdminComplaintsView() {
  state.currentView = 'admin_complaints';
  document.getElementById('pageTitle').textContent = 'हेलो सरकारबाट प्राप्त उजुरीहरू';
  
  const helloSarkarComplaints = state.complaints.filter(c => c.source === 'hello_sarkar');
  
  const content = `
    <div class="filter-bar mb-3">
      <div class="filter-group"><label class="filter-label">स्थिति:</label><select class="form-select form-select-sm" id="filterStatus"><option value="">सबै</option><option value="pending">काम बाँकी</option><option value="progress">चालु</option><option value="resolved">फछ्रयौट</option></select></div>
      <div class="filter-group"><input type="text" class="form-control form-control-sm" placeholder="खोज्नुहोस्..." id="searchText" /></div>
      <button class="btn btn-primary btn-sm" onclick="filterAdminComplaints()">खोज्नुहोस्</button>
      <button class="btn btn-success btn-sm" onclick="exportToExcel('hello_sarkar')"><i class="fas fa-file-excel"></i> Excel</button>
      <button class="btn btn-primary btn-sm" onclick="showNewHelloSarkarComplaint()"><i class="fas fa-plus"></i> नयाँ उजुरी</button>
    </div>
    
    <div class="card">
      <div class="card-header"><h5 class="mb-0">हेलो सरकारबाट प्राप्त उजुरी सूची</h5></div>
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table">
            <thead><tr><th>क्र.सं.</th><th>मिति</th><th>उजुरकर्ता</th><th>विपक्षी</th><th>उजुरीको विवरण</th><th>सम्बन्धित शाखा</th><th>शाखामा पठाएको मिति</th><th>निर्णय</th><th>कैफियत</th><th>कार्य</th></tr></thead>
            <tbody id="adminComplaintsTable">
              ${helloSarkarComplaints.map((complaint, index) => `
                <tr>
                  <td>${index + 1}</td><td>${complaint.date}</td><td>${complaint.complainant}</td><td>${complaint.accused || '-'}</td>
                  <td class="text-limit" title="${complaint.description}">${complaint.description.substring(0, 50)}...</td>
                  <td>${complaint.assignedShakha || '-'}</td><td>${complaint.assignedDate || '-'}</td>
                  <td class="text-limit" title="${complaint.decision || ''}">${complaint.decision ? complaint.decision.substring(0, 30) + '...' : '-'}</td>
                  <td>${complaint.remarks || '-'}</td>
                  <td><div class="table-actions"><button class="action-btn" onclick="viewComplaint('${complaint.id}')" title="हेर्नुहोस्"><i class="fas fa-eye"></i></button><button class="action-btn" onclick="assignToShakha('${complaint.id}')" title="शाखामा पठाउनुहोस्"><i class="fas fa-paper-plane"></i></button></div></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
  
  document.getElementById('contentArea').innerHTML = content;
  updateActiveNavItem();
}

function showNewComplaintView() {
  state.currentView = 'new_complaint';
  document.getElementById('pageTitle').textContent = 'नयाँ उजुरी दर्ता';
  
  const currentDate = getCurrentNepaliDate();
  
  const content = `
    <div class="card">
      <div class="card-header"><h5 class="mb-0">नयाँ उजुरी दर्ता फारम</h5></div>
      <div class="card-body">
        <div class="d-grid gap-3" style="grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));">
          <div class="form-group"><label class="form-label">दर्ता नं *</label><input type="text" class="form-control" id="complaintId" placeholder="NVC-YYYY-NNNN" /></div>
          <div class="form-group"><label class="form-label">दर्ता मिति *</label><input type="text" class="form-control nepali-datepicker-input" id="complaintDate" placeholder="मिति छान्नुहोस्" value="${currentDate}" /></div>
          <div class="form-group"><label class="form-label">उजुरकर्ताको नाम *</label><input type="text" class="form-control" id="complainantName" placeholder="पूरा नाम" /></div>
          <div class="form-group"><label class="form-label">विपक्षी</label><input type="text" class="form-control" id="accusedName" placeholder="विपक्षीको नाम" /></div>
          <div class="form-group" style="grid-column: span 2;"><label class="form-label">उजुरीको विवरण *</label><textarea class="form-control" rows="3" id="complaintDescription" placeholder="उजुरीको संक्षिप्त विवरण" maxlength="500"></textarea><div class="text-xs text-muted mt-1" id="descCount">०/५०० अक्षर</div></div>
          <div class="form-group" style="grid-column: span 2;"><label class="form-label">प्रस्तावित निर्णय</label><textarea class="form-control" rows="3" id="proposedDecision" placeholder="प्रस्तावित निर्णय" maxlength="500"></textarea><div class="text-xs text-muted mt-1" id="decisionCount">०/५०० अक्षर</div></div>
          <div class="form-group"><label class="form-label">कैफियत</label><input type="text" class="form-control" id="complaintRemarks" placeholder="कैफियत" /></div>
          <div class="form-group"><label class="form-label">स्थिति *</label><select class="form-select" id="complaintStatus"><option value="pending">काम बाँकी</option><option value="progress">चालु</option><option value="resolved">फछ्रयौट</option></select></div>
        </div>
        <div class="mt-4 d-flex justify-end gap-2">
          <button class="btn btn-outline" onclick="showComplaintsView()">रद्द गर्नुहोस्</button>
          <button class="btn btn-primary" onclick="saveNewComplaint()">सुरक्षित गर्नुहोस्</button>
        </div>
      </div>
    </div>
  `;
  
  document.getElementById('contentArea').innerHTML = content;
  updateActiveNavItem();
  
  setTimeout(() => {
    initializeDatepickers();
    
    const descTextarea = document.getElementById('complaintDescription');
    if (descTextarea) descTextarea.addEventListener('input', function() { document.getElementById('descCount').textContent = this.value.length + '/५०० अक्षर'; });
    const decisionTextarea = document.getElementById('proposedDecision');
    if (decisionTextarea) decisionTextarea.addEventListener('input', function() { document.getElementById('decisionCount').textContent = this.value.length + '/५०० अक्षर'; });
  }, 100);
}

function showNewHelloSarkarComplaint() {
  const currentDate = getCurrentNepaliDate();
  const formContent = `
    <div class="d-grid gap-3">
      <div class="d-grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
        <div class="form-group"><label class="form-label">उजुरी नं *</label><input type="text" class="form-control" id="hsComplaintId" placeholder="HS-YYYY-NNNN" /></div>
        <div class="form-group"><label class="form-label">मिति *</label><input type="text" class="form-control nepali-datepicker-input" id="hsComplaintDate" value="${currentDate}" /></div>
      </div>
      <div class="d-grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
        <div class="form-group"><label class="form-label">उजुरकर्ता *</label><input type="text" class="form-control" id="hsComplainant" placeholder="पूरा नाम" /></div>
        <div class="form-group"><label class="form-label">विपक्षी</label><input type="text" class="form-control" id="hsAccused" placeholder="विपक्षीको नाम" /></div>
      </div>
      <div class="form-group"><label class="form-label">उजुरीको विवरण *</label><textarea class="form-control" rows="4" id="hsDescription" placeholder="उजुरीको विवरण"></textarea></div>
      <div class="form-group"><label class="form-label">सम्बन्धित शाखा *</label><select class="form-select" id="hsAssignedShakha"><option value="">छान्नुहोस्</option>${Object.entries(SHAKHA).map(([key, value]) => `<option value="${key}">${value}</option>`).join('')}</select></div>
      <div class="d-grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
        <div class="form-group"><label class="form-label">शाखामा पठाएको मिति</label><input type="text" class="form-control nepali-datepicker-input" id="hsAssignedDate" /></div>
        <div class="form-group"><label class="form-label">स्थिति</label><select class="form-select" id="hsStatus"><option value="pending">काम बाँकी</option><option value="progress">चालु</option><option value="resolved">फछ्रयौट</option></select></div>
      </div>
      <div class="form-group"><label class="form-label">कैफियत</label><textarea class="form-control" rows="2" id="hsRemarks" placeholder="कैफियत"></textarea></div>
    </div>
    <div class="modal-footer"><button class="btn btn-outline" onclick="closeModal()">रद्द गर्नुहोस्</button><button class="btn btn-primary" onclick="saveHelloSarkarComplaint()">सुरक्षित गर्नुहोस्</button></div>
  `;
  
  openModal('नयाँ हेलो सरकार उजुरी', formContent);
  setTimeout(initializeDatepickers, 100);
}

function saveHelloSarkarComplaint() {
  const id = document.getElementById('hsComplaintId').value;
  const date = document.getElementById('hsComplaintDate').value;
  const complainant = document.getElementById('hsComplainant').value;
  const accused = document.getElementById('hsAccused').value;
  const description = document.getElementById('hsDescription').value;
  const assignedShakha = document.getElementById('hsAssignedShakha').value;
  const assignedDate = document.getElementById('hsAssignedDate').value;
  const status = document.getElementById('hsStatus').value;
  const remarks = document.getElementById('hsRemarks').value;
  
  if (!id || !date || !complainant || !description || !assignedShakha) {
    showToast('कृपया आवश्यक फिल्डहरू भर्नुहोस्', 'warning');
    return;
  }
  
  const newComplaint = {
    id, date, complainant, accused: accused || '', description,
    assignedShakha, assignedDate: assignedDate || '', status,
    remarks: remarks || '', shakha: 'admin_planning',
    mahashakha: MAHASHAKHA.ADMIN_MONITORING, source: 'hello_sarkar',
    createdBy: state.currentUser.name, createdAt: new Date().toISOString()
  };
  
  state.complaints.push(newComplaint);
  showToast('उजुरी सुरक्षित गरियो', 'success');
  closeModal();
  showAdminComplaintsView();
}

function assignToShakha(id) {
  const complaint = state.complaints.find(c => c.id === id);
  if (!complaint) return;
  
  const currentDate = getCurrentNepaliDate();
  const formContent = `
    <div class="d-grid gap-3">
      <div class="form-group"><label class="form-label">उजुरी नं</label><input type="text" class="form-control" value="${complaint.id}" readonly /></div>
      <div class="form-group"><label class="form-label">शाखा *</label><select class="form-select" id="assignShakha"><option value="">छान्नुहोस्</option>${Object.entries(SHAKHA).map(([key, value]) => `<option value="${key}" ${complaint.assignedShakha === key ? 'selected' : ''}>${value}</option>`).join('')}</select></div>
      <div class="form-group"><label class="form-label">पठाएको मिति *</label><input type="text" class="form-control nepali-datepicker-input" id="assignDate" value="${currentDate}" /></div>
      <div class="form-group"><label class="form-label">सन्देश</label><textarea class="form-control" rows="3" id="assignInstructions" placeholder="शाखालाई दिने सन्देश"></textarea></div>
    </div>
    <div class="modal-footer"><button class="btn btn-outline" onclick="closeModal()">रद्द गर्नुहोस्</button><button class="btn btn-primary" onclick="saveShakhaAssignment('${id}')">पठाउनुहोस्</button></div>
  `;
  
  openModal('शाखामा उजुरी पठाउनुहोस्', formContent);
  setTimeout(initializeDatepickers, 100);
}

function saveShakhaAssignment(id) {
  const complaintIndex = state.complaints.findIndex(c => c.id === id);
  if (complaintIndex === -1) return;
  
  const assignedShakha = document.getElementById('assignShakha').value;
  const assignDate = document.getElementById('assignDate').value;
  const instructions = document.getElementById('assignInstructions').value;
  
  if (!assignedShakha || !assignDate) {
    showToast('कृपया शाखा र मिति छान्नुहोस्', 'warning');
    return;
  }
  
  state.complaints[complaintIndex] = {
    ...state.complaints[complaintIndex],
    assignedShakha, assignedDate: assignDate,
    instructions: instructions || '', status: 'progress'
  };
  
  showToast('उजुरी शाखामा पठाइयो', 'success');
  closeModal();
  showAdminComplaintsView();
}

// ==================== TECHNICAL PROJECTS VIEW ====================
function showTechnicalProjectsView() {
  state.currentView = 'technical_projects';
  document.getElementById('pageTitle').textContent = 'प्राविधिक परीक्षण';
  
  const technicalProjects = state.projects.filter(p => p.shakha === state.currentUser.shakha);
  
  const content = `
    <div class="filter-bar mb-3">
      <div class="filter-group"><label class="filter-label">स्थिति:</label><select class="form-select form-select-sm" id="filterProjectStatus"><option value="">सबै</option><option value="active">चालु</option><option value="completed">सम्पन्न</option><option value="pending">काम बाँकी</option></select></div>
      <div class="filter-group"><input type="text" class="form-control form-control-sm" placeholder="खोज्नुहोस्..." id="projectSearchText" /></div>
      <button class="btn btn-primary btn-sm" onclick="filterProjects()">खोज्नुहोस्</button>
      <button class="btn btn-success btn-sm" onclick="exportToExcel('technical_projects')"><i class="fas fa-file-excel"></i> Excel</button>
      <button class="btn btn-primary btn-sm" onclick="showNewProjectModal()"><i class="fas fa-plus"></i> नयाँ आयोजना</button>
    </div>
    
    <div class="card">
      <div class="card-header"><h5 class="mb-0">प्राविधिक परीक्षण र आयोजना अनुगमन</h5></div>
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table">
            <thead><tr><th>क्र.सं.</th><th>आयोजनाको नाम</th><th>सम्बन्धित निकाय</th><th>अनुगमन/प्राविधिक परीक्षण मिति</th><th>अपरिपालनाहरु (NCR)</th><th>सुधारका लागि पत्रको मिति</th><th>सुधारको जानकारी प्राप्त मिति</th><th>कैफियत</th><th>कार्य</th></tr></thead>
            <tbody id="projectsTable">
              ${technicalProjects.map((project, index) => `
                <tr>
                  <td>${index + 1}</td><td>${project.name}</td><td>${project.organization}</td><td>${project.inspectionDate}</td>
                  <td class="text-limit" title="${project.nonCompliances}">${project.nonCompliances.substring(0, 50)}...</td>
                  <td>${project.improvementLetterDate || '-'}</td><td>${project.improvementInfo || '-'}</td><td>${project.remarks || '-'}</td>
                  <td><div class="table-actions"><button class="action-btn" onclick="viewProject('${project.id}')" title="हेर्नुहोस्"><i class="fas fa-eye"></i></button><button class="action-btn" onclick="editProject('${project.id}')" title="सम्पादन गर्नुहोस्"><i class="fas fa-edit"></i></button></div></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
  
  document.getElementById('contentArea').innerHTML = content;
  updateActiveNavItem();
}

function showNewProjectModal() {
  const currentDate = getCurrentNepaliDate();
  const formContent = `
    <div class="d-grid gap-3">
      <div class="d-grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
        <div class="form-group"><label class="form-label">आयोजनाको नाम *</label><input type="text" class="form-control" id="projectName" placeholder="आयोजनाको नाम" /></div>
        <div class="form-group"><label class="form-label">सम्बन्धित निकाय *</label><input type="text" class="form-control" id="projectOrganization" placeholder="सम्बन्धित निकायको नाम" /></div>
      </div>
      <div class="form-group"><label class="form-label">अनुगमन/प्राविधिक परीक्षण मिति *</label><input type="text" class="form-control nepali-datepicker-input" id="projectInspectionDate" value="${currentDate}" /></div>
      <div class="form-group"><label class="form-label">अपरिपालनाहरु (NCR) *</label><textarea class="form-control" rows="3" id="projectNonCompliances" placeholder="अपरिपालनाहरुको विवरण"></textarea></div>
      <div class="d-grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
        <div class="form-group"><label class="form-label">सुधारका लागि पत्र मिति</label><input type="text" class="form-control nepali-datepicker-input" id="projectImprovementLetterDate" /></div>
        <div class="form-group"><label class="form-label">स्थिति</label><select class="form-select" id="projectStatus"><option value="pending">काम बाँकी</option><option value="active">सक्रिय</option><option value="completed">सम्पन्न</option></select></div>
      </div>
      <div class="form-group"><label class="form-label">अपरिपालना सुधारको जानकारी</label><textarea class="form-control" rows="2" id="projectImprovementInfo" placeholder="अपरिपालना सुधारको जानकारी"></textarea></div>
      <div class="form-group"><label class="form-label">कैफियत</label><textarea class="form-control" rows="2" id="projectRemarks" placeholder="कैफियत"></textarea></div>
    </div>
    <div class="modal-footer"><button class="btn btn-outline" onclick="closeModal()">रद्द गर्नुहोस्</button><button class="btn btn-primary" onclick="saveTechnicalProject()">सुरक्षित गर्नुहोस्</button></div>
  `;
  
  openModal('नयाँ आयोजना', formContent);
  setTimeout(initializeDatepickers, 100);
}

function viewProject(id) {
  const project = state.projects.find(p => p.id === id);
  if (!project) { showToast('आयोजना फेला परेन', 'error'); return; }
  
  const statusText = project.status === 'active' ? 'चालु' : project.status === 'completed' ? 'सम्पन्न' : 'काम बाँकी';
  
  const content = `
    <div class="d-grid gap-3">
      <div class="d-grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
        <div><div class="text-small text-muted">आयोजनाको नाम</div><div class="text-large">${project.name}</div></div>
        <div><div class="text-small text-muted">सम्बन्धित निकाय</div><div>${project.organization}</div></div>
        <div><div class="text-small text-muted">स्थिति</div><div><span class="status-badge ${project.status === 'active' ? 'status-progress' : project.status === 'completed' ? 'status-resolved' : 'status-pending'}">${statusText}</span></div></div>
      </div>
      <div class="d-grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
        <div><div class="text-small text-muted">परीक्षण मिति</div><div>${project.inspectionDate}</div></div>
        <div><div class="text-small text-muted">सुधारको लागि पत्रको मिति</div><div>${project.improvementLetterDate || '-'}</div></div>
        <div><div class="text-small text-muted">शाखा</div><div>${project.shakha}</div></div>
      </div>
      <div><div class="text-small text-muted">अपरिपालनाहरु</div><div class="card p-3 bg-light">${project.nonCompliances}</div></div>
      <div><div class="text-small text-muted">अपरिपालना सुधारको जानकारी</div><div class="card p-3 bg-light">${project.improvementInfo || 'कुनै सुधार जानकारी छैन'}</div></div>
      <div><div class="text-small text-muted">कैफियत</div><div class="card p-3 bg-light">${project.remarks || 'कुनै कैफियत छैन'}</div></div>
    </div>
  `;
  
  openModal('आयोजना विवरण', content);
}

function editProject(id) {
  const project = state.projects.find(p => p.id === id);
  if (!project) return;
  
  const formContent = `
    <div class="d-grid gap-3">
      <div class="d-grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
        <div class="form-group"><label class="form-label">आयोजनाको नाम</label><input type="text" class="form-control" value="${project.name}" id="editProjectName" /></div>
        <div class="form-group"><label class="form-label">सम्बन्धित निकाय</label><input type="text" class="form-control" value="${project.organization}" id="editProjectOrganization" /></div>
      </div>
      <div class="form-group"><label class="form-label">अनुगमन/प्राविधिक परीक्षण मिति</label><input type="text" class="form-control nepali-datepicker-input" value="${project.inspectionDate}" id="editProjectInspectionDate" /></div>
      <div class="form-group"><label class="form-label">अपरिपालनाहरु (NCR)</label><textarea class="form-control" rows="3" id="editProjectNonCompliances">${project.nonCompliances}</textarea></div>
      <div class="d-grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
        <div class="form-group"><label class="form-label">अपरिपालना सुधारका लागि पत्रको मिति</label><input type="text" class="form-control nepali-datepicker-input" value="${project.improvementLetterDate || ''}" id="editProjectImprovementLetterDate" /></div>
        <div class="form-group"><label class="form-label">स्थिति</label><select class="form-select" id="editProjectStatus"><option value="pending" ${project.status === 'pending' ? 'selected' : ''}>काम बाँकी</option><option value="active" ${project.status === 'active' ? 'selected' : ''}>सक्रिय</option><option value="completed" ${project.status === 'completed' ? 'selected' : ''}>सम्पन्न</option></select></div>
      </div>
      <div class="form-group"><label class="form-label">अपरिपालना सुधारको जानकारी</label><textarea class="form-control" rows="2" id="editProjectImprovementInfo">${project.improvementInfo || ''}</textarea></div>
      <div class="form-group"><label class="form-label">कैफियत</label><textarea class="form-control" rows="2" id="editProjectRemarks">${project.remarks || ''}</textarea></div>
    </div>
    <div class="modal-footer"><button class="btn btn-outline" onclick="closeModal()">रद्द गर्नुहोस्</button><button class="btn btn-primary" onclick="saveProjectEdit('${id}')">सुरक्षित गर्नुहोस्</button></div>
  `;
  
  openModal('आयोजना सम्पादन', formContent);
  setTimeout(initializeDatepickers, 100);
}

function saveProjectEdit(id) {
  const projectIndex = state.projects.findIndex(p => p.id === id);
  if (projectIndex === -1) return;
  
  const updatedProject = {
    ...state.projects[projectIndex],
    name: document.getElementById('editProjectName').value,
    organization: document.getElementById('editProjectOrganization').value,
    inspectionDate: document.getElementById('editProjectInspectionDate').value,
    nonCompliances: document.getElementById('editProjectNonCompliances').value,
    improvementLetterDate: document.getElementById('editProjectImprovementLetterDate').value || '',
    status: document.getElementById('editProjectStatus').value,
    improvementInfo: document.getElementById('editProjectImprovementInfo').value || '',
    remarks: document.getElementById('editProjectRemarks').value || '',
    updatedAt: new Date().toISOString(),
    updatedBy: state.currentUser.name
  };
  
  state.projects[projectIndex] = updatedProject;
  showToast('आयोजना सुरक्षित गरियो', 'success');
  closeModal();
  showTechnicalProjectsView();
}

// ==================== EMPLOYEE MONITORING ====================
function showEmployeeMonitoringView() {
  state.currentView = 'employee_monitoring';
  document.getElementById('pageTitle').textContent = 'कार्यालय अनुगमन';
  
  const content = `
    <div class="filter-bar mb-3">
      <div class="filter-group"><label class="filter-label">मिति:</label><input type="text" class="form-control form-control-sm nepali-datepicker-input" placeholder="सुरु मिति" id="empStartDate" /></div>
      <div class="filter-group"><input type="text" class="form-control form-control-sm nepali-datepicker-input" placeholder="अन्त्य मिति" id="empEndDate" /></div>
      <div class="filter-group"><input type="text" class="form-control form-control-sm" placeholder="निकाय खोज्नुहोस्..." id="empSearchText" /></div>
      <button class="btn btn-primary btn-sm" onclick="filterEmployeeMonitoring()">खोज्नुहोस्</button>
      <button class="btn btn-success btn-sm" onclick="exportToExcel('employee_monitoring')"><i class="fas fa-file-excel"></i> Excel</button>
      <button class="btn btn-primary btn-sm" onclick="showNewEmployeeMonitoring()"><i class="fas fa-plus"></i> नयाँ अनुगमन</button>
    </div>
    
    <div class="card">
      <div class="card-header"><h5 class="mb-0">कर्मचारीहरुको समयपालना र पोशाक अनुगमन</h5></div>
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table">
            <thead><tr><th>क्र.सं.</th><th>अनुगमन मिति</th><th>अनुगमन गरेको निकाय</th><th>तोकिएको पोशाक नलगाउने कर्मचारी</th><th>समय पालना नगर्ने कर्मचारी</th><th>निर्देशन मिति</th><th>कैफियत</th><th>कार्य</th></tr></thead>
            <tbody id="employeeMonitoringTable">
              ${state.employeeMonitoring.map((record, index) => `
                <tr>
                  <td>${index + 1}</td><td>${record.date}</td><td>${record.organization}</td><td>${record.uniformViolation}</td><td>${record.timeViolation}</td>
                  <td>${record.instructionDate}</td><td>${record.remarks}</td>
                  <td><div class="table-actions"><button class="action-btn" onclick="viewEmployeeMonitoring(${record.id})" title="हेर्नुहोस्"><i class="fas fa-eye"></i></button><button class="action-btn" onclick="editEmployeeMonitoring(${record.id})" title="सम्पादन गर्नुहोस्"><i class="fas fa-edit"></i></button></div></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
  
  document.getElementById('contentArea').innerHTML = content;
  updateActiveNavItem();
  setTimeout(initializeDatepickers, 100);
}

function showNewEmployeeMonitoring() {
  const currentDate = getCurrentNepaliDate();
  const formContent = `
    <div class="d-grid gap-3">
      <div class="d-grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
        <div class="form-group"><label class="form-label">अनुगमन मिति *</label><input type="text" class="form-control nepali-datepicker-input" id="empDate" value="${currentDate}" /></div>
        <div class="form-group"><label class="form-label">निकाय *</label><input type="text" class="form-control" id="empOrganization" placeholder="निकायको नाम" /></div>
      </div>
      <div class="d-grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
        <div class="form-group"><label class="form-label">पोशाक अपरिपालना</label><input type="number" class="form-control" id="empUniformViolation" placeholder="०" min="0" /></div>
        <div class="form-group"><label class="form-label">समय अपरिपालना</label><input type="number" class="form-control" id="empTimeViolation" placeholder="०" min="0" /></div>
      </div>
      <div class="form-group"><label class="form-label">निर्देशन मिति</label><input type="text" class="form-control nepali-datepicker-input" id="empInstructionDate" /></div>
      <div class="form-group"><label class="form-label">कैफियत</label><textarea class="form-control" rows="3" id="empRemarks" placeholder="कैफियत"></textarea></div>
    </div>
    <div class="modal-footer"><button class="btn btn-outline" onclick="closeModal()">रद्द गर्नुहोस्</button><button class="btn btn-primary" onclick="saveEmployeeMonitoring()">सुरक्षित गर्नुहोस्</button></div>
  `;
  
  openModal('नयाँ कार्यालय अनुगमन', formContent);
  setTimeout(initializeDatepickers, 100);
}

function saveEmployeeMonitoring() {
  const date = document.getElementById('empDate').value;
  const organization = document.getElementById('empOrganization').value;
  const uniformViolation = document.getElementById('empUniformViolation').value || '०';
  const timeViolation = document.getElementById('empTimeViolation').value || '०';
  const instructionDate = document.getElementById('empInstructionDate').value || '';
  const remarks = document.getElementById('empRemarks').value || '';
  
  if (!date || !organization) {
    showToast('कृपया मिति र निकाय भर्नुहोस्', 'warning');
    return;
  }
  
  const newRecord = {
    id: Date.now(), date, organization,
    uniformViolation, timeViolation,
    instructionDate, remarks,
    createdBy: state.currentUser.name,
    createdAt: new Date().toISOString()
  };
  
  state.employeeMonitoring.unshift(newRecord);
  showToast('कार्यालय अनुगमन सुरक्षित गरियो', 'success');
  closeModal();
  showEmployeeMonitoringView();
}

function viewEmployeeMonitoring(id) {
  const record = state.employeeMonitoring.find(r => r.id === id);
  if (!record) { showToast('अभिलेख फेला परेन', 'error'); return; }
  
  const content = `
    <div class="d-grid gap-3">
      <div class="d-grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
        <div><div class="text-small text-muted">अनुगमन मिति</div><div class="text-large">${record.date}</div></div>
        <div><div class="text-small text-muted">निकाय</div><div>${record.organization}</div></div>
      </div>
      <div class="d-grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
        <div><div class="text-small text-muted">पोशाक अपरिपालना</div><div>${record.uniformViolation}</div></div>
        <div><div class="text-small text-muted">समय अपरिपालना</div><div>${record.timeViolation}</div></div>
      </div>
      <div><div class="text-small text-muted">निर्देशन मिति</div><div>${record.instructionDate}</div></div>
      <div><div class="text-small text-muted">कैफियत</div><div class="card p-3 bg-light">${record.remarks}</div></div>
    </div>
  `;
  
  openModal('कार्यालय अनुगमन विवरण', content);
}

function editEmployeeMonitoring(id) {
  const record = state.employeeMonitoring.find(r => r.id === id);
  if (!record) return;
  
  const formContent = `
    <div class="d-grid gap-3">
      <div class="d-grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
        <div class="form-group"><label class="form-label">अनुगमन मिति</label><input type="text" class="form-control nepali-datepicker-input" value="${record.date}" id="editEmpDate" /></div>
        <div class="form-group"><label class="form-label">निकाय</label><input type="text" class="form-control" value="${record.organization}" id="editEmpOrganization" /></div>
      </div>
      <div class="d-grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
        <div class="form-group"><label class="form-label">पोशाक अपरिपालना</label><input type="number" class="form-control" value="${record.uniformViolation}" id="editEmpUniformViolation" min="0" /></div>
        <div class="form-group"><label class="form-label">समय अपरिपालना</label><input type="number" class="form-control" value="${record.timeViolation}" id="editEmpTimeViolation" min="0" /></div>
      </div>
      <div class="form-group"><label class="form-label">निर्देशन मिति</label><input type="text" class="form-control nepali-datepicker-input" value="${record.instructionDate || ''}" id="editEmpInstructionDate" /></div>
      <div class="form-group"><label class="form-label">कैफियत</label><textarea class="form-control" rows="3" id="editEmpRemarks">${record.remarks}</textarea></div>
    </div>
    <div class="modal-footer"><button class="btn btn-outline" onclick="closeModal()">रद्द गर्नुहोस्</button><button class="btn btn-primary" onclick="saveEmployeeMonitoringEdit(${id})">सुरक्षित गर्नुहोस्</button></div>
  `;
  
  openModal('कार्यालय अनुगमन सम्पादन', formContent);
  setTimeout(initializeDatepickers, 100);
}

function saveEmployeeMonitoringEdit(id) {
  const recordIndex = state.employeeMonitoring.findIndex(r => r.id === id);
  if (recordIndex === -1) return;
  
  const updatedRecord = {
    ...state.employeeMonitoring[recordIndex],
    date: document.getElementById('editEmpDate').value,
    organization: document.getElementById('editEmpOrganization').value,
    uniformViolation: document.getElementById('editEmpUniformViolation').value || '०',
    timeViolation: document.getElementById('editEmpTimeViolation').value || '०',
    instructionDate: document.getElementById('editEmpInstructionDate').value || '',
    remarks: document.getElementById('editEmpRemarks').value || '',
    updatedAt: new Date().toISOString(),
    updatedBy: state.currentUser.name
  };
  
  state.employeeMonitoring[recordIndex] = updatedRecord;
  showToast('कार्यालय अनुगमन सुरक्षित गरियो', 'success');
  closeModal();
  showEmployeeMonitoringView();
}

function filterEmployeeMonitoring() {
  const searchText = document.getElementById('empSearchText')?.value.toLowerCase() || '';
  let filtered = state.employeeMonitoring;
  
  if (searchText) {
    filtered = filtered.filter(record => 
      record.organization.toLowerCase().includes(searchText) ||
      record.remarks.toLowerCase().includes(searchText)
    );
  }
  
  const tbody = document.getElementById('employeeMonitoringTable');
  if (tbody) {
    tbody.innerHTML = filtered.map((record, index) => `
      <tr>
        <td>${index + 1}</td><td>${record.date}</td><td>${record.organization}</td><td>${record.uniformViolation}</td>
        <td>${record.timeViolation}</td><td>${record.instructionDate}</td><td>${record.remarks}</td>
        <td><div class="table-actions"><button class="action-btn" onclick="viewEmployeeMonitoring(${record.id})" title="हेर्नुहोस्"><i class="fas fa-eye"></i></button><button class="action-btn" onclick="editEmployeeMonitoring(${record.id})" title="सम्पादन गर्नुहोस्"><i class="fas fa-edit"></i></button></div></td>
      </tr>
    `).join('');
  }
}

// ==================== CITIZEN CHARTER ====================
function showCitizenCharterView() {
  state.currentView = 'citizen_charter';
  document.getElementById('pageTitle').textContent = 'नागरिक बडापत्र अनुगमन';
  
  const content = `
    <div class="card">
      <div class="card-header d-flex justify-between align-center">
        <h5 class="mb-0">नागरिक बडापत्र अनुगमन अभिलेख</h5>
        <button class="btn btn-primary btn-sm" onclick="showNewCitizenCharter()"><i class="fas fa-plus"></i> नयाँ अनुगमन</button>
      </div>
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table">
            <thead><tr><th>क्र.सं.</th><th>अनुगमन मिति</th><th>अनुगमन गरेको निकाय</th><th>नागरिक बडापत्र अनुगमनबाट देखिएको अवस्था</th><th>केन्द्रबाट दिइएको निर्देशन</th><th>निर्देशन मिति</th><th>कैफियत</th><th>कार्य</th></tr></thead>
            <tbody>
              ${state.citizenCharters.map((record, index) => `
                <tr>
                  <td>${index + 1}</td><td>${record.date}</td><td>${record.organization}</td><td>${record.findings}</td>
                  <td>${record.instructions}</td><td>${record.instructionDate}</td><td>${record.remarks}</td>
                  <td><div class="table-actions"><button class="action-btn" onclick="viewCitizenCharter(${record.id})" title="हेर्नुहोस्"><i class="fas fa-eye"></i></button><button class="action-btn" onclick="editCitizenCharter(${record.id})" title="सम्पादन गर्नुहोस्"><i class="fas fa-edit"></i></button></div></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
  
  document.getElementById('contentArea').innerHTML = content;
  updateActiveNavItem();
}

function showNewCitizenCharter() {
  const currentDate = getCurrentNepaliDate();
  const formContent = `
    <div class="d-grid gap-3">
      <div class="d-grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
        <div class="form-group"><label class="form-label">अनुगमन मिति *</label><input type="text" class="form-control nepali-datepicker-input" id="ccDate" value="${currentDate}" /></div>
        <div class="form-group"><label class="form-label">निकाय *</label><input type="text" class="form-control" id="ccOrganization" placeholder="निकायको नाम" /></div>
      </div>
      <div class="form-group"><label class="form-label">अनुगमनबाट देखिएको अवस्था *</label><textarea class="form-control" rows="3" id="ccFindings" placeholder="अनुगमनबाट देखिएको अवस्था"></textarea></div>
      <div class="form-group"><label class="form-label">केन्द्रबाट दिइएको निर्देशन *</label><textarea class="form-control" rows="3" id="ccInstructions" placeholder="निर्देशन"></textarea></div>
      <div class="form-group"><label class="form-label">निर्देशन मिति</label><input type="text" class="form-control nepali-datepicker-input" id="ccInstructionDate" /></div>
      <div class="form-group"><label class="form-label">कैफियत</label><textarea class="form-control" rows="2" id="ccRemarks" placeholder="कैफियत"></textarea></div>
    </div>
    <div class="modal-footer"><button class="btn btn-outline" onclick="closeModal()">रद्द गर्नुहोस्</button><button class="btn btn-primary" onclick="saveCitizenCharter()">सुरक्षित गर्नुहोस्</button></div>
  `;
  
  openModal('नयाँ नागरिक बडापत्र अनुगमन', formContent);
  setTimeout(initializeDatepickers, 100);
}

function saveCitizenCharter() {
  const date = document.getElementById('ccDate').value;
  const organization = document.getElementById('ccOrganization').value;
  const findings = document.getElementById('ccFindings').value;
  const instructions = document.getElementById('ccInstructions').value;
  const instructionDate = document.getElementById('ccInstructionDate').value || '';
  const remarks = document.getElementById('ccRemarks').value || '';
  
  if (!date || !organization || !findings || !instructions) {
    showToast('कृपया आवश्यक फिल्डहरू भर्नुहोस्', 'warning');
    return;
  }
  
  const newRecord = {
    id: Date.now(), date, organization, findings, instructions,
    instructionDate, remarks,
    createdBy: state.currentUser.name,
    createdAt: new Date().toISOString()
  };
  
  state.citizenCharters.unshift(newRecord);
  showToast('नागरिक बडापत्र अनुगमन सुरक्षित गरियो', 'success');
  closeModal();
  showCitizenCharterView();
}

function viewCitizenCharter(id) {
  const record = state.citizenCharters.find(r => r.id === id);
  if (!record) { showToast('अभिलेख फेला परेन', 'error'); return; }
  
  const content = `
    <div class="d-grid gap-3">
      <div class="d-grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
        <div><div class="text-small text-muted">अनुगमन मिति</div><div class="text-large">${record.date}</div></div>
        <div><div class="text-small text-muted">निकाय</div><div>${record.organization}</div></div>
      </div>
      <div><div class="text-small text-muted">अनुगमनबाट देखिएको अवस्था</div><div class="card p-3 bg-light">${record.findings}</div></div>
      <div><div class="text-small text-muted">केन्द्रबाट दिएको निर्देशन</div><div class="card p-3 bg-light">${record.instructions}</div></div>
      <div><div class="text-small text-muted">निर्देशन मिति</div><div>${record.instructionDate}</div></div>
      <div><div class="text-small text-muted">कैफियत</div><div class="card p-3 bg-light">${record.remarks || 'कुनै कैफियत छैन'}</div></div>
    </div>
  `;
  
  openModal('नागरिक बडापत्र अनुगमन विवरण', content);
}

function editCitizenCharter(id) {
  const record = state.citizenCharters.find(r => r.id === id);
  if (!record) return;
  
  const formContent = `
    <div class="d-grid gap-3">
      <div class="d-grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
        <div class="form-group"><label class="form-label">अनुगमन मिति</label><input type="text" class="form-control nepali-datepicker-input" value="${record.date}" id="editCcDate" /></div>
        <div class="form-group"><label class="form-label">निकाय</label><input type="text" class="form-control" value="${record.organization}" id="editCcOrganization" /></div>
      </div>
      <div class="form-group"><label class="form-label">अनुगमनबाट देखिएको अवस्था</label><textarea class="form-control" rows="3" id="editCcFindings">${record.findings}</textarea></div>
      <div class="form-group"><label class="form-label">केन्द्रबाट दिएको निर्देशन</label><textarea class="form-control" rows="3" id="editCcInstructions">${record.instructions}</textarea></div>
      <div class="form-group"><label class="form-label">निर्देशन मिति</label><input type="text" class="form-control nepali-datepicker-input" value="${record.instructionDate || ''}" id="editCcInstructionDate" /></div>
      <div class="form-group"><label class="form-label">कैफियत</label><textarea class="form-control" rows="2" id="editCcRemarks">${record.remarks || ''}</textarea></div>
    </div>
    <div class="modal-footer"><button class="btn btn-outline" onclick="closeModal()">रद्द गर्नुहोस्</button><button class="btn btn-primary" onclick="saveCitizenCharterEdit(${id})">सुरक्षित गर्नुहोस्</button></div>
  `;
  
  openModal('नागरिक बडापत्र अनुगमन सम्पादन', formContent);
  setTimeout(initializeDatepickers, 100);
}

function saveCitizenCharterEdit(id) {
  const recordIndex = state.citizenCharters.findIndex(r => r.id === id);
  if (recordIndex === -1) return;
  
  const updatedRecord = {
    ...state.citizenCharters[recordIndex],
    date: document.getElementById('editCcDate').value,
    organization: document.getElementById('editCcOrganization').value,
    findings: document.getElementById('editCcFindings').value,
    instructions: document.getElementById('editCcInstructions').value,
    instructionDate: document.getElementById('editCcInstructionDate').value || '',
    remarks: document.getElementById('editCcRemarks').value || '',
    updatedAt: new Date().toISOString(),
    updatedBy: state.currentUser.name
  };
  
  state.citizenCharters[recordIndex] = updatedRecord;
  showToast('नागरिक बडापत्र अनुगमन सुरक्षित गरियो', 'success');
  closeModal();
  showCitizenCharterView();
}

// ==================== REPORTS VIEWS ====================
function showReportsView() {
  state.currentView = 'reports';
  document.getElementById('pageTitle').textContent = 'रिपोर्टहरू';
  
  const content = `
    <div class="card">
      <div class="card-header"><h5 class="mb-0">रिपोर्ट जेनरेटर</h5></div>
      <div class="card-body">
        <div class="d-grid gap-3 mb-4" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));">
          <button class="btn btn-outline d-flex flex-column align-center p-3" onclick="generateMonthlyReport()"><i class="fas fa-calendar-alt fa-2x mb-2"></i><div class="text-small">मासिक रिपोर्ट</div><div class="text-xs text-muted">मासिक उजुरी विवरण</div></button>
          <button class="btn btn-outline d-flex flex-column align-center p-3" onclick="generateShakhaReport()"><i class="fas fa-building fa-2x mb-2"></i><div class="text-small">शाखा रिपोर्ट</div><div class="text-xs text-muted">शाखा अनुसारको प्रदर्शन</div></button>
          <button class="btn btn-outline d-flex flex-column align-center p-3" onclick="generateSummaryReport()"><i class="fas fa-chart-pie fa-2x mb-2"></i><div class="text-small">सारांश रिपोर्ट</div><div class="text-xs text-muted">समग्र विश्लेषण</div></button>
          <button class="btn btn-outline d-flex flex-column align-center p-3" onclick="exportToExcel('all_complaints')"><i class="fas fa-file-excel fa-2x mb-2"></i><div class="text-small">Excel एक्सपोर्ट</div><div class="text-xs text-muted">सबै उजुरीहरू</div></button>
        </div>
        
        <div class="mt-4">
          <h6 class="mb-2">कस्टमाइज्ड रिपोर्ट</h6>
          <div class="d-grid gap-3" style="grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));">
            <div class="form-group"><label class="form-label">सुरु मिति</label><input type="text" class="form-control nepali-datepicker-input" placeholder="मिति छान्नुहोस्" id="reportStartDate" /></div>
            <div class="form-group"><label class="form-label">अन्त्य मिति</label><input type="text" class="form-control nepali-datepicker-input" placeholder="मिति छान्नुहोस्" id="reportEndDate" /></div>
            <div class="form-group"><label class="form-label">स्थिति</label><select class="form-select" id="reportStatus"><option value="">सबै</option><option value="pending">काम बाँकी</option><option value="resolved">फछ्रयौट</option></select></div>
            <div class="form-group d-flex align-end"><button class="btn btn-primary w-100" onclick="generateCustomReport()">रिपोर्ट जेनरेट गर्नुहोस्</button></div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  document.getElementById('contentArea').innerHTML = content;
  updateActiveNavItem();
  setTimeout(initializeDatepickers, 100);
}

function showShakhaReportsView() {
  state.currentView = 'shakha_reports';
  document.getElementById('pageTitle').textContent = 'शाखागत रिपोर्टहरू';
  
  const shakhaStats = {};
  state.complaints.forEach(complaint => {
    const shakha = complaint.shakha || 'अन्य';
    if (!shakhaStats[shakha]) shakhaStats[shakha] = { total: 0, pending: 0, resolved: 0, progress: 0, closed: 0 };
    shakhaStats[shakha].total++;
    if (complaint.status === 'pending') shakhaStats[shakha].pending++;
    if (complaint.status === 'resolved') shakhaStats[shakha].resolved++;
    if (complaint.status === 'progress') shakhaStats[shakha].progress++;
    if (complaint.status === 'closed') shakhaStats[shakha].closed++;
  });
  
  const content = `
    <div class="card">
      <div class="card-header d-flex justify-between align-center">
        <h5 class="mb-0">शाखा अनुसार उजुरी विवरण</h5>
        <button class="btn btn-success btn-sm" onclick="exportToExcel('shakha_reports')"><i class="fas fa-file-excel"></i> Excel</button>
      </div>
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table">
            <thead><tr><th>शाखा</th><th>कूल उजुरी</th><th>काम बाँकी</th><th>चालु</th><th>फछ्रयौट</th><th>फछ्रयौट दर</th><th>कार्य</th></tr></thead>
            <tbody>
              ${Object.keys(shakhaStats).map(shakha => {
                const stats = shakhaStats[shakha];
                const resolutionRate = stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0;
                return `<tr><td>${shakha}</td><td>${stats.total}</td><td><span class="text-warning">${stats.pending}</span></td><td><span class="text-info">${stats.progress}</span></td><td><span class="text-success">${stats.resolved}</span></td><td>${resolutionRate}%</td><td><button class="action-btn" onclick="viewShakhaDetails('${shakha}')" title="विस्तृत हेर्नुहोस्"><i class="fas fa-chart-bar"></i></button></td></tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    
    <div class="card mt-3">
      <div class="card-header"><h5 class="mb-0">शाखा अनुसार उजुरी तुलना</h5></div>
      <div class="card-body"><canvas id="shakhaComparisonChart" height="300"></canvas></div>
    </div>
  `;
  
  document.getElementById('contentArea').innerHTML = content;
  updateActiveNavItem();
  
  setTimeout(() => {
    if (typeof Chart !== 'undefined') {
      const ctx = document.getElementById('shakhaComparisonChart');
      if (ctx) {
        const shakhas = Object.keys(shakhaStats);
        const pendingData = shakhas.map(shakha => shakhaStats[shakha].pending);
        const resolvedData = shakhas.map(shakha => shakhaStats[shakha].resolved);
        
        if (window.nvcCharts.comparisonChart) window.nvcCharts.comparisonChart.destroy();
        
        window.nvcCharts.comparisonChart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: shakhas,
            datasets: [
              { label: 'काम बाँकी', data: pendingData, backgroundColor: 'rgba(255, 143, 0, 0.8)', borderColor: 'rgba(255, 143, 0, 1)', borderWidth: 1 },
              { label: 'फछ्रयौट', data: resolvedData, backgroundColor: 'rgba(46, 125, 50, 0.8)', borderColor: 'rgba(46, 125, 50, 1)', borderWidth: 1 }
            ]
          },
          options: {
            responsive: true, scales: {
              y: { beginAtZero: true, title: { display: true, text: 'उजुरी संख्या' } },
              x: { title: { display: true, text: 'शाखाहरू' } }
            }
          }
        });
      }
    }
  }, 100);
}

function showSystemReportsView() {
  state.currentView = 'system_reports';
  document.getElementById('pageTitle').textContent = 'सिस्टम रिपोर्टहरू';
  
  const resolutionRate = state.complaints.length > 0 ? 
    Math.round((state.complaints.filter(c => c.status === 'resolved').length / state.complaints.length) * 100) : 0;
  
  const content = `
    <div class="card">
      <div class="card-header"><h5 class="mb-0">प्रणाली विश्लेषण रिपोर्टहरू</h5></div>
      <div class="card-body">
        <div class="d-grid gap-3 mb-4" style="grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));">
          <div class="infocard" onclick="generatePerformanceReport()"><div class="infocard-icon"><i class="fas fa-chart-line"></i></div><div class="infocard-value">${state.complaints.length}</div><div class="infocard-label">कूल उजुरीहरू</div><div class="text-xs text-success mt-1"></div></div>
          <div class="infocard" onclick="generateResolutionReport()"><div class="infocard-icon"><i class="fas fa-check-circle"></i></div><div class="infocard-value">${resolutionRate}%</div><div class="infocard-label">फछ्रयौट दर</div><div class="text-xs text-success mt-1"></div></div>
          <div class="infocard" onclick="generateTimelinessReport()"><div class="infocard-icon"><i class="fas fa-clock"></i></div><div class="infocard-value">७.२</div><div class="infocard-label">औसत प्रतिक्रिया समय (दिन)</div><div class="text-xs text-danger mt-1"></div></div>
          <div class="infocard" onclick="generateUserActivityReport()"><div class="infocard-icon"><i class="fas fa-users"></i></div><div class="infocard-value">${state.users.length}</div><div class="infocard-label">सक्रिय प्रयोगकर्ता</div><div class="text-xs text-success mt-1"></div></div>
        </div>
        
        <div class="d-grid gap-3" style="grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));">
          <div class="chart-container"><div class="chart-header"><h6 class="chart-title">महिना अनुसार उजुरीहरू</h6></div><div class="chart-wrapper"><canvas id="monthlyTrendChart"></canvas></div></div>
          <div class="chart-container"><div class="chart-header"><h6 class="chart-title">शाखा अनुसार फछ्रयौट दर</h6></div><div class="chart-wrapper"><canvas id="resolutionRateChart"></canvas></div></div>
        </div>
        
        <div class="mt-4"><button class="btn btn-primary" onclick="exportSystemReport()"><i class="fas fa-file-pdf"></i> पूर्ण प्रणाली रिपोर्ट डाउनलोड गर्नुहोस्</button></div>
      </div>
    </div>
  `;
  
  document.getElementById('contentArea').innerHTML = content;
  updateActiveNavItem();
  
  setTimeout(() => {
    if (typeof Chart !== 'undefined') {
      const monthlyCtx = document.getElementById('monthlyTrendChart');
      if (monthlyCtx) {
        if (window.nvcCharts.monthlyTrendChart) window.nvcCharts.monthlyTrendChart.destroy();
        window.nvcCharts.monthlyTrendChart = new Chart(monthlyCtx, {
          type: 'line',
          data: {
            labels: ['बैशाख', 'जेठ', 'असार', 'श्रावण', 'भदौ', 'असोज'],
            datasets: [{
              label: 'उजुरीहरू',
              data: [65, 59, 80, 81, 56, 72],
              borderColor: 'rgba(13, 71, 161, 1)',
              backgroundColor: 'rgba(13, 71, 161, 0.1)',
              tension: 0.3, fill: true
            }]
          },
          options: { responsive: true, maintainAspectRatio: false }
        });
      }
      
      const resolutionCtx = document.getElementById('resolutionRateChart');
      if (resolutionCtx) {
        const shakhaStats = {};
        state.complaints.forEach(complaint => {
          const shakha = complaint.shakha || 'अन्य';
          if (!shakhaStats[shakha]) shakhaStats[shakha] = { total: 0, resolved: 0 };
          shakhaStats[shakha].total++;
          if (complaint.status === 'resolved') shakhaStats[shakha].resolved++;
        });
        
        const shakhas = Object.keys(shakhaStats);
        const rates = shakhas.map(shakha => {
          const stats = shakhaStats[shakha];
          return stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0;
        });
        
        if (window.nvcCharts.resolutionRateChart) window.nvcCharts.resolutionRateChart.destroy();
        window.nvcCharts.resolutionRateChart = new Chart(resolutionCtx, {
          type: 'bar',
          data: {
            labels: shakhas,
            datasets: [{
              label: 'फछ्रयौट दर (%)',
              data: rates,
              backgroundColor: 'rgba(46, 125, 50, 0.8)',
              borderColor: 'rgba(46, 125, 50, 1)',
              borderWidth: 1
            }]
          },
          options: {
            responsive: true, maintainAspectRatio: false,
            scales: { y: { beginAtZero: true, max: 100, title: { display: true, text: 'फछ्रयौट दर (%)' } } }
          }
        });
      }
    }
  }, 100);
}

// ==================== USER MANAGEMENT ====================
function showUserManagementView() {
  state.currentView = 'user_management';
  document.getElementById('pageTitle').textContent = 'प्रयोगकर्ता व्यवस्थापन';
  
  const content = `
    <div class="card">
      <div class="card-header d-flex justify-between align-center">
        <h5 class="mb-0">प्रयोगकर्ता सूची</h5>
        <button class="btn btn-primary btn-sm" onclick="showNewUserModal()"><i class="fas fa-plus"></i> नयाँ प्रयोगकर्ता</button>
      </div>
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table">
            <thead><tr><th>क्र.सं.</th><th>युजरनेम</th><th>नाम</th><th>भूमिका</th><th>स्थिति</th><th>अन्तिम लगइन</th><th>कार्य</th></tr></thead>
            <tbody>
              ${state.users.map((user, index) => `
                <tr>
                  <td>${index + 1}</td><td>${user.username}</td><td>${user.name}</td><td>${user.role}</td>
                  <td><span class="status-badge ${user.status === 'सक्रिय' ? 'status-resolved' : 'status-pending'}">${user.status}</span></td>
                  <td>${user.lastLogin}</td>
                  <td><div class="table-actions"><button class="action-btn" onclick="editUser(${user.id})" title="सम्पादन गर्नुहोस्"><i class="fas fa-edit"></i></button><button class="action-btn" onclick="resetUserPassword(${user.id})" title="पासवर्ड रिसेट"><i class="fas fa-key"></i></button><button class="action-btn" onclick="toggleUserStatus(${user.id})" title="निष्क्रिय गर्नुहोस्"><i class="fas fa-ban"></i></button></div></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
  
  document.getElementById('contentArea').innerHTML = content;
  updateActiveNavItem();
}

function showNewUserModal() {
  const formContent = `
    <div class="d-grid gap-3">
      <div class="d-grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
        <div class="form-group"><label class="form-label">युजरनेम *</label><input type="text" class="form-control" id="newUsername" placeholder="युजरनेम" /></div>
        <div class="form-group"><label class="form-label">पासवर्ड *</label><input type="password" class="form-control" id="newPassword" placeholder="पासवर्ड" /></div>
      </div>
      <div class="d-grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
        <div class="form-group"><label class="form-label">नाम *</label><input type="text" class="form-control" id="newName" placeholder="पूरा नाम" /></div>
        <div class="form-group"><label class="form-label">भूमिका *</label><select class="form-select" id="newRole"><option value="">छान्नुहोस्</option><option value="admin">एडमिन</option><option value="shakha">शाखा</option></select></div>
      </div>
      <div class="form-group"><label class="form-label">शाखा (यदि शाखा हो भने)</label><select class="form-select" id="newShakha"><option value="">छान्नुहोस्</option>${Object.entries(SHAKHA).map(([key, value]) => `<option value="${key}">${value}</option>`).join('')}</select></div>
      <div class="form-group"><label class="form-label">स्थिति</label><select class="form-select" id="newStatus"><option value="सक्रिय">सक्रिय</option><option value="निष्क्रिय">निष्क्रिय</option></select></div>
    </div>
    <div class="modal-footer"><button class="btn btn-outline" onclick="closeModal()">रद्द गर्नुहोस्</button><button class="btn btn-primary" onclick="saveNewUser()">सुरक्षित गर्नुहोस्</button></div>
  `;
  
  openModal('नयाँ प्रयोगकर्ता', formContent);
}

function saveNewUser() {
  const username = document.getElementById('newUsername').value;
  const password = document.getElementById('newPassword').value;
  const name = document.getElementById('newName').value;
  const role = document.getElementById('newRole').value;
  const shakha = document.getElementById('newShakha').value;
  const status = document.getElementById('newStatus').value;
  
  if (!username || !password || !name || !role) {
    showToast('कृपया आवश्यक फिल्डहरू भर्नुहोस्', 'warning');
    return;
  }
  
  if (role === 'shakha' && !shakha) {
    showToast('कृपया शाखा छान्नुहोस्', 'warning');
    return;
  }
  
  const newUser = {
    id: Date.now(), username, password, name,
    role: role === 'admin' ? 'एडमिन' : 'शाखा',
    shakha: role === 'shakha' ? shakha : null,
    status, lastLogin: '-',
    createdBy: state.currentUser.name,
    createdAt: new Date().toISOString()
  };
  
  state.users.push(newUser);
  showToast('नयाँ प्रयोगकर्ता सुरक्षित गरियो', 'success');
  closeModal();
  showUserManagementView();
}

function editUser(id) {
  const user = state.users.find(u => u.id === id);
  if (!user) return;
  
  const formContent = `
    <div class="d-grid gap-3">
      <div class="d-grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
        <div class="form-group"><label class="form-label">युजरनेम</label><input type="text" class="form-control" value="${user.username}" id="editUsername" readonly /></div>
        <div class="form-group"><label class="form-label">पासवर्ड</label><input type="password" class="form-control" id="editPassword" placeholder="नयाँ पासवर्ड (खाली छोड्नुहोस्)" /></div>
      </div>
      <div class="d-grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
        <div class="form-group"><label class="form-label">नाम</label><input type="text" class="form-control" value="${user.name}" id="editName" /></div>
        <div class="form-group"><label class="form-label">भूमिका</label><select class="form-select" id="editRole"><option value="admin" ${user.role === 'एडमिन' ? 'selected' : ''}>एडमिन</option><option value="shakha" ${user.role === 'शाखा' ? 'selected' : ''}>शाखा</option></select></div>
      </div>
      <div class="form-group"><label class="form-label">शाखा (यदि शाखा हो भने)</label><select class="form-select" id="editShakha"><option value="">छान्नुहोस्</option>${Object.entries(SHAKHA).map(([key, value]) => `<option value="${key}" ${user.shakha === key ? 'selected' : ''}>${value}</option>`).join('')}</select></div>
      <div class="form-group"><label class="form-label">स्थिति</label><select class="form-select" id="editStatus"><option value="सक्रिय" ${user.status === 'सक्रिय' ? 'selected' : ''}>सक्रिय</option><option value="निष्क्रिय" ${user.status === 'निष्क्रिय' ? 'selected' : ''}>निष्क्रिय</option></select></div>
    </div>
    <div class="modal-footer"><button class="btn btn-outline" onclick="closeModal()">रद्द गर्नुहोस्</button><button class="btn btn-primary" onclick="saveUserEdit(${id})">सुरक्षित गर्नुहोस्</button></div>
  `;
  
  openModal('प्रयोगकर्ता सम्पादन', formContent);
}

function saveUserEdit(id) {
  const userIndex = state.users.findIndex(u => u.id === id);
  if (userIndex === -1) return;
  
  const name = document.getElementById('editName').value;
  const password = document.getElementById('editPassword').value;
  const role = document.getElementById('editRole').value;
  const shakha = document.getElementById('editShakha').value;
  const status = document.getElementById('editStatus').value;
  
  if (!name) {
    showToast('कृपया नाम भर्नुहोस्', 'warning');
    return;
  }
  
  if (role === 'shakha' && !shakha) {
    showToast('कृपया शाखा छान्नुहोस्', 'warning');
    return;
  }
  
  const updatedUser = {
    ...state.users[userIndex],
    name, role: role === 'admin' ? 'एडमिन' : 'शाखा',
    shakha: role === 'shakha' ? shakha : null, status
  };
  
  if (password) updatedUser.password = password;
  
  state.users[userIndex] = updatedUser;
  showToast('प्रयोगकर्ता सुरक्षित गरियो', 'success');
  closeModal();
  showUserManagementView();
}

function resetUserPassword(id) {
  if (confirm('के तपाईं यस प्रयोगकर्ताको पासवर्ड रिसेट गर्न चाहनुहुन्छ?')) {
    const userIndex = state.users.findIndex(u => u.id === id);
    if (userIndex !== -1) {
      state.users[userIndex].password = 'nvc@2024';
      showToast('पासवर्ड रिसेट गरियो (नयाँ पासवर्ड: nvc@2024)', 'success');
      showUserManagementView();
    }
  }
}

function toggleUserStatus(id) {
  const userIndex = state.users.findIndex(u => u.id === id);
  if (userIndex === -1) return;
  
  const currentStatus = state.users[userIndex].status;
  const newStatus = currentStatus === 'सक्रिय' ? 'निष्क्रिय' : 'सक्रिय';
  
  if (confirm(`के तपाईं यस प्रयोगकर्तालाई ${newStatus} गर्न चाहनुहुन्छ?`)) {
    state.users[userIndex].status = newStatus;
    showToast(`प्रयोगकर्ता ${newStatus} गरियो`, 'success');
    showUserManagementView();
  }
}

// ==================== SETTINGS VIEW ====================
function showSettingsView() {
  state.currentView = 'settings';
  document.getElementById('pageTitle').textContent = 'सेटिङहरू';
  
  const content = `
    <div class="card mb-3">
      <div class="card-header"><h5 class="mb-0">युजर सेटिङहरू</h5></div>
      <div class="card-body">
        <div class="d-grid gap-3" style="max-width: 500px;">
          <div class="form-group"><label class="form-label">पुरानो पासवर्ड</label><input type="password" class="form-control" /></div>
          <div class="form-group"><label class="form-label">नयाँ पासवर्ड</label><input type="password" class="form-control" /></div>
          <div class="form-group"><label class="form-label">पासवर्ड पुष्टि</label><input type="password" class="form-control" /></div>
          <button class="btn btn-primary">पासवर्ड परिवर्तन गर्नुहोस्</button>
        </div>
      </div>
    </div>
    
    <div class="card mb-3">
      <div class="card-header"><h5 class="mb-0">प्रणाली सेटिङहरू</h5></div>
      <div class="card-body">
        <div class="d-grid gap-3">
          <div class="form-group"><label class="form-label">प्रदर्शन मोड</label><select class="form-select"><option>हल्का</option><option>अँध्यारो</option><option>स्वचालित</option></select></div>
          <div class="form-group"><label class="form-label">भाषा</label><select class="form-select"><option>नेपाली</option><option>English</option></select></div>
          <div class="form-group"><label class="form-label">मिति ढाँचा</label><select class="form-select"><option>नेपाली (YYYY-MM-DD)</option><option>अंग्रेजी (DD/MM/YYYY)</option></select></div>
          <div class="form-group"><div class="d-flex align-center justify-between"><label class="form-label mb-0">सूचना</label><input type="checkbox" checked /></div></div>
          <div class="form-group"><div class="d-flex align-center justify-between"><label class="form-label mb-0">ईमेल अपडेट</label><input type="checkbox" checked /></div></div>
          <button class="btn btn-primary">सेटिङहरू सुरक्षित गर्नुहोस्</button>
        </div>
      </div>
    </div>
  `;
  
  document.getElementById('contentArea').innerHTML = content;
  updateActiveNavItem();
}

// ==================== CALENDAR VIEW ====================
function showCalendarView() {
  state.currentView = 'calendar';
  document.getElementById('pageTitle').textContent = 'क्यालेन्डर';
  
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  
  const firstDay = new Date(currentYear, currentMonth, 1);
  const lastDay = new Date(currentYear, currentMonth + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDay = firstDay.getDay();
  
  const nepaliMonths = ["बैशाख", "जेठ", "असार", "श्रावण", "भदौ", "असोज", "कार्तिक", "मंसिर", "पौष", "माघ", "फाल्गुन", "चैत्र"];
  const weekdays = ["आइत", "सोम", "मंगल", "बुध", "बिही", "शुक्र", "शनि"];
  
  let calendarHTML = '';
  
  for (let i = 0; i < 7; i++) calendarHTML += `<div class="text-center p-2 bg-gray-100 rounded"><div class="text-small font-weight-bold">${weekdays[i]}</div></div>`;
  for (let i = 0; i < startingDay; i++) calendarHTML += '<div class="p-2 border rounded"></div>';
  for (let day = 1; day <= daysInMonth; day++) {
    const hasComplaint = day % 5 === 0 || day % 7 === 0;
    calendarHTML += `<div class="p-2 border rounded text-center ${hasComplaint ? 'bg-primary-light' : ''}"><div class="text-small">${day}</div>${hasComplaint ? '<div class="text-xs text-primary"></div>' : ''}</div>`;
  }
  
  const content = `
    <div class="card mb-3">
      <div class="card-header d-flex justify-between align-center">
        <h5 class="mb-0">${nepaliMonths[currentMonth]} ${currentYear + 57} (${today.toLocaleDateString('ne-NP', {month: 'long', year: 'numeric'})})</h5>
        <div class="d-flex gap-2"><button class="btn btn-sm btn-outline"><i class="fas fa-chevron-left"></i></button><button class="btn btn-sm btn-outline"><i class="fas fa-chevron-right"></i></button></div>
      </div>
      <div class="card-body">
        <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px;">${calendarHTML}</div>
      </div>
    </div>
    
    <div class="card">
      <div class="card-header"><h5 class="mb-0">आगामी बैठकहरू र कार्यक्रमहरू</h5></div>
      <div class="card-body">
        <div class="d-grid gap-2">
          <div class="d-flex align-center justify-between p-2 border rounded"><div><div class="text-small font-weight-bold">छानबिन समिति बैठक</div><div class="text-xs text-muted"></div></div><button class="btn btn-sm btn-outline">विवरण</button></div>
          <div class="d-flex align-center justify-between p-2 border rounded"><div><div class="text-small font-weight-bold">मासिक समीक्षा बैठक</div><div class="text-xs text-muted"></div></div><button class="btn btn-sm btn-outline">विवरण</button></div>
          <div class="d-flex align-center justify-between p-2 border rounded"><div><div class="text-small font-weight-bold">उजुरी फछ्रयौट समय सीमा</div><div class="text-xs text-muted"></div></div><button class="btn btn-sm btn-outline">विवरण</button></div>
        </div>
      </div>
    </div>
  `;
  
  document.getElementById('contentArea').innerHTML = content;
  updateActiveNavItem();
}

// ==================== COMPLAINT OPERATIONS ====================
// ==================== VIEW COMPLAINT - ULTIMATE FIXED ====================
// ==================== VIEW COMPLAINT - FIXED FOR NUMBER IDs ====================
function viewComplaint(id) {
  console.log('👁️ viewComplaint() called with ID:', id, 'Type:', typeof id);
  
  if (!state.complaints || state.complaints.length === 0) {
    alert('उजुरी फेला परेन - कुनै उजुरी छैन');
    return;
  }
  
  // ID लाई स्ट्रिङमा परिवर्तन गर्ने (सुरक्षित तुलनाको लागि)
  const searchId = String(id).trim();
  
  // खोज्ने - विभिन्न तरिकाले
  let complaint = null;
  
  // 1. Number को रूपमा खोज्ने (किनकि ID 1,2,3 जस्तो छ)
  const numId = parseInt(searchId);
  if (!isNaN(numId)) {
    complaint = state.complaints.find(c => 
      parseInt(c.id) === numId || 
      parseInt(c['उजुरी दर्ता नं']) === numId ||
      parseInt(c.complaintId) === numId
    );
  }
  
  // 2. String को रूपमा खोज्ने (case insensitive)
  if (!complaint) {
    complaint = state.complaints.find(c => {
      const cId = String(c.id || c['उजुरी दर्ता नं'] || c.complaintId || '');
      return cId.toLowerCase() === searchId.toLowerCase();
    });
  }
  
  // 3. Direct equality
  if (!complaint) {
    complaint = state.complaints.find(c => 
      c.id == id || 
      c['उजुरी दर्ता नं'] == id || 
      c.complaintId == id
    );
  }
  
  if (!complaint) {
    console.error('❌ Complaint not found. Available IDs:', 
      state.complaints.map(c => ({ 
        id: c.id, 
        'उजुरी दर्ता नं': c['उजुरी दर्ता नं'],
        complainant: c.complainant 
      }))
    );
    alert(`उजुरी फेला परेन (ID: ${id})`);
    return;
  }
  
  console.log('✅ Complaint found:', complaint);
  
  // अब modal मा देखाउने
  const status = complaint.status || complaint['स्थिति'] || 'pending';
  const statusText = status === 'resolved' ? 'फछ्रयौट' :
                    status === 'pending' ? 'काम बाँकी' : 'चालु';
  
  const statusClass = status === 'resolved' ? 'status-resolved' :
                     status === 'pending' ? 'status-pending' : 'status-progress';
  
  const content = `
    <div class="d-grid gap-3">
      <div class="d-grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
        <div>
          <div class="text-small text-muted">दर्ता नं</div>
          <div class="text-large font-weight-bold">${complaint.id || complaint['उजुरी दर्ता नं'] || '-'}</div>
        </div>
        <div>
          <div class="text-small text-muted">दर्ता मिति</div>
          <div class="text-large">${complaint.date || complaint['दर्ता मिति'] || '-'}</div>
        </div>
        <div>
          <div class="text-small text-muted">स्थिति</div>
          <div><span class="status-badge ${statusClass}">${statusText}</span></div>
        </div>
      </div>
      
      <div class="d-grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
        <div>
          <div class="text-small text-muted">उजुरकर्ता</div>
          <div>${complaint.complainant || complaint['उजुरीकर्ताको नाम'] || '-'}</div>
        </div>
        <div>
          <div class="text-small text-muted">विपक्षी</div>
          <div>${complaint.accused || complaint['विपक्षी'] || '-'}</div>
        </div>
      </div>
      
      <div>
        <div class="text-small text-muted">उजुरीको विवरण</div>
        <div class="card p-3 bg-light">${complaint.description || complaint['उजुरीको संक्षिप्त विवरण'] || 'कुनै विवरण छैन'}</div>
      </div>
      
      <div>
        <div class="text-small text-muted">प्रस्तावित निर्णय</div>
        <div class="card p-3 bg-light">${complaint.proposedDecision || complaint['प्रस्तावित निर्णय'] || 'कुनै प्रस्तावित निर्णय छैन'}</div>
      </div>
      
      ${complaint.decision || complaint['अन्तिम निर्णय'] ? `
        <div>
          <div class="text-small text-muted">अन्तिम निर्णय</div>
          <div class="card p-3 bg-light">${complaint.decision || complaint['अन्तिम निर्णय']}</div>
        </div>
      ` : ''}
      
      <div>
        <div class="text-small text-muted">कैफियत</div>
        <div class="card p-3 bg-light">${complaint.remarks || complaint['कैफियत'] || '-'}</div>
      </div>
    </div>
  `;
  
  openModal('उजुरी विवरण', content);
}

function editComplaint(id) {
  const complaint = state.complaints.find(c => c.id === id);
  if (!complaint) return;
  
  const formContent = `
    <div class="d-grid gap-3" style="grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));">
      <div class="form-group"><label class="form-label">दर्ता नं</label><input type="text" class="form-control" value="${complaint.id}" readonly /></div>
      <div class="form-group"><label class="form-label">दर्ता मिति</label><input type="text" class="form-control" value="${complaint.date}" id="editDate" /></div>
      <div class="form-group"><label class="form-label">उजुरकर्ताको नाम</label><input type="text" class="form-control" value="${complaint.complainant}" id="editComplainant" /></div>
      <div class="form-group"><label class="form-label">विपक्षी</label><input type="text" class="form-control" value="${complaint.accused || ''}" id="editAccused" /></div>
      <div class="form-group" style="grid-column: span 2;"><label class="form-label">उजुरीको विवरण</label><textarea class="form-control" rows="3" id="editDescription">${complaint.description}</textarea></div>
      <div class="form-group" style="grid-column: span 2;"><label class="form-label">प्रस्तावित निर्णय</label><textarea class="form-control" rows="3" id="editProposedDecision">${complaint.proposedDecision || ''}</textarea></div>
      <div class="form-group"><label class="form-label">कैफियत</label><input type="text" class="form-control" value="${complaint.remarks || ''}" id="editRemarks" /></div>
      <div class="form-group"><label class="form-label">स्थिति</label><select class="form-select" id="editStatus"><option value="pending" ${complaint.status === 'pending' ? 'selected' : ''}>काम बाँकी</option><option value="progress" ${complaint.status === 'progress' ? 'selected' : ''}>चालु</option><option value="resolved" ${complaint.status === 'resolved' ? 'selected' : ''}>फछ्रयौट</option></select></div>
      ${complaint.committeeDecision ? `<div class="form-group" style="grid-column: span 2;"><label class="form-label">उजुरी व्यवस्थापन समितिको निर्णय</label><select class="form-select" id="editCommitteeDecision"><option value="">छान्नुहोस्</option>${Object.entries(DECISION_TYPES).map(([key, value]) => `<option value="${key}" ${complaint.committeeDecision === value ? 'selected' : ''}>${value}</option>`).join('')}</select></div>` : ''}
      ${complaint.decision ? `<div class="form-group" style="grid-column: span 2;"><label class="form-label">छानबिन पश्चातको निर्णय</label><textarea class="form-control" rows="3" id="editDecision">${complaint.decision}</textarea></div>` : ''}
      ${complaint.finalDecision ? `<div class="form-group"><label class="form-label">अन्तिम निर्णय</label><select class="form-select" id="editFinalDecision"><option value="">छान्नुहोस्</option>${Object.entries(FINAL_DECISION_TYPES).map(([key, value]) => `<option value="${key}" ${complaint.finalDecision === value ? 'selected' : ''}>${value}</option>`).join('')}</select></div>` : ''}
    </div>
    <div class="modal-footer"><button class="btn btn-outline" onclick="closeModal()">रद्द गर्नुहोस्</button><button class="btn btn-primary" onclick="saveComplaint('${id}')">सुरक्षित गर्नुहोस्</button></div>
  `;
  
  openModal('उजुरी सम्पादन', formContent);
  setTimeout(initializeDatepickers, 100);
}

function saveComplaint(id) {
  const complaintIndex = state.complaints.findIndex(c => c.id === id);
  if (complaintIndex === -1) return;
  
  const updatedComplaint = {
    ...state.complaints[complaintIndex],
    date: document.getElementById('editDate').value,
    complainant: document.getElementById('editComplainant').value,
    accused: document.getElementById('editAccused').value,
    description: document.getElementById('editDescription').value,
    proposedDecision: document.getElementById('editProposedDecision').value,
    remarks: document.getElementById('editRemarks').value,
    status: document.getElementById('editStatus').value,
    committeeDecision: document.getElementById('editCommitteeDecision')?.value || state.complaints[complaintIndex].committeeDecision,
    decision: document.getElementById('editDecision')?.value || state.complaints[complaintIndex].decision,
    finalDecision: document.getElementById('editFinalDecision')?.value || state.complaints[complaintIndex].finalDecision,
    updatedAt: new Date().toISOString(),
    updatedBy: state.currentUser.name
  };
  
  state.complaints[complaintIndex] = updatedComplaint;
  showToast('उजुरी सुरक्षित गरियो', 'success');
  closeModal();
  showComplaintsView();
}

function deleteComplaint(id) {
  if (confirm('के तपाईं यो उजुरी हटाउन चाहनुहुन्छ?')) {
    const index = state.complaints.findIndex(c => c.id === id);
    if (index !== -1) {
      state.complaints.splice(index, 1);
      showToast('उजुरी हटाइयो', 'success');
      showComplaintsView();
    }
  }
}

// ==================== FILTER FUNCTIONS ====================
function filterComplaintsTable() {
  const status = document.getElementById('filterStatus').value;
  const searchText = document.getElementById('searchText').value.toLowerCase();
  
  let filtered = state.currentUser.role === 'admin' ? state.complaints : 
                 state.complaints.filter(c => c.shakha === state.currentUser.shakha);
  
  if (status) filtered = filtered.filter(c => c.status === status);
  if (searchText) {
    filtered = filtered.filter(c => 
      (c.id && c.id.toLowerCase().includes(searchText)) ||
      (c.complainant && c.complainant.toLowerCase().includes(searchText)) ||
      (c.accused && c.accused.toLowerCase().includes(searchText)) ||
      (c.description && c.description.toLowerCase().includes(searchText))
    );
  }
  
  const tbody = document.getElementById('complaintsTableBody');
  if (tbody) {
    tbody.innerHTML = filtered.map(complaint => `
      <tr>
        <td><strong>${complaint.id}</strong></td><td>${complaint.date}</td><td>${complaint.complainant}</td><td>${complaint.accused || '-'}</td>
        <td class="text-limit" title="${complaint.description}">${complaint.description.substring(0, 50)}...</td>
        ${state.currentUser.role === 'admin' ? `<td>${complaint.shakha || '-'}</td>` : ''}
        <td class="text-limit" title="${complaint.decision || ''}">${complaint.decision ? complaint.decision.substring(0, 30) + '...' : '-'}</td>
        <td>${complaint.remarks || '-'}</td>
        <td><span class="status-badge ${complaint.status === 'resolved' ? 'status-resolved' : complaint.status === 'pending' ? 'status-pending' : 'status-progress'}">${complaint.status === 'resolved' ? 'फछ्रयौट' : complaint.status === 'pending' ? 'काम बाँकी' : 'चालु'}</span></td>
        <td><div class="table-actions"><button class="action-btn" onclick="viewComplaint('${complaint.id}')" title="हेर्नुहोस्"><i class="fas fa-eye"></i></button>${state.currentUser.role !== 'admin' ? `<button class="action-btn" onclick="editComplaint('${complaint.id}')" title="सम्पादन गर्नुहोस्"><i class="fas fa-edit"></i></button><button class="action-btn" onclick="deleteComplaint('${complaint.id}')" title="हटाउनुहोस्"><i class="fas fa-trash"></i></button>` : ''}</div></td>
      </tr>
    `).join('');
  }
  
  state.pagination.totalItems = filtered.length;
  state.pagination.currentPage = 1;
  updatePagination();
}

function filterAdminComplaints() {
  const status = document.getElementById('filterStatus').value;
  const searchText = document.getElementById('searchText').value.toLowerCase();
  
  let filtered = state.complaints.filter(c => c.source === 'hello_sarkar');
  
  if (status) filtered = filtered.filter(c => c.status === status);
  if (searchText) {
    filtered = filtered.filter(c => 
      c.id.toLowerCase().includes(searchText) ||
      c.complainant.toLowerCase().includes(searchText) ||
      c.accused.toLowerCase().includes(searchText) ||
      c.description.toLowerCase().includes(searchText)
    );
  }
  
  const tbody = document.getElementById('adminComplaintsTable');
  if (tbody) {
    tbody.innerHTML = filtered.map((complaint, index) => `
      <tr>
        <td>${index + 1}</td><td>${complaint.date}</td><td>${complaint.complainant}</td><td>${complaint.accused || '-'}</td>
        <td class="text-limit" title="${complaint.description}">${complaint.description.substring(0, 50)}...</td>
        <td>${complaint.assignedShakha || '-'}</td><td>${complaint.assignedDate || '-'}</td>
        <td class="text-limit" title="${complaint.decision || ''}">${complaint.decision ? complaint.decision.substring(0, 30) + '...' : '-'}</td>
        <td>${complaint.remarks || '-'}</td>
        <td><div class="table-actions"><button class="action-btn" onclick="viewComplaint('${complaint.id}')" title="हेर्नुहोस्"><i class="fas fa-eye"></i></button><button class="action-btn" onclick="assignToShakha('${complaint.id}')" title="शाखामा पठाउनुहोस्"><i class="fas fa-paper-plane"></i></button></div></td>
      </tr>
    `).join('');
  }
}

function filterProjects() {
  const status = document.getElementById('filterProjectStatus').value;
  const searchText = document.getElementById('projectSearchText').value.toLowerCase();
  
  let filtered = state.projects.filter(p => p.shakha === state.currentUser.shakha);
  
  if (status) filtered = filtered.filter(p => p.status === status);
  if (searchText) {
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(searchText) ||
      p.organization.toLowerCase().includes(searchText) ||
      p.nonCompliances.toLowerCase().includes(searchText)
    );
  }
  
  const tbody = document.getElementById('projectsTable');
  if (tbody) {
    tbody.innerHTML = filtered.map((project, index) => `
      <tr>
        <td>${index + 1}</td><td>${project.name}</td><td>${project.organization}</td><td>${project.inspectionDate}</td>
        <td class="text-limit" title="${project.nonCompliances}">${project.nonCompliances.substring(0, 50)}...</td>
        <td>${project.improvementLetterDate || '-'}</td><td>${project.improvementInfo || '-'}</td><td>${project.remarks || '-'}</td>
        <td><div class="table-actions"><button class="action-btn" onclick="viewProject('${project.id}')" title="हेर्नुहोस्"><i class="fas fa-eye"></i></button><button class="action-btn" onclick="editProject('${project.id}')" title="सम्पादन गर्नुहोस्"><i class="fas fa-edit"></i></button></div></td>
      </tr>
    `).join('');
  }
}

// ==================== PAGINATION ====================
function changeItemsPerPage(perPage) {
  state.pagination.itemsPerPage = parseInt(perPage);
  state.pagination.currentPage = 1;
  showComplaintsView();
}

function changePage(page) {
  const totalPages = Math.ceil(state.pagination.totalItems / state.pagination.itemsPerPage);
  if (page < 1 || page > totalPages) return;
  state.pagination.currentPage = page;
  showComplaintsView();
}

function renderPagination(totalItems) {
  const totalPages = Math.ceil(totalItems / state.pagination.itemsPerPage);
  if (totalPages <= 1) return '';
  
  let paginationHTML = `<div class="pagination"><li class="page-item ${state.pagination.currentPage === 1 ? 'disabled' : ''}"><a class="page-link" href="#" onclick="changePage(${state.pagination.currentPage - 1})">पछिल्लो</a></li>`;
  
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= state.pagination.currentPage - 2 && i <= state.pagination.currentPage + 2)) {
      paginationHTML += `<li class="page-item ${state.pagination.currentPage === i ? 'active' : ''}"><a class="page-link" href="#" onclick="changePage(${i})">${i}</a></li>`;
    } else if (i === state.pagination.currentPage - 3 || i === state.pagination.currentPage + 3) {
      paginationHTML += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
    }
  }
  
  paginationHTML += `<li class="page-item ${state.pagination.currentPage === totalPages ? 'disabled' : ''}"><a class="page-link" href="#" onclick="changePage(${state.pagination.currentPage + 1})">अर्को</a></li></div>`;
  return paginationHTML;
}

function updatePagination() {
  const paginationElement = document.querySelector('.pagination');
  if (paginationElement) {
    const totalPages = Math.ceil(state.pagination.totalItems / state.pagination.itemsPerPage);
    paginationElement.style.display = totalPages <= 1 ? 'none' : 'flex';
  }
}

// ==================== UTILITY FUNCTIONS ====================
function updateActiveNavItem() {
  document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
  
  const navText = {
    'dashboard': 'ड्यासबोर्ड', 'complaints': 'उजुरीहरू', 'all_complaints': 'उजुरीहरू',
    'admin_complaints': 'उजुरीहरू', 'new_complaint': 'नयाँ उजुरी',
    'technical_projects': 'प्राविधिक परीक्षण', 'employee_monitoring': 'कर्मचारी अनुगमन',
    'citizen_charter': 'नागरिक बडापत्र', 'reports': 'रिपोर्टहरू',
    'shakha_reports': 'रिपोर्टहरू', 'system_reports': 'रिपोर्टहरू',
    'calendar': 'क्यालेन्डर', 'settings': 'सेटिङहरू',
    'user_management': 'प्रयोगकर्ता'
  }[state.currentView] || 'ड्यासबोर्ड';
  
  document.querySelectorAll('.nav-item').forEach(item => {
    if (item.textContent.includes(navText)) item.classList.add('active');
  });
}

function viewShakhaDetails(shakha) {
  const shakhaComplaints = state.complaints.filter(c => c.shakha === shakha);
  const pending = shakhaComplaints.filter(c => c.status === 'pending').length;
  const resolved = shakhaComplaints.filter(c => c.status === 'resolved').length;
  const progress = shakhaComplaints.filter(c => c.status === 'progress').length;
  const resolutionRate = shakhaComplaints.length > 0 ? Math.round((resolved / shakhaComplaints.length) * 100) : 0;
  
  const content = `
    <div class="d-grid gap-3">
      <div><h5 class="text-center mb-3">${shakha} को विवरण</h5></div>
      <div class="d-grid" style="grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem;">
        <div class="text-center p-3 border rounded"><div class="text-large">${shakhaComplaints.length}</div><div class="text-small text-muted">कूल उजुरी</div></div>
        <div class="text-center p-3 border rounded"><div class="text-large text-warning">${pending}</div><div class="text-small text-muted">काम बाँकी</div></div>
        <div class="text-center p-3 border rounded"><div class="text-large text-info">${progress}</div><div class="text-small text-muted">चालु</div></div>
        <div class="text-center p-3 border rounded"><div class="text-large text-success">${resolved}</div><div class="text-small text-muted">फछ्रयौट</div></div>
        <div class="text-center p-3 border rounded"><div class="text-large">${resolutionRate}%</div><div class="text-small text-muted">फछ्रयौट दर</div></div>
      </div>
      <div><h6 class="mb-2">हालैका उजुरीहरू</h6><div class="table-responsive" style="max-height: 300px;"><table class="table table-compact"><thead><tr><th>दर्ता नं</th><th>मिति</th><th>उजुरकर्ता</th><th>स्थिति</th></tr></thead><tbody>
        ${shakhaComplaints.slice(0, 10).map(complaint => `<tr><td>${complaint.id}</td><td>${complaint.date}</td><td>${complaint.complainant}</td><td><span class="status-badge ${complaint.status === 'resolved' ? 'status-resolved' : complaint.status === 'pending' ? 'status-pending' : 'status-progress'}">${complaint.status === 'resolved' ? 'फछ्रयौट' : complaint.status === 'pending' ? 'काम बाँकी' : 'चालु'}</span></td></tr>`).join('')}
      </tbody></table></div></div>
    </div>
    <div class="modal-footer"><button class="btn btn-primary" onclick="exportShakhaDetails('${shakha}')">Excel एक्पोर्ट गर्नुहोस्</button></div>
  `;
  
  openModal(`${shakha} को विस्तृत विवरण`, content);
}

// ==================== REPORT GENERATION FUNCTIONS ====================
function generateMonthlyReport() {
  const currentDate = new Date();
  const monthNames = ["जनवरी", "फेब्रुअरी", "मार्च", "अप्रिल", "मे", "जुन", 
                     "जुलाई", "अगस्ट", "सेप्टेम्बर", "अक्टोबर", "नोभेम्बर", "डिसेम्बर"];
  const monthName = monthNames[currentDate.getMonth()];
  const year = currentDate.getFullYear();
  const reportName = `${year} ${monthName} महिनाको रिपोर्ट`;
  
  const monthlyComplaints = state.complaints.filter(c => {
    const complaintDate = new Date(c.date);
    return complaintDate.getMonth() === currentDate.getMonth() && 
           complaintDate.getFullYear() === currentDate.getFullYear();
  });
  
  if (monthlyComplaints.length === 0) {
    showToast('यस महिना कुनै उजुरी छैन', 'info');
    return;
  }
  
  generateReport(reportName, monthlyComplaints);
}

function generateShakhaReport() {
  if (state.currentUser.role !== 'admin') {
    const shakhaComplaints = state.complaints.filter(c => c.shakha === state.currentUser.shakha);
    const reportName = `${state.currentUser.shakha} को रिपोर्ट`;
    generateReport(reportName, shakhaComplaints);
  } else {
    showToast('कृपया शाखा रिपोर्टहरू पृष्ठबाट रिपोर्ट जेनरेट गर्नुहोस्', 'info');
  }
}

function generateSummaryReport() {
  const total = state.complaints.length;
  const pending = state.complaints.filter(c => c.status === 'pending').length;
  const resolved = state.complaints.filter(c => c.status === 'resolved').length;
  const progress = state.complaints.filter(c => c.status === 'progress').length;
  
  const summaryData = [{
    'कूल उजुरी': total, 'काम बाँकी': pending, 'चालु': progress,
    'फछ्रयौट': resolved, 'फछ्रयौट दर': total > 0 ? Math.round((resolved / total) * 100) + '%' : '0%',
    'औसत प्रतिक्रिया समय': ' दिन', 'सक्रिय शाखाहरू': '', 'महिनाको वृद्धि': '%'
  }];
  
  generateReport('समग्र सारांश रिपोर्ट', summaryData);
}

function generateReport(reportName, data) {
  const headers = Object.keys(data[0]);
  let csvContent = headers.join(',') + '\n';
  
  data.forEach(row => {
    const values = headers.map(header => {
      const value = row[header];
      return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
    });
    csvContent += values.join(',') + '\n';
  });
  
  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  const filename = `${reportName.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0,10)}.csv`;
  
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  showToast(`रिपोर्ट डाउनलोड हुँदैछ: ${reportName}`, 'success');
}

function generatePerformanceReport() { showToast('प्रदर्शन रिपोर्ट तयार हुँदैछ...', 'info'); }
function generateResolutionReport() { showToast('फछ्रयौट रिपोर्ट तयार हुँदैछ...', 'info'); }
function generateTimelinessReport() { showToast('समयानुसार रिपोर्ट तयार हुँदैछ...', 'info'); }
function generateUserActivityReport() { showToast('प्रयोगकर्ता गतिविधि रिपोर्ट तयार हुँदैछ...', 'info'); }
function exportSystemReport() { showToast('प्रणाली रिपोर्ट डाउनलोड हुँदैछ...', 'info'); }

// ==================== UI HELPER FUNCTIONS ====================
function openAdminLogin() {
  document.getElementById('loginPageTitle').textContent = 'एडमिन लग-इन';
  document.getElementById('loginPageSubtitle').textContent = 'युजरनेम र पासवर्ड प्रविष्ट गर्नुहोस्';
  showPage('loginPage');
}

function openReports() {
  showPage('loginPage');
  document.getElementById('loginPageTitle').textContent = 'रिपोर्ट एक्सेस';
  document.getElementById('loginPageSubtitle').textContent = 'रिपोर्ट हेर्न लग-इन गर्नुहोस्';
}

function openSettings() {
  showPage('loginPage');
  document.getElementById('loginPageTitle').textContent = 'सेटिङ एक्सेस';
  document.getElementById('loginPageSubtitle').textContent = 'सेटिङहरू परिवर्तन गर्न लग-इन गर्नुहोस्';
}

// ==================== INITIALIZATION APP ====================
// ==================== INITIALIZE APP - FIXED ====================
// ==================== INITIALIZE APP - ULTIMATE FIXED VERSION ====================
// ==================== INITIALIZE APP - ULTIMATE FIXED VERSION (COPY THIS ENTIRE FUNCTION) ====================
async function initializeApp() {
  console.log('%c🚀 ===== NVC APP INITIALIZING =====', 'color: blue; font-size: 16px; font-weight: bold');
  
  // Prevent multiple initializations
  if (window._appInitialized) {
    console.log('⚠️ App already initialized');
    return;
  }
  
  window._appInitializing = true;
  showLoadingIndicator(true);
  
  // Initialize state arrays
  if (!state.complaints) state.complaints = [];
  if (!state.projects) state.projects = [];
  if (!state.employeeMonitoring) state.employeeMonitoring = [];
  if (!state.citizenCharters) state.citizenCharters = [];
  if (!state.pagination) {
    state.pagination = {
      currentPage: 1,
      itemsPerPage: 10
    };
  }
  
  // Load from localStorage immediately (fast)
  try {
    const savedComplaints = localStorage.getItem('nvc_complaints_backup');
    if (savedComplaints) {
      state.complaints = JSON.parse(savedComplaints);
      console.log(`✅ Loaded ${state.complaints.length} complaints from localStorage`);
    }
    
    const savedProjects = localStorage.getItem('nvc_projects_backup');
    if (savedProjects) {
      state.projects = JSON.parse(savedProjects);
      console.log(`✅ Loaded ${state.projects.length} projects from localStorage`);
    }
    
    const savedEmp = localStorage.getItem('nvc_employee_backup');
    if (savedEmp) {
      state.employeeMonitoring = JSON.parse(savedEmp);
      console.log(`✅ Loaded ${state.employeeMonitoring.length} employee records from localStorage`);
    }
    
    const savedCC = localStorage.getItem('nvc_citizen_backup');
    if (savedCC) {
      state.citizenCharters = JSON.parse(savedCC);
      console.log(`✅ Loaded ${state.citizenCharters.length} citizen charter records from localStorage`);
    }
  } catch (e) {
    console.warn('⚠️ Error loading from localStorage:', e);
  }
  
  // Check session
  const savedSession = localStorage.getItem('nvc_session');
  if (savedSession) {
    try {
      const session = JSON.parse(savedSession);
      if (session.expires > Date.now()) {
        state.currentUser = session.user;
        console.log('✅ Session restored for:', state.currentUser.name);
      } else {
        console.log('⏰ Session expired');
        localStorage.removeItem('nvc_session');
      }
    } catch (e) {
      console.error('❌ Session error:', e);
      localStorage.removeItem('nvc_session');
    }
  }
  
  // Show appropriate page
  if (state.currentUser) {
    showDashboardPage();
  } else {
    showPage('mainPage');
  }
  
  // Load from Google Sheets (async - पछि लोड हुनेछ)
  if (GOOGLE_SHEETS_CONFIG.ENABLED && 
      GOOGLE_SHEETS_CONFIG.WEB_APP_URL && 
      GOOGLE_SHEETS_CONFIG.WEB_APP_URL.includes('script.google.com')) {
    
    setTimeout(async () => {
      console.log('📡 Loading from Google Sheets...');
      const loaded = await loadDataFromGoogleSheets(true);
      if (loaded) {
        console.log('✅ Google Sheets data loaded');
        // UI already updated by loadDataFromGoogleSheets
      } else {
        console.log('⚠️ Using localStorage data');
      }
    }, 1000);
  } else {
    console.log('ℹ️ Google Sheets not configured properly');
  }
  
  // Initialize UI components
  setTimeout(() => {
    updateDateTime();
    updateNepaliDate();
    setInterval(updateDateTime, 60000);
    setInterval(updateNepaliDate, 60000);
    
    addGoogleSheetsButtons();
    addRefreshButton();
    updateSyncButton();
    
    initializeDatepickers();
  }, 500);
  
  window._appInitialized = true;
  window._appInitializing = false;
  showLoadingIndicator(false);
  
  console.log('%c🏁 ===== NVC APP INITIALIZED =====', 'color: green; font-size: 16px; font-weight: bold');
  console.log('📊 Final stats:', {
    complaints: state.complaints.length,
    projects: state.projects.length,
    employeeMonitoring: state.employeeMonitoring.length,
    citizenCharters: state.citizenCharters.length,
    user: state.currentUser?.name || 'Not logged in'
  });
}

// ==================== WINDOW ONLOAD - ENSURE INITIALIZATION ====================
window.onload = function() {
  console.log('🚀 window.onload triggered');
  
  // Hide loading indicator if visible
  if (typeof showLoadingIndicator === 'function') {
    showLoadingIndicator(false);
  }
  
  // Initialize app if not already initialized
  if (!window._appInitialized && !window._appInitializing) {
    initializeApp();
  }
};

// ==================== DOM CONTENT LOADED - BACKUP INIT ====================
document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 DOMContentLoaded triggered');
  
  // Only initialize if not already done by window.onload
  if (!window._appInitialized && !window._appInitializing) {
    setTimeout(() => {
      if (!window._appInitialized && !window._appInitializing) {
        initializeApp();
      }
    }, 100);
  }
});

// ==================== REFRESH DATA FUNCTION ====================
async function refreshData() {
  console.log('🔄 refreshData() called');
  
  if (!state.currentUser) {
    showToast('कृपया पहिला लगइन गर्नुहोस्', 'warning');
    return false;
  }
  
  showLoadingIndicator(true);
  showToast('🔄 डाटा रिफ्रेस हुँदैछ...', 'info');
  
  try {
    // Clear loading flag
    window._isLoadingData = false;
    
    // Force reload from Google Sheets
    const loaded = await loadDataFromGoogleSheets(true);
    
    if (loaded) {
      showToast(`✅ ${state.complaints.length} उजुरीहरू लोड भयो`, 'success');
      
      // Update current view
      if (state.currentView === 'complaints' || state.currentView === 'all_complaints') {
        showComplaintsView();
      } else if (state.currentView === 'dashboard' || state.currentPage === 'dashboardPage') {
        if (typeof updateStats === 'function') updateStats();
        if (typeof initializeDashboardCharts === 'function') {
          setTimeout(() => {
            destroyAllCharts();
            initializeDashboardCharts();
          }, 300);
        }
      } else if (state.currentView === 'technical_projects') {
        showTechnicalProjectsView();
      } else if (state.currentView === 'employee_monitoring') {
        showEmployeeMonitoringView();
      } else if (state.currentView === 'citizen_charter') {
        showCitizenCharterView();
      }
      
      return true;
    } else {
      showToast('⚠️ डाटा लोड हुन सकेन', 'warning');
      return false;
    }
  } catch (error) {
    console.error('❌ Refresh error:', error);
    showToast('❌ रिफ्रेस गर्दा त्रुटि', 'error');
    return false;
  } finally {
    showLoadingIndicator(false);
  }
}

// ==================== ADD REFRESH BUTTON ====================
function addRefreshButton() {
  const topbar = document.querySelector('.d-flex.align-center.gap-2, .user-info, .topbar-right, .header-right');
  if (!topbar) {
    console.warn('⚠️ Topbar not found for refresh button');
    return;
  }
  
  if (!document.getElementById('refreshDataBtn')) {
    const refreshBtn = document.createElement('button');
    refreshBtn.id = 'refreshDataBtn';
    refreshBtn.className = 'btn btn-sm btn-outline-primary ms-2';
    refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Refresh';
    refreshBtn.addEventListener('click', refreshData);
    refreshBtn.title = 'Google Sheets बाट डाटा रिफ्रेस गर्नुहोस्';
    topbar.appendChild(refreshBtn);
    console.log('✅ Refresh button added');
  }
}

// ==================== CHECK APP STATUS ====================
function checkAppStatus() {
  console.log('📊 App Status:');
  console.log('- Initialized:', window._appInitialized);
  console.log('- Initializing:', window._appInitializing);
  console.log('- Sheets Loaded:', window._sheetsLoaded);
  console.log('- User:', state.currentUser?.name || 'Not logged in');
  console.log('- Page:', state.currentPage);
  console.log('- View:', state.currentView);
  console.log('- Complaints:', state.complaints?.length || 0);
  console.log('- Projects:', state.projects?.length || 0);
  console.log('- Employee Monitoring:', state.employeeMonitoring?.length || 0);
  console.log('- Citizen Charters:', state.citizenCharters?.length || 0);
  console.log('- Config URL:', GOOGLE_SHEETS_CONFIG.WEB_APP_URL);
  console.log('- Config Enabled:', GOOGLE_SHEETS_CONFIG.ENABLED);
  
  return {
    initialized: window._appInitialized,
    sheetsLoaded: window._sheetsLoaded,
    user: state.currentUser?.name,
    complaints: state.complaints?.length,
    url: GOOGLE_SHEETS_CONFIG.WEB_APP_URL
  };
}

// ==================== FORCE REINITIALIZE ====================
async function reinitializeApp() {
  console.log('🔄 Force reinitializing app...');
  
  // Reset flags
  window._appInitialized = false;
  window._appInitializing = false;
  window._isLoadingData = false;
  
  // Clear intervals
  if (window.nvcAutoSyncInterval) {
    clearInterval(window.nvcAutoSyncInterval);
  }
  
  // Reinitialize
  return await initializeApp();
}

// ==================== OVERRIDES ====================
const originalShowDashboardPage = window.showDashboardPage;
window.showDashboardPage = function() {
  if (originalShowDashboardPage) originalShowDashboardPage.apply(this, arguments);
  setTimeout(addGoogleSheetsButtons, 500);
};

// ==================== DOM CONTENT LOADED ====================
document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 NVC App DOM Content Loaded');
  
  ensureStylesheetsLoaded();
  
  setTimeout(() => { initializeApp(); }, 100);
  
  updateDateTime();
  updateNepaliDate();
  setInterval(updateDateTime, 60000);
  setInterval(updateNepaliDate, 60000);
  
  setTimeout(initializeDatepickers, 500);
  setTimeout(addGoogleSheetsButtons, 2000);
});