/** Experience, education and skills. Source: resume + VJTI semester grade reports. */

export type Role = {
  id: string
  org: string
  place: string
  title: string
  unit: string
  start: string // YYYY-MM
  end: string // YYYY-MM (inclusive)
  label: string
  headline: string
  points: string[]
  link?: { to: string; label: string }
}

export const experience: Role[] = [
  {
    id: 'iitb-2026',
    org: 'IIT Bombay',
    place: 'Mumbai',
    title: 'IoT Research Intern',
    unit: 'Machine Intelligence Program',
    start: '2026-06',
    end: '2026-07',
    label: 'June – July 2026',
    headline: 'Proposed ParkinSense and built it, firmware to dashboard, within the internship.',
    points: [
      'Independently conceived, pitched and built ParkinSense, a wearable continuous monitoring platform for Parkinson’s disease, from concept to a working end-to-end prototype: firmware, BLE protocol, real-time signal processing and dashboard.',
      'Extended the lab’s nRF52840 / BLE IMU work into a three-pipeline architecture (motion, PPG / cardiac, activity) fusing inertial and optical sensing on one synchronised 104 Hz stream.',
      'Replaced offline, single-axis tremor analysis with real-time, multi-axis, motion-context-aware detection.',
      'Replaced isolated activity tracking with a step counter cross-gated against tremor and handling artefacts, and single-channel monitoring with a motion-aware confidence model linking cardiac and activity readings to tremor state.',
    ],
    link: { to: '/work/parkinsense', label: 'ParkinSense case study' },
  },
  {
    id: 'scientechnic-2025',
    org: 'Scientechnic',
    place: 'Dubai',
    title: 'Project Engineering Intern',
    unit: 'Building Technologies',
    start: '2025-06',
    end: '2025-07',
    label: 'June – July 2025',
    headline: 'Commissioned KNX lighting at Amazon DXB30 and selected DDC controllers for live BMS projects.',
    points: [
      'Implemented, tested and commissioned a KNX lighting control system at the Amazon DXB30 Innovation Hub, Dubai Internet City: actuator configuration, addressing and line diagnostics on a central monitoring system.',
      'Designed initial I/O schedules (AI, DI, AO, DO) and carried out DDC selection for BMS projects including Burj Binghatti Jacob & Co. Residences and GEMS Founders School, working from equipment schedules, load demand, spare margins and peripheral requirements.',
      'Assisted in AV system design against client requirements: use case, venue acoustics, display sizing, and integration with lighting and BMS.',
      'Worked hands-on with professional AV components (DSPs, matrix switchers, amplifiers, speakers, control processors) and studied AV-over-IP routing and network infrastructure.',
    ],
  },
  {
    id: 'iitb-2025',
    org: 'IIT Bombay',
    place: 'Mumbai',
    title: 'IoT Research Intern',
    unit: 'Machine Intelligence Program',
    start: '2025-02',
    end: '2025-05',
    label: 'Feb – May 2025',
    headline: 'Helped move an EMI-prone serial link on a V-Guard pump project to wireless UDP.',
    points: [
      'Worked with nRF52840 Sense and ESP32 for high-rate IMU acquisition and optimised BLE transfer for IoT applications.',
      'Collaborated on an industrial project with V-Guard collecting MPU data from submerged pumps.',
      'Investigated recurring EMI disruptions on the existing serial link over a waterproof cable, and helped move the system to UDP-based wireless transmission, which improved reliability and throughput under interference.',
      'Supported testing and validation of the wireless system for consistent real-time retrieval under operating conditions.',
    ],
  },
]

export const semesters = [
  { n: 'I', sgpa: 8.95, cgpa: 8.95 },
  { n: 'II', sgpa: 9.59, cgpa: 9.27 },
  { n: 'III', sgpa: 8.87, cgpa: 9.13 },
  { n: 'IV', sgpa: 9.52, cgpa: 9.23 },
  { n: 'V', sgpa: 9.17, cgpa: 9.22 },
  { n: 'VI', sgpa: 8.92, cgpa: 9.17 },
] as const

export const education = {
  school: 'Veermata Jijabai Technological Institute',
  short: 'VJTI',
  city: 'Mumbai',
  degree: 'Bachelor of Technology',
  branch: 'Electronics & Telecommunication Engineering',
  minor: 'Artificial Intelligence & Machine Learning',
  graduation: 'June 2027',
  cgpa: 9.17,
  creditsEarned: 138,
  standing: 'Academic branch topper, first year',
}

export const skills = [
  { group: 'Languages', items: ['C', 'C++', 'Python', 'SQL'] },
  { group: 'Embedded toolchains', items: ['Arduino IDE', 'ESP-IDF'] },
  { group: 'ML & data', items: ['OpenCV', 'NumPy', 'Pandas', 'Excel'] },
  { group: 'CAD', items: ['AutoCAD'] },
  { group: 'Operating systems', items: ['Linux', 'Windows', 'macOS'] },
]

/** Domain × project matrix. Every mark is backed by a resume line. */
export const domainColumns = [
  { key: 'ps', label: 'ParkinSense', to: '/work/parkinsense' },
  { key: 'ts', label: 'TremoSense', to: '/work/tremosense' },
  { key: 'ns', label: 'NaviSight', to: '/work/navisight' },
  { key: 'rl', label: 'RL Car', to: '/work/rl-autonomous-car' },
  { key: 'we', label: 'Wall-E', to: '/work/wall-e' },
  { key: 'tr', label: 'Traffic', to: '/work/traffic-management' },
  { key: 'iitb', label: 'IIT Bombay ’25', to: '/experience' },
  { key: 'sci', label: 'Scientechnic', to: '/experience' },
] as const

type ColKey = (typeof domainColumns)[number]['key']

export const domains: { name: string; note: string; in: ColKey[] }[] = [
  { name: 'Embedded firmware', note: 'Zephyr RTOS, nRF52840, ESP32, Arduino', in: ['ps', 'ts', 'ns', 'we', 'iitb'] },
  { name: 'Wireless links', note: 'BLE packets, UDP, Bluetooth, GPS', in: ['ps', 'ns', 'iitb'] },
  { name: 'Signal processing', note: 'Filters, peak detection, HRV, SQI', in: ['ps', 'ts'] },
  { name: 'Estimation & control', note: 'EKF, LQR, PID', in: ['ts', 'we'] },
  { name: 'Machine learning & vision', note: 'TensorFlow Lite, YOLOv8, OCR, Q-learning, DQN', in: ['ns', 'rl', 'tr'] },
  { name: 'Robotics', note: 'Balancing, line following', in: ['we'] },
  { name: 'Building systems', note: 'KNX, BMS, DDC, AV-over-IP', in: ['sci'] },
]

export const extras = [
  { title: 'Academic branch topper', detail: 'First year, EXTC, VJTI' },
  { title: 'Technovanza organising team', detail: 'VJTI’s technical festival, 2024. 4,000–5,000 participants' },
  { title: 'Society of Robotics and Automation', detail: 'Member; workshops and the Wall-E build' },
  { title: 'Guitar', detail: 'Performed at college cultural programmes and events' },
]

/**
 * Areas of interest, ordered as layers of a system from the chip up.
 * These are fields Pranshu wants to work in or explore; they are not claimed expertise and are not ranked.
 */
export const interestLayers = [
  { layer: 'Silicon', items: ['VLSI', 'Semiconductor design', 'Digital design', 'ASIC / FPGA'] },
  { layer: 'Hardware', items: ['Electronics', 'Hardware', 'Embedded systems', 'IoT'] },
  { layer: 'Signals & control', items: ['Signal processing', 'Control systems', 'Robotics'] },
  { layer: 'Intelligence', items: ['AI / ML', 'Edge AI'] },
  { layer: 'Systems', items: ['Systems engineering', 'Research', 'Technical consulting', 'Technology consulting'] },
]

/** The signal chain: the path every project on the site runs along. Examples are all from documented work. */
export const signalChain = [
  { stage: 'Physical signal', eg: 'Tremor, pulse, reflected light, obstacles' },
  { stage: 'Sensing', eg: 'LSM6DS3 IMU, MAX30102 PPG, ultrasonic, cameras' },
  { stage: 'Electronics', eg: 'Servo PWM drive, SRA board, KNX and BMS I/O' },
  { stage: 'Firmware', eg: 'Zephyr RTOS, nRF52840, ESP32, ESP-IDF' },
  { stage: 'Communication', eg: '248-byte BLE packets, UDP, Bluetooth, GPS' },
  { stage: 'Processing', eg: 'Notch and band-pass filters, EKF, SQI, peak detection' },
  { stage: 'Intelligence', eg: 'State machines, TensorFlow Lite, YOLOv8, Q-learning' },
  { stage: 'Decision', eg: 'LQR, PID, tremor state, haptic alerts' },
]
